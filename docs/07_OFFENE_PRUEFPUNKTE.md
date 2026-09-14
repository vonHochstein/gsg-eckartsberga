# Offene Prüfpunkte

## Zweck

Dieses Dokument enthält alle Fragen aus den persönlichen Projektnotizen, die vor einer verbindlichen Entscheidung, öffentlichen Aussage oder Implementierung geklärt werden müssen.

Es ist kein Rechtsgutachten. Rechtliche Bewertungen sind bei Bedarf durch fachkundige Stellen zu bestätigen. Nach Abschluss eines Prüfpunkts werden Ergebnis, Datum und verantwortliche Person ergänzt; daraus entstehende Arbeit wird in die Roadmap übernommen.

## Statusdefinition

- **Offen:** Prüfung steht aus.
- **In Klärung:** Verantwortliche Person oder konkreter Prüfauftrag ist festgelegt.
- **Entschieden:** Ergebnis ist dokumentiert und notwendige Folgearbeit eingeordnet.
- **Entfällt:** Nachvollziehbar begründet nicht weiterzuverfolgen.

## Wirtschaft, Vertrag und Leistungsumfang

### P-01 – Jährliche Gesamtkosten

- **Status:** Offen
- **Frage:** Ist der notierte Zielwert von 150 Euro pro Jahr realistisch und vollständig?
- **Zu prüfen:** Hosting, Domain, E-Mail, Zertifikate, Sicherungen, externe Dienste, Support, Steuern und mögliche Preisänderungen.
- **Abschlusskriterium:** Schriftliche Kostenübersicht mit Leistungsumfang und Vergleich zur bestehenden Lösung.

### P-02 – Vertragsbindung und Strato-Vergleich

- **Status:** Offen
- **Frage:** Besteht tatsächlich keine oder nur eine geringe Kündigungsfrist?
- **Zu prüfen:** aktueller Strato-Vertrag, Kündigungsfrist, Laufzeit, Verlängerung, Domainumzug, Datenexport und mögliche Wechselkosten.
- **Abschlusskriterium:** Dokumentierter Vergleich der Vertragsbedingungen.

### P-03 – Kostenlose Website-Erstellung

- **Status:** Offen
- **Frage:** Welche Leistungen umfasst „kostenlose Website-Erstellung“ genau?
- **Zu prüfen:** Gestaltung, Entwicklung, Inhaltspflege, Korrekturschleifen, spätere Erweiterungen, Nutzungsrechte, Übergabe und Support.
- **Abschlusskriterium:** Schriftlich abgegrenzter kostenloser und kostenpflichtiger Leistungsumfang.

### P-04 – Persönlicher WhatsApp-Service

- **Status:** Offen
- **Frage:** Was bedeutet „24h WhatsApp Service“ verbindlich?
- **Zu prüfen:** Kontaktzeiten, erwartbare Reaktionszeit, Umfang, Notfälle, Urlaub und Vertretung, Datenschutz, Dokumentation von Aufträgen.
- **Abschlusskriterium:** Verständliche Servicebeschreibung ohne uneinlösbares Verfügbarkeitsversprechen.

## Datenschutz, Recht und externe Dienste

### P-05 – Cookies und Einwilligungsbanner

- **Status:** In Klärung
- **Frage:** Kann die Website ohne Cookie- beziehungsweise Einwilligungsbanner betrieben werden?
- **Zu prüfen:** Die technische Voranalyse hat für den aktuellen Stand keine eigenen Cookies oder Browser-Speicherungen festgestellt. Vor Veröffentlichung bleiben insbesondere die tatsächliche Formspree- und counter.dev-Konfiguration, der mögliche `sessionStorage`-Einsatz der Statistik, die klickbasierte OSM-Karte und die rechtliche Einordnung des finalen Gesamtzustands zu prüfen.
- **Abschlusskriterium:** Vollständige Diensteliste und fachlich bestätigte Entscheidung zur erforderlichen Einwilligung.

### P-06 – Impressum und Datenschutzerklärung

