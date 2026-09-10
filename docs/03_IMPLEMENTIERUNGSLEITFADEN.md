# Implementierungsleitfaden

## Zweck

Dieser Leitfaden beschreibt den verbindlichen Ablauf zukünftiger Änderungen. Er soll sicherstellen, dass neue Funktionen nachvollziehbar geplant, in kontrollierbaren Abschnitten umgesetzt und gemeinsam geprüft werden.

Die fachliche Ausrichtung ergibt sich aus der [Projektvision](00_PROJEKTVISION.md), die verbindlichen Qualitätsprinzipien aus den [Entwicklungsgrundsätzen](01_ENTWICKLUNGSGRUNDSÄTZE.md).

## 1. Änderung aufnehmen

Jede Änderung beginnt mit einer klaren Aufgabenbeschreibung:

- Ausgangssituation;
- Problem oder Bedarf;
- betroffene Zielgruppe;
- gewünschtes Ergebnis;
- ausdrücklich nicht enthaltene Themen;
- bekannte Abhängigkeiten oder Einschränkungen.

Ungeprüfte Ideen werden zunächst im Ideenspeicher erfasst. Sie werden erst durch eine bewusste Entscheidung zu einem Roadmap- oder Implementierungsthema.

## 2. Voranalyse durchführen

Vor jeder größeren Änderung wird der Ist-Zustand untersucht. Dabei sind mindestens zu klären:

- Welche vorhandenen Daten, Komponenten und Funktionen sind betroffen?
- Welche Abhängigkeiten bestehen?
- Welche bestehenden Verhaltensweisen müssen erhalten bleiben?
- Gibt es bereits einen wiederverwendbaren Lösungsbaustein?
- Entsteht doppelte Daten- oder Inhaltspflege?
- Welche Risiken bestehen für Mobilansicht, Zugänglichkeit, Leistung, Datenschutz oder Sicherheit?
- Welche Dokumente müssen später aktualisiert werden?
- Berührt das Paket Inhalte, Funktionen oder Strukturen der bisherigen Website,
  und ergibt sich daraus ein wesentlicher Befund für die
  [Altseitenanalyse](08_ALTSEITENANALYSE.md)?

Die Analyse verändert noch keinen produktiven Quellcode.

## 3. Implementierungsplan erstellen

Eine größere Änderung wird in überschaubare Implementierungsabschnitte zerlegt. Jeder Abschnitt soll für sich prüfbar sein und einen klaren Zustand herstellen.

Ein Implementierungsabschnitt enthält:

1. **Ziel:** Was ist nach diesem Abschnitt möglich?
2. **Umfang:** Welche Komponenten, Daten oder Inhalte sind betroffen?
3. **Nicht-Ziele:** Was wird bewusst nicht umgesetzt?
4. **Vorgehen:** Welche konzeptionellen Schritte sind vorgesehen?
5. **Abhängigkeiten:** Was muss vorher vorliegen oder entschieden sein?
6. **Risiken:** Welche Nebenwirkungen sind möglich?
7. **Abnahmekriterien:** Woran wird die erfolgreiche Umsetzung erkannt?
8. **Prüfplan:** Welche manuellen und automatisierten Kontrollen erfolgen?
9. **Dokumentation:** Welche Projektunterlagen werden aktualisiert?

Der Plan wird vor Beginn abgestimmt, wenn er Architektur, Datenmodell, Nutzerführung, externe Dienste oder mehrere bestehende Funktionen wesentlich betrifft.

## 4. Abschnitt kontrolliert umsetzen

Während der Implementierung gelten folgende Regeln:

- nur den vereinbarten Abschnitt bearbeiten;
- bestehendes Verhalten nicht ungefragt verändern;
- vorhandene Komponenten und Datenquellen bevorzugen;
- Daten, Logik und Darstellung getrennt halten;
- keine unabhängigen Nebenarbeiten in denselben Abschnitt aufnehmen;
- Unsicherheiten und notwendige Abweichungen früh sichtbar machen;
- temporäre Lösungen ausdrücklich kennzeichnen und mit einem Folgeschritt versehen.
- öffentliche Seiteninhalte gemäß den Entwicklungsgrundsätzen für den
  vorgesehenen Veröffentlichungszustand formulieren und interne Arbeitsvermerke
  ausschließlich in der Projektdokumentation führen.

Wenn sich während der Umsetzung eine wesentliche neue Anforderung ergibt, wird der Plan angepasst, bevor der Umfang erweitert wird.

## 5. Selbstprüfung durchführen

Vor der gemeinsamen Qualitätskontrolle prüft der Entwickler den Abschnitt gegen die vereinbarten Abnahmekriterien.

Je nach Änderung gehören dazu:

- Hauptfunktion und relevante Randfälle;
- Verhalten bei leeren, fehlenden oder ungültigen Daten;
- bestehende angrenzende Funktionen;
- Links und Navigation;
- kleine und große Bildschirmgrößen;
- Tastaturbedienung und Fokus;
- verständliche Texte, Beschriftungen und Fehlermeldungen;
- Leistung und Mediengrößen;
- Browserkonsole und technische Prüfungen;
- Datenschutz- und Sicherheitsfolgen;
- Aktualität der Dokumentation.
- bei Altseitenbezug die dokumentierte Entscheidung, ob die Altseitenanalyse
  ergänzt oder mangels relevanten Befunds unverändert bleibt.

