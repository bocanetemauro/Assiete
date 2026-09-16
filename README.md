# Assiette — interactieve culinaire academie

Een premium receptenplatform waar je leert koken als een chef: van mise en place tot de laatste penseelstreek op je bord. Gebouwd met **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion** en **Supabase**.

> De hele site is vrij toegankelijk. Een account is optioneel en alleen nodig om favorieten, foto's en eigen recepten te bewaren. Er is nergens een wachtwoordmuur.

## Mappen: website, app en gedeelde kern

```
Website 2/
├─ shared/     de kern: componenten, ontwerp (globals.css), recepten, inloggen, vrienden, Supabase-koppeling
├─ website/    de website: pagina's (src/app), proxy en /auth/confirm → online zetten
├─ app/        de Android-app: pagina's (src/app), NativeBridge, Capacitor en android/ → APK
├─ supabase/   databasemigraties (één database voor website én app)
├─ scripts/    generate-seed.mjs
├─ release/    de gebouwde APK
└─ .env.local  Supabase-gegevens, één keer voor beide
```

- **Verbonden via Supabase.** Website en app gebruiken hetzelfde Supabase-project. Een account dat je op de website maakt werkt in de app, en vrienden, verzoeken en posts zijn overal hetzelfde.
- **Eén keer aanpassen.** Wat in `shared/` staat (bijna alles) komt in beide terecht. Iets alleen voor de website of alleen voor de app? Zet het in `website/src` of `app/src`.
- **Imports.** `@/…` wijst in beide projecten naar `shared/src`; `~/…` naar de eigen `src`-map van dat project.
- **npm workspaces.** Eén `npm install` in de hoofdmap installeert alles; de scripts hieronder werken vanuit de hoofdmap.

## Starten

```bash
npm install
npm run dev        # website op http://localhost:3000
npm run dev:app    # app-versie in de browser op http://localhost:3001
```

Maak eerst een `.env.local` in de **hoofdmap** aan (zie `.env.example`). Website en app lezen allebei dit bestand:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Beide waarden horen publiek te zijn: ze staan in de browser en alle toegang wordt in de database afgedwongen met Row Level Security. Zet hier **nooit** de `service_role`-key of het databasewachtwoord neer.

Zonder deze variabelen blijft de site werken — je kunt alle recepten lezen — alleen inloggen en opslaan zijn dan uitgeschakeld.

```bash
npm run build      # productiebuild van de website
npm run typecheck  # TypeScript-controle van website én app
```

### Online zetten

Stel bij je hosting (bijvoorbeeld Vercel) de **Root Directory** in op `website` en zet daar dezelfde twee environment variables. De installatie gebeurt vanuit de hoofdmap, zodat `shared/` wordt meegenomen.

## Android-app

De map `app/` is een installeerbare Android-app (Capacitor) met dezelfde kern als de website, dezelfde Supabase-backend, dezelfde accounts en dezelfde data.

### APK bouwen

```bash
npm install
npm run android:apk
```

Resultaat: **`release/Assiette-<versie>.apk`** — één bestand dat je via WhatsApp, Google Drive, e-mail of USB naar je telefoon stuurt en daar opent om te installeren.

Wat het script doet:

1. `next build` in `app/` → statische export in `app/out/`
2. eenmalig een ondertekensleutel aanmaken (`app/android/assiette-release.jks` + `app/android/keystore.properties`)
3. `npx cap sync android` → web-bestanden in het Android-project
4. `gradlew assembleRelease` → ondertekende release-APK
5. kopiëren naar `release/` en de handtekening controleren met `apksigner`

Vereist: Node ≥ 22, JDK 21 en de Android SDK (platform 35 + build-tools 35.0.0) in `ANDROID_HOME` of `%LOCALAPPDATA%\Android\Sdk`.

> **Bewaar `app/android/assiette-release.jks` en `app/android/keystore.properties` goed** (niet in git). Een update van de app moet met dezelfde sleutel ondertekend zijn; zonder die sleutel moet je de app eerst verwijderen voordat een nieuwe versie installeert.