- **Status:** In Klärung
- **Frage:** Sind Impressum und Datenschutzerklärung vollständig und für die finale Website ausreichend?
- **Zu prüfen:** Impressum und für den Veröffentlichungszustand formulierte Datenschutzfassung sind integriert. Vor Veröffentlichung müssen die Vereins-E-Mail-Adresse den Platzhalter `[VEREINS-E-MAIL VOR VERÖFFENTLICHUNG ERGÄNZEN]` auf beiden Seiten und das Veröffentlichungsdatum den Platzhalter `[STAND VOR VERÖFFENTLICHUNG ERGÄNZEN]` in der Datenschutzerklärung ersetzen. Anhand des endgültigen Webangebots ist zu prüfen, ob eine zusätzliche Verantwortlichenangabe nach § 18 Abs. 2 MStV nötig ist. Nach Fertigstellung der Kontaktarchitektur ist zu klären, ob neben der Vereins-E-Mail eine weitere unmittelbare Kommunikationsmöglichkeit für die Anbieterkennzeichnung erforderlich ist. Beim Vorstand ist zu erfragen, ob eine anzugebende USt-IdNr. oder Wirtschafts-Identifikationsnummer erteilt wurde; eine normale Steuernummer wird nicht vorsorglich veröffentlicht. Ebenfalls sind mögliche Informationspflichten nach dem Verbraucherstreitbeilegungsrecht anhand der tatsächlichen Vereinstätigkeit zu prüfen. Für die Datenschutzerklärung bleiben die Rechtsgrundlage der übernommenen öffentlichen Gästebuch-Altbestände, die fachliche Gesamtfreigabe und der Abgleich mit dem endgültigen Produktionsbetrieb offen. Hosting, Protokolldaten und externe Dienste werden zusätzlich über P-07 bis P-09 und P-23 geprüft.
- **Abschlusskriterium:** Freigegebene Rechtstexte vor Veröffentlichung.

### P-24 – Namensabweichung auf der Vorstandsseite

- **Status:** Offen
- **Frage:** Wie soll der Name des Vorstandsmitglieds auf `vorstand.html` öffentlich geführt werden?
- **Zu prüfen:** Im Impressum ist nach dem vom Auftraggeber verifizierten Registerstand „Theobald Schneider“ angegeben; auf der bestehenden Vorstandsseite steht „Theo Schneider“. Ob „Theo“ ein freigegebener Ruf- oder Kurzname ist, ist nicht geklärt. Die Vorstandsseite bleibt bis zur redaktionellen Entscheidung unverändert.
- **Abschlusskriterium:** Bestätigte öffentliche Namensform und gegebenenfalls gesonderte redaktionelle Nachführung der Vorstandsseite.

### P-07 – OSM-Veranstaltungskarten und spätere Anfahrtsdarstellung

- **Status:** In Klärung
- **Frage:** Ist die erst nach bewusstem Klick geladene OSM-Kartenlösung für produktive Veranstaltungsorte rechtlich, datenschutzrechtlich und betrieblich freigegeben, und kann sie später für eine Anfahrtsdarstellung wiederverwendet werden?
- **Zu prüfen:** Die lokale Leaflet-Einbindung, nutzerinitiierte Tile-Anfrage, Attribution sowie der Ausschluss eigener Cookies und Speichermechanismen sind technisch dokumentiert. Vor Veröffentlichung bleiben aktuelle OSM-Richtlinien, die konkrete Rechtsgrundlage, der Einwilligungsbedarf, ein Live-Netzwerktest, Ausfallsicherheit und barrierearme Textalternative abschließend zu bewerten.
- **Abschlusskriterium:** Dokumentierte Freigabe der klickbasierten Lösung einschließlich Datenschutztext, Lizenznachweis, Netzwerkprüfung und Entscheidung zum Einwilligungsbedarf.

### P-08 – Formspree für Kontaktformular und Gästebuch

- **Status:** In Klärung
- **Frage:** Wie wird die verbindlich geplante Formspree-Anbindung für Kontaktformular und moderierte Gästebuchübermittlung datenschutzgerecht konfiguriert?
- **Zu prüfen:** Vor der technischen Aktivierung Auftragsverarbeitung, konkrete Datenfelder, Speicherung, internationale Datenübermittlung, Spam-Schutz ohne ungeprüftes reCAPTCHA, Löschung, Rechtsgrundlagen für Kontaktübermittlung, Gästebuchübermittlung und spätere Veröffentlichung, Kosten, Barrierefreiheit und Anbieterbindung bewerten. Anschließend die Datenschutzerklärung gegen die reale Konfiguration prüfen. Gästebucheinträge dürfen nie automatisch veröffentlicht werden.
- **Abschlusskriterium:** Bewertete Anbieterentscheidung und dokumentierter Datenfluss.

