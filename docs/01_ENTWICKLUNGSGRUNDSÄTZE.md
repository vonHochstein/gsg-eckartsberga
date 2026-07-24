# Entwicklungsgrundsätze

## Geltungsbereich

Diese Grundsätze sind die verbindliche Arbeitsgrundlage für alle zukünftigen Änderungen an der Website. Sie gelten für Konzeption, Datenpflege, Implementierung, Gestaltung, Prüfung und Dokumentation.

Der technische Ist-Zustand und konkrete Dateiabhängigkeiten werden ausschließlich in der [technischen Projektdokumentation](TECHNISCHE_PROJEKTDOKUMENTATION.md) beschrieben.

## 1. Nutzerwert vor Funktionsumfang

Jede Änderung muss einen nachvollziehbaren Nutzen für Besucher, Redaktion oder Betrieb besitzen. Neue Funktionen werden nicht allein deshalb aufgenommen, weil sie technisch möglich sind.

Vor der Umsetzung ist zu klären:

- welches Problem gelöst wird;
- für welche Zielgruppe die Änderung bestimmt ist;
- welches erwartete Verhalten als erfolgreich gilt.

## 2. Datengetrieben arbeiten

Wiederkehrende oder strukturierte Inhalte sollen als Daten modelliert und aus einer zentralen Quelle ausgegeben werden. Das betrifft insbesondere Veranstaltungen, Downloads, Ergebnisse, Galerien und später gegebenenfalls Ansprechpartner, Sponsoren oder Dokumente.

Darstellungscode darf fachliche Inhalte nicht unnötig vervielfältigen. Neue Datenstrukturen benötigen vor ihrer Nutzung ein verständliches Schema mit Pflichtfeldern, optionalen Feldern und einer beschriebenen Bedeutung.

## 3. Informationen nur einmal pflegen

Für jede fachliche Information soll es genau eine maßgebliche Quelle geben. Weitere Ansichten leiten ihre Ausgabe daraus ab.

Beispiele:

- Ein Veranstaltungstermin versorgt Kalender, Countdown und Archiv.
- Ein Galeriebild wird einem Ereignis zugeordnet und kann daraus in mehreren Ansichten erscheinen.
- Ein Dokument erhält eine zentrale Bezeichnung und Verknüpfung, statt mehrfach separat eingetragen zu werden.

Wenn doppelte Pflege unvermeidbar erscheint, ist vor der Umsetzung zu prüfen, ob das Datenmodell oder die Komponentenstruktur verbessert werden kann.

## 4. Redundanz bewusst vermeiden

Quellcode, Inhalte und Gestaltungsregeln dürfen nicht ohne fachlichen Grund dupliziert werden. Ähnliche Lösungen werden zusammengeführt, wenn sie tatsächlich dasselbe Verhalten abbilden.

Abstraktion ist jedoch kein Selbstzweck. Ein gemeinsamer Baustein wird nur geschaffen, wenn:

- die Gemeinsamkeit stabil und fachlich nachvollziehbar ist;
- mindestens mehrere reale Verwendungen bestehen oder unmittelbar geplant sind;
- die Abstraktion einfacher zu verstehen ist als die Duplikation.

## 5. Vorhandene Komponenten wiederverwenden

Vor der Entwicklung eines neuen Bausteins wird geprüft, ob vorhandene Komponenten, Muster oder Designregeln erweitert werden können.

Wiederverwendung setzt voraus, dass:

- die bestehende Bedeutung erhalten bleibt;
- keine schwer verständlichen Sonderfälle entstehen;
- bestehende Verwendungen nicht unbeabsichtigt verändert werden.

Varianten sollen über klar benannte Zustände oder Eigenschaften entstehen, nicht über Kopien mit geringfügigen Abweichungen.

## 6. Daten, Logik und Darstellung trennen

Die Verantwortlichkeiten sind klar zu halten:

- **Daten** beschreiben fachliche Inhalte.
- **Logik** verarbeitet Daten und steuert Verhalten.
- **Darstellung** bestimmt Struktur, visuelle Ausgabe und Interaktion.

Eine Ebene soll nicht unnötig Wissen über interne Details einer anderen Ebene besitzen. Diese Trennung erleichtert Tests, spätere Umstellungen und redaktionelle Pflege.

## 7. Wartbarkeit vor kurzfristiger Geschwindigkeit

Eine schnelle Lösung ist nur dann gut, wenn sie auch nach Monaten noch verständlich und sicher änderbar ist.

Deshalb gilt:

- klare Namen statt Abkürzungen ohne Kontext;
- kleine, eindeutig verantwortliche Einheiten;
- nachvollziehbarer Kontrollfluss;
- dokumentierte fachliche Entscheidungen;
- keine versteckten Abhängigkeiten;
- keine provisorischen Lösungen ohne gekennzeichneten Folgeschritt.

Technische Schulden dürfen bewusst eingegangen werden, müssen dann aber im Changelog, in der Roadmap oder in einem Implementierungsplan sichtbar gemacht werden.

## 8. Bestehende Architektur erhalten und sinnvoll erweitern

Funktionierende Strukturen werden nicht ohne konkreten Nutzen ersetzt. Änderungen sollen sich zunächst in die bestehende Architektur einfügen.

Ein größerer Umbau ist nur gerechtfertigt, wenn:

