-- Platformrecepten deel 03 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Vitello tonnato
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('a4b2e40e-6970-4130-acc0-e52848cd7392', 'vitello-tonnato', 'platform', null, true, 'Vitello tonnato', 'Rosé kalfsvlees met tonijnsaus en kappertjesappels', 'Flinterdun gesneden, rosé gegaard kalfsvlees met een romige saus van tonijn, ansjovis en kappertjes — een moderne versie van de Piëmontese klassieker.', 'Vitello tonnato laat zien hoe een saus een gerecht kan dragen. De moderne presentatie toont het roze vlees in plaats van het onder saus te begraven.', 'voorgerecht', 'gemiddeld', 4, 30, 45, 120, '{"plate":"porcelain","layout":"center","sauce":{"style":"dots","color":"labneh"},"main":{"kind":"carpaccio","color":"veal"},"garnish":[{"kind":"capers"},{"kind":"dots","color":"cream"},{"kind":"leaves","color":"green"}],"herbs":["micro","zest","pepper"]}'::jsonb, '#EFE6DC', array['Italiaans', 'koud', 'saus', 'dun snijden']::text[], array['Braadpan', 'Kernthermometer', 'Blender', 'Lang vleesmes', 'Knijpfles']::text[], 'Een moderne vitello tonnato laat het roze vlees zien in plaats van het onder saus te begraven.', 'Bewaar het kookvocht: een lepel ervan maakt de tonnatosaus lichter en geeft extra diepte.', 'Een Gavi di Gavi of een jonge Soave Classico.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'a4b2e40e-6970-4130-acc0-e52848cd7392';
delete from public.recipe_ingredients where recipe_id = 'a4b2e40e-6970-4130-acc0-e52848cd7392';
delete from public.recipe_steps where recipe_id = 'a4b2e40e-6970-4130-acc0-e52848cd7392';
delete from public.plating_steps where recipe_id = 'a4b2e40e-6970-4130-acc0-e52848cd7392';
insert into public.recipe_categories (recipe_id, category_id) values ('a4b2e40e-6970-4130-acc0-e52848cd7392', 'vlees'), ('a4b2e40e-6970-4130-acc0-e52848cd7392', 'sauzen');
insert into public.ingredients (name) values ('kalfsfricandeau'), ('olijfolie'), ('wortel'), ('stengel bleekselderij'), ('ui'), ('laurierblad'), ('droge witte wijn'), ('tonijn in olijfolie'), ('ansjovisfilets'), ('kappertjes'), ('eidooiers'), ('milde olijfolie'), ('citroensap'), ('kappertjesappels'), ('rucola'), ('citroen') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'a4b2e40e-6970-4130-acc0-e52848cd7392'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Kalfsvlees'::text, 500::numeric, 'g'::text, 'kalfsfricandeau'::text, 'in één stuk'::text),
  (2, 'Kalfsvlees'::text, 1::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (3, 'Kalfsvlees'::text, 1::numeric, 'stuks'::text, 'wortel'::text, null::text),
  (4, 'Kalfsvlees'::text, 1::numeric, 'stuks'::text, 'stengel bleekselderij'::text, null::text),
  (5, 'Kalfsvlees'::text, 1::numeric, 'stuks'::text, 'ui'::text, null::text),
  (6, 'Kalfsvlees'::text, 1::numeric, 'stuks'::text, 'laurierblad'::text, null::text),
  (7, 'Kalfsvlees'::text, 150::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (8, 'Tonnatosaus'::text, 150::numeric, 'g'::text, 'tonijn in olijfolie'::text, 'uitgelekt'::text),
  (9, 'Tonnatosaus'::text, 3::numeric, 'stuks'::text, 'ansjovisfilets'::text, null::text),
  (10, 'Tonnatosaus'::text, 1::numeric, 'el'::text, 'kappertjes'::text, null::text),
  (11, 'Tonnatosaus'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (12, 'Tonnatosaus'::text, 150::numeric, 'ml'::text, 'milde olijfolie'::text, null::text),
  (13, 'Tonnatosaus'::text, 1::numeric, 'el'::text, 'citroensap'::text, null::text),
  (14, 'Afwerking'::text, 12::numeric, 'stuks'::text, 'kappertjesappels'::text, null::text),
  (15, 'Afwerking'::text, 1::numeric, 'handje'::text, 'rucola'::text, null::text),
  (16, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, 'zeste'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 1, 'Bind en kruid het vlees', 'Bind het fricandeau op met keukentouw zodat het gelijkmatig gaart, en kruid met zout en peper.', 'mise-en-place', '{"key":"prep","item":"steak"}'::jsonb, null, null),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 2, 'Braad kort aan', 'Braad het vlees rondom aan in olijfolie tot een lichte korst.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 360, null),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 3, 'Pocheer zacht', 'Voeg groenten, laurier, wijn en water tot halverwege het vlees toe. Gaar afgedekt op laag vuur tot een kerntemperatuur van 58 °C.', 'garen', '{"key":"simmer","tone":"wine"}'::jsonb, 2400, 'Te hoge temperatuur maakt kalfsvlees droog; gebruik altijd een thermometer.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 4, 'Laat afkoelen', 'Laat het vlees afkoelen in het kookvocht en daarna minstens 2 uur opstijven in de koelkast. Koud vlees snijd je flinterdun.', 'rusten', '{"key":"chill"}'::jsonb, 7200, null),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 5, 'Maak de tonnatosaus', 'Mix tonijn, ansjovis, kappertjes, dooiers en citroensap. Voeg de olie in een dunne straal toe tot een dikke, glanzende saus. Verdun met een scheut kookvocht.', 'saus', '{"key":"blend","tone":"cream"}'::jsonb, null, null),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 6, 'Snijd flinterdun', 'Snijd het koude vlees met een lang mes in plakken van 2 mm.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, null),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 7, 'Dresseer', 'Leg het vlees in een rozet en werk af met tonnatosaus, kappertjesappels en rucola.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 0, 'Begin met een schoon bord', 'Kies een groot wit bord; het bleke vlees en de saus vragen om een rustige achtergrond.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 1, 'Plaats de saus', 'Zet stippen tonnatosaus in verschillende groottes verspreid over het bord.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 2, 'Positioneer het hoofdonderdeel', 'Leg de plakjes kalfsvlees licht overlappend in een rozet die bijna het hele bord vult.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 3, 'Voeg garnituur toe', 'Verdeel kappertjesappels en stippen saus over het vlees en zet een paar rucolablaadjes neer.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 4, 'Werk af met kruiden', 'Werk af met citroenzeste, microgroen en versgemalen peper.'),
  ('a4b2e40e-6970-4130-acc0-e52848cd7392', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en laat het bord 5 minuten op temperatuur komen voor het serveren.');

-- Carpaccio van rode biet
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 'carpaccio-van-rode-biet', 'platform', null, true, 'Carpaccio van rode biet', 'Sinaasappel, feta en walnoot', 'Flinterdunne plakken geroosterde en rauwe biet met sinaasappelpartjes, verkruimelde feta, walnoten en een dressing van walnotenolie.', 'Carpaccio hoeft niet van vlees te zijn. Deze versie leert je werken met de mandoline en met kleur: rood, oranje en wit op één bord zonder dat het druk wordt.', 'voorgerecht', 'makkelijk', 4, 20, 60, 0, '{"plate":"stoneware","layout":"center","sauce":{"style":"none","color":"beet"},"main":{"kind":"carpaccio","color":"beet"},"garnish":[{"kind":"citrus","color":"orange"},{"kind":"crumble","color":"goatCheese"},{"kind":"nuts"}],"herbs":["mint","micro","flakes"]}'::jsonb, '#EFE2DA', array['mandoline', 'fris', 'kleur', 'vegetarisch']::text[], array['Mandoline', 'Oven', 'Klein schilmes', 'Handschoenen']::text[], 'Carpaccio is een schilderij van plakken: overlap, kleur en ruimte.', 'Snijd rauwe chioggiabiet pas vlak voor het serveren: de strepen vervagen als hij te lang in zuur ligt.', 'Een aromatische Grüner Veltliner.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'cf997470-3b0d-4548-960b-1a4eabb4f17a';
delete from public.recipe_ingredients where recipe_id = 'cf997470-3b0d-4548-960b-1a4eabb4f17a';
delete from public.recipe_steps where recipe_id = 'cf997470-3b0d-4548-960b-1a4eabb4f17a';
delete from public.plating_steps where recipe_id = 'cf997470-3b0d-4548-960b-1a4eabb4f17a';
insert into public.recipe_categories (recipe_id, category_id) values ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 'vegetarisch'), ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 'plating');
insert into public.ingredients (name) values ('rode bieten'), ('chioggiabiet'), ('sinaasappel'), ('walnotenolie'), ('honing'), ('witte balsamico'), ('feta'), ('walnoten'), ('munt'), ('vlokzout') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'cf997470-3b0d-4548-960b-1a4eabb4f17a'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Carpaccio'::text, 3::numeric, 'stuks'::text, 'rode bieten'::text, 'geroosterd of voorgekookt'::text),
  (2, 'Carpaccio'::text, 1::numeric, 'stuks'::text, 'chioggiabiet'::text, 'rauw, optioneel'::text),
  (3, 'Dressing'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'sap en rasp'::text),
  (4, 'Dressing'::text, 2::numeric, 'el'::text, 'walnotenolie'::text, null::text),
  (5, 'Dressing'::text, 1::numeric, 'tl'::text, 'honing'::text, null::text),
  (6, 'Dressing'::text, 1::numeric, 'tl'::text, 'witte balsamico'::text, null::text),
  (7, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'in partjes'::text),
  (8, 'Afwerking'::text, 80::numeric, 'g'::text, 'feta'::text, null::text),
  (9, 'Afwerking'::text, 30::numeric, 'g'::text, 'walnoten'::text, 'geroosterd'::text),
  (10, 'Afwerking'::text, 6::numeric, 'blaadjes'::text, 'munt'::text, null::text),
  (11, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'vlokzout'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 1, 'Rooster de bieten', 'Rooster de bieten in folie 60 minuten op 190 °C en laat ze afkoelen.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 3600, null),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 2, 'Snijd sinaasappelpartjes', 'Snijd boven- en onderkant van de sinaasappel, snijd de schil met al het wit weg en snijd de partjes tussen de vliezen uit.', 'snijden', '{"key":"chop","item":"lemon"}'::jsonb, null, 'Vang het sap op: dat gaat in de dressing.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 3, 'Schaaf de bieten', 'Schaaf de bieten op de mandoline in plakken van 1 mm. Houd rode en gestreepte bieten gescheiden, zodat de kleuren niet uitlopen.', 'snijden', '{"key":"chop","item":"vegetables"}'::jsonb, null, null),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 4, 'Klop de dressing', 'Klop sinaasappelsap, rasp, walnotenolie, honing en balsamico tot een emulsie.', 'saus', '{"key":"whisk","tone":"lemon"}'::jsonb, null, null),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 5, 'Marineer kort', 'Bestrijk de plakken biet met de dressing en laat 5 minuten intrekken.', 'kruiden', '{"key":"season","item":"vegetables"}'::jsonb, 300, null),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 6, 'Dresseer', 'Leg de biet in een rozet en verdeel sinaasappel, feta, walnoot en munt.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 0, 'Begin met een schoon bord', 'Kies een licht stoneware bord met textuur — de glans van de biet komt erop tot leven.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 1, 'Plaats de saus', 'Deze carpaccio heeft geen saus als ondergrond: de dressing zit al op de biet. Houd het bord dus schoon.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 2, 'Positioneer het hoofdonderdeel', 'Leg de plakken biet dakpansgewijs in een ruime rozet, afwisselend rood en gestreept.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 3, 'Voeg garnituur toe', 'Verdeel sinaasappelpartjes, verkruimelde feta en walnoten in kleine eilandjes.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 4, 'Werk af met kruiden', 'Werk af met gescheurde munt, microgroen en vlokzout.'),
  ('cf997470-3b0d-4548-960b-1a4eabb4f17a', 5, 'Maak de rand van het bord schoon', 'Veeg dressingdruppels van de rand.');

