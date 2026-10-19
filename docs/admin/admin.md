---
title: Beheerpaneel
description: Uitleg over gebruikers, systeeminstellingen, back-ups en thema’s.
category: Gebruik
audience: admin
order: 50
---

# Handleiding voor het beheerpaneel

Het beheerpaneel geeft je een volledig overzicht van je RSVP to Me-installatie: alle gebruikersaccounts, evenementpagina’s, systeeminstellingen, uitnodigingscodes, thema’s en back-ups. Deze handleiding legt uit wat elk onderdeel doet en hoe je het gebruikt.

---

## Inhoudsopgave

1. [Het beheerpaneel openen](#het-beheerpaneel-openen)
2. [Beheerderstoegang verkrijgen](#beheerderstoegang-verkrijgen)
3. [Overzicht](#overzicht)
4. [Gebruikersbeheer](#gebruikersbeheer)
5. [Evenementenmoderatie](#evenementenmoderatie)
6. [Instellingen voor organisatoren: uitnodigingscodes en registratie](#instellingen-voor-organisatoren-uitnodigingscodes-en-registratie)
7. [E-mailinstellingen](#e-mailinstellingen)
8. [Sms-instellingen](#sms-instellingen)
9. [Databaseback-ups](#databaseback-ups)
10. [Thema-voorinstellingen](#thema-voorinstellingen)
11. [Beveiligingsopmerkingen voor beheerders](#beveiligingsopmerkingen-voor-beheerders)

---

## Het beheerpaneel openen

Je kunt het beheerpaneel op twee manieren openen:

1. **Profielmenu:** als je bent ingelogd met de rol `ADMIN`, klik je rechtsboven op je profielfoto of initialen en kies je **🛡️ Beheerpaneel**.
2. **Rechtstreeks via de URL:** open `/admin` in je browser:
   - Lokaal adres: `http://localhost:3000/admin`
   - Domeinadres: `https://rsvp.jouwdomein.nl/admin`

Alleen gebruikers met de rol `ADMIN` hebben toegang tot het beheerpaneel. Als je `/admin` probeert te openen met een account met minder rechten, stuurt de app je door naar het hoofddashboard.

Het paneel heeft een zijbalk met de tabbladen **Overzicht**, **Gebruikers**, **Evenementen**, **Organisatie-instellingen**, **E-mail**, **Sms**, **Back-ups**, **Thema’s** en **Documentatie**. Op telefoons en kleine tablets wordt de zijbalk vervangen door een menuknop (☰) linksboven. Tik daarop om een uitschuifmenu met dezelfde tabbladen te openen. Het actieve tabblad staat in de URL (bijvoorbeeld `/admin?tab=backups`), zodat je de pagina als bladwijzer kunt opslaan of vernieuwen zonder je plek kwijt te raken.

> **Tip:** Alle beheerdershandleidingen — deze handleiding en die voor installatie, configuratie, e-mail, sms en upgraden — zijn ook in de app beschikbaar via het tabblad **Documentatie** onderaan het menu van het beheerpaneel.

---

## Beheerderstoegang verkrijgen

Je kunt een account op twee manieren de rol Beheerder geven.

### Methode 1: INITIAL_ADMIN_EMAIL (eerste installatie)

Stel de omgevingsvariabele `INITIAL_ADMIN_EMAIL` in je bestand `.env` in op je e-mailadres en start de applicatie opnieuw.

```env
INITIAL_ADMIN_EMAIL="youraddress@domain.com"
```

```bash
docker compose restart app
```

De eerste keer dat je voor dit e-mailadres inlogt door een geldige eenmalige `LOGIN`-link te openen, krijgt je account automatisch de rol `ADMIN` — maar alleen als er nog geen andere beheerders in het systeem zijn. Dit mechanisme is bedoeld voor de eerste installatie. Registratie, een bestaande sessie, toegang tot het dashboard of profiel, links om profielgegevens te wijzigen en het accepteren van een uitnodiging als mede-organisator kunnen deze promotie niet activeren. Vraag bij de eerste installatie of herstel van de eerste beheerder om een nieuwe inloglink en verifieer die.

### Methode 2: promotie via het beheerpaneel

Als er al een actieve beheerder is, kun je andere gebruikers promoveren:

1. Ga naar `/admin` > **Gebruikers**.
2. Zoek de gebruiker op naam of e-mailadres.
3. Klik op de rij van de gebruiker om de gegevens te openen.
4. Kies `ADMIN` in de keuzelijst **Rol**.
5. Sla de wijziging op.

---

## Overzicht

Het tabblad **Overzicht** toont een momentopname van je installatie:

| Cijfer | Wat wordt geteld |
| ---------------- | ------------------------------------------------------------- |
| **Totaal aantal gebruikers** | Alle geregistreerde gasten, organisatoren en beheerders. |
| **Totaal aantal evenementen** | Alle aangemaakte evenementpagina’s, zowel gepubliceerde als geannuleerde. |
| **Totaal aantal aanmeldingen** | Het totaal van alle aanmeldingen van gasten voor alle evenementen. |
| **Check-ins** | Actieve check-ins van complete gezelschappen die via de gastenlijsten zijn vastgelegd. |
| **Uitnodigingscodes** | Het aantal actieve uitnodigingscodes voor registratie van organisatoren. |

---

## Gebruikersbeheer

Ga naar `/admin` > **Gebruikers** om accounts te bekijken en te beheren.

### Gebruikers zoeken

Filter de lijst door bovenaan een zoekopdracht in te voeren. De tabel doorzoekt weergavenamen, e-mailadressen en telefoonnummers.

### Een gebruiker aanmaken

Klik op **+ Gebruiker aanmaken** om het formulier te openen en vul de volgende gegevens in:

- **Naam**, **e-mailadres** en eventueel **telefoonnummer** — e-mailadressen en telefoonnummers moeten uniek zijn.
- **Rol** — `GUEST`, `HOST` of `ADMIN`.

Wanneer je een gebruiker aanmaakt, wordt een eenmalige inloglink verstuurd die 48 uur geldig is, zodat de gebruiker meteen kan inloggen. Als de e-mailbezorging mislukt, wordt het account toch aangemaakt; het versturen van de e-mail blokkeert de accountaanmaak niet.

### Gebruikersrollen

| Rol | Beschrijving | Mogelijkheden |
| ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `GUEST` | Standaard gastaccount. | Kan zich aanmelden, reageren op groepsupdates, reacties plaatsen, items op de meeneemlijst toezeggen en stemmen in peilingen. Kan geen evenementen organiseren. |
| `HOST` | Standaard organisator van evenementen. | Alle gastmogelijkheden, plus evenementpagina’s aanmaken, gastenlijsten beheren, groepsupdates versturen, gasten uitnodigen en mede-organisatoren beheren. |
| `ADMIN` | Systeembeheerder. | Alle mogelijkheden van organisatoren, plus toegang tot het beheerpaneel, alle evenementen zoeken en modereren, accounts verwijderen en systeeminstellingen beheren. |

> **Co-hosts:** a host can appoint other registered users as co-hosts of an individual event. Co-hosts are not a separate role — they get per-event management rights equivalent to the host's (edit event details, theme, cover image, settings and reminders; manage RSVPs, guest list, potluck, polls, questionnaire fields; send email/SMS blasts and updates; invite guests) with two exceptions that stay with the original host: **deleting the event** and **adding/removing co-hosts**. Server actions enforce this uniformly via a shared authorization check (SEC-30).

### Deleting and Restoring Users

Je kunt gebruikers verwijderen en beheren via het tabblad **Gebruikers**.

- **Standaard verwijderen (bedenktijd):** standaard wordt een account na 30 dagen definitief verwijderd en geanonimiseerd. Tijdens deze periode wordt het account opgeschort, maar kan een beheerder op **Herstellen** klikken om de aanvraag te annuleren en het account opnieuw te activeren.
- **Direct verwijderen:** beheerders kunnen de bedenktijd van 30 dagen overslaan en een gebruiker die klaarstaat voor verwijdering meteen anonimiseren/verwijderen via **Nu verwijderen** in de actiekolom. Bevestiging is vereist.
- **Zelf annuleren:** als een organisator het verwijderen van het eigen account aanvraagt via de profielinstellingen, kan diegene de aanvraag daar op elk moment binnen de periode van 30 dagen annuleren.
- **Anonimiseren:** zodra de verwijdering definitief wordt of direct wordt uitgevoerd, worden persoonsgegevens permanent geanonimiseerd. De naam wordt gewijzigd in `"Deleted User"`, e-mail en telefoon worden op `null` gezet en een aangepaste avatar wordt verwijderd. De rol wordt teruggezet naar `GUEST`. Aanmeldingen als gast bij andere evenementen, mede-organisatorplaatsen, magische tokens en actieve sessies worden volledig verwijderd.
- **Evenementen opnieuw toewijzen:** evenementen van de verwijderde gebruiker worden niet verwijderd. Ze worden toegewezen aan het systeemaccount `"system"`, zodat gasten de evenementen nog steeds kunnen openen en de gegevens bekijken.

### Gebruikers filteren

De lijst **Gebruikers** kan met keuzelijsten worden gefilterd:

- **Rolfilter:** filter op accounttype (`All Roles`, `ADMIN`, `HOST`, `GUEST`).
- **Statusfilter:** filter op accountstatus (`All Statuses`, `Active` (standaard), `Pending Deletion`, `Deleted / Anonymized`).

---

## Evenementenmoderatie

Ga naar `/admin` > **Evenementen** om evenementpagina’s in je installatie te bekijken.

### Zoeken en modereren

Zoek evenementen op titel, slug of e-mailadres van de organisator en filter op status.

### Wat beheerders kunnen doen

- Bekijk de gegevens en gastenlijst van elk evenement en verwijder evenementen die de regels overtreden.
- Beheerders bewerken evenementgegevens niet rechtstreeks vanuit het beheerpaneel. Wanneer een beheerder een openbare evenementpagina opent, gaan diens rechten boven de controles voor de organisator. Daardoor kan diegene, net als de organisator, de inline-editor gebruiken, reacties beheren, de meeneemlijst bewerken en aanmeldingen modereren.
- Openbare evenementpagina’s en de bijbehorende instellingen- en aanmeldschermen gebruiken een responsieve lay-out met één kolom van maximaal 600 px. Compacte schermen voor authenticatie, bevestigingen en dialoogvensters zijn bewust smaller.
- Nadat toegang is verleend, gebruiken de openbare evenementpagina, het aanmeldformulier, de gastenlijst en de evenementinstellingen het achtergrondeffect dat de organisator heeft gekozen. Wachtwoord- en privacyschermen, dashboards, exports, sociale afbeeldingen en e-mails blijven statisch en tonen geen bewegende evenementeffecten.
- Beheerders kunnen inchecken, check-ins ongedaan maken, gasten ter plaatse toevoegen, uitnodigingen opnieuw versturen, zoeken, het aanwezigheidsoverzicht bekijken en de gastenlijst naar CSV exporteren. Inchecken is mogelijk bij elke aanmeldstatus, ook voor gasten die niet hebben gereageerd, Afwezig hebben gekozen of nog op goedkeuring wachten. Deze handelingen worden geregistreerd in het activiteitenoverzicht dat alleen organisatoren kunnen zien.
- Het filter **Iedereen** in de gastenlijst bevat zowel aanmeldingen als uitgenodigde gasten die nog niet hebben gereageerd.

---

## Instellingen voor organisatoren: uitnodigingscodes en registratie

Ga naar `/admin` > **Organisatie-instellingen** om te bepalen hoe nieuwe organisatoren toegang krijgen tot het platform.

### Open registratie

- **Schakelaar voor open registratie:** schakel deze in om iedereen zonder code als organisator te laten registreren. Schakel deze uit om bij registratie een geldige uitnodigingscode te vereisen.

### Een uitnodigingscode aanmaken

Wanneer open registratie is uitgeschakeld, hebben organisatoren een uitnodigingscode nodig. Klik op **Nieuwe code aanmaken** en stel het volgende in:

- **Code:** vul zelf een tekenreeks in of laat het veld leeg om een willekeurige code te genereren.
- **Opmerking:** een beschrijving, bijvoorbeeld “Voor de boekenclub”.
- **Maximaal aantal gebruiken:** beperk hoe vaak de code kan worden gebruikt.
- **Verloopt op:** een optionele datum waarna de code niet meer werkt.

### Codes beheren

Wijzig de status naast een code in de tabel om deze meteen uit of weer in te schakelen.

### Code uit een omgevingsvariabele versus codes uit het beheerpaneel

| Eigenschap | `HOST_INVITE_CODE` (omgevingsvariabele) | Codes uit het beheerpaneel |
| ---------------- | ---------------------------- | ------------------------ |
| **Locatie** | Ingesteld in het bestand `.env` | Opgeslagen in de database |
| **Vervaldatum** | Geen; altijd actief | Optionele vervaldatum |
| **Gebruikslimiet** | Onbeperkt | Optioneel maximaal aantal gebruiken |
| **Aantal** | Precies één code | Meerdere unieke codes |

---

## E-mailinstellingen

Ga naar `/admin` > **E-mail** om uitgaande e-mail te configureren. Instellingen die je hier opslaat, worden in de database bewaard en overschrijven direct de bijbehorende waarden uit `.env`, zonder dat de container opnieuw hoeft te starten.

- **E-mailmeldingen voor gasten:** als dit is uitgeschakeld, worden er geen e-mails aan gasten verstuurd (aanmeldbevestigingen, groepsupdates, herinneringen en uitnodigingen). Inloglinks voor organisatoren en e-mails aan beheerders worden altijd verstuurd, ongeacht deze instelling.
- **E-mailprovider:** kies **SMTP**, **Cloudflare Worker** of **Cloudflare REST API**.
- **Velden van de provider:** vul de gegevens van de gekozen provider in (SMTP-host, poort, beveiliging, gebruikersnaam en wachtwoord, of de relevante Cloudflare-velden) en geef het **afzenderadres** op.
- **Testmail versturen:** vul een e-mailadres in en verstuur een test om de instellingen te controleren.

Zie de [handleiding voor e-mailinstellingen](email.md) voor stapsgewijze uitleg per provider.

---

## Sms-instellingen

Ga naar `/admin` > **Sms** om Twilio in te stellen.

- **Sms-meldingen:** als dit is ingeschakeld, ontvangen gasten sms-bevestigingen, groepsupdates, herinneringen en uitnodigingen. De instelling wordt automatisch ingeschakeld wanneer Twilio-gegevens aanwezig zijn en werkt alleen met geldige gegevens.
- Vul je Twilio-**Account SID**, **Auth Token** en **telefoonnummer** in.
- **Test-sms versturen:** verstuur een testbericht naar een telefoonnummer om de instellingen te controleren.

Zie de [handleiding voor sms-instellingen](sms.md) voor de volledige Twilio-uitleg.

---

## Databaseback-ups

Ga naar `/admin` > **Back-ups** om momentopnamen van de PostgreSQL-database te beheren. Back-ups worden gemaakt met `pg_dump` en opgeslagen in het permanente volume `/app/data/backups`.

### Back-upschema

Kies een schema in de keuzelijst: **Uitgeschakeld**, **Elk uur**, **Elke 6 uur**, **Dagelijks om middernacht**, **Elke 3 dagen**, **Wekelijks** of **Aangepast**. Bij **Aangepast** verschijnt een veld voor een standaard cron-expressie met vijf velden (bijvoorbeeld `0 0 * * *` voor dagelijks om middernacht).

- **Aantal te bewaren back-ups:** stel in hoeveel snapshots je wilt bewaren. Wanneer er een nieuwe back-up wordt gemaakt, worden oudere bestanden boven deze limiet automatisch verwijderd om schijfruimte te besparen.

### Handmatige acties

- **Nu back-up maken:** maak onmiddellijk een snapshot met `pg_dump`.
- **Downloaden:** stuur een archief via een beveiligde route waarvoor je als beheerder moet zijn ingelogd naar je browser.
- **Verwijderen:** verwijder een back-upbestand definitief van de schijf.

---

## Thema-voorinstellingen

Ga naar `/admin` > **Thema’s** om de thema’s te beheren die organisatoren in de evenementinstellingen kunnen kiezen.

- **Thema’s aanmaken, bewerken en verwijderen:** stel de basisstijl, accentkleuren, kleurverlopen, versieringen, titel en beschrijving in.
- **Lettertype voor koppen:** elk thema kan optioneel een **lettertype voor koppen** gebruiken uit het register (`lib/fonts.ts`): 12 Google Fonts die tijdens het bouwen lokaal worden opgeslagen. Er zijn geen verzoeken aan Google tijdens runtime, zodat de fonts ook offline werken. Organisatoren die het thema kiezen, krijgen het lettertype automatisch; zij kunnen dit per evenement aanpassen. Kies **Standaardthema** om de ingebouwde typografie van de basisstijl te gebruiken.
- **Actief of inactief:** inactieve thema’s zijn verborgen voor organisatoren, maar blijven bewaard voor later gebruik.

Deze thema’s verschijnen in de themakiezer die organisatoren gebruiken om hun evenementpagina aan te passen.

### Typografie en effecten van thema’s (schemanotities)

- The host-facing **Settings → Theme** section is split into three tabs — **Theme** (presets + custom colors), **Effects** (picker with Density/Speed/Size controls), and **Font** — all saving to the same `EventTheme` row. The selected font is applied only to the main event title; section headings and body text retain the standard UI font.

- `EventTheme` now stores five host-editable fields beyond colors: `fontId` (heading font), and `effectId` / `effectDensity` / `effectSpeed` / `effectSize` (the animated background layer). `effectSize` is a sprite size multiplier from `1` (each set's designed size — the default; `NULL` on legacy rows means the same) to `10`. `ThemePreset` stores `fontId` only — **effects are never part of a preset**; they are purely per-event and default to off.
- Valid values are validated server-side against the registries in `lib/fonts.ts` and `lib/effects.ts` (`effectSize` against the `EFFECT_SIZE_MIN`/`EFFECT_SIZE_MAX` bounds there). To add a font or an effect set, extend those registries (fonts also need a loader entry in `app/fonts.ts`; effect sets need SVG sprites under `public/effects/<set>/`).
- **Email degradation:** custom fonts degrade to an email-safe stack declared per font in `lib/fonts.ts`; effects are web-only and never render in email. See `lib/email-theme.ts` for the contract.
- Effects respect the guest's `prefers-reduced-motion` setting automatically (the layer is hidden via CSS). Independently of that, every viewer can choose **Hide effects** from the top-bar menu; signed-in viewers open the menu from their profile picture, while signed-out viewers use the circular hamburger button. The choice persists in the browser's `localStorage` (`rsvp:hide-effects`) — no server state is involved.

---

## Beveiligingsopmerkingen voor beheerders

- Opgeslagen inloggegevens (SMTP-wachtwoord, Twilio Auth Token, Cloudflare API-token/geheim) worden in de database versleuteld met AES-256-GCM, met `ENCRYPTION_KEY` (of `SESSION_SECRET` als die niet is ingesteld) als sleutel. Dit beperkt de blootstelling als de database ooit uitlekt.
- Gevoelige waarden worden gemaskeerd (als `••••••••`) voordat ze naar de browser worden verstuurd.
- Er bestaat geen apart beheerderswachtwoord. Beheerders loggen net als alle andere gebruikers in via een eenmalige inloglink.
- Acties in het beheerpaneel worden momenteel niet vastgelegd in het openbare activiteitenoverzicht.
- **Zichtbaarheid en wachtwoordbeveiliging gelden voor alle subroutes van een evenement.** Eén toegangscontrole (`resolveEventAccess` in `lib/eventAccess.ts`) wordt gebruikt voor de evenementpagina, de gastenlijst (`/e/[slug]/guests`), het aanmeldformulier (`/e/[slug]/rsvp`) en de agenda-export (`/e/[slug]/calendar.ics`). Een privé-evenement of evenement met wachtwoord kan niet worden geopend door de URL te raden. Toegang vereist een sessie van een organisator of mede-organisator, een beheerder die modereert met `?admin=1`, de ondertekende ontgrendelcookie die na invoer van het wachtwoord wordt geplaatst, of een geldig RSVP-token van een gast.
- **Contactgegevens van gasten verlaten de server nooit voor niet-organisatoren.** Op de gastenlijst worden persoonlijke wijzigingstokens, e-mailadressen, telefoonnummers en privéantwoorden op vragenlijsten uit de paginagegevens verwijderd, tenzij de bezoeker organisator, mede-organisator of beheerder is. Ze worden dus niet alleen in de interface verborgen.
