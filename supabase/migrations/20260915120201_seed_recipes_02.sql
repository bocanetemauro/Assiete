-- Platformrecepten deel 02 (gegenereerd door scripts/generate-seed.mjs — niet handmatig bewerken)

-- Citroentarte met meringue
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('a96bbde3-1887-43ee-a551-c7a564cc76be', 'citroentarte-met-meringue', 'platform', null, true, 'Citroentarte met meringue', 'Zanddeeg, lemon curd & gebrande meringue', 'Een krokante zanddeegbodem gevuld met frisse lemon curd, afgewerkt met gebrande meringuetoefjes en citroenzeste.', 'Patisserie in zijn puurste vorm: drie basistechnieken — zanddeeg, curd en meringue — samen in één tartelette. Wie deze tarte beheerst, beheerst de basis van de Franse banketbakkerij.', 'nagerecht', 'uitdagend', 6, 45, 35, 90, '"lemon-tart"'::jsonb, '#F0EAD2', array['zanddeeg', 'lemon curd', 'meringue', 'brander']::text[], array['Taartring van 20 cm', 'Bakbonen', 'Garde', 'Spuitzak met sterspuitmond', 'Gasbrander', 'Microplane']::text[], 'Laat de tarte de hoofdrol spelen en houd de rest van het bord sober.', 'Bak je bodem op een geperforeerde bakmat: hij bakt dan egaal en krokant zonder te bollen.', 'Een Moscato d''Asti of een zoete Coteaux du Layon.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'a96bbde3-1887-43ee-a551-c7a564cc76be';
delete from public.recipe_ingredients where recipe_id = 'a96bbde3-1887-43ee-a551-c7a564cc76be';
delete from public.recipe_steps where recipe_id = 'a96bbde3-1887-43ee-a551-c7a564cc76be';
delete from public.plating_steps where recipe_id = 'a96bbde3-1887-43ee-a551-c7a564cc76be';
insert into public.recipe_categories (recipe_id, category_id) values ('a96bbde3-1887-43ee-a551-c7a564cc76be', 'technieken');
insert into public.ingredients (name) values ('bloem'), ('koude boter'), ('poedersuiker'), ('ei'), ('zout'), ('citroenen'), ('kristalsuiker'), ('eieren'), ('boter'), ('eiwitten'), ('frambozen'), ('citroenzeste en muntblaadjes') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'a96bbde3-1887-43ee-a551-c7a564cc76be'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Zanddeeg'::text, 200::numeric, 'g'::text, 'bloem'::text, null::text),
  (2, 'Zanddeeg'::text, 100::numeric, 'g'::text, 'koude boter'::text, null::text),
  (3, 'Zanddeeg'::text, 60::numeric, 'g'::text, 'poedersuiker'::text, null::text),
  (4, 'Zanddeeg'::text, 1::numeric, 'stuks'::text, 'ei'::text, null::text),
  (5, 'Zanddeeg'::text, 1::numeric, 'snuf'::text, 'zout'::text, null::text),
  (6, 'Lemon curd'::text, 3::numeric, 'stuks'::text, 'citroenen'::text, 'sap en rasp'::text),
  (7, 'Lemon curd'::text, 150::numeric, 'g'::text, 'kristalsuiker'::text, null::text),
  (8, 'Lemon curd'::text, 3::numeric, 'stuks'::text, 'eieren'::text, null::text),
  (9, 'Lemon curd'::text, 100::numeric, 'g'::text, 'boter'::text, 'in blokjes'::text),
  (10, 'Meringue'::text, 2::numeric, 'stuks'::text, 'eiwitten'::text, null::text),
  (11, 'Meringue'::text, 100::numeric, 'g'::text, 'kristalsuiker'::text, null::text),
  (12, 'Afwerking'::text, 6::numeric, 'stuks'::text, 'frambozen'::text, null::text),
  (13, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'citroenzeste en muntblaadjes'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 1, 'Maak het zanddeeg', 'Wrijf bloem, poedersuiker, zout en koude boter tot kruimels. Voeg het ei toe en kneed kort tot een glad deeg. Niet te lang: warm deeg wordt taai.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 2, 'Laat het deeg rusten', 'Druk het deeg plat, wikkel het in folie en laat het 30 minuten opstijven in de koelkast.', 'rusten', '{"key":"chill","item":"dough"}'::jsonb, 1800, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 3, 'Bak de bodem blind', 'Rol het deeg 3 mm dun uit, bekleed de ring en prik de bodem in. Bak 15 minuten blind op 170 °C met bakbonen, verwijder ze en bak nog 5 minuten goudbruin.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 1200, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 4, 'Rasp de citroenen', 'Rasp alleen het gele deel van de schil — het wit eronder is bitter. Pers daarna de citroenen uit.', 'snijden', '{"key":"grate","item":"lemon"}'::jsonb, null, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 5, 'Kook de lemon curd', 'Klop sap, rasp, suiker en eieren in een pan op laag vuur tot de curd dik wordt. Haal van het vuur en klop de boter erdoor tot een glanzende crème.', 'saus', '{"key":"whisk","tone":"lemon"}'::jsonb, 480, 'Blijf continu kloppen, anders krijg je roerei.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 6, 'Vul en laat opstijven', 'Giet de warme curd in de gebakken bodem, strijk glad en laat minstens 1 uur opstijven in de koelkast.', 'rusten', '{"key":"chill","item":"lemon"}'::jsonb, 3600, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 7, 'Klop de meringue', 'Klop de eiwitten los en voeg geleidelijk de suiker toe. Klop door tot een stevige, glanzende meringue die in pieken blijft staan.', 'saus', '{"key":"whisk","tone":"egg-white"}'::jsonb, null, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 8, 'Spuit de meringue', 'Spuit met een spuitzak en sterspuitmond kleine toefjes op de tarte. Houd de zak loodrecht en trek hem in één beweging omhoog.', 'dresseren', '{"key":"pipe"}'::jsonb, null, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 9, 'Brand de meringue', 'Brand de toefjes met een gasbrander tot de puntjes karamelbruin kleuren. Beweeg de vlam continu.', 'garen', '{"key":"torch"}'::jsonb, null, null),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 10, 'Dresseer het bord', 'Plaats een punt of tartelette op het bord en werk af met curd, frambozen en citroenzeste.', 'dresseren', '{"key":"plate","dish":"lemon-tart"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 0, 'Begin met een schoon bord', 'Kies een wit bord zonder decoratie, zodat het geel van de curd straalt.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 1, 'Plaats de saus', 'Trek met de achterkant van een lepel een dunne streep lemon curd en zet er twee stippen achter.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 2, 'Positioneer het hoofdonderdeel', 'Plaats de tartelette net links van het midden, met de mooiste meringuetoefjes naar de gast gericht.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 3, 'Voeg garnituur toe', 'Leg twee frambozen rechtsonder als rood accent.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 4, 'Werk af met kruiden', 'Werk af met citroenzeste, een muntblaadje en eventueel een eetbare bloem.'),
  ('a96bbde3-1887-43ee-a551-c7a564cc76be', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer koel, maar niet koelkastkoud.');

-- Pompoensoep met krokante salie
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('a89cb35b-7655-478d-9714-8c215b6e7cac', 'pompoensoep-met-salie', 'platform', null, true, 'Pompoensoep met krokante salie', 'Geroosterde flespompoen, crème fraîche & pompoenpit', 'Fluweelzachte soep van geroosterde flespompoen met een wervel crème fraîche, krokante salie en geroosterde pompoenpitten.', 'Door de pompoen eerst te roosteren in plaats van te koken, krijgt de soep een diepe, zoete en licht karamelachtige smaak. Een herfstklassieker met restaurantallure.', 'voorgerecht', 'makkelijk', 4, 15, 45, 0, '"soup"'::jsonb, '#F0E2D0', array['velouté', 'roosteren', 'herfst', 'krokant']::text[], array['Oven', 'Blender', 'Soeppan', 'Koekenpan']::text[], 'Soep verdient ook dressage: een diep bord, een wervel en een klein eilandje garnituur.', 'Rooster de pompoen met schil als je haast hebt — na het roosteren schep je het vruchtvlees er zo uit.', 'Een houtgelagerde Chardonnay of een Elzasser Pinot Gris.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'a89cb35b-7655-478d-9714-8c215b6e7cac';
delete from public.recipe_ingredients where recipe_id = 'a89cb35b-7655-478d-9714-8c215b6e7cac';
delete from public.recipe_steps where recipe_id = 'a89cb35b-7655-478d-9714-8c215b6e7cac';
delete from public.plating_steps where recipe_id = 'a89cb35b-7655-478d-9714-8c215b6e7cac';
insert into public.recipe_categories (recipe_id, category_id) values ('a89cb35b-7655-478d-9714-8c215b6e7cac', 'soep'), ('a89cb35b-7655-478d-9714-8c215b6e7cac', 'vegetarisch');
insert into public.ingredients (name) values ('flespompoen'), ('ui'), ('knoflook'), ('groentebouillon'), ('room'), ('olijfolie'), ('nootmuskaat'), ('salie'), ('pompoenpitten'), ('crème fraîche'), ('pompoenpitolie') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'a89cb35b-7655-478d-9714-8c215b6e7cac'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Soep'::text, 1::numeric, 'kg'::text, 'flespompoen'::text, null::text),
  (2, 'Soep'::text, 1::numeric, 'stuks'::text, 'ui'::text, null::text),
  (3, 'Soep'::text, 2::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (4, 'Soep'::text, 900::numeric, 'ml'::text, 'groentebouillon'::text, null::text),
  (5, 'Soep'::text, 100::numeric, 'ml'::text, 'room'::text, null::text),
  (6, 'Soep'::text, 3::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (7, 'Soep'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (8, 'Afwerking'::text, 12::numeric, 'blaadjes'::text, 'salie'::text, null::text),
  (9, 'Afwerking'::text, 30::numeric, 'g'::text, 'pompoenpitten'::text, null::text),
  (10, 'Afwerking'::text, 4::numeric, 'el'::text, 'crème fraîche'::text, null::text),
  (11, 'Afwerking'::text, 1::numeric, 'el'::text, 'pompoenpitolie'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 1, 'Snijd de pompoen', 'Schil de pompoen, verwijder de pitten en snijd het vruchtvlees in blokjes van 3 cm.', 'snijden', '{"key":"chop","item":"pumpkin"}'::jsonb, null, null),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 2, 'Rooster de pompoen', 'Meng de blokjes met olie, zout en peper en rooster ze 25 minuten op 200 °C tot de randjes karamelliseren.', 'garen', '{"key":"roast","item":"pumpkin"}'::jsonb, 1500, null),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 3, 'Snipper ui en knoflook', 'Snijd de ui grof en de knoflook fijn — alles wordt straks gemixt, dus perfectie is niet nodig.', 'snijden', '{"key":"chop","item":"onion"}'::jsonb, null, null),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 4, 'Laat de soep trekken', 'Fruit ui en knoflook zacht in olie, voeg de geroosterde pompoen en bouillon toe en laat 15 minuten zachtjes koken.', 'garen', '{"key":"simmer","tone":"pumpkin"}'::jsonb, 900, null),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 5, 'Mix fluweelzacht', 'Mix de soep minstens 2 minuten in een blender tot hij zijdezacht is. Voeg room en nootmuskaat toe en breng op smaak.', 'saus', '{"key":"blend","tone":"pumpkin"}'::jsonb, null, 'Vul de blender nooit meer dan halfvol met hete soep.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 6, 'Bak salie en pitten krokant', 'Bak de salieblaadjes 20 seconden in hete olie tot ze krokant zijn en laat uitlekken. Rooster de pompoenpitten in een droge pan tot ze gaan poffen.', 'bakken', '{"key":"sear","item":"sage"}'::jsonb, 60, null),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 7, 'Dresseer de soep', 'Schenk de soep in een voorverwarmd diep bord en werk af met een wervel crème fraîche, salie en pitten.', 'dresseren', '{"key":"plate","dish":"soup"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 0, 'Begin met een schoon bord', 'Warm diepe borden voor met heet water en droog ze goed af.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 1, 'Plaats de saus', 'Schenk de soep via de rand in het bord, zodat het oppervlak glad en glanzend blijft.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 2, 'Positioneer het hoofdonderdeel', 'Druppel een lepel crème fraîche iets uit het midden en trek er met een satéprikker een spiraal door.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 3, 'Voeg garnituur toe', 'Leg de pompoenpitten in een klein eilandje en druppel pompoenpitolie in stippen rond de wervel.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 4, 'Werk af met kruiden', 'Leg twee of drie krokante salieblaadjes schuin tegen elkaar voor hoogte en strooi peper.'),
  ('a89cb35b-7655-478d-9714-8c215b6e7cac', 5, 'Maak de rand van het bord schoon', 'Veeg soepspatten van de brede rand — daar kijkt je gast als eerste naar.');

-- Zalm tataki met sesam
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('4d11192c-4a4a-49f6-b184-223a530343b1', 'zalm-tataki-met-sesam', 'platform', null, true, 'Zalm tataki met sesam', 'Soja-gemberdressing, komkommer & radijs', 'Kort dichtgeschroeide zalm in een sesamkorst met een frisse soja-gemberdressing, komkommerlinten en krokante radijs.', 'Tataki komt uit Japan: het buitenste laagje wordt heel kort geschroeid, het binnenste blijft rauw en zijdezacht. Precisie in snijden en temperatuur maakt het verschil.', 'voorgerecht', 'makkelijk', 2, 20, 5, 10, '"salmon"'::jsonb, '#E6E0DA', array['tataki', 'sesam', 'Japans', 'ijswater']::text[], array['Gietijzeren pan', 'Kom met ijswater', 'Lang, scherp mes', 'Dunschiller']::text[], 'Japanse eenvoud: ritme, lijnen en veel lege ruimte.', 'Leg je mes 10 minuten in de vriezer voor het snijden: een koud lemmet glijdt zonder te scheuren door de zalm.', 'Een droge Riesling uit de Rheingau of een koele junmai sake.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '4d11192c-4a4a-49f6-b184-223a530343b1';
delete from public.recipe_ingredients where recipe_id = '4d11192c-4a4a-49f6-b184-223a530343b1';
delete from public.recipe_steps where recipe_id = '4d11192c-4a4a-49f6-b184-223a530343b1';
delete from public.plating_steps where recipe_id = '4d11192c-4a4a-49f6-b184-223a530343b1';
insert into public.recipe_categories (recipe_id, category_id) values ('4d11192c-4a4a-49f6-b184-223a530343b1', 'vis');
insert into public.ingredients (name) values ('zalmfilet'), ('witte en zwarte sesamzaadjes'), ('neutrale olie'), ('sojasaus'), ('rijstazijn'), ('geraspte gember'), ('honing'), ('geroosterde sesamolie'), ('komkommer'), ('radijsjes'), ('lente-ui'), ('koriander of shiso') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '4d11192c-4a4a-49f6-b184-223a530343b1'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Zalm'::text, 250::numeric, 'g'::text, 'zalmfilet'::text, 'sushikwaliteit, zonder vel'::text),
  (2, 'Zalm'::text, 2::numeric, 'el'::text, 'witte en zwarte sesamzaadjes'::text, null::text),
  (3, 'Zalm'::text, 1::numeric, 'el'::text, 'neutrale olie'::text, null::text),
  (4, 'Dressing'::text, 2::numeric, 'el'::text, 'sojasaus'::text, null::text),
  (5, 'Dressing'::text, 1::numeric, 'el'::text, 'rijstazijn'::text, null::text),
  (6, 'Dressing'::text, 1::numeric, 'tl'::text, 'geraspte gember'::text, null::text),
  (7, 'Dressing'::text, 1::numeric, 'tl'::text, 'honing'::text, null::text),
  (8, 'Dressing'::text, 1::numeric, 'tl'::text, 'geroosterde sesamolie'::text, null::text),
  (9, 'Garnituur'::text, 0.5::numeric, 'stuks'::text, 'komkommer'::text, null::text),
  (10, 'Garnituur'::text, 4::numeric, 'stuks'::text, 'radijsjes'::text, null::text),
  (11, 'Garnituur'::text, 1::numeric, 'stuks'::text, 'lente-ui'::text, null::text),
  (12, 'Garnituur'::text, 1::numeric, 'handje'::text, 'koriander of shiso'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 1, 'Snijd de zalm op maat', 'Snijd de zalm in een strakke, rechthoekige baan van ongeveer 4 cm breed. Een gelijkmatige vorm schroeit gelijkmatig.', 'mise-en-place', '{"key":"prep","item":"salmon"}'::jsonb, null, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 2, 'Rol door sesam', 'Bestrijk de zalm licht met olie en rol hem door de sesamzaadjes tot alle zijden bedekt zijn.', 'kruiden', '{"key":"season","item":"salmon"}'::jsonb, null, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 3, 'Schroei de zalm kort', 'Schroei de zalm in een zeer hete pan 10 seconden per kant. Alleen de buitenste millimeters mogen garen.', 'bakken', '{"key":"sear","item":"salmon"}'::jsonb, 40, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 4, 'Koel direct af', 'Leg de zalm meteen in ijswater om het garen te stoppen, dep droog en laat 10 minuten opstijven in de koelkast.', 'rusten', '{"key":"chill","item":"salmon"}'::jsonb, 600, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 5, 'Maak de dressing', 'Klop sojasaus, rijstazijn, gember, honing en sesamolie samen tot een glanzende dressing.', 'saus', '{"key":"whisk","tone":"soy"}'::jsonb, null, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 6, 'Snijd de garnituur', 'Schaaf de komkommer met een dunschiller in lange linten, snijd de radijs flinterdun en de lente-ui in fijne ringetjes.', 'snijden', '{"key":"chop","item":"cucumber"}'::jsonb, null, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 7, 'Snijd de tataki', 'Snijd de zalm met een lang, scherp mes in plakken van 1 cm. Eén haal per plak, zonder te zagen.', 'snijden', '{"key":"slice","item":"salmon"}'::jsonb, null, null),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 8, 'Dresseer het bord', 'Trek een lijn dressing, leg de tataki dakpansgewijs en werk af met komkommer, radijs, lente-ui en sesam.', 'dresseren', '{"key":"plate","dish":"salmon"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 0, 'Begin met een schoon bord', 'Kies een donker leisteenbord — het oranje van de zalm en het groen van de garnituur springen eruit.'),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 1, 'Plaats de saus', 'Trek met een penseel of lepel een dunne lijn dressing diagonaal over het bord en zet er stippen naast.'),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 2, 'Positioneer het hoofdonderdeel', 'Leg de plakken tataki dakpansgewijs langs de lijn, met het rauwe snijvlak naar boven.'),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 3, 'Voeg garnituur toe', 'Rol komkommerlinten tot krullen en zet ze rechtop; leg radijsschijfjes in een los ritme.'),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 4, 'Werk af met kruiden', 'Strooi lente-ui, sesam en een paar dunne rode chilidraadjes.'),
  ('4d11192c-4a4a-49f6-b184-223a530343b1', 5, 'Maak de rand van het bord schoon', 'Veeg dressingdruppels weg — sojasaus laat snel een kring achter.');

-- Gazpacho met komkommer en basilicumolie
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('58e8054e-9c02-450d-8969-42cad9bdf00a', 'gazpacho-met-komkommer-en-basilicumolie', 'platform', null, true, 'Gazpacho met komkommer en basilicumolie', 'IJskoude amuse in een glaasje', 'Een zijdezachte, ijskoude gazpacho van rijpe tomaat en paprika, afgewerkt met komkommerbrunoise en felgroene basilicumolie.', 'Een goede amuse is een belofte voor de rest van het diner: klein, precies en in één slok duidelijk. Deze gazpacho draait om rijpe tomaten, een lange marinade en extreem glad mixen.', 'amuse', 'makkelijk', 6, 25, 0, 60, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"gazpacho","accent":"herbOil"},"main":{"kind":"cubes","color":"cucumber","accent":"tomato"},"garnish":[{"kind":"leaves","color":"green"},{"kind":"petals","color":"coulis"}],"herbs":["basil","flakes","pepper"]}'::jsonb, '#F2E3DC', array['koud', 'zomer', 'mixen', 'shot']::text[], array['Blender', 'Fijne zeef', 'Shotglaasjes of kleine kommetjes', 'Knijpfles']::text[], 'Een amuse is een belofte: klein, precies en in één hap duidelijk.', 'Proef koud, niet warm: kou dempt zout en zuur. Breng de gazpacho pas op smaak als hij volledig gekoeld is.', 'Een koele fino-sherry of een droge cava.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '58e8054e-9c02-450d-8969-42cad9bdf00a';
delete from public.recipe_ingredients where recipe_id = '58e8054e-9c02-450d-8969-42cad9bdf00a';
delete from public.recipe_steps where recipe_id = '58e8054e-9c02-450d-8969-42cad9bdf00a';
delete from public.plating_steps where recipe_id = '58e8054e-9c02-450d-8969-42cad9bdf00a';
insert into public.recipe_categories (recipe_id, category_id) values ('58e8054e-9c02-450d-8969-42cad9bdf00a', 'vegetarisch'), ('58e8054e-9c02-450d-8969-42cad9bdf00a', 'soep');
insert into public.ingredients (name) values ('rijpe trostomaten'), ('komkommer'), ('rode paprika'), ('sjalot'), ('knoflook'), ('wit brood'), ('extra vierge olijfolie'), ('sherryazijn'), ('zeezout en piment d''Espelette'), ('basilicum'), ('milde olijfolie'), ('eetbare bloemetjes') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '58e8054e-9c02-450d-8969-42cad9bdf00a'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Gazpacho'::text, 600::numeric, 'g'::text, 'rijpe trostomaten'::text, null::text),
  (2, 'Gazpacho'::text, 0.5::numeric, 'stuks'::text, 'komkommer'::text, null::text),
  (3, 'Gazpacho'::text, 1::numeric, 'stuks'::text, 'rode paprika'::text, null::text),
  (4, 'Gazpacho'::text, 0.5::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (5, 'Gazpacho'::text, 1::numeric, 'teentjes'::text, 'knoflook'::text, null::text),
  (6, 'Gazpacho'::text, 30::numeric, 'g'::text, 'wit brood'::text, 'zonder korst'::text),
  (7, 'Gazpacho'::text, 3::numeric, 'el'::text, 'extra vierge olijfolie'::text, null::text),
  (8, 'Gazpacho'::text, 1::numeric, 'el'::text, 'sherryazijn'::text, null::text),
  (9, 'Gazpacho'::text, null::numeric, 'naar smaak'::text, 'zeezout en piment d''Espelette'::text, null::text),
  (10, 'Afwerking'::text, 0.25::numeric, 'stuks'::text, 'komkommer'::text, 'in brunoise'::text),
  (11, 'Afwerking'::text, 20::numeric, 'g'::text, 'basilicum'::text, null::text),
  (12, 'Afwerking'::text, 60::numeric, 'ml'::text, 'milde olijfolie'::text, null::text),
  (13, 'Afwerking'::text, 6::numeric, 'stuks'::text, 'eetbare bloemetjes'::text, 'optioneel'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 1, 'Snijd de groenten grof', 'Snijd tomaten, komkommer, paprika en sjalot grof. Verwijder de zaadlijsten van de paprika — die maken de soep bitter.', 'snijden', '{"key":"chop","item":"tomato"}'::jsonb, null, null),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 2, 'Laat marineren', 'Meng de groenten met knoflook, brood, olie, azijn en zout. Laat 30 minuten trekken zodat het zout vocht en smaak uit de tomaten haalt.', 'kruiden', '{"key":"season","item":"tomato"}'::jsonb, 1800, null),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 3, 'Mix zijdezacht', 'Mix alles minstens 2 minuten op de hoogste stand tot een gladde, lichtroze emulsie.', 'saus', '{"key":"blend","tone":"tomato"}'::jsonb, null, 'Mix een ijsblokje mee: de soep blijft fris en de kleur helder.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 4, 'Zeef en koel', 'Passeer de soep door een fijne zeef, breng op smaak en laat minstens 1 uur koud worden.', 'rusten', '{"key":"chill"}'::jsonb, 3600, null),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 5, 'Maak basilicumolie', 'Mix basilicum met olie, laat 10 minuten staan en zeef door een koffiefilter voor een heldere, groene olie.', 'saus', '{"key":"blend","tone":"herb"}'::jsonb, null, null),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 6, 'Snijd de brunoise', 'Snijd komkommer zonder zaadlijsten in blokjes van 3 mm. Gelijke blokjes zien er in een klein glas direct professioneel uit.', 'snijden', '{"key":"chop","item":"cucumber"}'::jsonb, null, null),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 7, 'Dresseer de glaasjes', 'Schenk de gazpacho in gekoelde glaasjes en werk af met brunoise, basilicumolie en een bloemetje.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 0, 'Begin met een schoon bord', 'Koel de glaasjes of kommetjes 15 minuten in de vriezer — condens op het glas oogt direct fris.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 1, 'Plaats de saus', 'Schenk de gazpacho via een maatbeker in, zodat de rand van het glas schoon blijft.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 2, 'Positioneer het hoofdonderdeel', 'Leg een klein hoopje komkommerbrunoise precies in het midden van het oppervlak.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 3, 'Voeg garnituur toe', 'Druppel met een knijpfles drie stippen basilicumolie rond de brunoise.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 4, 'Werk af met kruiden', 'Werk af met een basilicumtopje, een eetbaar bloemetje en een draai peper.'),
  ('58e8054e-9c02-450d-8969-42cad9bdf00a', 5, 'Maak de rand van het bord schoon', 'Controleer elk glas: druppels op de rand veeg je weg met keukenpapier.');

-- Gougères met comté
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 'gougeres-met-comte', 'platform', null, true, 'Gougères met comté', 'Luchtige kaassoesjes uit Bourgondië', 'Warme, knapperige soesjes van soezendeeg met oude comté en een vleugje nootmuskaat — het klassieke aperitiefhapje van Bourgondië.', 'Soezendeeg is de basis van eclairs, profiteroles en gougères. Wie deze techniek beheerst, beheerst een van de fundamenten van de Franse keuken — en heeft altijd iets feestelijks bij het aperitief.', 'amuse', 'gemiddeld', 8, 20, 30, 0, '{"plate":"slate","layout":"scatter","sauce":{"style":"dots","color":"butter"},"main":{"kind":"puffs","color":"choux","count":6},"garnish":[{"kind":"crumble","color":"golden"}],"herbs":["thyme","pepper","flakes"]}'::jsonb, '#E9E3D6', array['soezendeeg', 'aperitief', 'bakken', 'kaas']::text[], array['Steelpan', 'Houten spatel', 'Spuitzak met ronde spuitmond (10 mm)', 'Bakplaat met bakpapier', 'Oven']::text[], 'Gougères zijn het visitekaartje van de keuken: warm, luchtig en onweerstaanbaar.', 'Gespoten, ongebakken gougères kun je invriezen. Bak ze direct uit de vriezer, met 3 minuten extra oventijd.', 'Een crémant du Jura of een glas vin jaune.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '711e81cf-e973-4f07-a2a7-7bfe281c8f31';
delete from public.recipe_ingredients where recipe_id = '711e81cf-e973-4f07-a2a7-7bfe281c8f31';
delete from public.recipe_steps where recipe_id = '711e81cf-e973-4f07-a2a7-7bfe281c8f31';
delete from public.plating_steps where recipe_id = '711e81cf-e973-4f07-a2a7-7bfe281c8f31';
insert into public.recipe_categories (recipe_id, category_id) values ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 'vegetarisch'), ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 'technieken');
insert into public.ingredients (name) values ('water'), ('volle melk'), ('boter'), ('zout'), ('bloem'), ('eieren'), ('oude comté'), ('nootmuskaat'), ('cayennepeper'), ('eidooier'), ('tijm') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '711e81cf-e973-4f07-a2a7-7bfe281c8f31'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Soezendeeg'::text, 125::numeric, 'ml'::text, 'water'::text, null::text),
  (2, 'Soezendeeg'::text, 125::numeric, 'ml'::text, 'volle melk'::text, null::text),
  (3, 'Soezendeeg'::text, 100::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Soezendeeg'::text, 1::numeric, 'tl'::text, 'zout'::text, null::text),
  (5, 'Soezendeeg'::text, 150::numeric, 'g'::text, 'bloem'::text, 'gezeefd'::text),
  (6, 'Soezendeeg'::text, 4::numeric, 'stuks'::text, 'eieren'::text, 'op kamertemperatuur'::text),
  (7, 'Kaas en afwerking'::text, 120::numeric, 'g'::text, 'oude comté'::text, 'fijn geraspt'::text),
  (8, 'Kaas en afwerking'::text, 1::numeric, 'snuf'::text, 'nootmuskaat'::text, null::text),
  (9, 'Kaas en afwerking'::text, 1::numeric, 'snuf'::text, 'cayennepeper'::text, null::text),
  (10, 'Kaas en afwerking'::text, 1::numeric, 'stuks'::text, 'eidooier'::text, 'om te bestrijken'::text),
  (11, 'Kaas en afwerking'::text, 2::numeric, 'takjes'::text, 'tijm'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 1, 'Weeg alles nauwkeurig af', 'Soezendeeg is scheikunde: weeg bloem en vloeistof op de gram af en klop de eieren los in een maatbeker.', 'mise-en-place', '{"key":"prep","item":"dough"}'::jsonb, null, null),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 2, 'Rasp de comté', 'Rasp de comté fijn. Houd een handje apart om over de gougères te strooien.', 'snijden', '{"key":"grate","item":"parmesan"}'::jsonb, null, null),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 3, 'Maak de panade', 'Breng water, melk, boter en zout aan de kook. Voeg in één keer de bloem toe en roer krachtig tot een bal deeg die loslaat van de pan. Droog het deeg nog 1 minuut op laag vuur.', 'garen', '{"key":"simmer","tone":"butter"}'::jsonb, 60, 'Een dun vliesje op de bodem van de pan betekent dat het deeg droog genoeg is.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 4, 'Klop de eieren erdoor', 'Laat het deeg 2 minuten afkoelen. Klop de eieren er één voor één door tot het deeg glanst en in een V-vorm van de spatel valt. Spatel kaas, nootmuskaat en cayenne erdoor.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, null),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 5, 'Spuit de gougères', 'Spuit bolletjes van 3 cm op de bakplaat. Druk puntjes plat met een natte vinger, bestrijk met eidooier en strooi er kaas over.', 'dresseren', '{"key":"pipe"}'::jsonb, null, null),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 6, 'Bak goudbruin', 'Bak 10 minuten op 200 °C en daarna 15 minuten op 170 °C. Open de oven niet tijdens het bakken, anders zakken ze in.', 'garen', '{"key":"roast","item":"dough"}'::jsonb, 1500, 'Prik ze na het bakken aan de onderkant in zodat de stoom ontsnapt: zo blijven ze krokant.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 7, 'Serveer warm', 'Leg de gougères op een donker bord of plank en serveer ze binnen tien minuten.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 0, 'Begin met een schoon bord', 'Kies een donker leisteenbord of houten plank — het goudbruin van de gougères komt erop tot leven.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 1, 'Plaats de saus', 'Zet een paar stippen comtécrème als ankerpunten, zodat de gougères niet over het bord rollen.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 2, 'Positioneer het hoofdonderdeel', 'Verdeel de gougères in een los, asymmetrisch patroon, nooit in rijen.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 3, 'Voeg garnituur toe', 'Strooi wat extra geraspte kaas tussen de gougères.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 4, 'Werk af met kruiden', 'Werk af met tijmblaadjes, versgemalen peper en een paar vlokjes zout.'),
  ('711e81cf-e973-4f07-a2a7-7bfe281c8f31', 5, 'Maak de rand van het bord schoon', 'Serveer direct: gougères zijn op hun best binnen tien minuten uit de oven.');

