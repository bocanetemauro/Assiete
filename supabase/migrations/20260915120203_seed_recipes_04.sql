-- Platformrecepten deel 04 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Lamsrack met kruidenkorst
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 'lamsrack-met-kruidenkorst', 'platform', null, true, 'Lamsrack met kruidenkorst', 'Lamsjus, doperwten en krieltjes', 'Rosé gegaarde lamskoteletjes met een felgroene korst van kruiden en panko, een glanzende lamsjus en voorjaarsgroenten.', 'Een lamsrack leert je drie dingen tegelijk: frenchen, op kerntemperatuur garen en een echte jus trekken van botjes. De korst zorgt voor kleur en crunch.', 'hoofdgerecht', 'uitdagend', 4, 30, 80, 8, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"swoosh","color":"jus"},"main":{"kind":"chops","color":"lamb","accent":"herbCrust","count":3},"garnish":[{"kind":"potatoes"},{"kind":"peas"},{"kind":"shallots"}],"herbs":["rosemary","mint","flakes"]}'::jsonb, '#ECE4DC', array['frenchen', 'korst', 'jus', 'rosé garen']::text[], array['Uitbeenmes', 'Koekenpan', 'Oven', 'Kernthermometer', 'Keukenmachine', 'Steelpan']::text[], 'Drie koteletjes die tegen elkaar leunen geven hoogte; de jus zet de beweging.', 'Wikkel de blanke botjes in folie tijdens het braden: zo blijven ze ivoorwit op het bord.', 'Een Pauillac of een Rioja Reserva.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'c4b0a884-f420-4bd0-ac46-820f98d4ec10';
delete from public.recipe_ingredients where recipe_id = 'c4b0a884-f420-4bd0-ac46-820f98d4ec10';
delete from public.recipe_steps where recipe_id = 'c4b0a884-f420-4bd0-ac46-820f98d4ec10';
delete from public.plating_steps where recipe_id = 'c4b0a884-f420-4bd0-ac46-820f98d4ec10';
insert into public.recipe_categories (recipe_id, category_id) values ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 'vlees'), ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 'sauzen');
insert into public.ingredients (name) values ('lamsracks'), ('olijfolie'), ('Dijonmosterd'), ('zeezout en peper'), ('panko'), ('platte peterselie'), ('rozemarijn'), ('knoflook'), ('zachte boter'), ('citroen'), ('lamsbotjes en afsnijdsels'), ('ui'), ('wortel'), ('tomatenpuree'), ('rode wijn'), ('kalfsfond'), ('krieltjes'), ('doperwten'), ('kleine sjalotten'), ('munt') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'c4b0a884-f420-4bd0-ac46-820f98d4ec10'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Lam'::text, 2::numeric, 'stuks'::text, 'lamsracks'::text, 'van 4 ribben, gefrenchd'::text),
  (2, 'Lam'::text, 1::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (3, 'Lam'::text, 1::numeric, 'el'::text, 'Dijonmosterd'::text, null::text),
  (4, 'Lam'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (5, 'Kruidenkorst'::text, 60::numeric, 'g'::text, 'panko'::text, null::text),
  (6, 'Kruidenkorst'::text, 20::numeric, 'g'::text, 'platte peterselie'::text, null::text),
  (7, 'Kruidenkorst'::text, 2::numeric, 'takjes'::text, 'rozemarijn'::text, null::text),
  (8, 'Kruidenkorst'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (9, 'Kruidenkorst'::text, 40::numeric, 'g'::text, 'zachte boter'::text, null::text),
  (10, 'Kruidenkorst'::text, 1::numeric, 'stuks'::text, 'citroen'::text, 'rasp'::text),
  (11, 'Lamsjus'::text, 500::numeric, 'g'::text, 'lamsbotjes en afsnijdsels'::text, null::text),
  (12, 'Lamsjus'::text, 1::numeric, 'stuks'::text, 'ui'::text, null::text),
  (13, 'Lamsjus'::text, 1::numeric, 'stuks'::text, 'wortel'::text, null::text),
  (14, 'Lamsjus'::text, 1::numeric, 'el'::text, 'tomatenpuree'::text, null::text),
  (15, 'Lamsjus'::text, 150::numeric, 'ml'::text, 'rode wijn'::text, null::text),
  (16, 'Lamsjus'::text, 500::numeric, 'ml'::text, 'kalfsfond'::text, null::text),
  (17, 'Garnituur'::text, 300::numeric, 'g'::text, 'krieltjes'::text, null::text),
  (18, 'Garnituur'::text, 150::numeric, 'g'::text, 'doperwten'::text, null::text),
  (19, 'Garnituur'::text, 4::numeric, 'stuks'::text, 'kleine sjalotten'::text, null::text),
  (20, 'Garnituur'::text, 4::numeric, 'blaadjes'::text, 'munt'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 1, 'Trek de lamsjus', 'Rooster botjes en groenten bruin, roer tomatenpuree erdoor, blus af met wijn en voeg fond toe. Laat 1 uur zacht trekken, zeef en reduceer tot de jus een lepel bedekt.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 3600, 'Een goede jus glanst zonder bindmiddel: dat doet de gelatine uit de botjes.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 2, 'Maak de kruidenkorst', 'Mix panko, kruiden, knoflook, boter en citroenrasp tot een felgroene, vochtige kruim.', 'saus', '{"key":"blend","tone":"herb"}'::jsonb, null, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 3, 'Kruid en braad aan', 'Kruid de racks en braad ze op de vetkant goudbruin, daarna kort op alle kanten.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 240, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 4, 'Korst en oven', 'Bestrijk het vlees met mosterd en druk de kruidenkorst erop. Gaar 12 à 15 minuten op 200 °C tot een kerntemperatuur van 54 °C.', 'kruiden', '{"key":"season","item":"steak"}'::jsonb, 840, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 5, 'Laat rusten', 'Laat het lam 8 minuten rusten onder losjes aangelegd folie.', 'rusten', '{"key":"rest","item":"steak"}'::jsonb, 480, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 6, 'Gaar de garnituur', 'Kook de krieltjes gaar, blancheer de doperwten 1 minuut en karamelliseer de gehalveerde sjalotten in boter.', 'garen', '{"key":"boil","item":"vegetables"}'::jsonb, 900, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 7, 'Snijd tussen de ribben', 'Snijd de racks tussen de ribben door in koteletjes. Het snijvlak moet egaal rosé zijn.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, null),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 8, 'Dresseer', 'Trek een swoosh jus, zet de koteletjes tegen elkaar en werk af met krieltjes, erwten en sjalot.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 0, 'Begin met een schoon bord', 'Kies een wit bord zodat het groen van de korst en het rosé vlees contrasteren.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 1, 'Plaats de saus', 'Trek een swoosh glanzende lamsjus diagonaal over het bord.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 2, 'Positioneer het hoofdonderdeel', 'Zet drie koteletjes met de botjes schuin omhoog tegen elkaar, net naast het midden.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 3, 'Voeg garnituur toe', 'Verdeel krieltjes, doperwten en gekarameliseerde sjalot in kleine groepjes.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 4, 'Werk af met kruiden', 'Werk af met rozemarijn, munt en vlokzout op het snijvlak.'),
  ('c4b0a884-f420-4bd0-ac46-820f98d4ec10', 5, 'Maak de rand van het bord schoon', 'Veeg jusdruppels van de rand — donkere saus op wit porselein valt meteen op.');

-- Varkenshaas met appel en calvadosjus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 'varkenshaas-met-appel-en-calvadosjus', 'platform', null, true, 'Varkenshaas met appel en calvadosjus', 'Knolselderijcrème en krokante salie', 'Sappige, licht rosé varkenshaas met gekarameliseerde appel, knolselderijcrème en een romige pan-saus van calvados en cider.', 'De beste sauzen ontstaan in de pan waarin je het vlees bakt. Deglaceren met calvados en cider maakt van aanbaksel een glanzende jus met herfstsmaken.', 'hoofdgerecht', 'gemiddeld', 4, 20, 40, 5, '{"plate":"stoneware","layout":"diagonal","sauce":{"style":"swoosh","color":"caramel"},"main":{"kind":"slices","color":"pork","accent":"crust","count":5},"garnish":[{"kind":"appleFan","color":"apple"},{"kind":"crisps"}],"herbs":["sage","flakes"]}'::jsonb, '#EFE5D8', array['pan-saus', 'deglaceren', 'herfst', 'flamberen']::text[], array['Koekenpan', 'Kernthermometer', 'Oven', 'Steelpan', 'Blender']::text[], 'Herfst op een bord: warm karamel, glanzende jus en krokante salie.', 'Flambeer met de afzuigkap uit en de pan even van het vuur: pas dan de alcohol aansteken.', 'Een Normandische cidre bouché of een Chardonnay uit de Jura.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3';
delete from public.recipe_ingredients where recipe_id = '30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3';
delete from public.recipe_steps where recipe_id = '30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3';
delete from public.plating_steps where recipe_id = '30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3';
insert into public.recipe_categories (recipe_id, category_id) values ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 'vlees'), ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 'sauzen');
insert into public.ingredients (name) values ('varkenshaas'), ('olie'), ('boter'), ('salie'), ('zeezout en peper'), ('sjalot'), ('calvados'), ('appelcider'), ('kalfsfond'), ('room'), ('koude boter'), ('stevige appels'), ('suiker'), ('knolselderij'), ('melk') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Varkenshaas'::text, 600::numeric, 'g'::text, 'varkenshaas'::text, 'schoongemaakt'::text),
  (2, 'Varkenshaas'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (3, 'Varkenshaas'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Varkenshaas'::text, 4::numeric, 'blaadjes'::text, 'salie'::text, null::text),
  (5, 'Varkenshaas'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (6, 'Calvadosjus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (7, 'Calvadosjus'::text, 50::numeric, 'ml'::text, 'calvados'::text, null::text),
  (8, 'Calvadosjus'::text, 100::numeric, 'ml'::text, 'appelcider'::text, null::text),
  (9, 'Calvadosjus'::text, 200::numeric, 'ml'::text, 'kalfsfond'::text, null::text),
  (10, 'Calvadosjus'::text, 50::numeric, 'ml'::text, 'room'::text, null::text),
  (11, 'Calvadosjus'::text, 15::numeric, 'g'::text, 'koude boter'::text, null::text),
  (12, 'Garnituur'::text, 2::numeric, 'stuks'::text, 'stevige appels'::text, 'Elstar of Jonagold'::text),
  (13, 'Garnituur'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (14, 'Garnituur'::text, 1::numeric, 'tl'::text, 'suiker'::text, null::text),
  (15, 'Garnituur'::text, 150::numeric, 'g'::text, 'knolselderij'::text, 'voor crème'::text),
  (16, 'Garnituur'::text, 100::numeric, 'ml'::text, 'melk'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 1, 'Maak de varkenshaas schoon', 'Verwijder vliesjes en zenen met een dun mes en haal de haas 20 minuten voor het bakken uit de koelkast.', 'mise-en-place', '{"key":"prep","item":"steak"}'::jsonb, null, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 2, 'Maak knolselderijcrème', 'Kook de knolselderij 20 minuten in melk met zout en mix tot een gladde crème.', 'garen', '{"key":"boil","item":"cauliflower"}'::jsonb, 1200, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 3, 'Braad de haas aan', 'Kruid en braad de haas rondom bruin. Voeg boter en salie toe en arroseer 1 minuut.', 'bakken', '{"key":"baste","item":"steak"}'::jsonb, 360, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 4, 'Gaar in de oven', 'Gaar de haas 10 à 12 minuten op 180 °C tot een kerntemperatuur van 60 °C. Laat 5 minuten rusten.', 'rusten', '{"key":"rest","item":"steak"}'::jsonb, 720, 'Varkenshaas mag licht rosé: 60 °C is veilig en blijft sappig.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 5, 'Karamelliseer de appel', 'Snijd de appels in partjes en bak ze in boter met een snuf suiker goudbruin maar nog stevig.', 'bakken', '{"key":"sear","item":"apple"}'::jsonb, 240, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 6, 'Maak de calvadosjus', 'Fruit sjalot in het bakvet, flambeer met calvados, voeg cider en fond toe en reduceer tot de helft. Roer room erdoor en monteer met koude boter.', 'saus', '{"key":"simmer","tone":"caramel"}'::jsonb, 480, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 7, 'Snijd de haas', 'Snijd de haas schuin in medaillons van 2 cm.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, null),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 8, 'Dresseer', 'Trek een swoosh jus langs de crème, leg de medaillons erop en werk af met appel en salie.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 0, 'Begin met een schoon bord', 'Kies een zandkleurig stoneware bord dat de warme herfstkleuren versterkt.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 1, 'Plaats de saus', 'Leg een lepel knolselderijcrème neer en trek de calvadosjus er als swoosh langs.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 2, 'Positioneer het hoofdonderdeel', 'Leg de medaillons varkenshaas dakpansgewijs langs de swoosh.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 3, 'Voeg garnituur toe', 'Plaats een waaier gekarameliseerde appel en een paar knolselderijchips voor crunch.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 4, 'Werk af met kruiden', 'Werk af met krokante salie en vlokzout.'),
  ('30bd2d49-9c03-48a0-9e8b-7dfd8e4d88d3', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer de rest van de jus in een kannetje.');

-- Hertenrug met rode kool
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 'hertenrug-met-rode-kool', 'platform', null, true, 'Hertenrug met rode kool', 'Jeneverbessenjus en bramen', 'Rosé gebakken hertenrug met gestoofde rode kool, een diepe jus van port en jeneverbes, verse bramen en pastinaakchips.', 'Wild vraagt om respect: weinig vet, veel smaak en een smalle marge tussen perfect en taai. Jeneverbes en bramen brengen de smaak van het bos op het bord.', 'hoofdgerecht', 'uitdagend', 4, 30, 75, 8, '{"plate":"slate","layout":"diagonal","sauce":{"style":"swoosh","color":"cherryJus"},"main":{"kind":"slices","color":"venison","accent":"crust","count":4},"garnish":[{"kind":"berries","variant":"blueberry"},{"kind":"beets"},{"kind":"crisps"}],"herbs":["thyme","flakes"]}'::jsonb, '#E6DFDF', array['wild', 'jus', 'winter', 'rosé bakken']::text[], array['Gietijzeren pan', 'Kernthermometer', 'Vijzel', 'Stoofpan', 'Fijne zeef']::text[], 'Een donker bord voor een donker gerecht: glans en rood zorgen voor diepte.', 'Leg het vlees na het rusten nog 30 seconden terug in de hete pan: zo is de korst weer knapperig en warm.', 'Een Châteauneuf-du-Pape of een Barolo.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '6f3be349-bfb8-496b-82d2-53a0d4d81bcd';
delete from public.recipe_ingredients where recipe_id = '6f3be349-bfb8-496b-82d2-53a0d4d81bcd';
delete from public.recipe_steps where recipe_id = '6f3be349-bfb8-496b-82d2-53a0d4d81bcd';
delete from public.plating_steps where recipe_id = '6f3be349-bfb8-496b-82d2-53a0d4d81bcd';
insert into public.recipe_categories (recipe_id, category_id) values ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 'vlees'), ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 'sauzen');
insert into public.ingredients (name) values ('hertenrugfilet'), ('jeneverbessen'), ('tijm'), ('boter'), ('zeezout en peper'), ('rode kool'), ('appel'), ('rode wijnazijn'), ('bruine suiker'), ('kaneelstokje'), ('kruidnagels'), ('sjalot'), ('rode port'), ('wildfond'), ('bramengelei'), ('koude boter'), ('bramen'), ('pastinaak') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '6f3be349-bfb8-496b-82d2-53a0d4d81bcd'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Hertenrug'::text, 600::numeric, 'g'::text, 'hertenrugfilet'::text, 'schoongemaakt'::text),
  (2, 'Hertenrug'::text, 6::numeric, 'stuks'::text, 'jeneverbessen'::text, 'gekneusd'::text),
  (3, 'Hertenrug'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (4, 'Hertenrug'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (5, 'Hertenrug'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (6, 'Rode kool'::text, 400::numeric, 'g'::text, 'rode kool'::text, 'fijn gesneden'::text),
  (7, 'Rode kool'::text, 1::numeric, 'stuks'::text, 'appel'::text, null::text),
  (8, 'Rode kool'::text, 40::numeric, 'ml'::text, 'rode wijnazijn'::text, null::text),
  (9, 'Rode kool'::text, 2::numeric, 'el'::text, 'bruine suiker'::text, null::text),
  (10, 'Rode kool'::text, 1::numeric, 'stuks'::text, 'kaneelstokje'::text, null::text),
  (11, 'Rode kool'::text, 2::numeric, 'stuks'::text, 'kruidnagels'::text, null::text),
  (12, 'Jeneverbessenjus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (13, 'Jeneverbessenjus'::text, 100::numeric, 'ml'::text, 'rode port'::text, null::text),
  (14, 'Jeneverbessenjus'::text, 300::numeric, 'ml'::text, 'wildfond'::text, null::text),
  (15, 'Jeneverbessenjus'::text, 4::numeric, 'stuks'::text, 'jeneverbessen'::text, null::text),
  (16, 'Jeneverbessenjus'::text, 1::numeric, 'tl'::text, 'bramengelei'::text, null::text),
  (17, 'Jeneverbessenjus'::text, 15::numeric, 'g'::text, 'koude boter'::text, null::text),
  (18, 'Garnituur'::text, 100::numeric, 'g'::text, 'bramen'::text, null::text),
  (19, 'Garnituur'::text, 1::numeric, 'stuks'::text, 'pastinaak'::text, 'voor chips'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 1, 'Stoof de rode kool', 'Stoof rode kool met appel, azijn, suiker en specerijen 1 uur zacht met het deksel op de pan.', 'garen', '{"key":"simmer","tone":"cherry"}'::jsonb, 3600, null),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 2, 'Kruid met jeneverbes', 'Kneus de jeneverbessen in een vijzel en wrijf ze met peper over het hertenvlees.', 'kruiden', '{"key":"season","item":"steak"}'::jsonb, null, null),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 3, 'Braad de hertenrug', 'Braad het vlees in een zeer hete pan rondom bruin. Voeg boter en tijm toe en arroseer.', 'bakken', '{"key":"baste","item":"steak"}'::jsonb, 300, null),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 4, 'Gaar na en laat rusten', 'Gaar kort na in de oven tot een kerntemperatuur van 52 °C en laat 8 minuten rusten. Wild droogt snel uit: liever te rosé dan te gaar.', 'rusten', '{"key":"rest","item":"steak"}'::jsonb, 480, 'Hertenvlees heeft bijna geen vet; te lang garen maakt het taai en leverachtig.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 5, 'Maak de jus', 'Fruit sjalot, blus af met port, voeg wildfond en jeneverbessen toe en reduceer. Roer bramengelei erdoor, zeef en monteer met boter.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 600, null),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 6, 'Snijd het vlees', 'Snijd de hertenrug in dikke plakken tegen de draad in.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, null),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 7, 'Dresseer', 'Trek een swoosh jus, leg rode kool en hertenrug erop en werk af met bramen en pastinaakchips.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 0, 'Begin met een schoon bord', 'Kies een matzwart bord; de dieprode jus en het rosé vlees lichten erop op.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 1, 'Plaats de saus', 'Trek een swoosh jeneverbessenjus diagonaal over het bord.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 2, 'Positioneer het hoofdonderdeel', 'Leg een quenelle rode kool als basis en waaier de plakken hertenrug ertegenaan.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 3, 'Voeg garnituur toe', 'Verdeel bramen en een paar pastinaakchips voor hoogte.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 4, 'Werk af met kruiden', 'Werk af met tijm en een vlokje zout op het vlees.'),
  ('6f3be349-bfb8-496b-82d2-53a0d4d81bcd', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — op een donker bord zie je elke druppel.');

-- Kip suprême met morieljesaus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('994d29f1-3467-4781-95d5-113e86ac8f29', 'kip-supreme-met-morieljesaus', 'platform', null, true, 'Kip suprême met morieljesaus', 'Krokant vel, vin jaune en voorjaarsgroenten', 'Een sappige kip suprême met krokant goudbruin vel op een romige saus van morieljes en vin jaune, met asperges en tuinbonen.', 'Kip wordt pas bijzonder als het vel krokant is en het vlees sappig blijft. De morieljesaus is een klassieker uit de Jura die laat zien hoeveel smaak er in een weekvocht zit.', 'hoofdgerecht', 'gemiddeld', 4, 35, 40, 0, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"pool","color":"cream","accent":"mushroom"},"main":{"kind":"fillet","color":"goldenSkin","accent":"chicken"},"garnish":[{"kind":"mushrooms"},{"kind":"asparagus"},{"kind":"peas"}],"herbs":["chervil","pepper"]}'::jsonb, '#EFE8DC', array['suprême', 'krokant vel', 'roomsaus', 'klassiek Frans']::text[], array['Koekenpan', 'Oven', 'Kernthermometer', 'Steelpan', 'Koffiefilter']::text[], 'Een klassiek Frans bord: krokant vel boven op een zijdezachte saus, nooit eronder.', 'Zeef het weekvocht van de morieljes altijd door een koffiefilter: het is goud waard voor de saus, het zand niet.', 'Een Chardonnay uit de Jura of een glas vin jaune.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '994d29f1-3467-4781-95d5-113e86ac8f29';
delete from public.recipe_ingredients where recipe_id = '994d29f1-3467-4781-95d5-113e86ac8f29';
delete from public.recipe_steps where recipe_id = '994d29f1-3467-4781-95d5-113e86ac8f29';
delete from public.plating_steps where recipe_id = '994d29f1-3467-4781-95d5-113e86ac8f29';
insert into public.recipe_categories (recipe_id, category_id) values ('994d29f1-3467-4781-95d5-113e86ac8f29', 'vlees'), ('994d29f1-3467-4781-95d5-113e86ac8f29', 'sauzen'), ('994d29f1-3467-4781-95d5-113e86ac8f29', 'technieken');
insert into public.ingredients (name) values ('kip suprêmes'), ('olie'), ('boter'), ('tijm'), ('zeezout en peper'), ('gedroogde morieljes'), ('sjalot'), ('vin jaune of droge sherry'), ('gevogeltefond'), ('room'), ('citroensap'), ('groene asperges'), ('tuinbonen of doperwten'), ('kervel') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '994d29f1-3467-4781-95d5-113e86ac8f29'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Kip'::text, 4::numeric, 'stuks'::text, 'kip suprêmes'::text, 'met vel en vleugelbotje'::text),
  (2, 'Kip'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (3, 'Kip'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Kip'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (5, 'Kip'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (6, 'Morieljesaus'::text, 20::numeric, 'g'::text, 'gedroogde morieljes'::text, null::text),
  (7, 'Morieljesaus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (8, 'Morieljesaus'::text, 50::numeric, 'ml'::text, 'vin jaune of droge sherry'::text, null::text),
  (9, 'Morieljesaus'::text, 200::numeric, 'ml'::text, 'gevogeltefond'::text, null::text),
  (10, 'Morieljesaus'::text, 150::numeric, 'ml'::text, 'room'::text, null::text),
  (11, 'Morieljesaus'::text, 1::numeric, 'tl'::text, 'citroensap'::text, null::text),
  (12, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'groene asperges'::text, null::text),
  (13, 'Garnituur'::text, 100::numeric, 'g'::text, 'tuinbonen of doperwten'::text, null::text),
  (14, 'Garnituur'::text, 4::numeric, 'takjes'::text, 'kervel'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 1, 'Week de morieljes', 'Week de morieljes 30 minuten in lauw water. Knijp ze uit, zeef het weekvocht door een koffiefilter en spoel de morieljes goed na: ze bevatten vaak zand.', 'mise-en-place', '{"key":"prep","item":"mushrooms"}'::jsonb, 1800, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 2, 'Kruid de kip', 'Dep het vel kurkdroog en kruid de suprêmes aan beide kanten.', 'kruiden', '{"key":"season","item":"chicken"}'::jsonb, null, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 3, 'Bak het vel krokant', 'Leg de suprêmes met het vel naar beneden in een middelhete pan met olie. Bak 8 minuten zonder te bewegen tot het vel diep goudbruin en krokant is.', 'bakken', '{"key":"sear","item":"chicken"}'::jsonb, 480, 'Druk de kip de eerste minuut licht aan met een spatel: zo raakt het hele vel de pan.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 4, 'Arroseer en gaar in de oven', 'Draai om, voeg boter en tijm toe, arroseer en gaar 12 minuten op 180 °C tot een kerntemperatuur van 72 °C.', 'bakken', '{"key":"baste","item":"chicken"}'::jsonb, 720, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 5, 'Maak de morieljesaus', 'Fruit sjalot en morieljes in boter, blus af met vin jaune, voeg fond en weekvocht toe en reduceer tot de helft. Voeg room toe en laat indikken tot de saus een lepel bedekt.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 600, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 6, 'Blancheer de groenten', 'Blancheer asperges en bonen kort in gezouten water en spoel ze in ijswater.', 'garen', '{"key":"boil","item":"vegetables"}'::jsonb, 120, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 7, 'Laat rusten en snijd', 'Laat de kip 5 minuten rusten en snijd hem schuin in twee stukken.', 'rusten', '{"key":"rest","item":"duck"}'::jsonb, 300, null),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 8, 'Dresseer', 'Schep de saus in een spiegel, leg de kip erop met het vel naar boven en verdeel morieljes en groenten.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 0, 'Begin met een schoon bord', 'Kies een wit bord met een brede rand.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 1, 'Plaats de saus', 'Schep de morieljesaus in een ovale spiegel en leg er een paar morieljes in.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 2, 'Positioneer het hoofdonderdeel', 'Leg de gesneden suprême op de saus, met het krokante vel naar boven en het snijvlak zichtbaar.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 3, 'Voeg garnituur toe', 'Verdeel asperges, tuinbonen en extra morieljes rond de kip.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 4, 'Werk af met kruiden', 'Werk af met kervel en een draai peper.'),
  ('994d29f1-3467-4781-95d5-113e86ac8f29', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer direct, zodat het vel krokant blijft.');

-- Runderwang met aardappelmousseline
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 'runderwang-met-aardappelmousseline', 'platform', null, true, 'Runderwang met aardappelmousseline', 'Drie uur gestoofd in rode wijn', 'Langzaam gebraiseerde runderwang in een glanzende rodewijnsaus, op een zijdezachte aardappelmousseline met geglaceerde groenten.', 'Braiseren verandert een taai stuk vlees in iets dat je met een lepel eet. Het vraagt tijd, geen moeite — en de saus die overblijft is de beloning.', 'hoofdgerecht', 'gemiddeld', 4, 30, 210, 0, '{"plate":"bowl-stone","layout":"offset","sauce":{"style":"smear","color":"parsnip","accent":"jus"},"main":{"kind":"medallions","color":"jus","accent":"crust","count":2},"garnish":[{"kind":"carrots"},{"kind":"shallots"},{"kind":"mushrooms"}],"herbs":["thyme","flakes"]}'::jsonb, '#EAE1D8', array['braiseren', 'stoven', 'mousseline', 'winter']::text[], array['Gietijzeren stoofpan', 'Oven', 'Pureeknijper', 'Steelpan', 'Fijne zeef']::text[], 'Comfortfood met restaurantallure: een glanzende wang op een wolk van mousseline.', 'Braiseer de wangen een dag van tevoren: afgekoeld in het stoofvocht worden ze nog malser en is de saus makkelijk te ontvetten.', 'Een Côtes du Rhône of een Malbec uit Mendoza.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '6e87b396-9c6b-43e3-bb04-7813e35de1dd';
delete from public.recipe_ingredients where recipe_id = '6e87b396-9c6b-43e3-bb04-7813e35de1dd';
delete from public.recipe_steps where recipe_id = '6e87b396-9c6b-43e3-bb04-7813e35de1dd';
delete from public.plating_steps where recipe_id = '6e87b396-9c6b-43e3-bb04-7813e35de1dd';
insert into public.recipe_categories (recipe_id, category_id) values ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 'vlees'), ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 'technieken');
insert into public.ingredients (name) values ('runderwangen'), ('olie'), ('ui'), ('wortels'), ('knoflook'), ('tomatenpuree'), ('krachtige rode wijn'), ('runderfond'), ('tijm'), ('laurierblad'), ('kruimige aardappelen'), ('koude boter'), ('warme melk'), ('nootmuskaat'), ('bospeentjes'), ('zilveruitjes'), ('kleine champignons') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '6e87b396-9c6b-43e3-bb04-7813e35de1dd'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Runderwang'::text, 4::numeric, 'stuks'::text, 'runderwangen'::text, 'schoongemaakt'::text),
  (2, 'Runderwang'::text, 2::numeric, 'el'::text, 'olie'::text, null::text),
  (3, 'Runderwang'::text, 1::numeric, 'stuks'::text, 'ui'::text, null::text),
  (4, 'Runderwang'::text, 2::numeric, 'stuks'::text, 'wortels'::text, null::text),
  (5, 'Runderwang'::text, 2::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (6, 'Runderwang'::text, 1::numeric, 'el'::text, 'tomatenpuree'::text, null::text),
  (7, 'Runderwang'::text, 500::numeric, 'ml'::text, 'krachtige rode wijn'::text, null::text),
  (8, 'Runderwang'::text, 500::numeric, 'ml'::text, 'runderfond'::text, null::text),
  (9, 'Runderwang'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (10, 'Runderwang'::text, 1::numeric, 'stuks'::text, 'laurierblad'::text, null::text),
  (11, 'Mousseline'::text, 600::numeric, 'g'::text, 'kruimige aardappelen'::text, null::text),
  (12, 'Mousseline'::text, 150::numeric, 'g'::text, 'koude boter'::text, null::text),
  (13, 'Mousseline'::text, 100::numeric, 'ml'::text, 'warme melk'::text, null::text),
  (14, 'Mousseline'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (15, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'bospeentjes'::text, null::text),
  (16, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'zilveruitjes'::text, null::text),
  (17, 'Garnituur'::text, 100::numeric, 'g'::text, 'kleine champignons'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 1, 'Braad de wangen aan', 'Dep de wangen droog, kruid ze en braad ze rondom diepbruin in hete olie. Neem ze uit de pan.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 480, null),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 2, 'Snijd en fruit de groenten', 'Snijd ui, wortel en knoflook grof en fruit ze bruin in het bakvet. Roer de tomatenpuree erdoor.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 3, 'Braiseer', 'Blus af met wijn, reduceer tot de helft en voeg fond, kruiden en wangen toe. Stoof afgedekt 3 uur op 150 °C tot de wangen met een lepel uit elkaar vallen.', 'garen', '{"key":"simmer","tone":"jus"}'::jsonb, 10800, 'Het vocht moet de wangen voor driekwart bedekken: zo garen ze en krijgt de bovenkant een glans.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 4, 'Reduceer de saus', 'Neem de wangen uit, zeef het stoofvocht en reduceer tot een glanzende, stroperige saus. Glaceer de wangen erin.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 900, null),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 5, 'Maak de mousseline', 'Kook de aardappelen in de schil gaar, pel ze warm en druk ze door een pureeknijper. Klop de koude boter blokje voor blokje erdoor en daarna de warme melk.', 'garen', '{"key":"boil","item":"potato"}'::jsonb, 1500, 'Nooit mixen: een staafmixer maakt aardappelpuree taai en lijmerig.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 6, 'Glaceer de garnituur', 'Glaceer bospeen en zilveruitjes met een klontje boter en een lepel saus; bak de champignons goudbruin.', 'bakken', '{"key":"sear","item":"mushrooms"}'::jsonb, 480, null),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 7, 'Dresseer', 'Trek een veeg mousseline, leg de wang erop en verdeel de groenten. Lepel extra saus over het vlees.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 0, 'Begin met een schoon bord', 'Kies een diep stoneware bord dat warmte uitstraalt.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 1, 'Plaats de saus', 'Trek een brede veeg aardappelmousseline door het bord.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 2, 'Positioneer het hoofdonderdeel', 'Leg de geglaceerde wang rechts van het midden op de mousseline.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 3, 'Voeg garnituur toe', 'Verdeel bospeen, zilveruitjes en champignons rond het vlees.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 4, 'Werk af met kruiden', 'Lepel extra saus over de wang zodat hij glanst, en werk af met tijm en vlokzout.'),
  ('6e87b396-9c6b-43e3-bb04-7813e35de1dd', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — mousseline en jus laten snel vegen achter.');

-- Beef Wellington
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 'beef-wellington', 'platform', null, true, 'Beef Wellington', 'Ossenhaas, duxelles en bladerdeeg', 'Rosé ossenhaas omhuld met paddenstoelenduxelles, Parmaham en goudbruin bladerdeeg, met een glanzende rodewijnjus.', 'De Wellington is een showstopper en een examen tegelijk: aanbraden, een droge duxelles, strak inpakken en precies op kerntemperatuur bakken. Het snijvlak vertelt of alles gelukt is.', 'hoofdgerecht', 'uitdagend', 6, 60, 50, 55, '{"plate":"porcelain","layout":"trio","sauce":{"style":"swoosh","color":"jus"},"main":{"kind":"roll","color":"beef","accent":"pastry","count":2},"garnish":[{"kind":"carrots"},{"kind":"dots","color":"pea"},{"kind":"mushrooms"}],"herbs":["thyme","flakes"]}'::jsonb, '#EDE4DA', array['bladerdeeg', 'duxelles', 'showstopper', 'feestdagen']::text[], array['Koekenpan', 'Keukenmachine', 'Vershoudfolie', 'Oven', 'Kernthermometer', 'Kwast']::text[], 'Het snijvlak is de show: roze kern, donkere duxelles, gouden deeg.', 'Een dunne crêpe tussen ham en deeg vangt vocht op — zo blijft de bodem krokant, ook als je de Wellington even laat staan.', 'Een Bordeaux van de linkeroever of een Barolo.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '08055f58-7e0d-4537-a31b-6e39d7bf7c6e';
delete from public.recipe_ingredients where recipe_id = '08055f58-7e0d-4537-a31b-6e39d7bf7c6e';
delete from public.recipe_steps where recipe_id = '08055f58-7e0d-4537-a31b-6e39d7bf7c6e';
delete from public.plating_steps where recipe_id = '08055f58-7e0d-4537-a31b-6e39d7bf7c6e';
insert into public.recipe_categories (recipe_id, category_id) values ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 'vlees'), ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 'technieken');
insert into public.ingredients (name) values ('ossenhaas'), ('olie'), ('Engelse mosterd'), ('zeezout en peper'), ('kastanjechampignons'), ('sjalot'), ('tijm'), ('boter'), ('droge witte wijn'), ('Parmaham'), ('roomboterbladerdeeg'), ('eidooiers'), ('melk'), ('rode wijn'), ('kalfsfond'), ('koude boter') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '08055f58-7e0d-4537-a31b-6e39d7bf7c6e'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vlees'::text, 800::numeric, 'g'::text, 'ossenhaas'::text, 'middenstuk, schoongemaakt'::text),
  (2, 'Vlees'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (3, 'Vlees'::text, 1::numeric, 'el'::text, 'Engelse mosterd'::text, null::text),
  (4, 'Vlees'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (5, 'Duxelles'::text, 500::numeric, 'g'::text, 'kastanjechampignons'::text, null::text),
  (6, 'Duxelles'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (7, 'Duxelles'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (8, 'Duxelles'::text, 30::numeric, 'g'::text, 'boter'::text, null::text),
  (9, 'Duxelles'::text, 50::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (10, 'Omhulsel'::text, 8::numeric, 'sneetjes'::text, 'Parmaham'::text, null::text),
  (11, 'Omhulsel'::text, 400::numeric, 'g'::text, 'roomboterbladerdeeg'::text, null::text),
  (12, 'Omhulsel'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (13, 'Omhulsel'::text, 1::numeric, 'el'::text, 'melk'::text, null::text),
  (14, 'Rodewijnjus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (15, 'Rodewijnjus'::text, 200::numeric, 'ml'::text, 'rode wijn'::text, null::text),
  (16, 'Rodewijnjus'::text, 300::numeric, 'ml'::text, 'kalfsfond'::text, null::text),
  (17, 'Rodewijnjus'::text, 15::numeric, 'g'::text, 'koude boter'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 1, 'Braad de ossenhaas aan', 'Kruid de ossenhaas en braad hem in een zeer hete pan rondom bruin, 1 minuut per kant. Bestrijk warm met mosterd en laat afkoelen.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 240, null),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 2, 'Hak de champignons', 'Hak champignons en sjalot in de keukenmachine zeer fijn.', 'snijden', '{"key":"chop","item":"mushrooms"}'::jsonb, null, null),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 3, 'Bak de duxelles droog', 'Bak het mengsel met boter en tijm tot al het vocht verdampt is en het een droge pasta vormt. Blus af met wijn en laat opnieuw droogkoken. Laat afkoelen.', 'bakken', '{"key":"sear","item":"mushrooms"}'::jsonb, 900, 'Natte duxelles maakt het deeg klef: bak door tot de pan bijna droog ruist.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 4, 'Rol in ham en duxelles', 'Leg de ham dakpansgewijs op folie, smeer de duxelles erover, leg de haas erop en rol strak op met de folie. Draai de uiteinden aan en laat 30 minuten opstijven in de koelkast.', 'mise-en-place', '{"key":"prep","item":"steak"}'::jsonb, 1800, null),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 5, 'Omwikkel met bladerdeeg', 'Rol het vlees in het bladerdeeg, sluit de naad aan de onderkant en bestrijk met dooier. Kerf een patroon met de rug van een mes en koel nog 15 minuten.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, 900, null),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 6, 'Bak goudbruin', 'Bak 25 à 30 minuten op 210 °C tot het deeg diep goudbruin is en de kern 52 °C bereikt.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 1800, 'Zet de Wellington op een voorverwarmde bakplaat: zo wordt ook de bodem krokant.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 7, 'Laat rusten en maak de jus', 'Laat de Wellington 10 minuten rusten. Reduceer intussen wijn met sjalot, voeg fond toe, reduceer opnieuw en monteer met boter.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 600, null),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 8, 'Snijd en dresseer', 'Snijd dikke plakken met een gekarteld mes en serveer op de jus met groenten.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 0, 'Begin met een schoon bord', 'Kies een groot wit bord; laat het snijvlak het werk doen.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 1, 'Plaats de saus', 'Trek een swoosh rodewijnjus in een lichte boog.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 2, 'Positioneer het hoofdonderdeel', 'Leg twee dikke plakken licht overlappend op de jus, met het snijvlak naar boven.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 3, 'Voeg garnituur toe', 'Plaats geglaceerde worteltjes, champignons en een paar stippen erwtencrème.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 4, 'Werk af met kruiden', 'Werk af met tijm en vlokzout op het vlees.'),
  ('08055f58-7e0d-4537-a31b-6e39d7bf7c6e', 5, 'Maak de rand van het bord schoon', 'Veeg deegkruimels en jusdruppels van de rand.');

-- Bavette met béarnaise
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('c76c735f-b72d-403a-a386-d93e9cf71d17', 'bavette-met-bearnaise', 'platform', null, true, 'Bavette met béarnaise', 'Krokante aardappeltjes en waterkers', 'Hoog en kort gebakken bavette, dun gesneden tegen de draad in, met een klassieke béarnaise van dragon en krokante aardappeltjes.', 'Béarnaise is de koning van de bistrosauzen: een warme emulsie met het karakter van dragon en azijn. Leer hem één keer goed, en elke steak thuis wordt een restaurantbord.', 'hoofdgerecht', 'gemiddeld', 2, 20, 35, 5, '{"plate":"slate","layout":"diagonal","sauce":{"style":"dots","color":"hollandaise"},"main":{"kind":"slices","color":"beef","accent":"crust","count":5},"garnish":[{"kind":"potatoes"},{"kind":"leaves","color":"green"}],"herbs":["chervil","flakes","pepper"]}'::jsonb, '#E9E1DB', array['béarnaise', 'bistro', 'emulsie', 'hoog vuur']::text[], array['Gietijzeren pan', 'Steelpan met kom', 'Garde', 'Fijne zeef', 'Kernthermometer']::text[], 'Bistro met finesse: gesneden vlees, een royale quenelle béarnaise en krokante aardappel.', 'De vezels van bavette lopen dwars over het stuk: snijd dus in de lengte, tegen de draad in.', 'Een Beaujolais cru of een Côtes du Rhône.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'c76c735f-b72d-403a-a386-d93e9cf71d17';
delete from public.recipe_ingredients where recipe_id = 'c76c735f-b72d-403a-a386-d93e9cf71d17';
delete from public.recipe_steps where recipe_id = 'c76c735f-b72d-403a-a386-d93e9cf71d17';
delete from public.plating_steps where recipe_id = 'c76c735f-b72d-403a-a386-d93e9cf71d17';
insert into public.recipe_categories (recipe_id, category_id) values ('c76c735f-b72d-403a-a386-d93e9cf71d17', 'vlees'), ('c76c735f-b72d-403a-a386-d93e9cf71d17', 'sauzen');
insert into public.ingredients (name) values ('bavette'), ('olie'), ('grof zeezout en peper'), ('sjalot'), ('dragonazijn'), ('droge witte wijn'), ('gekneusde witte peperkorrels'), ('dragon'), ('eidooiers'), ('geklaarde boter'), ('gehakte dragon'), ('gehakte kervel'), ('kleine aardappelen'), ('waterkers') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'c76c735f-b72d-403a-a386-d93e9cf71d17'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vlees'::text, 500::numeric, 'g'::text, 'bavette'::text, null::text),
  (2, 'Vlees'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (3, 'Vlees'::text, null::numeric, 'naar smaak'::text, 'grof zeezout en peper'::text, null::text),
  (4, 'Reductie'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (5, 'Reductie'::text, 60::numeric, 'ml'::text, 'dragonazijn'::text, null::text),
  (6, 'Reductie'::text, 60::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (7, 'Reductie'::text, 1::numeric, 'tl'::text, 'gekneusde witte peperkorrels'::text, null::text),
  (8, 'Reductie'::text, 3::numeric, 'takjes'::text, 'dragon'::text, null::text),
  (9, 'Béarnaise'::text, 3::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (10, 'Béarnaise'::text, 175::numeric, 'g'::text, 'geklaarde boter'::text, 'warm'::text),
  (11, 'Béarnaise'::text, 1::numeric, 'el'::text, 'gehakte dragon'::text, null::text),
  (12, 'Béarnaise'::text, 1::numeric, 'el'::text, 'gehakte kervel'::text, null::text),
  (13, 'Garnituur'::text, 400::numeric, 'g'::text, 'kleine aardappelen'::text, null::text),
  (14, 'Garnituur'::text, 1::numeric, 'handje'::text, 'waterkers'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 1, 'Maak de reductie', 'Kook sjalot, azijn, wijn, peper en dragonstelen in tot er 2 eetlepels vocht over zijn. Zeef en laat afkoelen.', 'saus', '{"key":"simmer","tone":"wine"}'::jsonb, 300, null),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 2, 'Klop de béarnaise', 'Klop dooiers met de reductie boven zacht kokend water tot een lintdikke sabayon. Klop de warme geklaarde boter er druppelsgewijs door en roer de kruiden erdoor.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, 'Béarnaise is een hollandaise met karakter: de reductie geeft zuur en aroma.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 3, 'Bak de aardappelen', 'Kook de aardappelen beetgaar, halveer ze en bak ze in olie krokant.', 'bakken', '{"key":"sear","item":"potato"}'::jsonb, 1500, null),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 4, 'Kruid de bavette', 'Dep de bavette droog en kruid royaal met grof zout en peper.', 'kruiden', '{"key":"season","item":"steak"}'::jsonb, null, null),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 5, 'Bak hoog en kort', 'Bak de bavette op hoog vuur 3 minuten per kant tot een kerntemperatuur van 52 °C. Bavette hoort rosé: doorbakken wordt hij taai.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 360, null),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 6, 'Laat rusten en snijd', 'Laat 5 minuten rusten en snijd dun tegen de draad in — bij bavette is dat essentieel voor malsheid.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, 300, null),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 7, 'Dresseer', 'Leg het vlees dakpansgewijs, zet er een quenelle béarnaise tegen en werk af met aardappeltjes en waterkers.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 0, 'Begin met een schoon bord', 'Kies een donker bord voor contrast met de gele saus en het rosé vlees.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 1, 'Plaats de saus', 'Zet een paar stippen béarnaise als ankerpunten en houd een lepel apart voor een quenelle.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 2, 'Positioneer het hoofdonderdeel', 'Leg de gesneden bavette dakpansgewijs diagonaal over het bord.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 3, 'Voeg garnituur toe', 'Zet een quenelle béarnaise tegen het vlees en verdeel krokante aardappeltjes en waterkers.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 4, 'Werk af met kruiden', 'Werk af met kervel, vlokzout en peper op het snijvlak.'),
  ('c76c735f-b72d-403a-a386-d93e9cf71d17', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon.');

-- Kabeljauw met mosselen en saffraansaus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 'kabeljauw-met-mosselen-en-saffraan', 'platform', null, true, 'Kabeljauw met mosselen en saffraansaus', 'Zacht gegaarde vis, zeekraal en venkel', 'Parelmoerwitte kabeljauw, zacht gegaard in boter, in een schuimige saffraansaus van mosselkookvocht, met mosselen en zeekraal.', 'Door kabeljauw op lage temperatuur te garen valt hij in glanzende lamellen uiteen. De saus is gemaakt van het kookvocht van de mosselen: niets gaat verloren.', 'hoofdgerecht', 'gemiddeld', 4, 30, 35, 0, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"saffron","accent":"herbOil"},"main":{"kind":"fillet","color":"whiteFish","accent":"whiteFish"},"garnish":[{"kind":"mussels"},{"kind":"samphire"},{"kind":"tomatoes"}],"herbs":["chives","dill"]}'::jsonb, '#EFE6D2', array['lage temperatuur', 'mosselen', 'saffraan', 'zeesaus']::text[], array['Hoge pan met deksel', 'Ovenschaal', 'Steelpan', 'Fijne zeef met doek', 'Staafmixer']::text[], 'Een diep bord en een gouden saus: de zee in één lepel.', 'Voeg geen zout toe aan de saus voordat je proeft: mosselvocht is van nature al zilt.', 'Een Pouilly-Fumé of een witte Bourgogne.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '868d2ef7-620c-475d-9da3-6f6226b96ba1';
delete from public.recipe_ingredients where recipe_id = '868d2ef7-620c-475d-9da3-6f6226b96ba1';
delete from public.recipe_steps where recipe_id = '868d2ef7-620c-475d-9da3-6f6226b96ba1';
delete from public.plating_steps where recipe_id = '868d2ef7-620c-475d-9da3-6f6226b96ba1';
insert into public.recipe_categories (recipe_id, category_id) values ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 'vis'), ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 'sauzen');
insert into public.ingredients (name) values ('kabeljauwhaasjes'), ('grof zeezout'), ('boter'), ('mosselen'), ('sjalot'), ('droge witte wijn'), ('saffraandraadjes'), ('venkelknol'), ('mosselkookvocht'), ('room'), ('koude boter'), ('zeekraal'), ('kerstomaatjes'), ('bieslook') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '868d2ef7-620c-475d-9da3-6f6226b96ba1'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Kabeljauw'::text, 4::numeric, 'stuks'::text, 'kabeljauwhaasjes'::text, '± 140 g, zonder vel'::text),
  (2, 'Kabeljauw'::text, 1::numeric, 'el'::text, 'grof zeezout'::text, null::text),
  (3, 'Kabeljauw'::text, 30::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Mosselen'::text, 1::numeric, 'kg'::text, 'mosselen'::text, null::text),
  (5, 'Mosselen'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (6, 'Mosselen'::text, 150::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (7, 'Saffraansaus'::text, 1::numeric, 'snuf'::text, 'saffraandraadjes'::text, null::text),
  (8, 'Saffraansaus'::text, 0.5::numeric, 'stuks'::text, 'venkelknol'::text, null::text),
  (9, 'Saffraansaus'::text, 150::numeric, 'ml'::text, 'mosselkookvocht'::text, null::text),
  (10, 'Saffraansaus'::text, 100::numeric, 'ml'::text, 'room'::text, null::text),
  (11, 'Saffraansaus'::text, 40::numeric, 'g'::text, 'koude boter'::text, null::text),
  (12, 'Afwerking'::text, 60::numeric, 'g'::text, 'zeekraal'::text, null::text),
  (13, 'Afwerking'::text, 8::numeric, 'stuks'::text, 'kerstomaatjes'::text, 'gepeld'::text),
  (14, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 1, 'Zout de kabeljauw', 'Bestrooi de kabeljauw licht met grof zout en laat 10 minuten staan. Spoel af en dep droog: de vis wordt steviger en valt mooi in lamellen.', 'kruiden', '{"key":"season","item":"fish"}'::jsonb, 600, null),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 2, 'Maak de mosselen schoon', 'Spoel de mosselen, verwijder de baardjes en gooi open exemplaren die niet sluiten bij een tik weg.', 'mise-en-place', '{"key":"prep","item":"mussels"}'::jsonb, null, null),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 3, 'Stoom de mosselen', 'Fruit sjalot, voeg mosselen en wijn toe en stoom afgedekt 3 à 4 minuten tot ze opengaan. Zeef het kookvocht door een doek en haal de mosselen uit de schelp.', 'garen', '{"key":"simmer","tone":"wine"}'::jsonb, 240, 'Mosselen die na het koken dicht blijven, gooi je weg.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 4, 'Gaar de kabeljauw zacht', 'Leg de kabeljauw in een ingevette schaal met klontjes boter en gaar 10 à 12 minuten op 120 °C tot een kerntemperatuur van 48 °C.', 'garen', '{"key":"baste","item":"fish"}'::jsonb, 660, null),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 5, 'Maak de saffraansaus', 'Stoof fijngesneden venkel in boter, voeg saffraan en mosselvocht toe en reduceer tot de helft. Voeg room toe, laat indikken en mix met koude boter tot een schuimige saus.', 'saus', '{"key":"simmer","tone":"saffron"}'::jsonb, 600, null),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 6, 'Dresseer', 'Schenk de saus in een diep bord, leg de kabeljauw erin en verdeel mosselen, zeekraal en tomaatjes.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 0, 'Begin met een schoon bord', 'Warm diepe borden voor, zodat de saus niet afkoelt.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 1, 'Plaats de saus', 'Schenk een laagje schuimige saffraansaus in het bord en druppel er bieslookolie in.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 2, 'Positioneer het hoofdonderdeel', 'Leg de kabeljauw iets uit het midden in de saus, zodat de parelmoerwitte bovenkant zichtbaar blijft.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 3, 'Voeg garnituur toe', 'Verdeel mosselen, zeekraal en gepelde kerstomaatjes rond de vis.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 4, 'Werk af met kruiden', 'Werk af met bieslook en een toefje dille.'),
  ('868d2ef7-620c-475d-9da3-6f6226b96ba1', 5, 'Maak de rand van het bord schoon', 'Veeg sausspatten van de brede rand.');

-- Tarbot met champagnesaus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('6e5f045c-7636-435e-8442-ecc5c706748c', 'tarbot-met-champagnesaus', 'platform', null, true, 'Tarbot met champagnesaus', 'Gestoofde prei en kaviaar', 'Glanzend gebakken tarbot op een verfijnde champagnesaus, met zijdezachte prei en een quenelle kaviaar.', 'Tarbot is de koning van de platvissen: stevig, zoet en luxueus. De saus is een variant op beurre blanc waarin champagne twee keer terugkomt — in de reductie en vlak voor het serveren.', 'hoofdgerecht', 'uitdagend', 4, 30, 30, 0, '{"plate":"porcelain","layout":"center","sauce":{"style":"pool","color":"champagne"},"main":{"kind":"fillet","color":"whiteFish","accent":"whiteFish"},"garnish":[{"kind":"roe","color":"ink"},{"kind":"asparagus"},{"kind":"dots","color":"herbOil"}],"herbs":["chives","chervil"]}'::jsonb, '#ECEAE2', array['feestelijk', 'platvis', 'kaviaar', 'monteren']::text[], array['Visspatel', 'Koekenpan', 'Steelpan', 'Garde', 'Fijne zeef']::text[], 'Luxe vraagt om soberheid: wit op wit, met één zwart accent.', 'Schep kaviaar nooit met een metalen lepel: metaal geeft een bijsmaak. Gebruik parelmoer, hoorn of een houten lepeltje.', 'De champagne uit de saus, of een blanc de blancs.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '6e5f045c-7636-435e-8442-ecc5c706748c';
delete from public.recipe_ingredients where recipe_id = '6e5f045c-7636-435e-8442-ecc5c706748c';
delete from public.recipe_steps where recipe_id = '6e5f045c-7636-435e-8442-ecc5c706748c';
delete from public.plating_steps where recipe_id = '6e5f045c-7636-435e-8442-ecc5c706748c';
insert into public.recipe_categories (recipe_id, category_id) values ('6e5f045c-7636-435e-8442-ecc5c706748c', 'vis'), ('6e5f045c-7636-435e-8442-ecc5c706748c', 'sauzen');
insert into public.ingredients (name) values ('tarbotfilets'), ('boter'), ('olie'), ('fleur de sel'), ('sjalot'), ('droge champagne of crémant'), ('visfond'), ('room'), ('koude boter'), ('dunne prei'), ('kaviaar'), ('bieslook') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '6e5f045c-7636-435e-8442-ecc5c706748c'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Tarbot'::text, 4::numeric, 'stuks'::text, 'tarbotfilets'::text, '± 150 g'::text),
  (2, 'Tarbot'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (3, 'Tarbot'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (4, 'Tarbot'::text, null::numeric, 'naar smaak'::text, 'fleur de sel'::text, null::text),
  (5, 'Champagnesaus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (6, 'Champagnesaus'::text, 200::numeric, 'ml'::text, 'droge champagne of crémant'::text, null::text),
  (7, 'Champagnesaus'::text, 100::numeric, 'ml'::text, 'visfond'::text, null::text),
  (8, 'Champagnesaus'::text, 100::numeric, 'ml'::text, 'room'::text, null::text),
  (9, 'Champagnesaus'::text, 60::numeric, 'g'::text, 'koude boter'::text, null::text),
  (10, 'Garnituur'::text, 1::numeric, 'stuks'::text, 'dunne prei'::text, null::text),
  (11, 'Garnituur'::text, 20::numeric, 'g'::text, 'kaviaar'::text, 'of forelkuit'::text),
  (12, 'Garnituur'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 1, 'Maak de filets klaar', 'Dep de tarbot droog, verwijder eventuele velresten en laat de filets 15 minuten op kamertemperatuur komen.', 'mise-en-place', '{"key":"prep","item":"fish"}'::jsonb, null, null),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 2, 'Snijd en stoof de prei', 'Snijd het witte deel van de prei in ringen van 1 cm en stoof ze zacht in boter tot ze zijdezacht zijn.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 3, 'Reduceer de champagne', 'Kook sjalot met champagne en visfond in tot een derde. Houd een scheut champagne achter voor het einde.', 'saus', '{"key":"simmer","tone":"wine"}'::jsonb, 600, null),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 4, 'Monteer de saus', 'Voeg room toe, laat kort indikken en klop de koude boter blokje voor blokje erdoor. Zeef en voeg vlak voor het serveren de laatste scheut champagne toe.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, 'De achtergehouden champagne geeft de saus weer frisheid: pas toevoegen als de borden klaarstaan.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 5, 'Bak de tarbot', 'Bak de filets 2 minuten in olie tot ze licht kleuren, voeg boter toe en arroseer tot het vlees net ondoorzichtig is.', 'bakken', '{"key":"baste","item":"fish"}'::jsonb, 300, null),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 6, 'Dresseer', 'Schep de saus in een spiegel, leg de tarbot erop en werk af met prei, kaviaar en bieslook.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 0, 'Begin met een schoon bord', 'Kies een wit bord met een brede rand; kaviaar en saus zijn het decor.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 1, 'Plaats de saus', 'Schep de champagnesaus in een ronde spiegel in het midden.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 2, 'Positioneer het hoofdonderdeel', 'Leg de tarbot in het midden van de saus, met de mooiste bakkant naar boven.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 3, 'Voeg garnituur toe', 'Leg gestoofde prei tegen de vis en zet een quenelle kaviaar op de filet.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 4, 'Werk af met kruiden', 'Werk af met bieslookpijltjes en een blaadje kervel.'),
  ('6e5f045c-7636-435e-8442-ecc5c706748c', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — deze saus vergeeft geen vegen.');
