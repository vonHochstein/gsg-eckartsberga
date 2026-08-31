# Technische Projektdokumentation

## Großkaliber Schützengilde 1503 Eckartsberga e. V.

**Stand:** 31. August 2026
**Fortgeschrieben nach:** IA-001, IA-002, AP 1 bis AP 5B, GES-001 und GES-002
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
- Darstellung von Beschreibung, Veranstaltungsinformationen, Ergebnissen, Dokumenten, externen Links und Galerie;
- native, barrierearme Lightbox für Galeriebilder mit Tastaturnavigation und Fokus-Rückgabe;
- definierte Fehlerzustände für fehlende, unbekannte, unvollständige oder nicht eindeutige Veranstaltungen;
- dynamische Dokument- und Open-Graph-Metadaten;
- Verlinkung von Timeline, Countdown und eventbezogenem Galerie-Teaser auf Detailseiten;
- automatisierte Tests für `EventUtils`, Datenmodell und Demo-Schalter;
- responsive Browserprüfung von 320 bis 1440 Pixeln.

Noch nicht umgesetzt sind insbesondere:

- freigegebene Detailinhalte für produktive Veranstaltungen;
- vollständige Vereins-, Anlagen-, Erfolgs- und Kontaktinhalte;
- Impressum und Datenschutz;
- vollständige produktive Galerie;
- Backend, CMS, Formulare, Suche und Mitgliederbereich;
- Build-, Deployment- und Hosting-Konfiguration.

### 1.3 Technische Grundlage

Die Anwendung verwendet:

- HTML5;
- ein globales und ein detailseitenspezifisches Stylesheet;
- klassische JavaScript-Dateien mit `defer`;
- Browser-APIs wie DOM, `Date`, `Intl.DateTimeFormat`, `URL`, `URLSearchParams`, `matchMedia` und Timer;
- keine externen Bibliotheken;
- keinen Paketmanager, Compiler oder Bundler;
- keine API, Datenbank oder serverseitige Logik.

---

## 2. Projektstruktur

```text
/
├── index.html
├── event.html
├── geschichte.html
├── style.css
├── event.css
├── geschichte.css
├── notes.rtf
├── assets/
│   ├── dev/
│   │   ├── demo-ausschreibung.txt
│   │   └── demo-ergebnis.txt
│   └── img/
│       ├── hero-eckartsburg.jpg
│       ├── hero-eckartsburg.png
│       ├── history-eckartsberga.jpg
│       ├── logo-gsg-eckartsberga.png
│       └── logo-schuetzenkreis-sued.png
├── js/
│   ├── data/
│   │   ├── dev-events.js
│   │   └── events.js
│   ├── calendar.js
│   ├── countdown.js
│   ├── event-detail.js
│   ├── event-utils.js
│   ├── gallery.js
│   ├── main.js
│   └── navigation.js
├── tests/
│   ├── event-utils.test.js
│   └── history-page.test.js
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
- Mitgliedschaftsteaser;
- Demo-Hinweis;
- Footer;
- Script-Einbindungen für Daten, Hilfsfunktionen und Startseitenlogik.

Die Script-Reihenfolge ist:

1. `js/data/dev-events.js`
2. `js/data/events.js`
3. `js/event-utils.js`
4. `js/navigation.js`
5. `js/countdown.js`
6. `js/calendar.js`
7. `js/gallery.js`
8. `js/main.js`

#### `event.html`

Die universelle Detailseite enthält dieselben gemeinsamen Seitenbausteine, ein leeres Renderziel `#event-detail`, genau ein wiederverwendbares natives `<dialog>` für die Galerie-Lightbox und einen verständlichen `<noscript>`-Hinweis.

Sie lädt bewusst keine Startseitenmodule für Countdown, Timeline oder Galerieanimation. Ihre Script-Reihenfolge ist:

1. `js/data/dev-events.js`
2. `js/data/events.js`
3. `js/event-utils.js`
4. `js/navigation.js`
5. `js/event-detail.js`
6. `js/main.js`

#### `geschichte.html`

Die eigenständige Geschichtsseite enthält:

- denselben Header und Footer wie die übrigen Seiten, ohne zusätzlichen globalen Navigationspunkt;
- einen kompakten Seiteneinstieg mit Rücklink zum Vereinsbereich;
- eine chronologisch geordnete, vollständig statische Vereinschronik;
- eine sichtbare Sektion „Quellen und Einordnung“;
- bewusst keine ungeklärten historischen Medien und keine JavaScript-abhängige Inhaltsausgabe.

