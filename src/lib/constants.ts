import type { Category, Course, Difficulty, Phase, SceneKey } from "./types";

export const BRAND = {
  name: "Assiette",
  tagline: "Culinaire academie",
};

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/recepten", label: "Recepten" },
  { href: "/vandaag", label: "Vandaag" },
  { href: "/mijn-keuken", label: "Mijn keuken" },
  { href: "/eigen-recept", label: "Eigen recept" },
  { href: "/profiel", label: "Profiel" },
] as const;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  makkelijk: "Makkelijk",
  gemiddeld: "Gemiddeld",
  uitdagend: "Uitdagend",
};

export const DIFFICULTY_LEVEL: Record<Difficulty, number> = {
  makkelijk: 1,
  gemiddeld: 2,
  uitdagend: 3,
};

export const DIFFICULTIES: Difficulty[] = ["makkelijk", "gemiddeld", "uitdagend"];

export const CATEGORY_LABEL: Record<Category, string> = {
  vlees: "Vlees",
  vis: "Vis & zeevruchten",
  vegetarisch: "Vegetarisch",
  pasta: "Pasta & rijst",
  soep: "Soep",
  sauzen: "Sauzen",
  technieken: "Technieken",
  plating: "Plating",
};

export const CATEGORIES: Category[] = ["vlees", "vis", "vegetarisch", "pasta", "soep", "sauzen", "technieken", "plating"];

/** Achtergrondkleur van de illustratie, afgeleid van de eerste categorie. */
export const TONE_BY_CATEGORY: Record<Category, string> = {
  vlees: "#EDE3DA",
  vis: "#DFE6E2",
  vegetarisch: "#E3E6D6",
  pasta: "#EFE6D2",
  soep: "#F0E2D0",
  sauzen: "#EFE4D4",
  technieken: "#EAE5DC",
  plating: "#EADDD5",
};

export const COURSE_LABEL: Record<Course, string> = {
  amuse: "Amuse",
  voorgerecht: "Voorgerecht",
  hoofdgerecht: "Hoofdgerecht",
  nagerecht: "Dessert",
};

export const COURSES: Course[] = ["amuse", "voorgerecht", "hoofdgerecht", "nagerecht"];

/** Snelkoppelingen in de receptenbibliotheek (querystring-parameters). */
export const QUICK_FILTERS = [
  { label: "Desserts", params: { type: "nagerecht" } },
  { label: "Amuses", params: { type: "amuse" } },
  { label: "Moeilijke gerechten", params: { niveau: "uitdagend" } },
  { label: "Snel klaar", params: { tijd: "30" } },
  { label: "Sauzen", params: { categorie: "sauzen" } },
  { label: "Vegetarisch", params: { categorie: "vegetarisch" } },
  { label: "Vis", params: { categorie: "vis" } },
  { label: "Technieken", params: { categorie: "technieken" } },
] as const;

export const PHASE_LABEL: Record<Phase, string> = {
  "mise-en-place": "Ingrediënten",
  snijden: "Snijden",
  kruiden: "Kruiden",
  verhitten: "Pan verhitten",
  bakken: "Bakken",
  garen: "Garen",
  saus: "Saus maken",
  rusten: "Rusten",
  bord: "Bord voorbereiden",
  dresseren: "Dresseren",
};

export const PHASE_ORDER: Phase[] = ["mise-en-place", "snijden", "kruiden", "verhitten", "bakken", "garen", "saus", "rusten", "bord", "dresseren"];

export const SCENE_LABEL: Record<SceneKey, string> = {
  prep: "Voorbereiden",
  chop: "Snijden",
  season: "Kruiden",
  heat: "Pan verhitten",
  sear: "Aanbraden",
  baste: "Arroseren",
  rest: "Laten rusten",
  slice: "Aansnijden",
  simmer: "Laten sudderen",
  boil: "Koken",
  whisk: "Kloppen",
  roast: "Roosteren",
  blend: "Mixen",
  melt: "Smelten",
  chill: "Koelen",
  grate: "Raspen",
  pipe: "Spuiten",
  torch: "Branden",
  plate: "Dresseren",
};

export const SCENE_TO_PHASE: Record<SceneKey, Phase> = {
  prep: "mise-en-place",
  chop: "snijden",
  season: "kruiden",
  heat: "verhitten",
  sear: "bakken",
  baste: "bakken",
  rest: "rusten",
  slice: "snijden",
  simmer: "saus",
  boil: "garen",
  whisk: "saus",
  roast: "garen",
  blend: "saus",
  melt: "garen",
  chill: "rusten",
  grate: "snijden",
  pipe: "dresseren",
  torch: "garen",
  plate: "dresseren",
};

export const UNITS = ["g", "kg", "ml", "dl", "l", "el", "tl", "stuks", "teentjes", "takjes", "blaadjes", "snuf", "handje", "naar smaak"];

export const PLATING_STAGES = [
  { stage: 0, title: "Begin met een schoon bord", short: "Schoon bord" },
  { stage: 1, title: "Plaats de saus", short: "Saus" },
  { stage: 2, title: "Positioneer het hoofdonderdeel", short: "Hoofdonderdeel" },
  { stage: 3, title: "Voeg garnituur toe", short: "Garnituur" },
  { stage: 4, title: "Werk af met kruiden", short: "Kruiden" },
  { stage: 5, title: "Maak de rand van het bord schoon", short: "Rand schoon" },
] as const;

export const PLATING_PRINCIPLES = [
  {
    key: "space",
    title: "Gebruik negatieve ruimte.",
    body: "Een bord hoeft niet vol. Lege ruimte geeft rust en laat het hoofdonderdeel spreken — vul hooguit twee derde van het bord.",
  },
  {
    key: "offcenter",
    title: "Plaats niet alles in het midden.",
    body: "Denk in derden. Leg het zwaartepunt net naast het midden en laat de saus een beweging maken naar de rand.",
  },
  {
    key: "colors",
    title: "Beperk het aantal kleuren.",
    body: "Drie tot vier kleuren is genoeg. Kies één accentkleur — een saus, een bes, een kruid — en herhaal die subtiel.",
  },
  {
    key: "height",
    title: "Maak hoogte in je bord.",
    body: "Stapel, leun en laat garnituur rechtop staan. Hoogte vangt licht en maakt een bord driedimensionaal.",
  },
] as const;
