import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const OTP_TYPES: EmailOtpType[] = ["signup", "email", "recovery", "email_change", "invite", "magiclink"];

/** Alleen interne paden toestaan (voorkomt open redirects). */
function safePath(value: string | null, fallback: string): string {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
}

/**
 * Landingspunt van de links in verificatie- en wachtwoordreset-e-mails.
 * Ondersteunt zowel `token_hash` (werkt op elk apparaat) als de PKCE-`code`.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const type = params.get("type") as EmailOtpType | null;
  const recovery = type === "recovery" || params.get("flow") === "recovery";
  const next = safePath(params.get("next"), recovery ? "/wachtwoord-herstellen" : "/profiel?welkom=1");

  const fail = (reason: string) => {
    const target = new URL("/auth/fout", url.origin);
    target.searchParams.set("reden", reason.slice(0, 120));
    if (recovery) target.searchParams.set("flow", "recovery");
    return NextResponse.redirect(target);
  };

  const providerError = params.get("error_code") ?? params.get("error");
  if (providerError) return fail(providerError);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("not_configured");

  const tokenHash = params.get("token_hash");
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    return error ? fail(error.code ?? "verify_failed") : NextResponse.redirect(new URL(next, url.origin));
  }

  const code = params.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error ? fail(error.code ?? "exchange_failed") : NextResponse.redirect(new URL(next, url.origin));
  }

  return fail("missing_token");
}
