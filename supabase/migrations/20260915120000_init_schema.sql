-- =====================================================================
--  Assiette — schema, Row Level Security, RPC en foto-opslag
-- ---------------------------------------------------------------------
--  Principes
--  * Recepten van het platform zijn publiek leesbaar (ook zonder account).
--  * Gebruikers kunnen alleen hun eigen persoonlijke data lezen/wijzigen.
--  * Alle tabellen hebben RLS; schrijfrechten alleen voor `authenticated`.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Hulpfuncties
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles — één rij per gebruiker in auth.users
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  bio text check (char_length(bio) <= 300),
  avatar_url text check (char_length(avatar_url) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Chef'), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- categories — gangen (amuse, voorgerecht…) en categorieën (vlees, sauzen…)
-- ---------------------------------------------------------------------
create table public.categories (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  label text not null check (char_length(label) between 2 and 40),
  kind text not null check (kind in ('course', 'category')),
  sort_order smallint not null default 0
);

-- ---------------------------------------------------------------------
-- recipes — platformrecepten en eigen recepten van gebruikers
-- ---------------------------------------------------------------------
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 110),
  source text not null check (source in ('platform', 'user')),
  author_id uuid references public.profiles (id) on delete cascade,
  is_public boolean not null default false,
  title text not null check (char_length(title) between 3 and 120),
  subtitle text check (char_length(subtitle) <= 160),
  description text not null check (char_length(description) between 10 and 800),
  story text check (char_length(story) <= 1500),
  course text not null references public.categories (id),
  difficulty text not null check (difficulty in ('makkelijk', 'gemiddeld', 'uitdagend')),
  servings smallint not null check (servings between 1 and 48),
  prep_minutes smallint not null default 0 check (prep_minutes between 0 and 4320),
  cook_minutes smallint not null default 0 check (cook_minutes between 0 and 4320),
  rest_minutes smallint not null default 0 check (rest_minutes between 0 and 4320),
  dish jsonb,
  tone text not null default '#EFE8DD' check (tone ~ '^#[0-9A-Fa-f]{6}$'),
  tags text[] not null default '{}' check (cardinality(tags) <= 24),
  equipment text[] not null default '{}' check (cardinality(equipment) <= 30),
  plating_intro text check (char_length(plating_intro) <= 600),
  plating_notes text check (char_length(plating_notes) <= 2000),
  chef_tip text check (char_length(chef_tip) <= 800),
  pairing text check (char_length(pairing) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipes_owner_matches_source check (
    (source = 'platform' and author_id is null and is_public)
    or (source = 'user' and author_id is not null)
  )
);

create index recipes_author_idx on public.recipes (author_id) where author_id is not null;
create index recipes_visibility_idx on public.recipes (is_public, source);

create trigger recipes_touch_updated_at
before update on public.recipes
for each row execute function public.touch_updated_at();

create table public.recipe_categories (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  category_id text not null references public.categories (id) on delete cascade,
  primary key (recipe_id, category_id)
);

create index recipe_categories_category_idx on public.recipe_categories (category_id);

-- ---------------------------------------------------------------------
-- ingredients & recipe_ingredients
-- ---------------------------------------------------------------------
create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create unique index ingredients_name_key on public.ingredients (lower(name));

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete restrict,
  position smallint not null,
  group_name text check (char_length(group_name) <= 60),
  quantity numeric(10, 3) check (quantity is null or quantity > 0),
  unit text not null default '' check (char_length(unit) <= 30),
  note text check (char_length(note) <= 160),
  unique (recipe_id, position)
);

create index recipe_ingredients_ingredient_idx on public.recipe_ingredients (ingredient_id);

