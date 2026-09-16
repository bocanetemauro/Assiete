import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import path from "node:path";

/** Hoofdmap van de repository, met website/, app/ en shared/ erin. */
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * De Supabase-gegevens staan één keer in .env.local in de hoofdmap en gelden voor
 * website én app: zelfde database, dus dezelfde accounts, vrienden en posts.
 * Variabelen die al gezet zijn (bijvoorbeeld bij de hosting) gaan altijd voor.
 */
function supabaseEnv(): Record<string, string> {
  const file = path.join(REPO_ROOT, ".env.local");
  if (existsSync(file)) process.loadEnvFile(file);
  const keys = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  return Object.fromEntries(keys.flatMap((key) => (process.env[key] ? [[key, process.env[key] as string]] : [])));
}

/**
 * De Android-app: een statische export (map out/) die Capacitor in de APK zet.
 * Er draait geen server in de app; hij praat rechtstreeks met dezelfde Supabase
 * als de website. Alle pagina-onderdelen komen uit ../shared.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // Elke route krijgt zijn eigen map met index.html; dat werkt in een WebView
  // zonder server die rewrites doet.
  trailingSlash: true,
  images: { unoptimized: true },
  env: { ...supabaseEnv(), NEXT_PUBLIC_NATIVE_APP: "1" },
  // shared/ ligt buiten deze map; Next moet de hele repository mogen lezen.
  turbopack: { root: REPO_ROOT },
  outputFileTracingRoot: REPO_ROOT,
};

export default nextConfig;
