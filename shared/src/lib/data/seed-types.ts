import type { Category, Course, Difficulty, DishArt, Phase, SceneSpec } from "@/lib/types";

/** [hoeveelheid, eenheid, naam, notitie?] */
export type IngredientSeed = [number | null, string, string, string?];

/**
 * Leesbaar auteursformaat voor platformrecepten (originele content van Assiette).
 * `src/lib/data/index.ts` normaliseert dit voor de UI en
 * `scripts/generate-seed.mjs` zet het om naar SQL voor Supabase.
 */
export interface RecipeSeed {
  /** Vaste unieke ID — identiek in de code en in de database. */
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;
  course: Course;
  categories: Category[];
  difficulty: Difficulty;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes?: number;
  dish: DishArt;
  tone: string;
  keyIngredients: string[];
  tags: string[];
  equipment: string[];
  isDaily?: boolean;
  ingredients: { group: string | null; items: IngredientSeed[] }[];
  steps: { title: string; body: string; phase: Phase; scene: SceneSpec; timer?: number; tip?: string }[];
  /** Zes toelichtingen, één per plating-fase (schoon bord → rand schoon). */
  plating: { intro: string; steps: [string, string, string, string, string, string] };
  chefTip: string;
  pairing?: string;
}