-- Oester met appel-mignonette
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 'oester-met-appel-mignonette', 'platform', null, true, 'Oester met appel-mignonette', 'Zilt, fris en ijskoud', 'Levende creuses, vers geopend en afgewerkt met een fijne mignonette van sjalot, groene appel en dragonazijn.', 'Een oester openen is een vaardigheid die je één keer goed leert en nooit meer vergeet. De mignonette met groene appel voegt frisheid toe zonder de zilte smaak van de oester te overstemmen.', 'amuse', 'gemiddeld', 4, 25, 0, 15, '{"plate":"slate","layout":"trio","sauce":{"style":"dots","color":"apple"},"main":{"kind":"shells","color":"oyster","accent":"shell","count":3},"garnish":[{"kind":"cubes","color":"apple"},{"kind":"onionRings"}],"herbs":["dill","pepper"]}'::jsonb, '#DCE3E2', array['rauw', 'zeevruchten', 'fris', 'oesters openen']::text[], array['Oestermes', 'Theedoek', 'Bord met grof zeezout of zeewier', 'Klein koksmes']::text[], 'Bij rauwe zeevruchten is minder meer: de oester zelf is het sieraad.', 'Laat het vocht in de schelp zitten: dat is de smaak van de zee. Proef de eerste oester zonder mignonette.', 'Een strakke Muscadet sur lie of een Chablis.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '37456abd-780d-4d6e-97b4-31d4a77e4dbd';
delete from public.recipe_ingredients where recipe_id = '37456abd-780d-4d6e-97b4-31d4a77e4dbd';
delete from public.recipe_steps where recipe_id = '37456abd-780d-4d6e-97b4-31d4a77e4dbd';
delete from public.plating_steps where recipe_id = '37456abd-780d-4d6e-97b4-31d4a77e4dbd';
insert into public.recipe_categories (recipe_id, category_id) values ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 'vis');
insert into public.ingredients (name) values ('creuses'), ('grof zeezout of zeewier'), ('sjalot'), ('granny smith'), ('dragonazijn'), ('appelcider'), ('grof gemalen zwarte peper'), ('dille'), ('citroen') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '37456abd-780d-4d6e-97b4-31d4a77e4dbd'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Oesters'::text, 12::numeric, 'stuks'::text, 'creuses'::text, 'nr. 2, levend en goed gesloten'::text),
  (2, 'Oesters'::text, 300::numeric, 'g'::text, 'grof zeezout of zeewier'::text, 'om te serveren'::text),
  (3, 'Appel-mignonette'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (4, 'Appel-mignonette'::text, 0.5::numeric, 'stuks'::text, 'granny smith'::text, null::text),
  (5, 'Appel-mignonette'::text, 3::numeric, 'el'::text, 'dragonazijn'::text, null::text),
  (6, 'Appel-mignonette'::text, 1::numeric, 'el'::text, 'appelcider'::text, null::text),
  (7, 'Appel-mignonette'::text, 0.5::numeric, 'tl'::text, 'grof gemalen zwarte peper'::text, null::text),
  (8, 'Afwerking'::text, 4::numeric, 'takjes'::text, 'dille'::text, null::text),
  (9, 'Afwerking'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, 'zeste'::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 1, 'Controleer de oesters', 'Bewaar de oesters bol naar beneden onder een vochtige doek. Een oester die open staat en niet sluit bij een tik, gooi je weg.', 'mise-en-place', '{"key":"prep","item":"mussels"}'::jsonb, null, null),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 2, 'Snijd de mignonette', 'Snijd sjalot en appel in een brunoise van 2 mm. Hoe fijner, hoe eleganter de mignonette op de oester ligt.', 'snijden', '{"key":"chop","item":"shallot"}'::jsonb, null, null),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 3, 'Laat de mignonette trekken', 'Meng sjalot, appel, azijn, cider en peper en laat 15 minuten trekken in de koelkast.', 'saus', '{"key":"whisk","tone":"wine"}'::jsonb, 900, null),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 4, 'Open de oesters', 'Houd de oester met een theedoek plat vast, bolle kant naar beneden. Steek het mes bij het scharnier naar binnen, draai en snijd de sluitspier langs de bovenschelp los. Snijd de oester ook los van de onderschelp.', 'mise-en-place', '{"key":"prep","item":"mussels"}'::jsonb, null, 'Werk altijd van je hand af en draag bij twijfel een snijbestendige handschoen.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 5, 'Houd alles ijskoud', 'Zet de geopende oesters direct op een bed van ijs of grof zout in de koelkast en serveer binnen 20 minuten.', 'rusten', '{"key":"chill"}'::jsonb, null, null),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 6, 'Dresseer', 'Schik de oesters op grof zout, lepel er een klein beetje mignonette op en werk af met dille.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 0, 'Begin met een schoon bord', 'Bedek een koud bord met grof zeezout of zeewier; zo staan de schelpen stevig en recht.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 1, 'Plaats de saus', 'Zet een paar druppels mignonette op het zout als kleuraccent tussen de schelpen.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 2, 'Positioneer het hoofdonderdeel', 'Plaats drie oesters in een lichte boog, met het scharnier naar buiten.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 3, 'Voeg garnituur toe', 'Schep een klein lepeltje appel-mignonette op elke oester — de oester moet zichtbaar blijven.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 4, 'Werk af met kruiden', 'Werk af met een piepklein toefje dille en wat citroenzeste.'),
  ('37456abd-780d-4d6e-97b4-31d4a77e4dbd', 5, 'Maak de rand van het bord schoon', 'Veeg zoutkorrels van de rand en serveer ijskoud.');

