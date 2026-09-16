/**
 * Kleine voorkeuren per bezoeker in localStorage: afgevinkte ingrediënten, het
 * gekozen aantal personen en de stap waar je gebleven was. Bewust géén
 * accountgegevens — die staan in Supabase.
 */

/** Kleine, per-recept voorkeuren (afgevinkte ingrediënten, porties). */
export function readPreference<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`assiette.pref.${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePreference<T>(key: string, value: T) {
  try {
    localStorage.setItem(`assiette.pref.${key}`, JSON.stringify(value));
  } catch {
    /* privémodus of vol geheugen: voorkeuren zijn niet essentieel */
  }
}