-- ---------------------------------------------------------------------
-- recipe_steps & plating_steps
-- ---------------------------------------------------------------------
create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position smallint not null,
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '' check (char_length(body) <= 2000),
  phase text not null check (phase in ('mise-en-place', 'snijden', 'kruiden', 'verhitten', 'bakken', 'garen', 'saus', 'rusten', 'bord', 'dresseren')),
  scene jsonb,
  timer_seconds integer check (timer_seconds is null or timer_seconds between 1 and 172800),
  tip text check (char_length(tip) <= 600),
  image_path text check (char_length(image_path) <= 400),
  unique (recipe_id, position)
);

create table public.plating_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  stage smallint not null check (stage between 0 and 5),
  title text not null check (char_length(title) <= 120),
  body text not null check (char_length(body) <= 800),
  unique (recipe_id, stage)
);

-- ---------------------------------------------------------------------
-- cooked_recipes — "Laat je bord zien"
-- ---------------------------------------------------------------------
create table public.cooked_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  title text check (char_length(title) <= 80),
  note text check (char_length(note) <= 500),
  duration_minutes smallint check (duration_minutes between 1 and 4320),
  cooked_at timestamptz not null default now()
);

create index cooked_recipes_user_idx on public.cooked_recipes (user_id, cooked_at desc);
create index cooked_recipes_recipe_idx on public.cooked_recipes (recipe_id);

-- ---------------------------------------------------------------------
-- recipe_images — omslag/galerij van eigen recepten en foto's van gekookte gerechten
-- ---------------------------------------------------------------------
create table public.recipe_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid references public.recipes (id) on delete cascade,
  cooked_recipe_id uuid references public.cooked_recipes (id) on delete cascade,
  kind text not null check (kind in ('cover', 'gallery', 'cooked')),
  storage_path text not null check (storage_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,120}$'),
  position smallint not null default 0,
  alt text check (char_length(alt) <= 200),
  created_at timestamptz not null default now(),
  constraint recipe_images_target check (
    (kind = 'cooked' and cooked_recipe_id is not null)
    or (kind in ('cover', 'gallery') and recipe_id is not null and cooked_recipe_id is null)
  )
);

create index recipe_images_recipe_idx on public.recipe_images (recipe_id) where recipe_id is not null;
create index recipe_images_cooked_idx on public.recipe_images (cooked_recipe_id) where cooked_recipe_id is not null;
create index recipe_images_user_idx on public.recipe_images (user_id);

-- ---------------------------------------------------------------------
-- saved_recipes — favorieten en de lijst "opnieuw maken"
-- ---------------------------------------------------------------------
create table public.saved_recipes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  kind text not null default 'favorite' check (kind in ('favorite', 'cook_again')),
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id, kind)
);

create index saved_recipes_recipe_idx on public.saved_recipes (recipe_id);

-- ---------------------------------------------------------------------
-- user_recipes — persoonlijke collectie van zelf geschreven recepten
-- ---------------------------------------------------------------------
create table public.user_recipes (
  recipe_id uuid primary key references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index user_recipes_user_idx on public.user_recipes (user_id);

-- =====================================================================
--  Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.plating_steps enable row level security;
alter table public.cooked_recipes enable row level security;
alter table public.recipe_images enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.user_recipes enable row level security;

-- profiles: eigen profiel, plus de naam van auteurs van publieke recepten
create policy "profiles_select_own_or_public_author" on public.profiles
for select to anon, authenticated
using (
  id = (select auth.uid())
  or exists (select 1 from public.recipes r where r.author_id = profiles.id and r.is_public)
);

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- categories: publiek leesbaar
create policy "categories_select_all" on public.categories
for select to anon, authenticated
using (true);

-- recipes
create policy "recipes_select_public_or_own" on public.recipes
for select to anon, authenticated
using (is_public or author_id = (select auth.uid()));

create policy "recipes_insert_own" on public.recipes
for insert to authenticated
with check (source = 'user' and author_id = (select auth.uid()));

create policy "recipes_update_own" on public.recipes
for update to authenticated
using (source = 'user' and author_id = (select auth.uid()))
with check (source = 'user' and author_id = (select auth.uid()));

create policy "recipes_delete_own" on public.recipes
for delete to authenticated
using (source = 'user' and author_id = (select auth.uid()));

-- onderdelen van recepten: zichtbaar als het recept zichtbaar is; schrijven alleen door de auteur
create policy "recipe_categories_select_visible" on public.recipe_categories
for select to anon, authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "recipe_categories_write_own" on public.recipe_categories
for all to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_ingredients_select_visible" on public.recipe_ingredients
for select to anon, authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "recipe_ingredients_write_own" on public.recipe_ingredients
for all to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

create policy "recipe_steps_select_visible" on public.recipe_steps
for select to anon, authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "recipe_steps_write_own" on public.recipe_steps
for all to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (
  exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid()))
  and (image_path is null or starts_with(image_path, (select auth.uid())::text || '/'))
);

