-- is_friend_of is alleen nodig binnen de RLS-regels van posts. Het schema
-- `private` wordt niet via de API gepubliceerd, dus de functie is niet meer
-- los aan te roepen via /rest/v1/rpc.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_friend_of(p_other uuid)
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

revoke execute on function private.is_friend_of(uuid) from public, anon;
grant execute on function private.is_friend_of(uuid) to authenticated;

alter policy "posts_select_own_or_friends" on public.posts
using (author_id = (select auth.uid()) or private.is_friend_of(author_id));

drop function public.is_friend_of(uuid);
