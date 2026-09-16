-- Platformrecepten deel 01 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Gebakken steak met blauwe bessensaus
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 'steak-met-blauwe-bessensaus', 'platform', null, true, 'Gebakken steak met blauwe bessensaus', 'Entrecote, rozemarijnboter & fondantaardappel', 'Een krokant aangebraden entrecote, gearroseerd met rozemarijnboter, met een glanzende saus van blauwe bessen en rode wijn.', 'De frisse zuren van blauwe bessen snijden door het rijke vlees, terwijl rode wijn en kalfsfond de saus diepte geven. Een klassieker met een eigentijdse twist — en de perfecte les in aanbraden, arroseren en laten rusten.', 'hoofdgerecht', 'gemiddeld', 2, 15, 35, 5, '"steak"'::jsonb, '#EDE3DA', array['aanbraden', 'arroseren', 'saus', 'vlees laten rusten']::text[], array['Gietijzeren pan', 'Kernthermometer', 'Steekring van 4 cm', 'Steelpan', 'Fijne zeef', 'Snijplank']::text[], 'Dit bord draait om beweging: de saus zet een diagonaal, het vlees volgt die lijn en de garnituur zorgt voor tegengewicht.', 'Snijd steak altijd tegen de draad in. Zo worden de vezels kort en voelt elk stuk malser aan.', 'Een soepele Pinot Noir of een jonge Rioja Crianza.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '6d077ba3-7614-46e3-8a1f-bdf766904e3a';
delete from public.recipe_ingredients where recipe_id = '6d077ba3-7614-46e3-8a1f-bdf766904e3a';
delete from public.recipe_steps where recipe_id = '6d077ba3-7614-46e3-8a1f-bdf766904e3a';
delete from public.plating_steps where recipe_id = '6d077ba3-7614-46e3-8a1f-bdf766904e3a';
insert into public.recipe_categories (recipe_id, category_id) values ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 'vlees');
insert into public.ingredients (name) values ('entrecote'), ('zonnebloemolie'), ('ongezouten boter'), ('rozemarijn'), ('knoflook'), ('grof zeezout en zwarte peper'), ('blauwe bessen'), ('sjalot'), ('rode wijn'), ('kalfsfond'), ('balsamicoazijn'), ('koude boter'), ('grote vastkokende aardappelen'), ('kleine sjalotten'), ('waterkers'), ('vlokzout') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '6d077ba3-7614-46e3-8a1f-bdf766904e3a'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vlees'::text, 2::numeric, 'stuks'::text, 'entrecote'::text, '± 200 g per stuk, 3 cm dik'::text),
  (2, 'Vlees'::text, 1::numeric, 'el'::text, 'zonnebloemolie'::text, null::text),
  (3, 'Vlees'::text, 30::numeric, 'g'::text, 'ongezouten boter'::text, null::text),
  (4, 'Vlees'::text, 2::numeric, 'takjes'::text, 'rozemarijn'::text, null::text),
  (5, 'Vlees'::text, 2::numeric, 'teentjes'::text, 'knoflook'::text, 'gekneusd'::text),
  (6, 'Vlees'::text, null::numeric, 'naar smaak'::text, 'grof zeezout en zwarte peper'::text, null::text),
  (7, 'Blauwe bessensaus'::text, 100::numeric, 'g'::text, 'blauwe bessen'::text, null::text),
  (8, 'Blauwe bessensaus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (9, 'Blauwe bessensaus'::text, 100::numeric, 'ml'::text, 'rode wijn'::text, null::text),
  (10, 'Blauwe bessensaus'::text, 150::numeric, 'ml'::text, 'kalfsfond'::text, null::text),
  (11, 'Blauwe bessensaus'::text, 1::numeric, 'tl'::text, 'balsamicoazijn'::text, null::text),
  (12, 'Blauwe bessensaus'::text, 15::numeric, 'g'::text, 'koude boter'::text, 'in blokjes'::text),
  (13, 'Garnituur'::text, 2::numeric, 'stuks'::text, 'grote vastkokende aardappelen'::text, 'voor fondant'::text),
  (14, 'Garnituur'::text, 2::numeric, 'stuks'::text, 'kleine sjalotten'::text, 'gehalveerd'::text),
  (15, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'blauwe bessen'::text, null::text),
  (16, 'Garnituur'::text, 1::numeric, 'handje'::text, 'waterkers'::text, null::text),
  (17, 'Garnituur'::text, 1::numeric, 'snuf'::text, 'vlokzout'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 1, 'Laat het vlees op kamertemperatuur komen', 'Haal de entrecotes 30 minuten voor het bakken uit de koelkast en dep ze goed droog met keukenpapier. Vlees op kamertemperatuur gaart gelijkmatiger en krijgt een mooiere korst.', 'mise-en-place', '{"key":"prep","item":"steak"}'::jsonb, 1800, 'Een droog oppervlak is het geheim van een diepbruine korst.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 2, 'Snipper de sjalot', 'Pel de sjalot en snijd hem in een fijne brunoise van 2 mm. Houd de punt van je mes op de plank en maak een rustige, wiegende beweging.', 'snijden', '{"key":"chop","item":"shallot"}'::jsonb, null, 'Klauwgreep: vingertoppen gekruld, knokkels tegen het lemmet.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 3, 'Maak de fondantaardappelen', 'Steek met een ring cilinders van 4 cm uit de aardappelen. Bak ze op de platte kant goudbruin in olie, voeg een klontje boter en 100 ml fond toe en laat ze 20 minuten zacht garen tot de fond is opgenomen.', 'bakken', '{"key":"sear","item":"potato"}'::jsonb, 1200, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 4, 'Kruid het vlees', 'Bestrooi de entrecotes vlak voor het bakken royaal met grof zeezout en versgemalen zwarte peper. Druk de kruiden licht aan zodat ze aan het vlees hechten.', 'kruiden', '{"key":"season","item":"steak"}'::jsonb, null, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 5, 'Verhit de pan', 'Zet een gietijzeren pan 3 minuten op hoog vuur. Voeg de olie pas toe als de pan echt heet is — de olie mag net beginnen te walmen.', 'verhitten', '{"key":"heat"}'::jsonb, 180, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 6, 'Bak het vlees', 'Leg de entrecotes van je af in de pan. Bak de steak 2 minuten aan één kant zonder hem te verschuiven, draai hem om en bak nog 2 minuten.', 'bakken', '{"key":"sear","item":"steak"}'::jsonb, 240, 'Luister: een constant, krachtig gesis betekent dat de pan heet genoeg is.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 7, 'Arroseer met rozemarijnboter', 'Zet het vuur lager en voeg boter, rozemarijn en knoflook toe. Kantel de pan en schep de schuimende boter 1 minuut lang continu over het vlees.', 'bakken', '{"key":"baste","item":"steak"}'::jsonb, 60, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 8, 'Laat het vlees rusten', 'Leg het vlees op een warme plank en laat het 5 minuten rusten. De sappen verdelen zich opnieuw, zodat ze bij het aansnijden in het vlees blijven.', 'rusten', '{"key":"rest","item":"steak"}'::jsonb, 300, 'Kerntemperatuur voor medium-rare: 54 °C.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 9, 'Maak de blauwe bessensaus', 'Fruit de sjalot in het bakvet, blus af met rode wijn en laat tot de helft inkoken. Voeg fond en bessen toe en laat 8 minuten zacht koken tot de bessen openbarsten. Zeef, breng op smaak met balsamico en monteer met koude boter.', 'saus', '{"key":"simmer","tone":"berry"}'::jsonb, 480, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 10, 'Snijd de steak', 'Snijd de entrecote tegen de draad in in plakken van 1 cm. Werk met één lange, vloeiende haal van je mes in plaats van te zagen.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, null),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 11, 'Dresseer het bord', 'Trek een swoosh saus, waaier de plakken erlangs en werk af met fondant, geroosterde sjalot, bessen, waterkers en vlokzout.', 'dresseren', '{"key":"plate","dish":"steak"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 0, 'Begin met een schoon bord', 'Kies een wit, voorverwarmd bord. Wit laat de diepe kleur van de bessensaus het mooist uitkomen.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 1, 'Plaats de saus', 'Leg een lepel saus linksonder en trek met de bolle kant in één vloeiende beweging een swoosh naar rechtsboven.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 2, 'Positioneer het hoofdonderdeel', 'Waaier de plakken steak met het rosé snijvlak naar boven langs de swoosh — licht overlappend, net naast het midden.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 3, 'Voeg garnituur toe', 'Plaats de fondantaardappel rechtsonder als tegengewicht. Verdeel geroosterde sjalot en bessen in oneven aantallen.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 4, 'Werk af met kruiden', 'Zet toefjes waterkers tegen het vlees voor hoogte en strooi vlokzout over de snijvlakken.'),
  ('6d077ba3-7614-46e3-8a1f-bdf766904e3a', 5, 'Maak de rand van het bord schoon', 'Veeg met een vochtig doekje vlekjes saus van de rand. Een schone rand is het kader van je schilderij.');

-- Romige truffelpasta
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 'romige-truffelpasta', 'platform', null, true, 'Romige truffelpasta', 'Verse tagliatelle, Parmigiano & zwarte truffel', 'Zijdezachte tagliatelle in een romige saus van Parmigiano Reggiano, afgewerkt met flinterdunne schaafsel zwarte truffel.', 'Minder is meer: goede pasta, boter, kaas en truffel. Het geheim zit in het pastawater — het zetmeel bindt de saus tot een glanzende emulsie die elke sliert omhult.', 'hoofdgerecht', 'makkelijk', 2, 10, 15, 0, '"pasta"'::jsonb, '#EFE6D2', array['verse pasta', 'emulsie', 'truffel', 'snel']::text[], array['Grote kookpan', 'Hoge koekenpan', 'Microplane', 'Truffelschaaf', 'Vleesvork en pollepel']::text[], 'Een pastanest geeft hoogte en maakt van een eenvoudig bord een gastronomisch gerecht.', 'Gebruik geen truffelolie met synthetisch aroma — liever een beetje echte truffel of een goede tapenade.', 'Een rijpe Chardonnay uit de Bourgogne of een Barbera d''Alba.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091';
delete from public.recipe_ingredients where recipe_id = 'a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091';
delete from public.recipe_steps where recipe_id = 'a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091';
delete from public.plating_steps where recipe_id = 'a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091';
insert into public.recipe_categories (recipe_id, category_id) values ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 'pasta'), ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 'vegetarisch');
insert into public.ingredients (name) values ('verse tagliatelle'), ('grof zout'), ('sjalot'), ('knoflook'), ('boter'), ('slagroom'), ('Parmigiano Reggiano'), ('zwarte peper'), ('verse zwarte truffel'), ('bieslook'), ('Parmigiano') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Pasta'::text, 250::numeric, 'g'::text, 'verse tagliatelle'::text, null::text),
  (2, 'Pasta'::text, 1::numeric, 'el'::text, 'grof zout'::text, 'voor het kookwater'::text),
  (3, 'Saus'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (4, 'Saus'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (5, 'Saus'::text, 30::numeric, 'g'::text, 'boter'::text, null::text),
  (6, 'Saus'::text, 150::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (7, 'Saus'::text, 60::numeric, 'g'::text, 'Parmigiano Reggiano'::text, 'fijn geraspt'::text),
  (8, 'Saus'::text, null::numeric, 'naar smaak'::text, 'zwarte peper'::text, null::text),
  (9, 'Afwerking'::text, 15::numeric, 'g'::text, 'verse zwarte truffel'::text, 'of 1 el truffeltapenade'::text),
  (10, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text),
  (11, 'Afwerking'::text, 20::numeric, 'g'::text, 'Parmigiano'::text, 'in schaafsel'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 1, 'Zet je mise en place klaar', 'Weeg alles af en zet het binnen handbereik. Pasta wacht niet: zodra ze kookt, gaat alles snel.', 'mise-en-place', '{"key":"prep","item":"pasta"}'::jsonb, null, null),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 2, 'Snipper sjalot en knoflook', 'Snijd sjalot en knoflook zo fijn mogelijk. Kleine stukjes smelten weg in de saus en geven zoetheid zonder bite.', 'snijden', '{"key":"chop","item":"shallot"}'::jsonb, null, null),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 3, 'Rasp de Parmigiano', 'Rasp de kaas met een microplane zo fijn als sneeuw. Fijne kaas smelt egaal zonder draderig te worden.', 'snijden', '{"key":"grate","item":"parmesan"}'::jsonb, null, null),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 4, 'Kook de pasta', 'Breng ruim water aan de kook met een flinke eetlepel zout. Kook de verse tagliatelle 2 à 3 minuten beetgaar en bewaar een kopje kookwater.', 'garen', '{"key":"boil","item":"pasta"}'::jsonb, 180, 'Het kookwater moet smaken als de zee.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 5, 'Maak de romige saus', 'Smoor sjalot en knoflook zacht in de boter zonder te kleuren. Voeg de room toe en laat 3 minuten zachtjes indikken.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 180, null),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 6, 'Emulgeer met kaas en pastawater', 'Schep de pasta met een tang in de saus. Voeg de kaas en een scheut pastawater toe en zwenk de pan tot de saus glanzend aan elke sliert kleeft.', 'saus', '{"key":"simmer","tone":"cream","item":"pasta"}'::jsonb, null, 'Te dik? Nog een lepel pastawater. Te dun? Nog even zwenken op het vuur.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 7, 'Schaaf de truffel', 'Schaaf de truffel met een truffelschaaf of rasp in flinterdunne plakjes. Doe dit pas vlak voor het serveren — het aroma is vluchtig.', 'snijden', '{"key":"grate","item":"truffle"}'::jsonb, null, null),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 8, 'Draai een nest en dresseer', 'Draai met een vleesvork een hoog nest in een pollepel, zet het op een warm bord en werk af met truffel, schaafsel en bieslook.', 'dresseren', '{"key":"plate","dish":"pasta"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 0, 'Begin met een schoon bord', 'Warm een wit bord voor op 60 °C, zodat de saus niet meteen opstijft.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 1, 'Plaats de saus', 'Lepel een klein beetje saus in het midden als ondergrond — zo blijft het nest op zijn plaats staan.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 2, 'Positioneer het hoofdonderdeel', 'Draai de pasta met een vleesvork rond in een pollepel en laat het nest in één beweging op de saus glijden.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 3, 'Voeg garnituur toe', 'Leg de truffelschaafsel dakpansgewijs tegen de top van het nest, met een paar stukjes Parmigiano ernaast.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 4, 'Werk af met kruiden', 'Strooi fijngesneden bieslook en versgemalen peper — het groen is je enige accentkleur.'),
  ('a7dcfd0d-2a79-4667-8ffb-ced0dcfb7091', 5, 'Maak de rand van het bord schoon', 'Veeg druppels room van de rand en serveer onmiddellijk.');

