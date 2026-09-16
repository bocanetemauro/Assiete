/**
 * Genereert SQL-migraties met de categorieën en alle platformrecepten uit
 * `src/lib/data/recipes-*.ts`, zodat code en database dezelfde content en ID's
 * delen (nodig voor favorieten en gekookte gerechten via foreign keys).
 *
 * Gebruik:  node scripts/generate-seed.mjs
 * Vereist Node ≥ 22.18 (TypeScript type stripping).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECIPES_A } from "../src/lib/data/recipes-a.ts";
import { RECIPES_B } from "../src/lib/data/recipes-b.ts";
import { RECIPES_C } from "../src/lib/data/recipes-c.ts";
import { RECIPES_D } from "../src/lib/data/recipes-d.ts";
import { RECIPES_E } from "../src/lib/data/recipes-e.ts";
import { RECIPES_F } from "../src/lib/data/recipes-f.ts";
import { CATEGORIES, CATEGORY_LABEL, COURSES, COURSE_LABEL, PLATING_STAGES } from "../src/lib/constants.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "supabase", "migrations");
const recipes = [...RECIPES_A, ...RECIPES_B, ...RECIPES_C, ...RECIPES_D, ...RECIPES_E, ...RECIPES_F];

/* ------------------------------------------------------------------ */
/* Validatie (spiegelt de check-constraints uit het schema)            */
/* ------------------------------------------------------------------ */
const problems = [];
const check = (ok, message) => ok || problems.push(message);
const ids = new Set();
const slugs = new Set();
for (const r of recipes) {
  check(/^[0-9a-f-]{36}$/.test(r.id), `${r.slug}: ongeldige id`);
  check(!ids.has(r.id), `${r.slug}: dubbele id`);
  check(!slugs.has(r.slug), `${r.slug}: dubbele slug`);
  ids.add(r.id);
  slugs.add(r.slug);
  check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.slug), `${r.slug}: ongeldige slug`);
  check(r.title.length >= 3 && r.title.length <= 120, `${r.slug}: titel`);
  check(r.description.length >= 10 && r.description.length <= 800, `${r.slug}: beschrijving`);
  check(r.story.length <= 1500, `${r.slug}: verhaal`);
  check(COURSES.includes(r.course), `${r.slug}: gang`);
  check(r.categories.every((c) => CATEGORIES.includes(c)), `${r.slug}: categorie`);
  check(/^#[0-9A-Fa-f]{6}$/.test(r.tone), `${r.slug}: tone`);
  check(r.tags.length <= 24 && r.equipment.length <= 30, `${r.slug}: tags/materialen`);
  check(r.chefTip.length <= 800 && (r.pairing ?? "").length <= 300 && r.plating.intro.length <= 600, `${r.slug}: tip/pairing/intro`);
  check(r.plating.steps.length === 6 && r.plating.steps.every((s) => s.length <= 800), `${r.slug}: plating`);
  check(r.steps.length >= 3, `${r.slug}: te weinig stappen`);
  for (const s of r.steps) {
    check(s.title.length <= 160 && s.body.length <= 2000 && (s.tip ?? "").length <= 600, `${r.slug}: stap "${s.title}"`);
    check(s.timer === undefined || (s.timer >= 1 && s.timer <= 172800), `${r.slug}: timer "${s.title}"`);
  }
  for (const g of r.ingredients) {
    check((g.group ?? "").length <= 60, `${r.slug}: groep`);
    for (const [q, unit, name, note] of g.items) {
      check(q === null || q > 0, `${r.slug}: hoeveelheid ${name}`);
      check(unit.length <= 30 && name.length <= 120 && (note ?? "").length <= 160, `${r.slug}: ingrediënt ${name}`);
    }
  }
}
if (recipes.length < 50) problems.push(`Slechts ${recipes.length} recepten (minimaal 50 vereist)`);
if (problems.length) {
  console.error("Seed-validatie mislukt:\n- " + problems.join("\n- "));
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* SQL-helpers                                                         */
/* ------------------------------------------------------------------ */
const text = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v === null || v === undefined ? "null::numeric" : `${Number(v)}::numeric`);
const json = (v) => (v === null || v === undefined ? "null" : `${text(JSON.stringify(v))}::jsonb`);
const textArray = (list) => (list.length ? `array[${list.map(text).join(", ")}]::text[]` : "'{}'::text[]");

