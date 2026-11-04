# Stap voor stap

Een kleine webapp (PWA) die helpt bij het veranderen van een gewoonte, in je eigen tempo en zonder oordeel. De gebruiker kiest zelf wat hij wil veranderen: roken, alcohol, gamen, suiker, social media, enzovoort.

> **Let op:** dit is een hulpmiddel, geen behandeling en geen medisch advies. Het werkt als een kruk naast een gips: het helpt je op gang en erbij te blijven, maar voor echt herstel hoort hulp van een huisarts of hulpverlener erbij.

## Wat de app doet

- **Persoonlijke start:** vraagt wat je wilt veranderen, je leeftijd, je gezondheid, je reden en wanneer het het moeilijkst is.
- **Goede dagen:** telt je goede dagen in totaal. Een terugval zet de teller niet op nul, om het alles-of-nietsdenken tegen te gaan.
- **"Ik heb nu zin":** een ademhalingsoefening van 60 seconden voor het moment dat de drang komt.
- **"Het is misgegaan":** een vriendelijke reactie met de vraag wat je de volgende keer anders doet.
- **De weger:** voor- en nadelen opschrijven, een als-dan-plan maken, en zien hoe belangrijk en haalbaar stoppen voor je is.
- **Hulp:** huisarts, Druglijn, Tabakstop en Awel.

## Veiligheid

De app past zich aan op wat de gebruiker invult:

- Bij alcohol, slaapmiddelen en medicijnen waarschuwt hij dat plots stoppen gevaarlijk kan zijn en verwijst hij naar de huisarts. Bij hogere leeftijd of gezondheidsproblemen is die waarschuwing sterker.
- Bij epilepsie, zwangerschap of medicijngebruik komt er een extra bericht.
- Bij gebruikers onder de 18 staat een tip om met een volwassene of Awel te praten. Bij onderwerpen over seksualiteit krijgen minderjarigen geen teller of stopdoel, maar een geruststellend bericht.

De herkenning van onderwerpen werkt op trefwoorden en is dus niet waterdicht.

## Privacy

Alle gegevens staan in `localStorage` op het toestel van de gebruiker. Er is geen server, geen account en er wordt niets verstuurd. Via de pagina **Hulp** kan alles gewist worden.

## Hoe het gebouwd is

Geen frameworks, alleen HTML, CSS en JavaScript.

| Bestand | Taak |
|---|---|
| `index.html` | De structuur van de pagina |
| `style.css` | De opmaak, met lichte en donkere modus |
| `app.js` | De logica: vragen, schermen, waarschuwingen en opslag |
| `manifest.json` | Naam, kleuren en iconen, zodat de app installeerbaar is |
| `sw.js` | Service worker: bewaart de bestanden zodat de app ook offline werkt |
| `icon-192.png`, `icon-512.png` | App-icoon |

## Zelf draaien

De bestanden moeten via `http://localhost` of `https` geserveerd worden, anders werkt de service worker niet.

```
python -m http.server 8000
```

Open daarna `http://localhost:8000`. In VS Code kan ook de extensie *Live Server*.

Na een wijziging: verhoog `CACHE` in `sw.js` (bijvoorbeeld naar `v2`), anders blijft de oude versie in de cache.

## Hulp nodig?

- **Huisarts:** eerste stap voor bijna alles.
- **Druglijn (België):** 078 15 10 20, [druglijn.be](https://www.druglijn.be)
- **Tabakstop:** 0800 111 00
- **Awel (kinderen en jongeren):** 102, [awel.be](https://www.awel.be)
