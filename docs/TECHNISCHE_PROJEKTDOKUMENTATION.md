# Technische Projektdokumentation

## Großkaliber Schützengilde 1503 Eckartsberga e. V.

**Stand:** 16. September 2026
**Fortgeschrieben nach:** IA-001, IA-002, AP 1 bis AP 5B, GES-001, GES-002, MIG-VOR-001, EVT-LOC-001, EVT-VID-001, GB-001, GB-MIG-001, FOOT-VERB-001, LEGAL-DAT-001 und LEGAL-IMP-001
**Art des Projekts:** Statische, vollständig clientseitig gerenderte Website ohne Framework und Build-System

Dieses Dokument beschreibt ausschließlich den technischen Ist-Zustand. Projektvision, Entwicklungsregeln und organisatorischer Ablauf werden in den übrigen Dokumenten unter `/docs` gepflegt.

---

## 1. Projektübersicht

### 1.1 Zweck

Die Website präsentiert die Großkaliber Schützengilde 1503 Eckartsberga e. V., ihre Tradition, den Schießsport und das Vereinsleben. Veranstaltungen bilden die zentrale dynamische Dateneinheit: Aus einem gemeinsamen Datenbestand entstehen Countdown, Timeline, Jahresarchiv, Galerievorschau und universelle Veranstaltungsdetailseiten.

### 1.2 Aktueller Entwicklungsstand

Umgesetzt und geprüft sind:

- responsive Startseite mit Hero, Vereinsinformationen und Mitgliedschaftsteaser;
- statische, responsive Geschichtsseite mit semantischer Chronologie und sichtbarer Quelleneinordnung;
- statische Vorstands- und Ansprechpartnerseite auf Basis der vorhandenen Detailseitenkomponenten;
- statische, responsive Anlagen-Unterseite mit vier freigegebenen Medien und gemeinsamer Lightbox;
- datengetriebene Gästebuch-Unterseite mit fünf freigegebenen Bestandseinträgen;
- statische, responsive Datenschutzerklärung für den vorgesehenen Veröffentlichungszustand;
- statisches, responsives Impressum mit bestätigten Anbieter- und Registerangaben;
- feste Navigation mit mobilem, per Tastatur bedienbarem Menü;
- dynamische Anzeige der nächsten Veranstaltung mit Countdown;
- Timeline für kommende, aktuelle und archivierte Veranstaltungen;
- interaktives Jahresarchiv;
- datengetriebener Galerie-Teaser mit statischem Rückfall;
- verbindliches Veranstaltungs- und Detaildatenmodell;
- kanonisches Dokumentenmodell mit typisierten Dokumenten und Legacy-Normalisierung;
- getrennte produktive und nicht produktive Entwicklungsdaten;
- gemeinsame Hilfsfunktionen unter `window.EventUtils`;
- universelle Detailseite über `event.html?event=<slug>`;
- Darstellung von Beschreibung, Veranstaltungsinformationen, Ergebnissen, Dokumenten, externen Links und einer gemeinsamen Galerie für Bilder und lokale Videos;
- native, barrierearme Medien-Lightbox für Bilder und lokale Videos mit Tastaturnavigation und Fokus-Rückgabe;
- definierte Fehlerzustände für fehlende, unbekannte, unvollständige oder nicht eindeutige Veranstaltungen;
- dynamische Dokument- und Open-Graph-Metadaten;
- Verlinkung von Timeline, Countdown und eventbezogenem Galerie-Teaser auf Detailseiten;
- zentrale Veranstaltungsorte mit optionalen Koordinaten und rückwärtskompatibler Auflösung;
- erst nach bewusstem Ortsklick geladene OpenStreetMap-Karte im nativen Dialog;
- automatisierte Tests für `EventUtils`, Datenmodell und Demo-Schalter;
- responsive Browserprüfung von 320 bis 1440 Pixeln.

Noch nicht umgesetzt sind insbesondere:

- freigegebene Detailinhalte für produktive Veranstaltungen;
- weitere Vereins-, besondere Erfolgs- und Kontaktinhalte;
- fachliche Freigabe des Impressums und der Datenschutzerklärung sowie deren abschließende Produktionsprüfung;
- vollständige produktive Galerie;
- Backend, CMS, Formulare, Suche und Mitgliederbereich;
- Build-, Deployment- und Hosting-Konfiguration.

### 1.3 Technische Grundlage

Die Anwendung verwendet:

- HTML5;
- ein globales und ein detailseitenspezifisches Stylesheet;
- klassische JavaScript-Dateien mit `defer`;
- Browser-APIs wie DOM, `Date`, `Intl.DateTimeFormat`, `URL`, `URLSearchParams`, `matchMedia` und Timer;
- lokal ausgeliefertes Leaflet 1.9.4 als einzige Fremdbibliothek;
- keinen Paketmanager, Compiler oder Bundler;
- keine API, Datenbank oder serverseitige Logik;
- externe OSM-Tile-Anfragen ausschließlich nach bewusstem Öffnen einer Karte.

---

## 2. Projektstruktur

```text
/
├── index.html
├── event.html
├── erfolge.html
├── gaestebuch.html
├── geschichte.html
├── schiessbahnen.html
├── vorstand.html
├── datenschutz.html
├── impressum.html
├── style.css
├── datenschutz.css
├── event.css
├── erfolge.css
├── gaestebuch.css
├── geschichte.css
├── schiessbahnen.css
├── notes.rtf
├── assets/
│   ├── dev/
│   │   ├── demo-ausschreibung.txt
│   │   └── demo-ergebnis.txt
│   ├── vendor/
│   │   └── leaflet/
│   │       └── lokal versionierte Leaflet-1.9.4-Laufzeitdateien und Lizenz
│   ├── video/
│   │   ├── events/2025/
│   │   │   └── zwei lokale MP4-Videos mit lokalen Posterbildern
│   │   └── history/
│   │       └── ein lokales MP4-Video mit lokalem Posterbild
│   └── img/
│       ├── hero-eckartsburg.jpg
│       ├── hero-eckartsburg.png
│       ├── history-eckartsberga.jpg
│       ├── history/
│       │   └── fünf freigegebene historische JPEG-Medien
│       ├── achievements/
│       │   └── zehn freigegebene Aufnahmen der Schützenkönige
│       ├── facilities/
│       │   └── vier freigegebene Aufnahmen der Vereinsanlage
│       ├── logo-deutscher-schuetzenbund.png
│       ├── logo-gsg-eckartsberga.png
│       ├── logo-landesschuetzenverband-sachsen-anhalt.png
│       └── logo-schuetzenkreis-sued.png
├── js/
│   ├── data/
│   │   ├── dev-events.js
│   │   ├── events.js
│   │   ├── guestbook-entries.js
│   │   └── venues.js
│   ├── calendar.js
│   ├── countdown.js
│   ├── event-detail.js
│   ├── event-utils.js
│   ├── gallery.js
│   ├── gallery-lightbox.js
│   ├── guestbook.js
│   ├── main.js
│   ├── navigation.js
│   └── venue-map.js
├── tests/
│   ├── achievements-page.test.js
│   ├── event-utils.test.js
│   ├── facility-page.test.js
│   ├── guestbook.test.js
│   ├── history-page.test.js
│   ├── board-page.test.js
│   └── venue-map.test.js
└── docs/
    ├── TECHNISCHE_PROJEKTDOKUMENTATION.md
    ├── 00_PROJEKTVISION.md
    ├── 01_ENTWICKLUNGSGRUNDSÄTZE.md
    ├── 02_PROJEKTROADMAP.md
    ├── 03_IMPLEMENTIERUNGSLEITFADEN.md
    ├── 04_CHANGELOG.md
    ├── 05_IDEENSPEICHER.md
    ├── 06_VERKAUFSARGUMENTE.md
    ├── 07_OFFENE_PRUEFPUNKTE.md
    ├── migration/
    │   └── HISTORISCHE_MEDIENQUELLEN.md
    └── implementierung/
        └── 2026-07-24_IA-002_VERANSTALTUNGSDETAILSEITEN.md
```

`notes.rtf` ist Planungsinput und keine Laufzeitdatei.

### 2.1 HTML

#### `index.html`

Die Startseite enthält:

- Skip-Link;
- Header und Hauptnavigation;
- Hero und Schnellzugriffskarten;
- Vereins- und Geschichtsteaser;
- Renderziel für die Timeline;
- Galerievorschau;
- datengetriebener, bei fehlenden freigegebenen Stimmen vollständig verborgener Gästebuch-Teaser;
- Mitgliedschaftsteaser;
- Demo-Hinweis;
- gemeinsamer Footer mit zentralem Vereinslogo und verlinkten Verbandslogos;
- Script-Einbindungen für Daten, Hilfsfunktionen und Startseitenlogik.

Die Script-Reihenfolge ist:

1. `js/data/dev-events.js`
2. `js/data/venues.js`
3. `js/data/events.js`
4. `js/data/guestbook-entries.js`
5. `js/event-utils.js`
6. `js/navigation.js`
7. `js/countdown.js`
8. `js/calendar.js`
9. `js/gallery.js`
10. `js/guestbook.js`
11. `js/main.js`

