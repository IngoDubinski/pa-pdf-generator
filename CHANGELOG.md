## PA-Tools v1.6.7 / Antrag BE v0.1.0 (15.11.2026)

- Admin-exklusives Werkzeug für Betriebserkundungen: Eingabemaske, Excel-Schülerauswahl, bearbeitbare DOCX/XLSX-Unterlagen, Original-Schulleitungsantrag, separate TN-Anlage, Gesamtdruck-PDF und Veranstaltung.json.
- Alle Schülerdaten lokal im Browser; ZIP-Ausgabe je Veranstaltung; nicht automatisch in festen Windows-Ordner.
- Microsoft Forms bleibt spätere Ausbaustufe; Praxistest noch offen. Siehe ANTRAG_BE_V010_ANLEITUNG.md.

## PA-Tools Web v1.6.5 / EP Generator Web v0.2.5 (15.11.2026)

- Info/Hilfe als aufklappbares Menü (Vorlagen, Anleitung, Quellcode, Schaubild, Projektideen, Tipp) statt sechs einzelner Links.
- Hinweise auf Einmalcodes/Passwörter auch für nicht teilnehmende Schüler; sichere ID-Zuordnung zu Excel.
- Enthält die vorherige BO-Zusatzeinträge-Erweiterung v0.2.4 und die Nr.-Sortierung aus den Mini-Updates.

# Änderungsübersicht

## v1.6.4 – 14.11.2026
- **EP Generator Web v0.2.3:** Ausklappbarer Einzeldruckmodus mit eigener Klassenwahl, Suche nach Namen/ID, Checkboxen für einzelne/mehrere Schüler und gemeinsamer druckbarer Auswahl-PDF. Klassendruck bleibt Standard und druckt weiterhin immer die ganze Klasse.
- Fachlogik gleich: EP/KP/PV wählbar, A–Z/Z–A, ID-basierte KP-/PV-Zuordnung, kein leerer neuer Tab, bearbeitbare EP-Formulare, lokale Datenverarbeitung.
- Upload-Bezeichnungen „Kompetenzprofile“ und „Profilvergleiche“ ohne Kürzel, darunter klein „Mehrere Einzel-PDFs oder Sammel-PDFs möglich“.
- Neu `ep-selection.js`, `Tests/test_ep_single_print.js`; insgesamt 13 Node-Regressionstests bestanden. Offline-Browser-Dummytest mit 7a und 7b (Einzel- und Klassendruck) bestanden.
- Alle Web-Versionsangaben, Anleitungen, Weiterarbeit-Prompt und Cache-Parameter aktualisiert; PA-Drucktool selbst unverändert.


- v1.4.5 (09.11.2026): BKB-Feld `Aufgaben` mit automatischer Schriftverkleinerung; freigegebene Datenflussgrafik auf Anleitung und Transparenz; Excel-Dummy-Vorlage als Download; erledigte Projektideen entfernt und Vorlagenschutz als Idee ergänzt; Dokumentation aktualisiert; lokales Thonny-Paket synchronisiert.
- v1.4.4: automatische wechselnde Zuordnung der Gruppenpaare 1/2, 3/4, 5/6 zu Aufgabenblöcken.
- v1.4.3: optionaler Klassenverbund mit Beobachter-/Aufgabenzuordnung.
- v1.4.2: SE-Durchstreichung der sechs Merkmale einschließlich Skalenfelder.

## v1.4.6 (10.11.2026)
- Dezenter Dark-Mode-Schalter oben auf den Seiten, lokale Speicherung der Einstellung.
- Optionaler Blanko-BB-Generator: Aufgabe/AK auswählen, Kriterien setzen, keine Namen/Datum/Gruppe; kein Excel-Import erforderlich.
- Druck-Hinweis Firefox bzw. Adobe „Als Bild drucken“ in Anleitung.
- Viewerübergreifende PDF-Druckkompatibilität weiterhin offen; kein behaupteter Bugfix.

