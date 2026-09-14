import type { Category, Course, Difficulty, DishKey, Phase, SceneSpec } from "@/lib/types";

/** [hoeveelheid, eenheid, naam, notitie?] */
export type IngredientSeed = [number | null, string, string, string?];

/**
 * Leesbaar auteursformaat voor platformrecepten. `src/lib/data/index.ts`
 * normaliseert dit naar dezelfde structuur als de databasetabellen.
 */
export interface RecipeSeed {
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
  dish: DishKey;
  tone: string;
  keyIngredients: string[];
  isDaily?: boolean;
  ingredients: { group: string | null; items: IngredientSeed[] }[];
  steps: { title: string; body: string; phase: Phase; scene: SceneSpec; timer?: number; tip?: string }[];
  /** Zes toelichtingen, één per plating-fase (schoon bord → rand schoon). */
  plating: { intro: string; steps: [string, string, string, string, string, string] };
  chefTip: string;
  pairing?: string;
}