-- Bietentartaar met geitenkaas
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('135e660d-6eb4-4e66-aae2-baa00c01193b', 'bietentartaar-met-geitenkaas', 'platform', null, true, 'Bietentartaar met geitenkaas', 'Geroosterde biet, hazelnoot en cress', 'Een strakke toren van geroosterde rode biet met sjalot en kappertjes, gekroond met luchtige geitenkaascrème en geroosterde hazelnoot.', 'Deze vegetarische tartaar leert je werken met een steekring: de basis voor strakke, hoge presentaties. Roosteren in plaats van koken geeft de biet een diepe, bijna vlezige smaak.', 'amuse', 'makkelijk', 4, 25, 60, 0, '{"plate":"porcelain","layout":"center","sauce":{"style":"dots","color":"goatCheese"},"main":{"kind":"tower","color":"beet","accent":"goatCheese"},"garnish":[{"kind":"nuts"},{"kind":"leaves","color":"green"}],"herbs":["micro","flakes"]}'::jsonb, '#EEDFE4', array['steekring', 'roosteren', 'kleur', 'vegetarisch']::text[], array['Steekring van 6 cm', 'Oven', 'Aluminiumfolie', 'Knijpfles', 'Pincet']::text[], 'Een ring geeft een strakke vorm; de garnituur eromheen zorgt voor beweging.', 'Draag handschoenen bij het pellen en snijd op een kunststof plank: bietensap kleurt hout blijvend.', 'Een Sancerre rosé of een frisse Loire-sauvignon.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '135e660d-6eb4-4e66-aae2-baa00c01193b';
delete from public.recipe_ingredients where recipe_id = '135e660d-6eb4-4e66-aae2-baa00c01193b';
delete from public.recipe_steps where recipe_id = '135e660d-6eb4-4e66-aae2-baa00c01193b';
delete from public.plating_steps where recipe_id = '135e660d-6eb4-4e66-aae2-baa00c01193b';
insert into public.recipe_categories (recipe_id, category_id) values ('135e660d-6eb4-4e66-aae2-baa00c01193b', 'vegetarisch'), ('135e660d-6eb4-4e66-aae2-baa00c01193b', 'plating');
insert into public.ingredients (name) values ('rode bieten'), ('kleine sjalot'), ('kappertjes'), ('hazelnootolie'), ('frambozenazijn'), ('zeezout en peper'), ('zachte geitenkaas'), ('room'), ('citroen'), ('hazelnoten'), ('bietenscheuten of cress'), ('vlokzout') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '135e660d-6eb4-4e66-aae2-baa00c01193b'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Bietentartaar'::text, 2::numeric, 'stuks'::text, 'rode bieten'::text, 'rauw, ± 300 g'::text),
  (2, 'Bietentartaar'::text, 1::numeric, 'stuks'::text, 'kleine sjalot'::text, null::text),
  (3, 'Bietentartaar'::text, 1::numeric, 'tl'::text, 'kappertjes'::text, 'fijngehakt'::text),
  (4, 'Bietentartaar'::text, 1::numeric, 'el'::text, 'hazelnootolie'::text, null::text),
  (5, 'Bietentartaar'::text, 1::numeric, 'tl'::text, 'frambozenazijn'::text, null::text),
  (6, 'Bietentartaar'::text, null::numeric, 'naar smaak'::text, 'zeezout en peper'::text, null::text),
  (7, 'Geitenkaascrème'::text, 100::numeric, 'g'::text, 'zachte geitenkaas'::text, null::text),
  (8, 'Geitenkaascrème'::text, 40::numeric, 'ml'::text, 'room'::text, null::text),
  (9, 'Geitenkaascrème'::text, 0.5::numeric, 'stuks'::text, 'citroen'::text, 'rasp'::text),
  (10, 'Afwerking'::text, 20::numeric, 'g'::text, 'hazelnoten'::text, 'geroosterd'::text),
  (11, 'Afwerking'::text, 1::numeric, 'handje'::text, 'bietenscheuten of cress'::text, null::text),
  (12, 'Afwerking'::text, null::numeric, 'naar smaak'::text, 'vlokzout'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 1, 'Rooster de bieten', 'Pak de bieten in folie met een scheut olie en zout en rooster ze 60 minuten op 190 °C tot een mes er zonder weerstand in glijdt.', 'garen', '{"key":"roast","item":"vegetables"}'::jsonb, 3600, null),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 2, 'Pel en snijd', 'Pel de lauwe bieten met handschoenen en snijd ze in blokjes van 4 mm. Snijd de sjalot zo fijn mogelijk.', 'snijden', '{"key":"chop","item":"vegetables"}'::jsonb, null, null),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 3, 'Breng op smaak', 'Meng biet, sjalot, kappertjes, hazelnootolie en azijn. Proef en breng op smaak met zout en peper.', 'kruiden', '{"key":"season","item":"vegetables"}'::jsonb, null, null),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 4, 'Klop de geitenkaascrème', 'Klop geitenkaas, room en citroenrasp glad en luchtig. Doe de crème in een knijpfles.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, null),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 5, 'Hak de hazelnoten', 'Hak de geroosterde hazelnoten grof: je wilt knapperige stukjes, geen poeder.', 'snijden', '{"key":"chop","item":"chocolate"}'::jsonb, null, null),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 6, 'Vorm de tartaar', 'Zet de ring op het bord, vul met tartaar en druk licht aan. Trek de ring recht omhoog en werk af.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 0, 'Begin met een schoon bord', 'Kies een wit bord: het diepe paars van de biet contrasteert maximaal met porselein.'),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 1, 'Plaats de saus', 'Zet met de knijpfles een kring van geitenkaasstippen in verschillende maten rond het midden.'),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 2, 'Positioneer het hoofdonderdeel', 'Plaats de ring in het midden, vul met tartaar, druk aan en trek de ring in één beweging omhoog.'),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 3, 'Voeg garnituur toe', 'Leg een stip geitenkaascrème op de toren en strooi hazelnoot rondom.'),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 4, 'Werk af met kruiden', 'Zet met een pincet een paar bietenscheuten rechtop op de toren voor hoogte.'),
  ('135e660d-6eb4-4e66-aae2-baa00c01193b', 5, 'Maak de rand van het bord schoon', 'Veeg paarse vlekjes direct weg — bietensap op porselein valt meteen op.');

