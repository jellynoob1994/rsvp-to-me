---
title: Sms instellen
description: Twilio koppelen, account instellen, limieten en kosten.
category: Configuratie
audience: admin
order: 40
---

# Handleiding voor sms (Twilio)

Sms-berichten in RSVP to Me worden verzorgd door Twilio en zijn volledig optioneel. Deze handleiding laat zien hoe je een Twilio-account aanmaakt, een telefoonnummer verkrijgt en dit aan je installatie koppelt.

---

## Inhoudsopgave

1. [Wat sms mogelijk maakt](#wat-sms-mogelijk-maakt)
2. [Wat je nodig hebt](#wat-je-nodig-hebt)
3. [Stap 1 — Een Twilio-account aanmaken](#stap-1--een-twilio-account-aanmaken)
4. [Stap 2 — Een telefoonnummer verkrijgen](#stap-2--een-telefoonnummer-verkrijgen)
5. [Stap 3 — Je inloggegevens vinden](#stap-3--je-inloggegevens-vinden)
6. [Stap 4 — RSVP to Me configureren](#stap-4--rsvp-to-me-configureren)
7. [Sms testen](#sms-testen)
8. [Beperkingen van een proefaccount](#beperkingen-van-een-proefaccount)
9. [Costs](#costs)
10. [Sms uitschakelen](#sms-uitschakelen)
11. [Problemen oplossen](#problemen-oplossen)

---

## Wat sms mogelijk maakt

Zonder sms werkt de app volledig via e-mail. Met Twilio erbij krijg je de volgende mogelijkheden:

| Functie | Beschrijving |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Inloggen met een link via sms** | Gebruikers kunnen inloggen door hun telefoonnummer in te voeren in plaats van hun e-mailadres. |
| **Sms-uitnodigingen** | Verstuur evenementuitnodigingen rechtstreeks naar telefoonnummers van gasten. |
| **Aanmeldbevestigingen** | Gasten ontvangen automatisch een sms ter bevestiging van hun status Aanwezig of Misschien. |
| **Meldingen voor de organisator** | Organisatoren ontvangen een sms wanneer een gast reageert, met naam en status van de gast, diens notitie en een link naar de gastenlijst. |
| **Meldingen over goedkeuring** | Gasten ontvangen een bericht wanneer hun aanmelding is goedgekeurd of afgewezen. |
| **Groepsupdates over het evenement** | Verstuur direct sms-meldingen naar alle gasten met de status Aanwezig of Misschien. |
| **Automatische herinneringen** | Plan sms-herinneringen 7 dagen, 1 dag of een zelfgekozen aantal uren vóór het evenement. |

Iedere gebruiker beheert de eigen meldingsvoorkeuren (e-mail of sms) via het profiel. Organisatoren kunnen per evenement hun meldingen over **Nieuwe aanmelding** in- of uitschakelen via **Evenementinstellingen → Aanmeldopties → Meldingsinstellingen**. E-mailmeldingen staan standaard aan; sms-meldingen staan standaard uit. De organisator en alle mede-organisatoren ontvangen deze meldingen.

---

## Wat je nodig hebt

- Een Twilio-account (een gratis proefperiode is beschikbaar).
- Een creditcard om je identiteit te verifiëren, ook bij een gratis proefaccount.
- Een Twilio-telefoonnummer dat sms ondersteunt (in de VS ongeveer $ 1,15 per maand).

---

## Stap 1 — Een Twilio-account aanmaken

1. Ga naar [Twilio registreren](https://www.twilio.com/try-twilio).
2. Vul je naam en e-mailadres in en kies een wachtwoord.
3. Verifieer je e-mailadres via de link die je per e-mail ontvangt.
4. Verifieer je telefoonnummer met de code die je per sms ontvangt.
5. Beantwoord de introductievragen voor ontwikkelaars. De antwoorden passen alleen de weergave van je dashboard aan.

Je nieuwe proefaccount begint met ongeveer $ 15,00 aan gratis tegoed.

---

## Stap 2 — Een telefoonnummer verkrijgen

Een proefaccount bevat één gratis telefoonnummer. Zo koop je een nummer:

1. Open de [Twilio Console](https://console.twilio.com).
2. Zoek op de startpagina naar **Get a Twilio phone number**, of open via het menu links **Phone Numbers → Manage → Buy a number**.
3. Kies je land.
4. Vink bij **Capabilities** het vakje **SMS** aan.
5. Klik op **Search** en kies een nummer uit de lijst.
6. Klik op **Buy**. De kosten worden van je proeftegoed afgeschreven.
7. Noteer het telefoonnummer in E.164-notatie.

### E.164-telefoonnotatie

E.164 betekent: `+` gevolgd door de landcode en het volledige telefoonnummer, zonder spaties, streepjes of haakjes.

| Land | Weergaveformaat | E.164-formaat |
| -------------- | ---------------- | --------------- |
| Verenigde Staten / Canada | `(555) 867-5309` | `+15558675309` |
| Verenigd Koninkrijk | `07911 123456` | `+447911123456` |
| Australië | `0412 345 678` | `+61412345678` |

---

## Stap 3 — Je inloggegevens vinden

Je accountgegevens staan op de startpagina van de Twilio Console bij **Account Info**.

1. **Account SID:** een unieke identificatie die begint met `AC` (bijvoorbeeld `ACyour_account_sid_here`).
2. **Auth Token:** klik op het oogpictogram (👁) om je authenticatietoken te tonen.
3. **Phone Number:** het Twilio-telefoonnummer in E.164-notatie.

> **Waarschuwing:** met je Auth Token kan iemand toegang krijgen tot je Twilio-account en de bijbehorende kosten. Houd deze geheim en deel hem nooit.

---

## Stap 4 — RSVP to Me configureren

Voeg de drie Twilio-variabelen toe aan je bestand `.env`:

```env
TWILIO_ACCOUNT_SID="ACyour_account_sid_here"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+15558675309"
```

Start de app-container opnieuw om de wijzigingen te laden:

```bash
docker compose restart app
```

> Je kunt deze gegevens ook invoeren in het beheerpaneel onder **Beheerder → Sms**, in plaats van of naast het bestand `.env`. Waarden uit het beheerpaneel hebben voorrang en worden direct toegepast zonder herstart.

---

## Reageren op een uitnodiging via sms inschakelen

Gasten die een uitnodiging per sms ontvangen, kunnen antwoorden met **YES**, **NO** of **MAYBE** om hun aanmelding in te stellen — een link is niet nodig. Stel hiervoor de webhook voor inkomende berichten van je Twilio-nummer in:

1. Open in de Twilio Console **Phone Numbers → Manage → Active Numbers** en kies je nummer.
2. Stel onder **Messaging** de optie **A message comes in** in op **Webhook**, met deze URL:
   ```
   https://yourdomain.com/api/webhooks/twilio
   ```
   Kies de HTTP-methode `POST`.
3. Sla de wijziging op. Inkomende antwoorden worden gecontroleerd met je Twilio Auth Token, gekoppeld aan de openstaande uitnodiging van de gast op basis van het telefoonnummer en vervolgens op diens aanmelding toegepast.

> This step is only needed if you want guests to RSVP by replying to texts. Outbound SMS (confirmations, reminders, blasts) works without it.

> **Let op:** de webhook controleert de handtekening met dezelfde Twilio Auth Token die voor uitgaande sms wordt gebruikt. Dit geldt zowel voor de versleuteld opgeslagen waarde in het beheerpaneel als voor de waarde in `.env`; de waarde uit het beheerpaneel heeft voorrang. Heb je Twilio alleen via het beheerpaneel ingesteld, dan werkt reageren via sms ook zonder de omgevingsvariabele `TWILIO_AUTH_TOKEN`. Geeft ieder inkomend antwoord een handtekeningfout, controleer dan of de token onder **Beheerder → Sms** overeenkomt met de token in je Twilio Console.

---

## Sms testen

Je kunt de verbinding rechtstreeks vanuit het beheerpaneel testen:

1. Log in op de applicatie met een gebruiker met de rol `ADMIN`.
2. Open `/admin` en kies het tabblad **Sms**.
3. Klik op **Test-sms versturen**.
4. Voer je geverifieerde telefoonnummer in E.164-notatie in en verstuur de test.
5. Controleer of het bericht aankomt.

_Let op: met een proefaccount kun je alleen testberichten sturen naar geverifieerde telefoonnummers (zie hieronder)._

---

## Beperkingen van een proefaccount

Twilio-proefaccounts hebben twee belangrijke beperkingen.

### 1. Alleen versturen naar geverifieerde nummers

Je kunt alleen sms-berichten versturen naar telefoonnummers die je expliciet in de Twilio Console hebt geverifieerd.

- Ga voor het verifiëren van een nummer naar **Phone Numbers → Verified Caller IDs → [Add a Verified Caller ID](https://console.twilio.com/us1/account/verified-caller-ids/add)**.
- Voer het telefoonnummer in en vul de verificatiecode in die Twilio verstuurt.

### 2. Vermelding van het proefaccount

Alle sms-berichten die vanaf een proefaccount worden verstuurd, beginnen met:
`Sent from your Twilio trial account - `

### Je account upgraden

Klik bovenaan de Twilio Console op **Upgrade Project** en voeg een creditcard toe om beide beperkingen op te heffen. Je resterende proeftegoed blijft behouden.

---

## Kosten

Twilio rekent per verstuurd bericht.

- **Huur van een Amerikaans telefoonnummer:** ongeveer $ 1,15 per maand.
- **Uitgaande sms in de VS:** ongeveer $ 0,0079 per bericht.
- **Internationale sms:** de prijs verschilt per land.

Voor een evenement met 30 gasten die elk twee sms-meldingen ontvangen, zijn de geschatte kosten minder dan $ 0,50.
Bekijk voor de actuele tarieven de [Twilio-prijspagina voor sms](https://www.twilio.com/en-us/sms/pricing/us).

---

## Sms uitschakelen

Wil je terug naar alleen e-mail? Maak de drie Twilio-variabelen in je bestand `.env` leeg:

```env
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

Start de app-container opnieuw:

```bash
docker compose restart app
```

---

## Problemen oplossen

### ‘Authentication Error’ / code 20003

Je `TWILIO_ACCOUNT_SID` of `TWILIO_AUTH_TOKEN` is onjuist. Kopieer beide waarden opnieuw vanuit de Twilio Console.

### ‘Invalid From Phone Number’ / code 21606

Het nummer in `TWILIO_PHONE_NUMBER` heeft een onjuist formaat of is niet van jouw Twilio-account. Gebruik E.164-notatie en controleer of het nummer in de lijst **Active Numbers** staat.

### ‘Unverified Number’ / code 21608

Je probeert met een proefaccount een sms naar een niet-geverifieerd nummer te sturen. Verifieer het nummer eerst via **Verified Caller IDs** of stap over op een betaald account.

### Berichten komen niet aan

- Open in de Twilio Console **Monitor → Logs → Messaging** en controleer op bezorgfouten.
- Controleer of het telefoonnummer van de ontvanger in het profiel inclusief landcode is opgeslagen.
