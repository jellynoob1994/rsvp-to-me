# RSVP to Me

Een mooi, zelf te hosten platform voor evenementen en aanmeldingen, gericht op persoonlijk contact — voor huisfeesten, wijnavonden, diners en meer. Geïnspireerd op de expressieve stijl van Partiful. Geen betalingen of ticketverkoop: alleen uitnodigingslinks, aanmeldingen, contact en samen plannen.

[Schermvoorbeelden](#schermvoorbeelden) · [Belangrijkste functies](#belangrijkste-functies) · [Snel starten](#snel-starten) · [Handleiding voor organisatoren](docs/host/getting-started.md) · [Beheerdershandleiding](docs/admin/installation.md) · [Releases](https://github.com/joe-cole1/rsvp-to-me/releases)

## Schermvoorbeelden

### Evenementpagina voor gasten

![Evenementpagina voor Wijnavond met omslagafbeelding en de aanmeldopties Aanwezig, Misschien en Afwezig](public/docs/images/event-guest-view.png)

Gasten zien een uitnodiging in het gekozen thema en kunnen rechtstreeks op de evenementpagina reageren.

### Dashboard voor organisatoren

![Dashboard voor organisatoren met evenementfilters, een kaart Nieuw evenement en het aankomende evenement Wijnavond](public/docs/images/host-dashboard.png)

Organisatoren kunnen evenementen aanmaken, aankomende bijeenkomsten bekijken en reacties volgen vanuit hun dashboard.

Bekijk ook [gastenbeheer](docs/host/guest-list.md#voorbeeld-van-gastenbeheer) en [thema-aanpassing](docs/host/customizing-your-page.md#voorbeeld-van-thema-aanpassing) in de handleidingen voor organisatoren.

## Hoe het werkt

1. **Maak een evenement aan:** stel de titel, datum, tijd en locatie in.
2. **Geef het je eigen stijl:** kies een thema, voeg een omslagafbeelding toe en stel de zichtbaarheid en aanmeldopties in.
3. **Nodig gasten uit:** deel de evenementlink of verstuur uitnodigingen per e-mail en eventueel sms.
4. **Beheer de bijeenkomst:** volg aanmeldingen, stem eten en plannen af, verstuur updates en check gasten in.

**Organisatoren** loggen in met een eenmalige inloglink. **Gasten** kunnen zich aanmelden zonder account en hun persoonlijke wijzigingslink gebruiken om hun reactie aan te passen zolang wijzigingen zijn toegestaan. Voor privé-evenementen is de juiste uitnodiging of toegangsverlening nog steeds vereist. Zie de [handleiding voor organisatoren](docs/host/getting-started.md) voor de volledige werkwijze.

## Belangrijkste functies

### Geef elk evenement een eigen stijl

- **Thema’s en omslagafbeeldingen:** de basisthema’s Donker, Zacht en Gedurfd, seizoensgebonden thema’s, eigen kleuren en uploads van omslagafbeeldingen.
- **Lettertypen en effecten:** lettertypen voor evenementtitels en optionele bewegende achtergronden, met bijpassende statische e-mails.
- **Privacyinstellingen:** openbare, niet-vermelde en privé-evenementen, wachtwoordbeveiliging en instellingen voor de zichtbaarheid van de gastenlijst.

### Houd contact met gasten

- **Eenvoudig aanmelden:** de opties Aanwezig, Misschien en Afwezig, extra gasten, goedkeuringsregels, capaciteitslimieten en eigen vragenlijsten.
- **Samen plannen:** reacties in gesprekken, interactieve peilingen en toezeggingen op de meeneemlijst.
- **Uitnodigingen en updates:** e-mailuitnodigingen, automatische herinneringen, berichten van organisatoren en optionele sms via Twilio.

### Geef organisatoren de juiste hulpmiddelen

- **Inloggen zonder wachtwoord:** eenmalige inloglinks via e-mail of optioneel sms, met ondersteuning voor mede-organisatoren.
- **Gastenbeheer:** reacties zoeken en filteren, gezelschappen inchecken, gasten ter plaatse toevoegen en de gastenlijst en antwoorden op vragenlijsten exporteren naar CSV.
- **Beheer:** beheer gebruikers, evenementen, uitnodigingscodes voor organisatoren en systeeminstellingen via het beheerpaneel.

## Voor de installatie

| Vereiste | Wat je kunt verwachten |
|---|---|
| Docker en Docker Compose | Het release-Compose-bestand start de app met PostgreSQL en Redis. Node.js hoeft niet op de host te worden geïnstalleerd. |
| Een bereikbaar app-adres | Gebruik localhost voor een lokale test of een stabiel adres dat gasten kunnen bereiken voor een gedeelde installatie. |
| E-mailbezorging | Configureer SMTP of een ondersteunde Cloudflare-provider voordat je in productie inlogt. Productie-images tonen geen inloglinks in logbestanden. |
| Sms (optioneel) | Koppel Twilio als je wilt inloggen, uitnodigingen of updates via sms wilt versturen. |

Zie [Voorbeeldgegevens en schermafbeeldingen](docs/admin/sample-data.md) voor een lokale testinstallatie met gegevens. Daar worden de aangemaakte testaccounts en de ontwikkelwerkwijze voor inloggen uitgelegd.

---

## Snel starten

Met deze stappen krijg je **RSVP to Me** aan de praat. Bekijk [docs/admin/installation.md](docs/admin/installation.md) voor de volledige handleiding.

### Benodigdheden

- [Docker en Docker Compose](https://docs.docker.com/compose/install/) moeten op je machine zijn geïnstalleerd.
- Een stabiel webadres of IP-adres (bijvoorbeeld `http://localhost:3000` of `https://rsvp.jouwdomein.nl`) waarop jij en je gasten de applicatie kunnen bereiken.

### Installatie in stappen

1. **Download de bestanden**

   Open een terminal en voer deze opdrachten uit om de benodigde deploymentbestanden te downloaden:

   ```bash
   mkdir rsvp-to-me && cd rsvp-to-me
   curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/docker-compose.release.yml
   curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/.env.example
   ```

   Gebruik expliciet `docker-compose.release.yml`, ook als je de repository hebt gekloond.
   Het bestand `docker-compose.yml` in de hoofdmap bouwt vanuit de broncode; de automatische override is bedoeld voor lokale ontwikkeling.

2. **Maak je configuratiebestand aan**

   Maak een `.env`-bestand door het voorbeeld te kopiëren:
   - **Linux/Mac (terminal):**
     ```bash
     cp .env.example .env
     ```
   - **Windows (PowerShell):**
     ```powershell
     Copy-Item .env.example .env
     ```

3. **Stel de minimaal vereiste waarden in**

   Open het bestand `.env` in een teksteditor, zoals Kladblok op Windows of Nano op Linux/Mac, en stel de volgende variabelen in:
   - `POSTGRES_PASSWORD` en `REDIS_PASSWORD`: sterke wachtwoorden voor de meegeleverde database- en cachecontainers. Docker Compose gebruikt deze om PostgreSQL en Redis te starten en de verbindingsadressen voor de app op te bouwen. Beide zijn verplicht; er zijn geen standaardwachtwoorden. Als één van beide ontbreekt, stopt `docker compose -f docker-compose.release.yml up` met een foutmelding.
   - `SESSION_SECRET`: een veilige, willekeurige tekenreeks van minstens 32 tekens om sessiecookies te versleutelen. Genereer er een met `openssl rand -base64 32` of via [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32).
   - `NEXT_PUBLIC_APP_URL`: het adres waarop gasten de app openen (bijvoorbeeld `http://localhost:3000` of `https://rsvp.jouwdomein.nl`). Gebruik geen afsluitende slash.
   - `INITIAL_ADMIN_EMAIL`: je e-mailadres. Wanneer je met dit adres inlogt, krijgt je account de rol Beheerder.
   - Configureer SMTP of de optionele e-mailworker via de [handleiding voor e-mailinstellingen](docs/admin/email.md) voordat je voor het eerst inlogt. Productie-images tonen geen inloglinks in logbestanden.
   - `HOST_INVITE_CODE`: een code om registratie als organisator te beperken tot mensen die je kent. De voorbeeldconfiguratie bevat een duidelijk herkenbare tijdelijke waarde die de app in productie weigert. Vervang deze door een sterke waarde, bijvoorbeeld met `openssl rand -hex 8`.

4. **Start de applicatie**

   Voer deze opdracht uit in dezelfde map als `docker-compose.release.yml` om de images op te halen en de services te starten:

   ```bash
   docker compose -f docker-compose.release.yml up -d
   ```

5. **Controleer de containerlogboeken**

   Controleer de logboeken van de webserver om na te gaan of de app goed is gestart:

   ```bash
   docker compose -f docker-compose.release.yml logs -f app
   ```

   Druk op `Ctrl+C` om het volgen van de logboeken te stoppen zodra je `▲ Next.js ready on http://0.0.0.0:3000` ziet.

6. **Log in en controleer beheerderstoegang**
   - Open de browser en ga naar het adres dat je bij `NEXT_PUBLIC_APP_URL` hebt ingesteld.
   - Klik op **Inloggen** en gebruik het e-mailadres dat je bij `INITIAL_ADMIN_EMAIL` hebt ingesteld.
   - Controleer je inbox op de inlogmail en klik op de link.
   - Ga na het inloggen naar `/admin` om te controleren of je beheerderstoegang hebt.

---

## Uitgebreide documentatie

Raadpleeg de onderstaande handleidingen voor gedetailleerde uitleg over functies, configuratie en beheer:

| Handleiding | Beschrijving |
|---|---|
| [Installatiehandleiding](docs/admin/installation.md) | Volledige installatie, Docker, gegevensback-ups en HTTPS-reverse-proxy’s. |
| [Configuratieoverzicht](docs/admin/configuration.md) | Overzicht en uitleg van alle omgevingsvariabelen. |
| [E-mail instellen](docs/admin/email.md) | SMTP instellen (Gmail, Outlook, SES enz.) of Cloudflare Email Routing. |
| [Sms instellen](docs/admin/sms.md) | Twilio koppelen voor inloggen per sms, uitnodigingen en groepsberichten. |
| [Handleiding voor beheerders](docs/admin/admin.md) | Gebruikersaccounts, evenementenmoderatie, uitnodigingscodes en systeeminstellingen beheren. |
| [Handleidingen voor organisatoren](docs/host/) | Stapsgewijze uitleg over evenementen aanmaken, aanmeldingen beheren, uitnodigingen en meer. |
| [Veilig upgraden](docs/admin/upgrading.md) | RSVP to Me bijwerken zonder databasegegevens te verliezen. |
| [Voorbeeldgegevens en schermafbeeldingen](docs/admin/sample-data.md) | Testaccounts, lokaal inloggen en de checklist voor schermafbeeldingen. |
| [Architectuuroverzicht](ARCHITECTURE.md) | Ontwikkelaarsoverzicht van runtimegrenzen, subsystemen, ingangspunten en plekken waar wijzigingen vaak nodig zijn. |
