# PA-Tools v1.6.3 · EP Web v0.2.2 (14.11.2026)
# Weiterarbeit – PA-Tools Web v1.6.0, EP Generator Web v0.2.0

**Ziel:** bestehende GitHub-Pages-Anwendung (PA-Drucktool) stabil halten und EP Generator lokal/browserintern weiterentwickeln. Aktuelle Dateien: `tool.html`, `ep-generator.html`, `ep-core.js`, `ep-app.js`, `js/pdf-lib.min.js`, `js/jszip.min.js`, `Vorlagen/`.

**Datenschutz:** Nur leere Vorlagen auf GitHub. Echte Schülerlisten, KP/PV-Sammel-PDFs und Unterschrift niemals uploaden. Die Offline-Python-Version hat eigene Quellen `ep_core.py` und `ep_gui.py`.

**EP:** Schüler-ID ist Excel Spalte A und Profil-AC-ID. Keine Zuordnung nach PDF-Seitenposition. KP/PV können fehlen, EP trotzdem erstellen. KP/PV niemals neu berechnen, nur annotieren. Grüne Fremdeinschätzung 4/5 liefert persönliche Stärken; vorhandenes KP mit Werten <=3 erzeugt leere Stärkenliste, kein Fehlertext. EP als PDF ausfüllbar und mit zwei Seiten; NIE flatten. Mitarbeitername auf EP neben der Beschriftung UNTER der Unterschriftslinie, handschriftliche Unterschrift darüber. Signaturbild optional lokal in IndexedDB. Ziele vorgefüllt, pro Klasse innerhalb der Sitzung editierbar und auf weitere Klasse übertragbar. BO-Daten mit Datum TT.MM.JJ und Ort „Schule“.

**Ausgabe:** eine ausgewählte Klasse, EP/KP/PV beliebig kombiniert, Klassendruck A-Z/Z-A als Sammel-PDF, Dateiausgabe ZIP mit Klassenordner und 3 Strukturen (pro Schüler, pro Dokumentart, pro Schüler zusammengeführt). Die Webversion speichert ZIP im Downloads-Ordner, kann ohne Browserberechtigung aber keine Ordner direkt auf dem Computer erzeugen.

**Offene Arbeiten:** SaxSVS-PDF-Erkennung im Browser, PDF.js-basiertes robusteres PDF-Parsing bei alternativen Profil-AC-Versionen, Adobe-Reader-Formular-/Drucktest, erweitertes UI und automatisch prüfbare Browser-E2E-Tests. Aktuelle PDF-Grafik-/CMap-Erkennung ist auf die vom Nutzer gelieferten KP/PV-Exporte abgestimmt, JS-Syntax und Node-/PDF-Tests waren erfolgreich. Chromium-E2E war in der Tool-Umgebung durch Administratorsperre nicht möglich.

## Weiterarbeit ab v1.6.1 · 14.11.2026
Neue Seiten: `ep-seite2.html` (alle gültigen Freigabelinks) und `antrag-be.html` (nur Admin-Dauerlink, clientseitige Sichtbarkeit). Inhalte noch offen; nichts selbst erfinden. `index.html` ist die öffentliche Landing-Page auch für abgelaufene/fehlende Links, mit Produktinfos, Datenschutz und BulkPDF-Inspiration. `access.js` und `tool-nav.js` regeln clientseitig die Sichtbarkeit (niemals als sichere Authentisierung bezeichnen). Projektideen enthalten Word-Varianten. Die Fachlogik des PA-Drucktools und EP Generators bleibt gegenüber v1.6.0 unverändert. Nächster Schritt: Nutzer testet GitHub Pages, insbesondere Gastlink/Adminlink/abgelaufenen Link und die EP-PDF-Ausgabe.

## Landing-Page-Korrektur in v1.6.1
Bei fehlenden, ungültigen oder abgelaufenen Links nur einen öffentlichen Einführungstext anzeigen (Zweck der PA-Tools, persönliche Freigabelinks, lokale Datenverarbeitung, Open Source/BulkPDF). Portal, Schaubild und Navigation sind bereits im HTML `hidden` und werden erst durch `tool-nav.js` mit gültigem Link eingeblendet. Keine Kachel oder Admin-Information für Gäste anzeigen. Titel und bestehende Versionsnummer unverändert.

## Seit v1.6.2: Wichtige EP-PDF-Layoutkorrektur
Die re-konstruierten AcroForm-Felder in `ep-core.js/mergePdf` müssen einen **transparenten Hintergrund** haben. Nur Checkboxen benötigen zusätzlich eine schwarze sichtbare Umrandung. Sonst verdeckt pdf-lib mit Standard-weiß wichtige Linien der EP-Vorlage (BO-Tabelle Seite 2). Regressionstest `node --test Tests/test_ep_form_transparency.js`; ausfüllbar lassen und benutzerspezifische Feldnamen sichern. Siehe `CHANGELOG.md`.

## Neu v1.6.3 – Web-Fortschrittsanzeige und Drucktab
- `progress-ui.js` + `progress-ui.css` sind für beide Tools verbindliche Abhängigkeiten. `PAProgress.connect('epProgress'|'paProgress')` erstellt Controller mit `.start()`, `.update()`, `.finish()`, `.fail()`.
- EP `scan` meldet KP/PV-Seitenfortschritt; `ep-core.js` indexPdfs und mergePdf haben optionale Fortschrittscallbacks. EP-Ausfüllbarkeit und Transparenz der PDF-Widgetflächen nicht gefährden.
- EP-Klassendruck ruft **kein `window.open`** mehr auf. Erst nach PDF-Erstellung wird der Blob-Link mit `target=_blank` **auf einen ausdrücklichen Klick** bereitgestellt. Lokales Download-Verhalten unverändert.
- PA-Drucktool PDF-Erzeugung meldet Dokument-/Schülerfortschritt und den ZIP-Kompressionsfortschritt; Fachlogik (BB/BKB/SE) unverändert.
- `Tests/test_progress_ui.js` plus `Tests/test_ep_form_transparency.js` testen wesentliche Eigenschaften. Chromium ohne Netzwerkzugriff erfolgreich auf Dummydateien, Live-GitHub-/Firefox-Drucktest weiter offen.
- Webpaket immer vollständig einschließlich sämtlicher Vorlagen/Archiv/Quellcode/Prompts liefern; keine echten Schülerdaten auf GitHub.
