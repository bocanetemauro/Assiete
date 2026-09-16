-- =====================================================================
--  Rechten aanscherpen (defence in depth)
-- ---------------------------------------------------------------------
--  Supabase geeft nieuwe tabellen in `public` standaard álle rechten aan
--  `anon` en `authenticated`. Row Level Security is dan de enige rem. Hier
--  trekken we alles in en geven precies terug wat nodig is, zodat één
--  verkeerd geschreven policy nooit genoeg is om data te wijzigen.
-- =====================================================================

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

grant usage on schema public to anon, authenticated;

-- Lezen mag iedereen, ook zonder account; RLS bepaalt wélke rijen.
grant select on public.categories, public.recipes, public.recipe_categories, public.ingredients,
  public.recipe_ingredients, public.recipe_steps, public.plating_steps, public.recipe_images, public.profiles
  to anon, authenticated;

-- Schrijven kan alleen met een account, en RLS beperkt dat tot de eigen rijen.
grant insert, update, delete on public.recipes, public.recipe_categories, public.recipe_ingredients,
  public.recipe_steps, public.plating_steps to authenticated;
grant insert on public.ingredients to authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.cooked_recipes, public.saved_recipes, public.user_recipes to authenticated;
grant insert, delete on public.recipe_images to authenticated;

grant execute on function public.save_user_recipe(jsonb, uuid) to authenticated;