-- Ceviche van dorade
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 'ceviche-van-dorade', 'platform', null, true, 'Ceviche van dorade', 'Leche de tigre, rode ui en koriander', 'Blokjes ultraverse dorade, kort gegaard in een pittige leche de tigre van limoen, gember en koriander, met rode ui en zoete aardappel.', 'Ceviche ''gaart'' vis zonder hitte: het zuur van de limoen verandert de eiwitten. Timing is alles — een paar minuten maakt het verschil tussen glazig en rubberachtig.', 'voorgerecht', 'makkelijk', 4, 30, 0, 0, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"labneh","accent":"herbOil"},"main":{"kind":"cubes","color":"whiteFish","accent":"coulis"},"garnish":[{"kind":"onionRings"},{"kind":"citrus","color":"pistachio"},{"kind":"cubes","color":"orange"}],"herbs":["micro","pepper"]}'::jsonb, '#E1E8E4', array['rauw', 'Peruaans', 'zuur garen', 'fris']::text[], array['Filetmes', 'Graatpincet', 'Glazen kom', 'Blender', 'Fijne zeef']::text[], 'Ceviche vraagt om een koude, diepe kom en snelheid: het zuur blijft doorwerken.', 'Visafsnijdsels in de leche de tigre geven umami en een zijdezachte textuur — gooi ze niet weg.', 'Een Albariño of een frisse pisco sour.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'e9f7bb93-3fdf-469c-8177-869b1511b1ca';
delete from public.recipe_ingredients where recipe_id = 'e9f7bb93-3fdf-469c-8177-869b1511b1ca';
delete from public.recipe_steps where recipe_id = 'e9f7bb93-3fdf-469c-8177-869b1511b1ca';
delete from public.plating_steps where recipe_id = 'e9f7bb93-3fdf-469c-8177-869b1511b1ca';
insert into public.recipe_categories (recipe_id, category_id) values ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 'vis');
insert into public.ingredients (name) values ('doradefilet'), ('zeezout'), ('limoenen'), ('knoflook'), ('rode peper'), ('gember'), ('korianderstelen'), ('visafsnijdsels'), ('ijsblokjes'), ('rode ui'), ('zoete aardappel'), ('korianderblaadjes'), ('limoen') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'e9f7bb93-3fdf-469c-8177-869b1511b1ca'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vis'::text, 300::numeric, 'g'::text, 'doradefilet'::text, 'zonder vel en graten, sashimikwaliteit'::text),
  (2, 'Vis'::text, null::numeric, 'naar smaak'::text, 'zeezout'::text, null::text),
  (3, 'Leche de tigre'::text, 4::numeric, 'stuks'::text, 'limoenen'::text, 'sap'::text),
  (4, 'Leche de tigre'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (5, 'Leche de tigre'::text, 1::numeric, 'stuks'::text, 'rode peper'::text, 'zonder zaadjes'::text),
  (6, 'Leche de tigre'::text, 10::numeric, 'g'::text, 'gember'::text, null::text),
  (7, 'Leche de tigre'::text, 10::numeric, 'g'::text, 'korianderstelen'::text, null::text),
  (8, 'Leche de tigre'::text, 50::numeric, 'g'::text, 'visafsnijdsels'::text, 'van de dorade'::text),
  (9, 'Leche de tigre'::text, 3::numeric, 'stuks'::text, 'ijsblokjes'::text, null::text),
  (10, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'rode ui'::text, null::text),
  (11, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'zoete aardappel'::text, 'gekookt en in blokjes'::text),
  (12, 'Afwerking'::text, 1::numeric, 'handje'::text, 'korianderblaadjes'::text, null::text),
  (13, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'limoen'::text, 'in partjes'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 1, 'Ontgraat de vis', 'Controleer de filets met je vingertoppen op graten en trek ze eruit met een pincet. Houd de vis ijskoud.', 'mise-en-place', '{"key":"prep","item":"fish"}'::jsonb, null, null),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 2, 'Snijd de vis', 'Snijd de dorade in blokjes van 1,5 cm. Gelijke blokjes garen gelijkmatig in het zuur.', 'snijden', '{"key":"chop","item":"cauliflower"}'::jsonb, null, null),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 3, 'Snijd de rode ui', 'Snijd de rode ui in flinterdunne halve ringen en spoel ze 5 minuten in ijswater: dat haalt de scherpte weg.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, 300, null),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 4, 'Mix de leche de tigre', 'Mix limoensap, knoflook, peper, gember, korianderstelen, visafsnijdsels en ijs 30 seconden. Zeef door een fijne zeef.', 'saus', '{"key":"blend","tone":"lemon"}'::jsonb, null, null),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 5, 'Laat de vis kort garen', 'Zout de vis, giet de leche de tigre erover en laat 2 à 3 minuten staan in de koelkast. De buitenkant wordt wit, de kern blijft glazig.', 'rusten', '{"key":"chill"}'::jsonb, 180, 'Langer dan 5 minuten en de vis wordt rubberachtig.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 6, 'Dresseer', 'Schep de ceviche met wat leche de tigre in een koude kom en werk af met ui, zoete aardappel en koriander.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 0, 'Begin met een schoon bord', 'Koel diepe kommen in de vriezer — ceviche moet ijskoud geserveerd worden.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 1, 'Plaats de saus', 'Schenk een laagje leche de tigre in de kom en druppel er korianderolie in.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 2, 'Positioneer het hoofdonderdeel', 'Schep de vis in een los, hoog hoopje net naast het midden.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 3, 'Voeg garnituur toe', 'Leg rode ui, blokjes zoete aardappel en een partje limoen tegen de vis.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 4, 'Werk af met kruiden', 'Werk af met korianderblaadjes en een snuf peper.'),
  ('e9f7bb93-3fdf-469c-8177-869b1511b1ca', 5, 'Maak de rand van het bord schoon', 'Veeg spetters van de rand en serveer binnen een minuut.');

