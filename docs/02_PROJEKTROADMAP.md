# Projektroadmap

## Zweck und Pflege

Diese Roadmap beschreibt den fachlichen Entwicklungsweg auf Grundlage des Projektstands vom 24. Juli 2026. Sie ist ein lebendes Planungsdokument und wird nach jedem abgeschlossenen Implementierungsabschnitt aktualisiert.

Die Statusangaben bedeuten:

- **Bereits umgesetzt:** im aktuellen Projektbestand vorhanden und grundsätzlich funktionsfähig;
- **In Arbeit:** aktuell in Klärung, Dokumentation oder Umsetzung;
- **Geplant:** als nächster sinnvoller Ausbau vorgesehen, aber noch nicht begonnen;
- **Spätere Erweiterungen:** mögliche Zukunftsthemen ohne aktuelle Zusage oder Terminierung.

Die Aufnahme in diese Roadmap ersetzt weder einen Implementierungsplan noch ein Review. Technische Details stehen in der [technischen Projektdokumentation](TECHNISCHE_PROJEKTDOKUMENTATION.md).

## Bereits umgesetzt

### Visuelle und strukturelle Grundlage

- responsive Single-Page-Grundstruktur;
- eigenständige visuelle Identität mit dunklen Flächen, Gold- und Rottönen;
- Hero-Bereich mit klaren Handlungsoptionen;
- Informationskarten für Veranstaltung, Sport und Mitgliedschaft;
- Vereinsübersicht und Geschichtsteaser;
- Bereiche für Veranstaltungen, Galerie, Mitgliedschaft und Kontakt;
- Footer-Grundstruktur.

### Navigation und Interaktion

- feststehender Header;
- mobile Navigation;
- Schließen des Menüs per Linkauswahl, Außenklick und Escape;
- kompakter Header beim Scrollen;
- automatisch wechselnde Galerievorschau.

### Veranstaltungen

- zentrale Veranstaltungsdatenquelle;
- Anzeige des nächsten Termins;
- Countdown bis zur nächsten Veranstaltung;
- dynamische Veranstaltungschronik;
- zeitliche Trennung in kommende, aktuelle und archivierte Einträge;
- Gruppierung nach Monaten;
- interaktives Jahresarchiv.

### Dokumentation

- vollständige technische Projektanalyse;
- Projektvision und verbindliche Entwicklungsgrundsätze;
- Projektroadmap und Implementierungsleitfaden;
- Changelog-Grundstruktur und zentraler Ideenspeicher;
- persönliche Projektnotizen vollständig ausgewertet und thematisch zugeordnet;
- Verkaufsargumente und offene Prüfpunkte getrennt dokumentiert;
- Projektphase 0 „Projektvorbereitung“ abgeschlossen.

## In Arbeit

Derzeit befindet sich kein Implementierungsabschnitt in Arbeit. Der nächste Abschnitt beginnt erst nach eigener Analyse, Planung und Beauftragung.

Offene Entscheidungen vor oder während der nächsten Abschnitte werden in [07_OFFENE_PRUEFPUNKTE.md](07_OFFENE_PRUEFPUNKTE.md) geführt.

## Geplant

Die Reihenfolge bildet fachliche Abhängigkeiten ab. Ein Abschnitt wird vor Beginn konkret geplant und mit Abnahmekriterien versehen.

### Abschnitt 1: Inhalte und Navigation vervollständigen

- endgültige Informationsarchitektur abstimmen;
- benötigte Inhalte und redaktionelle Verantwortlichkeiten klären;
- reale Inhalte, Testdaten und Platzhalter eindeutig voneinander abgrenzen;
- endgültige Seiten- und Bereichsstruktur festlegen;
- Vereins-, Sport-, Anlagen-, Erfolgs-, Mitgliedschafts- und Kontaktinhalte einpflegen;
- Vereinsgeschichte zugänglich machen;
- alle Platzhalter- und Sprunglinks durch echte Ziele ersetzen;
- verständliche Navigation für mobile und große Ansichten sicherstellen.

### Abschnitt 2: Rechtliche Veröffentlichungsgrundlage

- fachlich geprüfte Inhalte für Impressum und Datenschutz bereitstellen;
- externe Dienste und Einwilligungserfordernisse bewerten;
- rechtssichere Karten- beziehungsweise Anfahrtslösung festlegen;
- Veröffentlichungsvoraussetzungen dokumentieren.

### Abschnitt 3: Verbindliches Veranstaltungsmodell

- Pflichtfelder und optionale Felder definieren;
- Datenstrukturen für Downloads, Ergebnisse, Galerien und Links festlegen;
- Datums- und Zeitzonenregeln dokumentieren;
- Validierung und sinnvolle Leerzustände vorsehen;
- Testdaten aus dem späteren Produktivbestand entfernen oder getrennt verwalten.

### Abschnitt 4: Veranstaltungsdetail und Chronik

