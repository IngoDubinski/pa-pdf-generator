# GitHub Pages – PA-Tools v1.6.3

1. ZIP `PA_Tools_Web_v1.6.3_KOMPLETT.zip` entpacken und den **Inhalt des Unterordners** `PA_Tools_Web_v1.6.3/` in das Root-Verzeichnis des vorhandenen GitHub-Pages-Repositories kopieren. `index.html`, `tool.html`, `ep-generator.html`, `.js`, `.css`, `Vorlagen/` und `js/` müssen im selben Verzeichnisaufbau liegen.
2. Unter `index.html` liegen beide Anwendungen nebeneinander, mit den bisherigen freigegebenen Links bzw. Admin-Dauerlink. `tool.html` = PA-Drucktool, `ep-generator.html` = neuer EP Generator.
3. Versionsangabe des Portals: **v1.6.3 / 14.11.2026**; EP Generator Web **v0.2.2**. Hard Reload (`Strg`+`F5`) nach Deployment.
4. **Nie ausgefüllte KP/PV, Schülerlisten, echte Unterschriftsbilder oder erzeugte EP ins Repository hochladen.** In `Vorlagen/` liegen nur nicht ausgefüllte Originale.
5. **Wichtige Einschränkung:** Die Linkverwaltung auf statischem GitHub Pages ist keine sichere serverseitige Anmeldung. Schülerdaten bleiben auf dem Endgerät, aber der veröffentlichte Quellcode und die leeren Vorlagen sind öffentlich abrufbar.
6. **Einschränkung v0.2.0:** Der EP-Webimport liest Excel-Klassenblätter (.xlsx). SaxSVS-Text-PDF-Import ist in der lokalen Thonny-Fassung verfügbar; für den Web-EP noch nicht eingebaut. Die vorhandene PA-Drucktool-SaxSVS-Funktion bleibt erhalten.
7. Nach dem Upload `ep-generator.html` mit einer **anonymisierten** Excel-Probeliste, KP/PV-Testdokumenten und Adobe Reader unter Windows prüfen.

## Hinweis v1.6.1
Beide neuen Platzhalter-Dateien `ep-seite2.html` und `antrag-be.html` hochladen; `access.js`, `tool-nav.js`, `style.css` und `index.html` aktualisieren. Öffentliche Startseite `index.html` ohne `?key=` sowie mit einem abgelaufenen Gastlink testen; Gastlink soll „EP 2. Seite“, aber **nicht** „Antrag BE“ zeigen. Admin-Dauerlink soll beide Platzhalter zeigen. Browser-Cache bei Bedarf mit Strg+F5 aktualisieren. Der „Antrag BE“-Bereich ist nur clientseitig verborgen; echte Admin-Zugriffssicherheit erfordert eine Serverlösung.

### Test: öffentliche Landing-Page
Vorhandenes `index.html` und `tool-nav.js` ersetzen. Ohne `?key` und im privaten Browserfenster dürfen **keine Tool-Kacheln, Diagramme oder internen Navigationslinks** erscheinen. Danach mit gültigem Freigabelink und Admin-Dauerlink testen: Werkzeuge sichtbar, „Antrag BE“ nur für Admin. Nach Upload ggf. Strg+F5.

## Update auf v1.6.2 – EP-Formularlinien
- Alle Dateien aus dem ZIP im Repo ersetzen (die Ordner `js/`, `Vorlagen/` und `Archiv/` beibehalten).
- `ep-core.js` und `ep-generator.html` **unbedingt beide** aktualisieren; die URL `ep-core.js?v=201` verhindert altes Browser-Caching.
- Webseite neu laden (`Strg+F5`), EP-PDFs neu erstellen; alte Downloads bleiben unverändert.
- Prüfung in Firefox und Edge, **auch ausgedruckt**: BO-Tabelle Seite 2, alle Zeilen- und Spaltengrenzen, drei Ankreuzfelder pro Zeile; Nachtragen in Formularfeldern.

## Update auf v1.6.3 – Ladeanzeige / neuer Browser-Tab
- Vollständiges ZIP ausrollen (nicht nur `ep-app.js`), da neu auch `progress-ui.js` und `progress-ui.css` benötigt werden.
- Website mit **Strg+F5** aktualisieren. Bei EP-Klassendruck wird kein leerer Tab mehr geöffnet. Stattdessen nach Abschluss auf **„PDF öffnen / drucken“** klicken.
- Beide Werkzeuge zeigen beim Erzeugen von PDFs und ZIPs eine Fortschrittsanzeige.
- Ein Netzwerktest auf GitHub Pages und Windows-Drucktest stehen aus; die Chromium-Offline-Integrationstests bestanden.