-- Gebrande makreel met rabarber
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('5ac96381-3a64-46d6-9d5d-f372218a0898', 'gebrande-makreel-met-rabarber', 'platform', null, true, 'Gebrande makreel met rabarber', 'Mierikswortelcrème en dille', 'Licht gezouten makreel met een geblakerd vel, gepekelde rabarber, een scherpe mierikswortelcrème en frisse dille.', 'Vet, zuur en scherpte: dit gerecht balanceert drie smaken in drie kleuren. De brander geeft het vel een rokerige korst terwijl het vlees glazig blijft.', 'voorgerecht', 'gemiddeld', 4, 30, 15, 0, '{"plate":"slate","layout":"diagonal","sauce":{"style":"swoosh","color":"horseradish"},"main":{"kind":"fillet","color":"mackerel","accent":"trout"},"garnish":[{"kind":"cubes","color":"rhubarb"},{"kind":"radish"},{"kind":"dots","color":"rhubarb"}],"herbs":["dill","cress"]}'::jsonb, '#E3E3E6', array['brander', 'pekelen', 'vette vis', 'Scandinavisch']::text[], array['Gasbrander', 'Filetmes', 'Graatpincet', 'Steelpan', 'Microplane']::text[], 'Vet, zuur en scherpte: dit bord balanceert drie smaken in drie kleuren.', 'Vette vis houdt van zuur: een paar druppels van de rabarberpekel over het vel maken het bord compleet.', 'Een droge Riesling uit de Moezel.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '5ac96381-3a64-46d6-9d5d-f372218a0898';
delete from public.recipe_ingredients where recipe_id = '5ac96381-3a64-46d6-9d5d-f372218a0898';
delete from public.recipe_steps where recipe_id = '5ac96381-3a64-46d6-9d5d-f372218a0898';
delete from public.plating_steps where recipe_id = '5ac96381-3a64-46d6-9d5d-f372218a0898';
insert into public.recipe_categories (recipe_id, category_id) values ('5ac96381-3a64-46d6-9d5d-f372218a0898', 'vis'), ('5ac96381-3a64-46d6-9d5d-f372218a0898', 'technieken');
insert into public.ingredients (name) values ('verse makreelfilets'), ('grof zeezout'), ('suiker'), ('stengels rabarber'), ('water'), ('witte wijnazijn'), ('crème fraîche'), ('verse mierikswortel'), ('citroen'), ('radijsjes'), ('dille'), ('cress') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '5ac96381-3a64-46d6-9d5d-f372218a0898'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Makreel'::text, 2::numeric, 'stuks'::text, 'verse makreelfilets'::text, 'met vel'::text),
  (2, 'Makreel'::text, 2::numeric, 'el'::text, 'grof zeezout'::text, null::text),
  (3, 'Makreel'::text, 1::numeric, 'el'::text, 'suiker'::text, null::text),
  (4, 'Gepekelde rabarber'::text, 2::numeric, 'stuks'::text, 'stengels rabarber'::text, null::text),
  (5, 'Gepekelde rabarber'::text, 100::numeric, 'ml'::text, 'water'::text, null::text),
  (6, 'Gepekelde rabarber'::text, 60::numeric, 'ml'::text, 'witte wijnazijn'::text, null::text),
  (7, 'Gepekelde rabarber'::text, 50::numeric, 'g'::text, 'suiker'::text, null::text),
  (8, 'Mierikswortelcrème'::text, 100::numeric, 'g'::text, 'crème fraîche'::text, null::text),
  (9, 'Mierikswortelcrème'::text, 15::numeric, 'g'::text, 'verse mierikswortel'::text, 'geraspt'::text),
  (10, 'Mierikswortelcrème'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, 'sap'::text),
  (11, 'Afwerking'::text, 4::numeric, 'stuks'::text, 'radijsjes'::text, null::text),
  (12, 'Afwerking'::text, 4::numeric, 'takjes'::text, 'dille'::text, null::text),
  (13, 'Afwerking'::text, 1::numeric, 'handje'::text, 'cress'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 1, 'Ontgraat de makreel', 'Verwijder de graatjes in het midden van de filet met een V-snede of pincet.', 'mise-en-place', '{"key":"prep","item":"fish"}'::jsonb, null, null),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 2, 'Zout kort in', 'Bestrooi de vleeskant met zout en suiker en laat 15 minuten staan. Spoel af en dep droog: het vlees wordt steviger en zilter.', 'kruiden', '{"key":"season","item":"fish"}'::jsonb, 900, null),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 3, 'Pekel de rabarber', 'Breng water, azijn en suiker aan de kook en giet over dun gesneden rabarber. Laat afkoelen in de pekel.', 'saus', '{"key":"simmer","tone":"cherry"}'::jsonb, 60, null),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 4, 'Maak de mierikswortelcrème', 'Rasp de mierikswortel pas vlak voor gebruik — hij verliest snel zijn scherpte — en roer door crème fraîche met citroensap.', 'snijden', '{"key":"grate","item":"parmesan"}'::jsonb, null, null),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 5, 'Brand het vel', 'Leg de filets met het vel naar boven op een rooster en brand het vel met een gasbrander tot het blaast en licht zwart kleurt. De binnenkant blijft glazig.', 'bakken', '{"key":"sear","item":"fish"}'::jsonb, 60, 'Geen brander? Leg de filets 1 minuut met het vel in een gloeiend hete, droge pan.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 6, 'Dresseer', 'Trek een swoosh mierikswortelcrème, leg de makreel erop en werk af met rabarber, radijs en dille.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 0, 'Begin met een schoon bord', 'Kies een donker bord zodat het glanzende vel en de roze rabarber oplichten.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 1, 'Plaats de saus', 'Trek met de achterkant van een lepel een swoosh mierikswortelcrème.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 2, 'Positioneer het hoofdonderdeel', 'Leg de makreel in stukken schuin op de swoosh, gebrande kant naar boven.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 3, 'Voeg garnituur toe', 'Verdeel gepekelde rabarber, radijsschijfjes en stippen rabarberpekel rond de vis.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 4, 'Werk af met kruiden', 'Werk af met dille en cress.'),
  ('5ac96381-3a64-46d6-9d5d-f372218a0898', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — crème fraîche op leisteen valt direct op.');

-- Tomatenconsommé met ricotta-gnudi
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 'tomatenconsomme-met-ricotta-gnudi', 'platform', null, true, 'Tomatenconsommé met ricotta-gnudi', 'Kristalheldere bouillon van rijpe tomaten', 'Een goudkleurige, heldere consommé van rijpe tomaten met zachte gnudi van ricotta en Parmigiano, gepelde kerstomaatjes en basilicum.', 'Deze consommé wordt niet gekookt maar geduldig uitgelekt: de pulp druppelt een nacht door een doek. Het resultaat is helder als water en intens als de zomer.', 'voorgerecht', 'uitdagend', 4, 40, 20, 720, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"consomme","accent":"herbOil"},"main":{"kind":"gnocchi","color":"ricotta","count":6},"garnish":[{"kind":"tomatoes"},{"kind":"leaves","color":"green"}],"herbs":["basil","flakes"]}'::jsonb, '#F2E6D8', array['klaren', 'heldere bouillon', 'gnudi', 'vooruit maken']::text[], array['Blender', 'Zeef met kaasdoek', 'Grote kom', 'Soeppan', 'Schuimspaan']::text[], 'Een heldere consommé is pure luxe: niets verbergt de kwaliteit.', 'Gooi de achtergebleven tomatenpulp niet weg: met olijfolie en knoflook is het een perfecte basis voor een saus.', 'Een droge rosé uit de Provence.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '2a7d292a-7a14-4ce7-a739-25980ed16eec';
delete from public.recipe_ingredients where recipe_id = '2a7d292a-7a14-4ce7-a739-25980ed16eec';
delete from public.recipe_steps where recipe_id = '2a7d292a-7a14-4ce7-a739-25980ed16eec';
delete from public.plating_steps where recipe_id = '2a7d292a-7a14-4ce7-a739-25980ed16eec';
insert into public.recipe_categories (recipe_id, category_id) values ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 'vegetarisch'), ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 'soep'), ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 'technieken');
insert into public.ingredients (name) values ('zeer rijpe tomaten'), ('sjalot'), ('knoflook'), ('basilicum'), ('zeezout'), ('suiker'), ('ricotta'), ('Parmigiano Reggiano'), ('eidooier'), ('nootmuskaat'), ('griesmeel'), ('kerstomaatjes'), ('basilicumolie') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '2a7d292a-7a14-4ce7-a739-25980ed16eec'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Consommé'::text, 1.5::numeric, 'kg'::text, 'zeer rijpe tomaten'::text, null::text),
  (2, 'Consommé'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Consommé'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (4, 'Consommé'::text, 15::numeric, 'g'::text, 'basilicum'::text, null::text),
  (5, 'Consommé'::text, 1::numeric, 'tl'::text, 'zeezout'::text, null::text),
  (6, 'Consommé'::text, 1::numeric, 'tl'::text, 'suiker'::text, null::text),
  (7, 'Gnudi'::text, 250::numeric, 'g'::text, 'ricotta'::text, 'uitgelekt'::text),
  (8, 'Gnudi'::text, 40::numeric, 'g'::text, 'Parmigiano Reggiano'::text, 'geraspt'::text),
  (9, 'Gnudi'::text, 1::numeric, 'stuks'::text, 'eidooier'::text, null::text),
  (10, 'Gnudi'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (11, 'Gnudi'::text, 100::numeric, 'g'::text, 'griesmeel'::text, 'om te bestuiven'::text),
  (12, 'Afwerking'::text, 8::numeric, 'stuks'::text, 'kerstomaatjes'::text, null::text),
  (13, 'Afwerking'::text, 6::numeric, 'blaadjes'::text, 'basilicum'::text, null::text),
  (14, 'Afwerking'::text, 1::numeric, 'el'::text, 'basilicumolie'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 1, 'Mix de tomaten grof', 'Snijd de tomaten grof en mix ze kort met sjalot, knoflook, basilicum, zout en suiker. Niet te glad: je wilt pulp, geen puree.', 'saus', '{"key":"blend","tone":"tomato"}'::jsonb, null, null),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 2, 'Laat een nacht uitlekken', 'Hang een zeef met natte kaasdoek boven een kom, schep de pulp erin en laat een nacht in de koelkast uitlekken. Druk niet: dan wordt de consommé troebel.', 'rusten', '{"key":"chill"}'::jsonb, 43200, 'Het resultaat is een kristalhelder, goudkleurig tomatenwater vol smaak.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 3, 'Vorm de gnudi', 'Meng ricotta, Parmigiano, dooier en nootmuskaat. Draai met twee lepels kleine quenelles en rol ze door griesmeel. Laat ze minstens 2 uur in de koelkast een velletje vormen.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 4, 'Pel de kerstomaatjes', 'Kerf de kerstomaatjes in, dompel ze 10 seconden in kokend water en daarna in ijswater. Trek het velletje eraf.', 'garen', '{"key":"boil","item":"tomato"}'::jsonb, 15, null),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 5, 'Pocheer de gnudi', 'Pocheer de gnudi 2 à 3 minuten in zacht kokend gezouten water tot ze bovenkomen. Schep ze met een schuimspaan uit.', 'garen', '{"key":"boil"}'::jsonb, 180, null),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 6, 'Verwarm de consommé', 'Verwarm de consommé voorzichtig tot net onder de kook — koken maakt hem troebel.', 'garen', '{"key":"simmer","tone":"broth"}'::jsonb, null, null),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 7, 'Dresseer aan tafel', 'Schik gnudi en tomaatjes in een diep bord en schenk de hete consommé er aan tafel omheen.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 0, 'Begin met een schoon bord', 'Warm diepe borden voor; een heldere bouillon koelt snel af.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 1, 'Plaats de saus', 'Schik eerst de koude elementen in het bord, zodat de consommé er straks omheen stroomt.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 2, 'Positioneer het hoofdonderdeel', 'Leg drie gnudi in een losse driehoek net naast het midden.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 3, 'Voeg garnituur toe', 'Plaats gepelde kerstomaatjes tussen de gnudi voor kleur.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 4, 'Werk af met kruiden', 'Werk af met basilicumtopjes, schenk aan tafel de hete consommé in en druppel er basilicumolie op.'),
  ('2a7d292a-7a14-4ce7-a739-25980ed16eec', 5, 'Maak de rand van het bord schoon', 'Veeg eventuele spetters van de rand voordat je het bord neerzet.');

