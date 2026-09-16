# Assiette — interactieve culinaire academie

Een premium receptenplatform waar je leert koken als een chef: van mise en place tot de laatste penseelstreek op je bord. Gebouwd met **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion** en **Supabase**.

> De hele site is vrij toegankelijk. Een account is optioneel en alleen nodig om favorieten, foto's en eigen recepten te bewaren. Er is nergens een wachtwoordmuur.

## Starten

```bash
npm install
npm run dev
```

Maak eerst een `.env.local` aan (zie `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Beide waarden horen publiek te zijn: ze staan in de browser en alle toegang wordt in de database afgedwongen met Row Level Security. Zet hier **nooit** de `service_role`-key of het databasewachtwoord neer.

Zonder deze variabelen blijft de site werken — je kunt alle recepten lezen — alleen inloggen en opslaan zijn dan uitgeschakeld.

```bash
npm run build      # productiebuild
npm run typecheck  # TypeScript-controle
```

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
| `/profiel` | Dashboard met statistieken, grafiek per maand, eigen en gemaakte recepten, foto's en instellingen |
| `/inloggen`, `/registreren` | Registratie met e-mailbevestiging, inloggen met duidelijke foutmeldingen |
| `/wachtwoord-vergeten`, `/wachtwoord-herstellen` | Resetlink aanvragen en een nieuw wachtwoord kiezen |
| `/auth/confirm`, `/auth/fout` | Landingspunt van de e-maillinks en een leesbare uitleg als een link verlopen is |

## Architectuur

```
src/
  app/                     routes (server components, statisch waar mogelijk)
  proxy.ts                 ververst de Supabase-sessie op elke request (Next 16: proxy i.p.v. middleware)
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
      client.ts            browser-client (sessie in cookies)
      server.ts            server-client voor route handlers
      queries.ts           leesquery's en de vertaling van rijen naar UI-types
    services/
      images.ts            foto's verkleinen in de browser
      photos.ts            uploads naar Supabase Storage (altijd in de eigen map)
      storage.ts           kleine voorkeuren per bezoeker (localStorage)
    store/kitchen.tsx      React-context: de enige data-API die de UI gebruikt
scripts/generate-seed.mjs  genereert de seed-migraties uit src/lib/data
supabase/migrations/       schema, RLS, RPC, opslag en de seed van alle 52 recepten
```

### Recepten: code én database

De 52 platformrecepten staan als TypeScript in `src/lib/data` én in de database, met **dezelfde UUID's**. De pagina's worden statisch uit de code gegenereerd (snel, werkt zonder netwerk), terwijl de databasekopie ervoor zorgt dat favorieten en gekookte gerechten via foreign keys naar een echt recept verwijzen.

Wijzig je een recept in `src/lib/data`, draai dan:

```bash
node scripts/generate-seed.mjs   # valideert en herschrijft supabase/migrations/*_seed_*.sql
```

Het script controleert dezelfde regels als de check-constraints in de database (slugs, lengtes, categorieën, timers) en weigert te schrijven als er iets niet klopt.

### Datamodel

`profiles`, `categories`, `recipes`, `recipe_categories`, `ingredients`, `recipe_ingredients`, `recipe_steps`, `plating_steps`, `recipe_images`, `saved_recipes` (favorieten en "opnieuw maken"), `cooked_recipes` en `user_recipes`.

Alle tabellen hebben Row Level Security:

- **Lezen** — platformrecepten en publieke ledenrecepten zijn voor iedereen leesbaar, ook zonder account. Persoonlijke tabellen (favorieten, gekookte gerechten, eigen collectie) geven anonieme bezoekers nul rijen.
- **Schrijven** — alleen met een account en alleen op je eigen rijen. `anon` heeft bovendien helemaal geen schrijfrechten meer op tabelniveau, zodat één verkeerde policy nooit genoeg is.
- **Foto's** — de bucket `recipe-photos` is publiek leesbaar, maar je kunt uitsluitend schrijven in je eigen map (`<user-id>/…`).

Een eigen recept wordt in één keer opgeslagen met de RPC `save_user_recipe(payload, recipe_id)`. Die draait als *security invoker*, dus RLS geldt gewoon; hij valideert de foto-paden en vervangt de onderliggende rijen atomair.

### Authenticatie

Supabase Auth met e-mail en wachtwoord. Wachtwoorden worden nooit door deze applicatie opgeslagen of gehasht — dat doet Supabase.

1. Registreren → Supabase stuurt een bevestigingsmail.
2. De link komt binnen op `/auth/confirm`, die zowel `token_hash` (werkt op elk apparaat) als de PKCE-`code` afhandelt en beschermt tegen open redirects.
3. Bevestigd → door naar `/profiel?welkom=1`; mislukt of verlopen → `/auth/fout` met uitleg en een knop voor een nieuwe link.
4. De sessie staat in cookies en wordt door `src/proxy.ts` bij elke request ververst, dus je blijft ingelogd na verversen en herstarten.

## Ontwerp

- Typografie: Cormorant Garamond (titels) en Manrope (tekst)
- Kleuren: ivoor, inkt, messing, bordeaux en salie (tokens in `src/app/globals.css`)
- Animaties: Framer Motion voor overgangen, scroll en plating; CSS-keyframes voor lussen in illustraties, die buiten beeld pauzeren en `prefers-reduced-motion` respecteren

## Content

Alle recepten, teksten en illustraties zijn origineel voor Assiette geschreven en getekend. Er worden geen recepten, foto's of teksten van derden overgenomen en er is geen externe recept-API in gebruik.
