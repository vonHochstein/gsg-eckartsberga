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

### Fortlaufende Altseitenanalyse bei Migration und Modernisierung

Die [Altseitenanalyse](08_ALTSEITENANALYSE.md) ist verbindlicher Bestandteil aller
Arbeitspakete, die Inhalte, Funktionen oder Strukturen der bisherigen
GSG-Website berühren.

Bei jedem solchen Arbeitspaket wird geprüft, ob ein wesentliches Defizit der
bisherigen Website festgestellt oder ein bereits dokumentierter Befund bestätigt
wurde. Ist dies der Fall, wird die Altseitenanalyse mit folgenden Angaben
ergänzt oder fortgeschrieben:

- belastbarer Altseiten-Befund;
- sachliche Auswirkung beziehungsweise praktisches Problem;
- Lösung oder bewusster Umgang auf der neuen Website;
- aktueller Status.

Einzelne Rechtschreibfehler, reine Geschmacksfragen, persönliche Kritik und
künstlich konstruierte Probleme werden nicht aufgenommen. Bei rechtlichen oder
datenschutzrechtlichen Fragen wird der tatsächliche Erkenntnisstand präzise als
Prüf- oder Risikopunkt bezeichnet; ohne fachliche Prüfung wird insbesondere kein
Rechtsverstoß behauptet. Liegt kein relevanter Befund vor, wird kein Eintrag
erzeugt.

Die Prüfung und eine gegebenenfalls erforderliche Aktualisierung der
Altseitenanalyse gehören zur Abschlussprüfung des jeweiligen Migrations- oder
Modernisierungspakets.

### Öffentliche Inhalte bilden den Veröffentlichungszustand ab

Öffentliche Website-Inhalte werden grundsätzlich so formuliert, wie sie im
vorgesehenen Veröffentlichungszustand erscheinen sollen. Interne
Entwicklungsstände, offene Implementierungsschritte, Pre-Publish-Prüfungen und
technische Arbeitsvermerke werden ausschließlich in der Projektdokumentation
geführt und nicht als Seiteninhalt veröffentlicht.

## 2. Datengetrieben arbeiten

Wiederkehrende oder strukturierte Inhalte sollen als Daten modelliert und aus einer zentralen Quelle ausgegeben werden. Das betrifft insbesondere Veranstaltungen, Downloads, Ergebnisse, Galerien und später gegebenenfalls Ansprechpartner, Sponsoren oder Dokumente.

Darstellungscode darf fachliche Inhalte nicht unnötig vervielfältigen. Neue Datenstrukturen benötigen vor ihrer Nutzung ein verständliches Schema mit Pflichtfeldern, optionalen Feldern und einer beschriebenen Bedeutung.

### Robuste Übergangszustände

Das Datenmodell bildet nicht nur ideale Redaktionsabläufe ab, sondern muss auch unvollständig gepflegte oder zeitlich verzögert aktualisierte Datensätze robust verarbeiten können. Solche Konstellationen sind tolerierte Übergangszustände und keine fachlich gewünschten Endzustände.

Tolerierte Übergangszustände müssen eindeutig erkennbar und technisch sicher verarbeitbar bleiben. Sie dürfen den vorgesehenen redaktionellen Normalablauf nicht ersetzen und sollen bei der nächsten inhaltlichen Pflege aufgelöst werden.

### Organisatorische Herkunft von Veranstaltungen

Ein oberhalb einer Veranstaltung oder Ausschreibung dargestelltes Logo ist keine bloße Dekoration. Es kennzeichnet die organisatorische Herkunft des Inhalts und muss dieser eindeutig entsprechen.

Verbindlich gilt:

- Eigene Veranstaltungen und Ausschreibungen der GSG Eckartsberga verwenden das Logo der GSG Eckartsberga.
- Allgemeine oder übergeordnete Veranstaltungen des Schützenkreises SUED Sachsen-Anhalt verwenden das Logo des Schützenkreises SUED Sachsen-Anhalt.
- Veranstaltungen anderer Vereine oder Veranstalter verwenden ausschließlich dann das jeweilige Veranstalterlogo, wenn im Projekt ein geeignetes Logo vorhanden und seine Zuordnung eindeutig belegt ist.
- Ist für eine Fremdveranstaltung kein eindeutig zugeordnetes Veranstalterlogo vorhanden, wird sie ohne Veranstalterlogo dargestellt.