-- Groene asperges met hollandaise en gepocheerd ei
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('04cb2784-46ad-4432-8f5c-f855510770ad', 'asperges-met-hollandaise-en-gepocheerd-ei', 'platform', null, true, 'Groene asperges met hollandaise en gepocheerd ei', 'Een klassieke emulsie en een perfect ei', 'Knapperige groene asperges met een zijdezachte hollandaise, een gepocheerd ei met vloeibare dooier en krokant briochekruim.', 'Twee technieken die elke kok moet kennen: een warme botersaus die niet schift, en een ei dat strak blijft in het water. Samen vormen ze een voorjaarsbord dat altijd indruk maakt.', 'voorgerecht', 'gemiddeld', 4, 25, 20, 0, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"swoosh","color":"hollandaise"},"main":{"kind":"egg","color":"eggWhite","accent":"yolk"},"garnish":[{"kind":"asparagus"},{"kind":"crumble","color":"golden"},{"kind":"asparagus"}],"herbs":["chives","chervil","flakes"]}'::jsonb, '#EFEBDD', array['hollandaise', 'pocheren', 'emulsie', 'voorjaar']::text[], array['Steelpan met hittebestendige kom', 'Garde', 'Steelpan', 'Schuimspaan', 'Dunschiller']::text[], 'Een klassiek voorjaarsbord: groen, goud en een dooier die openbreekt aan tafel.', 'Houd de hollandaise warm in een thermoskan of in een kom boven lauw water: zo blijft hij een uur lang perfect.', 'Een Elzasser Pinot Blanc of een Grüner Veltliner.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '04cb2784-46ad-4432-8f5c-f855510770ad';
delete from public.recipe_ingredients where recipe_id = '04cb2784-46ad-4432-8f5c-f855510770ad';
delete from public.recipe_steps where recipe_id = '04cb2784-46ad-4432-8f5c-f855510770ad';
delete from public.plating_steps where recipe_id = '04cb2784-46ad-4432-8f5c-f855510770ad';
insert into public.recipe_categories (recipe_id, category_id) values ('04cb2784-46ad-4432-8f5c-f855510770ad', 'vegetarisch'), ('04cb2784-46ad-4432-8f5c-f855510770ad', 'sauzen'), ('04cb2784-46ad-4432-8f5c-f855510770ad', 'technieken');
insert into public.ingredients (name) values ('groene asperges'), ('boter'), ('zeezout'), ('eidooiers'), ('geklaarde boter'), ('citroensap'), ('water'), ('cayennepeper'), ('zeer verse eieren'), ('witte wijnazijn'), ('briochekruim'), ('bieslook'), ('kervel') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '04cb2784-46ad-4432-8f5c-f855510770ad'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Asperges'::text, 16::numeric, 'stuks'::text, 'groene asperges'::text, null::text),
  (2, 'Asperges'::text, 10::numeric, 'g'::text, 'boter'::text, null::text),
  (3, 'Asperges'::text, null::numeric, 'naar smaak'::text, 'zeezout'::text, null::text),
  (4, 'Hollandaise'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (5, 'Hollandaise'::text, 125::numeric, 'g'::text, 'geklaarde boter'::text, 'warm'::text),
  (6, 'Hollandaise'::text, 1::numeric, 'el'::text, 'citroensap'::text, null::text),
  (7, 'Hollandaise'::text, 1::numeric, 'el'::text, 'water'::text, null::text),
  (8, 'Hollandaise'::text, 1::numeric, 'snuf'::text, 'cayennepeper'::text, null::text),
  (9, 'Gepocheerde eieren'::text, 4::numeric, 'stuks'::text, 'zeer verse eieren'::text, null::text),
  (10, 'Gepocheerde eieren'::text, 2::numeric, 'el'::text, 'witte wijnazijn'::text, null::text),
  (11, 'Afwerking'::text, 30::numeric, 'g'::text, 'briochekruim'::text, 'geroosterd in boter'::text),
  (12, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text),
  (13, 'Afwerking'::text, 4::numeric, 'takjes'::text, 'kervel'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 1, 'Maak de asperges schoon', 'Breek de houtige onderkant van de asperges af en schil het onderste derde dun.', 'mise-en-place', '{"key":"prep","item":"vegetables"}'::jsonb, null, null),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 2, 'Klaar de boter', 'Smelt de boter op laag vuur en laat 5 minuten staan. Schep het schuim eraf en giet de heldere boter af; het melkwater blijft achter.', 'saus', '{"key":"simmer","tone":"butter"}'::jsonb, 300, null),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 3, 'Klop de hollandaise', 'Klop dooiers, water en citroensap boven zacht kokend water tot een luchtige, lintdikke sabayon van ongeveer 65 °C. Voeg de warme boter in een dun straaltje toe terwijl je blijft kloppen.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, 'Wordt de saus te dik of korrelig? Klop er direct een eetlepel lauw water door.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 4, 'Kook de asperges', 'Kook de asperges 2 à 3 minuten in ruim gezouten water. Ze moeten nog een lichte beet hebben.', 'garen', '{"key":"boil","item":"vegetables"}'::jsonb, 180, null),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 5, 'Pocheer de eieren', 'Breek elk ei in een kopje. Maak een zachte draaikolk in water met azijn net onder de kook en laat het ei erin glijden. Pocheer 3 minuten.', 'garen', '{"key":"boil","item":"egg"}'::jsonb, 180, 'Hoe verser het ei, hoe strakker het eiwit om de dooier blijft.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 6, 'Dresseer', 'Trek een swoosh hollandaise, leg het ei en de asperges erop en werk af met briochekruim en kruiden.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 0, 'Begin met een schoon bord', 'Warm een wit bord voor; hollandaise mag niet op een koud bord belanden.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 1, 'Plaats de saus', 'Trek met een lepel een royale swoosh hollandaise diagonaal over het bord.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 2, 'Positioneer het hoofdonderdeel', 'Dep het gepocheerde ei droog op keukenpapier en leg het net naast het midden op de saus.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 3, 'Voeg garnituur toe', 'Leg de asperges in twee bundels schuin tegen het ei en strooi briochekruim ernaast.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 4, 'Werk af met kruiden', 'Werk af met bieslook, kervel en een snufje zout op de dooier.'),
  ('04cb2784-46ad-4432-8f5c-f855510770ad', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — een botersaus laat snel een vetrand na.');

-- Gebakken gamba's met romesco
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 'gambas-met-romesco', 'platform', null, true, 'Gebakken gamba''s met romesco', 'Geroosterde paprika, amandel en knoflook', 'Grote gamba''s, kort gebakken met knoflook en piment d''Espelette, op een brede veeg romesco van geroosterde paprika en amandelen.', 'Romesco komt uit Catalonië: een saus van geroosterde groenten, noten en brood. Hij leert je dat een saus niet altijd glad hoeft te zijn — structuur is hier juist de charme.', 'voorgerecht', 'makkelijk', 4, 25, 30, 0, '{"plate":"stoneware","layout":"offset","sauce":{"style":"smear","color":"romesco"},"main":{"kind":"prawns","color":"shrimp","count":5},"garnish":[{"kind":"nuts"},{"kind":"citrus","color":"lemon"}],"herbs":["chervil","flakes","pepper"]}'::jsonb, '#F2E2D6', array['Spaans', 'saus', 'snel bakken', 'zeevruchten']::text[], array['Oven', 'Blender of vijzel', 'Gietijzeren pan', 'Klein schaartje']::text[], 'Een brede veeg saus als canvas en de gamba''s als penseelstreken.', 'Bak de koppen na in olie en zeef die olie: een paar druppels over het bord geven intense zeesmaak.', 'Een frisse Albariño of een witte Rioja.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '4c40c6c2-c2b2-4846-8233-cdd67c36dce3';
delete from public.recipe_ingredients where recipe_id = '4c40c6c2-c2b2-4846-8233-cdd67c36dce3';
delete from public.recipe_steps where recipe_id = '4c40c6c2-c2b2-4846-8233-cdd67c36dce3';
delete from public.plating_steps where recipe_id = '4c40c6c2-c2b2-4846-8233-cdd67c36dce3';
insert into public.recipe_categories (recipe_id, category_id) values ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 'vis'), ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 'sauzen');
insert into public.ingredients (name) values ('grote gamba''s'), ('olijfolie'), ('knoflook'), ('piment d''Espelette'), ('vlokzout'), ('rode paprika''s'), ('tomaten'), ('geroosterde amandelen'), ('hazelnoten'), ('oud brood'), ('sherryazijn'), ('gerookt paprikapoeder'), ('citroen'), ('platte peterselie') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '4c40c6c2-c2b2-4846-8233-cdd67c36dce3'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Gamba''s'::text, 12::numeric, 'stuks'::text, 'grote gamba''s'::text, 'met kop'::text),
  (2, 'Gamba''s'::text, 2::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (3, 'Gamba''s'::text, 2::numeric, 'teentjes'::text, 'knoflook'::text, 'in plakjes'::text),
  (4, 'Gamba''s'::text, 1::numeric, 'snuf'::text, 'piment d''Espelette'::text, null::text),
  (5, 'Gamba''s'::text, null::numeric, 'naar smaak'::text, 'vlokzout'::text, null::text),
  (6, 'Romesco'::text, 2::numeric, 'stuks'::text, 'rode paprika''s'::text, null::text),
  (7, 'Romesco'::text, 2::numeric, 'stuks'::text, 'tomaten'::text, null::text),
  (8, 'Romesco'::text, 40::numeric, 'g'::text, 'geroosterde amandelen'::text, null::text),
  (9, 'Romesco'::text, 20::numeric, 'g'::text, 'hazelnoten'::text, null::text),
  (10, 'Romesco'::text, 1::numeric, 'sneetjes'::text, 'oud brood'::text, null::text),
  (11, 'Romesco'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (12, 'Romesco'::text, 1::numeric, 'el'::text, 'sherryazijn'::text, null::text),
  (13, 'Romesco'::text, 1::numeric, 'tl'::text, 'gerookt paprikapoeder'::text, null::text),
  (14, 'Romesco'::text, 60::numeric, 'ml'::text, 'olijfolie'::text, null::text),
  (15, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, null::text),
  (16, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'platte peterselie'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 1, 'Rooster paprika en tomaat', 'Rooster paprika''s en tomaten 30 minuten op 220 °C tot het vel zwart blakert. Laat afgedekt afkoelen en pel ze.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 1800, null),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 2, 'Mix de romesco', 'Mix paprika, tomaat, noten, brood, knoflook, azijn en paprikapoeder grof. Voeg de olie in een straaltje toe tot een smeuïge, licht grove saus.', 'saus', '{"key":"blend","tone":"tomato"}'::jsonb, null, 'Romesco hoort een beetje structuur te hebben; mix hem niet helemaal glad.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 3, 'Maak de gamba''s schoon', 'Pel de gamba''s tot aan de staart, laat de kop eraan en verwijder de darm met een schaartje of mesje.', 'mise-en-place', '{"key":"prep","item":"prawns"}'::jsonb, null, null),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 4, 'Kruid de gamba''s', 'Dep de gamba''s droog en kruid ze met olijfolie, knoflook en piment d''Espelette.', 'kruiden', '{"key":"season","item":"prawns"}'::jsonb, null, null),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 5, 'Bak ze kort', 'Bak de gamba''s in een gloeiend hete pan 1 minuut per kant tot ze net roze zijn.', 'bakken', '{"key":"sear","item":"prawns"}'::jsonb, 120, 'Een gamba die een C vormt is perfect; een O betekent overgaar.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 6, 'Dresseer', 'Trek een brede veeg romesco, leg de gamba''s ernaast en werk af met amandel, citroen en peterselie.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 0, 'Begin met een schoon bord', 'Kies een zandkleurig bord — de oranjerode romesco komt er warm op uit.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 1, 'Plaats de saus', 'Leg een lepel romesco aan de linkerkant en trek hem met de bolle kant van de lepel in een brede boog uit.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 2, 'Positioneer het hoofdonderdeel', 'Leg de gamba''s in een waaier rechts van de veeg, met de staarten naar dezelfde kant.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 3, 'Voeg garnituur toe', 'Strooi gehakte geroosterde amandelen en zet een partje citroen tegen de gamba''s.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 4, 'Werk af met kruiden', 'Werk af met peterselie, vlokzout en een snufje piment.'),
  ('4c40c6c2-c2b2-4846-8233-cdd67c36dce3', 5, 'Maak de rand van het bord schoon', 'Veeg olievlekken van de rand.');

