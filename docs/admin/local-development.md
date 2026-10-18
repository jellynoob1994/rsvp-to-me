---
title: Lokale ontwikkeling op Windows en WSL
description: Draai de applicatie rechtstreeks in WSL met tijdelijke Docker-services.
category: Aan de slag
audience: admin
order: 15
---

# Lokale ontwikkeling op Windows en WSL

Voor de snelste lokale ontwikkelwerkwijze draai je de Next.js-applicatie rechtstreeks binnen WSL en gebruik je Docker Desktop alleen voor PostgreSQL en Redis. Bewaar de repository onder je Linux-thuismap (bijvoorbeeld `~/projects/rsvp-to-me`), niet onder `/mnt/c`.

## Eenmalige installatie

Installeer Node met nvm en gebruik daarna de versie die in de repository is vastgelegd:

```bash
nvm install
nvm use
```

Repositorystappen kiezen automatisch de versie uit `.nvmrc`. Als je Node- of npm-opdrachten uitvoert vanuit een niet-interactieve shell, laad je eerst `$HOME/.nvm/nvm.sh`. Als die shell de Windows-variabelen `TEMP` of `TMP` heeft overgenomen, stel je vóór het uitvoeren van Node-tools `TMPDIR`, `TMP` en `TEMP` in op `/tmp`.

Houd de hoofdafhankelijkheid `@types/node` op de ondersteunde hoofdversie Node 22. Deze gebruikt nu `^22.20.4`, ter vervanging van de Node 26-declaraties die API’s konden toestaan die niet in de uitgerolde runtime beschikbaar zijn. Patchnummers van declaratietypen hoeven niet overeen te komen met het patchnummer van Node zelf. Dependabot blijft controleren op updates voor Node 22-typen; een upgrade naar een nieuwe hoofdversie van de typen vereist een gecoördineerde wijziging van de runtime. Controleer bij een wijziging van de Node-hoofdversie tegelijk `.nvmrc`, de engines in `package.json`, de Docker-basisimage, CI en de declaratietypen. Voer daarna de typecontroles en container-QC uit.

Schakel de WSL-integratie van Docker Desktop in voor je Ubuntu-distributie. Het bestand `docker-compose.override.yml` van deze repository schakelt de applicatiecontainer uit, publiceert PostgreSQL en Redis alleen op lokale loopback-poorten en bewaart hun gegevens in benoemde Docker-volumes.

## Dagelijkse werkwijze

Synchroniseer de ontwikkelservices wanneer je van branch wisselt of wijzigingen ophaalt:

```bash
npm run dev:sync
```

Start de applicatie in een aparte WSL-terminal:

```bash
npm run dev
```

Open `http://localhost:3000`. De Next.js-ontwikkelserver houdt bronbestanden in de gaten. Herstart deze alleen na wijzigingen aan afhankelijkheden of de omgevingsconfiguratie.

De volledige controle via `scripts/preflight.sh` gebruikt poort 3001 voor de tijdelijke E2E-app. Die poort moet vrij zijn voordat de E2E-fase start; preflight stopt met een duidelijke foutmelding als er al een ander proces luistert. De tijdelijke npm-/Next.js-procesgroep wordt bij iedere afsluitroute gestopt, zonder de normale ontwikkelserver op poort 3000 te beïnvloeden.

De Playwright-tests van de volledige controle omvatten authenticatie en uitloggen, toegangscontroles voor evenementen, het aanmaken en bewerken van aanmeldingen en de validatie daarvan, afgeschermde exports en geauthenticeerde flows voor het aanmaken van organisatoren en het beheren van instellingen. De E2E-installatie maakt bij elke uitvoering opnieuw deterministische `e2e-*`-testgegevens aan; na afloop worden die verwijderd.

Als een branch `package.json` of `package-lock.json` wijzigt, breng je de geïnstalleerde afhankelijkheden weer in overeenstemming met:

```bash
scripts/dev-sync.sh --deps
```

De repository legt `esbuild` vast op de gepatchte versie 0.28.1 om de kwetsbaarheid voor padtraversal in de Windows-ontwikkelserver te voorkomen die wordt beschreven in [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr). Behoud deze beperking zolang een transitieve afhankelijkheid anders een kwetsbare versie kan installeren.

Andere beveiligingsoverschrijvingen houden React Email op de gepatchte Next.js 16-release, brengen PostCSS naar de gepatchte release-lijn en beperken de ontwikkeltooling van Prisma tot gepatchte versies van `find-my-way` en Valibot.