#### `event.html`

Die universelle Detailseite enthält dieselben gemeinsamen Seitenbausteine, ein leeres Renderziel `#event-detail`, je ein natives `<dialog>` für Galerie-Lightbox und Standortkarte sowie einen verständlichen `<noscript>`-Hinweis.

Sie lädt bewusst keine Startseitenmodule für Countdown, Timeline oder Galerieanimation. Ihre Script-Reihenfolge ist:

1. `js/data/dev-events.js`
2. `js/data/venues.js`
3. `js/data/events.js`
4. `js/event-utils.js`
5. `js/navigation.js`
6. `assets/vendor/leaflet/leaflet.js`
7. `js/venue-map.js`
8. `js/event-detail.js`
9. `js/gallery-lightbox.js`
10. `js/main.js`

#### `geschichte.html`

Die eigenständige Geschichtsseite enthält:

- denselben Header und Footer wie die übrigen Seiten, ohne zusätzlichen globalen Navigationspunkt;
- einen kompakten Seiteneinstieg mit Rücklink zum Vereinsbereich;
- eine chronologisch geordnete, vollständig statische Vereinschronik;
- fünf freigegebene historische Medien in ihren zugehörigen Chronikstationen;
- genau ein natives `<dialog>` für die gemeinsame Galerie-Lightbox;
- eine sichtbare Sektion „Historische Quellen und weiterführende Informationen“;
- keine JavaScript-Abhängigkeit für die eigentliche Inhaltsausgabe.

Sie lädt `js/navigation.js` für das mobile Menü, `js/gallery-lightbox.js` für die
optionale Medienvergrößerung und `js/main.js` für die Jahreszahl im Footer. Die
Chronik bleibt ohne JavaScript vollständig lesbar. Der vorhandene
Geschichtsteaser auf der Startseite ist der kanonische Einstieg; die drei
historischen Fotografien der Startseitengalerie verweisen zusätzlich direkt auf
die zugehörigen Chronikstationen.

#### `vorstand.html`

Die statische Unterseite stellt Vorstand und weitere Ansprechpartner fachlich
getrennt dar. Sie verwendet wie Geschichts-, Anlagen- und Gästebuchseite einen
flächigen dunklen Seitenkopf sowie frei gegliederte Inhaltsbereiche auf dem
hellen Seitenhintergrund. Die Funktionen und Namen stehen in einem
seitenspezifischen, responsiven Listenraster ohne Eventkartenrahmen. Die
vorhandene Startseitenkarte „Ansprechpartner“ bleibt der einzige Einstieg;
Header und Footer wurden nicht um einen weiteren Link ergänzt.

Die erste Fassung enthält ausschließlich bestätigte Funktionen und Namen. Sie
veröffentlicht weder Porträtbilder noch direkte Kontaktdaten, Karte oder Anfahrt
und bleibt ohne JavaScript vollständig lesbar. `js/navigation.js` steuert nur
das mobile Menü, `js/main.js` aktualisiert die Jahreszahl im Footer.

#### `erfolge.html`

Die statische Erfolgsseite verwendet wie Geschichts-, Anlagen-, Gästebuch- und
Vorstandsseite einen flächigen dunklen Seitenkopf und frei gegliederte
Inhaltsbereiche statt des Veranstaltungsdetailrahmens. Sie stellt ausgewählte
sportliche Erfolge sowie die zehn auf der bisherigen Vereinswebsite
dokumentierten Schützenkönige und die Schützenkönigin aus den Jahren 2016 bis
2026 dar; für 2018 existiert kein überlieferter Eintrag und kein Platzhalter.

Die Aufnahmen erscheinen in einem responsiven Raster vollständig und
unbeschnitten. Jede Kachel öffnet über `js/gallery-lightbox.js` dieselbe native
Lightbox wie Veranstaltungs- und Geschichtsmedien. Die vorhandene Startseitenkarte
„Erfolge“ ist der einzige neue Einstieg; Header und Footer erhalten keinen
zusätzlichen Navigationspunkt.

#### `schiessbahnen.html`

Die statische Anlagen-Unterseite verwendet denselben Seiteneinstieg wie die
Geschichtsseite und stellt die bestätigten Nutzungsangaben der
25-Meter-Raumschießanlage in einer kompakten Definitionsliste dar. Vier
freigegebene Aufnahmen zeigen die 25-Meter-Bahn, ihre Duellscheiben, die
Luftgewehrbahn und den Sitzungsraum. Die vorhandene Startseitenkarte
„Schießbahnen & Vereinshaus“ ist der einzige neue Einstieg; Header und Footer
erhalten keinen weiteren Navigationspunkt.

Alle vier Bilder bleiben vollständig und unbeschnitten. Sie verwenden genau ein
natives Dialogelement und den unveränderten gemeinsamen Controller
`js/gallery-lightbox.js`. Ohne JavaScript bleiben sämtliche Inhalte und Bilder
lesbar; lediglich die Vergrößerung entfällt.

#### `gaestebuch.html`

Die eigenständige Gästebuchseite verwendet den Seiteneinstieg der Geschichts-
und Anlagen-Unterseite. Sie rendert alle validierten veröffentlichten Einträge
aus `js/data/guestbook-entries.js` in absteigender Datumsreihenfolge und zeigt
bei leerem Bestand einen verständlichen Leerzustand. Die erste Fassung enthält
weder Formular noch Formspree-Anbindung oder ungeprüfte personenbezogene Daten.

#### `datenschutz.html`

Die statische Datenschutzseite verwendet denselben integrierten Seitenkopf,
Rücklink, Header und Footer wie die Geschichts-, Anlagen- und Gästebuchseite.
Sie beschreibt den verbindlich vorgesehenen Betrieb über GitHub Pages mit
STRATO-Domain-/DNS-Verwaltung, E-Mail-Kontakt, die vorhandenen öffentlichen
Gästebucheinträge und die erst nach bewusster Aktivierung geladenen OSM-Karten.

Die öffentliche Textfassung beschreibt Formspree und counter.dev entsprechend
dem vorgesehenen Veröffentlichungszustand. Beide Dienste sind im aktuellen
Entwicklungsstand technisch noch nicht aktiv; dieser interne Stand sowie die
noch offenen Produktions-, Anbieter- und Rechtsprüfungen werden ausschließlich
in der Projektdokumentation geführt. Die Seite bindet keine dieser externen
Laufzeiten ein und erzeugt selbst keine automatischen Drittanfragen. Die
Platzhalter für die endgültige Vereins-E-Mail-Adresse und den späteren Stand der
Erklärung sind in den offenen Prüfpunkten verankert.

#### `impressum.html`

Das statische Impressum verwendet denselben integrierten Seitenkopf, Rücklink,
Header, Footer und dieselbe Langtextgliederung wie die Datenschutzseite. Es
enthält die bestätigten Vereins-, Anschrift-, Vorstands- und Registerangaben
sowie einen kurzen Urheberrechtshinweis.
Die endgültige Vereins-E-Mail-Adresse bleibt bis zur Veröffentlichung als
eindeutiger Platzhalter offen; die fachliche Freigabe und weitere
Anbieterkennzeichnungsfragen werden intern unter P-06 geprüft.

### 2.2 CSS

#### `style.css`

Enthält das gemeinsame Gestaltungssystem und alle Startseitenstile:

- Design-Tokens;
- Reset und Basisstile;
- Fokusdarstellung und Skip-Link;
- Demo-Hinweis;
- Header und Navigation;
- Buttons und Karten;
- Startseitenbereiche;
- Countdown;
- Timeline und Archiv;
- Galerievorschau;
- Startseiten-Stimmen;
- Footer;
- responsive Regeln;
- Reduced-Motion-Regeln.

Der gemeinsame Footer beginnt mit dem vorhandenen GSG-Motiv als optischer Mitte
zwischen dem verlinkten Logo des Deutschen Schützenbundes und dem verlinkten
Wappen des Landesschützenverbandes Sachsen-Anhalt. Eine dezente Linie trennt
diese Logozeile von der nachgeordneten Sekundärnavigation. Den Abschluss bildet
die gemeinsame Copyrightzeile mit Vereinsname und Leitsatz. Die Logozeile bleibt
über die gemeinsamen Footerregeln auch auf schmalen Ansichten in einer Reihe;
die Navigation wechselt dort in ein festes Zweispaltenraster, damit ihre
CSS-Separatoren nicht allein am Zeilenanfang oder -ende stehen.
Die Sekundärnavigation enthält auf allen produktiven Seiten Impressum und
Datenschutz als benachbarte rechtliche Ziele.

Die vom Auftraggeber extern vorbereiteten PNG-Fassungen werden unverändert
verwendet: DSB mit 1013 × 720 Pixeln und SHA-256
`f6dc6940d13ed57478c7af0cdb54474a7c2c5aae664bc1a6cf8681fd839239be`,
Landesschützenverband mit 550 × 600 Pixeln und SHA-256
`c9dadabaaabeded322ccbe3382281fcce17cf7832e324254b4956b0777ee629f`.
Die offiziellen Linkziele und zugänglichen Namen gelten weiterhin auf allen
Seiten identisch.