-- Rundertartaar met eidooiercrème
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 'rundertartaar-met-eidooiercreme', 'platform', null, true, 'Rundertartaar met eidooiercrème', 'Met de hand gesneden ossenhaas', 'Drie strakke quenelles van met de hand gesneden ossenhaas, met een fluweelzachte eidooiercrème, kappertjes en krokante aardappelchips.', 'Tartaar is een oefening in messcherpte en discipline. Met de hand snijden in plaats van malen bewaart de structuur van het vlees en maakt het verschil tussen gewoon en uitzonderlijk.', 'amuse', 'gemiddeld', 4, 35, 10, 0, '{"plate":"slate","layout":"trio","sauce":{"style":"dots","color":"hollandaise"},"main":{"kind":"quenelle","color":"beef","count":3},"garnish":[{"kind":"capers"},{"kind":"crisps"}],"herbs":["chives","cress","flakes"]}'::jsonb, '#E8DEDA', array['rauw vlees', 'messentechniek', 'quenelle', 'klassiek']::text[], array['Scherp koksmes', 'Koude kom op ijs', 'Twee eetlepels', 'Knijpfles', 'Mandoline']::text[], 'Drie kleine quenelles in een ritmische lijn: precisie is hier de hele presentatie.', 'Kruid tartaar pas vlak voor het serveren: zout en zuur verkleuren het vlees binnen een kwartier.', 'Een lichte, gekoelde Beaujolais-Villages.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = 'dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1';
delete from public.recipe_ingredients where recipe_id = 'dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1';
delete from public.recipe_steps where recipe_id = 'dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1';
delete from public.plating_steps where recipe_id = 'dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1';
insert into public.recipe_categories (recipe_id, category_id) values ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 'vlees'), ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 'technieken');
insert into public.ingredients (name) values ('ossenhaas'), ('sjalot'), ('kappertjes'), ('augurken'), ('Dijonmosterd'), ('olijfolie'), ('worcestershiresaus'), ('zeezout en zwarte peper'), ('eidooiers'), ('neutrale olie'), ('citroensap'), ('kleine vastkokende aardappel'), ('bieslook'), ('mosterdcress') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select 'dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Tartaar'::text, 200::numeric, 'g'::text, 'ossenhaas'::text, 'zeer vers, van de slager'::text),
  (2, 'Tartaar'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Tartaar'::text, 1::numeric, 'el'::text, 'kappertjes'::text, null::text),
  (4, 'Tartaar'::text, 2::numeric, 'stuks'::text, 'augurken'::text, null::text),
  (5, 'Tartaar'::text, 1::numeric, 'tl'::text, 'Dijonmosterd'::text, null::text),
  (6, 'Tartaar'::text, 1::numeric, 'el'::text, 'olijfolie'::text, null::text),
  (7, 'Tartaar'::text, 3::numeric, 'druppels'::text, 'worcestershiresaus'::text, null::text),
  (8, 'Tartaar'::text, null::numeric, 'naar smaak'::text, 'zeezout en zwarte peper'::text, null::text),
  (9, 'Eidooiercrème'::text, 2::numeric, 'stuks'::text, 'eidooiers'::text, 'zeer vers'::text),
  (10, 'Eidooiercrème'::text, 60::numeric, 'ml'::text, 'neutrale olie'::text, null::text),
  (11, 'Eidooiercrème'::text, 1::numeric, 'tl'::text, 'citroensap'::text, null::text),
  (12, 'Afwerking'::text, 1::numeric, 'stuks'::text, 'kleine vastkokende aardappel'::text, 'voor chips'::text),
  (13, 'Afwerking'::text, 0.5::numeric, 'bosje'::text, 'bieslook'::text, null::text),
  (14, 'Afwerking'::text, 1::numeric, 'handje'::text, 'mosterdcress'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 1, 'Koel alles voor', 'Zet vlees, kom en mes 15 minuten in de koelkast. Rauw vlees moet tijdens het snijden koud blijven.', 'rusten', '{"key":"chill"}'::jsonb, 900, null),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 2, 'Snijd het vlees met de hand', 'Snijd de ossenhaas eerst in dunne plakken, dan in reepjes en ten slotte in blokjes van 3 mm. Nooit malen: snijden bewaart de structuur.', 'snijden', '{"key":"slice","item":"steak"}'::jsonb, null, 'Een scherp mes kneust het vlees niet; een bot mes maakt er pulp van.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 3, 'Snijd de smaakmakers', 'Snijd sjalot, kappertjes en augurk zo fijn mogelijk.', 'snijden', '{"key":"chop","item":"shallot"}'::jsonb, null, null),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 4, 'Breng de tartaar op smaak', 'Meng het vlees in een koude kom met sjalot, kappertjes, augurk, mosterd, olie en worcestershiresaus. Breng op smaak met zout en peper.', 'kruiden', '{"key":"season","item":"steak"}'::jsonb, null, null),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 5, 'Monteer de eidooiercrème', 'Klop de dooiers met citroensap en voeg de olie druppelsgewijs toe tot een glanzende, dikke crème. Doe in een knijpfles.', 'saus', '{"key":"whisk","tone":"butter"}'::jsonb, null, null),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 6, 'Bak aardappelchips', 'Schaaf de aardappel flinterdun, spoel, dep droog en bak in hete olie goudbruin. Laat uitlekken op keukenpapier.', 'bakken', '{"key":"sear","item":"potato"}'::jsonb, 180, null),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 7, 'Draai quenelles en dresseer', 'Draai met twee lepels drie quenelles en werk af met eidooiercrème, kappertjes, chips en bieslook.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 0, 'Begin met een schoon bord', 'Koel een donker bord voor, zodat de tartaar koud en strak blijft.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 1, 'Plaats de saus', 'Zet drie stippen eidooiercrème op een licht gebogen lijn.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 2, 'Positioneer het hoofdonderdeel', 'Draai met twee lepels drie strakke quenelles en leg ze telkens naast een stip.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 3, 'Voeg garnituur toe', 'Leg kappertjes en een aardappelchip schuin tegen elke quenelle voor crunch en hoogte.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 4, 'Werk af met kruiden', 'Werk af met bieslook, mosterdcress en een vlokje zout op het vlees.'),
  ('dee12a1b-b82c-4a07-ae5b-60a0bc8b74b1', 5, 'Maak de rand van het bord schoon', 'Veeg de rand schoon en serveer onmiddellijk.');

