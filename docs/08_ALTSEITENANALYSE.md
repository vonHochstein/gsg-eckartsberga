# Altseitenanalyse

## Zweck

Diese fortlaufende Analyse dokumentiert wesentliche, belastbar festgestellte
Defizite der bisherigen GSG-Website und den sachlichen Modernisierungsbedarf.
Sie bildet die Grundlage für eine spätere Gegenüberstellung gegenüber Vorstand
und Verein: Welches praktische Problem bestand, und wie geht die neue Website
damit um?

Die Analyse ist weder eine pauschale Kritik am bisherigen Betreiber noch eine
Sammlung einzelner Schreibfehler, Geschmacksfragen oder belangloser
Gestaltungsunterschiede. Aufgenommen werden nur Befunde mit tatsächlichem
Gewicht. Rechtliche oder datenschutzrechtliche Punkte werden als Prüf- oder
Risikopunkte bezeichnet, solange keine fachliche Bewertung vorliegt.

## Pflege im Migrationsprozess

Bei jedem Arbeitspaket, das Inhalte, Funktionen oder Strukturen der bisherigen
Website berührt, wird geprüft, ob ein wesentlicher Altseitenbefund festgestellt
oder bestätigt wurde. Ist dies der Fall, wird er hier mit Auswirkung, Umgang der
neuen Website und Status ergänzt oder fortgeschrieben. Ergibt die Prüfung keinen
relevanten Befund, entsteht kein künstlicher Eintrag.

