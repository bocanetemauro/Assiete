/**
 * Leesquery's op de Supabase-database en de vertaling van databaserijen naar de
 * UI-types. Alles wat hier staat werkt óók zonder ingelogde gebruiker: de RLS
 * policies geven anonieme bezoekers alle publieke recepten.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, CookedEntry, Ingredient, PlatingStep, RecipeDetail, RecipeStep, User } from "@/lib/types";
import { PHOTO_BUCKET, SUPABASE_URL } from "./config";

/** Publieke URL van een bestand in de fotobucket. */
export function photoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

export const RECIPE_SELECT = `
  id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty,
  servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment,
  plating_intro, plating_notes, chef_tip, pairing, created_at, updated_at,
  recipe_categories(category_id),
  recipe_ingredients(id, position, group_name, quantity, unit, note, ingredient:ingredients(name)),
  recipe_steps(id, position, title, body, phase, scene, timer_seconds, tip, image_path),
  plating_steps(id, stage, title, body),
  recipe_images(id, kind, storage_path, position),
  author:profiles!recipes_author_id_fkey(id, display_name)
`;
// `profiles` is op twee manieren aan `recipes` gekoppeld (author_id én via saved_recipes);
// zonder de expliciete relatie weigert Supabase de hele query (PGRST201).

type Row = Record<string, any>;

const byPosition = (a: Row, b: Row) => (a.position ?? 0) - (b.position ?? 0);

/** Zet een recept-rij met zijn gekoppelde rijen om naar het UI-type. */
export function toRecipeDetail(row: Row): RecipeDetail {
  const ingredients: Ingredient[] = (row.recipe_ingredients ?? []).slice().sort(byPosition).map((i: Row) => ({
    id: i.id,
    group: i.group_name,
    quantity: i.quantity === null ? null : Number(i.quantity),
    unit: i.unit ?? "",
    name: i.ingredient?.name ?? "",
    note: i.note,
  }));

  const steps: RecipeStep[] = (row.recipe_steps ?? []).slice().sort(byPosition).map((s: Row) => ({
    id: s.id,
    position: s.position,
    title: s.title,
    body: s.body,
    phase: s.phase,
    scene: s.scene,
    timerSeconds: s.timer_seconds,
    tip: s.tip,
    imageUrl: photoUrl(s.image_path),
  }));

  const platingSteps: PlatingStep[] = (row.plating_steps ?? [])
    .slice()
    .sort((a: Row, b: Row) => a.stage - b.stage)
    .map((p: Row) => ({ id: p.id, stage: p.stage, title: p.title, body: p.body }));

  const images = (row.recipe_images ?? []).slice().sort(byPosition);
  const cover = images.find((i: Row) => i.kind === "cover") ?? images[0];
  const author = Array.isArray(row.author) ? row.author[0] : row.author;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    story: row.story,
    source: row.source,
    isPublic: row.is_public,
    author: author ? { id: author.id, name: author.display_name || "Chef" } : null,
    course: row.course,
    categories: (row.recipe_categories ?? []).map((c: Row) => c.category_id as Category),
    difficulty: row.difficulty,
    servings: row.servings,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    restMinutes: row.rest_minutes,
    totalMinutes: row.prep_minutes + row.cook_minutes,
    dish: row.dish ?? null,
    tone: row.tone,
    keyIngredients: ingredients.slice(0, 4).map((i) => i.name).filter(Boolean),
    tags: row.tags ?? [],
    equipment: row.equipment ?? [],
    platingIntro: row.plating_intro,
    platingNotes: row.plating_notes,
    chefTip: row.chef_tip,
    pairing: row.pairing,
    isDaily: false,
    coverUrl: photoUrl(cover?.storage_path),
    gallery: images.filter((i: Row) => i.kind === "gallery").map((i: Row) => photoUrl(i.storage_path)!).filter(Boolean),
    ingredients,
    steps,
    platingSteps,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Publieke recepten van andere leden plus alle eigen recepten van deze gebruiker. */
export async function fetchUserRecipes(client: SupabaseClient, userId: string | null): Promise<RecipeDetail[]> {
  const query = client.from("recipes").select(RECIPE_SELECT).eq("source", "user").order("created_at", { ascending: false }).limit(200);
  const { data, error } = userId ? await query.or(`is_public.eq.true,author_id.eq.${userId}`) : await query.eq("is_public", true);
  if (error) throw error;
  return (data ?? []).map(toRecipeDetail);
}

export async function fetchRecipeBySlug(client: SupabaseClient, slug: string): Promise<RecipeDetail | null> {
  const { data, error } = await client.from("recipes").select(RECIPE_SELECT).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toRecipeDetail(data) : null;
}

export interface CookedRow {
  id: string;
  recipe_id: string;
  title: string | null;
  note: string | null;
  duration_minutes: number | null;
  cooked_at: string;
  recipe_images: { storage_path: string; kind: string }[];
}

export async function fetchCooked(client: SupabaseClient, userId: string): Promise<CookedRow[]> {
  const { data, error } = await client
    .from("cooked_recipes")
    .select("id, recipe_id, title, note, duration_minutes, cooked_at, recipe_images(storage_path, kind)")
    .eq("user_id", userId)
    .order("cooked_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as unknown as CookedRow[];
}

export function toCookedEntry(row: CookedRow, recipe: RecipeDetail): CookedEntry {
  const photo = row.recipe_images?.find((i) => i.kind === "cooked");
  return {
    id: row.id,
    title: row.title,
    recipe,
    note: row.note,
    photoUrl: photoUrl(photo?.storage_path),
    durationMinutes: row.duration_minutes ?? recipe.totalMinutes,
    cookedAt: row.cooked_at,
  };
}

/** Profiel + e-mailgegevens samenvoegen tot het UI-type `User`. */
export function toUser(auth: { id: string; email?: string | null; created_at?: string; email_confirmed_at?: string | null }, profile: Row | null): User {
  return {
    id: auth.id,
    email: auth.email ?? "",
    username: profile?.username ?? null,
    name: profile?.display_name || (auth.email ? auth.email.split("@")[0] : "Chef"),
    bio: profile?.bio ?? null,
    avatarUrl: photoUrl(profile?.avatar_url),
    createdAt: auth.created_at ?? new Date().toISOString(),
    emailConfirmed: Boolean(auth.email_confirmed_at),
  };
}