Die neu integrierten Vollflächen-Links für Timeline, Countdown und Galerie verwenden vorhandene Kartenstrukturen. Fokuszustände bleiben sichtbar.

#### `event.css`

Enthält ausschließlich die Gestaltung der Detailseite:

- kompakter Veranstaltungskopf;
- Layouts mit und ohne Titelbild;
- Eckdatenraster;
- Ressourcenlisten;
- Ergebniskennzeichnung;
- Galerieraster;
- responsive Lightbox mit Backdrop und mindestens 44 Pixel großen Bedienelementen;
- Fehlerzustände;
- Breakpoints für 1-, 2- und 3-spaltige Darstellung.

Gemeinsame Variablen, Header, Navigation, Buttons und Footer werden nicht dupliziert, sondern aus `style.css` übernommen.

#### `geschichte.css`

Enthält ausschließlich die seitenspezifische Darstellung der Vereinschronik:

- dunkler, kompakter Seitenkopf;
- zweispaltige Chronologie mit eigener Zeitraumspalte auf großen Ansichten;
- einspaltige, unverändert chronologische Darstellung auf kleinen Ansichten;
- Karten, Quellenbereich und responsive Abstände;
- keine Animationen und keine JavaScript-abhängigen Zustände.

Design-Tokens, Header, Navigation, Fokusdarstellung und Footer stammen weiterhin
aus `style.css`.

#### `schiessbahnen.css`

Enthält ausschließlich das responsive Fakten- und Medienlayout der
Anlagen-Unterseite. Der Seitenkopf und gemeinsame Gestaltungsregeln stammen aus
`geschichte.css`, die Lightbox aus `event.css` und alle globalen Design-Tokens,
Navigationselemente und Footerregeln aus `style.css`.

#### `gaestebuch.css`

Enthält ausschließlich die einspaltige, responsive Eintragsliste und ihren
Leerzustand. Seitenkopf, Rücklink, Design-Tokens, Header und Footer werden aus
den bereits vorhandenen Stylesheets übernommen.

#### `datenschutz.css`

Enthält die ruhige Langtextgliederung der beiden rechtlichen Seiten. Der
Seitenkopf und die globale Gestaltung stammen aus `geschichte.css`, der Rücklink
aus `event.css` sowie Header, Footer, Design-Tokens und Fokusdarstellung aus
`style.css`.

### 2.3 JavaScript

#### `js/data/events.js`

Enthält:

- `productionEvents` mit den produktiven Terminen;
- den Schalter `USE_DEMO_DATA`;
- das daraus abgeleitete globale Array `events`;
- die Aktivierung des sichtbaren Entwicklungshinweises.

#### `js/data/dev-events.js`

Enthält ausschließlich klar markierte, erfundene Entwicklungsdaten. Sie decken knappe und vollständige Veranstaltungen, Bild- und Galeriefälle, Dokumente, Legacy-Downloads, Datei- und externe Ergebnisse, externe Links, lange Texte sowie Anmeldepflicht ab.

#### `js/data/venues.js`

Definiert die zentrale Liste `eventVenues` für wiederkehrende Veranstaltungsorte. Der Jägerschießstand Markröhlitz ist mit der stabilen ID `jaegerschiessstand-markroehlitz` und den ausdrücklich vorgegebenen Koordinaten 51.222440, 11.872128 hinterlegt. Die Veranstaltungen `pokal-halbautomat-2024` und `km-halbautomat-kk-gk-2026` referenzieren diesen Venue. Das Schützenhaus Buttstädt ist mit der stabilen ID `schuetzenhaus-buttstaedt` und den vom Auftraggeber vorgegebenen Koordinaten 51.12592, 11.43023 hinterlegt; `eckartsburg-pokal-2026` referenziert es. Der Schießstand des Schützenvereins 1990 Hohenmölsen in Köpsen ist mit der ID `schiessstand-sv-1990-hohenmoelsen-koepsen` und den vom Auftraggeber vorgegebenen Koordinaten 51.16555, 12.06697 hinterlegt; `km-gk-pistole-revolver-2026` referenziert ihn. Die bestehenden `location`-Angaben bleiben unverändert als Legacy-Rückfall erhalten.

#### `js/data/guestbook-entries.js`

Definiert `publishedGuestbookEntries` als einzige öffentliche Datenquelle für
manuell geprüfte und freigegebene Gästebucheinträge. Der eingecheckte Bestand
enthält fünf migrierte Einträge aus den Jahren 2022 bis 2025; vier davon sind
für die Startseite freigegeben. Ungeprüfte Formulareingänge und interne
Moderationsinformationen gehören nicht in diese öffentlich ausgelieferte Datei.

#### `js/guestbook.js`

Normalisiert Gästebucheinträge ohne Veränderung der Eingabedaten, verwirft
fehlende Pflichtfelder, ungültige ISO-Daten und doppelte IDs und sortiert stabil
nach Datum absteigend. Texte werden ausschließlich über DOM-`textContent`
ausgegeben. Dieselbe normalisierte Liste versorgt die Gästebuchseite und – nur
für Einträge mit `featuredOnHome: true` – den Startseiten-Teaser. Bei mehreren
Stimmen startet dieser zufällig und läuft anschließend im stabilen Datenbestand
alle neun Sekunden zyklisch weiter. Manuelle Bedienung sowie Fokus- oder
Zeigerinteraktion pausieren den Wechsel; reduzierte Bewegung deaktiviert
Autoplay und Übergangsbewegung. `window.GuestbookUtils` stellt die
DOM-unabhängigen Funktionen für Normalisierung, Startseitenauswahl,
Datumsformatierung und Startindex bereit.

#### `js/event-utils.js`

Stellt genau einen globalen Namensraum `window.EventUtils` bereit. Die Funktionen sind DOM-unabhängig und verändern übergebene Daten nicht.

| Funktion | Aufgabe |
|---|---|
| `isSafeUrl(value)` | erlaubt lokale relative Pfade sowie HTTP/HTTPS und sperrt unsichere Protokolle |
| `normalizeImage(image)` | normalisiert ein Titelbild oder liefert `null` |
| `normalizeGallery(gallery)` | normalisiert Galeriebilder und verwirft ungültige Einträge |
| `normalizeVideos(videos)` | normalisiert ausschließlich lokale Eventvideos mit optionalem Poster und Abmessungen |
| `normalizeDownloads(downloads)` | normalisiert bestehende Downloadobjekte für Legacy-Verbraucher |
| `normalizeDocuments(documents)` | normalisiert typisierte Dokumente mit dokumentenspezifischer URL-Prüfung |
| `normalizeResults(results)` | normalisiert Datei- und externe Ergebnisse |
| `normalizeEventDocuments(event)` | führt neue Dokumente, Ergebnisdateien und Downloads stabil und ohne URL-Duplikate zusammen |
| `normalizeExternalLinks(externalLinks)` | normalisiert ausschließlich sichere externe HTTP-/HTTPS-Links |
| `normalizeVenue(venue)` | normalisiert einen Ort und übernimmt Koordinaten nur als vollständiges gültiges Zahlenpaar |
| `normalizeVenues(venues)` | normalisiert eine Ortsliste stabil und verwirft ungültige Einträge |
| `resolveEventLocation(event, venues)` | löst eine eindeutige `venueId` auf und fällt andernfalls auf `location` zurück |
| `getEventTitle(event)` | liefert `title` mit Rückfall auf `shortTitle` |
| `getEventOrganizerLogo(event)` | liefert nur für exakt freigegebene `organizer`-Werte ein lokales Herkunftslogo, sonst `null` |
| `isDetailCapable(event)` | prüft Slug, Titel und gültigen Startzeitpunkt |
| `createDetailUrl(event)` | erzeugt ausschließlich für detailfähige Einträge `event.html?event=<kodierter Slug>` |
| `resolveEventBySlug(list, slug)` | unterscheidet keinen, einen und mehrere Slug-Treffer |

#### `js/countdown.js`

Ermittelt die nächste zukünftige Veranstaltung, aktualisiert Titel, Kategorie, Datum und Countdown und verwendet `EventUtils` für Titel und Detail-URL. Die bestehende Karte erhält nur dann einen `href`, wenn `createDetailUrl()` eine gültige URL liefert.

#### `js/calendar.js`

Erzeugt Timeline und Archiv. Für Titel, Ort, Bild, kanonische Dokumente, externe Ergebnisse, Galerie und Detailfähigkeit werden die passenden `EventUtils`-Funktionen verwendet. Eine eindeutige zentrale Ortsreferenz liefert den sichtbaren Ortsnamen; bestehende `location`-Angaben bleiben vollständiger Rückfall. Der Dokumentstatus berücksichtigt `documents`, Ergebnisdateien und Legacy-Downloads; der Ergebnisstatus gültige Dokumente vom Typ `result-list` sowie externe Ergebnisquellen. Detailfähige Karten erhalten einen semantischen, tastaturbedienbaren Vollflächen-Link. Nicht detailfähige Karten bleiben normale Artikel. Eventbeschreibungen bleiben im Markup vollständig erhalten und werden ausschließlich in diesen Vorschaukarten per CSS auf drei Zeilen beziehungsweise im bestehenden Smartphone-Breakpoint bis 480 Pixel auf vier Zeilen begrenzt. Die Eventdetailseite bleibt davon unberührt.