function recipeSql(r) {
  const lines = [];
  lines.push(`-- ${r.title}`);
  lines.push(
    `insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values (${text(r.id)}, ${text(r.slug)}, 'platform', null, true, ${text(r.title)}, ${text(r.subtitle)}, ${text(r.description)}, ${text(r.story)}, ${text(r.course)}, ${text(r.difficulty)}, ${r.servings}, ${r.prepMinutes}, ${r.cookMinutes}, ${r.restMinutes ?? 0}, ${json(r.dish)}, ${text(r.tone)}, ${textArray(r.tags)}, ${textArray(r.equipment)}, ${text(r.plating.intro)}, ${text(r.chefTip)}, ${text(r.pairing ?? null)})
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;`,
  );
  for (const table of ["recipe_categories", "recipe_ingredients", "recipe_steps", "plating_steps"]) {
    lines.push(`delete from public.${table} where recipe_id = ${text(r.id)};`);
  }
  if (r.categories.length) {
    lines.push(`insert into public.recipe_categories (recipe_id, category_id) values ${r.categories.map((c) => `(${text(r.id)}, ${text(c)})`).join(", ")};`);
  }

  const items = r.ingredients.flatMap((g) => g.items.map((item) => ({ group: g.group, item })));
  const names = [...new Map(items.map(({ item }) => [item[2].toLowerCase(), item[2]])).values()];
  lines.push(`insert into public.ingredients (name) values ${names.map((n) => `(${text(n)})`).join(", ")} on conflict do nothing;`);
  lines.push(
    `insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select ${text(r.id)}::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
${items.map(({ group, item: [q, unit, name, note] }, idx) => `  (${idx + 1}, ${text(group)}::text, ${num(q)}, ${text(unit)}::text, ${text(name)}::text, ${text(note ?? null)}::text)`).join(",\n")}
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);`,
  );

  lines.push(
    `insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
${r.steps.map((s, idx) => `  (${text(r.id)}, ${idx + 1}, ${text(s.title)}, ${text(s.body)}, ${text(s.phase)}, ${json(s.scene)}, ${s.timer ?? "null"}, ${text(s.tip ?? null)})`).join(",\n")};`,
  );
  lines.push(
    `insert into public.plating_steps (recipe_id, stage, title, body) values
${r.plating.steps.map((body, stage) => `  (${text(r.id)}, ${stage}, ${text(PLATING_STAGES[stage].title)}, ${text(body)})`).join(",\n")};`,
  );
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Bestanden schrijven                                                 */
/* ------------------------------------------------------------------ */
mkdirSync(outDir, { recursive: true });

const categorySql = [
  "-- Gangen en categorieën (gegenereerd door scripts/generate-seed.mjs)",
  `insert into public.categories (id, label, kind, sort_order) values
${[
  ...COURSES.map((c, i) => `  (${text(c)}, ${text(COURSE_LABEL[c])}, 'course', ${i})`),
  ...CATEGORIES.map((c, i) => `  (${text(c)}, ${text(CATEGORY_LABEL[c])}, 'category', ${i})`),
].join(",\n")}
on conflict (id) do update set label = excluded.label, kind = excluded.kind, sort_order = excluded.sort_order;`,
].join("\n");
writeFileSync(join(outDir, "20260915120100_seed_categories.sql"), categorySql + "\n");

const CHUNK = 9;
const files = [];
for (let i = 0; i < recipes.length; i += CHUNK) {
  const part = String(i / CHUNK + 1).padStart(2, "0");
  const name = `20260915120${200 + i / CHUNK}_seed_recipes_${part}.sql`;
  const body = [`-- Platformrecepten deel ${part} (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)`, ...recipes.slice(i, i + CHUNK).map(recipeSql)].join("\n\n");
  writeFileSync(join(outDir, name), body + "\n");
  files.push(name);
}

console.log(`OK: ${recipes.length} recepten, ${CATEGORIES.length + COURSES.length} categorieën`);
console.log(["20260915120100_seed_categories.sql", ...files].join("\n"));