### Installeren op een Samsung

1. Stuur het `.apk`-bestand naar je telefoon en tik erop.
2. Android vraagt eenmalig toestemming om apps uit deze bron (bv. Mijn bestanden of WhatsApp) te installeren → **Instellingen → Toestaan**.
3. Kies **Installeren**. Eventueel waarschuwt Play Protect dat de app onbekend is (hij komt niet uit de Play Store) → **Toch installeren**.

### Hoe de app werkt

- **Eigen project.** `app/next.config.ts` maakt een statische export en zet `NEXT_PUBLIC_NATIVE_APP`; de website heeft zijn eigen config met server, proxy en `/auth/confirm`.
- **Zelfde accounts.** De app praat rechtstreeks met Supabase. De sessie staat in de opslag van de app, dus je blijft ingelogd na afsluiten.
- **E-mailverificatie.** Links in de bevestigings- en resetmail openen de app via de deeplink `nl.assiette.app://auth/confirm` (`app/src/components/NativeBridge.tsx`).
- **Routering.** Capacitor serveert standaard voor elk pad de start-`index.html`. `app/android/…/MainActivity.java` leidt elk verzoek naar het juiste geëxporteerde bestand, en eigen recepten van leden (slugs die pas na het bouwen bestaan) naar de placeholderpagina `/recepten/_/`.
- **Weergave.** Fullscreen zonder browserbalk, statusbalk in de kleur van de pagina, marges voor Android 15 edge-to-edge, app-icoon en splashscreen in de huisstijl.

### Eenmalig instellen in Supabase

Dashboard → **Authentication → URL Configuration → Redirect URLs** → voeg toe:

```
nl.assiette.app://**
```

Zonder deze regel wordt het e-mailadres na het klikken op de link wél bevestigd, maar opent de link niet automatisch de app; je logt dan gewoon zelf in de app in.

## Pagina's

| Route | Inhoud |
|---|---|
| `/` | Hero met scroll-geanimeerd bord, *Vandaag op het menu*, horizontale scroll-reis *Van ingrediënt tot bord*, plating-stapper, features |
| `/recepten` | Bibliotheek met 52 recepten: zoeken, snelkoppelingen (desserts, moeilijke gerechten, snel klaar …), filters op categorie, gang, niveau en tijd, sortering en *meer laden*; filters staan in de URL |
| `/recepten/[slug]` | Receptpagina: ingrediënten met porties en afvinken, benodigd materiaal, technieken, stappen met meelopende illustratie en timers, dresseer-minifilm op scroll, plating-gids, cheftip, wijnsuggestie, *Laat je bord zien* |
| `/kookmodus/[slug]` | Fullscreen kookmodus: één stap tegelijk, timers, swipe en pijltjestoetsen, ingrediëntenlade, scherm blijft aan |
| `/vandaag` | Menu du jour: elke dag een andere gebalanceerde selectie van vijf recepten |
| `/plating` | Plating-academie: zes stappen, principes, gereedschap, inspiratie |
| `/mijn-keuken` | Persoonlijke bibliotheek: Alles, Favorieten, Zelf gemaakt, Opnieuw maken, Mijn recepten |
| `/eigen-recept` | Recepteditor met sleepbare ingrediënten, stappen met illustratie, timer en foto, plating, cheftip, materiaal en zichtbaarheid. `?bewerk=<id>` om te bewerken |
| `/profiel` | Dashboard met statistieken, grafiek per maand, eigen en gemaakte recepten, foto's en instellingen (toonbare naam, @username, bio) |
| `/vrienden` | Feed met posts van jezelf en je vrienden, zoeken op @username, *Mijn vrienden*, inkomende en uitgaande verzoeken |
| `/kok?u=<username>` | Profiel van een lid: naam, @username, foto, aantal vrienden; posts alleen als je vrienden bent |
| `/inloggen`, `/registreren` | Registratie met e-mailbevestiging, inloggen met duidelijke foutmeldingen |
| `/wachtwoord-vergeten`, `/wachtwoord-herstellen` | Resetlink aanvragen en een nieuw wachtwoord kiezen |
| `/auth/confirm`, `/auth/fout` | Landingspunt van de e-maillinks en een leesbare uitleg als een link verlopen is |

