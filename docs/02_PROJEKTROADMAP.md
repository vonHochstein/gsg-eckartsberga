# Projektroadmap

## Zweck und Pflege

Diese Roadmap beschreibt den fachlichen Entwicklungsweg auf Grundlage des Projektstands vom 31. August 2026. Sie ist ein lebendes Planungsdokument und wird nach jedem abgeschlossenen Implementierungsabschnitt aktualisiert.

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
- Vereinsübersicht, Geschichtsteaser und eigenständige chronologische Geschichtsseite;
- eigenständige Vorstands- und Ansprechpartnerseite mit bestätigten Funktionen und Namen;
- eigenständige Erfolgsseite mit den zehn von der bisherigen Vereinswebsite überlieferten Schützenkönig-Einträgen und gemeinsamer Lightbox;
- eigenständige Seite für Schießbahnen und Vereinshaus mit bestätigten Nutzungsangaben und vier freigegebenen Anlagenaufnahmen;
- eigenständige Gästebuchseite mit zentralem Veröffentlichungsmodell, verständlichem Leerzustand und datengetriebenem Startseiten-Teaser;
- redaktionell gefasste Vereinschronik mit öffentlich verständlichem Quellenbereich;
- abgeschlossene Startseitenbereiche für Veranstaltungen, Galerie und Mitgliedschaft;
- konsistenter Footer mit zentraler Logozeile, nachgeordneter Sekundärnavigation und gemeinsamer Vereins-/Leitsatzzeile;
- IA-001: Startseite technisch, gestalterisch und inhaltlich stabilisiert.

### Navigation und Interaktion

- feststehender Header;
- mobile Navigation;
- Schließen des Menüs per Linkauswahl, Außenklick und Escape;
- kompakter Header beim Scrollen;
- automatisch wechselnde Galerievorschau;
- native Galerie-Lightbox mit Tastatursteuerung, Fokusführung und responsiver Darstellung;
- technische Grundlage für zentrale Veranstaltungsorte und eine erst nach bewusstem Klick geladene, responsive OpenStreetMap-Karte;
- sichtbare Fokuszustände und Sprunglink zum Hauptinhalt;
- Unterstützung reduzierter Bewegung;
- zugängliche Steuerung der Startseiten-Stimmen mit Pause, manueller Navigation und vollständig deaktiviertem Autoplay bei reduzierter Bewegung;
- responsive Qualitätsprüfung vom kleinen Smartphone bis zum großen Bildschirm.

### Veranstaltungen

- zentrale Veranstaltungsdatenquelle;
- verbindliches, erweiterbares Veranstaltungsmodell mit Kernangaben und optionalen Detailbereichen;
- kanonisches, typisiertes Dokumentenmodell mit sicherer URL-Prüfung und rückwärtskompatibler Übernahme von Downloads und Ergebnisdateien;
- gemeinsame Hilfsfunktionen in `EventUtils` für Detailfähigkeit, Titel, Bilder, strukturierte Linklisten und Detail-URLs;
- Anzeige des nächsten Termins;
- Countdown bis zur nächsten Veranstaltung;
- dynamische Veranstaltungschronik;
- zeitliche Trennung in kommende, aktuelle und archivierte Einträge;
- Gruppierung nach Monaten;
- interaktives, semantisch beschriftetes Jahresarchiv;
- verständliche Leerzustände und stabile Sortierung;
- unkontrollierte Testveranstaltungen aus dem produktiven Datenbestand entfernt;
- getrennte, schaltbare Entwicklungs-Testdaten für Archiv, Galerie und sämtliche optionalen Detailbereiche ergänzt;
- IA-002: universelle Veranstaltungsdetailseite unter `event.html?event=<slug>` umgesetzt;
- leere Detailbereiche, fehlerhafte Enddaten und nicht verwendbare Verweise werden kontrolliert ausgeblendet;
- eindeutige Fehlerzustände für fehlende Parameter, unbekannte Slugs, unvollständige Kerndaten und doppelte Slugs;
- Timeline, Countdown und Galerie-Teaser ausschließlich über `EventUtils.createDetailUrl()` mit den Detailseiten verbunden;
- automatisierte Tests für Datenmodell, URL-Prüfung, Normalisierung und Slug-Auflösung eingeführt.