- ein belegtes Problem nicht angemessen innerhalb der bestehenden Struktur lösbar ist;
- Nutzen, Umfang und Risiken vorab beschrieben sind;
- eine schrittweise Migration möglich ist;
- das bestehende Verhalten durch Prüfung abgesichert wird.

Technische Modernisierung erfolgt zielgerichtet und nicht als pauschaler Technologiewechsel.

## 9. Bestehendes Verhalten schützen

Eine Änderung darf vorhandene Funktionen nicht stillschweigend verändern. Beabsichtigte Verhaltensänderungen müssen Teil des Auftrags und des Reviews sein.

Vor Abschluss sind mindestens zu prüfen:

- betroffene bestehende Funktionen;
- Navigation und Verlinkungen;
- mobile und große Ansichten;
- Tastaturbedienung und sichtbare Zustände;
- Datenfälle mit fehlenden oder leeren optionalen Werten;
- Fehlersituationen und sinnvolle Fallbacks.

## 10. Barrierefreiheit ist Grundanforderung

Zugänglichkeit wird nicht als spätere Zusatzfunktion behandelt. Neue Komponenten müssen von Beginn an semantisch, per Tastatur bedienbar und verständlich beschriftet sein.

Insbesondere gelten:

- semantische HTML-Elemente bevorzugen;
- sichtbare Fokuszustände bereitstellen;
- ausreichende Kontraste sicherstellen;
- Alternativtexte redaktionell sinnvoll pflegen;
- Bewegung reduzierbar gestalten;
- Statusänderungen verständlich vermitteln.

## 11. Responsive Gestaltung ist Standard

Jede neue Funktion wird für kleine und große Ansichten geplant. Mobile Nutzung ist kein verkleinerter Sonderfall, sondern ein gleichwertiger Nutzungskontext.

Layout, Inhaltshierarchie, Interaktionsflächen und Medien müssen auf unterschiedlichen Bildschirmgrößen geprüft werden.

## 12. Leistung und Einfachheit bewahren

Abhängigkeiten, Bibliotheken und Dienste werden nur aufgenommen, wenn ihr Nutzen ihren dauerhaften Wartungs- und Datenschutzaufwand rechtfertigt.

Bevor eine externe Lösung eingeführt wird, sind zu bewerten:

- Funktionsnutzen;
- Ladezeit und Ausfallsicherheit;
- Datenschutz und Einwilligungserfordernisse;
- Kosten und Anbieterbindung;
- Wartung und Austauschbarkeit.

Medien werden in angemessenen Formaten, Größen und Auflösungen bereitgestellt.

## 13. Datenschutz und Recht von Anfang an berücksichtigen

Externe Dienste, Formulare, Karten, Besucherstatistiken, eingebettete Inhalte und geschützte Bereiche dürfen erst nach Prüfung der rechtlichen und organisatorischen Folgen eingebunden werden.

Rechtstexte werden nicht durch technische Annahmen ersetzt. Vor Veröffentlichung müssen Impressum und Datenschutz fachlich geprüft sein.

## 14. Sicherheit der Datenverarbeitung

Redaktionelle oder externe Daten gelten nicht automatisch als vertrauenswürdig. Inhalte werden validiert und sicher ausgegeben. Zugangsdaten, private Informationen oder interne Dokumente dürfen nicht ungeschützt in öffentlich ausgelieferten Dateien liegen.

Ein Mitgliederbereich erfordert ein echtes Berechtigungs- und Schutzkonzept; eine lediglich versteckte URL ist kein Zugriffsschutz.

## 15. Dokumentation gehört zur Änderung

Eine Änderung ist erst vollständig, wenn die betroffene Dokumentation aktualisiert wurde.

Je nach Änderung sind anzupassen:

- technische Architektur und Datenmodelle in `TECHNISCHE_PROJEKTDOKUMENTATION.md`;
- Status und nächste Schritte in `02_PROJEKTROADMAP.md`;
- abgeschlossene Änderungen in `04_CHANGELOG.md`;
- neue verbindliche Entscheidungen im passenden Leitdokument;
- ungeprüfte Zukunftsideen in `05_IDEENSPEICHER.md`.

## 16. Qualität wird überprüfbar definiert

Für jeden größeren Implementierungsabschnitt werden vorab Abnahmekriterien festgelegt. „Funktioniert“ bedeutet nicht nur eine erfolgreiche Standardinteraktion, sondern auch nachvollziehbares Verhalten auf unterstützten Geräten und bei relevanten Randfällen.

Ein Abschnitt gilt erst nach gemeinsamer Qualitätskontrolle und erfolgreichem Review als abgeschlossen.

## Verbindliche Kurzprüfung vor jeder Umsetzung

- Ist Ziel und Nutzerwert eindeutig?
- Gibt es bereits eine passende Datenquelle oder Komponente?
- Wird eine Information dadurch doppelt gepflegt?
- Sind Daten, Logik und Darstellung sauber getrennt?
- Bleibt bestehendes Verhalten erhalten?
- Sind Mobilansicht, Zugänglichkeit, Datenschutz und Leistung berücksichtigt?
- Sind Abnahmekriterien und notwendige Dokumentationsänderungen festgelegt?

Kann eine dieser Fragen nicht beantwortet werden, wird vor der Implementierung weiter analysiert.