## Architectuur

```
website/src/
  app/                     routes van de website (server components, statisch waar mogelijk)
  proxy.ts                 ververst de Supabase-sessie op elke request (Next 16: proxy i.p.v. middleware)
  lib/supabase/server.ts   server-client voor /auth/confirm
app/src/
  app/                     routes van de app (statische export, plus placeholder voor eigen recepten)
  components/NativeBridge  deeplinks uit e-mails en de statusbalk
shared/src/
  styles/globals.css       ontwerp-tokens en Tailwind
  components/
    illustrations/         SVG-illustratiesysteem ("premium culinary comic")
      kit.tsx              inktlijnen, verlopen, stoom, spetters, deterministische random
      cookware.tsx         pan, steelpan, kookpot, mes, garde, blender, brander …
      ingredients.tsx      steak, vis, groenten, kruiden … in 3/4-aanzicht
      scenes.tsx           geanimeerde kooktechnieken (TechniqueScene)
      dishes.tsx           12 handgetekende borden in lagen
      composer.tsx         stelt uit een spec (bord, saus, hoofdonderdeel, garnituur, kruiden) een uniek bord samen
      palette.ts           ~90 kleurtripletten voor sauzen, hoofdonderdelen en garnituur
  lib/
    types.ts               *Row-types = databasetabellen; RecipeDetail/CookedEntry voor de UI
    data/                  de 52 platformrecepten als code + normalisatie naar de UI
    supabase/
      config.ts            environment variables
      client.ts            browser-client (website: cookies, app: opslag van de app)
      queries.ts           leesquery's en de vertaling van rijen naar UI-types
    services/
      images.ts            foto's verkleinen in de browser
      photos.ts            uploads naar Supabase Storage (altijd in de eigen map)
      storage.ts           kleine voorkeuren per bezoeker (localStorage)
    store/kitchen.tsx      React-context: de enige data-API die de UI gebruikt
    store/social.tsx       telt openstaande vriendschapsverzoeken (badge + melding)
    social.ts              vrienden, verzoeken, profielen en posts
    username.ts            username-regels, gedeeld door UI en foutmeldingen
scripts/generate-seed.mjs  genereert de seed-migraties uit shared/src/lib/data
supabase/migrations/       schema, RLS, RPC, opslag en de seed van alle 52 recepten
```

### Recepten: code én database

De 52 platformrecepten staan als TypeScript in `shared/src/lib/data` én in de database, met **dezelfde UUID's**. De pagina's worden statisch uit de code gegenereerd (snel, werkt zonder netwerk), terwijl de databasekopie ervoor zorgt dat favorieten en gekookte gerechten via foreign keys naar een echt recept verwijzen.

Wijzig je een recept in `shared/src/lib/data`, draai dan:

```bash
node scripts/generate-seed.mjs   # valideert en herschrijft supabase/migrations/*_seed_*.sql
```

Het script controleert dezelfde regels als de check-constraints in de database (slugs, lengtes, categorieën, timers) en weigert te schrijven als er iets niet klopt.

### Datamodel

`profiles`, `categories`, `recipes`, `recipe_categories`, `ingredients`, `recipe_ingredients`, `recipe_steps`, `plating_steps`, `recipe_images`, `saved_recipes` (favorieten en "opnieuw maken"), `cooked_recipes`, `user_recipes`, `friendships` en `posts`.

Alle tabellen hebben Row Level Security:

- **Lezen** — platformrecepten en publieke ledenrecepten zijn voor iedereen leesbaar, ook zonder account. Persoonlijke tabellen (favorieten, gekookte gerechten, eigen collectie) geven anonieme bezoekers nul rijen.
- **Schrijven** — alleen met een account en alleen op je eigen rijen. `anon` heeft bovendien helemaal geen schrijfrechten meer op tabelniveau, zodat één verkeerde policy nooit genoeg is.
- **Foto's** — de bucket `recipe-photos` is publiek leesbaar, maar je kunt uitsluitend schrijven in je eigen map (`<user-id>/…`).