-- Bloemkoolcappuccino met kerrieschuim
insert into public.recipes (id, slug, source, author_id, is_public, title, subtitle, description, story, course, difficulty, servings, prep_minutes, cook_minutes, rest_minutes, dish, tone, tags, equipment, plating_intro, chef_tip, pairing)
values ('61f903a8-7192-4d37-b519-aecb3688a3ac', 'bloemkoolcappuccino-met-kerrieschuim', 'platform', null, true, 'Bloemkoolcappuccino met kerrieschuim', 'Velouté met een kraag van schuim', 'Een fluweelzachte bloemkoolvelouté in een kopje, met een luchtige kraag van kerrieschuim en geroosterde hazelnoot.', 'Een knipoog naar de koffiebar en tegelijk een les in textuur: een velouté die door minutenlang mixen zijdezacht wordt, en een schuim dat stabiel blijft dankzij de juiste temperatuur.', 'amuse', 'gemiddeld', 6, 15, 30, 0, '{"plate":"bowl","layout":"bowl","sauce":{"style":"fill","color":"cauli"},"main":{"kind":"swirl","color":"curry"},"garnish":[{"kind":"nuts"},{"kind":"dots","color":"curry"}],"herbs":["chervil","pepper"]}'::jsonb, '#EEE7D8', array['schuim', 'velouté', 'staafmixer', 'amuse']::text[], array['Soeppan', 'Blender', 'Fijne zeef', 'Staafmixer', 'Espresso- of cappuccinokopjes']::text[], 'Een velouté in een kopje met een kraag van schuim: verrassend, maar met klassieke techniek.', 'Mix een velouté minstens 2 minuten: pas dan breekt de celstructuur en wordt hij echt fluweelzacht.', 'Een Elzasser Pinot Blanc.')
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, subtitle = excluded.subtitle, description = excluded.description, story = excluded.story,
  course = excluded.course, difficulty = excluded.difficulty, servings = excluded.servings, prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes, rest_minutes = excluded.rest_minutes, dish = excluded.dish, tone = excluded.tone, tags = excluded.tags,
  equipment = excluded.equipment, plating_intro = excluded.plating_intro, chef_tip = excluded.chef_tip, pairing = excluded.pairing;
