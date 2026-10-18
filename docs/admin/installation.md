---
title: Installatie
description: Docker-installatie, uitrollen, HTTPS en probleemoplossing.
category: Aan de slag
audience: admin
order: 10
---

# Installatiehandleiding

Deze handleiding helpt je **RSVP to Me** te installeren op elke machine waarop Docker kan draaien. Je hoeft niet te kunnen programmeren, code te compileren of een database te beheren buiten de stappen die hier worden beschreven.

---

## Inhoudsopgave

1. [Benodigdheden](#benodigdheden)
2. [Wat je installeert](#wat-je-installeert)
3. [Stap 1 — Docker installeren](#stap-1--docker-installeren)
4. [Stap 2 — Bestanden ophalen](#stap-2--bestanden-ophalen)
5. [Stap 3 — Omgeving configureren](#stap-3--omgeving-configureren)
6. [Stap 4 — Applicatie starten](#stap-4--applicatie-starten)
7. [Stap 5 — Eerste login en beheerder instellen](#stap-5--eerste-login-en-beheerder-instellen)
8. [Je gegevens en back-ups begrijpen](#je-gegevens-en-back-ups-begrijpen)
9. [Databasehulpmiddelen verbinden](#databasehulpmiddelen-verbinden)
10. [Stoppen, starten en opnieuw opstarten](#stoppen-starten-en-opnieuw-opstarten)
11. [HTTPS en eigen domeinen](#https-en-eigen-domeinen)
12. [Probleemoplossing](#probleemoplossing)

---

## Benodigdheden

Voordat je begint, heb je het volgende nodig:

- **Een machine waarop de app draait.** Dit kan een lokale server zijn, een desktop of laptop die continu aanstaat, een Raspberry Pi (4 of 5), een virtuele server (VPS) of een NAS die Docker ondersteunt, zoals Synology of Unraid.
- **Docker en Docker Compose** geïnstalleerd op die machine.
- **Een stabiel webadres of IP-adres** (bijvoorbeeld `http://192.168.1.50:3000` of `https://rsvp.jouwdomein.nl`) waarmee gasten de applicatie kunnen bereiken.
- **Een e-mailaccount** voor uitnodigingen, eenmalige inloglinks en herinneringen, bijvoorbeeld Gmail, Outlook of Amazon SES.

---

## Wat je installeert

RSVP to Me draait als een set Docker-containers die zijn gedefinieerd in `docker-compose.release.yml`:

| Container | Doel |
|---|---|
| `app` | De hoofdwebserver. Verzorgt de weergave van webpagina’s, responsieve afbeeldingsoptimalisatie, aanmeldingen van gasten, reacties en beheerdersacties. Draait ook de ingebouwde planner voor herinneringen en back-ups. Gebruikt poort `3000`. |
| `postgres` | PostgreSQL 18-database met gebruikers, evenementen, aanmeldingen en applicatiegegevens. Alleen bereikbaar door andere containers op het interne Docker-netwerk; er wordt geen hostpoort gepubliceerd. |
| `redis` | Redis voor sessiecache, snelheidslimieten en gedistribueerde vergrendeling van geplande taken. Alleen intern bereikbaar, net als `postgres`; er wordt geen hostpoort gepubliceerd. |

---

## Stap 1 — Docker installeren

Als Docker en Docker Compose al zijn geïnstalleerd, ga dan door naar [Stap 2](#stap-2--bestanden-ophalen).

### Linux (Ubuntu/Debian)

Open de terminal en voer de volgende opdrachten uit om Docker te installeren:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Wil je Docker-opdrachten zonder telkens `sudo` te gebruiken uitvoeren, voeg je huidige gebruiker dan toe aan de groep `docker`:

```bash
sudo usermod -aG docker $USER
```

Log uit bij je Linux-sessie en log opnieuw in om de wijziging toe te passen.

### Mac

Download en installeer **Docker Desktop** via de [officiële installatiepagina voor macOS](https://docs.docker.com/desktop/install/mac-install/).

### Windows

Download en installeer **Docker Desktop** via de [officiële installatiepagina voor Windows](https://docs.docker.com/desktop/install/windows-install/). Zorg dat WSL 2 (Windows Subsystem for Linux) tijdens de installatie is geselecteerd.

### Installatie controleren

Controleer of Docker draait door de versies op te vragen:

```bash
docker --version
docker compose version
```

---

## Stap 2 — Bestanden ophalen

Voor de installatie heb je de bestanden `docker-compose.release.yml` en `.env.example` nodig.
Gebruik in de opdrachten hieronder expliciet `-f docker-compose.release.yml`, ongeacht welke van de twee opties je kiest.
Het bestand `docker-compose.yml` in de hoofdmap bouwt vanuit broncode, en de automatisch geladen `docker-compose.override.yml` is bedoeld voor lokale ontwikkeling en schakelt de app-service uit.

### Optie A: De repository klonen (aanbevolen)

Als Git is geïnstalleerd, kloon je de repository:

```bash
git clone https://github.com/joe-cole1/rsvp-to-me.git
cd rsvp-to-me
```

### Optie B: Bestanden rechtstreeks downloaden

Je kunt ook een map aanmaken en de installatiebestanden downloaden:

```bash
mkdir rsvp-to-me
cd rsvp-to-me
curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/docker-compose.release.yml
curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/.env.example
```

---

## Stap 3 — Omgeving configureren

Alle configuratie gebeurt in een bestand met de naam `.env`, in dezelfde map als `docker-compose.release.yml`.

### Het .env-bestand aanmaken

Kopieer de voorbeeldconfiguratie:

- **Linux/Mac:**
  ```bash
  cp .env.example .env
  ```
- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```

Open het bestand `.env` in een teksteditor.

### Minimaal vereiste variabelen

Je moet ten minste de volgende variabelen instellen voordat je de applicatie start:

1. **`POSTGRES_PASSWORD`**: een sterk wachtwoord voor de PostgreSQL-databasecontainer.
2. **`REDIS_PASSWORD`**: een sterk wachtwoord voor de Redis-container.
   > **Deze twee variabelen zijn verplicht.** De Compose-bestanden bevatten **geen standaardwachtwoorden**. Als een van deze variabelen ontbreekt of leeg is, weigert `docker compose -f docker-compose.release.yml up` te starten en wordt een foutmelding getoond met de naam van de variabele (bijvoorbeeld `POSTGRES_PASSWORD is required - set a strong value in .env`). De database en cache worden ook niet op hostpoorten gepubliceerd en zijn alleen bereikbaar voor de app-container via het interne Docker-netwerk.
3. **`SESSION_SECRET`**: een veilige, willekeurige tekenreeks van minstens 32 tekens om sessiecookies te versleutelen.
   - _CLI (Linux/Mac):_ voer `openssl rand -base64 32` uit om een sleutel te genereren.
   - _CLI (Windows PowerShell):_ voer `[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))` uit.
   - _Web:_ genereer de sleutel via [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32).
4. **`NEXT_PUBLIC_APP_URL`**: het openbare adres dat gebruikers en gasten bezoeken, bijvoorbeeld `https://rsvp.jouwdomein.nl`. Gebruik geen afsluitende slash.
5. **`INITIAL_ADMIN_EMAIL`**: je e-mailadres. Alleen wanneer een geldige eenmalige inloglink voor dit adres succesvol wordt geverifieerd én er nog geen beheerder bestaat, krijgt het account automatisch de rol Beheerder. Registratie, bestaande sessies, profiellinks en uitnodigingen voor mede-organisatoren kunnen deze initiële promotie niet activeren.
6. **`HOST_INVITE_CODE`**: een code die nieuwe organisatoren nodig hebben om een account te registreren. De tijdelijke voorbeeldwaarde in `.env.example` (`CHANGE_THIS_TO_A_STRONG_RANDOM_CODE`) wordt in productie geweigerd. Vervang deze door een sterke waarde, bijvoorbeeld met `openssl rand -hex 8`.

> **Waarschuwing:** je bestand `.env` bevat gevoelige wachtwoorden en sleutels. Commit dit bestand nooit naar een openbare repository. Zorg dat het in `.gitignore` staat.

### Aanbevolen: botbescherming inschakelen

Voor een installatie die vanaf internet bereikbaar is, maak je een **Managed**-widget aan in Cloudflare Turnstile, voeg je de hostnaam uit `NEXT_PUBLIC_APP_URL` toe en kopieer je beide gegevens naar `.env`:

```env
TURNSTILE_SITE_KEY="your-site-key"
TURNSTILE_SECRET_KEY="your-secret-key"
```

Turnstile is optioneel; lokale en privé-installaties kunnen zonder Cloudflare draaien. Als beide waarden leeg blijven, is de bescherming uitgeschakeld. Als je maar één van de twee invult, mislukken beveiligde inzendingen. Stel daarom altijd beide waarden in of laat ze allebei leeg. Zie het [Configuratieoverzicht](./configuration.md#cloudflare-turnstile) voor de beveiligde handelingen en de uitzonderingen voor beheerders.

---

## Stap 4 — Applicatie starten

Het applicatieproces draait als de vaste niet-rootgebruiker en -groep `10001:10001`.
Je hoeft de eigenaar van bestanden op de host niet zelf in te stellen. Bij het starten maakt de container de mappen `./data/uploads` en `./data/backups` aan, herstelt deze de eigenaarsinstellingen die oudere images binnen die twee applicatiemappen hebben achtergelaten en verlaagt daarna de rechten voordat migraties of applicatiecode worden uitgevoerd.

Start de containers vanuit de map `rsvp-to-me`:

```bash
docker compose -f docker-compose.release.yml up -d
```

_Wat deze opdracht doet:_

- Downloadt en start de PostgreSQL 18-, Redis- en webservercontainers.
- Voert bij de eerste start automatisch databasemigraties uit.
- Start alle containers op de achtergrond.

> **Productiegegevens:** laat `SEED_TEST_DATA="false"` in `.env` staan, zoals in het voorbeeld. Het release-Compose-bestand schakelt voorbeeldgegevens niet in.

Controleer de status van de containers:

```bash
docker compose -f docker-compose.release.yml ps
```

Controleer of de webapp goed is gestart door de logboeken te bekijken:

```bash
docker compose -f docker-compose.release.yml logs -f app
```

Druk op `Ctrl+C` om het volgen van de logboeken te stoppen. De containers blijven gewoon draaien.

Je kunt ook het healthcheck-eindpunt testen:

```bash
curl http://localhost:3000/api/health
```

De respons hoort te zijn: `{"status":"ok"}`.

> Het healthcheck-eindpunt geeft anonieme gebruikers bewust maar beperkte informatie: `200` met `{"status":"ok"}` als de service gezond is, of `503` met `{"status":"unavailable"}` als dat niet zo is. Voor details (status van databasemigraties en tijdstempel) stel je optioneel `HEALTH_CHECK_TOKEN` in `.env` in en geef je die mee in de header `x-health-token`. Zie het [Configuratieoverzicht](./configuration.md#health_check_token).

---

## Uitrollen vanaf GitHub (zonder lokale kloon)

Wil je de nieuwste code rechtstreeks vanaf GitHub gebruiken zonder de repository lokaal te klonen? Gebruik dan `docker-compose.dev.yml`. Dit is handig om RSVP to Me op een server met alleen Docker te draaien.

### Gebruik

```bash
# Download alleen de twee benodigde bestanden
mkdir rsvp-to-me && cd rsvp-to-me
curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/docker-compose.dev.yml
curl -fLO https://raw.githubusercontent.com/joe-cole1/rsvp-to-me/main/.env.example
cp .env.example .env   # vul je geheimen in

docker compose -f docker-compose.dev.yml up --build -d
```

Werk de installatie bij naar de nieuwste code met:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

---

## Stap 5 — Eerste login en beheerder instellen

1. Open je browser en ga naar het adres dat je bij `NEXT_PUBLIC_APP_URL` hebt ingesteld.
2. Klik op **Inloggen** en vul het e-mailadres in dat je bij `INITIAL_ADMIN_EMAIL` hebt gezet.
3. Controleer je inbox op de eenmalige inloglink en klik erop om in te loggen.
   - Configureer SMTP of de optionele e-mailworker via de [handleiding voor e-mailinstellingen](./email.md) voordat je voor het eerst inlogt. Productie-images tonen geen inloglinks in logbestanden.
4. De promotie vindt alleen plaats wanneer die geldige inloglink wordt geverifieerd. Ga na het inloggen naar `/admin` in je browser om te controleren of je toegang hebt tot het beheerpaneel.

---

## Je gegevens en back-ups begrijpen

Standaard gebruikt de applicatie **bind mounts**: een Docker-functie die mappen op de host koppelt aan mappen in de container, zodat gegevens behouden blijven na herstarts en upgrades. In de voorbeelden worden `./data/uploads` en `./data/backups` aan de bijbehorende paden in de app gekoppeld. PostgreSQL en Redis gebruiken aparte bind mounts.

De opstartprocedure zorgt ervoor dat alleen de gekoppelde mappen voor uploads en back-ups schrijfbaar zijn voor het applicatieaccount. Andere mappen onder `/app/data` worden niet willekeurig recursief aangepast. Daardoor kun je veilig een aangepaste indeling gebruiken met `pg_data`, `redis_data`, uploads en back-ups onder één bovenliggende map. Voordat migraties, uploads, back-ups of de webserver starten, verlaagt het entrypoint de rechten permanent naar UID/GID `10001:10001`.

Je gegevens staan in de volgende paden:

- **`./pg_data/`**: PostgreSQL-datamap met gebruikers, evenementen, aanmeldingen, reacties, peilingen en meeneemlijsten.
- **`./data/uploads/`**: geüploade omslagafbeeldingen en profielfoto’s.
- **`./data/backups/`**: databaseback-ups (SQL-dumps gemaakt met `pg_dump`).

### Ingebouwde back-upbeheerder (aanbevolen)

**RSVP to Me** heeft een databaseback-upbeheerder in het tabblad **Back-ups** van het **beheerpaneel**.

Daar kun je:

- **Automatische back-ups instellen:** een cron-schema invoeren (bijvoorbeeld `0 0 * * *` voor dagelijks om middernacht).
- **Rotatielimieten aanpassen:** instellen hoeveel back-ups worden bewaard (bijvoorbeeld 7), voordat oudere bestanden worden verwijderd.
- **Handmatig een back-up maken:** direct `pg_dump` uitvoeren om een back-up te maken.
- **Back-ups downloaden en verwijderen:** archieven bekijken, rechtstreeks downloaden of van de server verwijderen.

### Handmatige back-ups

Gebruik op elk gewenst moment `pg_dump` via de postgres-container om een back-up te maken:

**Back-upopdracht (Linux/macOS-shell):**

```bash
docker compose -f docker-compose.release.yml exec -T postgres pg_dump -U postgres rsvp_db > ./data/backups/manual-backup-$(date +%Y%m%d).sql
```

> **Let op:** de opdracht `docker compose -f docker-compose.release.yml down -v` verwijdert alle Docker-volumes. RSVP to Me gebruikt standaard lokale bind mounts, maar bij aangepaste configuraties kan dit tot permanent gegevensverlies leiden. Laat de optie `-v` weg om je gegevens te beschermen.

---

## Databasehulpmiddelen verbinden

Om veiligheidsredenen worden PostgreSQL en Redis **niet op hostpoorten gepubliceerd**. Ze zijn alleen bereikbaar via het interne Docker-netwerk van de stack. Als je hulpmiddelen eerder met `localhost:5432` verbond, gebruik dan een van de volgende opties.

### Optie A: De client in de container uitvoeren (eenvoudigst)

Er wordt geen netwerkpoort geopend; de client draait waar de database zich bevindt:

```bash
docker compose -f docker-compose.release.yml exec postgres psql -U postgres -d rsvp_db
```

De back-upopdrachten in deze handleiding werken op dezelfde manier.

### Optie B: Een hostpoort die alleen lokaal bereikbaar is (desktop-GUI’s)

Heb je op **dezelfde machine** een hostpoort nodig voor een grafische client zoals DBeaver, pgAdmin of TablePlus, maak dan naast `docker-compose.release.yml` een bestand `docker-compose.tools.yml` aan:

```yaml
services:
  postgres:
    ports:
      - "127.0.0.1:5432:5432"
```

Voer daarna `docker compose -f docker-compose.release.yml -f docker-compose.tools.yml up -d` uit om de instelling toe te passen. Opdrachten met expliciet opgegeven releasebestanden laden niet automatisch een override; gebruik dus beide `-f`-argumenten wanneer je deze optionele configuratie gebruikt. Door aan `127.0.0.1` te binden, wordt `localhost:5432` alleen beschikbaar voor hulpmiddelen op die machine. De database wordt nog steeds **niet** op het netwerk gepubliceerd. Gebruik in productie nooit een kale mapping `"5432:5432"`; daarmee zou de database op alle netwerkinterfaces beschikbaar komen.

### Optie C: Een ander hulpprogramma aan het Docker-netwerk koppelen

Containers uit andere Docker-stacks kunnen rechtstreeks met de database communiceren door zich bij het netwerk van deze stack aan te sluiten. Een hostpoort is daarvoor niet nodig. Het netwerk heet `<project>_default`, waarbij `<project>` de map is met `docker-compose.release.yml`. Controleer de naam met `docker network ls`.

Declareer in het Compose-bestand van de andere stack het netwerk als extern en koppel je hulpmiddel eraan:

```yaml
services:
  my-db-tool:
    # ...
    networks:
      - rsvp
networks:
  rsvp:
    external: true
    name: rsvp-to-me_default # pas dit aan op de werkelijke netwerknaam
```

Je kunt ook een draaiende container direct koppelen:

```bash
docker network connect rsvp-to-me_default my-db-tool
```

Daarna kan het hulpprogramma verbinding maken met `postgresql://postgres:<POSTGRES_PASSWORD>@postgres:5432/rsvp_db`. Heeft de andere stack zelf ook een service met de naam `postgres`, gebruik dan de volledige containernaam van deze stack (bijvoorbeeld `rsvp-to-me-postgres-1`, te zien via `docker compose -f docker-compose.release.yml ps`) om een dubbelzinnige hostnaam te voorkomen.

---

## Stoppen, starten en opnieuw opstarten

Beheer de containers met de volgende terminalopdrachten:

- **`docker compose -f docker-compose.release.yml stop`**: stopt de draaiende applicatie netjes. Je gegevens blijven behouden.
- **`docker compose -f docker-compose.release.yml start`**: start een gestopte applicatie.
- **`docker compose -f docker-compose.release.yml restart`**: start de container opnieuw, bijvoorbeeld na kleine wijzigingen.
- **`docker compose -f docker-compose.release.yml down`**: stopt en verwijdert de applicatiecontainer. De map `./data` op de host blijft bestaan.

---

## HTTPS en eigen domeinen

Sessiecookies van Next.js vereisen een beveiligde verbinding. Browsers blokkeren authenticatiecookies via onbeveiligde HTTP op openbare domeinen. **Voor installaties die vanaf internet bereikbaar zijn, is HTTPS verplicht.**

Je stelt HTTPS niet in binnen RSVP to Me zelf. Plaats een **reverse proxy** vóór poort `3000` om SSL-certificaten (zoals Let’s Encrypt) te beheren en verkeer door te sturen.

Aanbevolen reverse proxy’s:

- **Caddy** (automatische HTTPS en eenvoudige reverse proxies met één regel): [Snelstart voor Caddy Reverse Proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy)
- **Nginx Proxy Manager** (webinterface voor het beheren van Let’s Encrypt-certificaten): [Nginx Proxy Manager](https://nginxproxymanager.com/)
- **Traefik** (cloud-native proxy die rechtstreeks met Docker-labels werkt): [Traefik-documentatie voor Docker](https://doc.traefik.io/traefik/)

---

## Probleemoplossing

### De app start niet

Voer `docker compose -f docker-compose.release.yml logs app` uit om de logboeken te bekijken.

- Zie je `SESSION_SECRET must be at least 32 characters`, controleer dan of je een lange, willekeurige tekenreeks hebt gegenereerd.
- Zie je `DATABASE_URL is required` of `REDIS_URL is required`, controleer dan of beide in je bestand `.env` zijn ingesteld.
- Zie je verbindingsfouten naar PostgreSQL of Redis, controleer dan of beide containers gezond zijn: `docker compose -f docker-compose.release.yml ps`.
- Is poort `3000` al in gebruik door een andere app, open dan `docker-compose.release.yml` en verander `"3000:3000"` in `"3001:3000"` (of een andere vrije poort).

### Ik heb geen eenmalige inloglink per e-mail ontvangen

1. Configureer SMTP of de optionele e-mailworker via de [handleiding voor e-mailinstellingen](./email.md). Productie-images tonen geen inloglinks in logbestanden. Controleer bij een ontbrekende inlogmail de gegevens van de provider en de bezorglogboeken.
2. Controleer de map met ongewenste e-mail.
3. Ga, als dit is ingesteld, naar `/admin` > **Systeemconfiguratie** > **Testmail versturen** om configuratiefouten op te sporen.

### Ik ben mijn beheerderstoegang kwijt

Controleer of `INITIAL_ADMIN_EMAIL="your-email@domain.com"` in `.env` staat en voer daarna uit:

```bash
docker compose -f docker-compose.release.yml restart app
```

Log uit bij de applicatie, vraag een nieuwe inloglink aan voor dat e-mailadres en open de link om de promotielogica voor de eerste beheerder opnieuw te activeren. Alleen een bestaande sessie herstellen of de site openen is daarvoor niet voldoende.