Sie lädt ausschließlich `js/navigation.js` für das mobile Menü und `js/main.js`
für die Jahreszahl im Footer. Der vorhandene Geschichtsteaser auf der Startseite
ist der kanonische Einstieg.

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
- Footer;
- responsive Regeln;
- Reduced-Motion-Regeln.

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

### 2.3 JavaScript

#### `js/data/events.js`

Enthält:

- `productionEvents` mit den produktiven Terminen;
- den Schalter `USE_DEMO_DATA`;
- das daraus abgeleitete globale Array `events`;
- die Aktivierung des sichtbaren Entwicklungshinweises.

#### `js/data/dev-events.js`

Enthält ausschließlich klar markierte, erfundene Entwicklungsdaten. Sie decken knappe und vollständige Veranstaltungen, Bild- und Galeriefälle, Dokumente, Legacy-Downloads, Datei- und externe Ergebnisse, externe Links, lange Texte sowie Anmeldepflicht ab.

#### `js/event-utils.js`

Stellt genau einen globalen Namensraum `window.EventUtils` bereit. Die Funktionen sind DOM-unabhängig und verändern übergebene Daten nicht.

| Funktion | Aufgabe |
|---|---|
| `isSafeUrl(value)` | erlaubt lokale relative Pfade sowie HTTP/HTTPS und sperrt unsichere Protokolle |
| `normalizeImage(image)` | normalisiert ein Titelbild oder liefert `null` |
| `normalizeGallery(gallery)` | normalisiert Galeriebilder und verwirft ungültige Einträge |
| `normalizeDownloads(downloads)` | normalisiert bestehende Downloadobjekte für Legacy-Verbraucher |
| `normalizeDocuments(documents)` | normalisiert typisierte Dokumente mit dokumentenspezifischer URL-Prüfung |
| `normalizeResults(results)` | normalisiert Datei- und externe Ergebnisse |
| `normalizeEventDocuments(event)` | führt neue Dokumente, Ergebnisdateien und Downloads stabil und ohne URL-Duplikate zusammen |
| `normalizeExternalLinks(externalLinks)` | normalisiert ausschließlich sichere externe HTTP-/HTTPS-Links |
| `getEventTitle(event)` | liefert `title` mit Rückfall auf `shortTitle` |
| `getEventOrganizerLogo(event)` | liefert nur für exakt freigegebene `organizer`-Werte ein lokales Herkunftslogo, sonst `null` |
| `isDetailCapable(event)` | prüft Slug, Titel und gültigen Startzeitpunkt |
| `createDetailUrl(event)` | erzeugt ausschließlich für detailfähige Einträge `event.html?event=<kodierter Slug>` |
| `resolveEventBySlug(list, slug)` | unterscheidet keinen, einen und mehrere Slug-Treffer |

#### `js/countdown.js`

Ermittelt die nächste zukünftige Veranstaltung, aktualisiert Titel, Kategorie, Datum und Countdown und verwendet `EventUtils` für Titel und Detail-URL. Die bestehende Karte erhält nur dann einen `href`, wenn `createDetailUrl()` eine gültige URL liefert.

#### `js/calendar.js`

Erzeugt Timeline und Archiv. Für Titel, Bild, kanonische Dokumente, externe Ergebnisse, Galerie und Detailfähigkeit werden die passenden `EventUtils`-Funktionen verwendet. Der Dokumentstatus berücksichtigt `documents`, Ergebnisdateien und Legacy-Downloads; der Ergebnisstatus ausschließlich externe Ergebnisquellen. Detailfähige Karten erhalten einen semantischen, tastaturbedienbaren Vollflächen-Link. Nicht detailfähige Karten bleiben normale Artikel.

#### `js/gallery.js`

Normalisiert eventbezogene Galeriebilder über `EventUtils`. Jedes Bild behält seine Veranstaltung als Kontext und wird nur bei vorhandener Detail-URL verlinkt. Gibt es keine eventbezogenen Bilder, bleiben die statischen Rückfallbilder unverändert.

#### `js/event-detail.js`

Liest ausschließlich den URL-Parameter `event`, löst den Slug über `EventUtils` auf und rendert:

