# IA-002 – Veranstaltungsdetailseiten

## Status

**Abgeschlossen am 24. Juli 2026.**

IA-002 wurde in drei getrennt prüfbaren Arbeitspaketen umgesetzt:

1. verbindliches Datenmodell und gemeinsame Hilfsfunktionen;
2. universelle Veranstaltungsdetailseite;
3. Integration in die Startseite, Regression, Dokumentation und Abschluss.

## Ausgangslage

Die Startseite verfügte bereits über zentrale Veranstaltungsdaten, Timeline, Jahresarchiv, Countdown und einen Galerie-Teaser. Eine Veranstaltung besaß jedoch keine aufrufbare Detailansicht. Zusätzliche Angaben hätten deshalb entweder ungenutzt bleiben oder in einzelnen HTML-Seiten und damit redundant gepflegt werden müssen.

## Ziel

Jede eindeutig identifizierbare Veranstaltung soll bei vorhandenen Kernangaben über dieselbe universelle Detailseite erreichbar sein. Inhalte werden ausschließlich aus dem zentralen Veranstaltungsmodell gerendert. Produktive Termine erhalten keine künstlichen Detailinhalte; Entwicklungsdaten decken die optionalen Bereiche kontrolliert ab.

## Umfang

- einheitliches Veranstaltungs- und Detaildatenmodell;
- schaltbare, getrennte Entwicklungsdaten;
- zentrale, browserweit verfügbare `EventUtils`;
- universelle Seite `event.html`;
- dynamisches Rendern von Kernangaben und optionalen Bereichen;
- URL-, Fehler- und Metadatenkonzept;
- Integration in Timeline, Countdown und Galerie-Teaser;
- automatisierte und manuelle Abschlussprüfungen;
- Aktualisierung der Projektdokumentation.

## Nicht-Ziele

- keine individuellen HTML-Dateien je Veranstaltung;
- keine redaktionelle Befüllung produktiver Termine mit Platzhalterinhalten;
- keine Lightbox, Suche, Anmeldung oder neue externe Integration;
- kein Framework, Build-System oder Routing-System;
- keine Ansprechpartner oder weitergehenden Metadaten;
- keine grundlegende Neugestaltung der Startseite.

## Verbindliches Datenmodell

Die bisherigen Kernfelder bleiben erhalten. Das Modell kann folgende Eigenschaften aufnehmen:

- `slug`
- `title`
- `date` mit `start` und optionalem `end`
- `time`
- `location`
- `category`
- `organizer`
- `description`
- `image`
- `gallery`
- `downloads`
- `results`
- `externalLinks`

`downloads`, `results` und `externalLinks` sind strukturierte Arrays mit `label` und `url`. Ergebnisse können sowohl lokale Dateien als auch externe Seiten referenzieren. `image` und Galerieeinträge tragen `src` und `alt`.

Alle zusätzlichen Detailfelder sind optional. Leere oder ungültige Bereiche erzeugen weder Überschrift noch leeren Container. Ein ungültiges oder vor dem Startdatum liegendes `date.end` wird ignoriert; in diesem Fall erscheint nur das Startdatum.

Die vollständigen Felddefinitionen und Beispiele stehen ausschließlich in der [technischen Projektdokumentation](../TECHNISCHE_PROJEKTDOKUMENTATION.md).

## Architekturentscheidungen

### Universelle URL

Das verbindliche URL-Muster lautet:

```text
event.html?event=<slug>
```

Der Parameter `event` bezeichnet fachlich eindeutig die gewünschte Veranstaltung. Detail-URLs werden ausschließlich mit `EventUtils.createDetailUrl()` erzeugt und nicht in den Verbrauchern manuell zusammengesetzt.

### Detailfähigkeit

Eine Veranstaltung ist detailfähig, wenn:

- ihr Datensatz ein gültiges Objekt ist;
- `slug`, ein darstellbarer Titel und ein gültiges Startdatum vorhanden sind.

Der Umfang optionaler Inhalte beeinflusst die Detailfähigkeit nicht. Eine Seite mit Titel, Datum und Ort bleibt deshalb eine vollständige, bewusst reduzierte Detailansicht.

### Eindeutige Auflösung

`EventUtils.resolveEventBySlug()` unterscheidet erfolgreiche Auflösung, fehlenden Parameter, unbekannten Slug und mehrfach vorkommenden Slug. Bei einem doppelten Slug wird keine Veranstaltung willkürlich ausgewählt. Die sichtbare Überschrift lautet dann „Veranstaltung derzeit nicht verfügbar“.

### Gemeinsame Hilfsfunktionen

`js/event-utils.js` bündelt ausschließlich fachlich gemeinsame Logik:

- Titelbestimmung;
- Prüfung der Detailfähigkeit;
- Erzeugung der Detail-URL;
- eindeutige Slug-Auflösung;
- Normalisierung von Titelbild, Galerie, Downloads, Ergebnissen und externen Links;
- Prüfung erlaubter URL-Protokolle.

Seitenspezifisches Rendering verbleibt in `calendar.js`, `countdown.js`, `gallery.js` beziehungsweise `event-detail.js`. Dadurch bleiben Startseiten- und Detailseitenlogik voneinander entkoppelt.

## Detailseite

`event.html` übernimmt das bestehende Logo, die Navigation, den Footer und das Gestaltungssystem. `event.css` enthält nur die detailseitenspezifische Darstellung. `event-detail.js`:

