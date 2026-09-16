/**
 * Alles wat anders moet in de Android-app (Capacitor) dan op de website.
 *
 * `NEXT_PUBLIC_NATIVE_APP` wordt alleen gezet in app/next.config.ts, dus op de
 * website is `IS_NATIVE_APP` altijd false en verandert daar niets.
 */

export const IS_NATIVE_APP = process.env.NEXT_PUBLIC_NATIVE_APP === "1";

/** Eigen URL-schema van de app (zie AndroidManifest.xml). */
export const APP_SCHEME = "nl.assiette.app";

/** Waar Supabase na het klikken op een e-maillink naartoe stuurt: terug de app in. */
export function nativeAuthRedirect(next: string): string {
  return `${APP_SCHEME}://auth/confirm?next=${encodeURIComponent(next)}`;
}

/**
 * Eigen recepten hebben een slug die pas na het bouwen bestaat. In de app wordt
 * elke onbekende `/recepten/<slug>/` door de native laag naar de placeholderpagina
 * `/recepten/_/` geleid; de echte slug lezen we dan uit de URL.
 */
export const DYNAMIC_SLUG_PLACEHOLDER = "_";

export function slugFromPath(pathname: string, section: "recepten" | "kookmodus"): string | null {
  const match = pathname.match(new RegExp(`^/${section}/([^/]+)/?$`));
  return match ? decodeURIComponent(match[1]) : null;
}
