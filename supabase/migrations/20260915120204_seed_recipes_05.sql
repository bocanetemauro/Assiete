-- Platformrecepten deel 05 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Zeeduivel met lardo en beurre rouge
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 'zeeduivel-met-lardo-en-beurre-rouge', 'platform', null, true, 'Zeeduivel met lardo en beurre rouge', 'Oesterzwammen en zilveruitjes', 'Medaillons van zeeduivel omwikkeld met lardo, goudbruin gebakken en geserveerd op een glanzende beurre rouge van rode wijn en port.', 'Zeeduivel heeft de stevigheid van vlees en verdraagt daarom een rodewijnsaus. De lardo voegt zout en vet toe aan de magere vis en zorgt voor een krokante rand.', 'hoofdgerecht', 'gemiddeld', 4, 25, 30, 0, '{"plate":"slate","layout":"trio","sauce":{"style":"swoosh","color":"cherryJus"},"main":{"kind":"medallions","color":"golden","accent":"chicken","count":3},"garnish":[{"kind":"mushrooms"},{"kind":"shallots"},{"kind":"leaves","color":"green"}],"herbs":["thyme","flakes"]}'::jsonb, '#E5E0DE', array['vis met rode wijn', 'beurre rouge', 'medaillons', 'monteren']::text[], array['Koekenpan', 'Keukentouw', 'Steelpan', 'Garde', 'Fijne zeef']::text[], 'Drie medaillons in een lijn op een dieprode saus: vis met de allure van vlees.', 'Zeeduivel verliest veel vocht: dep hem vlak voordat hij de pan in gaat nog een keer goed droog.', 'Een lichte Pinot Noir uit de Elzas of een Saumur-Champigny.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '6fc53372-02c0-4aeb-81d9-b76f74cd7c74';
delete from public.recipe_ingredients where recipe_id = '6fc53372-02c0-4aeb-81d9-b76f74cd7c74';
delete from public.recipe_steps where recipe_id = '6fc53372-02c0-4aeb-81d9-b76f74cd7c74';
delete from public.plating_steps where recipe_id = '6fc53372-02c0-4aeb-81d9-b76f74cd7c74';
insert into public.recipe_categories (recipe_id, category_id) values ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 'vis'), ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 'sauzen');
insert into public.ingredients (name) values ('zeeduivelstaart'), ('lardo di Colonnata'), ('olie'), ('boter'), ('sjalotten'), ('rode wijn'), ('rode port'), ('koude boter'), ('oesterzwammen'), ('zilveruitjes'), ('snijbiet') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '6fc53372-02c0-4aeb-81d9-b76f74cd7c74'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Zeeduivel'::text, 600::numeric, 'g'::text, 'zeeduivelstaart'::text, 'schoongemaakt, zonder vlies'::text),
  (2, 'Zeeduivel'::text, 12::numeric, 'sneetjes'::text, 'lardo di Colonnata'::text, null::text),
  (3, 'Zeeduivel'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (4, 'Zeeduivel'::text, 15::numeric, 'g'::text, 'boter'::text, null::text),
  (5, 'Beurre rouge'::text, 2::numeric, 'stuks'::text, 'sjalotten'::text, null::text),
  (6, 'Beurre rouge'::text, 250::numeric, 'ml'::text, 'rode wijn'::text, 'Pinot Noir'::text),
  (7, 'Beurre rouge'::text, 50::numeric, 'ml'::text, 'rode port'::text, null::text),
  (8, 'Beurre rouge'::text, 120::numeric, 'g'::text, 'koude boter'::text, 'in blokjes'::text),
  (9, 'Garnituur'::text, 150::numeric, 'g'::text, 'oesterzwammen'::text, null::text),
  (10, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'zilveruitjes'::text, null::text),
  (11, 'Garnituur'::text, 1::numeric, 'handje'::text, 'snijbiet'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 1, 'Maak de zeeduivel schoon', 'Verwijder alle grijze vliezen van de zeeduivel: ze trekken samen tijdens het bakken. Snijd in medaillons van 4 cm.', 'mise-en-place', '{"key":"prep","item":"fish"}'::jsonb, null, null),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 2, 'Omwikkel met lardo', 'Wikkel een sneetje lardo rond elk medaillon en zet vast met keukentouw. Lardo geeft zout en vet aan de magere vis.', 'kruiden', '{"key":"season","item":"fish"}'::jsonb, null, null),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 3, 'Reduceer de wijn', 'Kook sjalot, rode wijn en port in tot een stroperige reductie van 3 eetlepels.', 'saus', '{"key":"simmer","tone":"cherry"}'::jsonb, 900, null),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 4, 'Monteer de beurre rouge', 'Klop op laag vuur de koude boter blokje voor blokje door de reductie tot een glanzende, fluweelzachte saus. Zeef en houd warm.', 'saus', '{"key":"whisk","tone":"cherry"}'::jsonb, null, 'Houd de saus tussen 50 en 60 °C: warmer schift ze, kouder stolt de boter.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 5, 'Bak de medaillons', 'Bak de medaillons op de lardokant rondom goudbruin, voeg boter toe en arroseer tot de kern 52 °C is.', 'bakken', '{"key":"baste","item":"fish"}'::jsonb, 420, null),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 6, 'Bak de paddenstoelen', 'Bak oesterzwammen en zilveruitjes goudbruin en slink de snijbiet kort.', 'bakken', '{"key":"sear","item":"mushrooms"}'::jsonb, 300, null),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 7, 'Dresseer', 'Trek een swoosh beurre rouge, zet de medaillons erop en verdeel paddenstoelen, uitjes en snijbiet.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 0, 'Begin met een schoon bord', 'Kies een donker bord zodat de glanzende rode saus diepte krijgt.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 1, 'Plaats de saus', 'Trek een swoosh beurre rouge in een lichte boog.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 2, 'Positioneer het hoofdonderdeel', 'Zet drie medaillons op gelijke afstand op de saus, met de touwtjes verwijderd.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 3, 'Voeg garnituur toe', 'Verdeel oesterzwammen, zilveruitjes en snijbiet in de open ruimtes.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 4, 'Werk af met kruiden', 'Werk af met tijm en een vlokje zout op elk medaillon.'),
  ('6fc53372-02c0-4aeb-81d9-b76f74cd7c74', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon.');

-- Forel meunière met amandel
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 'forel-meuniere-met-amandel', 'platform', null, true, 'Forel meunière met amandel', 'Bruine boter, kappertjes en citroen', 'Goudbruin gebakken forelfilets in een schuimende beurre noisette met geroosterde amandelen, kappertjes, citroen en peterselie.', 'Meunière betekent ''op de manier van de molenaarsvrouw'': vis door de bloem, gebakken in boter. Een eenvoudige klassieker die leert hoe dun de lijn is tussen bruine en verbrande boter.', 'hoofdgerecht', 'makkelijk', 2, 15, 25, 0, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"dots","color":"brownButter"},"main":{"kind":"fillet","color":"goldenSkin","accent":"trout"},"garnish":[{"kind":"citrus","color":"lemon"},{"kind":"potatoes"},{"kind":"nuts"}],"herbs":["chervil","flakes"]}'::jsonb, '#EEE8DE', array['meunière', 'beurre noisette', 'klassiek Frans', 'snel']::text[], array['Grote koekenpan', 'Visspatel', 'Diep bord met bloem', 'Keukenpapier']::text[], 'De meest klassieke visbereiding: goudbruine vis en een boter die aan tafel nog schuimt.', 'Bruine boter gaat in tien seconden van perfect naar verbrand: haal de pan van het vuur zodra hij naar hazelnoot ruikt.', 'Een Chablis of een droge Riesling uit de Elzas.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '4c5772b4-75c8-414e-bd84-059a1a8767ef';
delete from public.recipe_ingredients where recipe_id = '4c5772b4-75c8-414e-bd84-059a1a8767ef';
delete from public.recipe_steps where recipe_id = '4c5772b4-75c8-414e-bd84-059a1a8767ef';
delete from public.plating_steps where recipe_id = '4c5772b4-75c8-414e-bd84-059a1a8767ef';
insert into public.recipe_categories (recipe_id, category_id) values ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 'vis'), ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 'technieken');
insert into public.ingredients (name) values ('forelfilets'), ('bloem'), ('olie'), ('zeezout en peper'), ('boter'), ('amandelschaafsel'), ('citroen'), ('kappertjes'), ('platte peterselie'), ('krieltjes') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '4c5772b4-75c8-414e-bd84-059a1a8767ef'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Forel'::text, 2::numeric, 'stuks'::text, 'forelfilets'::text, 'met vel'::text),
  (2, 'Forel'::text, 30::numeric, 'g'::text, 'bloem'::text, null::text),
  (3, 'Forel'::text, 1::numeric, 'el'::text, 'olie'::text, null::text),
  (4, 'Forel'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (5, 'Meunièreboter'::text, 60::numeric, 'g'::text, 'boter'::text, null::text),
  (6, 'Meunièreboter'::text, 30::numeric, 'g'::text, 'amandelschaafsel'::text, null::text),
  (7, 'Meunièreboter'::text, 1::numeric, 'stuks'::text, 'citroen'::text, 'sap'::text),
  (8, 'Meunièreboter'::text, 1::numeric, 'el'::text, 'kappertjes'::text, null::text),
  (9, 'Meunièreboter'::text, 1::numeric, 'el'::text, 'platte peterselie'::text, 'gehakt'::text),
  (10, 'Garnituur'::text, 300::numeric, 'g'::text, 'krieltjes'::text, null::text),
  (11, 'Garnituur'::text, 1::numeric, 'stuks'::text, 'citroen'::text, 'in partjes'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 1, 'Kook de krieltjes', 'Kook de krieltjes in gezouten water gaar en houd ze warm.', 'garen', '{"key":"boil","item":"potato"}'::jsonb, 1200, null),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 2, 'Kruid en bebloem', 'Dep de forel droog, kruid met zout en peper en haal hem door de bloem. Klop overtollige bloem goed af.', 'kruiden', '{"key":"season","item":"fish"}'::jsonb, null, 'Een dun laagje bloem geeft een goudbruine korst; te veel wordt pap.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 3, 'Bak de forel', 'Bak de filets in olie op het vel 3 minuten tot ze goudbruin zijn, draai om en bak nog 1 minuut. Leg ze op een warm bord.', 'bakken', '{"key":"sear","item":"fish"}'::jsonb, 240, null),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 4, 'Maak beurre noisette', 'Veeg de pan schoon, laat de boter schuimen tot hij nootachtig bruin kleurt en rooster het amandelschaafsel mee.', 'saus', '{"key":"simmer","tone":"brown-butter"}'::jsonb, 120, null),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 5, 'Maak af met citroen', 'Haal de pan van het vuur en voeg citroensap, kappertjes en peterselie toe. Het schuimt hevig: dat hoort zo.', 'saus', '{"key":"whisk","tone":"brown-butter"}'::jsonb, null, null),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 6, 'Dresseer', 'Leg de forel op het bord, lepel de schuimende boter erover en serveer met krieltjes en citroen.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 0, 'Begin met een schoon bord', 'Warm een wit bord voor; bruine boter mag niet stollen.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 1, 'Plaats de saus', 'Zet een paar stippen bruine boter als basis voor de vis.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 2, 'Positioneer het hoofdonderdeel', 'Leg de forel diagonaal op het bord met het krokante vel naar boven.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 3, 'Voeg garnituur toe', 'Lepel amandelen en kappertjes over de vis en leg krieltjes en een partje citroen ernaast.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 4, 'Werk af met kruiden', 'Werk af met kervel of peterselie en een vlokje zout.'),
  ('4c5772b4-75c8-414e-bd84-059a1a8767ef', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer onmiddellijk.');

-- Bouillabaisse met rouille
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('8058e45d-c403-403a-83a7-6fbed293b4aa', 'bouillabaisse-met-rouille', 'platform', null, true, 'Bouillabaisse met rouille', 'Provençaalse vissoep met saffraan', 'Een intense, goudkleurige vissoep met saffraan, venkel en sinaasappel, met gepocheerde witvis, gamba''s, mosselen en een pittige rouille.', 'Bouillabaisse was ooit het restjesmaal van vissers in Marseille. Vandaag is het een feestgerecht dat laat zien hoeveel smaak je uit graten en koppen kunt halen.', 'hoofdgerecht', 'uitdagend', 6, 45, 90, 0, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"saffron","accent":"romesco"},"main":{"kind":"prawns","color":"shrimp","count":3},"garnish":[{"kind":"mussels"},{"kind":"cubes","color":"whiteFish"},{"kind":"dots","color":"romesco"}],"herbs":["dill","pepper"]}'::jsonb, '#F0E3D2', array['Provençaals', 'fumet', 'rouille', 'feestmaal']::text[], array['Grote soeppan', 'Passe-vite of blender', 'Fijne zeef', 'Vijzel', 'Oven']::text[], 'Een feestelijke vissoep verdient een diep bord: vis en zeevruchten boven de gouden soep.', 'Serveer traditioneel in twee gangen: eerst de soep met rouille-toast, daarna de vis en zeevruchten.', 'Een witte Bandol of een rosé uit Cassis.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '8058e45d-c403-403a-83a7-6fbed293b4aa';
delete from public.recipe_ingredients where recipe_id = '8058e45d-c403-403a-83a7-6fbed293b4aa';
delete from public.recipe_steps where recipe_id = '8058e45d-c403-403a-83a7-6fbed293b4aa';
delete from public.plating_steps where recipe_id = '8058e45d-c403-403a-83a7-6fbed293b4aa';
insert into public.recipe_categories (recipe_id, category_id) values ('8058e45d-c403-403a-83a7-6fbed293b4aa', 'vis'), ('8058e45d-c403-403a-83a7-6fbed293b4aa', 'soep'), ('8058e45d-c403-403a-83a7-6fbed293b4aa', 'sauzen');
insert into public.ingredients (name) values ('visgraten en koppen'), ('venkelknol'), ('ui'), ('knoflook'), ('tomaten'), ('tomatenpuree'), ('saffraan'), ('sinaasappel'), ('pastis'), ('water'), ('gemengde witvis'), ('gamba''s'), ('mosselen'), ('eidooier'), ('piment d''Espelette'), ('olijfolie'), ('kleine gekookte aardappel'), ('stokbrood'), ('dille of venkelloof') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '8058e45d-c403-403a-83a7-6fbed293b4aa'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Soepbasis'::text, 1::numeric, 'kg'::text, 'visgraten en koppen'::text, 'van witvis'::text),
  (2, 'Soepbasis'::text, 1::numeric, 'stuks'::text, 'venkelknol'::text, null::text),
  (3, 'Soepbasis'::text, 1::numeric, 'stuks'::text, 'ui'::text, null::text),
  (4, 'Soepbasis'::text, 3::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (5, 'Soepbasis'::text, 400::numeric, 'g'::text, 'tomaten'::text, null::text),
  (6, 'Soepbasis'::text, 1::numeric, 'el'::text, 'tomatenpuree'::text, null::text),
  (7, 'Soepbasis'::text, 1::numeric, 'snuf'::text, 'saffraan'::text, null::text),
  (8, 'Soepbasis'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'schil'::text),
  (9, 'Soepbasis'::text, 100::numeric, 'ml'::text, 'pastis'::text, 'optioneel'::text),
  (10, 'Soepbasis'::text, 2::numeric, 'l'::text, 'water'::text, null::text),
  (11, 'Vis'::text, 600::numeric, 'g'::text, 'gemengde witvis'::text, 'kabeljauw, poon of zeeduivel'::text),
  (12, 'Vis'::text, 12::numeric, 'stuks'::text, 'gamba''s'::text, null::text),
  (13, 'Vis'::text, 500::numeric, 'g'::text, 'mosselen'::text, null::text),
  (14, 'Rouille'::text, 1::numeric, 'stuks'::text, 'eidooier'::text, null::text),
  (15, 'Rouille'::text, 2::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (16, 'Rouille'::text, 1::numeric, 'snuf'::text, 'saffraan'::text, null::text),
  (17, 'Rouille'::text, 1::numeric, 'snuf'::text, 'piment d''Espelette'::text, null::text),
  (18, 'Rouille'::text, 150::numeric, 'ml'::text, 'olijfolie'::text, null::text),
  (19, 'Rouille'::text, 1::numeric, 'stuks'::text, 'kleine gekookte aardappel'::text, null::text),
  (20, 'Afwerking'::text, 6::numeric, 'sneetjes'::text, 'stokbrood'::text, 'geroosterd'::text),
  (21, 'Afwerking'::text, 4::numeric, 'takjes'::text, 'dille of venkelloof'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 1, 'Rooster de graten', 'Rooster de visgraten en koppen in olijfolie tot ze licht kleuren.', 'bakken', '{"key":"sear","item":"fish"}'::jsonb, 600, null),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 2, 'Fruit de groenten', 'Snijd venkel, ui en knoflook grof en fruit ze mee met de graten. Voeg tomaat en tomatenpuree toe.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 3, 'Trek de soep', 'Voeg water, saffraan, sinaasappelschil en pastis toe en laat 45 minuten zacht koken. Druk alles door een passe-vite en zeef de soep.', 'garen', '{"key":"simmer","tone":"saffron"}'::jsonb, 2700, 'Druk de graten stevig uit: daar zit de smaak en de binding van de soep.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 4, 'Maak de rouille', 'Stamp knoflook, saffraan en aardappel in een vijzel tot een pasta. Klop de dooier erdoor en voeg de olie druppelsgewijs toe tot een stevige, oranjerode mayonaise.', 'saus', '{"key":"whisk","tone":"saffron"}'::jsonb, null, null),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 5, 'Pocheer de vis', 'Breng de soep tegen de kook, pocheer de witvis 4 minuten, voeg gamba''s en mosselen toe en gaar nog 2 minuten tot de mosselen opengaan.', 'garen', '{"key":"simmer","tone":"saffron"}'::jsonb, 360, null),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 6, 'Dresseer', 'Schenk soep in diepe borden, leg vis en zeevruchten erin en serveer met rouille en geroosterd brood.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 0, 'Begin met een schoon bord', 'Warm diepe borden voor en zet de geroosterde broodjes klaar.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 1, 'Plaats de saus', 'Schenk een laag gouden soep in het bord en zet een paar stippen rouille op het oppervlak.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 2, 'Positioneer het hoofdonderdeel', 'Leg de gepocheerde vis en de gamba''s in een hoog eilandje net naast het midden.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 3, 'Voeg garnituur toe', 'Verdeel mosselen in hun schelp rond de vis.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 4, 'Werk af met kruiden', 'Werk af met dille of venkelloof en een snuf peper; serveer de rouille-toast apart.'),
  ('8058e45d-c403-403a-83a7-6fbed293b4aa', 5, 'Maak de rand van het bord schoon', 'Veeg spetters van de rand.');

