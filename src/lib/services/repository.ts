/**
 * Pure functies over de relationele `DatabaseState`. Elke mutatie geeft een
 * nieuwe state terug. De functienamen spiegelen de queries die je later tegen
 * een echte database (Postgres/Supabase) uitvoert.
 */

import type {
  Category,
  CookedEntry,
  CookedRecipeRow,
  DatabaseState,
  KitchenStats,
  RecipeDetail,
  RecipeDraft,
  RecipeImageRow,
  RecipeRow,
  SavedKind,
  User,
  UserRow,
} from "@/lib/types";
import { SCENE_TO_PHASE } from "@/lib/constants";
import { createId, slugify } from "@/lib/utils";

export function emptyDatabase(): DatabaseState {
  return {
    version: 1,
    users: [],
    recipes: [],
    ingredients: [],
    recipe_steps: [],
    plating_steps: [],
    recipe_images: [],
    saved_recipes: [],
    cooked_recipes: [],
    user_recipes: [],
  };
}

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

export function toUser(row: UserRow): User {
  return { id: row.id, email: row.email, name: row.name, bio: row.bio, avatarUrl: row.avatar_url, createdAt: row.created_at };
}

/* ------------------------------------------------------------------ */
/* Recepten                                                            */
/* ------------------------------------------------------------------ */
export function hydrateRecipe(db: DatabaseState, row: RecipeRow): RecipeDetail {
  const images = db.recipe_images.filter((img) => img.recipe_id === row.id && img.cooked_recipe_id === null);
  const imageById = new Map(images.map((img) => [img.id, img]));
  const visuals = images.filter((img) => img.kind === "cover" || img.kind === "gallery");
  const cover = visuals.find((img) => img.kind === "cover") ?? visuals[0] ?? null;
  const author = row.author_id ? db.users.find((u) => u.id === row.author_id) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    story: row.story,
    source: row.source,
    author: author ? { id: author.id, name: author.name } : null,
    course: row.course,
    categories: row.categories,
    difficulty: row.difficulty,
    servings: row.servings,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    restMinutes: row.rest_minutes,
    totalMinutes: row.prep_minutes + row.cook_minutes,
    dish: row.dish,
    tone: row.tone,
    keyIngredients: row.key_ingredients,
    platingIntro: row.plating_intro,
    platingNotes: row.plating_notes,
    chefTip: row.chef_tip,
    pairing: row.pairing,
    isDaily: row.is_daily,
    coverUrl: cover?.url ?? null,
    gallery: visuals.map((img) => img.url),
    ingredients: db.ingredients
      .filter((i) => i.recipe_id === row.id)
      .sort(byPosition)
      .map((i) => ({ id: i.id, group: i.group_name, quantity: i.quantity, unit: i.unit, name: i.name, note: i.note })),
    steps: db.recipe_steps
      .filter((s) => s.recipe_id === row.id)
      .sort(byPosition)
      .map((s) => ({
        id: s.id,
        position: s.position,
        title: s.title,
        body: s.body,
        phase: s.phase,
        scene: s.scene,
        timerSeconds: s.timer_seconds,
        tip: s.tip,
        imageUrl: s.image_id ? (imageById.get(s.image_id)?.url ?? null) : null,
      })),
    platingSteps: db.plating_steps
      .filter((p) => p.recipe_id === row.id)
      .sort(byPosition)
      .map((p) => ({ id: p.id, stage: p.stage, title: p.title, body: p.body })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listUserRecipes(db: DatabaseState, filter: { userId?: string; status?: "draft" | "published" } = {}): RecipeDetail[] {
  const ids = new Set(
    db.user_recipes
      .filter((link) => (!filter.userId || link.user_id === filter.userId) && (!filter.status || link.status === filter.status))
      .map((link) => link.recipe_id),
  );
  return db.recipes
    .filter((r) => ids.has(r.id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((r) => hydrateRecipe(db, r));
}

export const TONE_BY_CATEGORY: Record<Category, string> = {
  vlees: "#EDE3DA",
  vis: "#DFE6E2",
  vegetarisch: "#E3E6D6",
  pasta: "#EFE6D2",
  soep: "#F0E2D0",
  dessert: "#EADDD5",
};

const FRACTION_CHARS: Record<string, string> = { "½": ".5", "¼": ".25", "¾": ".75", "⅓": ".333", "⅔": ".667" };

export function parseQuantity(input: string): number | null {
  const normalized = input.trim().replace(/[½¼¾⅓⅔]/g, (c) => FRACTION_CHARS[c] ?? "").replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized.startsWith(".") ? `0${normalized}` : normalized);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function withoutRecipeChildren(db: DatabaseState, recipeId: string): DatabaseState {
  return {
    ...db,
    ingredients: db.ingredients.filter((i) => i.recipe_id !== recipeId),
    recipe_steps: db.recipe_steps.filter((s) => s.recipe_id !== recipeId),
    plating_steps: db.plating_steps.filter((p) => p.recipe_id !== recipeId),
    recipe_images: db.recipe_images.filter((img) => !(img.recipe_id === recipeId && img.cooked_recipe_id === null)),
  };
}

export function upsertUserRecipe(
  db: DatabaseState,
  userId: string,
  draft: RecipeDraft,
  existingId?: string,
  now: Date = new Date(),
): { db: DatabaseState; recipeId: string; slug: string } {
  const iso = now.toISOString();
  const existing = existingId ? db.recipes.find((r) => r.id === existingId && r.author_id === userId) : undefined;
  const id = existing?.id ?? createId("rcp");
  const slug = existing?.slug ?? `${slugify(draft.title) || "recept"}-${id.slice(-6)}`;
  const base = existing ? withoutRecipeChildren(db, id) : db;
  const category = draft.categories[0] ?? "vegetarisch";

  const ingredients = draft.ingredients
    .filter((i) => i.name.trim())
    .map((i, idx) => ({
      id: createId("ing"),
      recipe_id: id,
      position: idx + 1,
      group_name: null,
      quantity: parseQuantity(i.quantity),
      unit: i.unit,
      name: i.name.trim(),
      note: null,
    }));

  const images: RecipeImageRow[] = draft.photos.map((url, idx) => ({
    id: createId("img"),
    user_id: userId,
    recipe_id: id,
    step_id: null,
    cooked_recipe_id: null,
    kind: idx === 0 ? "cover" : "gallery",
    url,
    alt: draft.title,
    created_at: iso,
  }));

  const steps = draft.steps
    .filter((s) => s.title.trim() || s.body.trim())
    .map((s, idx) => {
      const stepId = createId("stp");
      let imageId: string | null = null;
      if (s.imageUrl) {
        imageId = createId("img");
        images.push({ id: imageId, user_id: userId, recipe_id: id, step_id: stepId, cooked_recipe_id: null, kind: "step", url: s.imageUrl, alt: s.title, created_at: iso });
      }
      const minutes = parseQuantity(s.timerMinutes);
      return {
        id: stepId,
        recipe_id: id,
        position: idx + 1,
        title: s.title.trim() || `Stap ${idx + 1}`,
        body: s.body.trim(),
        phase: s.scene ? SCENE_TO_PHASE[s.scene] : ("mise-en-place" as const),
        scene: s.scene ? { key: s.scene } : null,
        timer_seconds: minutes ? Math.round(minutes * 60) : null,
        tip: null,
        image_id: imageId,
      };
    });

  const row: RecipeRow = {
    id,
    slug,
    title: draft.title.trim(),
    subtitle: null,
    description: draft.description.trim(),
    story: null,
    source: "user",
    author_id: userId,
    course: draft.course,
    categories: draft.categories.length ? draft.categories : [category],
    difficulty: draft.difficulty,
    servings: Math.max(1, Math.round(draft.servings) || 1),
    prep_minutes: Math.max(0, Math.round(draft.prepMinutes) || 0),
    cook_minutes: Math.max(0, Math.round(draft.cookMinutes) || 0),
    rest_minutes: 0,
    dish: null,
    tone: TONE_BY_CATEGORY[category],
    key_ingredients: ingredients.slice(0, 4).map((i) => i.name.charAt(0).toUpperCase() + i.name.slice(1)),
    plating_intro: null,
    plating_notes: draft.platingNotes.trim() || null,
    chef_tip: null,
    pairing: null,
    is_daily: false,
    created_at: existing?.created_at ?? iso,
    updated_at: iso,
  };

  return {
    recipeId: id,
    slug,
    db: {
      ...base,
      recipes: existing ? base.recipes.map((r) => (r.id === id ? row : r)) : [...base.recipes, row],
      ingredients: [...base.ingredients, ...ingredients],
      recipe_steps: [...base.recipe_steps, ...steps],
      recipe_images: [...base.recipe_images, ...images],
      user_recipes: existing
        ? base.user_recipes
        : [...base.user_recipes, { id: createId("urc"), user_id: userId, recipe_id: id, status: "published", created_at: iso }],
    },
  };
}

export function deleteUserRecipe(db: DatabaseState, userId: string, recipeId: string): DatabaseState {
  const owned = db.recipes.some((r) => r.id === recipeId && r.author_id === userId);
  if (!owned) return db;
  const cookedIds = new Set(db.cooked_recipes.filter((c) => c.recipe_id === recipeId).map((c) => c.id));
  return {
    ...db,
    recipes: db.recipes.filter((r) => r.id !== recipeId),
    ingredients: db.ingredients.filter((i) => i.recipe_id !== recipeId),
    recipe_steps: db.recipe_steps.filter((s) => s.recipe_id !== recipeId),
    plating_steps: db.plating_steps.filter((p) => p.recipe_id !== recipeId),
    recipe_images: db.recipe_images.filter((img) => img.recipe_id !== recipeId && !(img.cooked_recipe_id && cookedIds.has(img.cooked_recipe_id))),
    saved_recipes: db.saved_recipes.filter((s) => s.recipe_id !== recipeId),
    cooked_recipes: db.cooked_recipes.filter((c) => c.recipe_id !== recipeId),
    user_recipes: db.user_recipes.filter((l) => l.recipe_id !== recipeId),
  };
}

/* ------------------------------------------------------------------ */
/* Gebruikers                                                          */
/* ------------------------------------------------------------------ */
export function findUserByEmail(db: DatabaseState, email: string): UserRow | undefined {
  const needle = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === needle);
}

export function insertUser(
  db: DatabaseState,
  input: { name: string; email: string; passwordHash: string; id?: string; bio?: string | null; createdAt?: string },
): { db: DatabaseState; user: UserRow } {
  const user: UserRow = {
    id: input.id ?? createId("usr"),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    password_hash: input.passwordHash,
    bio: input.bio ?? null,
    avatar_url: null,
    created_at: input.createdAt ?? new Date().toISOString(),
  };
  return { db: { ...db, users: [...db.users, user] }, user };
}

export function patchUser(db: DatabaseState, userId: string, patch: Partial<Pick<UserRow, "name" | "bio" | "avatar_url">>): DatabaseState {
  return { ...db, users: db.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)) };
}

/* ------------------------------------------------------------------ */
/* Opgeslagen & gekookte recepten                                      */
/* ------------------------------------------------------------------ */
export function hasSaved(db: DatabaseState, userId: string, recipeId: string, kind: SavedKind): boolean {
  return db.saved_recipes.some((s) => s.user_id === userId && s.recipe_id === recipeId && s.kind === kind);
}

export function toggleSaved(
  db: DatabaseState,
  userId: string,
  recipeId: string,
  kind: SavedKind,
  now: Date = new Date(),
): { db: DatabaseState; active: boolean } {
  if (hasSaved(db, userId, recipeId, kind)) {
    return {
      active: false,
      db: { ...db, saved_recipes: db.saved_recipes.filter((s) => !(s.user_id === userId && s.recipe_id === recipeId && s.kind === kind)) },
    };
  }
  return {
    active: true,
    db: {
      ...db,
      saved_recipes: [...db.saved_recipes, { id: createId("sav"), user_id: userId, recipe_id: recipeId, kind, created_at: now.toISOString() }],
    },
  };
}

export function insertCooked(
  db: DatabaseState,
  input: { userId: string; recipeId: string; title?: string | null; note: string | null; durationMinutes: number | null; photoUrl: string | null; cookedAt?: string },
): { db: DatabaseState; row: CookedRecipeRow } {
  const row: CookedRecipeRow = {
    id: createId("ckd"),
    user_id: input.userId,
    recipe_id: input.recipeId,
    title: input.title?.trim() || null,
    note: input.note?.trim() || null,
    duration_minutes: input.durationMinutes,
    cooked_at: input.cookedAt ?? new Date().toISOString(),
  };
  const images = input.photoUrl
    ? [
        {
          id: createId("img"),
          user_id: input.userId,
          recipe_id: input.recipeId,
          step_id: null,
          cooked_recipe_id: row.id,
          kind: "cooked" as const,
          url: input.photoUrl,
          alt: null,
          created_at: row.cooked_at,
        },
      ]
    : [];
  return { row, db: { ...db, cooked_recipes: [...db.cooked_recipes, row], recipe_images: [...db.recipe_images, ...images] } };
}

export function deleteCooked(db: DatabaseState, userId: string, cookedId: string): DatabaseState {
  return {
    ...db,
    cooked_recipes: db.cooked_recipes.filter((c) => !(c.id === cookedId && c.user_id === userId)),
    recipe_images: db.recipe_images.filter((img) => img.cooked_recipe_id !== cookedId),
  };
}

export function cookedEntries(db: DatabaseState, userId: string, resolve: (id: string) => RecipeDetail | undefined): CookedEntry[] {
  return db.cooked_recipes
    .filter((c) => c.user_id === userId)
    .sort((a, b) => b.cooked_at.localeCompare(a.cooked_at))
    .flatMap((c) => {
      const recipe = resolve(c.recipe_id);
      if (!recipe) return [];
      const photo = db.recipe_images.find((img) => img.cooked_recipe_id === c.id);
      return [
        {
          id: c.id,
          title: c.title ?? null,
          recipe,
          note: c.note,
          photoUrl: photo?.url ?? null,
          durationMinutes: c.duration_minutes ?? recipe.totalMinutes,
          cookedAt: c.cooked_at,
        },
      ];
    });
}

/* ------------------------------------------------------------------ */
/* Statistieken                                                        */
/* ------------------------------------------------------------------ */
const monthLabel = new Intl.DateTimeFormat("nl-NL", { month: "short" });

export function computeStats(db: DatabaseState, userId: string, resolve: (id: string) => RecipeDetail | undefined, now: Date = new Date()): KitchenStats {
  const cooked = db.cooked_recipes.filter((c) => c.user_id === userId);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = cooked.filter((c) => new Date(c.cooked_at) >= monthStart);
  const favorites = db.saved_recipes.filter((s) => s.user_id === userId && s.kind === "favorite");
  const cookAgain = db.saved_recipes.filter((s) => s.user_id === userId && s.kind === "cook_again");

  const tally = new Map<Category, number>();
  const add = (recipeId: string, weight: number) => {
    resolve(recipeId)?.categories.forEach((cat) => tally.set(cat, (tally.get(cat) ?? 0) + weight));
  };
  cooked.forEach((c) => add(c.recipe_id, 2));
  favorites.forEach((f) => add(f.recipe_id, 1));
  const favoriteCategory = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const count = cooked.filter((c) => {
      const cd = new Date(c.cooked_at);
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    return { key, label: monthLabel.format(d).replace(".", ""), count };
  });

  const days = new Set(cooked.map((c) => new Date(c.cooked_at).toDateString()));
  let streakDays = 0;
  const cursor = new Date(now);
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    cookedThisMonth: thisMonth.length,
    minutesThisMonth: thisMonth.reduce((sum, c) => sum + (c.duration_minutes ?? resolve(c.recipe_id)?.totalMinutes ?? 0), 0),
    savedCount: favorites.length,
    ownRecipeCount: db.user_recipes.filter((l) => l.user_id === userId).length,
    cookAgainCount: cookAgain.length,
    favoriteCategory,
    monthly,
    streakDays,
  };
}