### P-09 – counter.dev für Besucherstatistik

- **Status:** In Klärung
- **Frage:** Wie wird die verbindlich geplante Reichweitenmessung mit counter.dev datenschutzgerecht aktiviert?
- **Zu prüfen:** Vor Aktivierung tatsächliches Einbindungsskript und konkrete Statistikfelder, `sessionStorage`, Browser-Cache, Referrer, IP-basierte Länderableitung, Einwilligungsbedarf, Datenschutzerklärung, Ausfallsicherheit und Alternativen ohne Statistik prüfen. Danach die Datenschutzerklärung gegen die reale Konfiguration abgleichen.
- **Abschlusskriterium:** Dokumentierte, fachlich freigegebene counter.dev-Konfiguration einschließlich Rechtsgrundlage, Einwilligungsentscheidung und aktualisiertem Datenschutztext.

### P-23 – Datenschutzabgleich des Produktionsbetriebs

- **Status:** Offen
- **Frage:** Entspricht die veröffentlichte Website technisch vollständig der vorbereiteten Datenschutzerklärung?
- **Zu prüfen:** GitHub-Pages-Deployment und STRATO-Domain-/DNS-Konfiguration fertigstellen; anschließend unter der endgültigen Domain eine Live-Netzwerkprüfung sämtlicher Seiten und Interaktionen durchführen. Tatsächliche Requests, Hosting-Header, Referrer-Verhalten, mögliche Content-Security-Policy, Protokolldaten, externe Ressourcen und noch vorhandene Platzhalter gegen die Datenschutzerklärung prüfen. Produktive Medien müssen gemäß den Entwicklungsgrundsätzen lokal bleiben, sofern eine externe Quelle nicht zuvor ausdrücklich technisch und datenschutzbezogen freigegeben wurde.
- **Abschlusskriterium:** Dokumentierter Produktionsscan ohne unerklärte Drittanfragen oder Widersprüche zur freigegebenen Datenschutzerklärung.

### P-20 – Nutzungsfreigabe Verbandslogos vor Veröffentlichung prüfen

- **Status:** Offen
- **Frage:** Dürfen die eingebundenen Logos des Deutschen Schützenbundes und des Landesschützenverbandes Sachsen-Anhalt auf der öffentlichen Vereinswebsite verwendet werden, und gelten dafür besondere Bedingungen?
- **Zu prüfen:** Vor dem öffentlichen Produktivgang Nutzungsfreigabe und mögliche Darstellungsvorgaben beim jeweiligen Verband prüfen beziehungsweise erforderlichenfalls bestätigen lassen. Die offene Prüfung blockiert die lokale Entwicklungsintegration nicht.
- **Abschlusskriterium:** Dokumentierte Freigabe oder verbindlich geklärte Nutzungsbedingungen für beide Verbandslogos vor Veröffentlichung.

## Inhalte und Zugriff

### P-10 – Satzung öffentlich oder intern

- **Status:** Offen
- **Frage:** Soll die Vereinssatzung öffentlich zugänglich oder nur Mitgliedern vorbehalten sein?
- **Zu prüfen:** gewünschte Transparenz, enthaltene personenbezogene Daten, Aktualisierungsverantwortung und Nutzen eines geschützten Bereichs.
- **Abschlusskriterium:** Vorstandsbeschluss beziehungsweise dokumentierte redaktionelle Entscheidung.

### P-11 – Mitgliederbereich

- **Status:** Offen
- **Frage:** Welche Dokumente und Funktionen benötigen tatsächlich einen geschützten Mitgliederbereich?
- **Zu prüfen:** Nutzergruppen, Authentifizierung, Rechteverwaltung, Datenschutz, Wiederherstellung, Administration, Hosting und laufender Pflegeaufwand.
- **Abschlusskriterium:** Fachliches Berechtigungs- und Betriebskonzept; eine versteckte URL genügt nicht.

### P-14 – Überlieferung der Schützenkönige vervollständigen

