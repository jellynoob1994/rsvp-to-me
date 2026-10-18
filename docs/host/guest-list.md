---
title: Je gastenlijst
description: Filters, zichtbaarheid van de gastenlijst, namen tonen en exporteren naar CSV.
category: Gasten en aanmeldingen
audience: host
order: 70
---

# Je gastenlijst

Op de gastenlijst (via `/e/[slug]/guests`) zie je wie er komt en beheer je alle gasten op één plek.

De kaart **Gasten** op je evenementpagina is altijd zichtbaar voor jou en je mede-organisatoren, ook voordat de eerste aanmelding binnenkomt. Kies **Alles bekijken →** om de volledige gastenlijst te openen of gebruik het tandwiel om rechtstreeks naar de aanmeldinstellingen te gaan.

## Voorbeeld van gastenbeheer

![Gastenbeheer voor Wijnavond met aanwezigheidsaantallen, filters, CSV-export, gasten ter plaatse en incheckbediening](../../public/docs/images/guest-management.png)

Volg reacties en aankomsten, check gasten in, voeg gasten zonder aanmelding toe en exporteer de gastenlijst vanuit één overzicht.

---

## Filters

Filter de lijst op status om snel te vinden wat je zoekt:

- **Iedereen** — iedereen die bij het evenement hoort, inclusief uitgenodigde gasten die nog niet hebben gereageerd
- **Aanwezig**, **Misschien** en **Afwezig**
- **Uitgenodigd** — uitgenodigd, maar nog niet gereageerd
- **Wacht op goedkeuring** — wacht op jouw beslissing om goed te keuren of af te wijzen

Organisatoren en mede-organisatoren kunnen ook zoeken op gastnaam, e-mailadres, telefoonnummer of de naam van een extra gast. Daarnaast kunnen ze filteren op gezelschappen die **Aangekomen** of **Nog niet aangekomen** zijn.

---

## Inchecken en gasten ter plaatse

Elk aanmeldrecord heeft een knop **Inchecken**, ook voor gasten die nog niet hebben gereageerd, hebben aangegeven **Afwezig** te zijn of op goedkeuring wachten. Zo kan de organisator gasten zonder aanmelding en lastminute-wijzigingen bij de deur verwerken zonder eerst de aanmelding te veranderen. Een check-in geldt voor de hoofdgast en alle extra gasten bij die aanmelding. Het aanwezigheidsoverzicht wordt direct bijgewerkt met zowel de voortgang per gezelschap als het totale aantal aangekomen personen. Gebruik **Check-in ongedaan maken** en bevestig dit direct op de pagina als je het verkeerde gezelschap hebt ingecheckt. Als je het gezelschap daarna opnieuw incheckt, wordt een nieuwe aankomsttijd vastgelegd.

Gebruik **+ Gast ter plaatse toevoegen** wanneer iemand arriveert zonder aanmelding. Vul de naam, de totale groepsgrootte en eventueel een beschikbaar e-mailadres of telefoonnummer in. Deze actie is alleen beschikbaar voor organisatoren: de gast krijgt een goedgekeurde aanmelding met status Aanwezig en wordt ingecheckt, zonder dat er een bericht wordt verstuurd. Komt de contactinformatie overeen met een bestaande aanmelding, dan wordt dat gezelschap ingecheckt in plaats van dubbel aangemaakt.

Bij uitgenodigde gasten die nog niet hebben gereageerd, staat ook de actie **Uitnodiging opnieuw versturen**. Die stuurt een nieuwe uitnodiging naar het oorspronkelijke e-mailadres of telefoonnummer en behoudt de gebruikelijke controles voor bezorging, snelheidslimieten en de activiteitengeschiedenis. Als een oude uitnodiging niet meer aan een aanmelding is gekoppeld, kun je de uitnodigingsgeschiedenis verwijderen zonder de aanmelding van de gast te verwijderen. Meldt dezelfde gast zich later aan met hetzelfde e-mailadres of telefoonnummer, dan wordt de uitnodiging automatisch opnieuw gekoppeld.

Check-ins zijn direct zichtbaar op het apparaat waarop ze worden uitgevoerd. Andere apparaten waarop de organisator de pagina open heeft staan, zien de bijgewerkte aanwezigheid nadat de pagina is vernieuwd.

---

## Wie kan de gastenlijst zien?

Bepaal in de instellingen hoeveel gasten mogen zien:

- **Iedereen kan de lijst zien** — elke bezoeker kan de lijst bekijken.
- **Alleen aanwezige gasten** — zichtbaar voor je gasten (iedereen die zich heeft aangemeld of de persoonlijke uitnodigingslink heeft geopend) en voor jou en je mede-organisatoren. Anonieme bezoekers die alleen de link hebben, kunnen de lijst niet zien.
- **Alleen organisatoren** — verborgen voor gasten en zichtbaar voor jou en je mede-organisatoren.