- Veranstaltungskopf;
- optionales, eindeutig über `organizer` zugeordnetes Herkunftslogo;
- Datum und Uhrzeit;
- Titelbild;
- Beschreibung;
- Veranstaltungsinformationen;
- kanonisch zusammengeführte Dokumente aus `documents`, Ergebnisdateien und Legacy-Downloads;
- externe Ergebnisse;
- externe Links;
- Galerie als abschließenden Inhaltsbereich.

Dokumente werden über `normalizeEventDocuments()` zusammengeführt und mit ihrer deutschen Typbezeichnung dargestellt. Ergebnisdateien erscheinen ausschließlich unter „Dokumente“, externe Ergebnisquellen ausschließlich unter „Ergebnisse“.

Die Herkunftslogo-Zuordnung verwendet eine exakte Allowlist in `EventUtils`. Titel, Kategorie und Beschreibung werden dafür nicht ausgewertet. Für den Schützenkreis sind der bestehende Kurzschlüssel `Schützenkreis "SUED"` und die quellengetreue offizielle Langform als getrennte exakte Schlüssel registriert. Unbekannte, fremde oder generische Veranstalter wie `Kreisschützenverband` bleiben ohne Logo.

Leere oder ungültige optionale Bereiche werden vollständig ausgelassen. Ein ungültiges oder vor `start` liegendes `end` wird ignoriert.

Bis zu sechs gültige Galeriebilder werden vollständig dargestellt. Bei mehr als sechs Bildern zeigt die Seite zunächst die ersten sechs in Datenreihenfolge. Ein nativer, tastaturbedienbarer Schalter blendet die verbleibenden Bilder ein und wieder aus; Beschriftung und `aria-expanded` folgen dem tatsächlichen Zustand. Beim Einklappen wird die Position des Schalters im sichtbaren Bereich stabilisiert. Ungültige Galerieeinträge werden bereits durch `EventUtils.normalizeGallery()` verworfen und zählen nicht gegen diese Grenze.

Jede Galeriekachel öffnet dasselbe native `<dialog>` mit dem vollständigen Bild, vorhandenem Alternativtext und optionaler Bildunterschrift. Die Lightbox navigiert über Schalter und linke beziehungsweise rechte Pfeiltaste durch alle gültigen Bilder in Datenreihenfolge, auch wenn die Kachelansicht noch eingeklappt ist. An den Grenzen findet kein Umlauf statt; bei nur einem Bild werden die Navigationsschalter ausgeblendet.

Der initiale Fokus liegt auf dem sichtbaren Schließen-Schalter. Schließen ist per Schalter, Escape und eindeutigem Klick auf die Dialogfläche außerhalb des Panels möglich. Pointerdown innerhalb des Panels verhindert ein versehentliches Schließen beim Loslassen außerhalb. Das native Modalverhalten hält Hintergrund und außerhalb liegende Bedienelemente inert; jedes Schließen gibt den Fokus an die auslösende Kachel zurück. Es wurden keine Übergangs- oder Bildwechselanimationen ergänzt.

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
| `index.html` | `style.css`, Daten, `EventUtils`, Startseitenmodule |
| `event.html` | `style.css`, `event.css`, Daten, `EventUtils`, Navigation, Detailrenderer |
| `events.js` | optional `developmentEvents` |
| `event-utils.js` | standardisierte Browser-/JavaScript-APIs, kein DOM |
| `countdown.js` | `events`, `EventUtils`, Startseiten-DOM |
| `calendar.js` | `events`, `EventUtils`, Timeline-DOM und Timeline-CSS |
| `gallery.js` | `events`, `EventUtils`, Galerie-DOM und Galerie-CSS |
| `event-detail.js` | `events`, `EventUtils`, Detail-DOM und `event.css` |
| `navigation.js` | gemeinsame Header- und Navigationsstruktur |
| `main.js` | Footer-Jahr und Demo-Datenattribut |

---

## 4. Verbindliches Datenmodell

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
  location: "Lossa",
  organizer: "Kreisschützenverband",
  description: "",
  image: null,
  gallery: [],
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
| `start` | String | erforderlicher, lokal interpretierter Startzeitpunkt |
| `end` | String | optionaler Endzeitpunkt |
| `editorialStatus` | String oder `null` | optionaler redaktioneller Sonderzustand `cancelled` oder `postponed` |
| `location` | String | optionaler Ort |
| `organizer` | String | optionaler Veranstalter; dient bei exaktem Allowlist-Treffer zusätzlich der Herkunftslogo-Zuordnung |
| `description` | String | optionale Beschreibung |
| `image` | Objekt oder `null` | optionales Titelbild |
| `gallery` | Array | optionale Galeriebilder |
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