- **Profielen** — gebruikers kunnen alleen `display_name`, `username`, `bio` en `avatar_url` van hun eigen rij wijzigen (kolomrechten + RLS).

Een eigen recept wordt in één keer opgeslagen met de RPC `save_user_recipe(payload, recipe_id)`. Die draait als *security invoker*, dus RLS geldt gewoon; hij valideert de foto-paden en vervangt de onderliggende rijen atomair.

### Authenticatie

Supabase Auth met e-mail en wachtwoord. Wachtwoorden worden nooit door deze applicatie opgeslagen of gehasht — dat doet Supabase.

1. Registreren → Supabase stuurt een bevestigingsmail.
2. De link komt binnen op `/auth/confirm`, die zowel `token_hash` (werkt op elk apparaat) als de PKCE-`code` afhandelt en beschermt tegen open redirects.
3. Bevestigd → door naar `/profiel?welkom=1`; mislukt of verlopen → `/auth/fout` met uitleg en een knop voor een nieuwe link.
4. De sessie staat in cookies en wordt door `website/src/proxy.ts` bij elke request ververst, dus je blijft ingelogd na verversen en herstarten.

### Vrienden en posts

Elke gebruiker heeft een **toonbare naam** (vrij, niet uniek) en een **username** (uniek). Username-regels, afgedwongen in de database én in de UI: 3–20 tekens, alleen `a-z`, `0-9` en `_`, geen spaties. Hoofdletters en een `@` vooraan worden genormaliseerd (`@Mauro_2009` → `mauro_2009`), dus `Mauro` en `mauro` zijn dezelfde username. De unieke index op `profiles.username` is de echte garantie; de live check tijdens het typen (`username_available`) is alleen gemak.

**Vriendschappen** (`friendships`): één rij per paar, `pending` of `accepted`.

- Een unieke index op het ongeordende paar voorkomt dubbele verzoeken en dubbele vriendschappen, in beide richtingen.
- Alleen de ontvanger kan `pending` → `accepted` zetten; een trigger blokkeert elke andere wijziging (partijen omwisselen, terugzetten). Weigeren, annuleren en ontvrienden = de rij verwijderen, door een van beide partijen.
- `send_friend_request(username)` (security invoker) accepteert automatisch als de ander jou al een verzoek had gestuurd.

**Posts** (`posts`) zijn privé: de SELECT-policy geeft een post alleen terug aan de auteur en aan geaccepteerde vrienden (`private.is_friend_of`, in een schema dat niet via de API bereikbaar is). Dit geldt dus ook voor directe API-calls, niet alleen voor de interface. Anonieme bezoekers hebben geen enkel recht op de tabel. Posts kunnen niet worden gewijzigd, alleen verwijderd door de auteur.

**Postfoto's** staan in de *privé* bucket `post-photos` (`<user-id>/<uuid>.jpg`). Uploaden kan alleen in je eigen map; lezen alleen als de foto van jou is of bij een post hoort die je mag zien. De app haalt ze op met tijdelijke signed URLs.

**Profielen van anderen**: ingelogde leden kunnen naam, username, foto en bio van elkaar zien (nodig om te zoeken). `member_overview(username)` geeft daarnaast het aantal vrienden en jullie relatie terug — zonder de vriendenlijst zelf prijs te geven.

## Ontwerp

- Typografie: Cormorant Garamond (titels) en Manrope (tekst)
- Kleuren: ivoor, inkt, messing, bordeaux en salie (tokens in `shared/src/styles/globals.css`)
- Animaties: Framer Motion voor overgangen, scroll en plating; CSS-keyframes voor lussen in illustraties, die buiten beeld pauzeren en `prefers-reduced-motion` respecteren

## Content

Alle recepten, teksten en illustraties zijn origineel voor Assiette geschreven en getekend. Er worden geen recepten, foto's of teksten van derden overgenomen en er is geen externe recept-API in gebruik.
