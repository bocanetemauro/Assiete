/**
 * Domeinmodel van Assiette.
 *
 * `*Row`-types spiegelen de Supabase-tabellen uit
 * `supabase/migrations/*_init_schema.sql`. De UI werkt met samengestelde types
 * (`RecipeDetail`, `CookedEntry`) die door `src/lib/services` worden opgebouwd.
 */

import type { PaletteKey } from "@/components/illustrations/palette";

export type ID = string;
export type ISODate = string;

export type Difficulty = "makkelijk" | "gemiddeld" | "uitdagend";
export type Course = "amuse" | "voorgerecht" | "hoofdgerecht" | "nagerecht";
export type Category = "vlees" | "vis" | "vegetarisch" | "pasta" | "soep" | "sauzen" | "technieken" | "plating";

/** Fase in het kookproces — voedt de visuele tijdlijn op de receptpagina. */
export type Phase = "mise-en-place" | "snijden" | "kruiden" | "verhitten" | "bakken" | "garen" | "saus" | "rusten" | "bord" | "dresseren";

/* ------------------------------------------------------------------ */
/* Illustraties                                                        */
/* ------------------------------------------------------------------ */

/** Handgecomponeerde borden (zie components/illustrations/dishes). */
export type DishKey = "steak" | "pasta" | "seabass" | "vegetables" | "chocolate" | "risotto" | "duck" | "scallops" | "burrata" | "lemon-tart" | "soup" | "salmon";

export type PlateVariant = "porcelain" | "slate" | "stoneware" | "bowl" | "bowl-stone";
export type ComposedLayout = "diagonal" | "center" | "trio" | "bowl" | "offset" | "scatter";
export type SauceStyle = "swoosh" | "smear" | "line" | "dots" | "pool" | "crumble" | "fill" | "none";
export type MainKind =
  | "slices"
  | "fillet"
  | "medallions"
  | "quenelle"
  | "dome"
  | "nest"
  | "tart"
  | "tower"
  | "spears"
  | "swirl"
  | "grains"
  | "wedges"
  | "bar"
  | "chops"
  | "shells"
  | "ravioli"
  | "gnocchi"
  | "ramekin"
  | "halves"
  | "prawns"
  | "carpaccio"
  | "cubes"
  | "egg"
  | "roll"
  | "pavlova"
  | "puffs"
  | "fritters";
export type GarnishKind =
  | "berries"
  | "dots"
  | "tomatoes"
  | "shallots"
  | "mushrooms"
  | "carrots"
  | "crumble"
  | "shards"
  | "nuts"
  | "cubes"
  | "crisps"
  | "samphire"
  | "radish"
  | "citrus"
  | "roe"
  | "cherries"
  | "fondant"
  | "asparagus"
  | "petals"
  | "onionRings"
  | "capers"
  | "appleFan"
  | "beets"
  | "leaves"
  | "peas"
  | "mussels"
  | "potatoes"
  | "figs";
export type HerbKind = "cress" | "micro" | "chervil" | "dill" | "chives" | "flakes" | "pepper" | "basil" | "mint" | "flowers" | "zest" | "thyme" | "sage" | "rosemary" | "sesame" | "gold" | "cocoa";

/** Beschrijving van een bord dat door de bord-componist wordt getekend. */
export interface ComposedDish {
  plate: PlateVariant;
  layout: ComposedLayout;
  sauce: { style: SauceStyle; color: PaletteKey; accent?: PaletteKey };
  main: { kind: MainKind; color: PaletteKey; accent?: PaletteKey; count?: number };
  garnish: { kind: GarnishKind; color?: PaletteKey; variant?: "blueberry" | "raspberry" | "cherry" }[];
  herbs: HerbKind[];
}

export type DishArt = DishKey | ComposedDish;

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
  | "potato"
  | "prawns"
  | "chicken"
  | "egg"
  | "apple"
  | "mussels";

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
  | "risotto"
  | "saffron"
  | "caramel"
  | "tomato"
  | "jus";

export interface SceneSpec {
  key: SceneKey;
  item?: SceneItem;
  tone?: LiquidTone;
  /** Alleen voor `plate`: welk bord wordt gedresseerd. */
  dish?: DishArt;
}

/* ------------------------------------------------------------------ */
/* Databaserijen (Supabase)                                            */
/* ------------------------------------------------------------------ */

export interface ProfileRow {
  id: ID;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface RecipeRow {
  id: ID;
  slug: string;
  source: "platform" | "user";
  author_id: ID | null;
  is_public: boolean;
  title: string;
  subtitle: string | null;
  description: string;
  story: string | null;
  course: Course;
  difficulty: Difficulty;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  rest_minutes: number;
  dish: DishArt | null;
  tone: string;
  tags: string[];
  equipment: string[];
  plating_intro: string | null;
  plating_notes: string | null;
  chef_tip: string | null;
  pairing: string | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface RecipeIngredientRow {
  id: ID;
  recipe_id: ID;
  position: number;
  group_name: string | null;
  quantity: number | null;
  unit: string;
  note: string | null;
  ingredient: { name: string } | null;
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
  image_path: string | null;
}

export interface PlatingStepRow {
  id: ID;
  recipe_id: ID;
  stage: number;
  title: string;
  body: string;
}

export type ImageKind = "cover" | "gallery" | "cooked";

export interface RecipeImageRow {
  id: ID;
  user_id: ID;
  recipe_id: ID | null;
  cooked_recipe_id: ID | null;
  kind: ImageKind;
  storage_path: string;
  position: number;
  alt: string | null;
  created_at: ISODate;
}

export type SavedKind = "favorite" | "cook_again";

export interface SavedRecipeRow {
  user_id: ID;
  recipe_id: ID;
  kind: SavedKind;
  created_at: ISODate;
}

export interface CookedRecipeRow {
  id: ID;
  user_id: ID;
  recipe_id: ID;
  title: string | null;
  note: string | null;
  duration_minutes: number | null;
  cooked_at: ISODate;
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
  emailConfirmed: boolean;
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
  isPublic: boolean;
  author: { id: ID; name: string } | null;
  course: Course;
  categories: Category[];
  difficulty: Difficulty;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  totalMinutes: number;
  dish: DishArt | null;
  tone: string;
  keyIngredients: string[];
  tags: string[];
  equipment: string[];
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
  /** Bestaande publieke URL's of nieuwe data-URL's (worden bij opslaan geüpload). */
  photos: string[];
  platingNotes: string;
  chefTip: string;
  equipment: string;
  isPublic: boolean;
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
