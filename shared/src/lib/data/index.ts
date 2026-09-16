import type { RecipeDetail } from "@/lib/types";
import { PLATING_STAGES } from "@/lib/constants";
import { RECIPES_A } from "./recipes-a";
import { RECIPES_B } from "./recipes-b";
import { RECIPES_C } from "./recipes-c";
import { RECIPES_D } from "./recipes-d";
import { RECIPES_E } from "./recipes-e";
import { RECIPES_F } from "./recipes-f";
import type { RecipeSeed } from "./seed-types";

const PUBLISHED_AT = "2026-01-15T09:00:00.000Z";

/** Alle platformrecepten (originele content), in redactionele volgorde. */
export const PLATFORM_SEEDS: RecipeSeed[] = [...RECIPES_A, ...RECIPES_B, ...RECIPES_C, ...RECIPES_D, ...RECIPES_E, ...RECIPES_F];

/** Zet een auteursrecept om naar dezelfde vorm die de database-services opbouwen. */
export function seedToDetail(seed: RecipeSeed): RecipeDetail {
  let position = 0;
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    description: seed.description,
    story: seed.story,
    source: "platform",
    isPublic: true,
    author: null,
    course: seed.course,
    categories: seed.categories,
    difficulty: seed.difficulty,
    servings: seed.servings,
    prepMinutes: seed.prepMinutes,
    cookMinutes: seed.cookMinutes,
    restMinutes: seed.restMinutes ?? 0,
    totalMinutes: seed.prepMinutes + seed.cookMinutes,
    dish: seed.dish,
    tone: seed.tone,
    keyIngredients: seed.keyIngredients,
    tags: seed.tags,
    equipment: seed.equipment,
    platingIntro: seed.plating.intro,
    platingNotes: null,
    chefTip: seed.chefTip,
    pairing: seed.pairing ?? null,
    isDaily: Boolean(seed.isDaily),
    coverUrl: null,
    gallery: [],
    ingredients: seed.ingredients.flatMap((group) =>
      group.items.map(([quantity, unit, name, note]) => ({
        id: `${seed.id}_ing_${position++}`,
        group: group.group,
        quantity,
        unit,
        name,
        note: note ?? null,
      })),
    ),
    steps: seed.steps.map((step, i) => ({
      id: `${seed.id}_step_${i + 1}`,
      position: i + 1,
      title: step.title,
      body: step.body,
      phase: step.phase,
      scene: step.scene,
      timerSeconds: step.timer ?? null,
      tip: step.tip ?? null,
      imageUrl: null,
    })),
    platingSteps: seed.plating.steps.map((body, i) => ({
      id: `${seed.id}_plating_${i}`,
      stage: i,
      title: PLATING_STAGES[i].title,
      body,
    })),
    createdAt: PUBLISHED_AT,
    updatedAt: PUBLISHED_AT,
  };
}

export const PLATFORM_RECIPES: RecipeDetail[] = PLATFORM_SEEDS.map(seedToDetail);

/** Dagnummer in Nederlandse tijd, zodat het menu om middernacht (Amsterdam) wisselt. */
function dayNumber(date: Date): number {
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

/**
 * "Vandaag op het menu": elke dag een andere, gebalanceerde selectie van vijf
 * recepten — een signatuurgerecht, een amuse of voorgerecht, vis, vegetarisch en
 * een dessert.
 */
export function getDailyRecipes(date: Date = new Date()): RecipeDetail[] {
  const day = dayNumber(date);
  const pick = (list: RecipeDetail[], offset: number) => (list.length ? list[(day * 7 + offset) % list.length] : undefined);
  const selection: RecipeDetail[] = [];
  const add = (recipe: RecipeDetail | undefined) => {
    if (recipe && !selection.some((r) => r.id === recipe.id)) selection.push(recipe);
  };

  add(pick(PLATFORM_RECIPES.filter((r) => r.course === "hoofdgerecht" && r.categories.includes("vlees")), 0));
  add(pick(PLATFORM_RECIPES.filter((r) => r.course === "amuse" || r.course === "voorgerecht"), 3));
  add(pick(PLATFORM_RECIPES.filter((r) => r.categories.includes("vis") && r.course !== "amuse"), 5));
  add(pick(PLATFORM_RECIPES.filter((r) => r.categories.includes("vegetarisch") && r.course === "hoofdgerecht"), 2));
  add(pick(PLATFORM_RECIPES.filter((r) => r.course === "nagerecht"), 1));

  for (let k = 0; selection.length < 5 && k < PLATFORM_RECIPES.length; k++) add(PLATFORM_RECIPES[(day + k) % PLATFORM_RECIPES.length]);
  return selection;
}

export function getPlatformRecipe(slug: string): RecipeDetail | undefined {
  return PLATFORM_RECIPES.find((r) => r.slug === slug || r.id === slug);
}
