import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android-app rond de statische export in app/out/ (`npm run build:app`).
 * De app praat rechtstreeks met Supabase, dus dezelfde accounts en dezelfde data
 * als op het web. Er draait geen eigen server in de app.
 */
const config: CapacitorConfig = {
  appId: "nl.assiette.app",
  appName: "Assiette",
  webDir: "out",
  android: {
    allowMixedContent: false,
    // Android 15 tekent apps standaard onder de status- en navigatiebalk door.
    // "auto" geeft de WebView marges, zodat navbar en onderbalk vrij blijven.
    adjustMarginsForEdgeToEdge: "auto",
  },
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: "#faf7f2",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
