/**
 * Bouwt de Android-app als één installeerbaar bestand: release/Assiette-<versie>.apk
 *
 *   npm run android:apk      volledige build: export → sync → ondertekende APK
 *   npm run build:app        alleen de statische export voor de app (app/out/)
 *
 * Beide werken vanuit de hoofdmap én vanuit app/. De APK komt in release/ in de hoofdmap.
 *
 * Vereist: Node ≥ 22, JDK 21 en de Android SDK (platform 35, build-tools 35.0.0).
 * De SDK wordt gezocht in ANDROID_HOME of %LOCALAPPDATA%\Android\Sdk.
 */

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "..");
const android = join(root, "android");
const isWindows = process.platform === "win32";
const onlyExport = process.argv.includes("--export-only");

function run(command, args, options = {}) {
  console.log(`\n› ${command} ${args.join(" ")}`);
  // Op Windows via de shell (nodig voor .bat); paden met spaties tussen aanhalingstekens.
  const quote = (value) => (isWindows && value.includes(" ") ? `"${value}"` : value);
  const cmd = quote(command);
  const result = spawnSync(cmd, args.map(quote), { stdio: "inherit", shell: isWindows, cwd: root, ...options, env: { ...process.env, ...options.env } });
  if (result.status !== 0) {
    console.error(`\n✖ Mislukt: ${command} ${args.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

/* 1. Statische export van de app (pagina's uit app/src, kern uit shared/) -------- */
run("npx", ["next", "build"]);
if (onlyExport) {
  console.log("\n✔ Export klaar in app/out/");
  process.exit(0);
}

/* 2. Android SDK vinden -------------------------------------------------------- */
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || (process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Android", "Sdk") : "");
if (!sdk || !existsSync(join(sdk, "platforms"))) {
  console.error("\n✖ Android SDK niet gevonden. Installeer Android Studio of zet ANDROID_HOME.");
  process.exit(1);
}
writeFileSync(join(android, "local.properties"), `sdk.dir=${sdk.replace(/\\/g, "\\\\")}\n`);

/* 3. Ondertekensleutel (eenmalig) ---------------------------------------------- */
const keystoreProps = join(android, "keystore.properties");
if (!existsSync(keystoreProps)) {
  const password = randomBytes(18).toString("base64url");
  const keytool = process.env.JAVA_HOME ? join(process.env.JAVA_HOME, "bin", isWindows ? "keytool.exe" : "keytool") : "keytool";
  console.log("\n› Nieuwe ondertekensleutel aanmaken (android/assiette-release.jks)");
  const result = spawnSync(
    keytool,
    ["-genkeypair", "-keystore", join(android, "assiette-release.jks"), "-alias", "assiette", "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000", "-storepass", password, "-keypass", password, "-dname", "CN=Assiette, O=Assiette, C=NL"],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  if (result.status !== 0) {
    console.error("\n✖ keytool mislukt. Controleer of JDK 21 geïnstalleerd is.");
    process.exit(1);
  }
  writeFileSync(keystoreProps, `storeFile=assiette-release.jks\nstorePassword=${password}\nkeyAlias=assiette\nkeyPassword=${password}\n`);
}

/* 4. Web-bestanden in het Android-project zetten -------------------------------- */
run("npx", ["cap", "sync", "android"], { env: { ANDROID_HOME: sdk } });

/* 5. Ondertekende release-APK bouwen -------------------------------------------- */
// Expliciet relatief pad: cmd zoekt niet altijd in de huidige map.
run(isWindows ? ".\\gradlew.bat" : "./gradlew", ["assembleRelease", "--no-daemon"], { cwd: android, env: { ANDROID_HOME: sdk } });

/* 6. Naar release/ kopiëren en controleren --------------------------------------- */
const gradle = readFileSync(join(android, "app", "build.gradle"), "utf8");
const version = gradle.match(/versionName "([^"]+)"/)?.[1] ?? "1.0.0";
const built = join(android, "app", "build", "outputs", "apk", "release", "app-release.apk");
if (!existsSync(built)) {
  console.error("\n✖ Geen app-release.apk gevonden.");
  process.exit(1);
}
mkdirSync(join(repoRoot, "release"), { recursive: true });
const target = join(repoRoot, "release", `Assiette-${version}.apk`);
copyFileSync(built, target);

const buildTools = join(sdk, "build-tools", "35.0.0", isWindows ? "apksigner.bat" : "apksigner");
if (existsSync(buildTools)) run(buildTools, ["verify", "--print-certs", target]);

console.log(`\n✔ Klaar: ${target}`);