-- Risotto nero met inktvis
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 'risotto-nero-met-inktvis', 'platform', null, true, 'Risotto nero met inktvis', 'Inktvisinkt, citroen en chili', 'Een diepzwarte risotto met inktvisinkt en visbouillon, met flitsend gebakken inktvis, citroenzeste en goede olijfolie.', 'Deze Venetiaanse klassiek oogt dramatisch maar smaakt verrassend zacht en zilt. De inktvis leert je de belangrijkste regel van zeevruchten: extreem kort of heel lang.', 'hoofdgerecht', 'gemiddeld', 4, 20, 35, 0, '{"plate":"porcelain","layout":"center","sauce":{"style":"none","color":"ink"},"main":{"kind":"grains","color":"riceBlack"},"garnish":[{"kind":"cubes","color":"squid"},{"kind":"citrus","color":"lemon"},{"kind":"dots","color":"herbOil"}],"herbs":["chervil","zest"]}'::jsonb, '#E6E4E2', array['risotto', 'inktvis', 'Venetiaans', 'kort bakken']::text[], array['Sauteuse', 'Pollepel', 'Koekenpan', 'Scherp mes']::text[], 'Zwart is dramatisch op wit: laat de risotto vloeien en de inktvis erop krullen.', 'Inkt kleurt alles: draag een donkere schort en spoel pannen meteen na gebruik om.', 'Een Vermentino di Sardegna of een Soave Classico.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4';
delete from public.recipe_ingredients where recipe_id = 'ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4';
delete from public.recipe_steps where recipe_id = 'ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4';
delete from public.plating_steps where recipe_id = 'ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4';
insert into public.recipe_categories (recipe_id, category_id) values ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 'vis'), ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 'pasta');
insert into public.ingredients (name) values ('carnaroli'), ('sjalot'), ('knoflook'), ('droge witte wijn'), ('visbouillon'), ('inktvisinkt'), ('koude boter'), ('kleine pijlinktvisjes'), ('olijfolie'), ('chilivlokken'), ('citroen'), ('platte peterselie'), ('goede olijfolie') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Risotto'::text, 300::numeric, 'g'::text, 'carnaroli'::text, null::text),
  (2, 'Risotto'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Risotto'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (4, 'Risotto'::text, 100::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (5, 'Risotto'::text, 1::numeric, 'l'::text, 'visbouillon'::text, null::text),
  (6, 'Risotto'::text, 2::numeric, 'zakjes'::text, 'inktvisinkt'::text, '± 8 g'::text),
  (7, 'Risotto'::text, 30::numeric, 'g'::text, 'koude boter'::text, null::text),
  (8, 'Inktvis'::text, 400::numeric, 'g'::text, 'kleine pijlinktvisjes'::text, 'schoongemaakt'::text),
  (9, 'Inktvis'::text, 2::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (10, 'Inktvis'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (11, 'Inktvis'::text, 1::numeric, 'snuf'::text, 'chilivlokken'::text, null::text),
  (12, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'citroen'::text, 'rasp en partjes'::text),
  (13, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'platte peterselie'::text, null::text),
  (14, 'Afwerking'::text, 1::numeric, 'el'::text, 'goede olijfolie'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 1, 'Snijd de inktvis', 'Snijd de tubes van de inktvis in ringen en kerf de vlakke stukken in een ruitpatroon, zodat ze mooi krullen.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 2, 'Verwarm de bouillon', 'Houd de visbouillon tegen de kook aan en roer de inkt erdoor.', 'mise-en-place', '{"key":"simmer","tone":"chocolate"}'::jsonb, null, null),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 3, 'Toast de rijst', 'Fruit sjalot en knoflook glazig, voeg de rijst toe en toast 2 minuten. Blus af met wijn.', 'bakken', '{"key":"sear","item":"rice"}'::jsonb, 120, null),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 4, 'Gaar met zwarte bouillon', 'Voeg pollepel voor pollepel zwarte bouillon toe en roer regelmatig, 17 à 18 minuten tot de rijst beetgaar is.', 'garen', '{"key":"simmer","tone":"chocolate","item":"rice"}'::jsonb, 1080, null),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 5, 'Bak de inktvis flitsend', 'Bak de inktvis in een rokend hete pan met olie, knoflook en chili maximaal 90 seconden.', 'bakken', '{"key":"sear","item":"fish"}'::jsonb, 90, 'Inktvis is binnen 2 minuten gaar of pas na 40 minuten stoven weer mals — alles daartussen is rubber.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 6, 'Mantecatura', 'Klop koude boter door de risotto, rasp er citroen over en laat 1 minuut rusten.', 'saus', '{"key":"grate","item":"lemon"}'::jsonb, null, null),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 7, 'Dresseer', 'Laat de risotto uitvloeien op een wit bord en leg de inktvis erop met peterselie, citroen en olijfolie.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 0, 'Begin met een schoon bord', 'Kies een wit bord — het contrast met de zwarte risotto is het hele verhaal.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 1, 'Plaats de saus', 'Deze risotto is zelf de saus: schep hem in het midden en tik onder het bord tot hij vloeit.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 2, 'Positioneer het hoofdonderdeel', 'Leg de gekrulde inktvis in een los hoopje net naast het midden.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 3, 'Voeg garnituur toe', 'Druppel goede olijfolie in stippen rond de inktvis en leg een partje citroen erbij.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 4, 'Werk af met kruiden', 'Werk af met peterselie en citroenzeste — geel en groen breken het zwart.'),
  ('ba30825b-a08e-43b7-ae2c-c5ed43f3c2a4', 5, 'Maak de rand van het bord schoon', 'Veeg zwarte vegen direct van de rand.');

-- Knolselderij uit de zoutkorst
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 'knolselderij-uit-de-zoutkorst', 'platform', null, true, 'Knolselderij uit de zoutkorst', 'Paddenstoelenjus, hazelnoot en appel', 'Hele knolselderij, twee uur gegaard in een zoutkorst tot hij zacht is als boter, met een diepe paddenstoelenjus, hazelnoot en frisse appel.', 'Een zoutkorst werkt als een oven in de oven: de groente stoomt in zijn eigen sap en krijgt een geconcentreerde, bijna nootachtige smaak. Een vegetarisch hoofdgerecht dat het midden van de tafel verdient.', 'hoofdgerecht', 'gemiddeld', 4, 30, 120, 0, '{"plate":"stoneware","layout":"offset","sauce":{"style":"swoosh","color":"mushroom"},"main":{"kind":"wedges","color":"celeriac","accent":"golden","count":4},"garnish":[{"kind":"nuts"},{"kind":"appleFan","color":"apple"},{"kind":"leaves","color":"green"}],"herbs":["thyme","flakes"]}'::jsonb, '#EDE5D6', array['zoutkorst', 'vegetarische jus', 'showstopper', 'wortelgroente']::text[], array['Oven', 'Mengkom', 'Bakplaat', 'Steelpan', 'Zware lepel']::text[], 'Een groente als hoofdgerecht: royaal gesneden, glanzend en met een jus die niet onderdoet voor vlees.', 'Breek de zoutkorst aan tafel open: de geur die vrijkomt is de helft van de beleving.', 'Een gerijpte Chardonnay of een Savagnin uit de Jura.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'ba6f443d-fb60-402a-bdac-a4eca2d911c7';
delete from public.recipe_ingredients where recipe_id = 'ba6f443d-fb60-402a-bdac-a4eca2d911c7';
delete from public.recipe_steps where recipe_id = 'ba6f443d-fb60-402a-bdac-a4eca2d911c7';
delete from public.plating_steps where recipe_id = 'ba6f443d-fb60-402a-bdac-a4eca2d911c7';
insert into public.recipe_categories (recipe_id, category_id) values ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 'vegetarisch'), ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 'technieken'), ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 'sauzen');
insert into public.ingredients (name) values ('knolselderij'), ('bloem'), ('grof zeezout'), ('eiwitten'), ('water'), ('tijm'), ('champignons'), ('sjalot'), ('sojasaus'), ('marsala'), ('groentebouillon'), ('bruine boter'), ('hazelnoten'), ('groene appel'), ('selderijblad') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'ba6f443d-fb60-402a-bdac-a4eca2d911c7'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Zoutkorst'::text, 1::numeric, 'stuks'::text, 'knolselderij'::text, '± 800 g, geboend'::text),
  (2, 'Zoutkorst'::text, 500::numeric, 'g'::text, 'bloem'::text, null::text),
  (3, 'Zoutkorst'::text, 300::numeric, 'g'::text, 'grof zeezout'::text, null::text),
  (4, 'Zoutkorst'::text, 2::numeric, 'stuks'::text, 'eiwitten'::text, null::text),
  (5, 'Zoutkorst'::text, 200::numeric, 'ml'::text, 'water'::text, null::text),
  (6, 'Zoutkorst'::text, 4::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (7, 'Paddenstoelenjus'::text, 250::numeric, 'g'::text, 'champignons'::text, null::text),
  (8, 'Paddenstoelenjus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (9, 'Paddenstoelenjus'::text, 1::numeric, 'el'::text, 'sojasaus'::text, null::text),
  (10, 'Paddenstoelenjus'::text, 100::numeric, 'ml'::text, 'marsala'::text, null::text),
  (11, 'Paddenstoelenjus'::text, 400::numeric, 'ml'::text, 'groentebouillon'::text, null::text),
  (12, 'Paddenstoelenjus'::text, 30::numeric, 'g'::text, 'bruine boter'::text, null::text),
  (13, 'Afwerking'::text, 30::numeric, 'g'::text, 'hazelnoten'::text, 'geroosterd'::text),
  (14, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'groene appel'::text, null::text),
  (15, 'Afwerking'::text, 1::numeric, 'handje'::text, 'selderijblad'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 1, 'Maak het zoutdeeg', 'Kneed bloem, zout, eiwitten, tijm en water tot een stevig, niet plakkerig deeg.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 2, 'Pak de knolselderij in', 'Rol het deeg uit en wikkel de geboende knolselderij er volledig in. Sluit alle naden goed.', 'kruiden', '{"key":"season","item":"vegetables"}'::jsonb, null, 'Er mag geen gaatje in de korst zitten: de stoom moet binnen blijven.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 3, 'Gaar in de oven', 'Gaar 2 uur op 180 °C. De korst wordt keihard en de knolselderij zacht als boter.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 7200, null),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 4, 'Trek de paddenstoelenjus', 'Bak champignons en sjalot diepbruin, blus af met marsala en sojasaus, voeg bouillon toe en reduceer 30 minuten. Zeef en monteer met bruine boter.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 1800, null),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 5, 'Breek de korst', 'Breek de korst met een zware lepel open, schil de knolselderij en snijd hem in dikke partjes. Kleur de snijvlakken kort in een hete pan.', 'snijden', '{"key":"chop","item":"vegetables"}'::jsonb, null, null),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 6, 'Snijd de appel', 'Snijd de appel vlak voor het serveren in dunne plakjes, zodat hij niet verkleurt.', 'snijden', '{"key":"chop","item":"apple"}'::jsonb, null, null),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 7, 'Dresseer', 'Trek een swoosh jus, leg de knolselderij erop en werk af met hazelnoot, appel en selderijblad.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 0, 'Begin met een schoon bord', 'Kies een zandkleurig bord; aardse tinten passen bij geroosterde knolselderij.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 1, 'Plaats de saus', 'Trek met een lepel een swoosh donkere paddenstoelenjus langs de linkerkant.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 2, 'Positioneer het hoofdonderdeel', 'Leg de partjes knolselderij rechts van het midden, gekleurde kant naar boven.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 3, 'Voeg garnituur toe', 'Strooi geroosterde hazelnoot en leg een waaier appel tegen de knolselderij voor frisheid.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 4, 'Werk af met kruiden', 'Werk af met selderijblad, tijm en vlokzout.'),
  ('ba6f443d-fb60-402a-bdac-a4eca2d911c7', 5, 'Maak de rand van het bord schoon', 'Veeg jusdruppels van de rand.');

