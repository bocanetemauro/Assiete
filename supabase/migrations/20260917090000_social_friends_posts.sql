-- =====================================================================
--  Sociaal: usernames, vriendschappen en privé-posts
-- ---------------------------------------------------------------------
--  Principes
--  * Een username is uniek, 3–20 tekens [a-z0-9_] en altijd lowercase.
--  * Een vriendschap bestaat pas na acceptatie door de ontvanger.
--  * Een post is alleen zichtbaar voor de auteur en diens vrienden. Dat
--    dwingt de database af (RLS), niet alleen de interface.
--  * Foto's bij posts staan in een privé-bucket; wie de post niet mag zien,
--    kan ook de foto niet ophalen.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Profielen: username en verplichte toonbare naam
-- ---------------------------------------------------------------------
alter table public.profiles add column username text;

alter table public.profiles
  add constraint profiles_username_format check (username is null or username ~ '^[a-z0-9_]{3,20}$'),
  add constraint profiles_display_name_required check (char_length(btrim(display_name)) between 1 and 80);

create unique index profiles_username_key on public.profiles (username);

-- Hoofdletters en spaties aan de randen maken geen verschil: altijd normaliseren.
create or replace function public.profiles_normalize()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.username := nullif(lower(btrim(new.username)), '');
  new.display_name := btrim(new.display_name);
  return new;
end;
$$;

create trigger profiles_normalize
before insert or update on public.profiles
for each row execute function public.profiles_normalize();

-- Nieuw account: username en toonbare naam uit het registratieformulier.
-- Is de username intussen bezet (gelijktijdige registratie), dan faalt de
-- registratie niet: de gebruiker kiest dan later een andere username.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Chef'), 80);
  v_username text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'username', '')));
begin
  if v_username !~ '^[a-z0-9_]{3,20}$' then
    v_username := null;
  end if;

  begin
    insert into public.profiles (id, display_name, username) values (new.id, v_name, v_username)
    on conflict (id) do nothing;
  exception when unique_violation then
    insert into public.profiles (id, display_name, username) values (new.id, v_name, null)
    on conflict (id) do nothing;
  end;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Beschikbaarheid controleren in het registratieformulier (ook zonder account).
create or replace function public.username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(btrim(p_username)) ~ '^[a-z0-9_]{3,20}$'
     and not exists (select 1 from public.profiles p where p.username = lower(btrim(p_username)));
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- Profielinformatie (naam, @username, foto, bio) is zichtbaar voor ingelogde
-- leden, zodat je elkaar kunt vinden. Bezoekers zonder account zien alleen de
-- naam van auteurs van openbare recepten, zoals voorheen.
drop policy "profiles_select_own_or_public_author" on public.profiles;

create policy "profiles_select_public_author" on public.profiles
for select to anon
using (exists (select 1 from public.recipes r where r.author_id = profiles.id and r.is_public));

create policy "profiles_select_members" on public.profiles
for select to authenticated
using (true);

-- ---------------------------------------------------------------------
-- 2. Vriendschappen (verzoek → accepteren)
-- ---------------------------------------------------------------------
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_not_self check (requester_id <> addressee_id)
);

-- Eén relatie per paar, in welke richting ook: geen dubbele verzoeken of vriendschappen.
create unique index friendships_pair_key on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index friendships_requester_idx on public.friendships (requester_id, status);
create index friendships_addressee_idx on public.friendships (addressee_id, status);

-- Een verzoek kan alleen van 'openstaand' naar 'geaccepteerd', en de betrokkenen
-- kunnen nooit worden omgewisseld.
create or replace function public.friendships_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.requester_id <> old.requester_id or new.addressee_id <> old.addressee_id or new.created_at <> old.created_at then
    raise exception 'Een vriendschap kan niet van persoon wisselen.' using errcode = '42501';
  end if;
  if not (old.status = 'pending' and new.status = 'accepted') then
    raise exception 'Alleen een openstaand verzoek kan worden geaccepteerd.' using errcode = '22023';
  end if;
  new.responded_at := now();
  return new;
end;
$$;

create trigger friendships_guard
before update on public.friendships
for each row execute function public.friendships_guard();

alter table public.friendships enable row level security;

create policy "friendships_select_own" on public.friendships
for select to authenticated
using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));

create policy "friendships_insert_as_requester" on public.friendships
for insert to authenticated
with check (requester_id = (select auth.uid()) and status = 'pending');

create policy "friendships_accept_as_addressee" on public.friendships
for update to authenticated
using (addressee_id = (select auth.uid()) and status = 'pending')
with check (addressee_id = (select auth.uid()) and status = 'accepted');

create policy "friendships_delete_own" on public.friendships
for delete to authenticated
using (requester_id = (select auth.uid()) or addressee_id = (select auth.uid()));

-- Minimale rechten: aanmaken met alleen de ontvanger, bijwerken alleen de status.
grant select, delete on public.friendships to authenticated;
grant insert (addressee_id) on public.friendships to authenticated;
grant update (status) on public.friendships to authenticated;

-- Is de ingelogde gebruiker bevriend met p_other? Onthult alleen de eigen relatie.
create or replace function public.is_friend_of(p_other uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = (select auth.uid()) and f.addressee_id = p_other)
        or (f.addressee_id = (select auth.uid()) and f.requester_id = p_other))
  );
$$;

revoke execute on function public.is_friend_of(uuid) from public, anon;
grant execute on function public.is_friend_of(uuid) to authenticated;