- **Status:** Offen
- **Frage:** Warum fehlt auf der bisherigen Vereinswebsite der Jahrgang 2018, und ist die dort ausschließlich einmal vorkommende Schreibweise „Dominice Wiegand“ für 2019 korrekt?
- **Zu prüfen:** Vereinsunterlagen oder verantwortliche Personen zu Titelvergabe und Namensschreibweise befragen; außerdem klären, ob vor 2016 weitere Einträge veröffentlicht werden sollen.
- **Abschlusskriterium:** Dokumentierte redaktionelle Bestätigung oder begründete Entscheidung, die derzeitige quellengetreue Darstellung unverändert beizubehalten.

### P-21 – Zuständige Waffenbehörde als externer Verweis

- **Status:** Offen
- **Frage:** Ist ein Link zur zuständigen Waffenbehörde für Besucher der Vereinswebsite fachlich sinnvoll, und wo soll er gegebenenfalls eingeordnet werden?
- **Zu prüfen:** Tatsächlich zuständige Behörde, geeignete offizielle Zielseite und inhaltlich passende Position innerhalb der Website. Bis zur Klärung werden weder Behörde noch URL eingetragen.
- **Abschlusskriterium:** Dokumentierte Zuständigkeits- und Zielseitenprüfung sowie bewusste redaktionelle Entscheidung über Aufnahme und Platzierung des Links.

### P-22 – Offizielle Website der Stadt Eckartsberga als regionaler Verweis

- **Status:** Offen
- **Frage:** Soll die offizielle Website der Stadt Eckartsberga als regionaler Bezug verlinkt werden?
- **Zu prüfen:** Ob der Verweis inhaltlich sinnvoll ist und an welcher Stelle er Besucher unterstützt. Bis zur Klärung werden weder Platzierung noch konkrete URL festgelegt.
- **Abschlusskriterium:** Dokumentierte redaktionelle Entscheidung über Aufnahme und inhaltlich passende Platzierung des Verweises.

## Qualität und Gestaltung

### P-12 – Nachweis vollständiger Responsivität

- **Status:** Offen
- **Frage:** Auf welchen Geräten und Browsern muss die Website geprüft werden, bevor „komplett responsive fürs Handy“ als bestätigt gilt?
- **Zu prüfen:** unterstützte Viewports, reale Mobilgeräte, Navigation, Touchziele, Textskalierung, Hoch-/Querformat und Medien.
- **Abschlusskriterium:** Abgenommene Testmatrix ohne blockierende Darstellungs- oder Bedienfehler.

### P-13 – Logoüberarbeitung

- **Status:** Offen
- **Frage:** Darf und soll das bestehende Vereinslogo gestalterisch verändert werden?
- **Zu prüfen:** Freigabe des Vereins, verbindliche Originalvorlagen, Markenfarben, Einsatzvarianten und Umfang der Überarbeitung.
- **Abschlusskriterium:** Freigegebenes Briefing für Kanten, Farbkräftigung, Gold- und Blauton, Kontrast, Schatten, Weißflächen und exakt runde Kreisform.

### P-15 – Medienflächen der Schützenkönig-Karten

- **Status:** Offen
- **Frage:** Wie sollen die unterschiedlich proportionierten Bilder auf `erfolge.html` die Medienflächen der Schützenkönig-Karten künftig ausfüllen, ohne störende horizontale oder vertikale Freiflächen beziehungsweise Balken zu erzeugen?
- **Zu prüfen:** Alle zehn Hoch- und Querformate gemeinsam auf großen und kleinen Ansichten vergleichen und eine gestalterisch konsistente Lösung festlegen. Bilddateien dürfen dabei nicht destruktiv beschnitten werden.
- **Abschlusskriterium:** Abgenommene Kartendarstellung, die alle Seitenverhältnisse hochwertig behandelt und keine unbeabsichtigten Freiflächen erzeugt.

### P-16 – Kopfgestaltung von Erfolgs- und Vorstandsseite

- **Status:** Offen
- **Frage:** Wie werden die Kopfbereiche von `erfolge.html` und `vorstand.html` an die Gestaltung von `geschichte.html` als verbindliche Referenz angeglichen?
- **Zu prüfen:** Integrierte Überschrift und farbliche Hintergrundabsetzung der Geschichtsseite mit den derzeitigen kartenartigen Eventseiten-Köpfen vergleichen; bestehende Komponenten und Designregeln vorrangig wiederverwenden.
- **Abschlusskriterium:** Abgenommenes gemeinsames Kopfkonzept für Erfolgs- und Vorstandsseite, das sich sichtbar an `geschichte.html` orientiert, ohne die übrigen Seitenstrukturen unnötig zu verändern.

