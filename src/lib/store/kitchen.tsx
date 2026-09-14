"use client";

/**
 * Centrale client-store. De UI praat alleen met deze hook; onder water gebruikt
 * hij de pure repository-functies en lokale opslag. Voor een echte backend
 * vervang je de implementatie van de acties door API-calls (bv. server actions).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CookedEntry, DatabaseState, KitchenStats, RecipeDetail, RecipeDraft, User } from "@/lib/types";
import { PLATFORM_RECIPES, getDailyRecipes } from "@/lib/data";
import {
  computeStats,
  cookedEntries,
  deleteCooked as deleteCookedRow,
  deleteUserRecipe,
  emptyDatabase,
  findUserByEmail,
  hasSaved,
  insertCooked,
  insertUser,
  listUserRecipes,
  patchUser,
  toUser,
  toggleSaved,
  upsertUserRecipe,
} from "@/lib/services/repository";
import { loadDatabase, saveDatabase, sessionStore } from "@/lib/services/storage";
import { hashPassword, validateEmail, validateName, validatePassword } from "@/lib/services/auth";
import { DEMO_USER_ID, seedDemo } from "@/lib/services/demo";

export type ActionResult = { ok: true } | { ok: false; error: string };

export interface KitchenContextValue {
  ready: boolean;
  user: User | null;
  recipes: RecipeDetail[];
  dailyRecipes: RecipeDetail[];
  getRecipe: (slugOrId: string) => RecipeDetail | undefined;

  signIn: (email: string, password: string) => Promise<ActionResult>;
  signUp: (input: { name: string; email: string; password: string }) => Promise<ActionResult>;
  signInDemo: () => void;
  signOut: () => void;
  updateProfile: (patch: { name?: string; bio?: string | null; avatarUrl?: string | null }) => void;

  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => boolean;
  isCookAgain: (recipeId: string) => boolean;
  toggleCookAgain: (recipeId: string) => boolean;
  favorites: RecipeDetail[];
  cookAgain: RecipeDetail[];

  cooked: CookedEntry[];
  cookedFor: (recipeId: string) => CookedEntry[];
  logCooked: (input: { recipeId: string; title?: string | null; note: string; photoUrl: string | null; durationMinutes?: number }) => CookedEntry | null;
  deleteCooked: (id: string) => void;

  myRecipes: RecipeDetail[];
  saveRecipe: (draft: RecipeDraft, existingId?: string) => RecipeDetail | null;
  deleteRecipe: (id: string) => void;

  stats: KitchenStats;
  storageError: string | null;
}

const KitchenContext = createContext<KitchenContextValue | null>(null);

const EMPTY_STATS: KitchenStats = {
  cookedThisMonth: 0,
  minutesThisMonth: 0,
  savedCount: 0,
  ownRecipeCount: 0,
  cookAgainCount: 0,
  favoriteCategory: null,
  monthly: [],
  streakDays: 0,
};

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DatabaseState>(emptyDatabase);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const dbRef = useRef(db);
  dbRef.current = db;

  useEffect(() => {
    let cancelled = false;
    loadDatabase().then((loaded) => {
      if (cancelled) return;
      const state = loaded ?? emptyDatabase();
      const session = sessionStore.get();
      setDb(state);
      setUserId(session && state.users.some((u) => u.id === session) ? session : null);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDatabase(db)
      .then(() => setStorageError(null))
      .catch(() => setStorageError("Je browser heeft geen opslagruimte meer. Verwijder oude foto's om nieuwe op te slaan."));
  }, [db, ready]);

  const userRow = userId ? db.users.find((u) => u.id === userId) : undefined;
  const user = useMemo(() => (userRow ? toUser(userRow) : null), [userRow]);

  const userRecipes = useMemo(() => listUserRecipes(db, { status: "published" }), [db]);
  const recipes = useMemo(() => [...PLATFORM_RECIPES, ...userRecipes], [userRecipes]);
  const recipeIndex = useMemo(() => {
    const map = new Map<string, RecipeDetail>();
    recipes.forEach((r) => {
      map.set(r.id, r);
      map.set(r.slug, r);
    });
    return map;
  }, [recipes]);
  const getRecipe = useCallback((key: string) => recipeIndex.get(key), [recipeIndex]);
  const dailyRecipes = useMemo(() => getDailyRecipes(), []);

  const setSession = (id: string | null) => {
    sessionStore.set(id);
    setUserId(id);
  };

  const signIn = useCallback(async (email: string, password: string): Promise<ActionResult> => {
    const emailError = validateEmail(email);
    if (emailError) return { ok: false, error: emailError };
    const row = findUserByEmail(dbRef.current, email);
    if (!row || !row.password_hash) return { ok: false, error: "We vonden geen account met deze gegevens." };
    const hash = await hashPassword(email, password);
    if (hash !== row.password_hash) return { ok: false, error: "Het wachtwoord klopt niet." };
    setSession(row.id);
    return { ok: true };
  }, []);

  const signUp = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }): Promise<ActionResult> => {
    const error = validateName(name) ?? validateEmail(email) ?? validatePassword(password);
    if (error) return { ok: false, error };
    if (findUserByEmail(dbRef.current, email)) return { ok: false, error: "Er bestaat al een account met dit e-mailadres." };
    const passwordHash = await hashPassword(email, password);
    const result = insertUser(dbRef.current, { name, email, passwordHash });
    setDb(result.db);
    setSession(result.user.id);
    return { ok: true };
  }, []);

  const signInDemo = useCallback(() => {
    setDb((current) => seedDemo(current));
    setSession(DEMO_USER_ID);
  }, []);

  const signOut = useCallback(() => setSession(null), []);

  const updateProfile = useCallback(
    (patch: { name?: string; bio?: string | null; avatarUrl?: string | null }) => {
      if (!userId) return;
      setDb((current) =>
        patchUser(current, userId, {
          ...(patch.name !== undefined ? { name: patch.name.trim() || "Chef" } : {}),
          ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
          ...(patch.avatarUrl !== undefined ? { avatar_url: patch.avatarUrl } : {}),
        }),
      );
    },
    [userId],
  );

  const isFavorite = useCallback((id: string) => Boolean(userId && hasSaved(db, userId, id, "favorite")), [db, userId]);
  const isCookAgain = useCallback((id: string) => Boolean(userId && hasSaved(db, userId, id, "cook_again")), [db, userId]);

  const toggleKind = useCallback(
    (recipeId: string, kind: "favorite" | "cook_again") => {
      if (!userId) return false;
      const result = toggleSaved(dbRef.current, userId, recipeId, kind);
      setDb(result.db);
      return result.active;
    },
    [userId],
  );
  const toggleFavorite = useCallback((id: string) => toggleKind(id, "favorite"), [toggleKind]);
  const toggleCookAgain = useCallback((id: string) => toggleKind(id, "cook_again"), [toggleKind]);

  const savedOf = useCallback(
    (kind: "favorite" | "cook_again") =>
      userId
        ? db.saved_recipes
            .filter((s) => s.user_id === userId && s.kind === kind)
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map((s) => recipeIndex.get(s.recipe_id))
            .filter((r): r is RecipeDetail => Boolean(r))
        : [],
    [db, userId, recipeIndex],
  );
  const favorites = useMemo(() => savedOf("favorite"), [savedOf]);
  const cookAgain = useMemo(() => savedOf("cook_again"), [savedOf]);

  const cooked = useMemo(() => (userId ? cookedEntries(db, userId, getRecipe) : []), [db, userId, getRecipe]);
  const cookedFor = useCallback((recipeId: string) => cooked.filter((c) => c.recipe.id === recipeId), [cooked]);

  const logCooked = useCallback(
    ({ recipeId, note, photoUrl, durationMinutes }: { recipeId: string; note: string; photoUrl: string | null; durationMinutes?: number }) => {
      if (!userId) return null;
      const recipe = getRecipe(recipeId);
      if (!recipe) return null;
      const result = insertCooked(dbRef.current, {
        userId,
        recipeId: recipe.id,
        note,
        photoUrl,
        durationMinutes: durationMinutes ?? recipe.totalMinutes,
      });
      setDb(result.db);
      return { id: result.row.id, recipe, note: result.row.note, photoUrl, durationMinutes: result.row.duration_minutes ?? recipe.totalMinutes, cookedAt: result.row.cooked_at };
    },
    [userId, getRecipe],
  );

  const deleteCooked = useCallback((id: string) => userId && setDb((current) => deleteCookedRow(current, userId, id)), [userId]);

  const myRecipes = useMemo(() => (userId ? listUserRecipes(db, { userId }) : []), [db, userId]);

  const saveRecipe = useCallback(
    (draft: RecipeDraft, existingId?: string) => {
      if (!userId) return null;
      const result = upsertUserRecipe(dbRef.current, userId, draft, existingId);
      setDb(result.db);
      const row = result.db.recipes.find((r) => r.id === result.recipeId);
      return row ? (listUserRecipes(result.db, { userId }).find((r) => r.id === row.id) ?? null) : null;
    },
    [userId],
  );

  const deleteRecipe = useCallback((id: string) => userId && setDb((current) => deleteUserRecipe(current, userId, id)), [userId]);

  const stats = useMemo(() => (userId ? computeStats(db, userId, getRecipe) : EMPTY_STATS), [db, userId, getRecipe]);

  const value: KitchenContextValue = {
    ready,
    user,
    recipes,
    dailyRecipes,
    getRecipe,
    signIn,
    signUp,
    signInDemo,
    signOut,
    updateProfile,
    isFavorite,
    toggleFavorite,
    isCookAgain,
    toggleCookAgain,
    favorites,
    cookAgain,
    cooked,
    cookedFor,
    logCooked,
    deleteCooked,
    myRecipes,
    saveRecipe,
    deleteRecipe,
    stats,
    storageError,
  };

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>;
}

export function useKitchen(): KitchenContextValue {
  const ctx = useContext(KitchenContext);
  if (!ctx) throw new Error("useKitchen moet binnen <KitchenProvider> gebruikt worden");
  return ctx;
}