Prüfergebnisse und bekannte Einschränkungen werden nachvollziehbar festgehalten.

## 6. Gemeinsame Qualitätskontrolle

Nach jedem Implementierungsabschnitt erfolgt eine gemeinsame Prüfung mit dem Projektverantwortlichen. Grundlage sind Ziel, Abnahmekriterien und dokumentierte Prüfergebnisse.

Die Qualitätskontrolle bewertet:

- fachliche Richtigkeit;
- Vollständigkeit des vereinbarten Umfangs;
- Bedienbarkeit und visuelle Stimmigkeit;
- Erhalt bestehender Funktionen;
- Wartbarkeit und Übereinstimmung mit den Entwicklungsgrundsätzen;
- offene Fehler, Risiken oder Folgeentscheidungen.

Mögliche Ergebnisse:

- **freigegeben:** alle wesentlichen Kriterien sind erfüllt;
- **freigegeben mit dokumentierten Folgepunkten:** der Abschnitt ist nutzbar, klar begrenzte Verbesserungen werden separat erfasst;
- **Überarbeitung erforderlich:** Kriterien sind nicht erfüllt; der Abschnitt bleibt in Arbeit.

## 7. Review und Abschluss

Ein Implementierungsabschnitt gilt erst als abgeschlossen, wenn:

- die vereinbarten Abnahmekriterien erfüllt sind;
- die Qualitätskontrolle erfolgreich war;
- gefundene Blocker behoben wurden;
- relevante Dokumentation aktualisiert ist;
- Roadmap und Changelog den neuen Stand wiedergeben;
- keine unbeabsichtigten Änderungen im Arbeitsumfang enthalten sind.

Erst danach darf der Roadmap-Status auf „Bereits umgesetzt“ geändert werden.

## Größenklassen für Änderungen

### Kleine Änderung

Beispiel: Textkorrektur oder Austausch eines einzelnen Bildes ohne strukturelle Auswirkung.

Erforderlich sind mindestens Umfangsprüfung, Selbstprüfung und Changelog-Eintrag, sofern die Änderung veröffentlichungsrelevant ist.

### Mittlere Änderung

Beispiel: Erweiterung einer bestehenden Komponente oder eines vorhandenen Datenfeldes.

Erforderlich sind kurze Analyse, dokumentierte Abnahmekriterien, Umsetzung, Qualitätskontrolle und Aktualisierung betroffener Dokumente.

### Große Änderung

Beispiel: neues Datenmodell, Veranstaltungsdetailseite, Mitgliederbereich, externe Integration oder grundlegender Architekturumbau.

Erforderlich sind vollständige Analyse, abgestimmter Implementierungsplan, mehrere kontrollierbare Abschnitte, Review nach jedem Abschnitt und eine dokumentierte Abschlussentscheidung.

## Empfehlungen zur Änderungsdokumentation

### Implementierungsnotiz

Für mittlere und große Änderungen empfiehlt sich vor Beginn eine eigene Notiz innerhalb von `/docs`, beispielsweise:

```text
docs/implementierung/
└── YYYY-MM-DD_KURZER-TITEL.md
```

Empfohlene Struktur:

```markdown
# Titel

## Ausgangslage
## Ziel
## Umfang
## Nicht-Ziele
## Betroffene Bereiche
## Vorgehen
## Risiken
## Abnahmekriterien
## Prüfprotokoll
## Reviewentscheidung
## Dokumentationsänderungen
```

Eine solche Notiz dokumentiert die konkrete Umsetzung. Dauerhafte Regeln gehören weiterhin in die Leitdokumente.

### Technische Dokumentation

Sie wird aktualisiert, wenn sich Architektur, Dateien, Datenmodelle, Abhängigkeiten, Rendering oder technischer Projektstand ändern.

### Roadmap

Sie wird aktualisiert, wenn Arbeit beginnt, abgeschlossen wird, entfällt oder neu priorisiert wird.

### Changelog

Es enthält veröffentlichungsrelevante abgeschlossene Änderungen aus Sicht des Projekts. Planungen und bloße Ideen gehören nicht hinein.

### Ideenspeicher

Er nimmt ungeprüfte Vorschläge auf. Ein Eintrag ist weder Zusage noch Priorisierung.

## Abgeschlossene Implementierungsnachweise

Konkrete Nachweise zu größeren Änderungen werden getrennt von diesem dauerhaften Leitfaden geführt:

- [IA-002 – Veranstaltungsdetailseiten](implementierung/2026-07-24_IA-002_VERANSTALTUNGSDETAILSEITEN.md)

## Review-Checkliste

- Entspricht das Ergebnis der Projektvision?
- Wurde der vereinbarte Umfang eingehalten?
- Sind Informationen weiterhin nur einmal zu pflegen?
- Wurden vorhandene Bausteine sinnvoll wiederverwendet?
- Sind Daten, Logik und Darstellung klar getrennt?
- Bleibt bestehendes Verhalten erhalten?
- Ist die Änderung mobil, zugänglich und verständlich?
- Sind Datenschutz, Sicherheit und Leistung angemessen berücksichtigt?
- Sind technische Dokumentation, Roadmap und Changelog aktuell?
- Sind Folgepunkte klar erfasst und vom Abschluss getrennt?
- Wurde bei einem Migrations- oder Modernisierungspaket mit Altseitenbezug die
  verbindliche Altseitenanalyse geprüft und gegebenenfalls fortgeschrieben?