Das GSG-Logo und das Logo des Schützenkreises dürfen niemals ersatzweise für eine Fremdveranstaltung verwendet werden, wenn ihre organisatorische Zuordnung nicht zutrifft. Eine Logoentscheidung darf nicht allein aus Titel, Kategorie oder Vermutung abgeleitet werden; bei unklarer Herkunft bleibt die Darstellung ohne Veranstalterlogo.

### Kurzbeschreibungen und Ergebnisveröffentlichung bei Wettbewerben

Die `description` eines Wettbewerbs enthält ausschließlich eine kurze,
sachliche Beschreibung der Veranstaltung und ihrer Disziplinen beziehungsweise
ihres Ablaufs. Namen von Teilnehmenden, Gewinnern, Platzierungen, Ringzahlen und
andere personenbezogene Einzelergebnisse werden dort nicht genannt.

Ergebnisse werden ausschließlich über gesonderte Ergebnisunterlagen
veröffentlicht. Unvollständige Ergebnislisten, Ausschnitte oder vorläufige
Teilergebnisse werden nicht eingebunden. Liegt noch keine vollständige
offizielle Ergebnisliste vor, bleibt der Ergebnisbereich leer, bis eine solche
Unterlage verfügbar und geprüft ist.

### Pflege und Migration zentraler Veranstaltungsorte

`js/data/venues.js` ist die zentrale Stammdatenquelle für wiederkehrende
Veranstaltungsorte. Vor jeder Erstellung, Änderung oder Migration eines Events
muss die Ortsangabe zuerst gegen diesen Bestand geprüft werden.

Der verbindliche Ablauf lautet:

```text
Quell-Ortsangabe → bestehenden Venue-Bestand prüfen → vorhandenen Venue
wiederverwenden / neuen Venue zur Prüfung anlegen / bei Unsicherheit
Legacy-location beibehalten
```

Verbindlich gilt:

1. Vor der Anlage eines neuen Venue wird geprüft, ob derselbe reale
   Veranstaltungsort bereits unter einer vorhandenen ID oder einer abweichenden
   Bezeichnung existiert.
2. Ist der Ort bereits eindeutig vorhanden, wird seine bestehende `venueId`
   wiederverwendet. Name, Beschreibung und Koordinaten werden nicht redundant
   im Event gepflegt.
3. Abweichende Schreibweisen wie „Schießstand X“, „Schießanlage X“ oder eine
   reine Ortsbezeichnung rechtfertigen keinen automatischen neuen
   Venue-Datensatz.
4. Ist die Identität zweier Ortsangaben nicht eindeutig, wird weder
   eigenmächtig zugeordnet noch ein möglicherweise doppelter Venue angelegt.
   Die Unklarheit wird als Prüfpunkt vorgelegt und die Entscheidung abgewartet.
5. Ein tatsächlich neuer wiederkehrender Veranstaltungsort wird zuerst als
   Stammdatensatz in `js/data/venues.js` angelegt und anschließend mittels
   `venueId` aus dem Event referenziert.
6. Reale Koordinaten müssen vor ihrer Aufnahme verifiziert werden. Sie dürfen
   nicht aus Namen, Adressen oder ungeprüften Suchtreffern erraten werden.
7. Liegen für einen neuen Ort noch keine hinreichend verifizierten zentralen
   Ortsdaten vor, bleibt das bestehende Feld `location` zulässig. Es wird kein
   künstlicher Venue allein zur technischen Vereinheitlichung angelegt.
8. Bestehende Venue-IDs sind stabile technische Schlüssel. Sie dürfen nicht
   beiläufig umbenannt, ersetzt oder dupliziert werden.
9. Änderungen an Name, Beschreibung oder insbesondere Koordinaten eines
   bestehenden Venue sind Stammdatenänderungen. Vor der Änderung wird geprüft,
   welche Events die betreffende `venueId` verwenden.