delete from public.recipe_categories where recipe_id = '61f903a8-7192-4d37-b519-aecb3688a3ac';
delete from public.recipe_ingredients where recipe_id = '61f903a8-7192-4d37-b519-aecb3688a3ac';
delete from public.recipe_steps where recipe_id = '61f903a8-7192-4d37-b519-aecb3688a3ac';
delete from public.plating_steps where recipe_id = '61f903a8-7192-4d37-b519-aecb3688a3ac';
insert into public.recipe_categories (recipe_id, category_id) values ('61f903a8-7192-4d37-b519-aecb3688a3ac', 'vegetarisch'), ('61f903a8-7192-4d37-b519-aecb3688a3ac', 'soep'), ('61f903a8-7192-4d37-b519-aecb3688a3ac', 'technieken');
insert into public.ingredients (name) values ('bloemkool'), ('sjalot'), ('boter'), ('groentebouillon'), ('room'), ('zout en witte peper'), ('halfvolle melk'), ('milde kerriepoeder'), ('sojalecithine'), ('hazelnoten'), ('kervel') on conflict do nothing;
insert into public.recipe_ingredients (recipe_id, ingredient_id, position, group_name, quantity, unit, note)
select '61f903a8-7192-4d37-b519-aecb3688a3ac'::uuid, i.id, v.position, v.group_name, v.quantity, v.unit, v.note
from (values
  (1, 'Velouté'::text, 400::numeric, 'g'::text, 'bloemkool'::text, 'in roosjes'::text),
  (2, 'Velouté'::text, 1::numeric, 'stuks'::text, 'sjalot'::text, null::text),
  (3, 'Velouté'::text, 20::numeric, 'g'::text, 'boter'::text, null::text),
  (4, 'Velouté'::text, 400::numeric, 'ml'::text, 'groentebouillon'::text, null::text),
  (5, 'Velouté'::text, 100::numeric, 'ml'::text, 'room'::text, null::text),
  (6, 'Velouté'::text, null::numeric, 'naar smaak'::text, 'zout en witte peper'::text, null::text),
  (7, 'Kerrieschuim'::text, 200::numeric, 'ml'::text, 'halfvolle melk'::text, null::text),
  (8, 'Kerrieschuim'::text, 1::numeric, 'tl'::text, 'milde kerriepoeder'::text, null::text),
  (9, 'Kerrieschuim'::text, 0.5::numeric, 'tl'::text, 'sojalecithine'::text, 'of 1 el koude boter'::text),
  (10, 'Afwerking'::text, 15::numeric, 'g'::text, 'hazelnoten'::text, 'geroosterd en gehakt'::text),
  (11, 'Afwerking'::text, 4::numeric, 'takjes'::text, 'kervel'::text, null::text)
) as v(position, group_name, quantity, unit, name, note)
join public.ingredients i on lower(i.name) = lower(v.name);
insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, tip) values
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 1, 'Snijd de bloemkool', 'Snijd de bloemkool in kleine roosjes en de sjalot in ringen.', 'snijden', '{"key":"chop","item":"cauliflower"}'::jsonb, null, null),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 2, 'Stoof zonder kleur', 'Stoof sjalot en bloemkool 5 minuten in boter zonder te kleuren. Voeg de bouillon toe en laat 15 minuten zacht garen.', 'garen', '{"key":"simmer","tone":"cream","item":"cauliflower"}'::jsonb, 1200, null),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 3, 'Mix tot velouté', 'Mix met de room minstens 2 minuten tot een zijdezachte velouté en passeer door een fijne zeef.', 'saus', '{"key":"blend","tone":"cream","item":"cauliflower"}'::jsonb, null, null),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 4, 'Trek de kerriemelk', 'Verwarm melk met kerrie tot net onder de kook, laat 5 minuten trekken en roer de lecithine erdoor.', 'saus', '{"key":"simmer","tone":"saffron"}'::jsonb, 300, null),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 5, 'Klop tot schuim', 'Houd de staafmixer schuin net onder het oppervlak van de kerriemelk, zodat er lucht in komt. Laat het schuim 30 seconden stabiliseren.', 'saus', '{"key":"whisk","tone":"cream"}'::jsonb, null, 'Schuim werkt het best tussen 60 en 65 °C: warmer valt het in, kouder wordt het niet luchtig.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 6, 'Serveer als cappuccino', 'Vul warme kopjes met velouté, schep er schuim op en werk af met hazelnoot en kervel.', 'dresseren', '{"key":"plate"}'::jsonb, null, null);
insert into public.plating_steps (recipe_id, stage, title, body) values
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 0, 'Begin met een schoon bord', 'Warm de kopjes voor met heet water, zodat de velouté niet afkoelt.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 1, 'Plaats de saus', 'Vul de kopjes voor twee derde met hete bloemkoolvelouté.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 2, 'Positioneer het hoofdonderdeel', 'Schep met een lepel een royale kraag kerrieschuim op de velouté.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 3, 'Voeg garnituur toe', 'Strooi gehakte hazelnoot op één kant van het schuim en zet een stipje kerrieolie.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 4, 'Werk af met kruiden', 'Werk af met een blaadje kervel en een draai witte peper.'),
  ('61f903a8-7192-4d37-b519-aecb3688a3ac', 5, 'Maak de rand van het bord schoon', 'Veeg schuimresten van de rand van het kopje — een schone rand maakt het af.');