-- Ravioli met ricotta en salieboter
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 'ravioli-met-ricotta-en-salieboter', 'platform', null, true, 'Ravioli met ricotta en salieboter', 'Verse pasta, spinazie en bruine boter', 'Zijdezachte, zelfgemaakte ravioli gevuld met ricotta, spinazie en citroen, in een spiegel van nootachtige salieboter met geroosterde hazelnoot.', 'Verse pasta maken is ambacht: kneden, rusten, flinterdun rollen en vullen zonder luchtbellen. Wie het eenmaal beheerst, koopt nooit meer kant-en-klare ravioli.', 'voorgerecht', 'uitdagend', 4, 60, 10, 30, '{"plate":"porcelain","layout":"center","sauce":{"style":"pool","color":"brownButter"},"main":{"kind":"ravioli","color":"pasta","count":4},"garnish":[{"kind":"nuts"}],"herbs":["sage","pepper"]}'::jsonb, '#EFE6D2', array['verse pasta', 'deeg rollen', 'vullen', 'beurre noisette']::text[], array['Pastamachine', 'Ravioliring of uitsteekvorm', 'Spuitzak', 'Grote kookpan', 'Koekenpan']::text[], 'Vier ravioli, een spiegel van bruine boter en krokante salie: eenvoud die precisie verraadt.', 'Leg verse ravioli op een met griesmeel bestoven plank: bloem wordt nat en plakt, griesmeel niet.', 'Een Vermentino of een lichte Pinot Grigio uit Friuli.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '1c6d3a54-dafe-49ae-9ca3-e4eb990b214e';
delete from public.recipe_ingredients where recipe_id = '1c6d3a54-dafe-49ae-9ca3-e4eb990b214e';
delete from public.recipe_steps where recipe_id = '1c6d3a54-dafe-49ae-9ca3-e4eb990b214e';
delete from public.plating_steps where recipe_id = '1c6d3a54-dafe-49ae-9ca3-e4eb990b214e';
insert into public.recipe_categories (recipe_id, category_id) values ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 'pasta'), ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 'vegetarisch'), ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 'technieken');
insert into public.ingredients (name) values ('tipo 00-bloem'), ('eieren'), ('eidooier'), ('zout'), ('ricotta'), ('spinazie'), ('Parmigiano Reggiano'), ('nootmuskaat'), ('citroen'), ('boter'), ('salie'), ('hazelnoten') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '1c6d3a54-dafe-49ae-9ca3-e4eb990b214e'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Pastadeeg'::text, 200::numeric, 'g'::text, 'tipo 00-bloem'::text, null::text),
  (2, 'Pastadeeg'::text, 2::numeric, 'stuks'::text, 'eieren'::text, null::text),
  (3, 'Pastadeeg'::text, 1::numeric, 'stuks'::text, 'eidooier'::text, null::text),
  (4, 'Pastadeeg'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (5, 'Vulling'::text, 250::numeric, 'g'::text, 'ricotta'::text, 'uitgelekt'::text),
  (6, 'Vulling'::text, 150::numeric, 'g'::text, 'spinazie'::text, null::text),
  (7, 'Vulling'::text, 40::numeric, 'g'::text, 'Parmigiano Reggiano'::text, null::text),
  (8, 'Vulling'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (9, 'Vulling'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, 'rasp'::text),
  (10, 'Salieboter'::text, 80::numeric, 'g'::text, 'boter'::text, null::text),
  (11, 'Salieboter'::text, 12::numeric, 'blaadjes'::text, 'salie'::text, null::text),
  (12, 'Salieboter'::text, 20::numeric, 'g'::text, 'hazelnoten'::text, 'gehakt'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 1, 'Kneed het pastadeeg', 'Maak een kuiltje in de bloem, klop de eieren erin en kneed 10 minuten tot een glad, soepel deeg. Laat 30 minuten rusten onder folie.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, 1800, 'Te droog? Maak je handen nat. Te plakkerig? Een snufje bloem.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 2, 'Maak de vulling', 'Blancheer de spinazie, knijp hem kurkdroog en hak fijn. Meng met ricotta, Parmigiano, nootmuskaat en citroenrasp. Doe in een spuitzak.', 'snijden', '{"key":"chop","item":"herbs"}'::jsonb, null, null),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 3, 'Rol het deeg uit', 'Rol het deeg door de pastamachine tot de op één na dunste stand. Het deeg moet net doorschijnend zijn.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 4, 'Vul en sluit', 'Spuit hoopjes vulling op het deeg, bestrijk de randen met water, leg een tweede vel erover en druk rond elke vulling alle lucht weg. Steek de ravioli uit.', 'dresseren', '{"key":"pipe"}'::jsonb, null, 'Luchtbellen laten ravioli openbarsten in het kookwater.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 5, 'Kook de ravioli', 'Kook de ravioli 2 à 3 minuten in zacht kokend gezouten water.', 'garen', '{"key":"boil","item":"pasta"}'::jsonb, 180, null),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 6, 'Maak salieboter', 'Laat de boter schuimen tot hij nootachtig bruin kleurt, voeg salie en hazelnoot toe en bak de salie krokant.', 'saus', '{"key":"simmer","tone":"brown-butter"}'::jsonb, 180, null),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 7, 'Dresseer', 'Leg de ravioli op een spiegel van bruine boter en werk af met krokante salie en hazelnoot.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 0, 'Begin met een schoon bord', 'Warm een wit bord voor met een licht verdiept midden.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 1, 'Plaats de saus', 'Schep een lepel bruine boter in het midden, zodat die zich als een glanzende spiegel verspreidt.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 2, 'Positioneer het hoofdonderdeel', 'Leg vier ravioli in een losse ruit op de boter, met de mooiste kant naar boven.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 3, 'Voeg garnituur toe', 'Verdeel de geroosterde hazelnoot rond de ravioli.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 4, 'Werk af met kruiden', 'Leg krokante salieblaadjes op de ravioli en werk af met peper.'),
  ('1c6d3a54-dafe-49ae-9ca3-e4eb990b214e', 5, 'Maak de rand van het bord schoon', 'Veeg boterdruppels van de rand.');