#### `js/gallery.js`

Normalisiert eventbezogene Galeriebilder über `EventUtils`. Jedes Bild behält seine Veranstaltung als Kontext und wird nur bei vorhandener Detail-URL verlinkt. Gibt es keine eventbezogenen Bilder, bleiben die statischen Rückfallbilder unverändert.

Die statische Rückfallgalerie enthält drei freigegebene historische Fotografien
von 1902, 1912 und 1922, das vorhandene Eckartsburgmotiv und zehn freigegebene
Aufnahmen der Schützenkönige. Alle Motive verwenden die kachelfüllende
Darstellung und den vorhandenen Ken-Burns-Zoom. Historische Fotografien führen
zu ihrer Chronikstation, die Schützenkönig-Motive zum jeweiligen Eintrag auf
`erfolge.html`. Heimatblatt und Zeitungsausschnitt bleiben der ausführlichen
Geschichtsseite vorbehalten.

#### `js/gallery-lightbox.js`

Initialisiert die gemeinsame native Lightbox für jedes mit
`data-gallery-lightbox` gekennzeichnete Galerieraster. Bildquelle,
Alternativtext, Abmessungen und Bildunterschrift werden aus dem semantischen
Galeriemarkup gelesen. Auf der Veranstaltungsdetailseite erkennt der Controller
zusätzlich deklarativ gekennzeichnete lokale Videos und zeigt sie mit dem
nativen HTML5-Player im selben Dialog. Veranstaltungsdetailseite,
Geschichtsseite und Erfolgsseite verwenden damit denselben Controller für
Fokusführung, Backdrop-Klick, Escape sowie Vor-/Zurück- und
Pfeiltastennavigation. Beim Medienwechsel und Schließen pausiert und entlädt der
Controller ein aktives Video und setzt seine Wiedergabeposition auf den Anfang
zurück. Pfeiltasten des fokussierten nativen Videoplayers werden nicht als
Galerienavigation behandelt.

#### `js/event-detail.js`

Liest ausschließlich den URL-Parameter `event`, löst den Slug sowie den sichtbaren Veranstaltungsort über `EventUtils` auf und rendert:

- Veranstaltungskopf;
- optionales, eindeutig über `organizer` zugeordnetes Herkunftslogo;
- Datum und – sofern belegt – Uhrzeit;
- Titelbild;
- Beschreibung;
- Veranstaltungsinformationen;
- kanonisch zusammengeführte Dokumente aus `documents`, Ergebnisdateien und Legacy-Downloads;
- externe Ergebnisse;
- externe Links;
- gemeinsame Mediengalerie aus Galeriebildern und optionalen lokalen Videos als abschließenden Inhaltsbereich.

Dokumente werden über `normalizeEventDocuments()` zusammengeführt und mit ihrer deutschen Typbezeichnung dargestellt. Ergebnisdateien erscheinen ausschließlich unter „Dokumente“, externe Ergebnisquellen ausschließlich unter „Ergebnisse“.

Die Herkunftslogo-Zuordnung verwendet eine exakte Allowlist in `EventUtils`. Titel, Kategorie und Beschreibung werden dafür nicht ausgewertet. Für den Schützenkreis sind der bestehende Kurzschlüssel `Schützenkreis "SUED"` und die quellengetreue offizielle Langform als getrennte exakte Schlüssel registriert. Unbekannte, fremde oder generische Veranstalter wie `Kreisschützenverband` bleiben ohne Logo.

Eine eindeutige zentrale Ortsreferenz liefert den sichtbaren Namen für Hero, Metadaten und Veranstaltungsinformationen. Ohne verwendbare Koordinaten bleibt der Ort dort reiner Text. Nur bei einem vollständigen gültigen Koordinatenpaar erscheint im Fakteneintrag die Schaltfläche „Karte anzeigen – lädt OpenStreetMap“. Timeline und Archiv bleiben frei von verschachtelten Karteninteraktionen.

Leere oder ungültige optionale Bereiche werden vollständig ausgelassen. Ein ungültiges oder vor `start` liegendes `end` wird ignoriert. Galeriebilder und lokale Videos bleiben im Datenmodell getrennt und werden erst für die Ausgabe zu einer gemeinsamen Medienfolge zusammengeführt. Videokacheln verwenden das lokale Posterbild und ein dekoratives Play-Symbol. Im Dialog verwenden Videos den nativen HTML5-Player mit Bedienelementen, `preload="metadata"` und ohne Autoplay. Posterbilder, Videos und Wiedergabe bleiben vollständig lokal; das Laden der Detailseite erzeugt dadurch keine Verbindung zu einem Videoanbieter.

Bis zu sechs gültige Medien werden zunächst vollständig dargestellt. Bei mehr als sechs Medien zeigt die Seite die ersten sechs in der zusammengeführten Reihenfolge: zuerst die gepflegten Galeriebilder, danach die lokalen Videos. Ein nativer, tastaturbedienbarer Schalter blendet die verbleibenden Medien ein und wieder aus; Beschriftung und `aria-expanded` folgen dem tatsächlichen Zustand. Beim Einklappen wird die Position des Schalters im sichtbaren Bereich stabilisiert. Reine Bildergalerien behalten ihre bisherige Beschriftung und Darstellung; auch reine Videogalerien sowie vollständig leere Medienbestände werden ohne Sonderdatenmodell verarbeitet.

Jede Medienkachel öffnet über `gallery-lightbox.js` dasselbe native `<dialog>` mit dem vollständigen Bild oder lokalen Video und der vorhandenen Beschriftung. Die Lightbox navigiert über Schalter und linke beziehungsweise rechte Pfeiltaste durch alle gültigen Medien in Datenreihenfolge, auch wenn die Kachelansicht noch eingeklappt ist. An den Grenzen findet kein Umlauf statt; bei nur einem Medium werden die Navigationsschalter ausgeblendet.

Der initiale Fokus liegt auf dem sichtbaren Schließen-Schalter. Schließen ist per Schalter, Escape und eindeutigem Klick auf die Dialogfläche außerhalb des Panels möglich. Pointerdown innerhalb des Panels verhindert ein versehentliches Schließen beim Loslassen außerhalb. Das native Modalverhalten hält Hintergrund und außerhalb liegende Bedienelemente inert; jedes Schließen gibt den Fokus an die auslösende Kachel zurück. Es wurden keine Übergangs- oder Bildwechselanimationen ergänzt.

#### `js/venue-map.js`

Steuert den getrennten nativen Kartendialog für Veranstaltungsorte. Der Controller übernimmt einen ausschließlich aus validierten Ortsdaten erzeugten Auslöser, öffnet den Dialog, fokussiert den Schließen-Schalter und initialisiert erst nach dieser bewussten Aktion Leaflet und die OSM-Tiles. Beim normalen Seitenaufruf entsteht keine Verbindung zu OpenStreetMap.

Die Karte verwendet einen exakten Kreismarker, die Zoomstufe 16 und die zentral konfigurierte Tile-URL `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. Die Attribution zu OpenStreetMap bleibt im Kartenbereich sichtbar. Schließen per Schalter, Escape oder sicher erkanntem Backdrop-Klick entfernt die Karteninstanz vollständig und gibt den Fokus an den Ortsauslöser zurück. Eine lokale Ortsbeschreibung und ein freiwilliger externer OSM-Link bleiben als Alternative verfügbar, wenn Tiles nicht vollständig geladen werden können.

Leaflet 1.9.4 liegt unverändert samt BSD-2-Clause-Lizenz und dokumentierten SHA-256-Prüfsummen unter `assets/vendor/leaflet/`. Es wird weder von einem CDN geladen noch über einen Paketmanager verwaltet. Die Anwendung setzt für die Karte keine Cookies und verwendet keinen Browser-Speicher. Externe Tile-Anfragen übertragen technisch bedingt Netzwerkdaten an die OpenStreetMap Foundation und müssen vor produktiver Aktivierung in der Datenschutzerklärung berücksichtigt werden.

Fehlerzustände:

| Zustand | Sichtbare Überschrift |
|---|---|
| Parameter fehlt oder ist leer | `Keine Veranstaltung ausgewählt` |
| Slug unbekannt | `Veranstaltung nicht gefunden` |
| Kerndaten unvollständig | `Veranstaltungsdaten unvollständig` |
| Slug mehrfach vorhanden | `Veranstaltung derzeit nicht verfügbar` |

Bei doppeltem Slug wird zusätzlich `console.error()` ausgelöst; kein Treffer wird zufällig ausgewählt.

#### `js/navigation.js`

Steuert das mobile Menü, Escape-Verhalten, Außenklick, Linkauswahl, Fokus und die kompakte Headerdarstellung.

#### `js/main.js`

Aktualisiert das Footer-Jahr und zeigt den Demo-Hinweis, wenn Entwicklungsdaten aktiv sind.

---

## 3. Architektur und Datenfluss

### 3.1 Architekturtyp

```text
dev-events.js ──┐
                ├──> events.js ──> events