## v1.4.7 (10.11.2026)
- Blanko-Vorlagen jetzt für BB, BKB und SE. BKB ohne Aufgaben und persönliche Angaben, SE mit optionaler Kürzung.
- Dark-Mode-Schalter unverändert groß.

## v1.4.8 (10.11.2026)
- Letzte Aufgabenwahl, PDF-Modus und Sortierung lokal im Browser merken (localStorage). Keine Schülerdaten gespeichert.
- Erledigte Ideen Blanko-Bögen und Letzte Einstellungen merken aus Projektideen entfernt.
- PDF-Druckprobleme anderer Viewer werden später untersucht.

## v1.4.9 (10.11.2026)
- Hell/Dunkel wird wie bisher im Browser gespeichert.
- Einheitliche Signatur und Version mit Datum auf allen Seiten mit Kopfbereich.

## v1.5.0 (10.11.2026)
- Drei Arbeitswege: Klassenweise, Einzeldruck, Blanko-Vorlagen.
- SE-Kürzung wird lokal gemerkt.
- Aufgabenprüfknopf entfernt; direkte Prüfung bleibt.
- Eigene PDF-Vorlagen mit genauen Dateinamen erklärt.
- Farbschalter tiefer; Versionsanzeige auf allen HTML-Seiten aktualisiert.

- Bedienung: mehr Abstand zwischen Arbeitswegen; Blanko ohne Schülerdatenimport und ohne Klassen-Einstellungen, mit eigenem PDF-Modus. Versionsanzeige bleibt v1.5.0.

Blanko-Optionen (v1.5.0): Ausklappbereich für PDF-Modus, optionales PA-Datum und optionale BKB-Aufgabenliste. Keine Schülerliste erforderlich.

Blanko-Optionen: SE-Kürzung als standardmäßig aktivierte Checkbox im ausklappbaren Bereich „Optionale Angaben“.

Blanko-Erweiterung: BKB-Aufgabenauswahl direkt sichtbar, AC-Einheit optional, PA-Datum lokal gespeichert. Versionsnummer bleibt v1.5.0.

Blanko-BKB: optional 0 oder genau 6 Aufgaben (2 je AK I–III). Blanko-PA-Datum und AC-Einheit werden für BB/BKB lokal gemerkt. Version bleibt v1.5.0.

Blanko BB/BKB: AC-Einheit direkt sichtbar, im Original-PDF-Feld „AC Einheit“ eingetragen und lokal gespeichert. Version weiterhin v1.5.0.

Projektidee (noch nicht umgesetzt): PDF-Kompatibilität mit Adobe Acrobat Reader verbessern bzw. Darstellungs- und Druckprobleme beheben.


## PA-Tools v1.6.0 · 12.11.2026
- PA-Drucktool bleibt funktional erhalten; EP Generator v0.2.0 als eigener GitHub-Pages-Bereich hinzugefügt.
- EP: browserlokaler Excel-Import, KP-/PV-ID-Abgleich, grüne Fremdeinschätzungswerte 4–5, bearbeitbare EP-PDF, optional signierte Namenszeilen, Klassendruck und ZIP-Dateiausgabe.
- Alle leeren Vorlagen öffentlich verfügbar (BB/BKB/SE/EP PDF und EP Word-Referenz); keine echten KP/PV oder Schülerdaten.
- Gemeinsames Portal, Quellcode, Datenschutzhinweise, Datenfluss-Schaubild und Versionsangabe aktualisiert.
- Offene Einschränkung: SaxSVS-PDF-Import weiterhin nur im lokalen Python-Programm; JavaScript-KP/PV-Parser auf bereitgestellte Profil-AC-PDFs zugeschnitten.

