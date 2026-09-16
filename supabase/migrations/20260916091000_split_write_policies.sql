-- =====================================================================
--  Schrijfpolicies splitsen + ontbrekende index
-- ---------------------------------------------------------------------
--  De `for all`-policies op de onderdelen van een recept dekten ook SELECT.
--  Elke leesquery moest daardoor twee policies evalueren. Lezen loopt nu
--  uitsluitend via `*_select_visible`; hieronder staan alleen schrijfacties.
-- =====================================================================

drop policy if exists "recipe_categories_write_own" on public.recipe_categories;
drop policy if exists "recipe_ingredients_write_own" on public.recipe_ingredients;
drop policy if exists "recipe_steps_write_own" on public.recipe_steps;
drop policy if exists "plating_steps_write_own" on public.plating_steps;

create policy "recipe_categories_insert_own" on public.recipe_categories
for insert to authenticated
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_categories_delete_own" on public.recipe_categories
for delete to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_ingredients_insert_own" on public.recipe_ingredients
for insert to authenticated
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_ingredients_update_own" on public.recipe_ingredients
for update to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_ingredients_delete_own" on public.recipe_ingredients
for delete to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_steps_insert_own" on public.recipe_steps
for insert to authenticated
with check (
  exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid()))
  and (image_path is null or starts_with(image_path, (select auth.uid())::text || '/'))
);

create policy "recipe_steps_update_own" on public.recipe_steps
for update to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (
  exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid()))
  and (image_path is null or starts_with(image_path, (select auth.uid())::text || '/'))
);

create policy "recipe_steps_delete_own" on public.recipe_steps
for delete to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "plating_steps_insert_own" on public.plating_steps
for insert to authenticated
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "plating_steps_update_own" on public.plating_steps
for update to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "plating_steps_delete_own" on public.plating_steps
for delete to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

-- Foreign key naar categories had nog geen dekkende index.
create index if not exists recipes_course_idx on public.recipes (course);
