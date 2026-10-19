---
title: E-mail instellen
description: Configuratie van e-mailproviders via SMTP en Cloudflare.
category: Configuratie
audience: admin
order: 30
---

# Handleiding voor e-mailinstellingen

RSVP to Me verstuurt e-mailmeldingen voor inloggen zonder wachtwoord (eenmalige inloglinks), uitnodigingen, aanmeldbevestigingen, evenementupdates en automatische herinneringen. Deze handleiding legt uit hoe je iedere ondersteunde e-mailprovider configureert.

---

## Inhoudsopgave

1. [How Email Works in the App](#hoe-e-mail-in-de-app-werkt)
2. [What Happens Without Email Configured](#wat-gebeurt-er-als-e-mail-niet-is-ingesteld)
3. [Choosing a Provider](#een-provider-kiezen)
4. [Option A: SMTP](#optie-a-smtp)
   - [Gmail Setup](#gmail-instellen)
   - [Outlook / Hotmail Setup](#outlook--hotmail-instellen)
   - [Fastmail Setup](#fastmail-instellen)
   - [Mailgun Setup](#mailgun-instellen)
   - [Amazon SES Setup](#amazon-ses-instellen)
5. [Option B: Cloudflare Workers (Full Setup)](#optie-b-cloudflare-workers-volledige-configuratie)
6. [Option C: Cloudflare REST API (Outbound Only)](#optie-c-cloudflare-rest-api-alleen-uitgaand)
7. [Testing Your Email Configuration](#je-e-mailconfiguratie-testen)
8. [Themed Email Templates](#e-mails-met-thema)
9. [Editing Template Copy & Content Blocks](#sjabloontekst-en-inhoudsblokken-bewerken)
10. [Troubleshooting](#problemen-oplossen)
11. [SPF, DKIM, and DMARC Explained](#uitleg-over-spf-dkim-en-dmarc)

---

## Hoe e-mail in de app werkt

E-mails worden verstuurd wanneer de volgende gebeurtenissen plaatsvinden:

| Trigger                                            | Recipients                                                     |
| -------------------------------------------------- | -------------------------------------------------------------- |
| User requests login link                           | The requesting user (magic link)                               |
| Host invites guests                                | The invited guests                                             |
| Guest submits an RSVP                              | The guest (confirmation)                                       |
| Guest submits an RSVP (host alert)                 | The host and co-hosts (when the host-alert email toggle is on) |
| Host approves/declines a pending RSVP              | The approved/declined guest                                    |
| Host sends an event update blast                   | All Going and Maybe guests (if notify is selected)             |
| Automated reminder (7 days, 1 day, N hours before) | All Going and Maybe guests with notifications enabled          |
| Nudge for unresponded guests                       | Invited guests who have not responded yet                      |
| Profile email change verification                  | The user's new email address                                   |

_Opmerking over herinneringen:_ de ingebouwde cron-planner controleert elke 15 minuten welke herinneringen verstuurd moeten worden. Elk type herinnering wordt per gebruiker en evenement precies één keer verstuurd.

_Note on Host RSVP Alerts:_ When a guest RSVPs, the host and every co-host receive a **"New RSVP" alert** email summarizing the response (guest name, status, plus-ones, note) plus the current Going/Maybe/Can't-Go tallies. This is controlled per event by the **Email me when a guest RSVPs** toggle under **Event Settings → RSVP Options → Notification Settings** — new events default it **on** (a matching **Text me when a guest RSVPs** toggle defaults **off** and appears only when SMS is enabled, backed by the `Event.hostAlertEmail` / `Event.hostAlertSms` columns). Host alerts are **not** affected by the site-wide guest-email channel toggle — an operator who turns off guest email notifications will still receive their own new-RSVP alerts (the SMS alert does respect the site-wide SMS toggle).

Personalized guest invitations keep the recipient’s RSVP context in the **View event details** link, just like the response buttons. This applies to newly sent and resent invitations; previously delivered emails are unchanged.

_Note on Themed Templates:_ Every event email (invite, RSVP confirmation, approval, update/reminder) is styled from that event's theme — see [Themed Email Templates](#e-mails-met-thema) below.

---

## Wat gebeurt er als e-mail niet is ingesteld

Als er geen e-mailinstellingen in `.env` of het beheerpaneel zijn ingevuld, schrijft de applicatie meldingen naar de **console** in plaats van e-mails te versturen.

**In de ontwikkelomgeving** (wanneer `NODE_ENV` niet `production` is) wordt het volledige bericht — ontvanger, onderwerp en inhoud, inclusief inloglinks — naar de standaarduitvoer geschreven. Inlogverzoeken schrijven ook een aparte regel met `[auth:magic-link-fallback]`.

Bij een testomgeving in containers bekijk je de logboeken van de **app-container**. Als je testapp bijvoorbeeld het Compose-bestand gebruikt dat vanuit de broncode bouwt:

```bash
docker compose -f docker-compose.yml logs --since 10m app
```

Gebruik dezelfde Compose-bestanden als de draaiende testomgeving en zoek naar `Magic link for` en het e-mailadres van het testaccount. De [handleiding voor voorbeeldgegevens](sample-data.md) beschrijft `host@test.com` en de demo-evenementen.

Gebruik je de optionele [lokale ontwikkelwerkwijze via WSL](local-development.md), dan draait de app buiten Docker. Lees dan de terminal waarin `npm run dev` wordt uitgevoerd. De logboeken van PostgreSQL en Redis bevatten geen inloglinks.

**In productie** schrijft de terugvaloptie bewust **geen ontvangers, berichtinhoud of inlog-/aanmeldtokens** naar de logboeken. Deze toegangsmiddelen horen niet thuis in logopslag. Er wordt alleen een algemene waarschuwing vastgelegd dat er geen transport is ingesteld:

```
[email:dev] No email transport configured — message not sent. Configure SMTP or a Cloudflare provider.
```

_Opmerking:_ de console-terugval is alleen bedoeld voor lokale ontwikkeling. Een productieomgeving **moet** een echte e-mailprovider (SMTP of Cloudflare) configureren. Anders worden inloglinks en meldingen niet verstuurd.

The published image and the repository's Dockerfile both run in production mode. `SEED_TEST_DATA=true` loads sample content; it does not enable development logging or make production magic links appear in container logs.

---

## Een provider kiezen

We ondersteunen drie manieren om e-mail te versturen. Kies de optie die het best bij je hosting past:

| Provider                | Best for                                                                                        | Inbound replies       | Setup Complexity |
| ----------------------- | ----------------------------------------------------------------------------------------------- | --------------------- | ---------------- |
| **SMTP**                | Most users (uses existing personal or business email accounts).                                 | No                    | Low              |
| **Cloudflare Workers**  | Custom domain owners using Cloudflare DNS who want guests to be able to reply to update emails. | Yes (Auto-forwarding) | Medium           |
| **Cloudflare REST API** | Cloudflare DNS users who want a quick outbound setup without deploying serverless worker code.  | No                    | Low-Medium       |

---

## Optie A: SMTP

SMTP is the simplest option. Add these variables to your `.env`:

```env
SMTP_HOST="smtp.provider.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="username@domain.com"
SMTP_PASS="your-password"
EMAIL_FROM="RSVP to Me <username@domain.com>"
```

---

### Gmail instellen

Voor Gmail moet je een **app-wachtwoord** gebruiken in plaats van je gewone Google-wachtwoord.

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security).
   - Under "How you sign in to Google", click **2-Step Verification** and follow the prompts to activate it.
2. **Create an App Password:**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
   - In the **App name** field, type `rsvp-to-me` and click **Create**.
   - Copy the 16-character code (e.g. `abcd efgh ijkl mnop`) shown on screen.
3. **Configure your `.env`:**
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="youraddress@gmail.com"
   SMTP_PASS="abcdefghijklmnop"
   EMAIL_FROM="RSVP to Me <youraddress@gmail.com>"
   ```
   _Note: Free Gmail accounts are subject to a sending limit of ~500 emails per day._

---

### Outlook / Hotmail instellen

1. **Create an App Password (if 2FA is active):**
   - Go to [Microsoft Account Security](https://account.microsoft.com/security) and click **Advanced security options**.
   - Under the "App passwords" header, click **Create a new app password** and copy the code.
2. **Configure your `.env`:**
   ```env
   SMTP_HOST="smtp-mail.outlook.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="youraddress@outlook.com"
   SMTP_PASS="your-app-password"
   EMAIL_FROM="RSVP to Me <youraddress@outlook.com>"
   ```

---

### Fastmail instellen

1. **Create an App Password:**
   - Go to Fastmail **Settings** > **Developer keys** > [New App Password](https://www.fastmail.com/settings/security/devicekeys/new).
   - Set the name to `rsvp-to-me` and access level to `Mail (IMAP/POP/SMTP)`.
   - Click **Generate password** and copy the key.
2. **Configure your `.env`:**
   ```env
   SMTP_HOST="smtp.fastmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="youraddress@fastmail.com"
   SMTP_PASS="your-app-password"
   EMAIL_FROM="RSVP to Me <youraddress@fastmail.com>"
   ```

---

### Mailgun instellen

1. **Add and Verify your Domain:**
   - Sign up at [Mailgun](https://www.mailgun.com).
   - Go to **Sending** > **Domains** > **Add New Domain** and enter your custom domain.
   - Add the TXT/MX records shown by Mailgun to your DNS registrar to verify ownership.
2. **Get SMTP Credentials:**
   - Go to your domain settings in the Mailgun dashboard and click **SMTP credentials**.
   - Click **Create new SMTP user** and note the username and generated password.
3. **Configure your `.env`:**
   ```env
   SMTP_HOST="smtp.mailgun.org" # Use "smtp.eu.mailgun.org" if your domain is in the EU region
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="postmaster@yourdomain.com"
   SMTP_PASS="your-mailgun-smtp-password"
   EMAIL_FROM="RSVP to Me <noreply@yourdomain.com>"
   ```

---

### Amazon SES instellen

1. **Verify your Identity:**
   - Open the AWS Console and go to **Amazon SES**.
   - Click **Verified identities** > **Create identity**. Choose "Email address" or "Domain" and complete the verification steps.
2. **Create SMTP Credentials:**
   - In the SES console, navigate to **Account dashboard** > **SMTP settings** > **Create SMTP credentials**.
   - Generate the credentials and download the CSV file containing your SMTP username and password.
3. **Configure your `.env`:**
   ```env
   SMTP_HOST="email-smtp.us-east-1.amazonaws.com" # Replace with your active AWS region
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="YOUR_SES_SMTP_USERNAME"
   SMTP_PASS="YOUR_SES_SMTP_PASSWORD"
   EMAIL_FROM="RSVP to Me <noreply@yourverifieddomain.com>"
   ```
   _Note: Newly created AWS SES accounts are placed in sandbox mode. You must request sandbox removal from AWS to email unverified guest addresses._

---

## Optie B: Cloudflare Workers (volledige configuratie)

This option deploys a small serverless script to your Cloudflare account. It handles outbound email delivery and forwards inbound guest replies back to your personal email address.

### Vereisten

- A domain managed by Cloudflare DNS.
- Cloudflare Email Routing enabled on that domain (navigate to **Email** > **Email Routing** > **Get Started** to insert the default MX records automatically).

---

### 1. SPF en DKIM instellen

To authorize Cloudflare to send emails on behalf of your domain:

1. Under **Email Routing**, go to the **Email Sending** tab.
2. Follow the setup wizard to add the required SPF (TXT), DKIM (TXT), and tracking (MX) records to your DNS list.
3. Wait for the Domain Status to show as **Active** or **Verified**.

---

### 2. De Worker uitrollen

We use Wrangler CLI to compile and push the worker:

1. Install [Node.js](https://nodejs.org) (LTS version) on your machine.
2. Open a terminal, navigate to the `worker/` directory inside the repository, and install wrangler:
   ```bash
   npm install -g wrangler
   ```
3. Log in to your Cloudflare account:
   ```bash
   wrangler login
   ```
4. Deploy the worker script:
   ```bash
   wrangler deploy
   ```
5. Copy the deployed worker URL (e.g. `https://rsvp-email-worker.yourname.workers.dev`).

---

### 3. Geheimen en variabelen instellen in Cloudflare

1. Generate a strong API secret token:
   ```bash
   openssl rand -hex 32
   ```
2. Bind this secret key to your deployed Worker:
   ```bash
   wrangler secret put API_SECRET
   # Paste your generated hex string when prompted
   ```
3. In the Cloudflare Dashboard:
   - Navigate to **Workers & Pages** > click on your worker (`rsvp-email-worker`) > **Settings** > **Variables**.
   - Under **Environment Variables**, click **Edit variables** and add `INBOUND_FORWARD_TO` (Text type) with your admin/fallback email address (e.g. `you@domain.com`) as the value. _Note: Guest replies go dynamically to each host's email by default using the Reply-To header; this address is only a fallback for direct replies._
   - Scroll down to **Bindings** > click **Add binding** > select **Email Service** > set Variable Name to `EMAIL` (all uppercase) and save.

---

### 4. De route voor inkomende e-mail aanmaken

1. Go back to your domain's **Email Routing** > **Routes** tab.
2. Under **Destination addresses**, make sure your forwarding email address is verified.
3. Under **Routing Rules**, click **Add route**:
   - _Custom Address:_ The email address you want to send invites from (e.g., `rsvps@yourdomain.com`).
   - _Action:_ Select **Send to Worker**.
   - _Destination Worker:_ Select your deployed worker (`rsvp-email-worker`).
4. Click **Save**.

---

### 5. Je bestand `.env` configureren

Enable the Worker integration in your app:

```env
CLOUDFLARE_WORKER_EMAIL_URL="https://rsvp-email-worker.yourname.workers.dev"
CLOUDFLARE_WORKER_API_SECRET="your-generated-hex-secret"
EMAIL_FROM="RSVP to Me <rsvps@yourdomain.com>"
INBOUND_FORWARD_TO="you@domain.com" # Admin fallback email address
```

Leave all `SMTP_*` fields blank.

---

## Optie C: Cloudflare REST API (alleen uitgaand)

If you do not need inbound guest replies forwarded to you, you can call Cloudflare's Email Routing API directly without setting up Wrangler or deploying a Worker.

1. **Enable Email Routing:** Ensure Email Routing is active on your domain in Cloudflare.
2. **Find your Account ID:** Select your domain in the Cloudflare Dashboard and copy the **Account ID** from the right sidebar.
3. **Create an API Token:**
   - Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens).
   - Click **Create Token** > select the **Send Email** template (or create a custom token granting **Account** | **Email Sending** | **Edit**).
   - Scope it to your account and copy the generated token.
4. **Provide your credentials.** Set both the Account ID and API token — either in the Admin Panel (**Admin → Email**) or in your `.env`:
   ```env
   CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
   CLOUDFLARE_API_TOKEN="your-api-token"
   EMAIL_FROM="RSVP to Me <rsvps@yourdomain.com>"
   ```
   Leave all `SMTP_*` and `CLOUDFLARE_WORKER_*` fields blank.
5. **Select the provider.** In **Admin → Email**, set the Email Provider to **Cloudflare REST API**. This is required — unlike SMTP and the Cloudflare Worker, the REST API provider is never auto-detected from environment variables alone, so without this selection the app falls back to console logging.

---

## Je e-mailconfiguratie testen

Het tabblad **E-mail** in het beheerpaneel is verdeeld in twee uitklapbare onderdelen:

- **Email Setup** — the guest-notifications toggle, provider selector, provider fields, and a **Test Connection** button. The connection test now sends the fully styled test email (not a plain "it works" line) to your admin address, so you can confirm both delivery _and_ rendering.
- **Email Templates** — see [Editing Template Copy & Content Blocks](#sjabloontekst-en-inhoudsblokken-bewerken).

To verify delivery:

1. Log in to the application as an `ADMIN` user.
2. Go to `/admin` → the **Email** tab → open **Email Setup**.
3. Configure your provider, then click **Test Connection**.
4. Check your inbox and spam folder for the styled test email.

If the email does not arrive, inspect your container logs:

```bash
docker compose logs app | grep -i email
```

---

## E-mails met thema

All event-related emails are rendered from the event's own theme, so an invite for a Halloween-themed party looks like that party and a Soft & Dreamy wedding shower looks like that shower. Emails are built with [React Email](https://react.email/) into table-based HTML that renders reliably across Gmail, Apple Mail, and Outlook.

**How theming flows into email:**

- The email palette is **derived from the same `resolveTheme()`** engine that styles the event page (`lib/email-theme.ts` → `resolveEmailTheme()`), so it always tracks the event page. There is no separate email palette to maintain.
- Theme is resolved **at send time** from the event's current theme row. If a host changes their theme, every subsequent email — including automated reminders — uses the new look. Already-sent emails are unchanged.
- New theme presets (built-in or admin-created) work in email automatically, with no email-code changes.
- Emails use a **light canvas with a themed gradient hero** (plus the cover image when set). This is the most reliable choice across clients: Apple Mail/Outlook honor the `prefers-color-scheme` dark tweaks we ship, while Gmail applies its own dark treatment to the light canvas gracefully.

> **Degradation contract (for developers):** email clients cannot run modern CSS, so `resolveEmailTheme()` is the single place where web-theme capabilities are mapped to email-safe equivalents. Every new `ResolvedTheme` capability must declare its email mapping or explicitly degrade (e.g. a future background image → a bulletproof hero background with a solid-color fallback; animation → a static equivalent). Anything undeclared is ignored — email rendering must never break because a web-only token was added. See the module docblock in `lib/email-theme.ts` and the rule in `AGENTS.md`.

> **Self-hosting note:** cover images and the `.ics` calendar link are absolute URLs built from `NEXT_PUBLIC_APP_URL`. Set it to your real public URL so guests' mail clients can load the cover image and download calendar files.

---

## Sjabloontekst en inhoudsblokken bewerken

Under **Admin Panel → Email → Email Templates**, admins can customize each email without touching code. Pick a template from the dropdown to edit it; a **live preview** renders beside the editor (with a Dark/Soft/Bold sample switcher for event emails), and **Send test to me** delivers a sample to your admin address.

**What you can edit per template:**

- **Subject line** — with `{placeholder}` variables (see below).
- **Body copy** — for templates whose body is editable (invite, RSVP confirmation, sign-in link, welcome, test). The host-written blast/reminder and the approval/host-alert bodies are generated, so only their subjects are editable.
- **Content blocks** — toggle optional pieces on/off: cover image, "Hosted by" flourish, Google Maps link, and add-to-calendar links (only the toggles relevant to each template are shown).
- **Reset to default** — clears the current template's overrides and restores its shipped copy.
- **Reset all to default** — clears the saved overrides for **every** template at once and restores all shipped defaults (asks for confirmation first). Use this if a template's subject or body is showing leftover text from earlier testing.

**Placeholders** are written in curly braces and substituted at send time. Available variables depend on the template (shown as clickable chips in the editor), e.g. `{guestName}`, `{hostName}`, `{eventTitle}`, `{eventDate}`, `{location}`, `{status}`. Unknown placeholders are left as-is so typos are visible. Copy is inserted as plain text — any HTML you type appears literally and cannot break the layout.

Template overrides are stored per-template in system configuration and apply site-wide; when a template has no override, the shipped default is used as-is (generated on the fly, no database row required). Hosts do not edit template copy; they can only preview their event's emails (see the host guide).

---

## Problemen oplossen

### ‘Connection refused’ of ‘Network Error’

- Ensure that `SMTP_HOST` is spelled correctly.
- Check that `SMTP_PORT` matches your provider's requirements.
- Some home internet service providers block port `25` or `587` outbound. Try configuring port `465` with `SMTP_SECURE="true"`.

### ‘Authentication failed’ / ‘535 Invalid credentials’

- **Gmail:** Double-check that you created a 16-character App Password, and that you are not entering your regular Google login password.
- **Outlook:** Ensure that App Passwords are created if 2FA is active on your Microsoft account.
- Check that `SMTP_USER` is your full email address.

### E-mails komen direct in de spammap terecht

This indicates that the receiving mail server is rejecting your emails due to authentication failure.

- Ensure your `EMAIL_FROM` matches the domain you are authorized to send from.
- Check that your DNS registrar contains active SPF, DKIM, and DMARC records (see below).

### De Cloudflare Worker geeft 401 Unauthorized terug

De waarde van `CLOUDFLARE_WORKER_API_SECRET` in `.env` komt niet overeen met het geheim dat aan je Cloudflare Worker is gekoppeld. Voer `wrangler secret put API_SECRET` opnieuw uit om de juiste waarde in te stellen.

---

## Uitleg over SPF, DKIM en DMARC

Met deze drie DNS-records controleer je bij ontvangende mailservers of e-mail vanaf jouw domein is geautoriseerd.

### SPF (Sender Policy Framework)

Een SPF-record vermeldt welke mailservers namens jouw domein e-mail mogen versturen. Voeg dit bij je domeinprovider toe als een **TXT-record**.

- _For Gmail SMTP:_
  ```
  v=spf1 include:_spf.google.com ~all
  ```
- _For Cloudflare Email Routing:_
  ```
  v=spf1 include:_spf.mx.cloudflare.net ~all
  ```

### DKIM (DomainKeys Identified Mail)

DKIM signs outgoing emails with a cryptographic key. The public key is published in your domain's DNS records, allowing mail servers to verify that the message wasn't altered in transit. Your email provider will generate the specific TXT/CNAME records for you to add.

### DMARC (Domain-based Message Authentication)

DMARC instructs receiving mail servers on what to do if an email fails SPF or DKIM checks.
Add a **TXT** record with the Host/Name set to `_dmarc.yourdomain.com`:

```
v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@yourdomain.com
```

- `p=quarantine` tells servers to put failing emails into the spam folder.
- `p=none` is a safe testing option that just monitors without filtering.

### Waar je DNS-records toevoegt

Log in op het dashboard van je domeinprovider (bijvoorbeeld Cloudflare, GoDaddy, Namecheap of Name.com) en open **DNS Settings → DNS Records** om de TXT- en CNAME-waarden toe te voegen.