10. Koordinaten werden ausschließlich am zentralen Venue und nicht redundant in
    einzelnen Events gepflegt.
11. Bestehende Legacy-`location`-Angaben werden weiterhin schrittweise und
    kontrolliert migriert. Eine automatische Sammelmigration findet nicht statt.
12. Diese Venue-Prüfung ist verbindlicher Bestandteil aller zukünftigen
    Event-Migrationspakete.

### Zeitliche Abgrenzung der Veranstaltungsmigration

Das reguläre Veranstaltungsarchiv wird grundsätzlich ab dem Jahr 2024
migriert. Ältere Veranstaltungen werden nicht als reguläre Eventdatensätze
übernommen. Historisch bedeutsame Ereignisse können stattdessen nach
redaktioneller Prüfung als Station in die Vereinsgeschichte integriert werden.

## 3. Informationen nur einmal pflegen

Für jede fachliche Information soll es genau eine maßgebliche Quelle geben. Weitere Ansichten leiten ihre Ausgabe daraus ab.

Beispiele:

- Ein Veranstaltungstermin versorgt Kalender, Countdown und Archiv.
- Ein Galeriebild wird einem Ereignis zugeordnet und kann daraus in mehreren Ansichten erscheinen.
- Ein Dokument erhält eine zentrale Bezeichnung und Verknüpfung, statt mehrfach separat eingetragen zu werden.

Wenn doppelte Pflege unvermeidbar erscheint, ist vor der Umsetzung zu prüfen, ob das Datenmodell oder die Komponentenstruktur verbessert werden kann.

### Dokumentenablage und Dateibenennung

Bei Arbeitsaufträgen, denen eine Quelldatei wie eine PDF-, Bild-, Tabellen- oder sonstige Dokumentdatei zugeordnet ist, wird diese Datei grundsätzlich in die Projektstruktur übernommen.

#### Dateibenennung

Die Quelldatei wird anhand ihres tatsächlichen Inhalts selbstständig fachlich und eindeutig benannt.

Das Dateinamensschema lautet:

```text
YYYY_MM_DD [Dokumentbezeichnung].[Dateiendung]
```

Beispiel:

```text
2026_05_20 Ausschreibung Hans-Peter-Nolding-Pokal 2026.pdf
```

Das für den jeweiligen Arbeitsauftrag vorgegebene Präfixdatum ist verbindlich. Es darf nicht selbstständig aus einem im Dokument genannten Veranstaltungs-, Erstellungs-, Wettkampf- oder sonstigen Datum abgeleitet, ersetzt oder verändert werden.

Die Dokumentbezeichnung wird aus dem tatsächlichen Inhalt der Datei abgeleitet. Sie soll kurz, eindeutig und fachlich aussagekräftig sein. Vorhandene Benennungskonventionen des Projekts sind vorrangig einzuhalten. Das ursprüngliche Dateiformat und die Dateiendung bleiben grundsätzlich erhalten.

Für historische Medien wird die tatsächlich belegte Datumspräzision im Präfix
erhalten. Ist ein vollständiges Datum belegt, gilt weiterhin `YYYY_MM_DD`. Ist
nur das Jahr belastbar bekannt, wird ausschließlich `YYYY` verwendet. Ohne
belastbares Datum lautet das Präfix `undatiert`. Ein genaueres Datum darf nicht
aus dem Motiv, seiner Position in einer Chronik oder einer ungesicherten
Vermutung abgeleitet werden.

#### Ablage

Die Datei wird im fachlich passenden Ordner innerhalb der bestehenden Projektstruktur abgelegt. Vorhandene Ablagestrukturen sind zu verwenden; für denselben Zweck dürfen keine konkurrierenden Ordnerstrukturen geschaffen werden.

#### Einbindung

Die abgelegte Datei wird mit dem zugehörigen Datensatz oder Projektinhalt nach den bestehenden technischen Konventionen verknüpft beziehungsweise eingebunden.

Dabei ist sicherzustellen, dass:

- auf die tatsächlich abgelegte Datei verwiesen wird;
- keine unnötige Dateikopie oder Dublette erzeugt wird;
- bestehende Verknüpfungen nicht unbeabsichtigt beschädigt werden;
- das ursprüngliche Dateiformat und die Dateiendung grundsätzlich erhalten bleiben;
- bestehende Projektkonventionen für Dokumente und deren Einbindung eingehalten werden.

#### Prüfung und Unklarheiten

Inhalt, Präfixdatum, Dateibenennung, Ablage und Einbindung werden vor Abschluss des Arbeitsauftrags gegeneinander geprüft. Bei einer reinen Umbenennung oder Verschiebung muss der Dateiinhalt unverändert bleiben; bei Binärdateien kann dies durch einen Hashvergleich abgesichert werden.

Bei Unklarheiten, die sich nicht zuverlässig aus Quelldatei oder Projektstruktur auflösen lassen, darf keine Zuordnung oder Information erfunden werden.

#### Geltungsgrenze

Diese Regel gilt für neu bereitgestellte oder ausdrücklich zu bearbeitende Quelldateien. Sie löst keine automatische Sammelumbenennung bereits vorhandener Dokumente aus. Bestehende Dateien werden nur innerhalb eines eigens freigegebenen Arbeitspakets angepasst.

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

Eine Änderung darf vorhandene Funktionen nicht stillschweigend verändern. Beabsichtigte Verhaltensänderungen müssen Teil des Auftrags und des Reviews sein. Umfang und Tiefe der Prüfung richten sich nach dem tatsächlichen technischen Risiko der Änderung.

Bei technischen Änderungen sind die jeweils betroffenen Punkte zu prüfen:

- betroffene bestehende Funktionen;
- Navigation und Verlinkungen;
- mobile und große Ansichten;
- Tastaturbedienung und sichtbare Zustände;
- Datenfälle mit fehlenden oder leeren optionalen Werten;
- Fehlersituationen und sinnvolle Fallbacks.

### Ressourcenschonende Routinearbeiten

Reine Inhalts- und Datenmigrationen in bereits bestehende und getestete
Strukturen sind Routinearbeiten. Dazu gehören insbesondere neue oder geänderte
Eventdatensätze, Texte, Bildunterschriften, lokale Bilder und Dokumente, die
Verwendung vorhandener Veranstaltungsorte sowie die Aufnahme von Bildern in
bestehende Galerien.

Solange dabei keine gemeinsame technische Logik, Komponente, Datenstruktur oder
Schnittstelle verändert wird, gilt:

- Es werden keine neuen datensatzspezifischen Tests geschrieben.
- Die vollständige Testsuite wird nicht routinemäßig ausgeführt.
- Unveränderte Komponenten wie Eventrenderer, Galerie, Lightbox, Karte,
  Dokumentanzeige oder Videoausgabe werden nicht erneut vollständig abgenommen.
- Die technische Kontrolle beschränkt sich grundsätzlich auf Arbeitsbaum und
  Umfang, offensichtliche Syntaxfehler geänderter Daten, die Existenz neu
  referenzierter lokaler Dateien und `git diff --check`.
- Ein kurzer gezielter Smoke-Check erfolgt nur, wenn die konkrete Änderung ihn
  objektiv erfordert. Er wird nicht automatisch zu einer vollständigen Browser-
  oder Responsive-Prüfung ausgeweitet.

Umfangreiche automatisierte und manuelle Prüfungen bleiben erforderlich, wenn
gemeinsame Logik, Komponenten, Datenmodelle, Schnittstellen, Renderer,
Normalisierung, CSS-/Responsive-Verhalten, Navigation, Formulare, externe
Dienste oder sicherheits-, datenschutz- beziehungsweise
barrierefreiheitsrelevante Funktionen geändert werden. Die vollständige
Testsuite bleibt außerdem geeigneten Sammel- und Releaseprüfungen vorbehalten.

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

Layout, Inhaltshierarchie, Interaktionsflächen und Medien müssen bei neuen oder
geänderten Darstellungsfunktionen auf unterschiedlichen Bildschirmgrößen
geprüft werden. Reine Routinearbeiten in unveränderten responsiven Komponenten
lösen keine erneute vollständige Viewport-Prüfung aus.