productionEvents┘                    │
                                    ├──> countdown.js
                                    ├──> calendar.js
                                    ├──> gallery.js
                                    └──> event-detail.js

event-utils.js ──────────────────────┬──> Countdown-Verlinkung
                                    ├──> Timeline-Rendering und Verlinkung
                                    ├──> Galerie-Normalisierung und Verlinkung
                                    └──> Detailauflösung und Detail-Rendering

venues.js ──> eventVenues ──> EventUtils.resolveEventLocation()
                                  ├──> Timeline und Archiv
                                  └──> Veranstaltungsdetailseite
                                            │
                                            └──> venue-map.js
                                                  └── Klick ──> OSM-Tiles

guestbook-entries.js ──> publishedGuestbookEntries
                              │
                              └──> guestbook.js ──┬──> gaestebuch.html
                                                  └──> index.html#stimmen
```

Die fachliche Modularisierung erfolgt über getrennte klassische Skripte. Es gibt weiterhin keine ES-Module und keine Import-/Export-Syntax.

### 3.2 URL-Konzept

Der verbindliche Vertrag lautet:

```text
event.html?event=<slug>
```

- ausschließlich der Parameter `event` wird ausgewertet;
- der Slug wird URL-kodiert;
- Startseitenmodule bauen keine Detail-URL selbst;
- `EventUtils.createDetailUrl()` ist die einzige Quelle für Detail-URLs;
- nicht detailfähige Veranstaltungen erhalten keinen Link;
- unbekannte und doppelte Slugs führen in definierte Fehlerzustände.

### 3.3 Rendering-Konzept

Die Website nutzt drei Renderingarten:

- **statisch:** gemeinsame Seitenstruktur, Startseitentexte, Footer und Galerie-Rückfallbilder;
- **DOM-Aktualisierung:** Countdown, Navigation, Demo-Hinweis und Galerie-Teaser;
- **clientseitige Erzeugung:** Timeline, Archiv und vollständige Veranstaltungsdetailansicht.

Die Detailseite ist ein universelles Template. Es existieren keine einzelnen HTML-Dateien pro Veranstaltung und keine duplizierten Veranstaltungsinhalte.

### 3.4 Integrationsfluss

#### Timeline

1. `calendar.js` normalisiert die benötigten Eventbereiche.
   Vorhandene Bilder und Videos werden dabei getrennt gezählt und gemeinsam als
   konkrete Medienangabe ausgegeben; ohne gültige Medien entfällt diese Angabe.
2. `EventUtils.createDetailUrl(event)` entscheidet über die Verlinkung.
3. Bei gültiger URL umschließt ein Vollflächen-Link den Karteninhalt.
4. Ohne URL bleibt die Karte ein nicht interaktiver Artikel.

#### Countdown

1. `countdown.js` wählt die nächste zukünftige Veranstaltung.
2. `EventUtils.getEventTitle()` liefert den Anzeigetitel.
3. `EventUtils.createDetailUrl()` liefert optional den `href`.
4. Ohne URL bleibt die Karte ohne Link und ohne Linkhinweis.

#### Galerie

1. `gallery.js` normalisiert jedes `gallery`-Array.
2. Veranstaltung und Bild bleiben einander zugeordnet.
3. Nur bei gültiger Detail-URL wird die jeweilige Vorschau verlinkt.
4. Statische Rückfallbilder erhalten keine erfundene Veranstaltungszuordnung.

### 3.5 Metadaten der Detailseite

Nach erfolgreichem Rendering werden gesetzt:

- `document.title` als `<Titel> · GSG Eckartsberga`;
- Meta-Description aus der Beschreibung, maximal 160 Zeichen;
- ersatzweise Beschreibung aus Titel, Datum und optional Ort;
- `og:title`;
- `og:description`;
- `og:type = article`.

`og:url` wird nur bei einer erkennbar öffentlichen HTTP-/HTTPS-Adresse gesetzt und auf den Parameter `event` reduziert. `og:image` wird ausschließlich für absolute HTTP-/HTTPS-Bilder gesetzt. Lokale Pfade erzeugen kein Open-Graph-Bild.

### 3.6 Abhängigkeiten

| Datei | Direkte Laufzeitabhängigkeiten |
|---|---|
| `index.html` | `style.css`, Veranstaltungs-, Orts- und Gästebuchdaten, `EventUtils`, Startseitenmodule |
| `event.html` | `style.css`, `event.css`, lokale Leaflet-Dateien, Daten, `EventUtils`, Navigation, Detailrenderer, Kartencontroller, gemeinsame Lightbox |
| `geschichte.html` | `style.css`, `event.css`, `geschichte.css`, Navigation, gemeinsame Lightbox, historische Medien |
| `vorstand.html` | `style.css`, `event.css`, Navigation, Footer-Jahr |
| `gaestebuch.html` | `style.css`, `event.css`, `geschichte.css`, `gaestebuch.css`, veröffentlichte Gästebuchdaten, Gästebuchrenderer, Navigation, Footer-Jahr |
| `datenschutz.html` | `style.css`, `event.css`, `geschichte.css`, `datenschutz.css`, Navigation, Footer-Jahr |
| `impressum.html` | `style.css`, `event.css`, `geschichte.css`, `datenschutz.css`, Navigation, Footer-Jahr |
| `events.js` | optional `developmentEvents` |
| `venues.js` | keine Laufzeitabhängigkeit; zentrale Ortsstammdaten mit stabilen IDs und optionalen Koordinaten |
| `event-utils.js` | standardisierte Browser-/JavaScript-APIs, kein DOM |
| `countdown.js` | `events`, `EventUtils`, Startseiten-DOM |
| `calendar.js` | `events`, `EventUtils`, Timeline-DOM und Timeline-CSS |
| `gallery.js` | `events`, `EventUtils`, Galerie-DOM und Galerie-CSS |
| `event-detail.js` | `events`, `EventUtils`, Detail-DOM und `event.css` |
| `gallery-lightbox.js` | deklaratives Galeriemarkup, natives `<dialog>` und Lightbox-CSS aus `event.css` |
| `venue-map.js` | validiertes Karten-Trigger-Markup, natives `<dialog>`, lokales Leaflet und nach Nutzeraktion OSM-Tiles |
| `guestbook.js` | `publishedGuestbookEntries` sowie optionale DOM-Ziele der Gästebuchseite und Startseite |
| `navigation.js` | gemeinsame Header- und Navigationsstruktur |
| `main.js` | Footer-Jahr und Demo-Datenattribut |

---

## 4. Verbindliches Datenmodell

### 4.0 Gästebucheintrag

```js
{
  id: "guestbook-2026-001",
  displayName: "Freigegebener Anzeigename",
  date: "2026-09-06",
  text: "Freigegebener Gästebucheintrag",
  featuredOnHome: true
}
```

`id`, `displayName`, `date` und `text` sind erforderlich.
`featuredOnHome` ist optional und wird ausschließlich bei exakt `true` aktiv.
Die Aufnahme in `publishedGuestbookEntries` bedeutet bereits die manuell
bestätigte Veröffentlichung; ein zusätzlicher Veröffentlichungsstatus sowie
interne Herkunfts- oder Moderationsdaten sind nicht Teil des öffentlichen
Modells.

### 4.1 Veranstaltung

```js
{
  id: 1,
  slug: "km-wurfscheibe-2026",
  title: "KM Wurfscheibe",
  shortTitle: "Wurfscheibe",
  category: "Kreismeisterschaft",
  start: "2026-03-07T09:00:00",
  end: "2026-03-07T17:00:00",
  editorialStatus: null,
  venueId: null,
  location: "Lossa",
  organizer: "Kreisschützenverband",
  description: "",
  image: null,
  gallery: [],
  videos: [],
  documents: [],
  downloads: [],
  results: [],
  externalLinks: [],
  registrationRequired: false,
  archive: true,
  featured: false
}
```

| Feld | Typ | Verwendung |
|---|---|---|
| `id` | Zahl oder String | stabile interne Kennung und Sortierrückfall |
| `slug` | String | eindeutige öffentliche Eventkennung |
| `title` | String | primärer Titel |
| `shortTitle` | String | Titelrückfall und Kurzform |
| `category` | String | optionale Kategorie |
| `start` | String | erforderliches, lokal interpretiertes ISO-Datum oder Startzeitpunkt |
| `end` | String | optionales ISO-Datum oder optionaler Endzeitpunkt |
| `editorialStatus` | String oder `null` | optionaler redaktioneller Sonderzustand `cancelled` oder `postponed` |
| `venueId` | String | optionale exakte Referenz auf einen zentralen Veranstaltungsort |
| `location` | String | optionaler Legacy-Ort und Rückfall bei nicht auflösbarer `venueId` |
| `organizer` | String | optionaler Veranstalter; dient bei exaktem Allowlist-Treffer zusätzlich der Herkunftslogo-Zuordnung |
| `host` | String | optionaler Ausrichter; organisatorisch vom Veranstalter und vom physischen Veranstaltungsort getrennt |
| `description` | String | optionale Beschreibung |
| `image` | Objekt oder `null` | optionales Titelbild |
| `gallery` | Array | optionale Galeriebilder |
| `videos` | Array | optionale lokale Eventvideos |
| `documents` | Array | kanonische, typisierte Veranstaltungsdokumente |
| `downloads` | Array | vorübergehend unterstützte Legacy-Downloads |
| `results` | Array | optionale Datei- oder externe Ergebnisse |
| `externalLinks` | Array | optionale externe Verweise |
| `registrationRequired` | Boolean | zeigt nur bei `true` die Anmeldepflicht |
| `archive` | Boolean | vorbereitet; derzeit nicht zur Gruppierung ausgewertet |
| `featured` | Boolean | vorbereitet; derzeit nicht ausgewertet |
| `developmentOnly` | Boolean | nur Entwicklungsdaten; kennzeichnet Demo-Einträge |

Für eine Detailseite sind erforderlich:

- nicht leerer `slug`;
- nicht leerer `title` oder `shortTitle`;
- gültiger `start`.

Alle weiteren Detailfelder sind optional.

#### 4.1.1 Zentrale Veranstaltungsorte

```js
{
  id: "beispiel-schiessstand",
  name: "Beispiel-Schießstand",
  description: "Optionale ergänzende Standortbeschreibung",
  latitude: 51.0,
  longitude: 11.0
}
```

`id` und `name` sind erforderlich. Die ID verwendet kleingeschriebenes Kebab-Case und wird ausschließlich exakt aufgelöst. `description` ist optional. Koordinaten werden nur übernommen, wenn Breitengrad und Längengrad als endliche Zahlen vollständig vorliegen und innerhalb von −90 bis +90 beziehungsweise −180 bis +180 liegen. Zahlenketten und unvollständige Paare erzeugen keine Kartenposition.

Eine eindeutig auflösbare `venueId` hat Vorrang vor einer parallel vorhandenen `location`. Unbekannte, ungültige, gelöschte oder doppelte IDs führen kontrolliert zum bisherigen `location`-Wert zurück; ohne Rückfall wird kein Ort ausgegeben. Namen oder Beschreibungstexte werden nicht zur Zuordnung geraten. Bestehende Veranstaltungen benötigen deshalb keine Sammelmigration.

### 4.2 Titelbild

```js
{
  src: "assets/img/hero-eckartsburg.jpg",
  alt: "Beschreibender Alternativtext",
  width: 1673,
  height: 940
}
```

- `src` und `alt` sind erforderlich;
- `width` und `height` sind optional positive Zahlen;
- fehlendes Bild wird als `null` gepflegt;
- ungültige Bildobjekte werden nicht gerendert.

### 4.3 Galerie

```js
{
  src: "assets/img/history-eckartsberga.jpg",
  alt: "Beschreibender Alternativtext",
  caption: "Optionale Bildunterschrift",
  width: 359,
  height: 259
}
```

`src` und `alt` sind erforderlich. `caption`, `width` und `height` sind optional.

### 4.4 Lokale Videos

```js
{
  src: "assets/video/events/2025/2013 Vereinsvideo GSG Eckartsberga.mp4",
  title: "Video 1",
  poster: "assets/video/events/2025/2013 Vereinsvideo GSG Eckartsberga Poster.jpg",
  width: 1920,
  height: 1080
}
```

`src` und `title` sind technisch erforderlich; `width` und `height` sind optional. Ein lokales `poster` ist für produktiv eingebundene Videos redaktionell verbindlich. Die Normalisierung toleriert ein fehlendes Poster ausschließlich als robusten Übergangszustand. Video- und Posterpfade müssen lokale relative Ziele sein; externe HTTP-/HTTPS-Quellen werden für dieses Modell bewusst verworfen. Der native Player lädt mit `preload="metadata"` nur die zur Darstellung erforderlichen Metadaten vor und startet weder Bild noch Ton automatisch. Poster stammen ausschließlich aus einem repräsentativen Einzelbild des zugehörigen lokalen Originalvideos.

### 4.5 Dokumente

```js
{
  label: "Ausschreibung",
  url: "assets/documents/ausschreibung.pdf",
  type: "announcement",
  description: "Optionale Beschreibung",
  fileType: "PDF",
  fileSize: "240 KB"
}
```

`label`, `url` und `type` sind redaktionell erforderlich. Die Normalisierung unterstützt folgende case-sensitive Typwerte:

- `announcement`;
- `invitation`;
- `start-list`;
- `result-list`;
- `form`;
- `certificate`;
- `other`.

Ein fehlender, unbekannter oder abweichend geschriebener Typ wird robust als `other` normalisiert. `description`, `fileType` und `fileSize` sind optionale Textangaben.

Dokumentziele dürfen relative URLs oder absolute HTTPS-URLs mit gültigem Host sein. HTTP, protokollrelative URLs und andere Protokolle wie `javascript:`, `data:`, `vbscript:`, `file:` oder `ftp:` werden verworfen. Diese strengere Regel gilt ausschließlich für das Dokumentenmodell; andere bestehende Linkmodelle behalten ihre bisherigen Regeln.

`normalizeEventDocuments(event)` führt die Daten in folgender stabiler Reihenfolge zusammen:

1. `documents`;
2. `results` mit `kind: "file"` als `result-list`;
3. `downloads` als `other`.

Externe Ergebnisse bleiben außerhalb des Dokumentenmodells. Bei identischer, getrimmter URL bleibt ausschließlich der erste normalisierte Eintrag erhalten. Innerhalb jeder Quelle bleibt die gepflegte Reihenfolge bestehen. Die Funktion verändert keine Eingabedaten.

### 4.6 Downloads (Legacy)

```js
{
  label: "Ausschreibung",
  url: "assets/downloads/ausschreibung.pdf",
  description: "Optionale Beschreibung",
  fileType: "PDF",
  fileSize: "240 KB"
}
```

Das bisherige Feld bleibt für bestehende Veranstaltungen rückwärtskompatibel verfügbar. Sichtbare Verbraucher verwenden die kanonische Zusammenführung; dabei werden gültige Legacy-Einträge als Dokumenttyp `other` übernommen. Neue redaktionelle Daten sollen unter `documents` gepflegt werden.

### 4.7 Ergebnisse

```js
{
  label: "Ergebnisliste",
  url: "assets/results/ergebnis.pdf",
  kind: "file",
  description: "Optionale Beschreibung",
  fileType: "PDF",
  fileSize: "180 KB"
}
```

`kind` ist verbindlich:

- `file` für eine Datei;
- `external` für eine externe HTTP-/HTTPS-Seite.

Andere Ergebnisarten werden nicht gerendert.

Ergebnisdateien mit `kind: "file"` werden durch `normalizeEventDocuments()` als Dokumenttyp `result-list` bereitgestellt und ausschließlich im Dokumentbereich ausgegeben. Externe Ergebnisse bleiben davon getrennt und erscheinen ausschließlich unter „Ergebnisse“.

### 4.8 Externe Links

```js
{
  label: "Veranstalterseite",
  url: "https://example.org/",
  description: "Optionale Beschreibung"
}
```

`label` und eine absolute sichere HTTP-/HTTPS-URL sind erforderlich. Externe Ziele werden sichtbar gekennzeichnet, aber nicht automatisch in einem neuen Fenster geöffnet.

### 4.9 Datumsregeln

- `start` und `end` verwenden lokale ISO-Daten (`YYYY-MM-DD`) oder lokale
  ISO-ähnliche Datums-/Zeitwerte (`YYYY-MM-DDTHH:MM:SS`) ohne
  Zeitzonenangabe;
- die Interpretation erfolgt in der lokalen Zeitzone des Browsers;
- ein reines ISO-Datum wird ohne Uhrzeit ausgegeben und gilt für die
  Lebenszyklusberechnung bis zum Ende dieses Kalendertags;
- ein ungültiges `start` verhindert die Detailansicht;
- ein fehlendes oder ungültiges `end` wird ignoriert;
- ein vor `start` liegendes `end` wird ebenfalls ignoriert;
- eintägige und mehrtägige Veranstaltungen werden automatisch unterschieden;
- Datum und – nur sofern belegt – Uhrzeit werden mit semantischen
  `<time>`-Elementen ausgegeben.

### 4.10 Lebenszyklus

Die zeitliche Phase einer Veranstaltung wird nicht im Datensatz gespeichert. `EventUtils.getEventPhase(event, referenceTime)` berechnet sie aus `start`, einem verwendbaren `end` und dem übergebenen Referenzzeitpunkt:

| Phase | Regel |
|---|---|
| `upcoming` | Referenzzeitpunkt liegt vor `start` |
| `ongoing` | Referenzzeitpunkt liegt zwischen `start` und dem effektiven Ende, jeweils einschließlich |
| `past` | Referenzzeitpunkt liegt nach dem effektiven Ende |
| `null` | `start` oder Referenzzeitpunkt ist ungültig |

Ein fehlendes, ungültiges oder vor `start` liegendes `end` wird für die
Phasenberechnung ignoriert. Bei einem Start mit Uhrzeit gilt dann `start` als
effektives Ende; bei einem reinen Startdatum gilt das Ende dieses Kalendertags.

Der optionale redaktionelle Sonderzustand bleibt von der zeitlichen Phase getrennt. `EventUtils.getEventEditorialStatus(event)` akzeptiert ausschließlich:

- `cancelled` für eine abgesagte Veranstaltung;
- `postponed` für eine vorübergehend verschobene Veranstaltung.

Ein fehlender, leerer oder unbekannter Wert ergibt `null`. Bestehende Datensätze ohne `editorialStatus` bleiben dadurch vollständig kompatibel.

Für Verschiebungen gilt als fachlicher Normalablauf:

1. Solange kein Ersatztermin feststeht, bleiben `start` und `end` unverändert und `editorialStatus` steht auf `postponed`.
2. Sobald ein Ersatztermin verbindlich ist, werden `start` und `end` aktualisiert und `editorialStatus` wird entfernt.
3. Die Veranstaltung durchläuft mit dem neuen Termin wieder den normalen zeitlichen Lebenszyklus.

Die Kombination `phase = "past"` und `editorialStatus = "postponed"` ist kein fachlich gewünschter Endzustand. Sie wird als vorübergehender Prüfzustand toleriert, wenn der ursprüngliche Termin bereits verstrichen ist, der Datensatz aber noch nicht abschließend aktualisiert wurde. Die Phasenberechnung bleibt dabei objektiv und der redaktionelle Sonderzustand erhalten.

AP 1 definiert ausschließlich Datenvertrag und Hilfsfunktionen. Timeline, Countdown und Detailseite verwenden die neuen Lebenszykluswerte noch nicht.

### 4.9 Entwicklungsdaten

Der Schalter steht in `js/data/events.js`:

```js
const USE_DEMO_DATA = false;
```

- `true`: produktive und klar markierte Entwicklungsdaten;
- `false`: ausschließlich produktive Daten.

`false` ist der verbindliche Standard für die normale Website. Für gezielte lokale Entwicklungsprüfungen kann der Schalter vorübergehend auf `true` gesetzt werden; vor einer Veröffentlichung muss er wieder auf `false` stehen.

Die Entwicklungsdaten liegen weiterhin in `js/data/dev-events.js` und werden bei deaktiviertem Schalter nicht in das sichtbare Array `events` übernommen. Lokale Entwicklungsressourcen liegen in `assets/dev/` und sind inhaltlich eindeutig als nicht produktiv gekennzeichnet.

---

## 5. Qualitätssicherung

### 5.1 Automatisierte Tests

Die Tests verwenden ausschließlich den eingebauten Node-Test-Runner.

`tests/event-utils.test.js` deckt ab:

Abgedeckt sind:

- Detailfähigkeit;
- Titelrückfall;
- URL-Erzeugung und URL-Kodierung;
- kein, ein und mehrere Slug-Treffer;
- zeitliche Veranstaltungsphasen einschließlich Grenzzeitpunkten;
- fehlende, ungültige und vor dem Start liegende Endzeitpunkte;
- redaktionelle Sonderzustände und tolerierte Übergangszustände;
- Bild- und Galerienormalisierung;
- Downloads, Ergebnisse und externe Links;
- sichere und unsichere URL-Protokolle;
- unveränderte Eingabedaten;
- Demo-Schalter `true` und `false`;
- produktives Datenmodell;
- zentrale Ortsnormalisierung, eindeutige Referenzauflösung und Legacy-Rückfall;
- vollständige Demo-Testabdeckung;
- Existenz lokaler Entwicklungsressourcen.

Ausführung:

```text
node --test tests/*.test.js
```

`tests/history-page.test.js` prüft:

- Existenz der statischen Seite und ihres Stylesheets;
- genau eine H1 und die verbindliche Reihenfolge der Chronikstationen einschließlich 1618–1648 und 1902;
- vollständige Datumswerte in semantischen `time`-Elementen;
- Geschichtsteaser als einzigen neuen Einstieg ohne Erweiterung von Header oder Footer;
- öffentlich verständliche historische Quellen ohne Arbeits-, Archiv- oder direkte Jimdo-Medienverweise;
- Abmessungen und Alternativtexte aller auf der Seite verwendeten Bilder;
- Zuordnung, Bildunterschriften und Prüfsummen der fünf historischen Medien;
- genau drei historische Fotografien und ihre Stationslinks in der Startseitengalerie;
- gemeinsame Lightbox-Einbindung auf Geschichts- und Veranstaltungsdetailseite;
- Entfernung problematischer Kontinuitätsbehauptungen auf der Startseite;
- Ausschluss des lokalen Migrationsarchivs über `.gitignore`.

`tests/board-page.test.js` prüft:

- statische H1-, Detailseiten- und Abschnittsstruktur;
- bestätigte Personen und ihre eindeutige fachliche Zuordnung;
- Ausschluss ungeprüfter Kontaktdaten, Karten-, Anfahrts- und Porträtinhalte;
- unveränderten sichtbaren Inhalt der verlinkten Ansprechpartnerkarte;
- unveränderte Header- und Footer-Navigation sowie die gemeinsamen Skripte.

`tests/achievements-page.test.js` prüft:

- statische H1-, Detailseiten- und Abschnittsstruktur;
- zehn quellengetreu benannte Schützenkönig-Einträge in absteigender Reihenfolge;
- bewusste Lücke 2018 und die quellengetreue Schreibweise für 2019;
- Existenz, feste Abmessungen und Prüfsummen aller öffentlichen Medien;
- vollständige, responsive Bilddarstellung im Kartenraster;
- gemeinsame Lightbox ohne parallele Steuerung;
- unveränderten sichtbaren Inhalt der verlinkten Erfolgskarte;
- zehn zusätzliche Motive und deren Sprungziele in der statischen Startseitengalerie;
- unveränderte Header- und Footer-Navigation.

`tests/facility-page.test.js` prüft:

- statischen Seitenrahmen, genau eine H1 und den Einstieg über die sichtbar unveränderte Startseitenkarte;
- ausschließlich die bestätigten Angaben zur Nutzung, Standgebühr sowie zu Leihwaffen und Munition;
- Ausschluss ungeprüfter Kontakt-, Adress-, Öffnungs- und Trainingsangaben;
- vier lokale Anlagenmedien mit festen Maßen, Alternativtexten, Bildunterschriften und Prüfsummen;
- vollständige responsive Medienausgabe und die unveränderte gemeinsame Lightbox;
- unveränderte Header- und Footer-Navigation sowie ausschließlich vorhandene lokale Ziele.

`tests/guestbook.test.js` prüft:

- Pflichtfelder, eindeutige IDs, gültige ISO-Daten und unveränderte Eingabedaten;
- stabile Datumsreihenfolge und Auswahl ausschließlich freigegebener Startseitenstimmen;
- fünf freigegebene Bestandseinträge, ihre exakten Texte und den weiterhin verfügbaren Leerzustand;
- Startseitenposition zwischen Galerie und Mitgliedschaft sowie verborgenen Zustand ohne Auswahl;
- Wechselintervall, zufälligen Startindex, Pause-, Sichtbarkeits- und Reduced-Motion-Vertrag;
- gemeinsame Rasterfläche der Stimmen und mindestens 44 Pixel große Bedienelemente;
- Gästebuchlink in allen Footern ohne Erweiterung der Hauptnavigation.

`tests/footer.test.js` prüft:

- unveränderte Prüfsummen und intrinsische Maße der freigegebenen Verbandslogos;
- Reihenfolge DSB, GSG und Landesschützenverband innerhalb der Logozeile;
- globale Reihenfolge Logozeile, Navigation und Copyright-/Leitsatzzeile;
- konsistente externe Linkziele und zugängliche Namen auf allen Seiten;
- responsive Ein-Zeilen-Logogruppe sowie Separatoren ohne eingetippte oder
  isolierte Trennzeichen.

`tests/privacy-page.test.js` prüft:

- statischen Detailseitenrahmen, genau eine H1 und ausschließlich lokale
  automatisch geladene Ressourcen;
- verbindliche Vereins-, Register-, Hosting- und Domainangaben;
- Formspree und counter.dev in der öffentlichen Textfassung als Bestandteile
  des vorgesehenen Veröffentlichungszustands ohne interne Arbeitsvermerke;
- tatsächlichen klickbasierten OSM-Ablauf sowie veröffentlichte
  Gästebucheinträge und Betroffenenrechte;
- Datenschutzlink in allen Footern ohne Erweiterung der Hauptnavigation.

`tests/imprint-page.test.js` prüft:

- den bestehenden Detailseitenrahmen, bestätigte Anbieterangaben und den
  eindeutigen E-Mail-Platzhalter;
- Ausschluss alter Disclaimer, unbelegter Kontaktangaben und öffentlicher
  Arbeitsvermerke;
- Impressum und Datenschutz als funktionierende rechtliche Footerziele auf
  allen produktiven Seiten;
- vorhandene lokale Ressourcen und interne Linkziele ohne automatische
  Drittanfragen.

`tests/venue-map.test.js` prüft:

- ausschließlich lokale und unveränderte Leaflet-1.9.4-Laufzeitdateien samt Lizenz und SHA-256;
- kontrollierte Stylesheet- und Script-Reihenfolge ohne CDN;
- zugänglich beschrifteten Kartendialog und koordinatenabhängigen Kartenbutton;
- keine Tile-Verbindung beim normalen Seitenstart;
- Karteninitialisierung erst nach bewusstem Öffnen;
- Kartenabbau und Fokus-Rückgabe beim Schließen;
- Ablehnung unvollständiger oder ungültiger Kartenpositionen;
- Ausschluss eigener Cookie- oder Browserspeichermechanismen.

### 5.2 Browserprüfungen

IA-002 wurde geprüft mit:

- Startseite und Detailseite;
- allen produktiven Veranstaltungen;
- allen Demo-Veranstaltungen;
- Timeline, Countdown, Archiv und Galerie;
- allen Detail-Fehlerzuständen;
- eintägigen, mehrtägigen und nur mit Start dargestellten Datumsfällen;
- mobiler Navigation und Escape-Fokus;
- 320, 360, 480, 820, 1024 und 1440 Pixeln;
- horizontalen Überläufen;
- fehlenden lokalen Assets;
- Browserkonsole;
- Demo-Schalter `true` und `false`.

AP 2 ergänzt diese Browserprüfung um:

- Reihenfolge aller vorhandenen Inhaltsbereiche;
- unverändertes Ausblenden leerer Bereiche;
- Galerien mit null, bis zu sechs und mehr als sechs gültigen Bildern;
- Restanzahl, Auf- und Einklappen sowie `aria-expanded`;
- Tastaturbedienung und stabilen sichtbaren Ausschnitt beim Einklappen;
- Bildreihenfolge, Alternativtexte, Bildunterschriften und doppelte Ausgaben;
- mobile und große Ansichten.

AP 3 ergänzt diese Browserprüfung um:

- Öffnen der Galeriekacheln per Maus und Tastatur;
- initialen Fokus, Fokusbegrenzung und Fokus-Rückgabe;
- Schließen per Schalter, Escape und Dialoghintergrund;
- Vor-/Zurück-Schalter und Pfeiltastennavigation ohne Umlauf;
- erstes, mittleres und letztes Bild sowie den Ein-Bild-Fall;
- vollständige Navigation bei ein- und ausgeklappter Galerie;
- synchronen Wechsel von Bild, Alternativtext, Bildunterschrift, Abmessungen und Positionsangabe;
- mobile und große Dialoglayouts, Hintergrundscrollen, Assets und Browserkonsole.

AP 4 ergänzt die automatisierte Prüfung um:

- alle sieben Dokumenttypen und den case-sensitiven Typvertrag;
- den robusten Rückfall fehlender oder unbekannter Typen auf `other`;
- erlaubte relative und absolute HTTPS-Dokumentziele;
- die Ablehnung von HTTP, protokollrelativen URLs und allen nicht freigegebenen Protokollen;
- Übernahme von Legacy-Downloads und Ergebnisdateien;
- stabile Quellreihenfolge und URL-basierte Deduplizierung;
- unveränderte Eingabedaten sowie vollständige lokale Entwicklungsressourcen;
- Produktiv- und Entwicklungsdaten bei Demo-Schalter `true` und `false`.

AP 5B ergänzt die Browserprüfung um:

- kanonische Dokumente, Ergebnisdateien und Legacy-Downloads im gemeinsamen Dokumentbereich;
- deutsche Bezeichnungen aller sieben Dokumenttypen;
- URL-basierte Deduplizierung bei parallelen Neu- und Legacy-Daten;
- ausschließliche Ausgabe externer Ergebnisquellen unter „Ergebnisse“;
- kanonischen Dokument- und externen Ergebnisstatus in Timeline und Archiv.

GES-002 ergänzt die Browserprüfung um:

- Geschichtsteaser per Maus und Tastatur;
- chronologische DOM-, Überschriften- und Landmarkenstruktur;
- mobile Navigation und Rücklink zum Vereinsbereich;
- Darstellung bei 320, 360, 480, 820, 1024 und 1440 Pixeln;
- Textzoom bis 200 Prozent und horizontalen Überlauf;
- fehlende Assets und Browserkonsole;
- Startseite und Veranstaltungsdetailseite als Regression.

EVT-LOC-001 ergänzt die Browserprüfung um:

- unveränderte Ortsdarstellung ohne zentrale Referenz oder Koordinaten;
- sichtbaren, per Maus, Tastatur und Touch bedienbaren Kartenaufruf ausschließlich bei gültigen Koordinaten;
- ausbleibende OSM-Anfragen vor dem Kartenaufruf und Tile-Anfragen unmittelbar danach;
- exakten Marker, sichtbare Attribution und freiwilligen externen OSM-Fallback;
- Schließen per Schalter, Escape und Backdrop sowie Fokus-Rückgabe;
- Touch-Zoom, Tastatursteuerung und mindestens 44 Pixel große Bedienelemente;
- 320, 360, 480, 820, 1024 und 1440 Pixel sowie Hoch-/Querformat;
- Browserkonsole, fehlende Assets und horizontale Überläufe.

### 5.3 Barrierearme Grundlagen

- Skip-Link;
- genau eine H1 pro gerendertem Detailzustand;
- sinnvolle Überschriftenhierarchie;
- semantische Artikel, Bereiche, Listen, Links, `figure`, `figcaption` und `time`;
- sichtbare Fokusdarstellung;
- mindestens 44 Pixel große primäre Bedienelemente;
- vollständige Tastaturbedienung;
- native Modalität mit Fokusbegrenzung und Rückgabe an den Auslöser;
- keine erzwungenen neuen Fenster;
- Reduced-Motion-Unterstützung für bestehende Animationen.
- statische, chronologisch geordnete Geschichtsinhalte ohne bewegte oder JavaScript-abhängige Darstellung.

---

## 6. Fachliche Bewertung

### 6.1 Gut und wartbar gelöst

- Veranstaltungen werden nur einmal zentral gepflegt.
- Eine Detaildatei stellt alle Veranstaltungen dar.
- Detail-URLs entstehen ausschließlich über eine gemeinsame Funktion.
- Datenvalidierung und Normalisierung sind DOM-unabhängig und automatisiert testbar.
- Produktive Daten und Entwicklungsdaten bleiben strikt getrennt.
- Optionale Inhalte erzeugen weder leere Flächen noch künstliche Platzhalter.
- Timeline, Countdown, Galerie und Detailseite verwenden dasselbe Datenmodell.
- Die Lösung bleibt ohne Framework und Build-System lauffähig; Leaflet ist als einzige Fremdbibliothek lokal und versionsgebunden abgelegt.

### 6.2 Verbleibende Grenzen

- Produktive Veranstaltungen enthalten noch keine freigegebenen Detailinhalte.
- Datumswerte besitzen keine explizite Zeitzone.
- Slug-Eindeutigkeit wird zur Laufzeit erkannt, aber nicht bereits bei der Pflege verhindert.
- Die globale Variable `events` und klassische Skripte erzeugen weiterhin implizite Ladeabhängigkeiten.
- `style.css` ist umfangreich und global.
- Tests konzentrieren sich derzeit auf Hilfsfunktionen und Datenmodell; es existiert kein dauerhaftes DOM-Testsystem.
- Der Demo-Schalter ist weiterhin eine manuelle Veröffentlichungsvoraussetzung.
- Es gibt noch keine Deployment- oder Content-Security-Konfiguration.
- OSM-Tiles sind ein externer Best-effort-Dienst ohne eigene Verfügbarkeitsgarantie; Richtlinien, konkrete Rechtsgrundlage und Produktionsrequests müssen vor Veröffentlichung abschließend geprüft werden.

### 6.3 Sinnvolle spätere Refactorings

Erst nach den nächsten fachlichen Ausbauschritten sind sinnvoll:

1. Datums- und Zeitzonenregeln weiter zentralisieren.
2. Slug-Eindeutigkeit als automatisierte Datenprüfung vor Veröffentlichung absichern.
3. Klassische Skripte kontrolliert in ES-Module überführen.
4. Globale Styles nach Basis, Layout und Komponenten aufteilen.
5. DOM-nahe Integrationstests dauerhaft automatisieren.
6. Medienstruktur und responsive Bildvarianten ausbauen.

---

## 7. Zusammenfassung

Mit IA-002 ist aus der reinen Startseitenchronik eine integrierte, datengetriebene Veranstaltungsarchitektur entstanden. Ein verbindliches Modell versorgt Countdown, Timeline, Archiv, Galerie und universelle Detailseite. Gemeinsame Hilfsfunktionen verhindern doppelte URL- und Validierungslogik, während klar getrennte Entwicklungsdaten alle optionalen Zustände prüfbar machen.

Die technische Grundlage für produktive Veranstaltungsdetails und schrittweise zentral gepflegte Veranstaltungsorte ist vollständig. Der erste reale Venue ist zentral hinterlegt und wird von zwei fachlich bestätigten Events referenziert. Impressum und Datenschutzseite sind integriert; E-Mail-Adresse, Anbieterintegrationen, Produktionsrequests und rechtliche Einordnungen bleiben vor Veröffentlichung abschließend zu prüfen. Weitere Ortsumstellungen bleiben jeweils einzeln freizugebende Eventmigrationen.
