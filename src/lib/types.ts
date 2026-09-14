/**
 * Domeinmodel van Assiette.
 *
 * De `*Row`-types spiegelen één-op-één de tabellen uit `database/schema.sql`.
 * De UI werkt met samengestelde types (`RecipeDetail`, `CookedEntry`) die door de
 * repository uit die rijen worden opgebouwd. Zo kan de lokale opslag later zonder
 * UI-wijzigingen vervangen worden door een echte database of API.
 */

export type ID = string;
export type ISODate = string;

export type Difficulty = "makkelijk" | "gemiddeld" | "uitdagend";
export type Course = "voorgerecht" | "hoofdgerecht" | "nagerecht";
export type Category = "vlees" | "vis" | "vegetarisch" | "pasta" | "soep" | "dessert";

/** Fase in het kookproces — voedt de visuele tijdlijn op de receptpagina. */
export type Phase =
  | "mise-en-place"
  | "snijden"
  | "kruiden"
  | "verhitten"
  | "bakken"
  | "garen"
  | "saus"
  | "rusten"
  | "bord"
  | "dresseren";

/** Geïllustreerde bord-composities (zie components/illustrations/dishes). */
export type DishKey =
  | "steak"
  | "pasta"
  | "seabass"
  | "vegetables"
  | "chocolate"
  | "risotto"
  | "duck"
  | "scallops"
  | "burrata"
  | "lemon-tart"
  | "soup"
  | "salmon";

/** Geïllustreerde kooktechnieken (zie components/illustrations/scenes). */
export type SceneKey =
  | "prep"
  | "chop"
  | "season"
  | "heat"
  | "sear"
  | "baste"
  | "rest"
  | "slice"
  | "simmer"
  | "boil"
  | "whisk"
  | "roast"
  | "blend"
  | "melt"
  | "chill"
  | "grate"
  | "pipe"
  | "torch"
  | "plate";

export type SceneItem =
  | "steak"
  | "fish"
  | "salmon"
  | "scallops"
  | "duck"
  | "mushrooms"
  | "vegetables"
  | "carrot"
  | "pumpkin"
  | "pasta"
  | "rice"
  | "onion"
  | "shallot"
  | "garlic"
  | "herbs"
  | "tomato"
  | "cucumber"
  | "cauliflower"
  | "lemon"
  | "chocolate"
  | "burrata"
  | "bread"
  | "dough"
  | "parmesan"
  | "truffle"
  | "sage"
  | "potato";

/** Kleur van een vloeistof in een pan/kom (saus, room, bouillon…). */
export type LiquidTone =
  | "berry"
  | "cherry"
  | "cream"
  | "butter"
  | "brown-butter"
  | "wine"
  | "broth"
  | "herb"
  | "pumpkin"
  | "chocolate"
  | "lemon"
  | "soy"
  | "egg-white"
  | "risotto";

export interface SceneSpec {
  key: SceneKey;
  item?: SceneItem;
  tone?: LiquidTone;
  /** Alleen voor `plate`: welk gerecht wordt gedresseerd. */
  dish?: DishKey;
}

/* ------------------------------------------------------------------ */
/* Tabellen                                                            */
/* ------------------------------------------------------------------ */

export interface UserRow {
  id: ID;
  email: string;
  name: string;
  password_hash: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: ISODate;
}