## PA-Tools v1.6.1 · 14.11.2026
- Öffentliche Landing-Page wiederhergestellt und als Einführung ausgebaut (auch nach Linkablauf), mit lokalen Datenschutzhinweisen und BulkPDF-Inspiration.
- Tool-Platzhalter „EP 2. Seite“ für gültige Freigabelinks und „Antrag BE“ für Admin-Dauerlink ergänzt; fachliche Funktionen bleiben in Vorbereitung.
- Word-/DOCX-Ausgabe als Projektidee ergänzt.
- Einheitliche Versionsangaben und Browser-Cache-Busting aktualisiert. Keine Änderungen an der bestehenden PDF-Erzeugung.

### v1.6.1 – Korrektur der öffentlichen Startseite (14.11.2026)
- Ohne gültigen Freigabelink (auch bei abgelaufenen Links) enthält die sichtbare Landing-Page **nur** Projektbeschreibung, Hinweis auf persönliche Freigabelinks, lokale Datenverarbeitung und BulkPDF-Link.
- Tool-Portal, interne Tool-Kacheln, Navigationslinks auf weitere Seiten und technisches Schaubild bleiben vor dem JavaScript-Start mittels HTML-Attribut `hidden` verborgen; sie werden nur bei gültigem Link eingeblendet.
- Bestehendes Verhalten von PA-Drucktool, EP Generator, EP 2. Seite und Admin-Tool unverändert; Versionsnummer bleibt 1.6.1.

## PA-Tools Web v1.6.2 · 14.11.2026
- **EP Generator Web v0.2.1**: PDF-Formularfelder werden beim Zusammenführen transparent statt weiß rekonstruiert. Fehlerhaft verdeckte Tabellen- und Trennlinien (insbesondere Seite 2) sind wieder sichtbar.
- Checkboxen behalten schwarze Umrandungen ohne verdeckende weiße Fläche. Ausfüllbarkeit und eindeutige Feldnamen bleiben erhalten.
- Neue automatische Regressionstests für Einzel- und Mehrschüler-PDFs; Version und Skript-Cache auf allen Webseiten aktualisiert.
- PA-Drucktool, Landing-Page und Linksteuerung ansonsten unverändert.


## v1.6.3 – 14.11.2026
- PA-Drucktool und EP Generator Web: neue Fortschrittsanzeige mit Prozent, animierter Sanduhr, aktuell bearbeiteter Schüler-/Dokumentphase und ZIP-Kompressionsfortschritt; automatisch auf 100 % erst nach erfolgreichem Downloadstart.
- EP Generator Web jetzt v0.2.2; kein automatisch geöffnetes leeres Druckfenster mehr. PDF nach Abschluss als Download plus Button „PDF öffnen / drucken“.
- Neue browserseitige Tests ohne Webzugriff: 8-seitige EP-Klassen-PDF, EP-ZIP (4 PDFs), PA-Einzeldruck-ZIP jeweils erfolgreich; alle ohne personenbezogene Echtdaten.
- Node.js-Regressionstests für Fortschritt, Fehlzustand, PDF-Seiten- und Dokumentmeldungen ergänzt. Keine Änderung an der PDF-Formular-/Rasterkorrektur aus v1.6.2.

## PA-Tools Web v1.6.6 / EP 2. Seite v0.1.0 (15.11.2026)

- Platzhalter EP 2. Seite durch lokal arbeitenden Fortschreibungseditor ersetzt.
- Einzel- und Ordner-PDF-Import, Klassenmodus oder freie klassenübergreifende Mehrfachauswahl, Pflichtfelder Datum/Titel, Ort Schule, Smiley, Notizen.
- Sicherheitsregel: letzte belegte BO-Zeile bestimmen, ausschließlich in die *nächste* freie Zeile schreiben; keine früheren Lücken auffüllen, keine Originaldateien verändern.
- ZIP- oder unterstützte Ordnerausgabe mit Kollisionsschutz; ausfüllbare Einzel-PDFs. Separater Sammeldruck für neue Einträge oder alle eingelesenen Dokumente.
- Microsoft-Forms-/Excel-Import für spätere Version vorgesehen.
