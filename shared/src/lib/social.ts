/**
 * Vrienden, verzoeken en posts via Supabase.
 *
 * Wie wat mag zien en wijzigen bepaalt de database (RLS); deze functies halen
 * alleen op wat de ingelogde gebruiker al mag zien. Een post van iemand die
 * geen vriend is, komt hier dus nooit binnen — ook niet via een eigen API-call.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { dataUrlToBlob } from "@/lib/services/images";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { photoUrl } from "@/lib/supabase/queries";
import { normalizeUsername } from "@/lib/username";

export const POST_PHOTO_BUCKET = "post-photos";

export interface Member {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
}

export type Relationship = "self" | "friends" | "outgoing" | "incoming" | "none";

export interface MemberOverview extends Member {
  bio: string | null;
  friendCount: number;
  relationship: Relationship;
  requestId: string | null;
}

export interface Friendship {
  id: string;
  status: "pending" | "accepted";
  direction: "incoming" | "outgoing";
  createdAt: string;
  other: Member;
}

export interface Post {
  id: string;
  body: string;
  imagePath: string | null;
  imageUrl: string | null;
  recipe: { slug: string; title: string } | null;
  createdAt: string;
  author: Member;
}

type Row = Record<string, any>;

function client(): SupabaseClient {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("De verbinding met de server is nog niet ingesteld.");
  return supabase;
}

/** Foutmeldingen uit de database (onze eigen teksten) of een nette standaardtekst. */
export function socialError(error: unknown, fallback = "Er ging iets mis. Probeer het opnieuw."): string {
  const message = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "";
  if (/geen kok met deze username|jezelf niet als vriend|log eerst in/i.test(message)) return message;
  if (/failed to fetch|network/i.test(message)) return "Geen verbinding met de server. Controleer je internet.";
  return fallback;
}

const MEMBER_FIELDS = "id, username, display_name, avatar_url";

function toMember(row: Row | null | undefined): Member {
  return {
    id: row?.id ?? "",
    username: row?.username ?? null,
    displayName: row?.display_name || "Chef",
    avatarUrl: photoUrl(row?.avatar_url),
  };
}

/* ------------------------------------------------------------------ */
/* Usernames en leden                                                   */
/* ------------------------------------------------------------------ */

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await client().rpc("username_available", { p_username: normalizeUsername(username) });
  if (error) throw error;
  return data === true;
}

/** Zoeken op (het begin van) een username. Vindt nooit jezelf. */
export async function searchMembers(query: string, selfId: string): Promise<Member[]> {
  const term = normalizeUsername(query).replace(/[^a-z0-9_]/g, "");
  if (term.length < 2) return [];
  const pattern = `${term.replace(/_/g, "\\_")}%`;
  const { data, error } = await client()
    .from("profiles")
    .select(MEMBER_FIELDS)
    .not("username", "is", null)
    .neq("id", selfId)
    .ilike("username", pattern)
    .order("username")
    .limit(12);
  if (error) throw error;
  const members = (data ?? []).map(toMember);
  // Een exacte treffer bovenaan.
  return members.sort((a, b) => Number(b.username === term) - Number(a.username === term));
}

export async function getMemberOverview(username: string): Promise<MemberOverview | null> {
  const { data, error } = await client().rpc("member_overview", { p_username: normalizeUsername(username) });
  if (error) throw error;
  if (!data) return null;
  const row = data as Row;
  return {
    ...toMember(row),
    bio: row.bio ?? null,
    friendCount: Number(row.friend_count ?? 0),
    relationship: row.relationship as Relationship,
    requestId: row.request_id ?? null,
  };
}

/* ------------------------------------------------------------------ */
/* Vriendschappen                                                       */
/* ------------------------------------------------------------------ */

export async function listFriendships(selfId: string): Promise<Friendship[]> {
  const { data, error } = await client()
    .from("friendships")
    .select(
      `id, status, created_at, requester_id,
       requester:profiles!friendships_requester_id_fkey(${MEMBER_FIELDS}),
       addressee:profiles!friendships_addressee_id_fkey(${MEMBER_FIELDS})`,
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: Row) => {
    const outgoing = row.requester_id === selfId;
    return {
      id: row.id,
      status: row.status,
      direction: outgoing ? "outgoing" : "incoming",
      createdAt: row.created_at,
      other: toMember(outgoing ? row.addressee : row.requester),
    };
  });
}

export async function countIncomingRequests(selfId: string): Promise<number> {
  const { count, error } = await client()
    .from("friendships")
    .select("id", { count: "exact", head: true })
    .eq("addressee_id", selfId)
    .eq("status", "pending");
  if (error) throw error;
  return count ?? 0;
}

