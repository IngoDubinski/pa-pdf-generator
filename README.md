# PA-Tools Web v1.6.0 – 12.11.2026

Dieses ZIP ist das vollständige **GitHub-Pages-Root-Verzeichnis**. Inhalt direkt ins Repository `IngoDubinski/pa-pdf-generator` hochladen (kein Unterordner für die gesamte Website). `index.html` ist das gemeinsame Portal. Das bisherige `tool.html` bleibt das PA-Drucktool; `ep-generator.html` ist die neue EP-Anwendung.

## Inhalte
- PA-Drucktool: BB, BKB, SE, Blanko (unveränderte PDF-Engine).
- EP Generator Web v0.2.0: Excel-Schülerliste (erste Spalte Schüler-ID), importierte KP/PV-Sammel-PDFs, automatische ID-/Klassenprüfung, Fremdeinschätzung 4/5, ausfüllbarer zweitseitiger EP, Name/Unterschrift, A–Z/Z–A, Klassen-PDF und drei ZIP-Dateiablagen.
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
