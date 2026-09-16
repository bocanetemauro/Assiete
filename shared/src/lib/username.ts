/**
 * Regels voor usernames. Dezelfde regels dwingt de database af
 * (constraint `profiles_username_format` en `public.normalize_username`).
 */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

/** Hoofdletters, spaties aan de randen en een voorloop-@ maken geen verschil. */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/^@+/, "");
}

/** Leesbare uitleg als een username niet voldoet, anders null. */
export function usernameProblem(value: string): string | null {
  const username = normalizeUsername(value);
  if (!username) return "Kies een username.";
  if (/\s/.test(username)) return "Een username heeft geen spaties.";
  if (!/^[a-z0-9_]*$/.test(username)) return "Gebruik alleen letters a–z, cijfers en _.";
  if (username.length < USERNAME_MIN) return `Minstens ${USERNAME_MIN} tekens.`;
  if (username.length > USERNAME_MAX) return `Maximaal ${USERNAME_MAX} tekens.`;
  return null;
}

/** Zet een Supabase-fout bij het opslaan van een username om naar gewone taal. */
export function usernameSaveError(error: { code?: string; message: string }): string | null {
  if (error.code === "23505" && /username/.test(error.message)) return "Deze username is al bezet. Kies een andere.";
  if (error.code === "23514" && /username/.test(error.message)) return "Gebruik 3–20 tekens: letters a–z, cijfers en _.";
  return null;
}