### 4.4 Dokumente

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

### 4.5 Downloads (Legacy)

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

### 4.6 Ergebnisse

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

### 4.7 Externe Links

```js
{
  label: "Veranstalterseite",
  url: "https://example.org/",
  description: "Optionale Beschreibung"
}
```

`label` und eine absolute sichere HTTP-/HTTPS-URL sind erforderlich. Externe Ziele werden sichtbar gekennzeichnet, aber nicht automatisch in einem neuen Fenster geöffnet.

### 4.7 Datumsregeln

- `start` und `end` verwenden derzeit lokale ISO-ähnliche Strings ohne Zeitzonenangabe;
- die Interpretation erfolgt in der lokalen Zeitzone des Browsers;
- ein ungültiges `start` verhindert die Detailansicht;
- ein fehlendes oder ungültiges `end` wird ignoriert;
- ein vor `start` liegendes `end` wird ebenfalls ignoriert;
- eintägige und mehrtägige Veranstaltungen werden automatisch unterschieden;
- Datum und Uhrzeit werden mit semantischen `<time>`-Elementen ausgegeben.

### 4.8 Lebenszyklus

Die zeitliche Phase einer Veranstaltung wird nicht im Datensatz gespeichert. `EventUtils.getEventPhase(event, referenceTime)` berechnet sie aus `start`, einem verwendbaren `end` und dem übergebenen Referenzzeitpunkt:

| Phase | Regel |
|---|---|
| `upcoming` | Referenzzeitpunkt liegt vor `start` |
| `ongoing` | Referenzzeitpunkt liegt zwischen `start` und dem effektiven Ende, jeweils einschließlich |
| `past` | Referenzzeitpunkt liegt nach dem effektiven Ende |
| `null` | `start` oder Referenzzeitpunkt ist ungültig |

Ein fehlendes, ungültiges oder vor `start` liegendes `end` wird für die Phasenberechnung ignoriert. In diesem Fall gilt `start` als effektives Ende.

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
- vollständige Demo-Testabdeckung;
- Existenz lokaler Entwicklungsressourcen.

Ausführung:

```text
node --test tests/*.test.js
```

`tests/history-page.test.js` prüft:

- Existenz der statischen Seite und ihres Stylesheets;
- genau eine H1 und die verbindliche Reihenfolge der Chronikstationen;
- vollständige Datumswerte in semantischen `time`-Elementen;
- Geschichtsteaser als einzigen neuen Einstieg ohne Erweiterung von Header oder Footer;
- sichtbare Quellenkategorien und das Fehlen direkter Jimdo-Medienverweise;
- Abmessungen und Alternativtexte aller auf der Seite verwendeten Bilder;
- Entfernung problematischer Kontinuitätsbehauptungen auf der Startseite;
- Ausschluss des lokalen Migrationsarchivs über `.gitignore`.

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
- Die Lösung bleibt ohne Framework, Build-System oder externe Abhängigkeit lauffähig.

### 6.2 Verbleibende Grenzen

- Produktive Veranstaltungen enthalten noch keine freigegebenen Detailinhalte.
- Datumswerte besitzen keine explizite Zeitzone.
- Slug-Eindeutigkeit wird zur Laufzeit erkannt, aber nicht bereits bei der Pflege verhindert.
- Die globale Variable `events` und klassische Skripte erzeugen weiterhin implizite Ladeabhängigkeiten.
- `style.css` ist umfangreich und global.
- Tests konzentrieren sich derzeit auf Hilfsfunktionen und Datenmodell; es existiert kein dauerhaftes DOM-Testsystem.
- Der Demo-Schalter ist weiterhin eine manuelle Veröffentlichungsvoraussetzung.
- Es gibt noch keine Deployment- oder Content-Security-Konfiguration.

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

Die technische Grundlage für produktive Veranstaltungsdetails ist vollständig. Der nächste fachliche Schritt ist die kontrollierte Pflege realer, freigegebener Inhalte und die Vervollständigung der rechtlichen und redaktionellen Veröffentlichungsgrundlage.
