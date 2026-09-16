-- Mensen typen een username vaak met '@' ervoor (@mauro2009). Die '@' hoort
-- niet bij de username; zoeken, beschikbaarheid en verzoeken negeren hem.

create or replace function public.normalize_username(p_username text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(ltrim(lower(btrim(coalesce(p_username, ''))), '@'), '');
$$;

create or replace function public.username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.normalize_username(p_username) ~ '^[a-z0-9_]{3,20}$', false)
     and not exists (select 1 from public.profiles p where p.username = public.normalize_username(p_username));
$$;

create or replace function public.profiles_normalize()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.username := public.normalize_username(new.username);
  new.display_name := btrim(new.display_name);
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Chef'), 80);
  v_username text := public.normalize_username(new.raw_user_meta_data ->> 'username');
begin
  if v_username is null or v_username !~ '^[a-z0-9_]{3,20}$' then
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

  select p.id into v_target from public.profiles p where p.username = public.normalize_username(p_username);
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

  select p.* into v_profile from public.profiles p where p.username = public.normalize_username(p_username);
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
