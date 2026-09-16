"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { IS_NATIVE_APP } from "@/lib/native";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let browserClient: SupabaseClient | null = null;

/**
 * Supabase-client voor de browser. Op de website staat de sessie in cookies,
 * zodat de server (proxy en /auth/confirm) hem ook kan lezen. In de Android-app
 * is er geen server: daar staat de sessie in de opslag van de app zelf, zodat
 * je ook na het afsluiten van de app ingelogd blijft.
 * Geeft `null` terug zolang de environment variables ontbreken.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  // Tijdens het vooraf renderen van de app-build is er geen `window`; op het toestel wel.
  if (IS_NATIVE_APP && typeof window === "undefined") return null;
  browserClient ??= IS_NATIVE_APP
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          storage: window.localStorage,
          persistSession: true,
          autoRefreshToken: true,
          // De links uit e-mails komen binnen via de deeplink (NativeBridge).
          detectSessionInUrl: false,
          flowType: "pkce",
        },
      })
    : createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return browserClient;
}