Deze instelling wordt op de server afgedwongen en niet alleen op de pagina verborgen. Bij **Alleen aanwezige gasten** of **Alleen organisatoren** wordt de afgeschermde lijst nooit verstuurd naar een browser die deze niet mag zien, ook niet op de speciale gastenlijstpagina `/e/[slug]/guests`.

Ook de RSVP-activiteit volgt dezelfde privacyinstelling. Nieuwe, gewijzigde, verwijderde en uitgenodigde-gastactiviteiten kunnen de naam van een gast of een notitie bij diens aanmelding bevatten. Daarom laat de server die volledige activiteiten weg wanneer de bezoeker de gastenlijst niet mag zien. Activiteit rond inchecken, het ongedaan maken van een check-in en gasten ter plaatse toevoegen blijft altijd alleen zichtbaar voor organisatoren, ongeacht de instelling.

Is je evenement **Privé** of beveiligd met een wachtwoord, dan is de gastenlijst op dezelfde manier afgeschermd als de evenementpagina. Een bezoeker die geen toegang heeft gekregen, kan de lijst niet openen, ongeacht de instelling hierboven.

**Persoonlijke gegevens van gasten blijven privé.** Ook als gasten de lijst mogen zien, zijn contactgegevens (e-mail en telefoon) en persoonlijke links om een aanmelding te wijzigen **alleen zichtbaar voor jou en je mede-organisatoren**. Gasten zien namen en aanmeldstatussen, maar nooit elkaars contactgegevens of privéantwoorden op vragenlijsten.

---

## Aanmeldingen tonen aan gasten

Open **Instellingen → Weergaveopties → Aanmeldingen tonen aan gasten**, direct onder **Zichtbaarheid van de gastenlijst**. Voor Aanwezig, Misschien en Afwezig zijn aparte weergaveopties en een interactieve voorbeeldlijst met voorbeeldreacties beschikbaar.

**Deze instellingen gelden alleen voor gasten. Organisatoren en mede-organisatoren blijven op de evenementpagina en in het gastenbeheer de volledige lijsten en exacte aantallen zien.**

| Instelling | Keuze | Wat gasten zien |
|---|---|---|
| Gastnamen | Direct tonen | Namen verschijnen zodra de pagina wordt geopend. |
| Gastnamen | Tonen na een klik | Een ingeklapte kop kan worden geopend om de namen te tonen. In de volledige gastenlijst toont het selecteren van het bijbehorende antwoordfilter de namen; bij Iedereen beginnen alleen de reeds uitgeklapte lijsten open. |
| Gastnamen | Niet tonen | Dit type reactie, de namen en het aantal worden weggelaten uit de gastenweergave. |
| Aantal voor gasten | Exact aantal | Het werkelijke aantal staat naast het type reactie. |
| Aantal voor gasten | Geen aantal | Het label van de reactie wordt zonder aantal getoond, ook nadat de namen zijn geopend. |
| Aantal voor gasten | Maximaal 3+ tonen | Beschikbaar voor Afwezig: toon 1 of 2 en daarna 3+ bij drie of meer reacties, ook nadat de lijst is geopend. |

De instelling voor aantallen verdwijnt wanneer je **Niet tonen** kiest. Totalen en filterbadges volgen dezelfde keuzes. Het gecombineerde totaal wordt weggelaten wanneer het anders een verborgen of begrensd aantal zou onthullen. Namen kunnen nog steeds worden geteld wanneer een lijst wordt geopend: dit zijn weergavekeuzes, geen extra toegangsregels.

Bij nieuwe evenementen staan Aanwezig en Misschien standaard uitgeklapt met exacte aantallen. Afwezig begint ingeklapt en zonder aantal. Bij bestaande evenementen blijven lijsten uitgeklapt en aantallen exact totdat een organisator dit wijzigt.

**Zichtbaarheid van de gastenlijst** bepaalt nog steeds wie toegang heeft tot de lijst. Wanneer **Alleen organisatoren** is gekozen, zijn de weergaveopties voor gasten uitgeschakeld en blijven de opgeslagen keuzes bewaard voor later. Het wijzigen van weergaveopties verandert geen aanmeldingen, beschikbare aanmeldknoppen, capaciteitsberekeningen, meldingen, incheckgegevens of CSV-export. Het openen van een ingeklapte lijst verstuurt of wijzigt nooit een aanmelding.

---

## CSV-export

Download je gastenlijst als spreadsheet voor inchecklijsten, naamkaartjes of je eigen administratie. De export bevat de volgende kolommen:

De export bevat voor elke aanmelding deze kolommen:

**Naam, e-mail, telefoon, status, extra gasten, goedgekeurd, datum van aanmelding in de lokale tijd van het evenement, inchecktijd in de lokale tijd van het evenement, één kolom per vragenlijstveld, aanmelddatum (UTC) en inchecktijd (UTC).**

De kolommen voor de vragenlijst volgen de ingestelde volgorde. Ontbrekende antwoorden en incheckgegevens zijn leeg. Dubbele vraaglabels krijgen een nummer zodat de kolomkoppen in de spreadsheet uniek blijven.

> Mede-organisatoren en beheerders kunnen de export ook downloaden.