- liest den Slug aus der URL;
- löst genau eine Veranstaltung aus dem aktiven Datenbestand auf;
- rendert Titelbild, Beschreibung, Eckdaten, Downloads, Ergebnisse, Galerie und externe Links nur bei verwendbaren Daten;
- setzt Dokumenttitel, Meta-Description und Open-Graph-Angaben dynamisch;
- bietet klare Fehleransichten bei fehlendem Parameter, unbekanntem Slug, unvollständigen Kerndaten und doppeltem Slug.

Die Demo-Kennzeichnung wird angezeigt, sobald die Detailseite aus Entwicklungsdaten gerendert wird. Bei deaktiviertem Demo-Schalter sind ausschließlich produktive Datensätze auflösbar.

## Integration

### Timeline und Archiv

Die komplette innere Kartenfläche ist bei detailfähigen Veranstaltungen ein Link. Nicht detailfähige Einträge bleiben semantisch neutrale Karten. Archivkarten verwenden dieselbe Rendering-Funktion und erhalten deshalb automatisch dasselbe Verhalten.

### Countdown

Der Countdown verlinkt die aktuell dargestellte nächste Veranstaltung nur dann, wenn `EventUtils.createDetailUrl()` eine URL liefert. Andernfalls bleibt die Karte ohne `href` und ohne Linkhinweis.

### Galerie-Teaser

Ereignisbezogene Vorschauen verlinken jeweils ihre zugehörige Detailseite. Statische Fallback-Bilder und Bilder nicht detailfähiger Veranstaltungen bleiben unverlinkt.

## Betroffene Bereiche

### Neu angelegt

- `event.html`
- `event.css`
- `js/event-detail.js`
- `js/event-utils.js`
- `tests/event-utils.test.js`
- `assets/dev/demo-ausschreibung.txt`
- `assets/dev/demo-ergebnis.txt`
- dieser Implementierungsnachweis

### Erweitert

- `index.html`
- `style.css`
- `js/data/events.js`
- `js/data/dev-events.js`
- `js/calendar.js`
- `js/countdown.js`
- `js/gallery.js`
- technische Projektdokumentation, Roadmap, Changelog und Implementierungsleitfaden

### Bewusst unverändert

- `js/main.js`
- `js/navigation.js`
- vorhandene produktive Bilder und übrige Inhalte
- grundlegendes Deployment- und Abhängigkeitskonzept

## Abnahmekriterien

- eine einzelne universelle Detailseite rendert jede detailfähige Veranstaltung;
- produktive und Entwicklungsdaten bleiben logisch getrennt;
- der Demo-Schalter funktioniert in beiden Zuständen;
- produktive Termine enthalten keine künstlichen Detailinhalte;
- Timeline, Archiv, Countdown und Galerie verwenden `EventUtils.createDetailUrl()`;
- nicht detailfähige Veranstaltungen erhalten keinen Detail-Link;
- optionale Bereiche verschwinden bei fehlenden oder ungültigen Daten vollständig;
- Fehlerzustände sind verständlich und blockieren keine Navigation;
- Navigation, Tastaturbedienung und responsive Darstellung bleiben erhalten;
- automatisierte Tests, Syntaxprüfungen und Browserprüfungen laufen ohne Fehler.

## Prüfprotokoll

### Automatisiert

- JavaScript-Syntaxprüfung aller Daten-, Hilfs-, Startseiten- und Detailseitenskripte;
- Node-Testlauf für `tests/event-utils.test.js`;
- Prüfung interner Datei- und Medienverweise;
- `git diff --check`.

### Manuell im Browser

- Startseite mit Timeline, Countdown, Jahresarchiv und Galerie;
- detailreiche sowie bewusst reduzierte Veranstaltungsdetailseite;
- Fehleransichten ohne Parameter und mit unbekanntem Slug;
- Navigation und Tastaturfokus;
- kleine, mittlere und große Ansichtsbreiten;
- aktiver und deaktivierter Entwicklungsdaten-Schalter;
- Browserkonsole und geladene lokale Assets.

Die Abschlussprüfung wurde ohne blockierende Befunde durchgeführt. Die konkreten Befehls- und Browserergebnisse sind im Abschlussbericht zu IA-002 festgehalten.

## Risiken und Grenzen

- Das globale Skriptmodell verlangt weiterhin eine korrekte Ladereihenfolge.
- `USE_DEMO_DATA` ist ein Entwicklungsschalter im Quelltext und kein Laufzeit- oder Redaktionssystem.
- Die Metadaten werden clientseitig gesetzt; Suchmaschinen oder Vorschau-Bots ohne JavaScript erhalten nur die statischen Standardwerte.
- Es gibt noch keine zentrale Schemaprüfung beim redaktionellen Erfassen neuer Datensätze.
- Produktive Downloads, Ergebnisse und externe Links müssen vor Veröffentlichung fachlich und rechtlich geprüft werden.

## Reviewentscheidung

Alle drei Arbeitspakete erfüllen den vereinbarten Umfang. IA-002 gilt nach erfolgreicher Integrations- und Abschlussprüfung als abgeschlossen. Inhaltliche Vervollständigungen und spätere Galerie-Erweiterungen sind eigenständige Roadmap-Themen und keine Restarbeiten von IA-002.

## Dokumentationsänderungen

- technische Projektdokumentation auf Architektur, Datenmodell, URL-Konzept, Integration und Testabdeckung von IA-002 aktualisiert;
- Roadmap-Punkte „Verbindliches Veranstaltungsmodell“ und „Veranstaltungsdetail und Chronik“ als technisch umgesetzt eingeordnet;
- veröffentlichungsrelevante Änderungen im Changelog erfasst;
- dieser Implementierungsnachweis im Implementierungsleitfaden verlinkt.
