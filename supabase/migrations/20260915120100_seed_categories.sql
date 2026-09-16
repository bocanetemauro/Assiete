-- Gangen en categorieën (gegenereerd door scripts/generate-seed.mjs)
insert into public.categories (id, label, kind, sort_order) values
  ('amuse', 'Amuse', 'course', 0),
  ('voorgerecht', 'Voorgerecht', 'course', 1),
  ('hoofdgerecht', 'Hoofdgerecht', 'course', 2),
  ('nagerecht', 'Dessert', 'course', 3),
  ('vlees', 'Vlees', 'category', 0),
  ('vis', 'Vis & zeevruchten', 'category', 1),
  ('vegetarisch', 'Vegetarisch', 'category', 2),
  ('pasta', 'Pasta & rijst', 'category', 3),
  ('soep', 'Soep', 'category', 4),
  ('sauzen', 'Sauzen', 'category', 5),
  ('technieken', 'Technieken', 'category', 6),
  ('plating', 'Plating', 'category', 7)
on conflict (id) do update set label = excluded.label, kind = excluded.kind, sort_order = excluded.sort_order;
