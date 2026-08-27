# Changelog

Alle veröffentlichungsrelevanten Änderungen an der Website werden in diesem Dokument festgehalten.

Die Struktur orientiert sich an „Keep a Changelog“. Geplante Änderungen und Ideen werden nicht hier, sondern in der Roadmap beziehungsweise im Ideenspeicher geführt.

## [Unveröffentlicht]

### Hinzugefügt

- SEO-Grundmetadaten und Favicon auf Basis des vorhandenen Vereinslogos.
- Sprunglink zum Hauptinhalt, systematische Fokusdarstellung und Unterstützung für reduzierte Bewegung.
- Verständliche Leerzustände für die Bereiche der Veranstaltungschronik.
- Optimierte JPEG-Variante des Hero-Bildes.
- Getrennte, eindeutig markierte Entwicklungs-Testdaten für Archiv- und Galerieprüfungen mit zentralem Schalter.
- Verbindliches Veranstaltungsmodell mit optionalen Bereichen für Beschreibung, Bild, Galerie, Downloads, Ergebnisse und externe Links.
- Zentrale `EventUtils`-Hilfsfunktionen für Detailfähigkeit, Titel, Bild- und Linknormalisierung, Detail-URLs und eindeutige Slug-Auflösung.
- Universelle Veranstaltungsdetailseite unter `event.html?event=<slug>` mit dynamischen Metadaten und zugänglichen Fehlerzuständen.
- Automatisierte Node-Tests für die gemeinsam verwendete Veranstaltungslogik.
- Lokale, eindeutig als Entwicklungsmaterial gekennzeichnete Beispieldateien für Download- und Ergebnisprüfungen.
- Native Galerie-Lightbox mit Bildunterschriften, Tastaturnavigation, mehreren Schließwegen und zuverlässiger Fokus-Rückgabe.
- Kanonisches Veranstaltungsfeld `documents` mit sieben Dokumenttypen und gemeinsamen Normalisierungsfunktionen.
- Kanonische Veranstaltungsdokumente einschließlich Ergebnisdateien und Legacy-Downloads auf Detailseiten sichtbar integriert.
- Eindeutig aus dem vorhandenen Veranstalterwert abgeleitete Herkunftslogos auf Veranstaltungsdetailseiten; unbekannte oder generische Veranstalter bleiben ohne Logo.
- Produktiver Veranstaltungseintrag für den Hans-Peter-Nolding-Pokal 2026 mit Ausschreibung und ergänzendem Veranstaltungsflyer.
- Produktiver Veranstaltungseintrag für den 35. offenen Pokal des Bürgermeisters der Stadt Apolda mit Ausschreibung.
- Produktiver Veranstaltungseintrag für den Kreisschützentag 2026 des Schützenkreises SUED mit Einladung.
- Produktiver Veranstaltungseintrag für den Abend der Vereine 2026 mit Einladung.
- Produktiver Veranstaltungseintrag für den 2. Buttstädter Pokal 2025 mit Ausschreibung.
- Produktiver Veranstaltungseintrag für das Schützenfest Langendorf 2025 mit Einladung.
- Produktiver Veranstaltungseintrag für den Hans-Peter-Nolding-Pokal 2025 mit Ausschreibung.
- Produktiver Veranstaltungseintrag für den 6. Naumburger UTA-Pokal 2025 mit Ausschreibung.
- Produktiver Veranstaltungseintrag für die Kreismeisterschaft KK-Gewehr mit Zielfernrohr 2025 mit Ausschreibung.
- Produktiver Veranstaltungseintrag für das Elchschießen 2025 mit Ausschreibung.
- Produktiver Veranstaltungseintrag für den Pokal Halbautomat 2024 mit Ausschreibung.

### Geändert