-- Vriendschapsverzoek via username. Had de ander jou al een verzoek gestuurd,
-- dan wordt dat meteen geaccepteerd in plaats van een tweede verzoek te maken.
create or replace function public.send_friend_request(p_username text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_target uuid;
  v_row public.friendships;
begin
  if v_uid is null then
    raise exception 'Log eerst in.' using errcode = '42501';
  end if;

  select p.id into v_target from public.profiles p where p.username = lower(btrim(p_username));
  if v_target is null then
    raise exception 'Er is geen kok met deze username.' using errcode = 'P0002';
  end if;
  if v_target = v_uid then
    raise exception 'Je kunt jezelf niet als vriend toevoegen.' using errcode = '22023';
  end if;

  select f.* into v_row from public.friendships f
  where least(f.requester_id, f.addressee_id) = least(v_uid, v_target)
    and greatest(f.requester_id, f.addressee_id) = greatest(v_uid, v_target);

  if found then
    if v_row.status = 'accepted' then
      return jsonb_build_object('status', 'friends', 'id', v_row.id);
    end if;
    if v_row.addressee_id = v_uid then
      update public.friendships f set status = 'accepted' where f.id = v_row.id;
      return jsonb_build_object('status', 'friends', 'id', v_row.id);
    end if;
    return jsonb_build_object('status', 'outgoing', 'id', v_row.id);
  end if;

  insert into public.friendships (addressee_id) values (v_target) returning * into v_row;
  return jsonb_build_object('status', 'outgoing', 'id', v_row.id);
end;
$$;

revoke execute on function public.send_friend_request(text) from public, anon;
grant execute on function public.send_friend_request(text) to authenticated;

-- Profielpagina: publieke profielgegevens, aantal vrienden en jouw relatie met
-- deze persoon. Geeft nooit weg wie iemands vrienden zijn.
create or replace function public.member_overview(p_username text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_profile public.profiles;
  v_row public.friendships;
  v_relationship text := 'none';
  v_request uuid;
begin
  if v_uid is null then
    return null;
  end if;

  select p.* into v_profile from public.profiles p where p.username = lower(btrim(p_username));
  if not found then
    return null;
  end if;

  if v_profile.id = v_uid then
    v_relationship := 'self';
  else
    select f.* into v_row from public.friendships f
    where least(f.requester_id, f.addressee_id) = least(v_uid, v_profile.id)
      and greatest(f.requester_id, f.addressee_id) = greatest(v_uid, v_profile.id);
    if found then
      v_request := v_row.id;
      v_relationship := case
        when v_row.status = 'accepted' then 'friends'
        when v_row.requester_id = v_uid then 'outgoing'
        else 'incoming'
      end;
    end if;
  end if;

  return jsonb_build_object(
    'id', v_profile.id,
    'username', v_profile.username,
    'display_name', v_profile.display_name,
    'bio', v_profile.bio,
    'avatar_url', v_profile.avatar_url,
    'friend_count', (select count(*) from public.friendships f where f.status = 'accepted' and (f.requester_id = v_profile.id or f.addressee_id = v_profile.id)),
    'relationship', v_relationship,
    'request_id', v_request
  );
end;
$$;

revoke execute on function public.member_overview(text) from public, anon;
grant execute on function public.member_overview(text) to authenticated;

-- ---------------------------------------------------------------------
-- 3. Posts: alleen voor jezelf en je vrienden
-- ---------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body text not null default '' check (char_length(body) <= 1000),
  image_path text check (image_path is null or image_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,120}$'),
  recipe_id uuid references public.recipes (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint posts_has_content check (char_length(btrim(body)) > 0 or image_path is not null or recipe_id is not null)
);

create index posts_author_created_idx on public.posts (author_id, created_at desc);
create index posts_created_idx on public.posts (created_at desc);
create index posts_recipe_idx on public.posts (recipe_id) where recipe_id is not null;
create index posts_image_idx on public.posts (image_path) where image_path is not null;

alter table public.posts enable row level security;

create policy "posts_select_own_or_friends" on public.posts
for select to authenticated
using (author_id = (select auth.uid()) or public.is_friend_of(author_id));

create policy "posts_insert_own" on public.posts
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and (image_path is null or starts_with(image_path, (select auth.uid())::text || '/'))
  and (recipe_id is null or exists (select 1 from public.recipes r where r.id = recipe_id))
);

create policy "posts_delete_own" on public.posts
for delete to authenticated
using (author_id = (select auth.uid()));

-- Auteur en tijdstip zet de database zelf; een post achteraf wijzigen kan niet.
grant select, delete on public.posts to authenticated;
grant insert (body, image_path, recipe_id) on public.posts to authenticated;

-- ---------------------------------------------------------------------
-- 4. Privé-bucket voor foto's bij posts
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-photos', 'post-photos', false, 6000000, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "post_photos_insert_own_folder" on storage.objects
for insert to authenticated
with check (bucket_id = 'post-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Een foto is zichtbaar voor de eigenaar, en voor wie de bijbehorende post mag zien.
create policy "post_photos_select_visible" on storage.objects
for select to authenticated
using (
  bucket_id = 'post-photos'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (select 1 from public.posts p where p.image_path = objects.name)
  )
);

create policy "post_photos_delete_own_folder" on storage.objects
for delete to authenticated
using (bucket_id = 'post-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
