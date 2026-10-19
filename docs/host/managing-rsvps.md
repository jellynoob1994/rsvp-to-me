---
title: Aanmeldingen beheren
description: Statussen, goedkeuring, capaciteit, extra gasten, vragenlijsten en wijzigingslinks.
category: Gasten en aanmeldingen
audience: host
order: 60
---

# Aanmeldingen beheren

Alles over hoe gasten reageren — en hoe jij dat beheert — vind je in de **Instellingen** van je evenement en op de [gastenlijst](guest-list.md).

Op de evenementpagina voor gasten blijft de aanmeldkaart onderaan het scherm zichtbaar zolang aanmelden openstaat. Zodra een gast ernaartoe scrolt, komt de kaart op de normale plek te staan. Na een reactie verandert de kaart in een beknopt overzicht met Aanwezig, Misschien, Afwezig of Wacht op goedkeuring, met een link om de reactie te wijzigen als dat is toegestaan. De kaart blijft niet langer zweven wanneer het aanmeldvenster sluit of het evenement begint.

---

## Aanmeldstatussen

Gasten kiezen **Aanwezig**, **Misschien** of **Afwezig**. Je kunt de optie **Misschien** per evenement uitschakelen als je alleen ja of nee wilt toestaan.

Bij de bevestiging van Aanwezig krijgt de gast naast de status een groen vinkje in een cirkel te zien.

---

## Goedkeuring

Schakel **Goedkeuring vereist** in als je reacties eerst wilt beoordelen. Nieuwe aanmeldingen krijgen dan de status **In afwachting** totdat je ze via de gastenlijst **Goedkeurt** of **Afwijst**. De gast ontvangt een melding over je beslissing. (De reactie van een gast die op goedkeuring wacht, wordt wel opgeslagen; alleen de goedkeuring ontbreekt nog.)

---

## Capaciteitslimieten

Stel het maximale aantal gasten in dat **Aanwezig** kan zijn. Zodra de limiet is bereikt:

- Nieuwe gasten kunnen niet meer aangeven dat ze **Aanwezig** zijn en zien dat het evenement vol is.
- Gasten kunnen nog wel **Misschien** of **Afwezig** kiezen.
- Verhoog de capaciteit in de instellingen om meer gasten toe te laten.

---

## Extra gasten

- Sta extra gasten toe of schakel ze uit.
- Stel het maximale aantal extra gasten per aanmelding in.
- Vereis desgewenst namen voor extra gasten.

Extra gasten tellen mee bij de aanmelding van de hoofdgast en hebben dezelfde status. Het zijn geen aparte accounts en ze hebben geen eigen contactgegevens.

---

## Aanmelddeadline en wijzigen van aanmeldingen

Je kunt via **Instellingen → Aanmeldingen** een optionele **aanmelddeadline** instellen.

- **Voor de deadline:** gasten kunnen zich aanmelden en hun reactie op elk moment wijzigen.
- **Na de deadline:**
  - Nieuwe gasten kunnen zich niet meer aanmelden en zien een melding dat aanmelden gesloten is.
  - Bestaande gasten kunnen hun reactie niet via hun persoonlijke wijzigingslink aanpassen, tenzij de optie **Gasten toestaan hun aanmelding na de deadline te wijzigen** in de instellingen is ingeschakeld. Als deze optie uitstaat, worden de wijzigingslinks afgeschermd.
  - Organisatoren en mede-organisatoren vallen niet onder deze deadlinebeperkingen en kunnen aanmeldingen op elk moment beheren.

De geplande starttijd van het evenement is de uiterste grens voor gasten. Zodra `startAt` is bereikt, kunnen gasten geen nieuwe aanmelding versturen of een bestaande aanmelding wijzigen, zelfs niet als wijzigen na de deadline is toegestaan. Een gast die de persoonlijke wijzigingslink opent, ziet een alleen-lezen overzicht en de instructie om contact op te nemen met de organisator. Organisatoren, mede-organisatoren en beheerders kunnen reacties blijven wijzigen. Als het evenement naar een tijdstip in de toekomst wordt verplaatst, gaat de aanmeldtoegang automatisch weer open volgens de normale deadlineregels.

---

## Aangepaste vragenlijsten

Voeg eigen vragen toe aan het aanmeldformulier, bijvoorbeeld over dieetwensen, muzieknummers of T-shirtmaten:

- **Veldtypen:** tekst op één regel, tekst op meerdere regels, keuzelijst en selectievakje.
- **Verplicht of optioneel:** stel per vraag in of een antwoord vereist is.
- **Volgorde aanpassen:** versleep vragen om de volgorde op het formulier te bepalen.

Antwoorden verschijnen bij elke gast en worden opgenomen in de [CSV-export](guest-list.md).

---

## Links om aanmeldingen te wijzigen

Gasten hebben geen account nodig om hun aanmelding te wijzigen. Elke bevestigingsmail bevat een persoonlijke, unieke link. Via die link kunnen gasten hun status of antwoorden wijzigen totdat het evenement begint. Is een gast de link kwijt, kijk dan bij de [veelgestelde vragen](faq.md).

---

## Misbruik voorkomen

Wanneer de beheerder van de site botbescherming inschakelt, moet elke nieuwe of gewijzigde aanmelding eerst een beveiligingscontrole doorlopen voordat deze wordt opgeslagen. Dit geldt ook wanneer een organisator of mede-organisator een aanmelding wijzigt of een gast ter plaatse registreert, omdat ook organisatoraccounts misbruikt kunnen worden. De meeste normale gebruikers krijgen geen extra vraag te zien. Meerdere beveiligde acties kunnen tegelijk lopen; het uploaden van een afbeelding blokkeert bijvoorbeeld niet de beveiligingscontrole voor een aanmelding of reactie.

Aanmeldingen zijn ook beperkt tot een maximaal aantal verzoeken per client-IP-adres, zowel algemeen als per evenement. Samen helpen deze maatregelen geautomatiseerde nepaanmeldingen af te remmen voordat een bevestiging per e-mail of sms wordt verstuurd.
