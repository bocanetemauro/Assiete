/**
 * Supabase-configuratie uit environment variables.
 *
 * Alleen de project-URL en de publishable (anon) key worden in de browser
 * gebruikt. Die key is bedoeld om publiek te zijn: alle toegang tot data wordt
 * afgedwongen met Row Level Security in de database. Een service-role key hoort
 * hier NOOIT te staan.
 *
 * Let op: Next.js vervangt `process.env.NEXT_PUBLIC_*` alleen bij letterlijke
 * toegang, daarom geen dynamische lookups.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/** Opslagbucket voor foto's van gerechten, eigen recepten en profielfoto's. */
export const PHOTO_BUCKET = "recipe-photos";