- aufrufbare Detailansicht je Veranstaltung umsetzen;
- Ausschreibungen und Downloads tatsächlich verlinken;
- Ergebnisse verständlich bereitstellen;
- eventbezogene Galerien anbinden;
- laufende, kommende und vergangene Veranstaltungen konsistent behandeln;
- Fallbacks für fehlende Daten und deaktiviertes JavaScript prüfen.

### Abschnitt 5: Galerie und Medien

- zentrale Medien- und Metadatenstruktur festlegen;
- Galerie aus gepflegten Daten erzeugen;
- Lightbox mit Tastaturbedienung umsetzen;
- Bildformate und Dateigrößen optimieren;
- responsive Bildvarianten und sinnvolle Alternativtexte etablieren.

### Abschnitt 6: Zugänglichkeit und Oberflächenqualität

- sichtbare Fokuszustände vervollständigen;
- Kontraste prüfen;
- reduzierte Bewegung unterstützen;
- Komponenten mit Tastatur und unterstützenden Technologien prüfen;
- mobile Darstellungen systematisch testen;
- tote, irreführende oder nicht bedienbare Interaktionen beseitigen.

### Abschnitt 7: Technische Stabilisierung

- klare Modulgrenzen und einen tatsächlichen Einstiegspunkt schaffen;
- Datums- und Formatierungslogik zentralisieren;
- Darstellungskomponenten kontrolliert modularisieren;
- automatisierte Prüfungen und Tests einführen;
- technische Dokumentation an den neuen Stand anpassen.

### Abschnitt 8: Veröffentlichung und Betrieb

- Hosting- und Deploymentweg festlegen;
- Domains, HTTPS, Caching und Fehlerseiten prüfen;
- Favicon, Suchmaschinenmetadaten und Social-Media-Vorschauen ergänzen;
- Datensicherung und redaktionellen Pflegeprozess definieren;
- abschließenden Funktions-, Inhalts- und Veröffentlichungsreview durchführen.

## Spätere Erweiterungen

Die folgenden Punkte sind mögliche Ausbaustufen. Sie sind nicht priorisiert und werden erst nach einer eigenen Nutzen-, Datenschutz- und Aufwandsbewertung in „Geplant“ übernommen:

- Website-Suche;
- Dunkelmodus;
- Gästebuch;
- Kontaktformular;
- datenschutzgerechte Besucherstatistik;
- geschützter Mitgliederbereich;
- öffentlicher Dokument- und Satzungsbereich;
- Sponsorenübersicht;
- Übersicht befreundeter Vereine;
- optische Überarbeitung des Logos;
- weitergehende redaktionelle Oberfläche oder CMS;
- Benachrichtigungs- oder Kalenderabonnement-Funktionen.

Weitere ungeprüfte Vorschläge werden ausschließlich im [Ideenspeicher](05_IDEENSPEICHER.md) gesammelt.

Wirtschaftliche und servicebezogene Aussagen werden vor ihrer Verwendung anhand der [Verkaufsargumente](06_VERKAUFSARGUMENTE.md) und der [offenen Prüfpunkte](07_OFFENE_PRUEFPUNKTE.md) freigegeben.

## Meilensteine

### M0 – Projektvorbereitung

**Abgeschlossen am 24. Juli 2026.** Technischer Ist-Zustand, Projektvision, Entwicklungsregeln, Roadmap, Implementierungsprozess, Changelog, Ideenspeicher, Verkaufsargumente und offene Prüfpunkte sind dokumentiert. Die persönlichen Projektnotizen sind vollständig zugeordnet.

### M1 – Veröffentlichungsfähige Informationswebsite

Erreicht, wenn Inhalte, Navigation, Kontakt, Rechtstexte und mobile Nutzung vollständig geprüft sind und keine Platzhalterziele mehr bestehen.

### M2 – Vollständige Veranstaltungsplattform

Erreicht, wenn Termine, Details, Downloads, Ergebnisse, Galerien und Archiv aus dem verbindlichen Veranstaltungsmodell funktionieren.

### M3 – Qualitätsgesicherter Regelbetrieb

Erreicht, wenn Zugänglichkeit, Leistung, Tests, Deployment und redaktionelle Pflege verlässlich dokumentiert und geprüft sind.

### M4 – Bedarfsgerechter Ausbau

Erreicht fortlaufend durch einzeln bewertete Erweiterungen, ohne die Einfachheit und Wartbarkeit des Kerns zu gefährden.

## Regeln für Statusänderungen

- Ein Punkt wird nur mit benannter Verantwortung und vereinbartem Implementierungsabschnitt auf „In Arbeit“ gesetzt.
- „Geplant“ bedeutet fachlich vorgesehen, aber noch nicht begonnen.
- „Bereits umgesetzt“ setzt Implementierung, Qualitätskontrolle, Review und aktualisierte Dokumentation voraus.
- Nicht priorisierte Vorschläge bleiben im Ideenspeicher.
- Entfällt ein Punkt, wird die Entscheidung im Changelog dokumentiert.
