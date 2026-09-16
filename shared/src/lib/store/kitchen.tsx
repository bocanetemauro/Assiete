"use client";

/**
 * Centrale client-store. De UI praat alleen met deze hook; onder water loopt
 * alles via Supabase: authenticatie, profielen, favorieten, gekookte gerechten
 * en eigen recepten. Recepten van het platform komen uit `@/lib/data` — dezelfde
 * inhoud en dezelfde ID's als in de database — zodat de site ook zonder account
 * volledig te lezen is.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Category, CookedEntry, KitchenStats, RecipeDetail, RecipeDraft, User } from "@/lib/types";
import { PLATFORM_RECIPES, getDailyRecipes } from "@/lib/data";
import { IS_NATIVE_APP, nativeAuthRedirect } from "@/lib/native";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchCooked, fetchUserRecipes, photoUrl, toCookedEntry, toUser, type CookedRow } from "@/lib/supabase/queries";
import { ensureStoredPhoto } from "@/lib/services/photos";
import { normalizeUsername, usernameProblem, usernameSaveError } from "@/lib/username";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type SignUpResult = { ok: true; needsConfirmation: boolean } | { ok: false; error: string };
export type SignInResult = { ok: true } | { ok: false; error: string; needsConfirmation?: boolean };

export interface KitchenContextValue {
  ready: boolean;
  user: User | null;
  recipes: RecipeDetail[];
  dailyRecipes: RecipeDetail[];
  getRecipe: (slugOrId: string) => RecipeDetail | undefined;

  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (input: { name: string; username: string; email: string; password: string }) => Promise<SignUpResult>;
  resendConfirmation: (email: string) => Promise<ActionResult>;
  requestPasswordReset: (email: string) => Promise<ActionResult>;
  updatePassword: (password: string) => Promise<ActionResult>;
  signOut: () => Promise<void>;
  updateProfile: (patch: { name?: string; username?: string; bio?: string | null; avatarUrl?: string | null }) => Promise<ActionResult>;

  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => Promise<boolean>;
  isCookAgain: (recipeId: string) => boolean;
  toggleCookAgain: (recipeId: string) => Promise<boolean>;
  favorites: RecipeDetail[];
  cookAgain: RecipeDetail[];

  cooked: CookedEntry[];
  cookedFor: (recipeId: string) => CookedEntry[];
  logCooked: (input: { recipeId: string; title?: string | null; note: string; photoUrl: string | null; durationMinutes?: number }) => Promise<CookedEntry | null>;
  deleteCooked: (id: string) => Promise<void>;

  myRecipes: RecipeDetail[];
  saveRecipe: (draft: RecipeDraft, existingId?: string) => Promise<RecipeDetail | null>;
  deleteRecipe: (id: string) => Promise<void>;

  stats: KitchenStats;
  error: string | null;
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

const monthLabel = new Intl.DateTimeFormat("nl-NL", { month: "short" });
const NOT_CONFIGURED = "De verbinding met de server is nog niet ingesteld. Recepten lezen kan wel, een account maken nog niet.";

/** Supabase-foutmeldingen omzetten naar begrijpelijk Nederlands. */
function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Dit e-mailadres en wachtwoord horen niet bij elkaar.";
  if (m.includes("email not confirmed")) return "Bevestig eerst je e-mailadres. Kijk in je mailbox voor de link.";
  if (m.includes("already registered")) return "Er bestaat al een account met dit e-mailadres.";
  if (m.includes("password should be at least")) return "Kies een wachtwoord van minstens 8 tekens.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "Dit e-mailadres lijkt niet te kloppen.";
  if (m.includes("for security purposes") || m.includes("rate limit") || m.includes("too many")) return "Even geduld: je hebt dit net al geprobeerd. Wacht een minuut en probeer opnieuw.";
  if (m.includes("weak password")) return "Dit wachtwoord is te makkelijk te raden. Kies iets langers.";
  if (m.includes("same password")) return "Kies een ander wachtwoord dan je vorige.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Geen verbinding met de server. Controleer je internet en probeer opnieuw.";
  return message;
}