-- Gnocchi met salie en Parmigiano
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('bed6265d-fddf-43c3-8b07-bdfffededc72', 'gnocchi-met-salie-en-parmezaan', 'platform', null, true, 'Gnocchi met salie en Parmigiano', 'Luchtige aardappelgnocchi in bruine boter', 'Wolkzachte gnocchi van in de oven gebakken aardappelen, goudbruin gebakken in salieboter en afgewerkt met krullen Parmigiano.', 'Goede gnocchi zijn licht als een wolk. Het geheim zit niet in het recept maar in de techniek: droge aardappelen, zo min mogelijk bloem en kort kneden.', 'hoofdgerecht', 'gemiddeld', 4, 45, 70, 0, '{"plate":"porcelain","layout":"center","sauce":{"style":"pool","color":"brownButter"},"main":{"kind":"gnocchi","color":"gnocchi","count":12},"garnish":[{"kind":"crumble","color":"butter"}],"herbs":["sage","pepper"]}'::jsonb, '#EFE7D6', array['gnocchi', 'deeg', 'bruine boter', 'comfort']::text[], array['Pureeknijper', 'Oven', 'Werkblad met bloem', 'Vork of gnocchiplankje', 'Schuimspaan', 'Koekenpan']::text[], 'Gnocchi zijn bescheiden: laat de goudbruine kant en de krokante salie het werk doen.', 'Kook eerst één proefgnocchi: valt hij uit elkaar, kneed er dan een lepel extra bloem door.', 'Een Lugana of een lichte Barbera.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'bed6265d-fddf-43c3-8b07-bdfffededc72';
delete from public.recipe_ingredients where recipe_id = 'bed6265d-fddf-43c3-8b07-bdfffededc72';
delete from public.recipe_steps where recipe_id = 'bed6265d-fddf-43c3-8b07-bdfffededc72';
delete from public.plating_steps where recipe_id = 'bed6265d-fddf-43c3-8b07-bdfffededc72';
insert into public.recipe_categories (recipe_id, category_id) values ('bed6265d-fddf-43c3-8b07-bdfffededc72', 'vegetarisch'), ('bed6265d-fddf-43c3-8b07-bdfffededc72', 'pasta'), ('bed6265d-fddf-43c3-8b07-bdfffededc72', 'technieken');
insert into public.ingredients (name) values ('kruimige aardappelen'), ('tipo 00-bloem'), ('eidooier'), ('zout'), ('nootmuskaat'), ('boter'), ('salie'), ('Parmigiano Reggiano'), ('zwarte peper') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'bed6265d-fddf-43c3-8b07-bdfffededc72'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Gnocchi'::text, 700::numeric, 'g'::text, 'kruimige aardappelen'::text, 'in de schil'::text),
  (2, 'Gnocchi'::text, 180::numeric, 'g'::text, 'tipo 00-bloem'::text, null::text),
  (3, 'Gnocchi'::text, 1::numeric, 'stuks'::text, 'eidooier'::text, null::text),
  (4, 'Gnocchi'::text, 1::numeric, 'tl'::text, 'zout'::text, null::text),
  (5, 'Gnocchi'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (6, 'Salieboter'::text, 70::numeric, 'g'::text, 'boter'::text, null::text),
  (7, 'Salieboter'::text, 12::numeric, 'blaadjes'::text, 'salie'::text, null::text),
  (8, 'Afwerking'::text, 50::numeric, 'g'::text, 'Parmigiano Reggiano'::text, null::text),
  (9, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'zwarte peper'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 1, 'Bak de aardappelen in de schil', 'Bak de aardappelen in de schil 60 minuten op 200 °C op een laagje zout. Zo blijven ze droog — het geheim van luchtige gnocchi.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 3600, null),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 2, 'Druk door de knijper', 'Halveer de aardappelen warm, schep het vruchtvlees eruit en druk het direct door een pureeknijper. Laat de damp 2 minuten ontsnappen.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 3, 'Kneed kort', 'Strooi bloem, zout en nootmuskaat over de aardappel, voeg de dooier toe en kneed kort tot een zacht deeg dat net niet plakt.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, 'Hoe minder je kneedt, hoe luchtiger de gnocchi. Stop zodra het deeg samenhangt.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 4, 'Rol en snijd', 'Rol het deeg in slierten van 2 cm dik en snijd kussentjes van 2,5 cm. Rol ze over een vork voor ribbeltjes die de saus vasthouden.', 'snijden', '{"key":"chop","item":"dough"}'::jsonb, null, null),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 5, 'Kook tot ze drijven', 'Kook de gnocchi in porties in gezouten water. Zodra ze bovendrijven nog 30 seconden laten koken en uitscheppen.', 'garen', '{"key":"boil","item":"potato"}'::jsonb, 120, null),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 6, 'Bak in salieboter', 'Laat de boter bruinen met salie en bak de gnocchi erin tot ze aan één kant licht goudbruin zijn.', 'bakken', '{"key":"simmer","tone":"brown-butter"}'::jsonb, 180, null),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 7, 'Dresseer', 'Schep de gnocchi op een spiegel van bruine boter en werk af met Parmigiano, salie en peper.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 0, 'Begin met een schoon bord', 'Warm een wit bord met een verdiept midden voor.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 1, 'Plaats de saus', 'Schep een lepel bruine boter in het midden als glanzende spiegel.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 2, 'Positioneer het hoofdonderdeel', 'Verdeel de gnocchi in een losse, ronde groep met de gebakken kant naar boven.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 3, 'Voeg garnituur toe', 'Schaaf Parmigiano in grote krullen over en tussen de gnocchi.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 4, 'Werk af met kruiden', 'Werk af met krokante salie en versgemalen peper.'),
  ('bed6265d-fddf-43c3-8b07-bdfffededc72', 5, 'Maak de rand van het bord schoon', 'Veeg boterdruppels van de rand.');

