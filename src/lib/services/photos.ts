/**
 * Uploads naar Supabase Storage. Elke gebruiker schrijft uitsluitend in zijn
 * eigen map (`<user-id>/…`); dat wordt in de database met storage-policies
 * afgedwongen, niet alleen hier.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { PHOTO_BUCKET } from "@/lib/supabase/config";
import { dataUrlToBlob } from "./images";

function randomName(ext = "jpg") {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${id.replace(/[^a-zA-Z0-9-]/g, "")}.${ext}`;
}

/** Uploadt een blob en geeft het opslagpad terug (niet de URL). */
export async function uploadPhoto(client: SupabaseClient, userId: string, blob: Blob): Promise<string> {
  const path = `${userId}/${randomName()}`;
  const { error } = await client.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw new Error(`De foto kon niet worden geüpload: ${error.message}`);
  return path;
}

/**
 * Accepteert wat het formulier oplevert: een data-URL (nieuwe foto), een
 * bestaande publieke URL of een bestaand opslagpad. Geeft altijd een opslagpad.
 */
export async function ensureStoredPhoto(client: SupabaseClient, userId: string, value: string): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("data:")) return uploadPhoto(client, userId, await dataUrlToBlob(value));
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`;
  const at = value.indexOf(marker);
  if (at >= 0) return value.slice(at + marker.length);
  if (/^[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/.test(value)) return value;
  return null;
}