### Dokumentation

- vollständige technische Projektanalyse;
- Projektvision und verbindliche Entwicklungsgrundsätze;
- Projektroadmap und Implementierungsleitfaden;
- Changelog-Grundstruktur und zentraler Ideenspeicher;
- persönliche Projektnotizen vollständig ausgewertet und thematisch zugeordnet;
- Verkaufsargumente und offene Prüfpunkte getrennt dokumentiert;
- IA-002 mit technischem Stand, Architekturentscheidungen, Integrationen und Prüfprotokoll dokumentiert;
- Projektphase 0 „Projektvorbereitung“ abgeschlossen.

## In Arbeit

Derzeit befindet sich kein Implementierungsabschnitt in Arbeit. Der nächste Abschnitt beginnt erst nach eigener Analyse, Planung und Beauftragung.

Offene Entscheidungen vor oder während der nächsten Abschnitte werden in [07_OFFENE_PRUEFPUNKTE.md](07_OFFENE_PRUEFPUNKTE.md) geführt.

## Geplant

Die Reihenfolge bildet fachliche Abhängigkeiten ab. Ein Abschnitt wird vor Beginn konkret geplant und mit Abnahmekriterien versehen.

Die zuvor geplanten Abschnitte „Verbindliches Veranstaltungsmodell“ und „Veranstaltungsdetail und Chronik“ wurden mit IA-002 technisch abgeschlossen und in „Bereits umgesetzt“ überführt. Noch fehlende echte Vereinsinhalte bleiben Teil der redaktionellen Vervollständigung.

### Abschnitt 1: Inhalte und Navigation vervollständigen

- endgültige Informationsarchitektur abstimmen;
- benötigte Inhalte und redaktionelle Verantwortlichkeiten klären;
- reale Inhalte, Testdaten und Platzhalter eindeutig voneinander abgrenzen;
- endgültige Seiten- und Bereichsstruktur festlegen;
- weitere Vereins-, Sport-, besondere Erfolgs-, Mitgliedschafts- und Kontaktinhalte einpflegen;
- veröffentlichungsfähige Altbestände des Gästebuchs einzeln prüfen und freigegebene Einträge übernehmen;
- freigegebene direkte Kontaktwege ergänzen.

### Abschnitt 2: Rechtliche Veröffentlichungsgrundlage

- fachlich geprüfte Inhalte für Impressum und Datenschutz bereitstellen;
- externe Dienste und Einwilligungserfordernisse bewerten;
- rechtssichere Karten- beziehungsweise Anfahrtslösung festlegen;
- OSM-Tile-Nutzung, Datenschutzhinweise und Bannerverzicht vor der ersten produktiven Ortsmigration fachlich bestätigen;
- Veröffentlichungsvoraussetzungen dokumentieren.

### Abschnitt 5: Galerie und Medien

- zentrale Medien- und Metadatenstruktur festlegen;
- Galerie aus gepflegten Daten erzeugen;
- weitere Bildformate und Dateigrößen optimieren;
- responsive Bildvarianten und sinnvolle Alternativtexte etablieren;
- Medienflächen der Schützenkönig-Karten sowie die individuellen Fokuspositionen ihrer zehn Motive in der Startseitengalerie gestalterisch überarbeiten.

### Abschnitt 6: Zugänglichkeit und Oberflächenqualität

- Zugänglichkeit mit spezialisierten Prüfwerkzeugen vertiefend kontrollieren;
- Kontraste und Textskalierung formal prüfen;
- neu hinzukommende Komponenten mit Tastatur und unterstützenden Technologien prüfen;
- Kopfbereiche von Erfolgs- und Vorstandsseite anhand der Geschichtsseite vereinheitlichen;

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
- moderiertes Gästebuchformular nach Datenschutz- und Anbieterprüfung;
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

Die technische Grundlage wurde mit IA-002 abgeschlossen: Termine, Details, strukturierte Verweise, Galerien und Archiv arbeiten aus dem verbindlichen Veranstaltungsmodell. Der Meilenstein bleibt bis zur redaktionellen Befüllung und Freigabe der realen Veranstaltungsinhalte offen.

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
