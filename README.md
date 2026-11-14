# PA-Tools Web v1.6.2 – 14.11.2026

Dieses ZIP ist das vollständige **GitHub-Pages-Root-Verzeichnis**. Inhalt direkt ins Repository `IngoDubinski/pa-pdf-generator` hochladen (kein Unterordner für die gesamte Website). `index.html` ist das gemeinsame Portal. Das bisherige `tool.html` bleibt das PA-Drucktool; `ep-generator.html` ist die neue EP-Anwendung.

## Inhalte
- PA-Drucktool: BB, BKB, SE, Blanko (unveränderte PDF-Engine).
- EP Generator Web v0.2.1: Excel-Schülerliste (erste Spalte Schüler-ID), importierte KP/PV-Sammel-PDFs, automatische ID-/Klassenprüfung, Fremdeinschätzung 4/5, ausfüllbarer zweitseitiger EP, Name/Unterschrift, A–Z/Z–A, Klassen-PDF und drei ZIP-Dateiablagen.
- Leere EP-Originale (ausfüllbare PDF + Word-Referenz) in `Vorlagen/EP/`; BB/BKB/SE und Matrix in `Vorlagen/`.
- Originale KP/PV sind **Ergebnisdokumente mit personenbezogenen Daten**, deshalb nicht enthalten und niemals ins Repository hochladen.

## Bedienung
1. Über `admin.html` Freigabelink oder Admin-Dauerlink erstellen. Bei GitHub Pages sind die Links nur eine clientseitige Zugangshürde, **kein serverseitiger Authentisierungsschutz**.
2. `index.html` mit dem Link öffnen; beide Werkzeuge sind über die Portal-Kacheln und Navigationsleiste erreichbar.
3. EP: Excel mit Klassenreitern und eindeutigen Nummern in Spalte A wählen; vorhandene KP/PV-PDFs laden; genau eine Klasse auswählen; Schule angeben, optional Mitarbeitername und Unterschrift; Ziele/BO-Daten anpassen; prüfen; PDFs erstellen.
4. Sofortdruck: das Klassen-Sammel-PDF wird heruntergeladen und – falls der Browser Pop-ups zulässt – in neuem Tab geöffnet; dort STRG+P. Direkte Druckerauswahl ohne Browser-Dialog ist nicht möglich.
5. Dateiausgabe: ZIP wird im Downloadordner abgelegt; darin ein Klassenordner und die ausgewählte Ordner-/Zusammenführungsstruktur. Browser dürfen nicht beliebig automatisch Verzeichnisse im Downloads-Ordner anlegen.

## Aktuelle Grenzen
- SaxSVS-**PDF**-Import im EP Generator derzeit nur in der lokalen Python-/Thonny-Version, nicht in der Webversion.
- Der Web-Parser wurde mit den bereitgestellten Profil-AC-Sachsen-PDFs getestet. Bei anderen PDF-Exportvarianten IDs, Zuordnung und Stärken vor produktiver Nutzung stichprobenartig überprüfen.
- Die erzeugten EP-PDF-Formularfelder bleiben bearbeitbar; Adobe Reader muss im echten Windows-Test geprüft werden.
- Studenteninformationen werden im Browser nur während der geöffneten Sitzung verarbeitet. Schulname und Mitarbeitername lokal gespeichert; optionales Unterschriftsbild lokal in IndexedDB. Keine Schülerdaten-Uploads.
- Nicht aus öffentlichen URLs auf echten Datenschutz durch Link-Geheimhaltung schließen; der gesamte Website-Quellcode ist öffentlich.

Die komplette Python-Variante wird als eigenes ZIP bereitgestellt. `architektur.html`, `quellcode.html` und `WEITERARBEIT_PROMPT.md` dokumentieren die Arbeitsweise.

## Neues in v1.6.1 (14.11.2026)
- Gemeinsame **öffentliche Landing-Page** `index.html` auch ohne Freigabelink oder nach Ablauf; direkte Links auf die Tools führen bei ungültigen Links dorthin zurück und nennen den Grund.
- **EP 2. Seite**: Platzhalter `ep-seite2.html` für alle Nutzer mit gültigem Gast- oder Admin-Link; noch keine Verarbeitung.
- **Antrag BE**: Platzhalter `antrag-be.html` ausschließlich bei aktivem Admin-Dauerlink sichtbar. Andere Besucher sehen weder Portal-Kachel noch Navigationseintrag; die Platzhalterseite leitet sie zur Landing-Page weiter. **Dies ist kein sicherer serverseitiger Zugriffsschutz.**
- Word-/DOCX-Varianten in Projektideen aufgenommen.
- Die öffentlich lesbare Startseite beschreibt die lokalen Datenschutzprinzipien und verweist auf BulkPDF als Inspiration.
- **Es sind keinerlei Schülerdaten enthalten**. Alle PDF- und Word-Originalvorlagen für aktuell funktionierende Module sind im Ordner `Vorlagen/` enthalten.

### Sichtbarkeit der Landing-Page (v1.6.1 Korrektur)
Ohne gültigen Link oder bei abgelaufenem Link zeigt `index.html` ausschließlich die neutrale öffentliche Projektinformation. **Keine Tool-Kacheln, internen Navigationseinträge oder Schaubilder.** Mit gültigem Freigabelink erscheinen die freigegebenen Werkzeuge, mit Admin-Dauerlink zusätzlich „Antrag BE“. Diese clientseitige Sichtbarkeitsregel ist **kein echter serverseitiger Zugriffsschutz**.

## Neu in v1.6.2 (14.11.2026) – EP-PDF-Linien

Beim Zusammenfügen von Entwicklungsplänen (Klassendruck, mehrere Dokumente in einer PDF) wurden die AcroForm-Textfelder durch pdf-lib mit **weißem, undurchsichtigem Hintergrund** neu erzeugt. Sie überdeckten Teile des Rasters, insbesondere BO-Aktivitäten auf Seite 2.

- Neue Textfelder ausdrücklich **ohne Hintergrund und ohne Rand**; die Linien sind Bestandteil des PDF-Originals und bleiben sichtbar.
- Checkboxen **ohne Hintergrund, aber mit schwarzer Umrandung**, damit die Bewertungs-Kästchen sichtbar bleiben.
- Alle Felder weiterhin ausfüllbar; Feldnamen je Schüler eindeutig.
- Regressionstest: `node --test Tests/test_ep_form_transparency.js` (Node.js optional nur für Entwicklung).
- Nach GitHub-Upload die Website mit **Strg+F5** neu laden, um die neue `ep-core.js?v=201` zu laden.
- **Bereits heruntergeladene PDFs werden nicht rückwirkend geändert**; die gewünschten Dokumente bitte neu erzeugen.
