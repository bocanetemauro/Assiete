/**
 * Demo-account zodat het dashboard, Mijn keuken en de statistieken meteen
 * gevuld zijn. Data wordt relatief aan "nu" aangemaakt.
 */

import type { DatabaseState, RecipeDraft } from "@/lib/types";
import { insertCooked, insertUser, toggleSaved, upsertUserRecipe } from "./repository";

export const DEMO_USER_ID = "usr_demo";
export const DEMO_EMAIL = "demo@assiette.nl";

const daysAgo = (now: Date, days: number, hour = 19) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hour, 30, 0, 0);
  return d;
};

const stoofvlees: RecipeDraft = {
  title: "Stoofvlees met donker bier",
  description: "Mals runderstoofvlees, urenlang gegaard in donker abdijbier met ontbijtkoek, laurier en tijm. Comfort food met diepgang.",
  servings: 4,
  prepMinutes: 25,
  cookMinutes: 180,
  difficulty: "gemiddeld",
  course: "hoofdgerecht",
  categories: ["vlees"],
  ingredients: [
    { key: "a", quantity: "1", unit: "kg", name: "runderlappen" },
    { key: "b", quantity: "2", unit: "stuks", name: "uien" },
    { key: "c", quantity: "660", unit: "ml", name: "donker abdijbier" },
    { key: "d", quantity: "2", unit: "sneetjes", name: "ontbijtkoek" },
    { key: "e", quantity: "1", unit: "el", name: "Dijonmosterd" },
    { key: "f", quantity: "3", unit: "stuks", name: "laurierblaadjes" },
    { key: "g", quantity: "40", unit: "g", name: "boter" },
  ],
  steps: [
    { key: "1", title: "Snijd het vlees", body: "Snijd de runderlappen in blokken van 4 cm en dep ze droog.", imageUrl: null, timerMinutes: "", scene: "chop" },
    { key: "2", title: "Bak het vlees aan", body: "Bak het vlees in porties rondom bruin in boter. Niet te veel tegelijk, anders gaat het koken.", imageUrl: null, timerMinutes: "8", scene: "sear" },
    { key: "3", title: "Stoof de uien", body: "Stoof de uien in het bakvet tot ze zacht en goudbruin zijn.", imageUrl: null, timerMinutes: "10", scene: "simmer" },
    { key: "4", title: "Laat pruttelen", body: "Voeg bier, vlees, laurier en ontbijtkoek besmeerd met mosterd toe. Laat 3 uur zachtjes stoven met het deksel op een kier.", imageUrl: null, timerMinutes: "180", scene: "simmer" },
    { key: "5", title: "Serveer", body: "Schep het stoofvlees in een diep bord met frieten of stamppot en wat verse peterselie.", imageUrl: null, timerMinutes: "", scene: "" },
  ],
  photos: [],
  platingNotes: "Diep bord, stoofvlees iets uit het midden, een lepel extra saus erover en verse peterselie voor een groen accent.",
};

const shakshuka: RecipeDraft = {
  title: "Shakshuka met feta en koriander",
  description: "Eieren gepocheerd in een pittige saus van tomaat, paprika en komijn, afgewerkt met verkruimelde feta en verse koriander.",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 25,
  difficulty: "makkelijk",
  course: "hoofdgerecht",
  categories: ["vegetarisch"],
  ingredients: [
    { key: "a", quantity: "4", unit: "stuks", name: "eieren" },
    { key: "b", quantity: "400", unit: "g", name: "tomatenblokjes" },
    { key: "c", quantity: "1", unit: "stuks", name: "rode paprika" },
    { key: "d", quantity: "1", unit: "stuks", name: "ui" },
    { key: "e", quantity: "1", unit: "tl", name: "komijn" },
    { key: "f", quantity: "75", unit: "g", name: "feta" },
    { key: "g", quantity: "1", unit: "handje", name: "koriander" },
  ],
  steps: [
    { key: "1", title: "Snijd de groenten", body: "Snijd ui en paprika in reepjes.", imageUrl: null, timerMinutes: "", scene: "chop" },
    { key: "2", title: "Maak de saus", body: "Fruit ui, paprika en komijn zacht en voeg de tomaten toe. Laat 15 minuten indikken.", imageUrl: null, timerMinutes: "15", scene: "simmer" },
    { key: "3", title: "Pocheer de eieren", body: "Maak kuiltjes in de saus, breek de eieren erin en laat met deksel 6 minuten garen.", imageUrl: null, timerMinutes: "6", scene: "simmer" },
    { key: "4", title: "Werk af", body: "Verkruimel de feta erover en strooi koriander. Serveer met geroosterd brood.", imageUrl: null, timerMinutes: "", scene: "" },
  ],
  photos: [],
  platingNotes: "In de pan serveren op een houten plank, feta en koriander in één hoek zodat de eidooiers zichtbaar blijven.",
};