- Startseite im Rahmen von IA-001 in Inhalt, Abständen, Karten, Hero, Galerie, Timeline und Footer vereinheitlicht.
- Tote oder nur vorbereitete Links entfernt und vorhandene Startseiteninhalte abschließend formuliert.
- Timeline semantisch gegliedert, stabil sortiert und das Jahresarchiv zugänglicher beschriftet.
- Galerieanimation beruhigt und bei reduzierter Bewegung deaktiviert.
- Galerievorschau so ergänzt, dass vorhandene Eventbilder genutzt werden und ohne solche Daten die statischen Bilder erhalten bleiben.
- Hero-Bilddatei für deutlich geringere Übertragungsgröße optimiert.
- Timeline-Karten, Countdown und ereignisbezogene Galerie-Vorschauen mit den passenden Detailseiten verbunden.
- Leere oder ungültige optionale Detailbereiche werden vollständig ausgeblendet; ein ungültiges oder vor dem Start liegendes Enddatum wird ignoriert.
- Veranstaltungsdaten und Entwicklungsdaten auf dasselbe verbindliche Detaildatenmodell vereinheitlicht, ohne produktive Termine künstlich zu befüllen.
- Inhaltsbereiche der Veranstaltungsdetailseite besucherorientiert geordnet und die sichtbaren Überschriften „Veranstaltungsinformationen“ und „Dokumente“ vereinheitlicht.
- Detailgalerien mit mehr als sechs gültigen Bildern auf eine zugängliche, ein- und ausklappbare Vorschau begrenzt.
- Legacy-Downloads und Ergebnisdateien werden stabil, unverändernd und ohne doppelte URLs in das Dokumentenmodell übernommen.
- Ressourcenbereiche der Veranstaltungsdetailseite in die Reihenfolge Dokumente, Ergebnisse, externe Links und Galerie gebracht.
- Timeline- und Archivstatus auf kanonische Dokumente und ausschließlich externe Ergebnisquellen umgestellt.
- Normalbetrieb auf ausschließlich produktive Veranstaltungsdaten umgestellt; schaltbare Demo-Daten bleiben für Entwicklung und Tests erhalten.

### Behoben

- Doppelte Ankerabstände, mögliche mobile Überläufe und instabile Navigation beim Wechsel der Bildschirmgröße behoben.
- Unnötige Konsolenausgabe entfernt und Footer-Jahr automatisch aktualisiert.

### Entfernt

- Nicht belegte Kontakt-, Rechts-, Geschichts- und Galerieziele von der öffentlich sichtbaren Startseite entfernt.
- Unkontrollierte Testveranstaltungen aus dem produktiven Datenbestand entfernt und durch getrennte, deaktivierbare Entwicklungsdaten ersetzt.

### Sicherheit

- Dynamisch ausgegebene Veranstaltungstexte vor dem Einfügen in HTML maskiert.
- Dynamische Datei- und Webverweise auf freigegebene Protokolle begrenzt.
- Dokumentziele auf relative URLs und absolute HTTPS-URLs begrenzt.
- Mehrdeutige doppelte Slugs führen zu einem eindeutigen Fehlerzustand statt zur zufälligen Auswahl einer Veranstaltung.

### Dokumentation

- Persönliche Projektnotizen vollständig ausgewertet und in die Projektdokumentation eingeordnet.
- Verkaufsargumente und offene Prüfpunkte als eigenständige Dokumente ergänzt.
- Projektphase 0 in der Roadmap als abgeschlossen dokumentiert.
- Technische Projektdokumentation, Roadmap und Implementierungsnachweis auf den vollständigen Stand von IA-002 aktualisiert.
- Technische Projektdokumentation um Reihenfolge, Galerieverhalten und Prüfmatrix von AP 2 ergänzt.
- Technische Projektdokumentation, Roadmap und Prüfpunkte auf den Abschluss der Galerie-Lightbox in AP 3 aktualisiert.
- Technische Projektdokumentation und Roadmap um Datenvertrag und Kompatibilitätsregeln von AP 4 ergänzt.

---

## Vorlage für eine Veröffentlichung

<!--
## [X.Y.Z] – JJJJ-MM-TT

### Hinzugefügt

- Beispiel

### Geändert

- Beispiel

### Behoben

- Beispiel

### Entfernt

- Beispiel

### Sicherheit

- Beispiel

### Dokumentation

- Beispiel
-->

## Pflegehinweise

- Änderungen werden zunächst unter „Unveröffentlicht“ gesammelt.
- Nur tatsächlich umgesetzte und geprüfte Änderungen werden eingetragen.
- Einträge beschreiben das Ergebnis verständlich und nicht nur bearbeitete Dateinamen.
- Nicht benötigte Kategorien dürfen bei einer Veröffentlichung entfallen.
- Beim Release werden die Einträge unter eine Versionsnummer mit Datum verschoben.
- Reine Planungen, offene Aufgaben und Ideen gehören nicht in das Changelog.