## 12. Leistung und Einfachheit bewahren

Abhängigkeiten, Bibliotheken und Dienste werden nur aufgenommen, wenn ihr Nutzen ihren dauerhaften Wartungs- und Datenschutzaufwand rechtfertigt.

Bevor eine externe Lösung eingeführt wird, sind zu bewerten:

- Funktionsnutzen;
- Ladezeit und Ausfallsicherheit;
- Datenschutz und Einwilligungserfordernisse;
- Kosten und Anbieterbindung;
- Wartung und Austauschbarkeit.

Medien werden in angemessenen Formaten, Größen und Auflösungen bereitgestellt.

Jedes produktiv eingebundene Video erhält ein lokales Posterbild aus einem
repräsentativen Einzelbild des zugehörigen Videos. Das Poster wird in der
Medienübersicht und im nativen Player vor Beginn der Wiedergabe verwendet; das
Video startet weiterhin nicht automatisch. Seitenverhältnis und ein sinnvoller
Motivausschnitt bleiben erhalten. Externe Poster, frei erfundene Ersatzmotive
oder eine leere Schwarzfläche sind kein regulärer Veröffentlichungszustand. Eine
technische Fallbackfläche ist nur für fehlerhafte oder noch unvollständige
Übergangszustände zulässig.

Produktive Medien werden grundsätzlich lokal aus der Projektstruktur
ausgeliefert. Externe Medienquellen dürfen nur nach vorheriger technischer und
datenschutzbezogener Prüfung sowie einer dokumentierten Entscheidung eingebunden
werden. Ungeprüftes Hotlinking ist kein zulässiger Ersatz für die kontrollierte
Medienablage.

## 13. Datenschutz und Recht von Anfang an berücksichtigen

Externe Dienste, Formulare, Karten, Besucherstatistiken, eingebettete Inhalte und geschützte Bereiche dürfen erst nach Prüfung der rechtlichen und organisatorischen Folgen eingebunden werden.

Rechtstexte werden nicht durch technische Annahmen ersetzt. Vor Veröffentlichung müssen Impressum und Datenschutz fachlich geprüft sein.

## 14. Sicherheit der Datenverarbeitung

Redaktionelle oder externe Daten gelten nicht automatisch als vertrauenswürdig. Inhalte werden validiert und sicher ausgegeben. Zugangsdaten, private Informationen oder interne Dokumente dürfen nicht ungeschützt in öffentlich ausgelieferten Dateien liegen.

Ein Mitgliederbereich erfordert ein echtes Berechtigungs- und Schutzkonzept; eine lediglich versteckte URL ist kein Zugriffsschutz.

## 15. Dokumentation gehört zur Änderung

Eine Änderung ist erst vollständig, wenn die betroffene Dokumentation aktualisiert wurde.

Reine Routinearbeiten erfordern keine Aktualisierung der technischen
Projektdokumentation, Roadmap oder weiterer Planungsdokumente, sofern sich deren
Aussagen, Status oder Entscheidungen nicht ändern. Die Regel zur
Altseitenanalyse bleibt davon unberührt: Sie wird nur bei einem tatsächlich
substanziellen Befund ergänzt.

Je nach Änderung sind anzupassen:

- technische Architektur und Datenmodelle in `TECHNISCHE_PROJEKTDOKUMENTATION.md`;
- Status und nächste Schritte in `02_PROJEKTROADMAP.md`;
- abgeschlossene Änderungen in `04_CHANGELOG.md`;
- neue verbindliche Entscheidungen im passenden Leitdokument;
- ungeprüfte Zukunftsideen in `05_IDEENSPEICHER.md`.
- wesentliche Befunde aus Migration und Altseitenmodernisierung in
  `08_ALTSEITENANALYSE.md`.

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
- Wurde bei Arbeiten mit Bezug zur bisherigen Website der mögliche
  Aktualisierungsbedarf der Altseitenanalyse geprüft?

Kann eine dieser Fragen nicht beantwortet werden, wird vor der Implementierung weiter analysiert.