### P-17 – Fokuspositionen der Schützenkönig-Bilder in der Startseitengalerie

- **Status:** Offen
- **Frage:** Welche individuellen `object-position`-Werte stellen alle zehn Schützenkönig-Motive in der flächigen Startseitengalerie sinnvoll dar, ohne Köpfe abzuschneiden?
- **Zu prüfen:** Jedes Motiv auf den maßgeblichen Desktop- und Mobilbreiten visuell kontrollieren und die Fokuspositionen einzeln festlegen. Die Bilddateien bleiben unverändert und werden nicht destruktiv beschnitten.
- **Abschlusskriterium:** Visuell abgenommene Fokuspositionen für alle zehn Motive ohne störend abgeschnittene Köpfe.

### P-18 – Reihenfolge der globalen Footerbereiche

- **Status:** Entschieden
- **Entscheidung:** Der Auftraggeber hat für alle Ansichten verbindlich die Reihenfolge Logozeile, dezente Trennung, Footer-Navigation und abschließende Copyright-/Leitsatzzeile festgelegt. Die zuvor vorangestellte Navigation wird entsprechend nachgeordnet.
- **Abschlusskriterium:** Mit FOOT-POL-001 umgesetzt und durch die gemeinsame Footerprüfung aller Seiten abgesichert.

### P-19 – Inhaltliche Feinüberarbeitung Schießbahnen und Vereinshaus

- **Status:** Offen
- **Frage:** Welche inhaltlichen Angaben auf `schiessbahnen.html` müssen sachlich korrigiert oder präzisiert werden?
- **Zu prüfen:** Sachlich korrekte Beschreibung und Zuordnung der einzelnen Anlagenbilder einschließlich ihrer Bildunterschriften und Alternativtexte sowie gegebenenfalls weitere kleinere sachliche Formulierungen innerhalb der Seite. Bis zur späteren Vorgabe beziehungsweise gemeinsamen Prüfung durch den Auftraggeber werden daraus keine konkreten Korrekturen abgeleitet oder Angaben vermutet.
- **Abschlusskriterium:** Die betroffenen Inhalte sind einzeln mit dem Auftraggeber geprüft und die freigegebenen sachlichen Korrekturen in einem separaten Arbeitspaket umgesetzt. Technische Umsetzung, Layout, Seitenaufbau, Medienintegration und Funktionalität bleiben dabei unverändert.

## Noch zu bewertende Funktionserweiterungen

Die folgenden Notizen sind vollständig im [Ideenspeicher](05_IDEENSPEICHER.md) erfasst und werden erst bei möglicher Übernahme in die Roadmap einzeln geprüft:

- Dunkelmodus;
- Favicon;
- Suchfunktion;
- Downloadbereich für Ausschreibungen;
- Gästebuch;
- Kontaktformular;
- Besucherstatistik;
- Mitgliederbereich;
- Sponsoren;
- befreundete Vereine;
- Satzungsbereich.

Der kombinierte Veranstaltungskalender mit Termin, Ergebnissen, Bildern und Jahresarchiv sowie der Startseiten-Countdown gehören bereits zum Projektkonzept. Kalendergrundstruktur, Jahresarchiv und Countdown sind im aktuellen Prototyp grundsätzlich umgesetzt; Detailinhalte und Verknüpfungen bleiben laut Roadmap geplant.

## Vollständigkeitsnachweis der Integration von `notes.rtf`

Die folgende Tabelle ordnet jede inhaltliche Notiz genau einer Hauptkategorie zu. Querverweise in anderen Dokumenten dienen nur der Umsetzung oder Prüfung und ändern diese Hauptzuordnung nicht.

