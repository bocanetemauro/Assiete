-- =====================================================================
--  Assiette — relationeel databaseschema (PostgreSQL)
-- ---------------------------------------------------------------------
--  De frontend gebruikt dezelfde tabel- en kolomnamen (zie
--  src/lib/types.ts, `*Row`-types). In de demo leven deze tabellen in
--  IndexedDB; met dit schema kun je ze één-op-één naar Postgres,
--  Supabase of Neon verhuizen.
-- =====================================================================

create extension if not exists "pgcrypto";

create type difficulty as enum ('makkelijk', 'gemiddeld', 'uitdagend');
create type course     as enum ('voorgerecht', 'hoofdgerecht', 'nagerecht');
create type recipe_source as enum ('platform', 'user');
create type image_kind as enum ('cover', 'gallery', 'step', 'cooked');
create type saved_kind as enum ('favorite', 'cook_again');
create type publish_status as enum ('draft', 'published');

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
create table users (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  name           text not null,
  password_hash  text not null,            -- vervalt bij externe auth (bv. Supabase Auth / Auth.js)
  bio            text,
  avatar_url     text,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- recipes — zowel platformrecepten als door gebruikers geschreven recepten
-- ---------------------------------------------------------------------
create table recipes (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  subtitle         text,
  description      text not null,
  story            text,
  source           recipe_source not null default 'platform',
  author_id        uuid references users(id) on delete set null,
  course           course not null,
  categories       text[] not null default '{}',   -- vlees, vis, vegetarisch, pasta, soep, dessert
  difficulty       difficulty not null,
  servings         smallint not null check (servings > 0),
  prep_minutes     smallint not null default 0,
  cook_minutes     smallint not null default 0,
  rest_minutes     smallint not null default 0,
  dish             text,                            -- sleutel van de illustratie
  tone             text not null default '#EFE9E1', -- achtergrondtint van de kaart
  key_ingredients  text[] not null default '{}',
  plating_intro    text,
  plating_notes    text,
  chef_tip         text,
  pairing          text,
  is_daily         boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index recipes_categories_idx on recipes using gin (categories);
create index recipes_author_idx on recipes (author_id);

-- ---------------------------------------------------------------------
-- ingredients
-- ---------------------------------------------------------------------
create table ingredients (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references recipes(id) on delete cascade,
  position    smallint not null,
  group_name  text,                 -- bv. 'Saus', 'Garnituur'
  quantity    numeric(10, 2),
  unit        text not null default '',
  name        text not null,
  note        text
);
create index ingredients_recipe_idx on ingredients (recipe_id, position);

-- ---------------------------------------------------------------------
-- recipe_images — covers, galerij, stapfoto's en foto's van gekookte gerechten
-- ---------------------------------------------------------------------
create table recipe_images (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references users(id) on delete cascade,
  recipe_id         uuid references recipes(id) on delete cascade,
  step_id           uuid,             -- FK hieronder, na recipe_steps
  cooked_recipe_id  uuid,             -- FK hieronder, na cooked_recipes
  kind              image_kind not null,
  url               text not null,    -- object storage URL (S3, R2, Supabase Storage…)
  alt               text,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- recipe_steps
-- ---------------------------------------------------------------------
create table recipe_steps (
  id             uuid primary key default gen_random_uuid(),
  recipe_id      uuid not null references recipes(id) on delete cascade,
  position       smallint not null,
  title          text not null,
  body           text not null,
  phase          text not null,     -- mise-en-place, snijden, kruiden, verhitten, bakken, garen, saus, rusten, bord, dresseren
  scene          jsonb,             -- { key, item, tone, dish } → geïllustreerde techniek
  timer_seconds  integer check (timer_seconds is null or timer_seconds > 0),
  tip            text,
  image_id       uuid references recipe_images(id) on delete set null
);
create index recipe_steps_recipe_idx on recipe_steps (recipe_id, position);

alter table recipe_images
  add constraint recipe_images_step_fk foreign key (step_id) references recipe_steps(id) on delete cascade;

-- ---------------------------------------------------------------------
-- plating_steps — de zes stappen van de bordopmaak per recept
-- ---------------------------------------------------------------------
create table plating_steps (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  position   smallint not null,
  stage      smallint not null check (stage between 0 and 5),
  title      text not null,
  body       text not null
);

-- ---------------------------------------------------------------------
-- saved_recipes — favorieten én de lijst "opnieuw maken"
-- ---------------------------------------------------------------------
create table saved_recipes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  recipe_id   uuid not null references recipes(id) on delete cascade,
  kind        saved_kind not null default 'favorite',
  created_at  timestamptz not null default now(),
  unique (user_id, recipe_id, kind)
);

-- ---------------------------------------------------------------------
-- cooked_recipes — "Laat je bord zien": elk keer dat iemand een recept kookt
-- ---------------------------------------------------------------------
create table cooked_recipes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id) on delete cascade,
  recipe_id         uuid not null references recipes(id) on delete cascade,
  title             text,             -- eigen naam voor deze versie van het gerecht
  note              text,
  duration_minutes  smallint,
  cooked_at         timestamptz not null default now()
);
create index cooked_recipes_user_idx on cooked_recipes (user_id, cooked_at desc);

alter table recipe_images
  add constraint recipe_images_cooked_fk foreign key (cooked_recipe_id) references cooked_recipes(id) on delete cascade;

-- ---------------------------------------------------------------------
-- user_recipes — koppelt een auteur aan zijn/haar eigen recepten
-- ---------------------------------------------------------------------
create table user_recipes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  recipe_id   uuid not null references recipes(id) on delete cascade,
  status      publish_status not null default 'published',
  created_at  timestamptz not null default now(),
  unique (recipe_id)
);
create index user_recipes_user_idx on user_recipes (user_id);