create policy "plating_steps_select_visible" on public.plating_steps
for select to anon, authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "plating_steps_write_own" on public.plating_steps
for all to authenticated
using (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())))
with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.source = 'user' and r.author_id = (select auth.uid())));

-- ingredients: gedeelde lijst van namen
create policy "ingredients_select_all" on public.ingredients
for select to anon, authenticated
using (true);

create policy "ingredients_insert_authenticated" on public.ingredients
for insert to authenticated
with check (true);

-- cooked_recipes: volledig privé
create policy "cooked_recipes_select_own" on public.cooked_recipes
for select to authenticated
using (user_id = (select auth.uid()));

create policy "cooked_recipes_insert_own" on public.cooked_recipes
for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "cooked_recipes_update_own" on public.cooked_recipes
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "cooked_recipes_delete_own" on public.cooked_recipes
for delete to authenticated
using (user_id = (select auth.uid()));

-- recipe_images
create policy "recipe_images_select_own_or_public" on public.recipe_images
for select to anon, authenticated
using (
  user_id = (select auth.uid())
  or (kind in ('cover', 'gallery') and exists (select 1 from public.recipes r where r.id = recipe_id and r.is_public))
);

create policy "recipe_images_insert_own" on public.recipe_images
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and starts_with(storage_path, (select auth.uid())::text || '/')
  and (
    (kind = 'cooked' and exists (select 1 from public.cooked_recipes c where c.id = cooked_recipe_id and c.user_id = (select auth.uid())))
    or (kind in ('cover', 'gallery') and exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = (select auth.uid())))
  )
);

create policy "recipe_images_delete_own" on public.recipe_images
for delete to authenticated
using (user_id = (select auth.uid()));

-- saved_recipes: volledig privé
create policy "saved_recipes_select_own" on public.saved_recipes
for select to authenticated
using (user_id = (select auth.uid()));

create policy "saved_recipes_insert_own" on public.saved_recipes
for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.recipes r where r.id = recipe_id));

create policy "saved_recipes_delete_own" on public.saved_recipes
for delete to authenticated
using (user_id = (select auth.uid()));

-- user_recipes
create policy "user_recipes_select_own" on public.user_recipes
for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_recipes_insert_own" on public.user_recipes
for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.recipes r where r.id = recipe_id and r.author_id = (select auth.uid())));

create policy "user_recipes_delete_own" on public.user_recipes
for delete to authenticated
using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- Rechten (RLS bepaalt welke rijen; grants bepalen welke acties)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.categories, public.recipes, public.recipe_categories, public.ingredients,
  public.recipe_ingredients, public.recipe_steps, public.plating_steps, public.recipe_images, public.profiles
  to anon, authenticated;

grant insert, update, delete on public.recipes, public.recipe_categories, public.recipe_ingredients,
  public.recipe_steps, public.plating_steps to authenticated;

grant insert on public.ingredients to authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.cooked_recipes, public.saved_recipes, public.user_recipes to authenticated;
grant insert, delete on public.recipe_images to authenticated;