| Nr. | Notiz, normalisiert | Hauptkategorie | Maßgebliches Dokument |
|---:|---|---|---|
| 1 | Keine unnötige Cookie-Richtlinie beziehungsweise kein störender Banner | Offene Prüfpunkte | P-05 in diesem Dokument |
| 2 | Vollständig responsive auf Mobiltelefonen | Projektvision | `00_PROJEKTVISION.md`; Nachweis über P-12 |
| 3 | Geringere Kosten | Verkaufsargumente | `06_VERKAUFSARGUMENTE.md`; Nachweis über P-01 |
| 4 | Keine oder geringe Kündigungsfrist; mit Strato abgleichen | Offene Prüfpunkte | P-02 in diesem Dokument |
| 5 | Zielwert von 150 Euro pro Jahr | Verkaufsargumente | `06_VERKAUFSARGUMENTE.md`; Nachweis über P-01 |
| 6 | 24h-WhatsApp-Service | Verkaufsargumente | `06_VERKAUFSARGUMENTE.md`; Klärung über P-04 |
| 7 | Kostenlose Website-Erstellung | Verkaufsargumente | `06_VERKAUFSARGUMENTE.md`; Klärung über P-03 |
| 8 | Möglicherweise problematischer Google-Maps-Screenshot unter „Vorstand“ | Offene Prüfpunkte | P-07 in diesem Dokument |
| 9 | Dunkelmodus | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 10 | Favicon | Roadmap | Abschnitt 8 in `02_PROJEKTROADMAP.md` |
| 11 | Suchfunktion | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 12 | Downloadbereich, beispielsweise für Ausschreibungen | Roadmap | Abschnitte 3 und 4 in `02_PROJEKTROADMAP.md` |
| 13 | Bildergalerie mit Lightbox | Roadmap | als umgesetzt dokumentiert in `02_PROJEKTROADMAP.md` |
| 14 | Ausreichendes Impressum und ausreichender Datenschutz | Offene Prüfpunkte | P-06 in diesem Dokument |
| 15 | Gästebuch möglicherweise über Formspree | Offene Prüfpunkte | P-08 in diesem Dokument |
| 16 | Besucherzähler möglicherweise über counter.dev | Offene Prüfpunkte | P-09 in diesem Dokument |
| 17 | Kontaktformular möglicherweise über Formspree | Offene Prüfpunkte | P-08 in diesem Dokument |
| 18 | Interner Mitgliederbereich für Dokumente | Ideenspeicher | `05_IDEENSPEICHER.md`; Voraussetzungen über P-11 |
| 19 | Satzung intern oder lieber öffentlich bereitstellen | Offene Prüfpunkte | P-10 in diesem Dokument |
| 20 | Termine zum kombinierten Veranstaltungskalender mit Ergebnissen und Bildern ausbauen | Projektvision | `00_PROJEKTVISION.md` |
| 21 | Veranstaltungskalender mit Jahresarchiv verschlanken | Roadmap | als umgesetzt dokumentiert in `02_PROJEKTROADMAP.md` |
| 22 | Countdown beziehungsweise Ticker bis zur nächsten Veranstaltung als Blickfang | Roadmap | als umgesetzt dokumentiert in `02_PROJEKTROADMAP.md` |
| 23 | Sponsoren | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 24 | Befreundete Vereine | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 25 | Satzung als Inhalt | Ideenspeicher | `05_IDEENSPEICHER.md`; Zugriffsentscheidung über P-10 |
| 26 | Logo später aufwerten | Ideenspeicher | `05_IDEENSPEICHER.md`; Freigabe über P-13 |
| 27 | Logo-Kanten sauber glätten | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 28 | Farben kräftiger gestalten | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 29 | Gold hochwertiger wirken lassen | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 30 | Blautöne harmonisieren | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 31 | Kontrast erhöhen | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 32 | Schatten entfernen beziehungsweise zurückhaltender einsetzen | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 33 | Weiße Flächen sauber weiß darstellen | Ideenspeicher | `05_IDEENSPEICHER.md` |
| 34 | Kreis des Logos absolut rund gestalten | Ideenspeicher | `05_IDEENSPEICHER.md` |

## Abschluss von Projektphase 0

Mit der vollständigen Auswertung und Zuordnung dieser Notizen sind alle derzeit bekannten Projektideen, Verkaufsargumente und offenen Entscheidungen in der Dokumentation erfasst.

**Projektphase 0 „Projektvorbereitung“ ist mit Stand 24. Juli 2026 abgeschlossen.**

Offene Prüfpunkte bleiben bewusst bestehen. Sie blockieren den Abschluss der Projektvorbereitung nicht, müssen aber vor der jeweils betroffenen Aussage, Entscheidung oder Implementierung geklärt werden.