-- Gevulde courgettebloem met ricotta
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('7df73d87-2e9a-4831-943f-bb145b105445', 'courgettebloem-met-ricotta', 'platform', null, true, 'Gevulde courgettebloem met ricotta', 'Tempura en tomatencoulis', 'Courgettebloemen gevuld met ricotta, citroen en basilicum, in een flinterdun tempurabeslag gefrituurd en geserveerd op een frisse tomatencoulis.', 'Courgettebloemen zijn een van de mooiste zomerse ingrediënten en een perfecte les in frituren: ijskoud beslag, hete olie en snel serveren.', 'voorgerecht', 'gemiddeld', 4, 30, 25, 0, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"swoosh","color":"tomato"},"main":{"kind":"fritters","color":"zucchiniFlower","count":3},"garnish":[{"kind":"tomatoes"},{"kind":"leaves","color":"green"}],"herbs":["basil","flakes","zest"]}'::jsonb, '#F1E8D8', array['frituren', 'tempura', 'zomer', 'vullen']::text[], array['Hoge pan of frituurpan', 'Thermometer', 'Spuitzak', 'Garde', 'Blender']::text[], 'Frituur vraagt om lucht op het bord: laat de bloemen tegen de saus leunen, niet erin liggen.', 'Frituur in kleine porties: te veel bloemen tegelijk koelt de olie af en maakt het beslag vettig.', 'Een Verdicchio of een droge prosecco.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '7df73d87-2e9a-4831-943f-bb145b105445';
delete from public.recipe_ingredients where recipe_id = '7df73d87-2e9a-4831-943f-bb145b105445';
delete from public.recipe_steps where recipe_id = '7df73d87-2e9a-4831-943f-bb145b105445';
delete from public.plating_steps where recipe_id = '7df73d87-2e9a-4831-943f-bb145b105445';
insert into public.recipe_categories (recipe_id, category_id) values ('7df73d87-2e9a-4831-943f-bb145b105445', 'vegetarisch'), ('7df73d87-2e9a-4831-943f-bb145b105445', 'technieken');
insert into public.ingredients (name) values ('courgettebloemen'), ('ricotta'), ('Parmigiano Reggiano'), ('citroen'), ('basilicum'), ('zout en peper'), ('bloem'), ('maizena'), ('ijskoud bruisend water'), ('zonnebloemolie'), ('rijpe tomaten'), ('knoflook'), ('olijfolie'), ('suiker') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '7df73d87-2e9a-4831-943f-bb145b105445'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Bloemen'::text, 8::numeric, 'stuks'::text, 'courgettebloemen'::text, 'met klein courgetje'::text),
  (2, 'Vulling'::text, 200::numeric, 'g'::text, 'ricotta'::text, null::text),
  (3, 'Vulling'::text, 30::numeric, 'g'::text, 'Parmigiano Reggiano'::text, null::text),
  (4, 'Vulling'::text, 1::numeric, 'stuks'::text, 'citroen'::text, 'rasp'::text),
  (5, 'Vulling'::text, 6::numeric, 'blaadjes'::text, 'basilicum'::text, null::text),
  (6, 'Vulling'::text, null::numeric, 'naar smaak'::text, 'zout en peper'::text, null::text),
  (7, 'Tempurabeslag'::text, 100::numeric, 'g'::text, 'bloem'::text, null::text),
  (8, 'Tempurabeslag'::text, 30::numeric, 'g'::text, 'maizena'::text, null::text),
  (9, 'Tempurabeslag'::text, 180::numeric, 'ml'::text, 'ijskoud bruisend water'::text, null::text),
  (10, 'Tempurabeslag'::text, 1::numeric, 'l'::text, 'zonnebloemolie'::text, 'om te frituren'::text),
  (11, 'Tomatencoulis'::text, 300::numeric, 'g'::text, 'rijpe tomaten'::text, null::text),
  (12, 'Tomatencoulis'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (13, 'Tomatencoulis'::text, 2::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (14, 'Tomatencoulis'::text, 1::numeric, 'tl'::text, 'suiker'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('7df73d87-2e9a-4831-943f-bb145b105445', 1, 'Maak de bloemen schoon', 'Open de bloemen voorzichtig en verwijder de stamper. Controleer op insecten en borstel ze schoon — nooit afspoelen.', 'mise-en-place', '{"key":"prep","item":"vegetables"}'::jsonb, null, null),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 2, 'Maak de vulling', 'Meng ricotta, Parmigiano, citroenrasp en gescheurde basilicum. Breng op smaak en doe in een spuitzak.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, null),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 3, 'Vul de bloemen', 'Spuit de bloemen voor twee derde vol en draai de blaadjes zacht dicht.', 'dresseren', '{"key":"pipe"}'::jsonb, null, 'Niet te vol: de vulling zet uit in de hete olie.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 4, 'Maak de tomatencoulis', 'Stoof tomaten met knoflook, olie en suiker 15 minuten, mix en passeer door een zeef.', 'saus', '{"key":"simmer","tone":"tomato"}'::jsonb, 900, null),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 5, 'Klop het beslag', 'Klop bloem, maizena en ijskoud bruisend water in een paar halen tot een dun beslag. Klontjes mogen blijven.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, 'Koud beslag en hete olie: het temperatuurverschil maakt tempura luchtig.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 6, 'Frituur goudgeel', 'Haal de bloemen door het beslag en frituur ze in olie van 175 °C 2 à 3 minuten tot ze licht goudgeel en krokant zijn. Laat uitlekken en zout direct.', 'bakken', '{"key":"heat"}'::jsonb, 180, null),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 7, 'Dresseer', 'Trek een swoosh coulis, leg de bloemen er schuin tegenaan en werk af met tomaat en basilicum.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('7df73d87-2e9a-4831-943f-bb145b105445', 0, 'Begin met een schoon bord', 'Kies een wit bord; het goudgele beslag en de rode coulis contrasteren sterk.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 1, 'Plaats de saus', 'Trek een swoosh tomatencoulis diagonaal over het bord.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 2, 'Positioneer het hoofdonderdeel', 'Leg drie gevulde bloemen schuin tegen de swoosh, zodat het beslag krokant blijft.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 3, 'Voeg garnituur toe', 'Verdeel gehalveerde kerstomaatjes en een paar basilicumblaadjes.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 4, 'Werk af met kruiden', 'Werk af met citroenzeste, vlokzout en een draadje olijfolie.'),
  ('7df73d87-2e9a-4831-943f-bb145b105445', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer direct — frituur wacht niet.');

-- Aubergine met miso en sesam
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 'aubergine-met-miso-en-sesam', 'platform', null, true, 'Aubergine met miso en sesam', 'Geglaceerd onder de grill, met sesamyoghurt', 'Zachte, geroosterde aubergine met een glanzend gekarameliseerd misoglazuur, op een veeg sesamyoghurt met radijs, lente-ui en shiso.', 'Geïnspireerd op het Japanse nasu dengaku: umami, zoet en rokerig in één hap. Een vegetarisch hoofdgerecht dat bewijst hoeveel smaak een glazuur kan toevoegen.', 'hoofdgerecht', 'makkelijk', 2, 15, 40, 0, '{"plate":"slate","layout":"diagonal","sauce":{"style":"smear","color":"labneh","accent":"herbOil"},"main":{"kind":"halves","color":"aubergineFlesh","accent":"aubergine"},"garnish":[{"kind":"radish"},{"kind":"dots","color":"miso"}],"herbs":["sesame","micro","chives"]}'::jsonb, '#E4DFE4', array['umami', 'glaceren', 'grill', 'Japans geïnspireerd']::text[], array['Oven met grill', 'Bakplaat', 'Scherp mes', 'Kwast']::text[], 'Een glanzende, bijna lakachtige aubergine op een donker bord: umami die je kunt zien.', 'Kerf het vruchtvlees diep in: zo dringt het glazuur tot in de kern en gaart de aubergine gelijkmatiger.', 'Een koele junmai sake of een Grüner Veltliner.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '319fc9d9-0d05-48b2-bd73-12e7523236e1';
delete from public.recipe_ingredients where recipe_id = '319fc9d9-0d05-48b2-bd73-12e7523236e1';
delete from public.recipe_steps where recipe_id = '319fc9d9-0d05-48b2-bd73-12e7523236e1';
delete from public.plating_steps where recipe_id = '319fc9d9-0d05-48b2-bd73-12e7523236e1';
insert into public.recipe_categories (recipe_id, category_id) values ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 'vegetarisch');
insert into public.ingredients (name) values ('aubergines'), ('neutrale olie'), ('zout'), ('witte miso'), ('mirin'), ('sake of droge sherry'), ('suiker'), ('geraspte gember'), ('Griekse yoghurt'), ('geroosterde sesamolie'), ('witte en zwarte sesam'), ('lente-uien'), ('radijsjes'), ('shiso of koriander') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '319fc9d9-0d05-48b2-bd73-12e7523236e1'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Aubergine'::text, 2::numeric, 'stuks'::text, 'aubergines'::text, null::text),
  (2, 'Aubergine'::text, 2::numeric, 'el'::text, 'neutrale olie'::text, null::text),
  (3, 'Aubergine'::text, null::numeric, 'naar smaak'::text, 'zout'::text, null::text),
  (4, 'Misoglazuur'::text, 3::numeric, 'el'::text, 'witte miso'::text, null::text),
  (5, 'Misoglazuur'::text, 1::numeric, 'el'::text, 'mirin'::text, null::text),
  (6, 'Misoglazuur'::text, 1::numeric, 'el'::text, 'sake of droge sherry'::text, null::text),
  (7, 'Misoglazuur'::text, 1::numeric, 'el'::text, 'suiker'::text, null::text),
  (8, 'Misoglazuur'::text, 1::numeric, 'tl'::text, 'geraspte gember'::text, null::text),
  (9, 'Afwerking'::text, 150::numeric, 'g'::text, 'Griekse yoghurt'::text, null::text),
  (10, 'Afwerking'::text, 1::numeric, 'tl'::text, 'geroosterde sesamolie'::text, null::text),
  (11, 'Afwerking'::text, 1::numeric, 'el'::text, 'witte en zwarte sesam'::text, null::text),
  (12, 'Afwerking'::text, 2::numeric, 'stuks'::text, 'lente-uien'::text, null::text),
  (13, 'Afwerking'::text, 4::numeric, 'stuks'::text, 'radijsjes'::text, null::text),
  (14, 'Afwerking'::text, 1::numeric, 'handje'::text, 'shiso of koriander'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 1, 'Halveer en kerf in', 'Halveer de aubergines in de lengte en kerf het vruchtvlees diep in een ruitpatroon, zonder door de schil te snijden.', 'snijden', '{"key":"chop","item":"vegetables"}'::jsonb, null, null),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 2, 'Rooster zacht', 'Bestrijk met olie en zout en rooster 25 à 30 minuten op 200 °C met de snijkant naar beneden tot het vruchtvlees volledig zacht is.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 1800, 'Een ondergare aubergine is rubberachtig; hij moet inzakken als je erop drukt.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 3, 'Maak het misoglazuur', 'Verwarm miso, mirin, sake, suiker en gember al roerend tot een glanzende pasta.', 'saus', '{"key":"whisk","tone":"caramel"}'::jsonb, null, null),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 4, 'Glaceer onder de grill', 'Draai de aubergines om, bestrijk royaal met glazuur en gratineer 3 à 4 minuten onder een hete grill tot het glazuur blaast en karamelliseert.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 240, null),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 5, 'Maak de sesamyoghurt', 'Meng de yoghurt met sesamolie en een snuf zout.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, null),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 6, 'Snijd de garnituur', 'Snijd lente-ui in fijne schuine ringetjes en radijs flinterdun.', 'snijden', '{"key":"chop","item":"cucumber"}'::jsonb, null, null),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 7, 'Dresseer', 'Trek een veeg sesamyoghurt, leg de aubergine erop en werk af met sesam, radijs en shiso.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 0, 'Begin met een schoon bord', 'Kies een matzwart bord zodat het karamelbruine glazuur glanst.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 1, 'Plaats de saus', 'Trek met de achterkant van een lepel een brede veeg sesamyoghurt en druppel er kruidenolie in.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 2, 'Positioneer het hoofdonderdeel', 'Leg de twee aubergine-helften schuin en licht verschoven op de yoghurt.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 3, 'Voeg garnituur toe', 'Verdeel radijsschijfjes en stippen misoglazuur rond de aubergine.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 4, 'Werk af met kruiden', 'Strooi sesam, lente-ui en shiso over het glazuur.'),
  ('319fc9d9-0d05-48b2-bd73-12e7523236e1', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon.');

-- Paddenstoelen-pithivier met truffeljus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 'paddenstoelen-pithivier', 'platform', null, true, 'Paddenstoelen-pithivier met truffeljus', 'Bladerdeeg, spinazie en bospaddenstoelen', 'Een koepel van goudbruin bladerdeeg met gebogen patroon, gevuld met bospaddenstoelen, spinazie en knolselderij, geserveerd met een glanzende truffeljus.', 'Een pithivier is een feestelijk vegetarisch middelpunt en een les in bladerdeeg: koud werken, strak inpakken en een patroon scoren dat in de oven tot leven komt.', 'hoofdgerecht', 'uitdagend', 4, 60, 50, 30, '{"plate":"porcelain","layout":"offset","sauce":{"style":"swoosh","color":"mushroom"},"main":{"kind":"tart","color":"pastry","accent":"golden"},"garnish":[{"kind":"mushrooms"},{"kind":"leaves","color":"green"}],"herbs":["thyme","flakes"]}'::jsonb, '#ECE4D6', array['bladerdeeg', 'pithivier', 'feestelijk', 'scoren']::text[], array['Uitsteekringen van 12 en 15 cm', 'Deegroller', 'Kwast', 'Klein mesje', 'Oven', 'Koekenpan']::text[], 'Een pithivier is architectuur: laat de gebogen lijnen van het deeg de show stelen.', 'Werk met ijskoud bladerdeeg: warm deeg rijst ongelijk en verliest zijn laagjes.', 'Een Pinot Noir uit de Bourgogne.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0';
delete from public.recipe_ingredients where recipe_id = 'a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0';
delete from public.recipe_steps where recipe_id = 'a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0';
delete from public.plating_steps where recipe_id = 'a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0';
insert into public.recipe_categories (recipe_id, category_id) values ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 'vegetarisch'), ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 'technieken');
insert into public.ingredients (name) values ('gemengde paddenstoelen'), ('sjalot'), ('spinazie'), ('knolselderij'), ('tijm'), ('boter'), ('Parmigiano Reggiano'), ('roomboterbladerdeeg'), ('eidooiers'), ('room'), ('champignonafsnijdsels'), ('port'), ('groentebouillon'), ('truffeltapenade'), ('koude boter') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vulling'::text, 400::numeric, 'g'::text, 'gemengde paddenstoelen'::text, null::text),
  (2, 'Vulling'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Vulling'::text, 150::numeric, 'g'::text, 'spinazie'::text, null::text),
  (4, 'Vulling'::text, 100::numeric, 'g'::text, 'knolselderij'::text, 'in blokjes, gekookt'::text),
  (5, 'Vulling'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (6, 'Vulling'::text, 30::numeric, 'g'::text, 'boter'::text, null::text),
  (7, 'Vulling'::text, 50::numeric, 'g'::text, 'Parmigiano Reggiano'::text, null::text),
  (8, 'Deeg'::text, 500::numeric, 'g'::text, 'roomboterbladerdeeg'::text, null::text),
  (9, 'Deeg'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (10, 'Deeg'::text, 1::numeric, 'el'::text, 'room'::text, null::text),
  (11, 'Truffeljus'::text, 200::numeric, 'g'::text, 'champignonafsnijdsels'::text, null::text),
  (12, 'Truffeljus'::text, 100::numeric, 'ml'::text, 'port'::text, null::text),
  (13, 'Truffeljus'::text, 300::numeric, 'ml'::text, 'groentebouillon'::text, null::text),
  (14, 'Truffeljus'::text, 1::numeric, 'tl'::text, 'truffeltapenade'::text, null::text),
  (15, 'Truffeljus'::text, 20::numeric, 'g'::text, 'koude boter'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 1, 'Bak de paddenstoelen droog', 'Bak de paddenstoelen in porties goudbruin met sjalot en tijm tot al het vocht verdwenen is.', 'bakken', '{"key":"sear","item":"mushrooms"}'::jsonb, 600, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 2, 'Maak de vulling', 'Slink de spinazie, knijp hem kurkdroog en hak grof. Meng met paddenstoelen, knolselderij en Parmigiano.', 'snijden', '{"key":"chop","item":"herbs"}'::jsonb, null, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 3, 'Vorm koude koepels', 'Druk de vulling in kommetjes tot koepels van 9 cm en laat 30 minuten opstijven in de koelkast.', 'rusten', '{"key":"chill"}'::jsonb, 1800, 'Een koude, stevige vulling maakt het inpakken makkelijker en de vorm strakker.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 4, 'Pak in bladerdeeg', 'Steek rondjes van 12 en 15 cm uit het deeg. Leg de koepel op het kleine rondje, bestrijk de rand met dooier, leg het grote rondje erover en druk alle lucht weg.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 5, 'Scoor het patroon', 'Bestrijk twee keer met dooier en kerf met de punt van een mesje gebogen lijnen van de top naar de rand, zonder door het deeg te snijden. Maak een stoomgaatje in de top.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 6, 'Bak goudbruin', 'Bak 30 à 35 minuten op 200 °C tot diep goudbruin en krokant.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 2100, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 7, 'Trek de truffeljus', 'Bak de afsnijdsels bruin, blus af met port, voeg bouillon toe en reduceer tot een glanzende jus. Roer truffeltapenade erdoor en monteer met boter.', 'saus', '{"key":"simmer","tone":"jus"}'::jsonb, 1200, null),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 8, 'Dresseer', 'Trek een swoosh truffeljus en zet de pithivier ernaast met gebakken paddenstoelen.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 0, 'Begin met een schoon bord', 'Kies een wit bord; het goudbruine deeg met zijn gebogen patroon is het middelpunt.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 1, 'Plaats de saus', 'Trek een swoosh truffeljus langs de linkerkant van het bord.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 2, 'Positioneer het hoofdonderdeel', 'Zet de pithivier rechts van het midden, of snijd hem aan tafel doormidden om de vulling te tonen.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 3, 'Voeg garnituur toe', 'Leg een paar goudbruin gebakken paddenstoelen en een spinazieblaadje in de open ruimte.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 4, 'Werk af met kruiden', 'Werk af met tijm en een paar vlokjes zout op het deeg.'),
  ('a85a1b02-cc1e-41c9-a7c7-8ee6d6b6bbf0', 5, 'Maak de rand van het bord schoon', 'Veeg deegkruimels en jusdruppels van de rand.');