-- =====================================================================
--  RPC: eigen recept opslaan (atomair, draait met de rechten van de gebruiker)
-- =====================================================================
create or replace function public.save_user_recipe(p_payload jsonb, p_recipe_id uuid default null)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_id uuid;
  v_slug text;
  v_base text;
  v_item jsonb;
  v_ingredient_id uuid;
  v_name text;
  v_path text;
  v_pos integer;
  v_tags text[] := array(select left(t, 40) from jsonb_array_elements_text(coalesce(p_payload -> 'tags', '[]'::jsonb)) as t limit 24);
  v_equipment text[] := array(select left(t, 60) from jsonb_array_elements_text(coalesce(p_payload -> 'equipment', '[]'::jsonb)) as t limit 30);
begin
  if v_uid is null then
    raise exception 'Je moet ingelogd zijn om een recept op te slaan.' using errcode = '42501';
  end if;

  v_base := trim(both '-' from regexp_replace(lower(coalesce(p_payload ->> 'slug_base', '')), '[^a-z0-9]+', '-', 'g'));
  v_base := trim(both '-' from left(v_base, 90));
  if v_base = '' then
    v_base := 'recept';
  end if;

  if p_recipe_id is null then
    v_id := gen_random_uuid();
    v_slug := v_base || '-' || substr(replace(v_id::text, '-', ''), 1, 8);

    insert into public.recipes (
      id, slug, source, author_id, is_public, title, description, course, difficulty,
      servings, prep_minutes, cook_minutes, tone, tags, equipment, plating_notes, chef_tip
    )
    values (
      v_id, v_slug, 'user', v_uid, coalesce((p_payload ->> 'is_public')::boolean, false),
      trim(p_payload ->> 'title'), trim(p_payload ->> 'description'), p_payload ->> 'course', p_payload ->> 'difficulty',
      (p_payload ->> 'servings')::smallint, coalesce((p_payload ->> 'prep_minutes')::smallint, 0),
      coalesce((p_payload ->> 'cook_minutes')::smallint, 0), coalesce(p_payload ->> 'tone', '#EFE8DD'),
      v_tags, v_equipment, nullif(trim(p_payload ->> 'plating_notes'), ''), nullif(trim(p_payload ->> 'chef_tip'), '')
    );

    insert into public.user_recipes (recipe_id, user_id) values (v_id, v_uid);
  else
    update public.recipes r
    set is_public = coalesce((p_payload ->> 'is_public')::boolean, false),
        title = trim(p_payload ->> 'title'),
        description = trim(p_payload ->> 'description'),
        course = p_payload ->> 'course',
        difficulty = p_payload ->> 'difficulty',
        servings = (p_payload ->> 'servings')::smallint,
        prep_minutes = coalesce((p_payload ->> 'prep_minutes')::smallint, 0),
        cook_minutes = coalesce((p_payload ->> 'cook_minutes')::smallint, 0),
        tone = coalesce(p_payload ->> 'tone', r.tone),
        tags = v_tags,
        equipment = v_equipment,
        plating_notes = nullif(trim(p_payload ->> 'plating_notes'), ''),
        chef_tip = nullif(trim(p_payload ->> 'chef_tip'), '')
    where r.id = p_recipe_id and r.source = 'user' and r.author_id = v_uid
    returning r.id, r.slug into v_id, v_slug;

    if v_id is null then
      raise exception 'Recept niet gevonden of niet van jou.' using errcode = 'P0002';
    end if;

    delete from public.recipe_categories rc where rc.recipe_id = v_id;
    delete from public.recipe_ingredients ri where ri.recipe_id = v_id;
    delete from public.recipe_steps rs where rs.recipe_id = v_id;
    delete from public.recipe_images img where img.recipe_id = v_id and img.kind in ('cover', 'gallery');
  end if;

  insert into public.recipe_categories (recipe_id, category_id)
  select v_id, c.id
  from public.categories c
  where c.kind = 'category'
    and c.id in (select jsonb_array_elements_text(coalesce(p_payload -> 'categories', '[]'::jsonb)))
  on conflict do nothing;

  v_pos := 0;
  for v_item in select value from jsonb_array_elements(coalesce(p_payload -> 'ingredients', '[]'::jsonb)) loop
    v_name := left(trim(coalesce(v_item ->> 'name', '')), 120);
    continue when v_name = '';
    v_pos := v_pos + 1;
    exit when v_pos > 80;

    select i.id into v_ingredient_id from public.ingredients i where lower(i.name) = lower(v_name);
    if v_ingredient_id is null then
      insert into public.ingredients (name) values (v_name) on conflict do nothing returning id into v_ingredient_id;
      if v_ingredient_id is null then
        select i.id into v_ingredient_id from public.ingredients i where lower(i.name) = lower(v_name);
      end if;
    end if;

    insert into public.recipe_ingredients (recipe_id, ingredient_id, position, quantity, unit, group_name, note)
    values (
      v_id, v_ingredient_id, v_pos,
      case when (v_item ->> 'quantity') ~ '^[0-9]+(\.[0-9]+)?$' and (v_item ->> 'quantity')::numeric > 0 then (v_item ->> 'quantity')::numeric end,
      left(coalesce(v_item ->> 'unit', ''), 30),
      nullif(left(trim(coalesce(v_item ->> 'group', '')), 60), ''),
      nullif(left(trim(coalesce(v_item ->> 'note', '')), 160), '')
    );
  end loop;

  v_pos := 0;
  for v_item in select value from jsonb_array_elements(coalesce(p_payload -> 'steps', '[]'::jsonb)) loop
    continue when trim(coalesce(v_item ->> 'title', '')) = '' and trim(coalesce(v_item ->> 'body', '')) = '';
    v_pos := v_pos + 1;
    exit when v_pos > 60;
    v_path := nullif(v_item ->> 'image_path', '');
    if v_path is not null and not starts_with(v_path, v_uid::text || '/') then
      raise exception 'Ongeldige foto bij stap %.', v_pos using errcode = '42501';
    end if;

    insert into public.recipe_steps (recipe_id, position, title, body, phase, scene, timer_seconds, image_path)
    values (
      v_id, v_pos,
      coalesce(nullif(left(trim(coalesce(v_item ->> 'title', '')), 160), ''), 'Stap ' || v_pos),
      left(trim(coalesce(v_item ->> 'body', '')), 2000),
      coalesce(v_item ->> 'phase', 'mise-en-place'),
      case when jsonb_typeof(v_item -> 'scene') = 'object' then v_item -> 'scene' end,
      case when (v_item ->> 'timer_seconds') ~ '^[0-9]+$' and (v_item ->> 'timer_seconds')::integer between 1 and 172800 then (v_item ->> 'timer_seconds')::integer end,
      v_path
    );
  end loop;

  v_pos := 0;
  for v_item in select value from jsonb_array_elements(coalesce(p_payload -> 'photos', '[]'::jsonb)) loop
    v_pos := v_pos + 1;
    exit when v_pos > 8;
    insert into public.recipe_images (user_id, recipe_id, kind, storage_path, position, alt)
    values (v_uid, v_id, case when v_pos = 1 then 'cover' else 'gallery' end, v_item #>> '{}', v_pos, left(trim(p_payload ->> 'title'), 200));
  end loop;

  return jsonb_build_object('id', v_id, 'slug', v_slug);
end;
$$;

revoke execute on function public.save_user_recipe(jsonb, uuid) from public, anon;
grant execute on function public.save_user_recipe(jsonb, uuid) to authenticated;

-- =====================================================================
--  Opslag: foto's (publieke bucket, schrijven alleen in de eigen map)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-photos', 'recipe-photos', true, 6000000, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "recipe_photos_insert_own_folder" on storage.objects
for insert to authenticated
with check (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "recipe_photos_update_own_folder" on storage.objects
for update to authenticated
using (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "recipe_photos_delete_own_folder" on storage.objects
for delete to authenticated
using (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