export function seedDemo(db: DatabaseState, now: Date = new Date()): DatabaseState {
  if (db.users.some((u) => u.id === DEMO_USER_ID)) return db;

  let next = insertUser(db, {
    id: DEMO_USER_ID,
    name: "Noor van den Berg",
    email: DEMO_EMAIL,
    passwordHash: "",
    bio: "Thuiskok met een zwak voor sauzen, seizoensgroenten en lange zondagen in de keuken.",
    createdAt: daysAgo(now, 160).toISOString(),
  }).db;

  const favorites = [
    "romige-truffelpasta",
    "steak-met-blauwe-bessensaus",
    "chocolade-cremeux-met-vanille",
    "risotto-met-bospaddenstoelen",
    "burrata-met-tomaat-en-basilicumolie",
    "citroentarte-met-meringue",
    "eendenborst-met-kersen",
  ];
  favorites.forEach((slug, i) => {
    next = toggleSaved(next, DEMO_USER_ID, `rcp_${slug}`, "favorite", daysAgo(now, 40 - i * 4)).db;
  });

  ["romige-truffelpasta", "risotto-met-bospaddenstoelen", "pompoensoep-met-salie"].forEach((slug, i) => {
    next = toggleSaved(next, DEMO_USER_ID, `rcp_${slug}`, "cook_again", daysAgo(now, 20 - i * 5)).db;
  });

  const cooked: [string, number, number, string][] = [
    ["steak-met-blauwe-bessensaus", 0, 50, "Eerste keer gearroseerd — wat een korst. Volgende keer iets minder lang laten rusten."],
    ["romige-truffelpasta", 3, 25, "Met truffeltapenade gemaakt. Het pastawater maakt echt het verschil."],
    ["burrata-met-tomaat-en-basilicumolie", 5, 20, "Perfect zomers voorgerecht voor vrienden."],
    ["risotto-met-bospaddenstoelen", 8, 45, "Eindelijk een risotto 'all'onda'!"],
    ["pompoensoep-met-salie", 10, 60, "De krokante salie is verslavend."],
    ["romige-truffelpasta", 12, 25, "Voor twee gemaakt, alles op."],
    ["zeebaars-met-beurre-blanc", 36, 40, "Beurre blanc schiftte bijna — vuur lager gezet en gered."],
    ["chocolade-cremeux-met-vanille", 52, 150, "Quenelles oefenen blijft een kunst."],
    ["geroosterde-groenten-met-kruidenolie", 71, 55, "Kruidenolie bleef dagen groen."],
    ["risotto-met-bospaddenstoelen", 98, 45, ""],
  ];
  cooked.forEach(([slug, days, minutes, note]) => {
    next = insertCooked(next, {
      userId: DEMO_USER_ID,
      recipeId: `rcp_${slug}`,
      note,
      durationMinutes: minutes,
      photoUrl: null,
      cookedAt: daysAgo(now, days, days % 2 ? 13 : 19).toISOString(),
    }).db;
  });

  next = upsertUserRecipe(next, DEMO_USER_ID, stoofvlees, undefined, daysAgo(now, 60)).db;
  next = upsertUserRecipe(next, DEMO_USER_ID, shakshuka, undefined, daysAgo(now, 14)).db;
  return next;
}