ESLint 9 haalt nog steeds `minimatch` 3 binnen. De oude aanroepbare API van `brace-expansion` is niet compatibel met de benoemde export in de enige gepatchte release. De tijdelijke adapter onder `vendor/brace-expansion-compat/` stelt beide interfaces beschikbaar en gebruikt voor de uitbreiding de officiële gepatchte package. De hoofdmap bevat de instelling `install-links=true` in `.npmrc`, zodat npm deze lokale adapter als een regulier package installeert in plaats van als een symlink die afhankelijk is van de mapdiepte. Verwijder de adapter, de overschrijving of de npm-instelling niet afzonderlijk. Wekelijkse Dependabot-updates en [issue #546](https://github.com/joe-cole1/rsvp-to-me/issues/546) volgen de upstream-releases en de checklist voor een gecoördineerde verwijdering.

## Afhankelijkheidsupdates

Dependabot controleert npm-afhankelijkheden dagelijks en houdt maximaal 10 PR’s voor versie-updates tegelijk open. Er kunnen nieuwe updates verschijnen zodra eerdere PR’s worden gesloten; controleer de lijst daarom na iedere reeks opnieuw.

Next.js en `eslint-config-next` zitten in dezelfde updategroep en moeten exact dezelfde release gebruiken. De regressiebasis vereist Next.js 16.3.8 of nieuwer, inclusief alle vastgelegde Next.js-runtime-, native compiler- en ESLint-packages. Dit is een minimale beveiligingsversie; voor een gecoördineerde, nieuwere patch hoef je de test niet aan te passen om die versie toe te staan. Behoud bij het opnieuw genereren van de lockfile ook de gepatchte versie 1.2.2 of hoger van `source-map-js`; oudere releases mislukken bij de productie-audit van afhankelijkheden.

Roboto staat in `app/font-files/` en wordt geladen via `next/font/local`. Sommige antwoorden van Google Fonts gebruiken URL’s zonder bestandsextensie, zoals `/l/font?kit=...&skey=...`. Next.js 16.3.8 splitst de querystring daarvan onjuist en meldt `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`. Dit is het upstream parserprobleem dat wordt bijgehouden in [Next.js #99114](https://github.com/vercel/next.js/issues/99114), niet een ontbrekend npm-package of een afhankelijkheid die alleen op AMD64 ontbreekt. Het lokale bestand behoudt Roboto’s normale en vette gewichten, CSS-variabele, glyphdekking en lazy loading. Turbopack blijft de productie-bundler. De bron, licentie en reproductiedetails van het lettertype staan in `app/font-files/README.md`; andere Google Fonts-families vereisen tijdens het bouwen nog steeds netwerktoegang.

React, React DOM en hun declaratietypen zitten in één updategroep; de twee runtime-packages moeten exact op dezelfde versie uitkomen. Vitest en de bijbehorende coverage-provider zitten eveneens in één updategroep en moeten op overeenkomende versies blijven. Gerelateerde wijzigingen samenvoegen in één PR vervangt geen compatibiliteitscontrole, zeker niet bij grote versie-upgrades.

Vitest en `@vitest/coverage-v8` gebruiken versie 5.0.2, die de Node 22-runtime van deze repository ondersteunt. De componenttestconfiguratie importeert `@testing-library/jest-dom/vitest`, zodat de runtime-matchers en TypeScript-declaraties aan Vitest worden gekoppeld. Houd ge-hoiste mock-aanroepen op moduleniveau en wacht op asynchrone assertions; Vitest 5 dwingt beide af en wist standaard vóór iedere test de aanroepgeschiedenis van mocks.

CI en beide preflight-modi voeren `npm run test:coverage` uit voor de unittests. Daarbij blijven de drempels uit `vitest.config.ts` gelden: 70% voor branches en 80% voor statements, functies en regels. Coverage-rapporten staan in `coverage/`; andere gegenereerde Vitest-rapporten worden opgeslagen in de genegeerde map `.vitest/`. Controleer na updates niet alleen de percentages, maar ook welke bestanden in de coverage zijn opgenomen. Voer daarna de afzonderlijke integratie- en componentsuites, typecontroles en browsertests uit.

Zod 4.6.5 gebruikt Unicode-codepunten voor ingebouwde tekenreekslimieten; deze wijziging werd geïntroduceerd in versie 4.5. De applicatie behoudt bestaande limieten op basis van UTF-16-code-eenheden via `lib/string-length.ts`, overeenkomstig JavaScript `String.length` en HTML `maxlength`. Gebruik deze controles voor begrensde tekst in de gedeelde formulier- en e-mailsjabloonschema’s en behoud de bestaande volgorde van trim- en transformatiestappen per veld. Voer bij Zod-updates de regressietests voor Unicode-grenzen en de volledige preflight uit, inclusief authenticatie, aanmeldingen aanmaken/bewerken, vragenlijstvalidatie, URL-beperkingen en e-mailsjabloontests. Vereis geslaagde CI en controles van productiecontainers op beide architecturen voordat je samenvoegt, en herhaal de controles daarna op `main`.

React-updates vereisen ook de componentsuite en tests die React Email-sjablonen en -voorinstellingen renderen. Deze gebruiken de opgegeven runtime-packages, terwijl de App Router de React-build van Next.js gebruikt. Voer ook de volledige browsersuite en productiebuild uit, met controles voor het aanmaken en bewerken van aanmeldingen, formulierinzendingen, dialoogfocus en organisatienavigatie. Controleer de types van de applicatie en de tests nadat beide declaratietypen zijn bijgewerkt.

Voer voor patches aan ontwikkeltools zoals `tsx`, `@testing-library/user-event` en de React Email CLI een schone installatie uit en voer de bestaande unit-, component- en typecontroles uit. Behoud de beveiligingsoverschrijvingen. Vereis vóór het samenvoegen geslaagde CI en productiecontainer-QC op zowel AMD64 als ARM64; de containercontroles testen ook het vullen van de database via `tsx`. Herhaal deze controles na het samenvoegen op `main` voordat je aan de volgende updategroep begint.

Voer bij updates van `@testing-library/react` de volledige componentsuite uit en controleer waarschuwingen over event-dispatch of `act()`. Controleer bij updates van Prettier de formattering van bijgehouden bestanden voordat je samenvoegt en beoordeel eventuele herschrijvingen. Een formatterpatch kan Markdown of uitvoer in template literals wijzigen.

Houd `@playwright/test` en `PLAYWRIGHT_IMAGE` in `scripts/run-e2e-docker.sh` op dezelfde release. Playwright 1.63 gebruikt de image `v1.63.0-noble`, gebaseerd op Ubuntu 24.04. Native Playwright-runs ondersteunen Ubuntu 20.04 niet meer; gebruik een ondersteunde WSL-distributie zoals Ubuntu 22.04 of 24.04. De applicatie blijft de Node-versie gebruiken die in `.nvmrc` staat.

Voer na een Playwright-update de volledige preflight en browsersuite uit. CI controleert ook of de Docker-imageversie overeenkomt met het geïnstalleerde package en start de meegeleverde Chromium-browser om rendering, klikken en screenshots te testen. Deze imagecontrole draait zonder netwerktoegang of database; de volledige applicatieflows worden in een aparte E2E-stap uitgevoerd. Op Linux ARM64 gebruikt Playwright vanaf versie 1.63 Chrome for Testing.

Wijzigingen aan `jsdom` of `tailwind-merge` vereisen eveneens de component- en browsersuites. Controleer formuliervalidatie, dialooginteracties en gastenlijstgedrag; de DOM-simulatie kan veranderen terwijl de applicatiecode hetzelfde blijft. Vergelijk bij wijzigingen aan class-merging bestaande combinaties van classes en overschrijvingen met een eigen `className`.

Upgrade de Prisma CLI (`prisma`), `@prisma/client` en `@prisma/adapter-pg` samen. Prisma 7.10 blijft de bestaande `prisma.config.ts` gebruiken, inclusief het pad `prisma/postgres-migrations`; deze afhankelijkheidsupdate vereist geen andere configuratiebestandsnaam of databaseschemamigratie. Genereer de client opnieuw en voer de volledige preflight uit voor database-updates. De PostgreSQL-integratiesuite controleert transactie-rollback en constraintfouten, terwijl container-QC de migraties, seeding, healthcheck en pre-migratieback-ups op beide architecturen controleert.

Prisma Studio 7.10 bindt aan loopback en controleert de oorsprong van de browser. Open het lokale adres `localhost` of `127.0.0.1` dat wordt getoond door `npm run db:studio`.

## Tijdelijke ontwikkelgegevens resetten

Deze opdracht verwijdert de **lokale ontwikkelvolumes** van PostgreSQL en Redis definitief, maakt ze opnieuw aan, past migraties toe en laadt de basisgegevens:

```bash
npm run dev:reset -- --confirm
```

De opdracht wijzigt geen broncode, `.env` of uitrolgegevens. Gebruik deze nooit voor een productieomgeving.

## Alleen WSL-opdrachten

Voer Git-, npm-, Prisma-, test- en Docker-opdrachten voor deze repository vanuit WSL uit. Windows Git en WSL Git door elkaar gebruiken kan misleidende wijzigingen opleveren in regeleinden en uitvoerbare bestandsrechten in dezelfde werkmap.

### Authenticatiecontroles voor GitHub CLI

`gh auth status` kan een verouderd token in `hosts.yml` melden, zelfs wanneer een andere bron van inloggegevens live GitHub-verzoeken wel correct verifieert. Beschouw deze uitvoer als een aanwijzing bij het oplossen van problemen, niet als bewijs dat GitHub-toegang niet werkt.

Controleer vóór het vernieuwen van inloggegevens de actieve identiteit en probeer de bedoelde alleen-lezen repositoryopdrachten opnieuw:

```bash
gh api user --jq .login
gh repo view --json nameWithOwner,defaultBranchRef
gh pr list --head "$(git branch --show-current)" --state open
```

Als deze live opdrachten slagen, hoef je de authenticatie niet te herstellen. Mislukt een opdracht doordat een sandbox of beperkte shell het netwerk blokkeert, probeer dan opnieuw met normale netwerktoegang. Voer `gh auth refresh` of `gh auth login` pas uit als de identiteits- en repositorycontroles nog steeds echte authenticatiefouten opleveren.