-- Terrine van eend met vijgenchutney
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('9270a430-2caf-4caa-8483-e9658fcaf381', 'terrine-van-eend-met-vijgenchutney', 'platform', null, true, 'Terrine van eend met vijgenchutney', 'Pistache, cognac en geroosterd zuurdesem', 'Een grove terrine van eend en varkensnek met pistache en cognac, geserveerd met een jammy vijgenchutney en krokant brood.', 'Een terrine is de charcuterie van de chef: vooruit te maken, feestelijk om te snijden en een les in garen op lage temperatuur.', 'voorgerecht', 'uitdagend', 10, 60, 90, 1440, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"dots","color":"fig"},"main":{"kind":"bar","color":"duck","accent":"chicken"},"garnish":[{"kind":"figs"},{"kind":"nuts"},{"kind":"leaves","color":"green"}],"herbs":["micro","flakes","pepper"]}'::jsonb, '#EEE2DA', array['terrine', 'au bain-marie', 'charcuterie', 'vooruit maken']::text[], array['Terrinevorm van 1 liter', 'Vleesmolen of keukenmachine', 'Oven', 'Kernthermometer', 'Ovenschaal']::text[], 'Een strakke plak terrine vraagt om een bord met ritme: stippen chutney, knapperig brood en fris groen.', 'Snijd terrine met een mes dat je telkens in heet water dompelt en afdroogt: zo krijg je strakke snijvlakken.', 'Een fruitige Pinot Noir of een glas Sauternes.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '9270a430-2caf-4caa-8483-e9658fcaf381';
delete from public.recipe_ingredients where recipe_id = '9270a430-2caf-4caa-8483-e9658fcaf381';
delete from public.recipe_steps where recipe_id = '9270a430-2caf-4caa-8483-e9658fcaf381';
delete from public.plating_steps where recipe_id = '9270a430-2caf-4caa-8483-e9658fcaf381';
insert into public.recipe_categories (recipe_id, category_id) values ('9270a430-2caf-4caa-8483-e9658fcaf381', 'vlees'), ('9270a430-2caf-4caa-8483-e9658fcaf381', 'technieken');
insert into public.ingredients (name) values ('eendenboutvlees'), ('varkensnek'), ('ongerookt spek'), ('sjalot'), ('cognac'), ('pistachenoten'), ('ei'), ('zout'), ('quatre-épices'), ('ontbijtspek'), ('gedroogde vijgen'), ('rode ui'), ('rode wijnazijn'), ('bruine suiker'), ('kaneelstokje'), ('veldsla'), ('zuurdesembrood') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '9270a430-2caf-4caa-8483-e9658fcaf381'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Terrine'::text, 400::numeric, 'g'::text, 'eendenboutvlees'::text, 'zonder vel'::text),
  (2, 'Terrine'::text, 300::numeric, 'g'::text, 'varkensnek'::text, null::text),
  (3, 'Terrine'::text, 150::numeric, 'g'::text, 'ongerookt spek'::text, null::text),
  (4, 'Terrine'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (5, 'Terrine'::text, 50::numeric, 'ml'::text, 'cognac'::text, null::text),
  (6, 'Terrine'::text, 40::numeric, 'g'::text, 'pistachenoten'::text, null::text),
  (7, 'Terrine'::text, 1::numeric, 'stuks'::text, 'ei'::text, null::text),
  (8, 'Terrine'::text, 12::numeric, 'g'::text, 'zout'::text, null::text),
  (9, 'Terrine'::text, 1::numeric, 'tl'::text, 'quatre-épices'::text, null::text),
  (10, 'Terrine'::text, 8::numeric, 'sneetjes'::text, 'ontbijtspek'::text, 'voor de vorm'::text),
  (11, 'Vijgenchutney'::text, 250::numeric, 'g'::text, 'gedroogde vijgen'::text, null::text),
  (12, 'Vijgenchutney'::text, 1::numeric, 'stuks'::text, 'rode ui'::text, null::text),
  (13, 'Vijgenchutney'::text, 60::numeric, 'ml'::text, 'rode wijnazijn'::text, null::text),
  (14, 'Vijgenchutney'::text, 40::numeric, 'g'::text, 'bruine suiker'::text, null::text),
  (15, 'Vijgenchutney'::text, 1::numeric, 'stuks'::text, 'kaneelstokje'::text, null::text),
  (16, 'Afwerking'::text, 1::numeric, 'handje'::text, 'veldsla'::text, null::text),
  (17, 'Afwerking'::text, 4::numeric, 'sneetjes'::text, 'zuurdesembrood'::text, 'geroosterd'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 1, 'Marineer het vlees', 'Snijd eend, varkensnek en spek in blokjes, meng met sjalot, cognac, zout en kruiden en laat minstens 2 uur marineren.', 'mise-en-place', '{"key":"prep","item":"duck"}'::jsonb, 7200, null),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 2, 'Maal grof', 'Maal twee derde van het vlees grof en snijd de rest in blokjes van 1 cm voor textuur. Meng met ei en pistache.', 'snijden', '{"key":"slice","item":"duck"}'::jsonb, null, null),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 3, 'Vul de vorm', 'Bekleed de terrinevorm met ontbijtspek, vul met de farce, druk goed aan en vouw het spek eroverheen.', 'kruiden', '{"key":"season","item":"duck"}'::jsonb, null, 'Bak een theelepel farce in een pannetje om de smaak te proeven vóór je de vorm vult.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 4, 'Gaar au bain-marie', 'Zet de vorm in een ovenschaal met heet water en gaar ca. 90 minuten op 150 °C tot een kerntemperatuur van 68 °C.', 'garen', '{"key":"boil"}'::jsonb, 5400, null),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 5, 'Pers en laat opstijven', 'Leg een plankje met een gewicht op de afgekoelde terrine en laat minstens 24 uur in de koelkast opstijven. De smaken hebben die tijd nodig.', 'rusten', '{"key":"chill"}'::jsonb, 86400, null),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 6, 'Maak de vijgenchutney', 'Stoof ui en vijgen met azijn, suiker en kaneel 25 minuten zacht tot een jammy chutney.', 'saus', '{"key":"simmer","tone":"cherry"}'::jsonb, 1500, null),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 7, 'Snijd en dresseer', 'Snijd een plak terrine met een heet mes en serveer met chutney, vijgen, pistache en brood.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 0, 'Begin met een schoon bord', 'Kies een groot wit bord; de marmering van de terrine moet goed zichtbaar zijn.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 1, 'Plaats de saus', 'Zet drie stippen vijgenchutney in aflopende grootte langs een diagonaal.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 2, 'Positioneer het hoofdonderdeel', 'Snijd een plak van 1,5 cm met een heet, droog mes en leg hem schuin over het midden.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 3, 'Voeg garnituur toe', 'Leg gehalveerde vijgen en pistache tussen de stippen en een krokant toastje tegen de terrine.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 4, 'Werk af met kruiden', 'Werk af met veldsla, microgroen, vlokzout en peper op de snijkant.'),
  ('9270a430-2caf-4caa-8483-e9658fcaf381', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en laat de terrine 10 minuten op temperatuur komen: koude terrine smaakt vlak.');