/** Stuurt een verzoek; had de ander jou al gevraagd, dan zijn jullie meteen vrienden. */
export async function sendFriendRequest(username: string): Promise<"outgoing" | "friends"> {
  const { data, error } = await client().rpc("send_friend_request", { p_username: normalizeUsername(username) });
  if (error) throw error;
  return (data as Row).status === "friends" ? "friends" : "outgoing";
}

export async function acceptFriendRequest(id: string): Promise<void> {
  const { error } = await client().from("friendships").update({ status: "accepted" }).eq("id", id);
  if (error) throw error;
}

/** Weigeren, annuleren of ontvrienden: de relatie verdwijnt. */
export async function removeFriendship(id: string): Promise<void> {
  const { error } = await client().from("friendships").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Posts                                                                */
/* ------------------------------------------------------------------ */

const POST_SELECT = `id, body, image_path, created_at,
  author:profiles!posts_author_id_fkey(${MEMBER_FIELDS}),
  recipe:recipes!posts_recipe_id_fkey(slug, title)`;

async function withPhotos(rows: Row[]): Promise<Post[]> {
  const paths = rows.map((r) => r.image_path).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length) {
    // Privé-bucket: een tijdelijke link, alleen uitgegeven aan wie de post mag zien.
    const { data } = await client().storage.from(POST_PHOTO_BUCKET).createSignedUrls(paths, 60 * 60);
    data?.forEach((item) => item.path && item.signedUrl && signed.set(item.path, item.signedUrl));
  }
  return rows.map((row) => ({
    id: row.id,
    body: row.body ?? "",
    imagePath: row.image_path ?? null,
    imageUrl: row.image_path ? (signed.get(row.image_path) ?? null) : null,
    recipe: row.recipe ? { slug: row.recipe.slug, title: row.recipe.title } : null,
    createdAt: row.created_at,
    author: toMember(row.author),
  }));
}

/** Eigen posts en die van vrienden, nieuwste eerst. */
export async function listFeed(limit = 60): Promise<Post[]> {
  const { data, error } = await client().from("posts").select(POST_SELECT).order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return withPhotos(data ?? []);
}

/** Posts van één lid — leeg als je geen vriend bent (de database geeft ze niet vrij). */
export async function listPostsBy(authorId: string, limit = 60): Promise<Post[]> {
  const { data, error } = await client().from("posts").select(POST_SELECT).eq("author_id", authorId).order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return withPhotos(data ?? []);
}

export async function createPost(input: { authorId: string; body: string; photo: string | null; recipeId?: string | null }): Promise<Post> {
  const supabase = client();
  let imagePath: string | null = null;

  if (input.photo) {
    const blob = input.photo.startsWith("data:") ? await dataUrlToBlob(input.photo) : await (await fetch(input.photo)).blob();
    const name = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    imagePath = `${input.authorId}/${name}.jpg`;
    const { error } = await supabase.storage.from(POST_PHOTO_BUCKET).upload(imagePath, blob, { contentType: "image/jpeg", upsert: false });
    if (error) throw new Error("De foto kon niet worden geüpload.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ body: input.body.trim().slice(0, 1000), image_path: imagePath, recipe_id: input.recipeId ?? null })
    .select(POST_SELECT)
    .single();

  if (error) {
    if (imagePath) await supabase.storage.from(POST_PHOTO_BUCKET).remove([imagePath]);
    throw error;
  }
  return (await withPhotos([data]))[0];
}

export async function deletePost(post: Pick<Post, "id" | "imagePath">): Promise<void> {
  const supabase = client();
  const { error } = await supabase.from("posts").delete().eq("id", post.id);
  if (error) throw error;
  if (post.imagePath) await supabase.storage.from(POST_PHOTO_BUCKET).remove([post.imagePath]);
}

/* ------------------------------------------------------------------ */
/* Weergave                                                             */
/* ------------------------------------------------------------------ */

const timeFormatter = new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" });
const dayMonthFormatter = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long" });
const fullDateFormatter = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" });

/** "Vandaag om 14:20", "Gisteren om 13:45", "12 september om 09:10". */
export function formatPostTime(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(date)) / 86_400_000);
  const time = timeFormatter.format(date);
  if (days === 0) return `Vandaag om ${time}`;
  if (days === 1) return `Gisteren om ${time}`;
  if (date.getFullYear() === now.getFullYear()) return `${dayMonthFormatter.format(date)} om ${time}`;
  return fullDateFormatter.format(date);
}