function validateName(name: string): string | null {
  return name.trim().length < 2 ? "Vul je naam in (minstens 2 tekens)." : null;
}
function validateEmail(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? null : "Vul een geldig e-mailadres in.";
}
function validatePassword(password: string): string | null {
  return password.length < 8 ? "Kies een wachtwoord van minstens 8 tekens." : null;
}

function redirectTo(next: string) {
  if (typeof window === "undefined") return undefined;
  // In de app opent de link uit de e-mail de app zelf (deeplink); op het web de site.
  if (IS_NATIVE_APP) return nativeAuthRedirect(next);
  return `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;
}

export function KitchenProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dbRecipes, setDbRecipes] = useState<RecipeDetail[]>([]);
  const [saved, setSaved] = useState<{ recipe_id: string; kind: "favorite" | "cook_again"; created_at: string }[]>([]);
  const [cookedRows, setCookedRows] = useState<CookedRow[]>([]);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  /* ---------------- sessie ---------------- */
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    let active = true;

    const readProfile = async (authUser: { id: string; email?: string | null; created_at?: string; email_confirmed_at?: string | null }) => {
      const { data } = await supabase.from("profiles").select("display_name, username, bio, avatar_url").eq("id", authUser.id).maybeSingle();
      if (active) setUser(toUser(authUser, data));
    };

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session?.user) await readProfile(data.session.user);
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (session?.user) void readProfile(session.user);
      else if (event === "SIGNED_OUT") setUser(null);
      setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  /* ---------------- data van de gebruiker ---------------- */
  const refresh = useCallback(async () => {
    if (!supabase) return;
    const id = userRef.current?.id ?? null;
    try {
      const savedPromise = id
        ? supabase
            .from("saved_recipes")
            .select("recipe_id, kind, created_at")
            .eq("user_id", id)
            .then(({ data, error: e }) => {
              if (e) throw e;
              return data ?? [];
            })
        : Promise.resolve([]);

      const [recipes, savedRows, cooked] = await Promise.all([
        fetchUserRecipes(supabase, id),
        savedPromise,
        id ? fetchCooked(supabase, id) : Promise.resolve([] as CookedRow[]),
      ]);

      setDbRecipes(recipes);
      setSaved(savedRows as { recipe_id: string; kind: "favorite" | "cook_again"; created_at: string }[]);
      setCookedRows(cooked);
      setError(null);
    } catch (e) {
      setError(translateError(e instanceof Error ? e.message : "Er ging iets mis bij het laden."));
    }
  }, [supabase]);

  useEffect(() => {
    if (!ready) return;
    void refresh();
  }, [ready, user?.id, refresh]);

  /* ---------------- recepten ---------------- */
  const recipes = useMemo(() => {
    const platformIds = new Set(PLATFORM_RECIPES.map((r) => r.id));
    return [...PLATFORM_RECIPES, ...dbRecipes.filter((r) => !platformIds.has(r.id))];
  }, [dbRecipes]);

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

  /* ---------------- authenticatie ---------------- */
  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      if (!supabase) return { ok: false, error: NOT_CONFIGURED };
      const invalid = validateEmail(email);
      if (invalid) return { ok: false, error: invalid };
      const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (e) return { ok: false, error: translateError(e.message), needsConfirmation: e.message.toLowerCase().includes("email not confirmed") };
      return { ok: true };
    },
    [supabase],
  );

  const signUp = useCallback(
    async ({ name, username, email, password }: { name: string; username: string; email: string; password: string }): Promise<SignUpResult> => {
      if (!supabase) return { ok: false, error: NOT_CONFIGURED };
      const invalid = validateName(name) ?? usernameProblem(username) ?? validateEmail(email) ?? validatePassword(password);
      if (invalid) return { ok: false, error: invalid };
      // Username vooraf controleren: de database houdt hem uniek, maar zo krijg je meteen uitleg.
      const { data: available, error: check } = await supabase.rpc("username_available", { p_username: normalizeUsername(username) });
      if (check) return { ok: false, error: translateError(check.message) };
      if (available !== true) return { ok: false, error: "Deze username is al bezet. Kies een andere." };
      const { data, error: e } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: name.trim(), username: normalizeUsername(username) }, emailRedirectTo: redirectTo("/profiel?welkom=1") },
      });
      if (e) return { ok: false, error: translateError(e.message) };
      // Zonder sessie is er een bevestigingsmail verstuurd.
      return { ok: true, needsConfirmation: !data.session };
    },
    [supabase],
  );

  const resendConfirmation = useCallback(
    async (email: string): Promise<ActionResult> => {
      if (!supabase) return { ok: false, error: NOT_CONFIGURED };
      const invalid = validateEmail(email);
      if (invalid) return { ok: false, error: invalid };
      const { error: e } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: redirectTo("/profiel?welkom=1") },
      });
      return e ? { ok: false, error: translateError(e.message) } : { ok: true };
    },
    [supabase],
  );

  const requestPasswordReset = useCallback(
    async (email: string): Promise<ActionResult> => {
      if (!supabase) return { ok: false, error: NOT_CONFIGURED };
      const invalid = validateEmail(email);
      if (invalid) return { ok: false, error: invalid };
      const { error: e } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectTo("/wachtwoord-herstellen") });
      return e ? { ok: false, error: translateError(e.message) } : { ok: true };
    },
    [supabase],
  );

  const updatePassword = useCallback(
    async (password: string): Promise<ActionResult> => {
      if (!supabase) return { ok: false, error: NOT_CONFIGURED };
      const invalid = validatePassword(password);
      if (invalid) return { ok: false, error: invalid };
      const { error: e } = await supabase.auth.updateUser({ password });
      return e ? { ok: false, error: translateError(e.message) } : { ok: true };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setUser(null);
    setSaved([]);
    setCookedRows([]);
  }, [supabase]);

  const updateProfile = useCallback(
    async (patch: { name?: string; username?: string; bio?: string | null; avatarUrl?: string | null }): Promise<ActionResult> => {
      if (!supabase || !user) return { ok: false, error: "Log eerst in." };
      const row: Record<string, string | null> = {};
      if (patch.name !== undefined) {
        const invalid = validateName(patch.name);
        if (invalid) return { ok: false, error: invalid };
        row.display_name = patch.name.trim().slice(0, 80);
      }
      if (patch.username !== undefined) {
        const invalid = usernameProblem(patch.username);
        if (invalid) return { ok: false, error: invalid };
        row.username = normalizeUsername(patch.username);
      }
      if (patch.bio !== undefined) row.bio = patch.bio ? patch.bio.slice(0, 300) : null;
      if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl ? await ensureStoredPhoto(supabase, user.id, patch.avatarUrl) : null;

      const { error: e } = await supabase.from("profiles").update(row).eq("id", user.id);
      if (e) return { ok: false, error: usernameSaveError(e) ?? translateError(e.message) };

      setUser((current) =>
        current
          ? {
              ...current,
              ...(row.display_name !== undefined ? { name: row.display_name as string } : {}),
              ...(row.username !== undefined ? { username: row.username } : {}),
              ...(row.bio !== undefined ? { bio: row.bio } : {}),
              ...(row.avatar_url !== undefined ? { avatarUrl: photoUrl(row.avatar_url) } : {}),
            }
          : current,
      );
      return { ok: true };
    },
    [supabase, user],
  );

  /* ---------------- favorieten ---------------- */
  const isFavorite = useCallback((id: string) => saved.some((s) => s.recipe_id === id && s.kind === "favorite"), [saved]);
  const isCookAgain = useCallback((id: string) => saved.some((s) => s.recipe_id === id && s.kind === "cook_again"), [saved]);

  const toggleKind = useCallback(
    async (recipeId: string, kind: "favorite" | "cook_again") => {
      if (!supabase || !user) return false;
      const active = saved.some((s) => s.recipe_id === recipeId && s.kind === kind);
      const next = !active;
      // Optimistisch: de knop reageert direct; bij een fout draaien we terug.
      setSaved((current) =>
        next
          ? [{ recipe_id: recipeId, kind, created_at: new Date().toISOString() }, ...current]
          : current.filter((s) => !(s.recipe_id === recipeId && s.kind === kind)),
      );
      const { error: e } = next
        ? await supabase.from("saved_recipes").insert({ user_id: user.id, recipe_id: recipeId, kind })
        : await supabase.from("saved_recipes").delete().eq("user_id", user.id).eq("recipe_id", recipeId).eq("kind", kind);
      if (e) {
        setError(translateError(e.message));
        void refresh();
        return active;
      }
      return next;
    },
    [supabase, user, saved, refresh],
  );

  const toggleFavorite = useCallback((id: string) => toggleKind(id, "favorite"), [toggleKind]);
  const toggleCookAgain = useCallback((id: string) => toggleKind(id, "cook_again"), [toggleKind]);

  const savedOf = useCallback(
    (kind: "favorite" | "cook_again") =>
      saved
        .filter((s) => s.kind === kind)
        .slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((s) => recipeIndex.get(s.recipe_id))
        .filter((r): r is RecipeDetail => Boolean(r)),
    [saved, recipeIndex],
  );
  const favorites = useMemo(() => savedOf("favorite"), [savedOf]);
  const cookAgain = useMemo(() => savedOf("cook_again"), [savedOf]);

  /* ---------------- gekookte gerechten ---------------- */
  const cooked = useMemo(
    () =>
      cookedRows
        .map((row) => {
          const recipe = recipeIndex.get(row.recipe_id);
          return recipe ? toCookedEntry(row, recipe) : null;
        })
        .filter((c): c is CookedEntry => Boolean(c)),
    [cookedRows, recipeIndex],
  );
  const cookedFor = useCallback((recipeId: string) => cooked.filter((c) => c.recipe.id === recipeId), [cooked]);

  const logCooked = useCallback(
    async ({
      recipeId,
      title,
      note,
      photoUrl: photo,
      durationMinutes,
    }: {
      recipeId: string;
      title?: string | null;
      note: string;
      photoUrl: string | null;
      durationMinutes?: number;
    }) => {
      if (!supabase || !user) return null;
      const recipe = getRecipe(recipeId);
      if (!recipe) return null;
      try {
        const { data, error: e } = await supabase
          .from("cooked_recipes")
          .insert({
            user_id: user.id,
            recipe_id: recipe.id,
            title: title && title.trim() ? title.trim().slice(0, 80) : null,
            note: note.trim() ? note.trim().slice(0, 500) : null,
            duration_minutes: Math.min(4320, Math.max(1, durationMinutes ?? recipe.totalMinutes)),
          })
          .select("id, recipe_id, title, note, duration_minutes, cooked_at")
          .single();
        if (e) throw e;

        let storagePath: string | null = null;
        if (photo) {
          storagePath = await ensureStoredPhoto(supabase, user.id, photo);
          if (storagePath) {
            const { error: imageError } = await supabase.from("recipe_images").insert({
              user_id: user.id,
              cooked_recipe_id: data.id,
              kind: "cooked",
              storage_path: storagePath,
              alt: recipe.title.slice(0, 200),
            });
            if (imageError) throw imageError;
          }
        }

        const row: CookedRow = { ...data, recipe_images: storagePath ? [{ storage_path: storagePath, kind: "cooked" }] : [] };
        setCookedRows((current) => [row, ...current]);
        setError(null);
        return toCookedEntry(row, recipe);
      } catch (err) {
        setError(translateError(err instanceof Error ? err.message : "Je gerecht kon niet worden opgeslagen."));
        return null;
      }
    },
    [supabase, user, getRecipe],
  );

  const deleteCooked = useCallback(
    async (id: string) => {
      if (!supabase || !user) return;
      setCookedRows((current) => current.filter((c) => c.id !== id));
      const { error: e } = await supabase.from("cooked_recipes").delete().eq("id", id).eq("user_id", user.id);
      if (e) {
        setError(translateError(e.message));
        void refresh();
      }
    },
    [supabase, user, refresh],
  );

  /* ---------------- eigen recepten ---------------- */
  const myRecipes = useMemo(() => (user ? dbRecipes.filter((r) => r.author?.id === user.id) : []), [dbRecipes, user]);

  const saveRecipe = useCallback(
    async (draft: RecipeDraft, existingId?: string): Promise<RecipeDetail | null> => {
      if (!supabase || !user) return null;
      try {
        const photos: string[] = [];
        for (const photo of draft.photos.slice(0, 8)) {
          const path = await ensureStoredPhoto(supabase, user.id, photo);
          if (path) photos.push(path);
        }

        const steps: Record<string, unknown>[] = [];
        for (const step of draft.steps) {
          if (!step.title.trim() && !step.body.trim()) continue;
          const imagePath = step.imageUrl ? await ensureStoredPhoto(supabase, user.id, step.imageUrl) : null;
          const minutes = Number(step.timerMinutes);
          steps.push({
            title: step.title,
            body: step.body,
            phase: "mise-en-place",
            scene: step.scene ? { key: step.scene } : null,
            timer_seconds: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes * 60) : null,
            image_path: imagePath,
          });
        }

        const payload = {
          slug_base: draft.title,
          is_public: draft.isPublic,
          title: draft.title.trim(),
          description: draft.description.trim(),
          course: draft.course,
          difficulty: draft.difficulty,
          servings: draft.servings,
          prep_minutes: draft.prepMinutes,
          cook_minutes: draft.cookMinutes,
          categories: draft.categories,
          tags: [] as string[],
          equipment: draft.equipment
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean),
          plating_notes: draft.platingNotes,
          chef_tip: draft.chefTip,
          ingredients: draft.ingredients
            .filter((i) => i.name.trim())
            .map((i) => ({ name: i.name.trim(), quantity: i.quantity.replace(",", "."), unit: i.unit.trim(), group: null, note: null })),
          steps,
          photos,
        };

        const { data, error: e } = await supabase.rpc("save_user_recipe", { p_payload: payload, p_recipe_id: existingId ?? null });
        if (e) throw e;

        const savedId = (data as { id?: string } | null)?.id ?? null;
        const fresh = await fetchUserRecipes(supabase, user.id);
        setDbRecipes(fresh);
        setError(null);
        return fresh.find((r) => r.id === savedId) ?? null;
      } catch (err) {
        setError(translateError(err instanceof Error ? err.message : "Je recept kon niet worden opgeslagen."));
        return null;
      }
    },
    [supabase, user],
  );

  const deleteRecipe = useCallback(
    async (id: string) => {
      if (!supabase || !user) return;
      setDbRecipes((current) => current.filter((r) => r.id !== id));
      const { error: e } = await supabase.from("recipes").delete().eq("id", id).eq("author_id", user.id);
      if (e) {
        setError(translateError(e.message));
        void refresh();
      }
    },
    [supabase, user, refresh],
  );

  /* ---------------- statistieken ---------------- */
  const stats = useMemo<KitchenStats>(() => {
    if (!user) return EMPTY_STATS;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = cooked.filter((c) => new Date(c.cookedAt) >= monthStart);

    const tally = new Map<Category, number>();
    const add = (recipe: RecipeDetail | undefined, weight: number) => recipe?.categories.forEach((cat) => tally.set(cat, (tally.get(cat) ?? 0) + weight));
    cooked.forEach((c) => add(c.recipe, 2));
    favorites.forEach((r) => add(r, 1));

    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: monthLabel.format(d).replace(".", ""),
        count: cooked.filter((c) => {
          const cd = new Date(c.cookedAt);
          return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
        }).length,
      };
    });

    const days = new Set(cooked.map((c) => new Date(c.cookedAt).toDateString()));
    let streakDays = 0;
    const cursor = new Date(now);
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toDateString())) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return {
      cookedThisMonth: thisMonth.length,
      minutesThisMonth: thisMonth.reduce((sum, c) => sum + c.durationMinutes, 0),
      savedCount: favorites.length,
      ownRecipeCount: myRecipes.length,
      cookAgainCount: cookAgain.length,
      favoriteCategory: [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
      monthly,
      streakDays,
    };
  }, [user, cooked, favorites, cookAgain, myRecipes]);

  const value: KitchenContextValue = {
    ready,
    user,
    recipes,
    dailyRecipes,
    getRecipe,
    signIn,
    signUp,
    resendConfirmation,
    requestPasswordReset,
    updatePassword,
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
    error,
  };

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>;
}

export function useKitchen(): KitchenContextValue {
  const ctx = useContext(KitchenContext);
  if (!ctx) throw new Error("useKitchen moet binnen <KitchenProvider> gebruikt worden");
  return ctx;
}

export { isSupabaseConfigured };
