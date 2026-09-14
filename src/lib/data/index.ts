import type { RecipeDetail } from "@/lib/types";
import { PLATING_STAGES } from "@/lib/constants";
import { RECIPES_A } from "./recipes-a";
import { RECIPES_B } from "./recipes-b";
import type { RecipeSeed } from "./seed-types";

const PUBLISHED_AT = "2026-01-15T09:00:00.000Z";

/** Zet een auteursrecept om naar dezelfde vorm die de repository uit databaserijen bouwt. */
export function seedToDetail(seed: RecipeSeed): RecipeDetail {
  const id = `rcp_${seed.slug}`;
  let position = 0;
  return {
    id,
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    description: seed.description,
    story: seed.story,
    source: "platform",
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
    platingIntro: seed.plating.intro,
    platingNotes: null,
    chefTip: seed.chefTip,
    pairing: seed.pairing ?? null,
    isDaily: Boolean(seed.isDaily),
    coverUrl: null,
    gallery: [],
    ingredients: seed.ingredients.flatMap((group) =>
      group.items.map(([quantity, unit, name, note]) => ({
        id: `${id}_ing_${position++}`,
        group: group.group,
        quantity,
        unit,
        name,
        note: note ?? null,
      })),
    ),
    steps: seed.steps.map((step, i) => ({
      id: `${id}_step_${i + 1}`,
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
      id: `${id}_plating_${i}`,
      stage: i,
      title: PLATING_STAGES[i].title,
      body,
    })),
    createdAt: PUBLISHED_AT,
    updatedAt: PUBLISHED_AT,
  };
}

export const PLATFORM_RECIPES: RecipeDetail[] = [...RECIPES_A, ...RECIPES_B].map(seedToDetail);

/** Volgorde van "Vandaag op het menu". Later te vervangen door een redactionele planning in de database. */
const DAILY_SLUGS = [
  "steak-met-blauwe-bessensaus",
  "romige-truffelpasta",
  "zeebaars-met-beurre-blanc",
  "geroosterde-groenten-met-kruidenolie",
  "chocolade-cremeux-met-vanille",
];

export function getDailyRecipes(): RecipeDetail[] {
  return DAILY_SLUGS.map((slug) => PLATFORM_RECIPES.find((r) => r.slug === slug)).filter((r): r is RecipeDetail => Boolean(r));
}

export function getPlatformRecipe(slug: string): RecipeDetail | undefined {
  return PLATFORM_RECIPES.find((r) => r.slug === slug || r.id === slug);
}