Maßgeblich ist die verbindliche Regel in den
[Entwicklungsgrundsätzen](01_ENTWICKLUNGSGRUNDSÄTZE.md#fortlaufende-altseitenanalyse-bei-migration-und-modernisierung).
Quellen- und medienspezifische Einzelheiten verbleiben in den vorhandenen
Migrationsinventaren und werden hier nicht dupliziert.

## Statuswerte

- **Offen:** Problem und Umgang sind noch nicht abschließend geklärt.
- **In Bearbeitung:** Ein freigegebenes Arbeitspaket bearbeitet den Befund.
- **Teilweise behoben:** Der dokumentierte Teilbestand ist behandelt; die Regel
  muss bei weiteren Migrationen erneut angewendet werden.
- **Behoben:** Der Befund ist im vorgesehenen Umfang nachvollziehbar gelöst.
- **Bewusst beibehalten:** Der Zustand bleibt nach dokumentierter Entscheidung
  bestehen.

## Initialbestand

Stand: 9. September 2026. Dieser Initialbestand beruht ausschließlich auf der
vorhandenen Projektdokumentation und bereits abgeschlossenen Migrationen. Er ist
keine rückwirkende Vollprüfung aller Altseiten.

| ID | Altseiten-Befund | Auswirkung / Problem | Lösung bzw. Umgang auf der neuen Website | Status |
|---|---|---|---|---|
| ALT-001 | Migrierte Geschichts-, Anlagen- und Schützenkönigmedien waren nur als plattformspezifische Jimdo-`transf/none`-Fassungen erreichbar. Ihre Identität mit den ursprünglichen Uploads ist nicht nachweisbar; technische Jimdo-Versionsnummern sind keine inhaltliche Datierung. | Dauerhafte Sicherung, eindeutige Herkunft und kontrollierte Weiterverwendung wären bei bloßer Beibehaltung der externen Quellen nicht gewährleistet. | Ausgewählte Quellen werden unverändert lokal archiviert, mit URL, technischen Metadaten und SHA-256 dokumentiert und erst nach Freigabe als lokale Projektassets veröffentlicht. Produktive Seiten verweisen nicht direkt auf die Jimdo-Medienquellen. | Teilweise behoben – für die bisher migrierten Medien umgesetzt; bei weiteren Altmedien erneut anzuwenden. |
| ALT-002 | Die bisherige Vereinschronik erforderte eine klarere Trennung zwischen früher Schützentradition, der Neugründung von 1827 und der Gründung des heutigen Vereins im Jahr 1992. Problematische historische Kontinuitätsaussagen wurden im Zuge der Migration bestätigt. | Ohne diese Einordnung können überlieferte Bezugspunkte als lückenlos belegte Organisationsgeschichte des heutigen Vereins missverstanden werden. | Die neue Chronik trennt die Zeitstufen sprachlich, kennzeichnet Quellen und Überlieferung und führt offene historische Recherchen getrennt fort. | Behoben – weitere Quellen können einzelne Stationen später präzisieren. |
| ALT-003 | Die frühere Seite „Bilder“ war keine allgemeine Galerie, sondern enthielt im Wesentlichen die jahrweise Zuordnung von Schützenkönigen und einer Schützenkönigin sowie einen sachfremden Kontaktaufruf. | Seitentitel und Inhaltshierarchie erschwerten die fachliche Einordnung; Erfolgsüberlieferung, Galerie und Kontakt waren nicht sauber getrennt. | Die belegten Einträge stehen auf der eigenständigen Seite „Erfolge“ im Abschnitt „Schützenkönige“. Der Kontaktaufruf wurde nicht als Erfolgsinhalt übernommen; Galeriefunktionen bleiben davon getrennt. | Behoben. |
| ALT-004 | Die auf der früheren Seite überlieferte Schützenkönig-Reihe enthält keinen Eintrag für 2018, keine Einträge vor 2016 und für 2019 nur die einmal belegte Schreibweise „Dominice Wiegand“. | Eine vollständige Reihe oder korrigierte Namensform ließe sich ohne zusätzliche Vereinsquellen nur erfinden. | Die neue Website übernimmt ausschließlich die belegten Einträge, erzeugt keinen Platzhalter und hält Lücke sowie Schreibweise als offene redaktionelle Prüfung fest. | Teilweise behoben – quellengetreu veröffentlicht, inhaltliche Bestätigung bleibt offen. |
| ALT-005 | Die Datenschutzdarstellung der bisherigen Jimdo-Website war plattformspezifisch und beschrieb unter anderem Google Analytics, Google reCAPTCHA und Jimdo Creator Statistics. Diese Dienste entsprechen nicht dem technischen Konzept der neuen Website. | Eine unveränderte Übernahme würde Dienste und Datenflüsse beschreiben, die auf der neuen Website nicht vorhanden sind, während deren tatsächliche beziehungsweise verbindlich vorgesehene Technik nicht passend erklärt würde. | Die neue Datenschutzerklärung wird aus dem geprüften eigenen Codebestand abgeleitet, für den vorgesehenen Veröffentlichungszustand formuliert und übernimmt keine Jimdo-Textbausteine. Technische Entwicklungsstände und offene Rechtsprüfungen werden getrennt in der internen Projektdokumentation geführt. | Teilweise behoben – technische Fassung integriert; fachliche Freigabe und Abgleich mit dem endgültigen Produktionszustand bleiben offen. |
| ALT-006 | Die bisherige Impressumsseite nennt den Verein und beginnt mit einer Angabe „verantwortlich für den Inhalt“, enthält aber nicht die nun verifizierten vollständigen Anschrift-, Vertretungs- und Registerinformationen. Stattdessen folgen umfangreiche generische Haftungs- und Disclaimertexte. | Besucher erhalten daraus keine ebenso konkrete und nachvollziehbare Anbieterkennzeichnung; eine unveränderte Übernahme würde die inzwischen bestätigten Vereinsangaben nicht abbilden. Eine abschließende rechtliche Bewertung der Altseite ist damit nicht verbunden. | Das neue Impressum führt die bestätigten Anbieter-, Vertretungs- und Registerangaben ohne generische Alt-Disclaimer auf. Offene Angaben und rechtliche Veröffentlichungsfragen werden intern geprüft. | Teilweise behoben – Impressum integriert; Vereins-E-Mail und fachliche Freigabe vor Veröffentlichung offen. |
| ALT-007 | Ältere Veranstaltungsinhalte sind auf der bisherigen Website ohne ausreichend klare chronologische Archivstruktur eingebunden. | Die zeitliche Zuordnung ist allein aus der Seitenposition nicht zuverlässig möglich; historische Ereignisse können dadurch schwer auffindbar oder missverständlich eingeordnet sein. | Das reguläre Veranstaltungsarchiv beginnt grundsätzlich mit 2024. Ältere historisch bedeutsame Ereignisse werden nach redaktioneller Prüfung als datierte Stationen in die Vereinsgeschichte eingeordnet. | Teilweise behoben – das 30-jährige Vereinsjubiläum von 2022 ist als Chronikstation aufbereitet; die Regel gilt bei weiteren Altinhalten fort. |
| ALT-008 | Die vier Aufnahmen der bisherigen Seite „Raumschießanlage“ besitzen weder Alternativtexte noch Bildunterschriften; die zweite Luftgewehraufnahme konnte dadurch bei der Migration zunächst fälschlich als Darstellung der Duellscheiben eingeordnet werden. | Bildinhalt und Anlagenbereich sind für Besucher und bei einer späteren Datenpflege nicht zuverlässig unterscheidbar; für assistive Technik fehlt jede inhaltliche Bezeichnung. | Die neue Anlagen-Seite verwendet vom Auftraggeber bestätigte Zuordnungen, sachliche Alternativtexte und Bildunterschriften. Das Medieninventar hält Quelle, Inhalt und Prüfsumme eindeutig fest. | Behoben für die vier übernommenen Anlagenbilder; weiteres Material wird nur nach bestätigter Zuordnung ergänzt. |

## Datenschutz- und Rechtseinordnung des Initialbestands

Die technische Datenschutz-Voranalyse und LEGAL-DAT-001 haben die für die neue
Website tatsächlich implementierten beziehungsweise verbindlich geplanten
Dienste abgegrenzt. Der Befund ALT-005 beschreibt ausschließlich die daraus
belegbare fehlende technische Passung der alten Jimdo-Datenschutzdarstellung.
Er enthält weder eine abschließende rechtliche Gesamtprüfung der bisherigen
Website noch die Behauptung eines Rechtsverstoßes.

## Nachweise zum Initialbestand

- [Historische Medienquellen der Vereinsgeschichte](migration/HISTORISCHE_MEDIENQUELLEN.md)
- [Medienquellen der Schützenkönige](migration/SCHUETZENKOENIG_MEDIENQUELLEN.md)
- [Medienquellen der Schießbahnen und des Vereinshauses](migration/RAUMSCHIESSANLAGE_MEDIENQUELLEN.md)
- [Technische Projektdokumentation](TECHNISCHE_PROJEKTDOKUMENTATION.md)
- [Changelog](04_CHANGELOG.md)
- [Offene Prüfpunkte](07_OFFENE_PRUEFPUNKTE.md)
