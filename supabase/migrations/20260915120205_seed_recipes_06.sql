-- Platformrecepten deel 06 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Crème brûlée met tonkaboon
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 'creme-brulee-met-tonkaboon', 'platform', null, true, 'Crème brûlée met tonkaboon', 'Glasharde karamel en frambozen', 'Een zijdezachte custard met de warme, amandelachtige smaak van tonkaboon, onder een glasharde laag gebrande suiker.', 'Crème brûlée draait om geduld en lage temperatuur. De tonkaboon voegt tonen van vanille, amandel en kersen toe — spaarzaam gebruiken, want hij is krachtig.', 'nagerecht', 'gemiddeld', 6, 20, 55, 240, '{"plate":"stoneware","layout":"center","sauce":{"style":"none","color":"caramel"},"main":{"kind":"ramekin","color":"caramel"},"garnish":[{"kind":"berries","variant":"raspberry"},{"kind":"leaves","color":"green"}],"herbs":["mint","flowers"]}'::jsonb, '#F0E6D2', array['custard', 'au bain-marie', 'brander', 'klassiek Frans']::text[], array['Ramekins', 'Ovenschaal', 'Steelpan', 'Fijne zeef', 'Gasbrander', 'Microplane']::text[], 'Het geluid van de lepel die door de karamel breekt, is de plating.', 'Karamelliseer pas vlak voor het serveren: na een half uur in de koelkast wordt de korst zacht.', 'Een Sauternes of een Tokaji Aszú.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '0cc7ad3c-ca4d-4f51-9150-a77d546e59b4';
delete from public.recipe_ingredients where recipe_id = '0cc7ad3c-ca4d-4f51-9150-a77d546e59b4';
delete from public.recipe_steps where recipe_id = '0cc7ad3c-ca4d-4f51-9150-a77d546e59b4';
delete from public.plating_steps where recipe_id = '0cc7ad3c-ca4d-4f51-9150-a77d546e59b4';
insert into public.recipe_categories (recipe_id, category_id) values ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 'technieken');
insert into public.ingredients (name) values ('slagroom'), ('volle melk'), ('tonkaboon'), ('eidooiers'), ('kristalsuiker'), ('rietsuiker of kristalsuiker'), ('frambozen'), ('munt') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '0cc7ad3c-ca4d-4f51-9150-a77d546e59b4'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Crème'::text, 500::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (2, 'Crème'::text, 100::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (3, 'Crème'::text, 0.5::numeric, 'stuks'::text, 'tonkaboon'::text, 'geraspt'::text),
  (4, 'Crème'::text, 6::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (5, 'Crème'::text, 80::numeric, 'g'::text, 'kristalsuiker'::text, null::text),
  (6, 'Karamelkorst'::text, 6::numeric, 'el'::text, 'rietsuiker of kristalsuiker'::text, null::text),
  (7, 'Afwerking'::text, 12::numeric, 'stuks'::text, 'frambozen'::text, null::text),
  (8, 'Afwerking'::text, 6::numeric, 'blaadjes'::text, 'munt'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 1, 'Trek de room', 'Verwarm room en melk met de geraspte tonkaboon tot net onder de kook. Laat 10 minuten trekken.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 600, 'Tonkaboon is krachtig: rasp maximaal een halve boon voor zes porties.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 2, 'Meng met de dooiers', 'Roer dooiers en suiker los — niet schuimig kloppen, want luchtbellen geven gaatjes. Giet de warme room er al roerend bij en zeef.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, null),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 3, 'Gaar au bain-marie', 'Verdeel de crème over de ramekins, zet ze in een ovenschaal met heet water tot halverwege en gaar 40 à 45 minuten op 110 °C. Het midden moet nog licht trillen.', 'garen', '{"key":"boil"}'::jsonb, 2700, null),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 4, 'Laat opstijven', 'Laat afkoelen en zet minstens 4 uur in de koelkast.', 'rusten', '{"key":"chill"}'::jsonb, 14400, null),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 5, 'Karamelliseer', 'Strooi een dun, egaal laagje suiker over de koude crème en brand met een gasbrander tot een diep amberkleurige, glasharde korst.', 'garen', '{"key":"torch"}'::jsonb, null, 'Twee dunne laagjes suiker na elkaar geven een gelijkmatiger korst dan één dikke laag.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 6, 'Dresseer', 'Zet de ramekin op een bordje en leg frambozen en munt ernaast.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 0, 'Begin met een schoon bord', 'Zet de ramekin op een klein stoneware bord met een servetje of blad eronder, zodat hij niet schuift.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 1, 'Plaats de saus', 'Een crème brûlée heeft geen saus nodig; houd het bord rondom rustig.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 2, 'Positioneer het hoofdonderdeel', 'Controleer of de karamelkorst egaal en glashard is; brand dunne plekken nog even bij.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 3, 'Voeg garnituur toe', 'Leg twee of drie frambozen naast de ramekin, niet op de korst — die moet knapperig blijven.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 4, 'Werk af met kruiden', 'Werk af met een muntblaadje en eventueel een eetbaar bloemetje.'),
  ('0cc7ad3c-ca4d-4f51-9150-a77d546e59b4', 5, 'Maak de rand van het bord schoon', 'Veeg suikerkristallen van de rand van ramekin en bord.');

-- Tarte tatin
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 'tarte-tatin', 'platform', null, true, 'Tarte tatin', 'Karamelappels en crème fraîche', 'Omgekeerde appeltaart met diep gekarameliseerde appels onder een krokante bladerdeegbodem, geserveerd met een koele quenelle crème fraîche.', 'Volgens de legende een gelukkig ongeluk van de zusjes Tatin. Het is vooral een les in karamel: de juiste kleur bepaalt of de taart bitter, flauw of perfect wordt.', 'nagerecht', 'gemiddeld', 8, 60, 55, 10, '{"plate":"porcelain","layout":"offset","sauce":{"style":"dots","color":"caramel"},"main":{"kind":"tart","color":"caramel","accent":"pastry"},"garnish":[{"kind":"appleFan","color":"apple"},{"kind":"nuts"}],"herbs":["mint","cocoa"]}'::jsonb, '#F0E4D4', array['karamel', 'omgekeerde taart', 'bladerdeeg', 'klassiek Frans']::text[], array['Ovenvaste koekenpan van 24 cm', 'Oven', 'Deegroller', 'Groot bord om te keren']::text[], 'Een tatin is rustiek: toon de glanzende karamel en voeg alleen een koele tegenhanger toe.', 'Gebruik zure, stevige appels: zoete, zachte appels vallen uit elkaar in de karamel.', 'Een Calvados Pays d''Auge of een moelleux uit de Loire.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'e3be766f-f5aa-41b0-8e40-806192b7bd0e';
delete from public.recipe_ingredients where recipe_id = 'e3be766f-f5aa-41b0-8e40-806192b7bd0e';
delete from public.recipe_steps where recipe_id = 'e3be766f-f5aa-41b0-8e40-806192b7bd0e';
delete from public.plating_steps where recipe_id = 'e3be766f-f5aa-41b0-8e40-806192b7bd0e';
insert into public.recipe_categories (recipe_id, category_id) values ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 'technieken');
insert into public.ingredients (name) values ('stevige appels'), ('kristalsuiker'), ('boter'), ('vanillestokje'), ('zeezout'), ('roomboterbladerdeeg'), ('crème fraîche'), ('poedersuiker'), ('munt') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'e3be766f-f5aa-41b0-8e40-806192b7bd0e'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Karamelappels'::text, 6::numeric, 'stuks'::text, 'stevige appels'::text, 'Goudrenet of Elstar'::text),
  (2, 'Karamelappels'::text, 120::numeric, 'g'::text, 'kristalsuiker'::text, null::text),
  (3, 'Karamelappels'::text, 60::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Karamelappels'::text, 1::numeric, 'stuks'::text, 'vanillestokje'::text, null::text),
  (5, 'Karamelappels'::text, 1::numeric, 'snuf'::text, 'zeezout'::text, null::text),
  (6, 'Deeg'::text, 250::numeric, 'g'::text, 'roomboterbladerdeeg'::text, null::text),
  (7, 'Afwerking'::text, 150::numeric, 'g'::text, 'crème fraîche'::text, null::text),
  (8, 'Afwerking'::text, 1::numeric, 'el'::text, 'poedersuiker'::text, null::text),
  (9, 'Afwerking'::text, 4::numeric, 'blaadjes'::text, 'munt'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 1, 'Schil en kwart de appels', 'Schil de appels, verwijder het klokhuis en snijd ze in kwarten. Laat ze 30 minuten onafgedekt drogen: dat voorkomt een waterige karamel.', 'snijden', '{"key":"chop","item":"apple"}'::jsonb, 1800, null),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 2, 'Maak droge karamel', 'Smelt de suiker zonder te roeren in de pan tot een amberkleurige karamel. Haal van het vuur en roer boter, vanillemerg en zout erdoor.', 'saus', '{"key":"simmer","tone":"caramel"}'::jsonb, 480, 'Zwenk de pan in plaats van te roeren: roeren laat suiker kristalliseren.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 3, 'Leg de appels in de karamel', 'Leg de appelkwarten dicht tegen elkaar in een cirkel in de karamel, bolle kant naar beneden. Laat 15 minuten zacht garen tot de karamel dikker wordt.', 'bakken', '{"key":"sear","item":"apple"}'::jsonb, 900, null),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 4, 'Dek af met deeg', 'Rol het bladerdeeg uit tot een cirkel die iets groter is dan de pan, leg het over de appels en stop de randen in. Prik een paar stoomgaatjes.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 5, 'Bak goudbruin', 'Bak 30 minuten op 200 °C tot het deeg diep goudbruin en krokant is.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 1800, null),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 6, 'Laat rusten en keer om', 'Laat 10 minuten rusten, leg een groot bord op de pan en keer in één vastberaden beweging om.', 'rusten', '{"key":"prep","item":"apple"}'::jsonb, 600, 'Te lang wachten laat de karamel vastkleven; te snel geeft brandwonden. Tien minuten is ideaal.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 7, 'Dresseer', 'Serveer een punt tatin met stippen karamel en een quenelle crème fraîche.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 0, 'Begin met een schoon bord', 'Kies een wit bord zodat de diepbruine karamel glanst.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 1, 'Plaats de saus', 'Zet een paar stippen karamel uit de pan in een lichte boog.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 2, 'Positioneer het hoofdonderdeel', 'Leg een royale punt tarte tatin iets rechts van het midden, karamelkant naar boven.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 3, 'Voeg garnituur toe', 'Draai een quenelle crème fraîche en leg die naast de taart, met een paar dunne plakjes rauwe appel.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 4, 'Werk af met kruiden', 'Werk af met een muntblaadje en een wolkje poedersuiker langs de rand van het deeg.'),
  ('e3be766f-f5aa-41b0-8e40-806192b7bd0e', 5, 'Maak de rand van het bord schoon', 'Veeg karameldruppels weg voordat ze stollen.');

-- Panna cotta met rabarber en gember
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 'panna-cotta-met-rabarber', 'platform', null, true, 'Panna cotta met rabarber en gember', 'Vanille, geroosterde rabarber en gembercrumble', 'Een trillende vanille-panna cotta in een spiegel van roze rabarbersiroop, met geroosterde rabarber en een knapperige gembercrumble.', 'De perfecte panna cotta staat net en trilt als je het bord beweegt. Het is een oefening in precisie met gelatine — en een ideaal dessert om vooruit te maken.', 'nagerecht', 'makkelijk', 4, 20, 30, 240, '{"plate":"porcelain","layout":"center","sauce":{"style":"pool","color":"rhubarb"},"main":{"kind":"dome","color":"panna","accent":"rhubarb"},"garnish":[{"kind":"cubes","color":"rhubarb"},{"kind":"crumble","color":"golden"}],"herbs":["mint","flowers"]}'::jsonb, '#F2E4E6', array['gelatine', 'storten', 'voorjaar', 'vooruit maken']::text[], array['Dariolevormpjes', 'Steelpan', 'Garde', 'Ovenschaal', 'Kom met heet water']::text[], 'Een trillende panna cotta in een spiegel van roze siroop: puur en voorjaarsachtig.', 'Wrijf de vormpjes in met neutrale olie en veeg ze daarna bijna droog: de panna cotta laat dan moeiteloos los.', 'Een Moscato d''Asti of een rosé crémant.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '2d4862fd-c542-42b1-9ae4-105b83e3c483';
delete from public.recipe_ingredients where recipe_id = '2d4862fd-c542-42b1-9ae4-105b83e3c483';
delete from public.recipe_steps where recipe_id = '2d4862fd-c542-42b1-9ae4-105b83e3c483';
delete from public.plating_steps where recipe_id = '2d4862fd-c542-42b1-9ae4-105b83e3c483';
insert into public.recipe_categories (recipe_id, category_id) values ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 'plating');
insert into public.ingredients (name) values ('slagroom'), ('volle melk'), ('suiker'), ('vanillestokje'), ('gelatine'), ('rabarber'), ('gember'), ('sinaasappel'), ('koude boter'), ('bloem'), ('gemberpoeder') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '2d4862fd-c542-42b1-9ae4-105b83e3c483'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Panna cotta'::text, 400::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (2, 'Panna cotta'::text, 100::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (3, 'Panna cotta'::text, 50::numeric, 'g'::text, 'suiker'::text, null::text),
  (4, 'Panna cotta'::text, 1::numeric, 'stuks'::text, 'vanillestokje'::text, null::text),
  (5, 'Panna cotta'::text, 3::numeric, 'blaadjes'::text, 'gelatine'::text, null::text),
  (6, 'Rabarber'::text, 300::numeric, 'g'::text, 'rabarber'::text, null::text),
  (7, 'Rabarber'::text, 60::numeric, 'g'::text, 'suiker'::text, null::text),
  (8, 'Rabarber'::text, 15::numeric, 'g'::text, 'gember'::text, 'geraspt'::text),
  (9, 'Rabarber'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'sap'::text),
  (10, 'Gembercrumble'::text, 40::numeric, 'g'::text, 'koude boter'::text, null::text),
  (11, 'Gembercrumble'::text, 40::numeric, 'g'::text, 'bloem'::text, null::text),
  (12, 'Gembercrumble'::text, 30::numeric, 'g'::text, 'suiker'::text, null::text),
  (13, 'Gembercrumble'::text, 1::numeric, 'tl'::text, 'gemberpoeder'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 1, 'Week de gelatine', 'Week de gelatineblaadjes 5 minuten in koud water.', 'mise-en-place', '{"key":"chill"}'::jsonb, 300, null),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 2, 'Verwarm de room', 'Verwarm room, melk, suiker en vanillemerg tot net onder de kook. Knijp de gelatine uit en los op in de warme room.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 300, null),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 3, 'Giet en laat opstijven', 'Zeef, giet in licht ingevette vormpjes en laat minstens 4 uur opstijven.', 'rusten', '{"key":"chill"}'::jsonb, 14400, 'Drie blaadjes op een halve liter geeft een panna cotta die net staat en zacht trilt.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 4, 'Rooster de rabarber', 'Snijd de rabarber in stukken, meng met suiker, gember en sinaasappelsap en rooster 12 à 15 minuten op 180 °C tot hij zacht is maar zijn vorm houdt. Kook het sap in tot een siroop.', 'garen', '{"key":"simmer","tone":"cherry"}'::jsonb, 900, null),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 5, 'Bak de gembercrumble', 'Wrijf boter, bloem, suiker en gember tot kruimels en bak 12 minuten op 170 °C goudbruin.', 'garen', '{"key":"roast","item":"chocolate"}'::jsonb, 720, null),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 6, 'Stort en dresseer', 'Stort de panna cotta in een spiegel van siroop en werk af met rabarber, crumble en munt.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 0, 'Begin met een schoon bord', 'Kies een wit bord met een licht verdiept midden, zodat de siroop blijft liggen.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 1, 'Plaats de saus', 'Schep de rabarbersiroop in een ronde spiegel in het midden.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 2, 'Positioneer het hoofdonderdeel', 'Dompel het vormpje 3 seconden in heet water en stort de panna cotta midden in de siroop.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 3, 'Voeg garnituur toe', 'Leg stukjes geroosterde rabarber rond de panna cotta en strooi gembercrumble aan één kant.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 4, 'Werk af met kruiden', 'Werk af met een muntblaadje en een eetbaar bloemetje op de top.'),
  ('2d4862fd-c542-42b1-9ae4-105b83e3c483', 5, 'Maak de rand van het bord schoon', 'Veeg siroopdruppels van de rand.');

