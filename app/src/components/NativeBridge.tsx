"use client";

/**
 * Alleen actief in de Android-app. Doet twee dingen:
 *
 * 1. Links uit de bevestigings- en wachtwoordresetmail openen de app via de
 *    deeplink `nl.assiette.app://auth/confirm`. Hier ronden we dezelfde stap af
 *    die op de website `/auth/confirm` doet, met dezelfde Supabase-account.
 * 2. De statusbalk van Android krijgt de kleur van de pagina eronder.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { APP_SCHEME, IS_NATIVE_APP } from "@/lib/native";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/** Alleen interne paden toestaan (voorkomt open redirects). */
function safePath(value: string | null, fallback: string): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
}

/**
 * Rondt een e-maillink af en geeft het pad terug waar de app heen moet,
 * of `null` als de URL geen auth-link is.
 */
export async function completeAuthLink(url: string): Promise<string | null> {
  if (!url.startsWith(`${APP_SCHEME}://auth/confirm`)) return null;

  const parsed = new URL(url);
  const query = parsed.searchParams;
  const hash = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const read = (key: string) => query.get(key) ?? hash.get(key);

  const type = read("type");
  const nextParam = query.get("next");
  const recovery = type === "recovery" || (nextParam ?? "").startsWith("/wachtwoord-herstellen");
  const next = safePath(nextParam, recovery ? "/wachtwoord-herstellen" : "/profiel?welkom=1");
  const fail = (reason: string) => `/auth/fout?reden=${encodeURIComponent(reason.slice(0, 120))}${recovery ? "&flow=recovery" : ""}`;

  const providerError = read("error_code") ?? read("error");
  if (providerError) return fail(providerError);

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fail("not_configured");

  const code = query.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error ? fail(error.code ?? "exchange_failed") : next;
  }

  const tokenHash = query.get("token_hash");
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type: type as "signup" | "recovery" | "email" | "email_change" | "invite" | "magiclink", token_hash: tokenHash });
    return error ? fail(error.code ?? "verify_failed") : next;
  }

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    return error ? fail(error.code ?? "verify_failed") : next;
  }

  return fail("missing_token");
}

export function NativeBridge() {
  const router = useRouter();
  const pathname = usePathname();

  // Deeplinks: zowel wanneer de app al open is als bij een koude start via de link.
  useEffect(() => {
    if (!IS_NATIVE_APP) return;
    let removed = false;
    let remove: (() => void) | undefined;

    const open = async (url: string | undefined) => {
      if (!url) return;
      const target = await completeAuthLink(url);
      if (target) router.replace(target);
    };

    void import("@capacitor/app")
      .then(async ({ App }) => {
        const launch = await App.getLaunchUrl().catch(() => undefined);
        await open(launch?.url);
        const handle = await App.addListener("appUrlOpen", ({ url }) => void open(url));
        if (removed) void handle.remove();
        else remove = () => void handle.remove();
      })
      .catch(() => {
        /* buiten de native app (bv. in een browser) is er geen deeplink-plugin */
      });

    return () => {
      removed = true;
      remove?.();
    };
  }, [router]);

  // Statusbalk: donker in de kookmodus, anders de ivoorkleur van de site.
  useEffect(() => {
    if (!IS_NATIVE_APP) return;
    const dark = pathname.startsWith("/kookmodus");
    void import("@capacitor/status-bar")
      .then(async ({ StatusBar, Style }) => {
        await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
        await StatusBar.setBackgroundColor({ color: dark ? "#171311" : "#faf7f2" });
      })
      .catch(() => {
        /* statusbalk bestaat alleen op het toestel */
      });
  }, [pathname]);

  return null;
}