-- Zeebaars met beurre blanc
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('79611908-5dc6-49ee-972b-7322be8d9688', 'zeebaars-met-beurre-blanc', 'platform', null, true, 'Zeebaars met beurre blanc', 'Krokant vel, groene asperges & zeekraal', 'Zeebaarsfilet met een krokant gebakken vel op een fluweelzachte beurre blanc, met groene asperges en zilte zeekraal.', 'Beurre blanc is de moeder van de Franse vissauzen: een reductie van wijn en sjalot, gemonteerd met koude boter. Het vraagt geduld en een zacht vuur — en beloont met pure elegantie.', 'hoofdgerecht', 'gemiddeld', 2, 20, 20, 0, '"seabass"'::jsonb, '#DFE6E2', array['beurre blanc', 'krokant vel', 'monteren', 'klassiek Frans']::text[], array['Antiaanbakpan', 'Visspatel', 'Steelpan', 'Garde', 'Fijne zeef']::text[], 'Vis vraagt om rust op het bord: een zachte saus als bedding en de krokante huid als kroon.', 'Leg de filet vlak voor het bakken nog even met het vel op keukenpapier — elk beetje vocht kost krokantheid.', 'Een frisse Sancerre of Chablis Premier Cru.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '79611908-5dc6-49ee-972b-7322be8d9688';
delete from public.recipe_ingredients where recipe_id = '79611908-5dc6-49ee-972b-7322be8d9688';
delete from public.recipe_steps where recipe_id = '79611908-5dc6-49ee-972b-7322be8d9688';
delete from public.plating_steps where recipe_id = '79611908-5dc6-49ee-972b-7322be8d9688';
insert into public.recipe_categories (recipe_id, category_id) values ('79611908-5dc6-49ee-972b-7322be8d9688', 'vis');
insert into public.ingredients (name) values ('zeebaarsfilets met vel'), ('olijfolie'), ('boter'), ('zeezout'), ('sjalot'), ('droge witte wijn'), ('witte wijnazijn'), ('koude boter'), ('citroensap'), ('groene asperges'), ('zeekraal'), ('bieslook'), ('roze peperbessen') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '79611908-5dc6-49ee-972b-7322be8d9688'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Vis'::text, 2::numeric, 'stuks'::text, 'zeebaarsfilets met vel'::text, '± 150 g per stuk'::text),
  (2, 'Vis'::text, 1::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (3, 'Vis'::text, 10::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Vis'::text, null::numeric, 'naar smaak'::text, 'zeezout'::text, null::text),
  (5, 'Beurre blanc'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (6, 'Beurre blanc'::text, 75::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (7, 'Beurre blanc'::text, 50::numeric, 'ml'::text, 'witte wijnazijn'::text, null::text),
  (8, 'Beurre blanc'::text, 125::numeric, 'g'::text, 'koude boter'::text, 'in blokjes'::text),
  (9, 'Beurre blanc'::text, 1::numeric, 'tl'::text, 'citroensap'::text, null::text),
  (10, 'Garnituur'::text, 8::numeric, 'stuks'::text, 'groene asperges'::text, null::text),
  (11, 'Garnituur'::text, 60::numeric, 'g'::text, 'zeekraal'::text, null::text),
  (12, 'Garnituur'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text),
  (13, 'Garnituur'::text, 1::numeric, 'tl'::text, 'roze peperbessen'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('79611908-5dc6-49ee-972b-7322be8d9688', 1, 'Maak de vis klaar', 'Dep de filets goed droog en kerf het vel om de centimeter licht in. Zo trekt de vis niet krom in de pan.', 'mise-en-place', '{"key":"prep","item":"fish"}'::jsonb, null, 'Kerf alleen het vel, niet het visvlees.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 2, 'Snipper de sjalot', 'Snijd de sjalot in een zo fijn mogelijke brunoise. Voor een beurre blanc wordt hij later uitgezeefd, maar fijn snijden geeft meer smaak af.', 'snijden', '{"key":"chop","item":"shallot"}'::jsonb, null, null),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 3, 'Reduceer wijn en azijn', 'Breng sjalot, wijn en azijn aan de kook en laat inkoken tot er ongeveer 2 eetlepels vocht over zijn.', 'saus', '{"key":"simmer","tone":"wine"}'::jsonb, 360, null),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 4, 'Monteer de beurre blanc', 'Zet het vuur heel laag. Klop blokje voor blokje de koude boter door de reductie tot een romige, glanzende saus. Zeef en breng op smaak met citroen en zout.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, 'Laat de saus nooit koken — dan schift ze.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 5, 'Blancheer de groenten', 'Kook de asperges 2 minuten in gezouten water, voeg de laatste 30 seconden de zeekraal toe en spoel alles direct in ijswater.', 'garen', '{"key":"boil","item":"vegetables"}'::jsonb, 120, null),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 6, 'Verhit de pan', 'Verhit olie in een antiaanbakpan of goed ingebakken stalen pan op middelhoog vuur tot de olie licht glinstert.', 'verhitten', '{"key":"heat"}'::jsonb, 120, null),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 7, 'Bak de vis op het vel', 'Kruid de filets met zout en leg ze met het vel naar beneden in de pan. Druk ze 10 seconden plat met een spatel en bak 4 minuten tot het vel krokant is. Draai om, voeg de boter toe en haal na 30 seconden van het vuur.', 'bakken', '{"key":"sear","item":"fish"}'::jsonb, 240, 'Draai de vis pas om als het vlees bijna volledig wit is.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 8, 'Dresseer het bord', 'Schep de beurre blanc als spiegel op het bord, leg de vis erop met het vel naar boven en werk af met asperges, zeekraal en kruiden.', 'dresseren', '{"key":"plate","dish":"seabass"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('79611908-5dc6-49ee-972b-7322be8d9688', 0, 'Begin met een schoon bord', 'Kies een wit bord met een brede rand — het laat de bleke beurre blanc stralen.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 1, 'Plaats de saus', 'Schep de beurre blanc in een ovale spiegel iets links van het midden en druppel er bieslookolie in.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 2, 'Positioneer het hoofdonderdeel', 'Leg de filet met het krokante vel naar boven diagonaal op de saus. Nooit saus óp het vel — dan verliest het zijn krokantheid.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 3, 'Voeg garnituur toe', 'Leg de asperges onder een lichte hoek naast de vis en verdeel toefjes zeekraal voor een zilte crunch.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 4, 'Werk af met kruiden', 'Werk af met dille, citroenzeste en een paar roze peperbessen als kleuraccent.'),
  ('79611908-5dc6-49ee-972b-7322be8d9688', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon, zeker bij een botersaus die snel vlekken maakt.');

-- Geroosterde groenten met kruidenolie
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 'geroosterde-groenten-met-kruidenolie', 'platform', null, true, 'Geroosterde groenten met kruidenolie', 'Bospeen, biet, labneh & pistache', 'Gekaramelliseerde bospeen en bieten op zijdezachte labneh, met een felgroene kruidenolie en geroosterde pistache.', 'Groenten in de hoofdrol. Een hete oven karamelliseert hun natuurlijke suikers, de kruidenolie brengt frisheid en de labneh zorgt voor romige balans.', 'hoofdgerecht', 'makkelijk', 4, 20, 35, 0, '"vegetables"'::jsonb, '#E3E6D6', array['roosteren', 'kruidenolie', 'seizoen', 'groenten']::text[], array['Oven', 'Bakplaat met bakpapier', 'Blender', 'Kaasdoek of koffiefilter']::text[], 'Dit bord is een schilderij: de labneh is je canvas, de groenten zijn de penseelstreken.', 'Rooster bieten en wortels op aparte helften van de bakplaat — zo kleurt de biet de wortels niet roze.', 'Een Grüner Veltliner of een licht gekoelde Gamay.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'f87edd64-06ce-4cc1-a15e-a65f3c7a1758';
delete from public.recipe_ingredients where recipe_id = 'f87edd64-06ce-4cc1-a15e-a65f3c7a1758';
delete from public.recipe_steps where recipe_id = 'f87edd64-06ce-4cc1-a15e-a65f3c7a1758';
delete from public.plating_steps where recipe_id = 'f87edd64-06ce-4cc1-a15e-a65f3c7a1758';
insert into public.recipe_categories (recipe_id, category_id) values ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 'vegetarisch');
insert into public.ingredients (name) values ('bospeen'), ('rode bieten'), ('rode uien'), ('olijfolie'), ('honing'), ('tijm'), ('zeezout en peper'), ('platte peterselie'), ('basilicum'), ('milde olijfolie'), ('zout'), ('labneh'), ('pistachenoten'), ('microgroenten'), ('vlokzout') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'f87edd64-06ce-4cc1-a15e-a65f3c7a1758'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Groenten'::text, 12::numeric, 'stuks'::text, 'bospeen'::text, null::text),
  (2, 'Groenten'::text, 3::numeric, 'stuks'::text, 'rode bieten'::text, 'voorgekookt'::text),
  (3, 'Groenten'::text, 2::numeric, 'stuks'::text, 'rode uien'::text, null::text),
  (4, 'Groenten'::text, 4::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (5, 'Groenten'::text, 1::numeric, 'el'::text, 'honing'::text, null::text),
  (6, 'Groenten'::text, 4::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (7, 'Groenten'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (8, 'Kruidenolie'::text, 30::numeric, 'g'::text, 'platte peterselie'::text, null::text),
  (9, 'Kruidenolie'::text, 15::numeric, 'g'::text, 'basilicum'::text, null::text),
  (10, 'Kruidenolie'::text, 120::numeric, 'ml'::text, 'milde olijfolie'::text, null::text),
  (11, 'Kruidenolie'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (12, 'Afwerking'::text, 250::numeric, 'g'::text, 'labneh'::text, 'of volle Griekse yoghurt'::text),
  (13, 'Afwerking'::text, 30::numeric, 'g'::text, 'pistachenoten'::text, 'geroosterd'::text),
  (14, 'Afwerking'::text, 1::numeric, 'handje'::text, 'microgroenten'::text, null::text),
  (15, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'vlokzout'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 1, 'Verwarm de oven en was de groenten', 'Verwarm de oven voor op 200 °C en bekleed een bakplaat met bakpapier. Boen de bospeen schoon en laat een stukje loof staan.', 'mise-en-place', '{"key":"prep","item":"vegetables"}'::jsonb, null, null),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 2, 'Snijd de groenten', 'Halveer de bospeen in de lengte en snijd bieten en uien in partjes. Stukken van gelijke dikte garen gelijkmatig.', 'snijden', '{"key":"chop","item":"vegetables"}'::jsonb, null, null),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 3, 'Kruid de groenten', 'Meng de groenten met olijfolie, honing, tijm, zout en peper. Zorg dat elk stuk een dun, glanzend laagje olie heeft.', 'kruiden', '{"key":"season","item":"vegetables"}'::jsonb, null, null),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 4, 'Rooster in de oven', 'Verdeel de groenten in één laag over de bakplaat en rooster ze 30 à 35 minuten. Keer ze halverwege voor een gelijkmatige kleur.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 2100, 'Ruimte op de bakplaat = karamel. Te vol = gestoomd.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 5, 'Mix de kruidenolie', 'Blancheer de kruiden 10 seconden, spoel ze in ijswater en knijp ze droog. Mix ze 2 minuten met olie en zout en zeef door een doek.', 'saus', '{"key":"blend","tone":"herb"}'::jsonb, null, 'Door te blancheren blijft de olie dagenlang felgroen.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 6, 'Dresseer het bord', 'Strijk de labneh uit, bouw de groenten erop en werk af met kruidenolie, pistache en microgroenten.', 'dresseren', '{"key":"plate","dish":"vegetables"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 0, 'Begin met een schoon bord', 'Kies een zandkleurig stoneware bord — aardse tinten versterken de kleuren van geroosterde groenten.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 1, 'Plaats de saus', 'Schep een royale lepel labneh op het bord en trek met de achterkant van de lepel een brede, gebogen veeg.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 2, 'Positioneer het hoofdonderdeel', 'Leg de bospeen in verschillende richtingen op de labneh. Varieer lengtes en hoeken voor ritme.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 3, 'Voeg garnituur toe', 'Plaats bietenpartjes en uienblaadjes in de open ruimtes en druppel de kruidenolie in stippen van verschillende grootte.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 4, 'Werk af met kruiden', 'Strooi microgroenten, gehakte pistache en vlokzout — kleine elementen die het oog laten dwalen.'),
  ('f87edd64-06ce-4cc1-a15e-a65f3c7a1758', 5, 'Maak de rand van het bord schoon', 'Veeg olievlekjes van de rand; groene olie op keramiek valt meteen op.');

-- Chocoladecrémeux met vanille
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 'chocolade-cremeux-met-vanille', 'platform', null, true, 'Chocoladecrémeux met vanille', 'Pure chocolade, vanillecrème & cacaocrumble', 'Een fluweelzachte crémeux van pure chocolade met een quenelle vanillecrème, knapperige cacaocrumble en frisse framboos.', 'Een dessert van contrasten: bitter en zoet, zijdezacht en knapperig, diep bruin en fris rood. De crémeux vraagt precisie — de rest is pure dressage.', 'nagerecht', 'uitdagend', 4, 30, 20, 120, '"chocolate"'::jsonb, '#EADDD5', array['crémeux', 'quenelle', 'patisserie', 'chocolade']::text[], array['Steelpan', 'Thermometer', 'Staafmixer', 'Garde', 'Twee eetlepels', 'Oven']::text[], 'Een dessert leeft van contrast in vorm en textuur: gladde quenelles tegenover ruwe crumble.', 'Voor een perfecte quenelle: lepel in heet water, droogtikken en in één beweging naar je toe door de crème halen.', 'Een Banyuls of een tawny port van 10 jaar.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '323a916d-003c-45d9-8b40-8a00f97f0dd2';
delete from public.recipe_ingredients where recipe_id = '323a916d-003c-45d9-8b40-8a00f97f0dd2';
delete from public.recipe_steps where recipe_id = '323a916d-003c-45d9-8b40-8a00f97f0dd2';
delete from public.plating_steps where recipe_id = '323a916d-003c-45d9-8b40-8a00f97f0dd2';
insert into public.recipe_categories (recipe_id, category_id) values ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 'plating');
insert into public.ingredients (name) values ('pure chocolade 70%'), ('slagroom'), ('volle melk'), ('eidooiers'), ('kristalsuiker'), ('vanillestokje'), ('poedersuiker'), ('koude boter'), ('bloem'), ('bruine suiker'), ('cacaopoeder'), ('zeezout'), ('verse frambozen'), ('munt'), ('bladgoud') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '323a916d-003c-45d9-8b40-8a00f97f0dd2'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Crémeux'::text, 150::numeric, 'g'::text, 'pure chocolade 70%'::text, null::text),
  (2, 'Crémeux'::text, 125::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (3, 'Crémeux'::text, 125::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (4, 'Crémeux'::text, 3::numeric, 'stuks'::text, 'eidooiers'::text, null::text),
  (5, 'Crémeux'::text, 30::numeric, 'g'::text, 'kristalsuiker'::text, null::text),
  (6, 'Vanillecrème'::text, 1::numeric, 'stuks'::text, 'vanillestokje'::text, null::text),
  (7, 'Vanillecrème'::text, 150::numeric, 'ml'::text, 'slagroom'::text, null::text),
  (8, 'Vanillecrème'::text, 15::numeric, 'g'::text, 'poedersuiker'::text, null::text),
  (9, 'Cacaocrumble'::text, 40::numeric, 'g'::text, 'koude boter'::text, null::text),
  (10, 'Cacaocrumble'::text, 40::numeric, 'g'::text, 'bloem'::text, null::text),
  (11, 'Cacaocrumble'::text, 30::numeric, 'g'::text, 'bruine suiker'::text, null::text),
  (12, 'Cacaocrumble'::text, 15::numeric, 'g'::text, 'cacaopoeder'::text, null::text),
  (13, 'Cacaocrumble'::text, 1::numeric, 'snuf'::text, 'zeezout'::text, null::text),
  (14, 'Afwerking'::text, 125::numeric, 'g'::text, 'verse frambozen'::text, null::text),
  (15, 'Afwerking'::text, 4::numeric, 'blaadjes'::text, 'munt'::text, null::text),
  (16, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'bladgoud'::text, 'optioneel'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 1, 'Hak de chocolade', 'Hak de chocolade fijn met een koksmes. Kleine, gelijke stukjes smelten gelijkmatig in de warme crème.', 'snijden', '{"key":"chop","item":"chocolate"}'::jsonb, null, null),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 2, 'Maak een crème anglaise', 'Breng room en melk tegen de kook aan. Klop dooiers en suiker los, giet er al roerend de warme melk bij en verwarm terug in de pan tot 82 °C, tot de crème de lepel bedekt.', 'saus', '{"key":"simmer","tone":"cream"}'::jsonb, 300, 'Trek een lijn met je vinger over de lepel: blijft die staan, dan is de crème klaar.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 3, 'Smelt de chocolade', 'Giet de hete crème in drie keer over de chocolade en roer vanuit het midden tot een glanzende, elastische emulsie.', 'garen', '{"key":"melt"}'::jsonb, null, null),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 4, 'Laat opstijven', 'Giet de crémeux in een bakje, dek af met folie direct op het oppervlak en laat minstens 2 uur opstijven in de koelkast.', 'rusten', '{"key":"chill","item":"chocolate"}'::jsonb, 7200, null),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 5, 'Bak de cacaocrumble', 'Wrijf boter, bloem, suiker, cacao en zout tussen je vingertoppen tot kruimels. Bak ze 12 minuten op 170 °C tot ze krokant zijn en laat afkoelen.', 'garen', '{"key":"roast","item":"chocolate"}'::jsonb, 720, null),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 6, 'Klop de vanillecrème', 'Schraap het merg uit het vanillestokje. Klop room, vanillemerg en poedersuiker tot zachte pieken — de crème moet nog net glanzen.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, null),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 7, 'Draai quenelles en dresseer', 'Doop een lepel in heet water, draai een glanzende quenelle crémeux en bouw het bord op volgens de plating-gids.', 'dresseren', '{"key":"plate","dish":"chocolate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 0, 'Begin met een schoon bord', 'Koel een wit bord 10 minuten in de koelkast; de crémeux blijft zo langer strak.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 1, 'Plaats de saus', 'Strooi de cacaocrumble in een gebogen lijn diagonaal over het bord en zet drie druppels frambozencoulis aan het einde.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 2, 'Positioneer het hoofdonderdeel', 'Leg een glanzende quenelle crémeux midden op de crumble-lijn en zet een chocoladescherf schuin ertegen voor hoogte.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 3, 'Voeg garnituur toe', 'Plaats een kleinere quenelle vanillecrème rechtsonder en verdeel drie frambozen — altijd oneven.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 4, 'Werk af met kruiden', 'Werk af met muntblaadjes, een vleugje bladgoud en een wolkje cacao.'),
  ('323a916d-003c-45d9-8b40-8a00f97f0dd2', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer direct, voordat de quenelles zacht worden.');

-- Risotto met bospaddenstoelen
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('4f03d2fa-7b2c-4197-b652-52d24950584a', 'risotto-met-bospaddenstoelen', 'platform', null, true, 'Risotto met bospaddenstoelen', 'Carnaroli, tijm & Parmigiano', 'Romige carnaroli-risotto met goudbruin gebakken bospaddenstoelen, verse tijm en een laatste klont koude boter.', 'Risotto leer je met je oren en je ogen: het zachte geborrel, de rijst die langzaam bouillon opneemt en de ''onda'' — de golf die ontstaat als je de pan schudt.', 'hoofdgerecht', 'gemiddeld', 4, 15, 30, 0, '"risotto"'::jsonb, '#ECE3D0', array['risotto', 'mantecatura', 'paddenstoelen', 'roeren']::text[], array['Sauteuse met dikke bodem', 'Houten spatel', 'Pollepel', 'Koekenpan']::text[], 'Risotto hoort te vloeien: hij moet zich vanzelf over het bord verspreiden.', 'Een goede risotto is ''all''onda'': schud de pan en hij beweegt als een golf. Is hij stijf, voeg dan nog een scheutje bouillon toe.', 'Een Nebbiolo uit de Langhe of een gerijpte Soave Classico.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '4f03d2fa-7b2c-4197-b652-52d24950584a';
delete from public.recipe_ingredients where recipe_id = '4f03d2fa-7b2c-4197-b652-52d24950584a';
delete from public.recipe_steps where recipe_id = '4f03d2fa-7b2c-4197-b652-52d24950584a';
delete from public.plating_steps where recipe_id = '4f03d2fa-7b2c-4197-b652-52d24950584a';
insert into public.recipe_categories (recipe_id, category_id) values ('4f03d2fa-7b2c-4197-b652-52d24950584a', 'vegetarisch');
insert into public.ingredients (name) values ('carnaroli-rijst'), ('sjalot'), ('knoflook'), ('droge witte wijn'), ('groentebouillon'), ('olijfolie'), ('gemengde bospaddenstoelen'), ('boter'), ('tijm'), ('zout en peper'), ('koude boter'), ('Parmigiano Reggiano') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '4f03d2fa-7b2c-4197-b652-52d24950584a'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Risotto'::text, 300::numeric, 'g'::text, 'carnaroli-rijst'::text, null::text),
  (2, 'Risotto'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Risotto'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (4, 'Risotto'::text, 100::numeric, 'ml'::text, 'droge witte wijn'::text, null::text),
  (5, 'Risotto'::text, 1.2::numeric, 'l'::text, 'groentebouillon'::text, null::text),
  (6, 'Risotto'::text, 2::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (7, 'Paddenstoelen'::text, 300::numeric, 'g'::text, 'gemengde bospaddenstoelen'::text, null::text),
  (8, 'Paddenstoelen'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (9, 'Paddenstoelen'::text, 3::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (10, 'Paddenstoelen'::text, null::numeric, 'naar smaak'::text, 'zout en peper'::text, null::text),
  (11, 'Mantecatura'::text, 40::numeric, 'g'::text, 'koude boter'::text, 'in blokjes'::text),
  (12, 'Mantecatura'::text, 60::numeric, 'g'::text, 'Parmigiano Reggiano'::text, 'geraspt'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 1, 'Verwarm de bouillon', 'Houd de bouillon tegen de kook aan in een aparte pan. Koude bouillon zou het garen van de rijst telkens onderbreken.', 'mise-en-place', '{"key":"simmer","tone":"broth"}'::jsonb, null, null),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 2, 'Snipper sjalot en knoflook', 'Snijd sjalot en knoflook in een fijne brunoise. Ze moeten volledig wegsmelten in de risotto.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 3, 'Bak de paddenstoelen', 'Bak de paddenstoelen in een zeer hete pan in porties goudbruin. Voeg pas aan het einde boter, tijm, zout en peper toe.', 'bakken', '{"key":"sear","item":"mushrooms"}'::jsonb, 300, 'Zout trekt vocht: kruid pas als de paddenstoelen gekleurd zijn.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 4, 'Toast de rijst', 'Fruit sjalot en knoflook glazig in olijfolie, voeg de rijst toe en roer 2 minuten tot de korrels parelmoerachtig glanzen. Blus af met de wijn.', 'bakken', '{"key":"sear","item":"rice"}'::jsonb, 120, null),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 5, 'Voeg de bouillon toe', 'Voeg pollepel voor pollepel bouillon toe en roer regelmatig. Wacht telkens tot het vocht bijna is opgenomen. Na 17 à 18 minuten is de rijst beetgaar.', 'garen', '{"key":"simmer","tone":"risotto","item":"rice"}'::jsonb, 1080, null),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 6, 'Mantecatura', 'Haal de pan van het vuur. Klop koude boter en Parmigiano krachtig door de risotto tot hij romig en golvend is. Laat 1 minuut rusten met het deksel op de pan.', 'saus', '{"key":"grate","item":"parmesan"}'::jsonb, null, null),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 7, 'Dresseer het bord', 'Schep de risotto in een diep bord, laat hem uitvloeien en werk af met paddenstoelen, Parmigiano en tijm.', 'dresseren', '{"key":"plate","dish":"risotto"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 0, 'Begin met een schoon bord', 'Kies een diep stoneware bord en leg een gevouwen doek klaar om op te tikken.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 1, 'Plaats de saus', 'Schep de risotto in het midden en tik met je hand onder het bord, zodat hij zich als een golf vlak uitspreidt.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 2, 'Positioneer het hoofdonderdeel', 'Groepeer de paddenstoelen asymmetrisch op één helft, met de mooiste snijvlakken naar boven.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 3, 'Voeg garnituur toe', 'Leg schaafsel Parmigiano ertussen en druppel een beetje bruine boter voor glans.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 4, 'Werk af met kruiden', 'Strooi verse tijmblaadjes en versgemalen peper over het geheel.'),
  ('4f03d2fa-7b2c-4197-b652-52d24950584a', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — rijstkorrels op de rand verraden haast.');

-- Eendenborst met kersen en pastinaak
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 'eendenborst-met-kersen', 'platform', null, true, 'Eendenborst met kersen en pastinaak', 'Krokant vetrandje, kersenjus & pastinaakcrème', 'Rosé gebakken eendenborst met een krokant vetrandje, een glanzende kersenjus met port en fluweelzachte pastinaakcrème.', 'Eend en kers zijn een klassiek duo uit de Franse keuken. Het geheim zit in een koude start: door de eendenborst in een koude pan te leggen, smelt het vet langzaam uit en wordt het vel knapperig als een chip.', 'hoofdgerecht', 'uitdagend', 2, 20, 40, 8, '"duck"'::jsonb, '#E9DFDC', array['koude start', 'jus', 'crème', 'rosé bakken']::text[], array['Koekenpan', 'Kernthermometer', 'Blender of staafmixer', 'Fijne zeef', 'Mandoline']::text[], 'Op een donker bord komen de ivoren crème en de dieprode kersenjus pas echt tot leven.', 'Leg de eendenborst altijd in een koude pan. Een hete pan sluit het vel af, waardoor het vet niet kan uitsmelten.', 'Een fruitige Pinot Noir uit Oregon of een Saint-Émilion.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'bbaf7684-51cd-45f6-8403-f18bf29ffa9f';
delete from public.recipe_ingredients where recipe_id = 'bbaf7684-51cd-45f6-8403-f18bf29ffa9f';
delete from public.recipe_steps where recipe_id = 'bbaf7684-51cd-45f6-8403-f18bf29ffa9f';
delete from public.plating_steps where recipe_id = 'bbaf7684-51cd-45f6-8403-f18bf29ffa9f';
insert into public.recipe_categories (recipe_id, category_id) values ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 'vlees');
insert into public.ingredients (name) values ('grote eendenborst'), ('tijm'), ('zeezout en zwarte peper'), ('pastinaak'), ('volle melk'), ('boter'), ('nootmuskaat'), ('kersen'), ('rode port'), ('gevogeltefond'), ('honing'), ('koude boter'), ('kleine pastinaak'), ('kervel'), ('vlokzout') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'bbaf7684-51cd-45f6-8403-f18bf29ffa9f'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Eend'::text, 1::numeric, 'stuks'::text, 'grote eendenborst'::text, '± 400 g'::text),
  (2, 'Eend'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text),
  (3, 'Eend'::text, null::numeric, 'naar smaak'::text, 'zeezout en zwarte peper'::text, null::text),
  (4, 'Pastinaakcrème'::text, 300::numeric, 'g'::text, 'pastinaak'::text, null::text),
  (5, 'Pastinaakcrème'::text, 150::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (6, 'Pastinaakcrème'::text, 25::numeric, 'g'::text, 'boter'::text, null::text),
  (7, 'Pastinaakcrème'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (8, 'Kersenjus'::text, 150::numeric, 'g'::text, 'kersen'::text, 'ontpit'::text),
  (9, 'Kersenjus'::text, 50::numeric, 'ml'::text, 'rode port'::text, null::text),
  (10, 'Kersenjus'::text, 150::numeric, 'ml'::text, 'gevogeltefond'::text, null::text),
  (11, 'Kersenjus'::text, 1::numeric, 'tl'::text, 'honing'::text, null::text),
  (12, 'Kersenjus'::text, 10::numeric, 'g'::text, 'koude boter'::text, null::text),
  (13, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'kleine pastinaak'::text, 'voor chips'::text),
  (14, 'Afwerking'::text, 1::numeric, 'handje'::text, 'kervel'::text, null::text),
  (15, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'vlokzout'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 1, 'Kerf het vel in', 'Dep de eendenborst droog en kerf het vel met een scherp mes in een ruitpatroon, zonder in het vlees te snijden. Zo smelt het vet gelijkmatig uit.', 'mise-en-place', '{"key":"prep","item":"duck"}'::jsonb, null, 'Een koude eendenborst is makkelijker in te kerven.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 2, 'Kruid de eendenborst', 'Wrijf zout en peper in de insnijdingen en laat 10 minuten intrekken, met het vel naar boven.', 'kruiden', '{"key":"season","item":"duck"}'::jsonb, 600, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 3, 'Kook de pastinaak', 'Schil de pastinaak, snijd in stukken en kook 15 minuten zacht in de melk met een snuf zout, tot ze volledig gaar is.', 'garen', '{"key":"boil","item":"cauliflower"}'::jsonb, 900, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 4, 'Mix tot crème', 'Mix de pastinaak met boter, nootmuskaat en zoveel kookmelk als nodig tot een zijdezachte crème. Passeer voor extra finesse door een zeef.', 'saus', '{"key":"blend","tone":"cream"}'::jsonb, null, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 5, 'Bak in een koude pan', 'Leg de eendenborst met het vel naar beneden in een koude pan. Zet het vuur middelhoog en laat het vet 8 à 10 minuten langzaam uitsmelten. Giet tussendoor overtollig vet af.', 'bakken', '{"key":"sear","item":"duck"}'::jsonb, 600, 'Bewaar het eendenvet — perfect voor gebakken aardappelen.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 6, 'Draai om en laat rusten', 'Draai de borst om, bak 2 minuten op de vleeskant en laat daarna 8 minuten rusten op een warme plank, met het vel naar boven.', 'rusten', '{"key":"rest","item":"duck"}'::jsonb, 480, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 7, 'Maak de kersenjus', 'Blus de pan af met port, voeg fond, honing en kersen toe en laat inkoken tot een glanzende jus. Monteer op het laatst met koude boter.', 'saus', '{"key":"simmer","tone":"cherry"}'::jsonb, 480, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 8, 'Snijd de eendenborst', 'Snijd de eendenborst schuin in plakken van 1 cm. Het vlees moet egaal rosé zijn, het vel knapperig.', 'snijden', '{"key":"slice","item":"duck"}'::jsonb, null, null),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 9, 'Dresseer het bord', 'Trek een boog pastinaakcrème, waaier de eend erop en werk af met kersen, jus, pastinaakchips en kervel.', 'dresseren', '{"key":"plate","dish":"duck"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 0, 'Begin met een schoon bord', 'Kies een matzwart bord — het contrast maakt de kleuren van dit gerecht dramatisch.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 1, 'Plaats de saus', 'Leg een lepel pastinaakcrème neer en trek hem in een lange boog uit. Zet daarnaast druppels kersenjus in aflopende grootte.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 2, 'Positioneer het hoofdonderdeel', 'Waaier de plakken eend op de crème, met het krokante vel telkens naar dezelfde kant.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 3, 'Voeg garnituur toe', 'Verdeel hele en gehalveerde kersen rond het vlees en zet pastinaakchips rechtop voor hoogte.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 4, 'Werk af met kruiden', 'Werk af met kervel en een paar vlokjes zout op de snijvlakken.'),
  ('bbaf7684-51cd-45f6-8403-f18bf29ffa9f', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon — op een donker bord zie je elke vlek.');

-- Coquilles met bloemkoolcrème
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 'coquilles-met-bloemkoolcreme', 'platform', null, true, 'Coquilles met bloemkoolcrème', 'Beurre noisette, hazelnoot & groene appel', 'Goudbruin gebakken coquilles op een zijdezachte bloemkoolcrème, met nootachtige beurre noisette, geroosterde hazelnoot en frisse appel.', 'Coquilles zijn dé oefening in timing: negentig seconden per kant, geen seconde langer. Wat je krijgt is een karamelkorst met een glazig, zoet hart.', 'voorgerecht', 'gemiddeld', 2, 15, 25, 0, '"scallops"'::jsonb, '#E4E2DE', array['beurre noisette', 'aanbraden', 'crème', 'zeevruchten']::text[], array['Gietijzeren of stalen pan', 'Blender', 'Steelpan', 'Keukenpapier']::text[], 'Drie coquilles op een lijn, als parels aan een ketting.', 'Coquilles moeten kurkdroog zijn. Laat ze eventueel 20 minuten onafgedekt op keukenpapier in de koelkast liggen.', 'Een Meursault of een droge Riesling uit de Pfalz.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'd50a708b-02ed-4b5e-8362-d9d52ab2c6a2';
delete from public.recipe_ingredients where recipe_id = 'd50a708b-02ed-4b5e-8362-d9d52ab2c6a2';
delete from public.recipe_steps where recipe_id = 'd50a708b-02ed-4b5e-8362-d9d52ab2c6a2';
delete from public.plating_steps where recipe_id = 'd50a708b-02ed-4b5e-8362-d9d52ab2c6a2';
insert into public.recipe_categories (recipe_id, category_id) values ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 'vis');
insert into public.ingredients (name) values ('coquilles'), ('zonnebloemolie'), ('boter'), ('zeezout'), ('bloemkool'), ('volle melk'), ('zout'), ('hazelnoten'), ('citroensap'), ('groene appel'), ('shiso-cress of kervel'), ('citroenzeste') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'd50a708b-02ed-4b5e-8362-d9d52ab2c6a2'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Coquilles'::text, 6::numeric, 'stuks'::text, 'coquilles'::text, 'zonder corail'::text),
  (2, 'Coquilles'::text, 1::numeric, 'el'::text, 'zonnebloemolie'::text, null::text),
  (3, 'Coquilles'::text, 10::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Coquilles'::text, null::numeric, 'naar smaak'::text, 'zeezout'::text, null::text),
  (5, 'Bloemkoolcrème'::text, 250::numeric, 'g'::text, 'bloemkool'::text, 'in roosjes'::text),
  (6, 'Bloemkoolcrème'::text, 150::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (7, 'Bloemkoolcrème'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (8, 'Bloemkoolcrème'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (9, 'Beurre noisette'::text, 40::numeric, 'g'::text, 'boter'::text, null::text),
  (10, 'Beurre noisette'::text, 20::numeric, 'g'::text, 'hazelnoten'::text, 'geroosterd en gehakt'::text),
  (11, 'Beurre noisette'::text, 1::numeric, 'tl'::text, 'citroensap'::text, null::text),
  (12, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'groene appel'::text, 'in brunoise'::text),
  (13, 'Afwerking'::text, 1::numeric, 'handje'::text, 'shiso-cress of kervel'::text, null::text),
  (14, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'citroenzeste'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 1, 'Snijd de bloemkool', 'Snijd de bloemkool in kleine, gelijke roosjes. Hoe kleiner en gelijkmatiger, hoe sneller en egaler ze garen.', 'snijden', '{"key":"chop","item":"cauliflower"}'::jsonb, null, null),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 2, 'Gaar de bloemkool in melk', 'Laat de roosjes 15 minuten zacht garen in de melk met een snuf zout, tot ze helemaal zacht zijn.', 'garen', '{"key":"simmer","tone":"cream","item":"cauliflower"}'::jsonb, 900, null),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 3, 'Mix de crème', 'Mix de bloemkool met boter en een deel van de melk minstens 2 minuten tot een zijdezachte crème.', 'saus', '{"key":"blend","tone":"cream","item":"cauliflower"}'::jsonb, null, null),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 4, 'Maak beurre noisette', 'Verwarm de boter tot hij schuimt, nootachtig ruikt en goudbruin kleurt. Voeg direct hazelnoot en citroensap toe om het bruinen te stoppen.', 'saus', '{"key":"simmer","tone":"brown-butter"}'::jsonb, 180, 'Houd de pan in beweging en vertrouw op je neus.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 5, 'Dep en kruid de coquilles', 'Dep de coquilles zeer droog met keukenpapier en kruid ze vlak voor het bakken met zeezout.', 'kruiden', '{"key":"season","item":"scallops"}'::jsonb, null, null),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 6, 'Bak de coquilles', 'Bak de coquilles in een zeer hete pan 90 seconden tot een diepgouden korst. Draai om, voeg boter toe en bak nog 30 seconden.', 'bakken', '{"key":"sear","item":"scallops"}'::jsonb, 120, 'Leg ze met de klok mee in de pan, dan weet je welke eerst om moet.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 7, 'Dresseer het bord', 'Trek een veeg bloemkoolcrème, zet de coquilles erop en werk af met beurre noisette, hazelnoot, appel en cress.', 'dresseren', '{"key":"plate","dish":"scallops"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 0, 'Begin met een schoon bord', 'Kies een donker leisteenbord: het ivoor van de bloemkool en het goud van de coquilles schitteren erop.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 1, 'Plaats de saus', 'Trek met een lepel een korte veeg bloemkoolcrème en zet er drie stippen in aflopende grootte naast.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 2, 'Positioneer het hoofdonderdeel', 'Plaats de drie coquilles met de korst naar boven op de veeg, in een licht gebogen lijn.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 3, 'Voeg garnituur toe', 'Druppel de beurre noisette rond de coquilles en verdeel hazelnoot en appelbrunoise.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 4, 'Werk af met kruiden', 'Werk af met shiso-cress en een snufje citroenzeste.'),
  ('d50a708b-02ed-4b5e-8362-d9d52ab2c6a2', 5, 'Maak de rand van het bord schoon', 'Controleer de rand: botervlekjes veeg je weg met een doek met een druppel azijn.');

-- Burrata met tomaat en basilicumolie
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 'burrata-met-tomaat-en-basilicumolie', 'platform', null, true, 'Burrata met tomaat en basilicumolie', 'Kerstomaten, balsamico & zuurdesem', 'Romige burrata met gekleurde kerstomaten, felgroene basilicumolie, oude balsamico en een knapperige crostino.', 'Het eenvoudigste gerecht verdient de beste ingrediënten: rijpe tomaten op kamertemperatuur, uitstekende olijfolie en een burrata die net uit de verpakking komt.', 'voorgerecht', 'makkelijk', 2, 15, 5, 0, '"burrata"'::jsonb, '#EEE6DA', array['zomer', 'kruidenolie', 'snel', 'tomaat']::text[], array['Blender', 'Fijne zeef of koffiefilter', 'Grillpan']::text[], 'Laat de burrata het middelpunt zijn en bouw een kleurrijke krans eromheen.', 'Bewaar tomaten nooit in de koelkast — kou vernietigt hun aroma en maakt het vruchtvlees melig.', 'Een frisse Vermentino of een droge rosé uit de Provence.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '145a6888-4f6d-4778-a0fb-3bce0c5a8754';
delete from public.recipe_ingredients where recipe_id = '145a6888-4f6d-4778-a0fb-3bce0c5a8754';
delete from public.recipe_steps where recipe_id = '145a6888-4f6d-4778-a0fb-3bce0c5a8754';
delete from public.plating_steps where recipe_id = '145a6888-4f6d-4778-a0fb-3bce0c5a8754';
insert into public.recipe_categories (recipe_id, category_id) values ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 'vegetarisch');
insert into public.ingredients (name) values ('burrata'), ('gemengde kerstomaten'), ('vlokzout'), ('zwarte peper'), ('basilicum'), ('extra vierge olijfolie'), ('oude balsamico'), ('zuurdesembrood'), ('knoflook') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '145a6888-4f6d-4778-a0fb-3bce0c5a8754'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Basis'::text, 1::numeric, 'stuks'::text, 'burrata'::text, '± 125 g'::text),
  (2, 'Basis'::text, 250::numeric, 'g'::text, 'gemengde kerstomaten'::text, null::text),
  (3, 'Basis'::text, 1::numeric, 'snuf'::text, 'vlokzout'::text, null::text),
  (4, 'Basis'::text, null::numeric, 'naar smaak'::text, 'zwarte peper'::text, null::text),
  (5, 'Basilicumolie'::text, 20::numeric, 'g'::text, 'basilicum'::text, null::text),
  (6, 'Basilicumolie'::text, 80::numeric, 'ml'::text, 'extra vierge olijfolie'::text, null::text),
  (7, 'Afwerking'::text, 1::numeric, 'el'::text, 'oude balsamico'::text, null::text),
  (8, 'Afwerking'::text, 2::numeric, 'sneetjes'::text, 'zuurdesembrood'::text, null::text),
  (9, 'Afwerking'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 1, 'Haal de burrata op temperatuur', 'Haal de burrata 20 minuten van tevoren uit de koelkast en laat hem uitlekken. Op kamertemperatuur is het romige hart op zijn best.', 'mise-en-place', '{"key":"prep","item":"burrata"}'::jsonb, 1200, null),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 2, 'Snijd de tomaten', 'Snijd de kerstomaten in helften en kwarten. Verschillende vormen en kleuren maken het bord levendig.', 'snijden', '{"key":"chop","item":"tomato"}'::jsonb, null, null),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 3, 'Kruid de tomaten', 'Bestrooi de tomaten met vlokzout en laat 5 minuten staan. Het zout trekt het sap eruit en intensiveert de smaak.', 'kruiden', '{"key":"season","item":"tomato"}'::jsonb, 300, null),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 4, 'Mix de basilicumolie', 'Mix basilicum en olijfolie 1 minuut glad en zeef door een fijne zeef of koffiefilter voor een heldere olie.', 'saus', '{"key":"blend","tone":"herb"}'::jsonb, null, null),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 5, 'Grill de crostini', 'Besprenkel het brood met olie en grill het aan beide kanten knapperig. Wrijf in met een gehalveerd teentje knoflook.', 'bakken', '{"key":"sear","item":"bread"}'::jsonb, 120, null),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 6, 'Dresseer het bord', 'Leg de burrata op het bord, scheur hem open en bouw er een krans van tomaten, olie en basilicum omheen.', 'dresseren', '{"key":"plate","dish":"burrata"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 0, 'Begin met een schoon bord', 'Kies een licht stoneware bord met textuur — rustiek en elegant tegelijk.'),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 1, 'Plaats de saus', 'Druppel de basilicumolie in losse poeltjes rond het midden en zet een paar stippen balsamico.'),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 2, 'Positioneer het hoofdonderdeel', 'Leg de burrata iets uit het midden en scheur hem met twee vingers open, zodat het romige hart zichtbaar wordt.'),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 3, 'Voeg garnituur toe', 'Verdeel de tomaten in een losse krans, snijvlakken naar boven, rode en gele afwisselend.'),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 4, 'Werk af met kruiden', 'Werk af met kleine basilicumtopjes, vlokzout en versgemalen peper in het open hart.'),
  ('145a6888-4f6d-4778-a0fb-3bce0c5a8754', 5, 'Maak de rand van het bord schoon', 'Veeg olie van de rand en leg de crostino er op het laatste moment naast.');