-- Chocoladefondant met vanille-ijs
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 'chocoladefondant-met-vanille-ijs', 'platform', null, true, 'Chocoladefondant met vanille-ijs', 'Een vloeibaar hart van pure chocolade', 'Warme chocoladefondant met een krokant randje en een vloeibaar hart, geserveerd met vanille-ijs, frambozen en cacaocrumble.', 'Het verschil tussen een fondant en een chocoladecake is één minuut in de oven. Dit recept leert je vertrouwen op timing, gekoeld beslag en een proefexemplaar.', 'nagerecht', 'gemiddeld', 4, 20, 15, 30, '{"plate":"stoneware","layout":"offset","sauce":{"style":"crumble","color":"chocolate","accent":"coulis"},"main":{"kind":"dome","color":"chocolate"},"garnish":[{"kind":"berries","variant":"raspberry"},{"kind":"leaves","color":"green"}],"herbs":["cocoa","gold","mint"]}'::jsonb, '#EBDFD6', array['lava cake', 'timing', 'chocolade', 'warm dessert']::text[], array['Dariolevormpjes', 'Hittebestendige kom', 'Garde', 'Oven', 'Kwast']::text[], 'Warm en koud, bitter en zoet: de fondant breekt open, het ijs smelt in de chocolade.', 'Bak één proeffondant: ovens verschillen en één minuut bepaalt of het hart vloeibaar of gestold is.', 'Een Banyuls of een Pedro Ximénez.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'd9e18e6b-a0af-4f2d-b132-c7b92b1e37ee';
delete from public.recipe_ingredients where recipe_id = 'd9e18e6b-a0af-4f2d-b132-c7b92b1e37ee';
delete from public.recipe_steps where recipe_id = 'd9e18e6b-a0af-4f2d-b132-c7b92b1e37ee';
delete from public.plating_steps where recipe_id = 'd9e18e6b-a0af-4f2d-b132-c7b92b1e37ee';
insert into public.recipe_categories (recipe_id, category_id) values ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 'technieken');
insert into public.ingredients (name) values ('pure chocolade 70%'), ('boter'), ('eieren'), ('eidooiers'), ('suiker'), ('bloem'), ('zeezout'), ('zachte boter'), ('cacaopoeder'), ('vanille-ijs'), ('frambozen') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'd9e18e6b-a0af-4f2d-b132-c7b92b1e37ee'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Fondant'::text, 125::numeric, 'g'::text, 'pure chocolade 70%'::text, null::text),
  (2, 'Fondant'::text, 125::numeric, 'g'::text, 'boter'::text, null::text),
  (3, 'Fondant'::text, 3::numeric, 'stuks'::text, 'eieren'::text, null::text),
  (4, 'Fondant'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (5, 'Fondant'::text, 75::numeric, 'g'::text, 'suiker'::text, null::text),
  (6, 'Fondant'::text, 30::numeric, 'g'::text, 'bloem'::text, null::text),
  (7, 'Fondant'::text, 1::numeric, 'snuf'::text, 'zeezout'::text, null::text),
  (8, 'Vormpjes'::text, 20::numeric, 'g'::text, 'zachte boter'::text, null::text),
  (9, 'Vormpjes'::text, 2::numeric, 'el'::text, 'cacaopoeder'::text, null::text),
  (10, 'Afwerking'::text, 4::numeric, 'bolletjes'::text, 'vanille-ijs'::text, null::text),
  (11, 'Afwerking'::text, 100::numeric, 'g'::text, 'frambozen'::text, null::text),
  (12, 'Afwerking'::text, 1::numeric, 'tl'::text, 'cacaopoeder'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 1, 'Bereid de vormpjes voor', 'Bestrijk de vormpjes met zachte boter in opwaartse streken en bestuif met cacao. Klop het teveel eruit.', 'mise-en-place', '{"key":"prep","item":"chocolate"}'::jsonb, null, null),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 2, 'Smelt chocolade en boter', 'Smelt chocolade en boter au bain-marie tot een glanzende massa.', 'garen', '{"key":"melt"}'::jsonb, null, null),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 3, 'Klop eieren en suiker', 'Klop eieren, dooiers en suiker 3 minuten luchtig maar niet wit-schuimig.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, null),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 4, 'Spatel samen', 'Spatel de chocolade door het eimengsel en zeef bloem en zout erover. Meng tot net gecombineerd.', 'saus', '{"key":"whisk","tone":"chocolate"}'::jsonb, null, null),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 5, 'Vul en koel', 'Vul de vormpjes voor driekwart en laat 30 minuten opstijven in de koelkast.', 'rusten', '{"key":"chill","item":"chocolate"}'::jsonb, 1800, 'Gekoeld beslag geeft een voorspelbaar vloeibaar hart: de buitenkant gaart voordat de kern stolt.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 6, 'Bak precies', 'Bak 10 à 11 minuten op 210 °C. De bovenkant is gerezen en droog, het midden trilt nog licht.', 'garen', '{"key":"roast","item":"chocolate"}'::jsonb, 660, null),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 7, 'Stort en dresseer', 'Laat 1 minuut rusten, stort de fondant en serveer met ijs, frambozen en crumble.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 0, 'Begin met een schoon bord', 'Kies een licht bord zodat het donkere chocoladehart zichtbaar wordt als de fondant opengaat.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 1, 'Plaats de saus', 'Strooi een lijn chocoladecrumble diagonaal over het bord met drie druppels frambozencoulis.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 2, 'Positioneer het hoofdonderdeel', 'Laat de fondant 1 minuut rusten, keer de vorm om op het bord en til hem op.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 3, 'Voeg garnituur toe', 'Leg een quenelle vanille-ijs op de crumble en verdeel frambozen.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 4, 'Werk af met kruiden', 'Werk af met een wolkje cacao, een vleugje bladgoud en een muntblaadje.'),
  ('d9e18e6b-a0af-4f2d-b132-c7b92b1e37ee', 5, 'Maak de rand van het bord schoon', 'Veeg cacaostof van de rand en serveer onmiddellijk.');