export interface RecipeRow {
  id: ID;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  story: string | null;
  source: "platform" | "user";
  author_id: ID | null;
  course: Course;
  categories: Category[];
  difficulty: Difficulty;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  rest_minutes: number;
  dish: DishKey | null;
  tone: string;
  key_ingredients: string[];
  plating_intro: string | null;
  plating_notes: string | null;
  chef_tip: string | null;
  pairing: string | null;
  is_daily: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface IngredientRow {
  id: ID;
  recipe_id: ID;
  position: number;
  group_name: string | null;
  quantity: number | null;
  unit: string;
  name: string;
  note: string | null;
}

export interface RecipeStepRow {
  id: ID;
  recipe_id: ID;
  position: number;
  title: string;
  body: string;
  phase: Phase;
  scene: SceneSpec | null;
  timer_seconds: number | null;
  tip: string | null;
  image_id: ID | null;
}

export interface PlatingStepRow {
  id: ID;
  recipe_id: ID;
  position: number;
  stage: number;
  title: string;
  body: string;
}

export type ImageKind = "cover" | "gallery" | "step" | "cooked";

export interface RecipeImageRow {
  id: ID;
  user_id: ID | null;
  recipe_id: ID | null;
  step_id: ID | null;
  cooked_recipe_id: ID | null;
  kind: ImageKind;
  url: string;
  alt: string | null;
  created_at: ISODate;
}

export type SavedKind = "favorite" | "cook_again";

export interface SavedRecipeRow {
  id: ID;
  user_id: ID;
  recipe_id: ID;
  kind: SavedKind;
  created_at: ISODate;
}

export interface CookedRecipeRow {
  id: ID;
  user_id: ID;
  recipe_id: ID;
  note: string | null;
  duration_minutes: number | null;
  cooked_at: ISODate;
}

export interface UserRecipeRow {
  id: ID;
  user_id: ID;
  recipe_id: ID;
  status: "draft" | "published";
  created_at: ISODate;
}

export interface DatabaseState {
  version: 1;
  users: UserRow[];
  recipes: RecipeRow[];
  ingredients: IngredientRow[];
  recipe_steps: RecipeStepRow[];
  plating_steps: PlatingStepRow[];
  recipe_images: RecipeImageRow[];
  saved_recipes: SavedRecipeRow[];
  cooked_recipes: CookedRecipeRow[];
  user_recipes: UserRecipeRow[];
}

/* ------------------------------------------------------------------ */
/* Samengestelde types voor de UI                                      */
/* ------------------------------------------------------------------ */

export interface User {
  id: ID;
  email: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: ISODate;
}

export interface Ingredient {
  id: ID;
  group: string | null;
  quantity: number | null;
  unit: string;
  name: string;
  note: string | null;
}

export interface RecipeStep {
  id: ID;
  position: number;
  title: string;
  body: string;
  phase: Phase;
  scene: SceneSpec | null;
  timerSeconds: number | null;
  tip: string | null;
  imageUrl: string | null;
}

export interface PlatingStep {
  id: ID;
  stage: number;
  title: string;
  body: string;
}

export interface RecipeDetail {
  id: ID;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  story: string | null;
  source: "platform" | "user";
  author: { id: ID; name: string } | null;
  course: Course;
  categories: Category[];
  difficulty: Difficulty;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  totalMinutes: number;
  dish: DishKey | null;
  tone: string;
  keyIngredients: string[];
  platingIntro: string | null;
  platingNotes: string | null;
  chefTip: string | null;
  pairing: string | null;
  isDaily: boolean;
  coverUrl: string | null;
  gallery: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  platingSteps: PlatingStep[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CookedEntry {
  id: ID;
  /** Eigen naam voor deze versie, bv. "Zondagse steak voor twee". */
  title: string | null;
  recipe: RecipeDetail;
  note: string | null;
  photoUrl: string | null;
  durationMinutes: number;
  cookedAt: ISODate;
}

/** Invoer van het formulier "Maak je eigen recept". */
export interface RecipeDraft {
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  course: Course;
  categories: Category[];
  ingredients: { key: string; quantity: string; unit: string; name: string }[];
  steps: {
    key: string;
    title: string;
    body: string;
    imageUrl: string | null;
    timerMinutes: string;
    scene: SceneKey | "";
  }[];
  photos: string[];
  platingNotes: string;
}

export interface KitchenStats {
  cookedThisMonth: number;
  minutesThisMonth: number;
  savedCount: number;
  ownRecipeCount: number;
  cookAgainCount: number;
  favoriteCategory: Category | null;
  monthly: { key: string; label: string; count: number }[];
  streakDays: number;
}
