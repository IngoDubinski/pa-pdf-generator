# Änderungsübersicht

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