-- Pavlova met rood fruit
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 'pavlova-met-rood-fruit', 'platform', null, true, 'Pavlova met rood fruit', 'Krokante meringue, vanillecrème en bessen', 'Een meringue met een krokante buitenkant en een marshmallowzacht hart, gevuld met vanille-mascarponecrème en hoog opgestapeld rood fruit.', 'Pavlova is gecontroleerde chaos: krokant, zacht en sappig tegelijk. De techniek zit in het eiwit — vetvrij, geduldig kloppen en langzaam drogen op lage temperatuur.', 'nagerecht', 'gemiddeld', 6, 30, 90, 60, '{"plate":"porcelain","layout":"center","sauce":{"style":"dots","color":"coulis"},"main":{"kind":"pavlova","color":"vanilla"},"garnish":[{"kind":"berries","variant":"raspberry"},{"kind":"berries","variant":"blueberry"},{"kind":"cherries"}],"herbs":["mint","flowers"]}'::jsonb, '#F3E8E8', array['meringue', 'luchtig', 'zomer', 'lage oventemperatuur']::text[], array['Handmixer of keukenmachine', 'Vetvrije kom', 'Bakplaat met bakpapier', 'Oven', 'Spatel']::text[], 'Een pavlova is gecontroleerde chaos: krokant, zacht en sappig, maar met een duidelijk middelpunt.', 'Bak meringue liefst op een droge dag: vochtige lucht maakt de korst kleverig.', 'Een Brachetto d''Acqui of een roze champagne.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '1b5f0d95-5796-478b-a186-6a8f2aa97a0d';
delete from public.recipe_ingredients where recipe_id = '1b5f0d95-5796-478b-a186-6a8f2aa97a0d';
delete from public.recipe_steps where recipe_id = '1b5f0d95-5796-478b-a186-6a8f2aa97a0d';
delete from public.plating_steps where recipe_id = '1b5f0d95-5796-478b-a186-6a8f2aa97a0d';
insert into public.recipe_categories (recipe_id, category_id) values ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 'technieken'), ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 'plating');
insert into public.ingredients (name) values ('eiwitten'), ('fijne kristalsuiker'), ('maizena'), ('witte wijnazijn'), ('zout'), ('slagroom'), ('mascarpone'), ('vanillestokje'), ('poedersuiker'), ('frambozen'), ('blauwe bessen'), ('kersen'), ('frambozencoulis'), ('munt') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '1b5f0d95-5796-478b-a186-6a8f2aa97a0d'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Meringue'::text, 4::numeric, 'stuks'::text, 'eiwitten'::text, 'op kamertemperatuur'::text),
  (2, 'Meringue'::text, 220::numeric, 'g'::text, 'fijne kristalsuiker'::text, null::text),
  (3, 'Meringue'::text, 1::numeric, 'tl'::text, 'maizena'::text, null::text),
  (4, 'Meringue'::text, 1::numeric, 'tl'::text, 'witte wijnazijn'::text, null::text),
  (5, 'Meringue'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (6, 'Crème'::text, 250::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (7, 'Crème'::text, 100::numeric, 'g'::text, 'mascarpone'::text, null::text),
  (8, 'Crème'::text, 1::numeric, 'stuks'::text, 'vanillestokje'::text, null::text),
  (9, 'Crème'::text, 20::numeric, 'g'::text, 'poedersuiker'::text, null::text),
  (10, 'Fruit'::text, 150::numeric, 'g'::text, 'frambozen'::text, null::text),
  (11, 'Fruit'::text, 100::numeric, 'g'::text, 'blauwe bessen'::text, null::text),
  (12, 'Fruit'::text, 150::numeric, 'g'::text, 'kersen'::text, 'gehalveerd en ontpit'::text),
  (13, 'Fruit'::text, 2::numeric, 'el'::text, 'frambozencoulis'::text, null::text),
  (14, 'Fruit'::text, 6::numeric, 'blaadjes'::text, 'munt'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 1, 'Klop de eiwitten', 'Klop de eiwitten met zout in een vetvrije kom tot zachte pieken.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, 'Een spoortje eigeel of vet en je eiwit wordt nooit stijf: veeg de kom uit met citroensap.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 2, 'Voeg de suiker toe', 'Voeg de suiker lepel voor lepel toe en klop door tot de meringue stijf en glanzend is en je geen suikerkorrels meer voelt. Spatel maizena en azijn erdoor.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, null),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 3, 'Vorm het nest', 'Schep de meringue in een cirkel van 20 cm op bakpapier en maak met de bolle kant van een lepel een kuil in het midden en golven aan de rand.', 'dresseren', '{"key":"pipe"}'::jsonb, null, null),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 4, 'Droog in de oven', 'Bak 90 minuten op 110 °C. Zet de oven uit en laat de pavlova met de deur op een kier volledig afkoelen.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 5400, null),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 5, 'Klop de crème', 'Klop room, mascarpone, vanillemerg en poedersuiker tot zachte pieken.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, null),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 6, 'Vul en dresseer', 'Vul de pavlova met crème, stapel het fruit erop en werk af met coulis en munt.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 0, 'Begin met een schoon bord', 'Kies een groot wit bord of een platte schaal; de witte meringue heeft rust nodig.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 1, 'Plaats de saus', 'Zet een paar stippen frambozencoulis rond de plek waar de pavlova komt.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 2, 'Positioneer het hoofdonderdeel', 'Leg de pavlova in het midden en vul de kuil royaal met vanillecrème.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 3, 'Voeg garnituur toe', 'Stapel frambozen, bessen en kersen hoog op de crème, met de mooiste vruchten bovenop.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 4, 'Werk af met kruiden', 'Werk af met munt, een paar druppels coulis en eetbare bloemetjes.'),
  ('1b5f0d95-5796-478b-a186-6a8f2aa97a0d', 5, 'Maak de rand van het bord schoon', 'Serveer direct: na een half uur wordt de meringue zacht door de crème.');

-- Soufflé van Grand Marnier
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('971c5660-95fc-4b40-a2db-330d0b7c2106', 'souffle-van-grand-marnier', 'platform', null, true, 'Soufflé van Grand Marnier', 'Sinaasappel en poedersuiker', 'Een hoog gerezen, luchtige soufflé met sinaasappel en Grand Marnier, bestoven met poedersuiker en direct uit de oven geserveerd.', 'De soufflé is het ultieme examen van de patissier: stevig geklopt eiwit, luchtig spatelen en een oven die dicht blijft. Wie hem beheerst, beheerst lucht.', 'nagerecht', 'uitdagend', 4, 25, 20, 0, '{"plate":"porcelain","layout":"center","sauce":{"style":"none","color":"orange"},"main":{"kind":"ramekin","color":"choux","accent":"meringue"},"garnish":[{"kind":"citrus","color":"orange"},{"kind":"dots","color":"orange"}],"herbs":["zest","mint"]}'::jsonb, '#F3E6D6', array['soufflé', 'eiwit kloppen', 'timing', 'klassiek Frans']::text[], array['Soufflévormpjes', 'Kwast', 'Steelpan', 'Garde', 'Handmixer', 'Oven']::text[], 'Een soufflé wacht op niemand: het bord staat klaar voordat hij de oven uit komt.', 'Maak de basis vooruit; alleen het eiwit kloppen en spatelen moet op het laatste moment.', 'Een late harvest Riesling of een glaasje Grand Marnier.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '971c5660-95fc-4b40-a2db-330d0b7c2106';
delete from public.recipe_ingredients where recipe_id = '971c5660-95fc-4b40-a2db-330d0b7c2106';
delete from public.recipe_steps where recipe_id = '971c5660-95fc-4b40-a2db-330d0b7c2106';
delete from public.plating_steps where recipe_id = '971c5660-95fc-4b40-a2db-330d0b7c2106';
insert into public.recipe_categories (recipe_id, category_id) values ('971c5660-95fc-4b40-a2db-330d0b7c2106', 'technieken');
insert into public.ingredients (name) values ('zachte boter'), ('kristalsuiker'), ('volle melk'), ('eidooiers'), ('suiker'), ('bloem'), ('sinaasappel'), ('Grand Marnier'), ('eiwitten'), ('zout'), ('poedersuiker') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '971c5660-95fc-4b40-a2db-330d0b7c2106'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vormpjes'::text, 20::numeric, 'g'::text, 'zachte boter'::text, null::text),
  (2, 'Vormpjes'::text, 2::numeric, 'el'::text, 'kristalsuiker'::text, null::text),
  (3, 'Basis'::text, 200::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (4, 'Basis'::text, 3::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (5, 'Basis'::text, 40::numeric, 'g'::text, 'suiker'::text, null::text),
  (6, 'Basis'::text, 20::numeric, 'g'::text, 'bloem'::text, null::text),
  (7, 'Basis'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'rasp'::text),
  (8, 'Basis'::text, 40::numeric, 'ml'::text, 'Grand Marnier'::text, null::text),
  (9, 'Eiwit'::text, 4::numeric, 'stuks'::text, 'eiwitten'::text, null::text),
  (10, 'Eiwit'::text, 40::numeric, 'g'::text, 'suiker'::text, null::text),
  (11, 'Eiwit'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (12, 'Afwerking'::text, 1::numeric, 'el'::text, 'poedersuiker'::text, null::text),
  (13, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'sinaasappel'::text, 'in partjes'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 1, 'Bereid de vormpjes voor', 'Bestrijk de vormpjes met zachte boter in opwaartse streken, bestrooi met suiker en zet ze in de koelkast.', 'mise-en-place', '{"key":"prep","item":"lemon"}'::jsonb, null, 'De opwaartse streken zijn geen detail: ze helpen de soufflé recht omhoog te rijzen.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 2, 'Maak de banketbakkersroom', 'Kook melk met sinaasappelrasp, klop dooiers, suiker en bloem, giet de melk erbij en kook al kloppend 2 minuten tot een dikke crème. Roer de Grand Marnier erdoor.', 'saus', '{"key":"simmer","tone":"lemon"}'::jsonb, 180, null),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 3, 'Klop de eiwitten', 'Klop de eiwitten met zout tot zachte pieken, voeg de suiker toe en klop tot stevige, glanzende pieken die nog net buigen.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, null),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 4, 'Spatel luchtig', 'Roer een derde van het eiwit krachtig door de basis. Spatel de rest er in twee keer luchtig door met ruime, snijdende bewegingen.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, 'Liever een paar witte strepen dan overmengen: elke verloren luchtbel is hoogte die je kwijt bent.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 5, 'Vul en strijk af', 'Vul de vormpjes tot de rand, strijk glad met een paletmes en ga met je duim langs de binnenrand voor een hoedje.', 'dresseren', '{"key":"pipe"}'::jsonb, null, null),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 6, 'Bak en serveer direct', 'Bak 12 à 13 minuten op 200 °C tot de soufflés 4 cm boven de rand uitkomen. Open de oven niet.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 780, null),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 7, 'Dresseer', 'Zet de soufflé op een bord, bestuif met poedersuiker en serveer met sinaasappel.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 0, 'Begin met een schoon bord', 'Zet de borden met een servetje en de sinaasappelpartjes klaar voordat de soufflé in de oven gaat.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 1, 'Plaats de saus', 'Een soufflé heeft geen saus op het bord nodig; serveer eventueel een kannetje sinaasappelsaus apart.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 2, 'Positioneer het hoofdonderdeel', 'Zet de soufflé direct uit de oven in het midden van het bord.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 3, 'Voeg garnituur toe', 'Leg twee sinaasappelpartjes en een stip sinaasappelsaus naast de vorm.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 4, 'Werk af met kruiden', 'Bestuif de top door een zeefje met poedersuiker en werk af met zeste en een muntblaadje.'),
  ('971c5660-95fc-4b40-a2db-330d0b7c2106', 5, 'Maak de rand van het bord schoon', 'Loop meteen naar tafel: binnen twee minuten begint hij te zakken.');

-- Mille-feuille met vanillecrème
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 'mille-feuille-met-vanillecreme', 'platform', null, true, 'Mille-feuille met vanillecrème', 'Gekarameliseerd bladerdeeg en frambozen', 'Laagjes flinterdun, gekarameliseerd bladerdeeg met luchtige vanillecrème diplomate en verse frambozen.', 'Duizend blaadjes: de mille-feuille is patisserie in zijn meest architecturale vorm. Plat en krokant bakken, precies spuiten en strak stapelen.', 'nagerecht', 'uitdagend', 6, 60, 30, 120, '{"plate":"porcelain","layout":"diagonal","sauce":{"style":"dots","color":"coulis"},"main":{"kind":"bar","color":"vanilla","accent":"pastry"},"garnish":[{"kind":"berries","variant":"raspberry"},{"kind":"leaves","color":"green"}],"herbs":["gold","mint"]}'::jsonb, '#F1E9DC', array['patisserie', 'crème pâtissière', 'karamelliseren', 'spuiten']::text[], array['Twee bakplaten', 'Bakpapier', 'Oven', 'Steelpan', 'Garde', 'Spuitzak met ronde spuitmond', 'Gekarteld mes']::text[], 'De lagen zijn de schoonheid: presenteer de mille-feuille zo dat je ze ziet.', 'Stel de mille-feuille pas vlak voor het serveren samen: na een uur trekt het deeg vocht uit de crème.', 'Een Coteaux du Layon of een demi-sec champagne.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'b4382809-e3fd-42f1-b778-ef634d8c86ff';
delete from public.recipe_ingredients where recipe_id = 'b4382809-e3fd-42f1-b778-ef634d8c86ff';
delete from public.recipe_steps where recipe_id = 'b4382809-e3fd-42f1-b778-ef634d8c86ff';
delete from public.plating_steps where recipe_id = 'b4382809-e3fd-42f1-b778-ef634d8c86ff';
insert into public.recipe_categories (recipe_id, category_id) values ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 'technieken'), ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 'plating');
insert into public.ingredients (name) values ('roomboterbladerdeeg'), ('poedersuiker'), ('volle melk'), ('vanillestokje'), ('eidooiers'), ('suiker'), ('maizena'), ('koude boter'), ('slagroom'), ('frambozen'), ('bladgoud') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'b4382809-e3fd-42f1-b778-ef634d8c86ff'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Deeg'::text, 300::numeric, 'g'::text, 'roomboterbladerdeeg'::text, null::text),
  (2, 'Deeg'::text, 30::numeric, 'g'::text, 'poedersuiker'::text, null::text),
  (3, 'Crème diplomate'::text, 500::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (4, 'Crème diplomate'::text, 1::numeric, 'stuks'::text, 'vanillestokje'::text, null::text),
  (5, 'Crème diplomate'::text, 5::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (6, 'Crème diplomate'::text, 100::numeric, 'g'::text, 'suiker'::text, null::text),
  (7, 'Crème diplomate'::text, 40::numeric, 'g'::text, 'maizena'::text, null::text),
  (8, 'Crème diplomate'::text, 40::numeric, 'g'::text, 'koude boter'::text, null::text),
  (9, 'Crème diplomate'::text, 150::numeric, 'ml'::text, 'slagroom'::text, 'opgeklopt'::text),
  (10, 'Afwerking'::text, 125::numeric, 'g'::text, 'frambozen'::text, null::text),
  (11, 'Afwerking'::text, 1::numeric, 'el'::text, 'poedersuiker'::text, null::text),
  (12, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'bladgoud'::text, 'optioneel'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 1, 'Bak het deeg plat', 'Rol het deeg 2 mm dun uit, prik het in en bak 15 minuten op 200 °C tussen twee bakplaten, zodat het plat en krokant blijft.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 900, null),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 2, 'Karamelliseer en snijd', 'Bestuif het deeg met poedersuiker en zet het 3 à 5 minuten op 230 °C tot de suiker glanzend karamelliseert. Snijd lauw in gelijke rechthoeken van 4 × 10 cm.', 'garen', '{"key":"torch"}'::jsonb, 300, 'Snijd met een gekarteld mes terwijl het deeg nog lauw is: afgekoeld breekt het.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 3, 'Kook de crème pâtissière', 'Breng melk met vanille aan de kook. Klop dooiers, suiker en maizena, giet de melk erbij en kook al kloppend 1 minuut na de eerste bel. Klop de koude boter erdoor.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 180, null),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 4, 'Laat afkoelen', 'Dek de crème af met folie op het oppervlak en laat 2 uur afkoelen. Klop glad en spatel de geklopte room erdoor voor een luchtige crème diplomate.', 'rusten', '{"key":"chill"}'::jsonb, 7200, null),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 5, 'Spuit en stapel', 'Spuit gelijke toefjes crème op een deegplaatje, leg frambozen ertussen, dek af met een tweede plaatje en herhaal. Eindig met een plaatje deeg.', 'dresseren', '{"key":"pipe"}'::jsonb, null, 'Spuit de toefjes precies tot de rand: zo zie je van opzij strakke lagen.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 6, 'Dresseer', 'Leg de mille-feuille op zijn zij, zet stippen coulis en werk af met frambozen en bladgoud.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 0, 'Begin met een schoon bord', 'Kies een lang of groot wit bord waarop de gelaagde zijkant goed zichtbaar is.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 1, 'Plaats de saus', 'Zet een lijn stippen frambozencoulis in aflopende grootte.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 2, 'Positioneer het hoofdonderdeel', 'Leg de mille-feuille op zijn zij of rechtop, zodat de lagen crème en deeg zichtbaar zijn.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 3, 'Voeg garnituur toe', 'Leg een paar frambozen en een toefje crème tegen de mille-feuille.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 4, 'Werk af met kruiden', 'Werk af met een vleugje bladgoud, een muntblaadje en een streep poedersuiker op de bovenste laag.'),
  ('b4382809-e3fd-42f1-b778-ef634d8c86ff', 5, 'Maak de rand van het bord schoon', 'Veeg kruimels van het bord — bladerdeeg laat er altijd een paar achter.');
