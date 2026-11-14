# EP Generator Web – Testcheckliste v0.2.2

- [ ] Über freigegebenen Link bzw. Admin-Dauerlink zum EP Generator navigieren
- [ ] Excel-Schülerliste (7a/7b) einlesen; nur ausgewählte Klasse wird verarbeitet
- [ ] KP-/PV-Sammel-PDFs aus mehreren Dateien zuordnen, übersprungene IDs korrekt behandeln
- [ ] KP-Fremdeinschätzungswerte 4/5 werden als Stärken eingetragen, niedrigere Werte nicht
- [ ] Ohne KP entsteht trotzdem EP mit Hinweis; kein KP/PV wird neu erzeugt
- [ ] Schulname, Mitarbeitername und Bildunterschrift optional lokal speichern
- [ ] Ziele werden als editierbarer Vorschlag zwischen Klassen übernommen
- [ ] EP-Seite 1/2, Ziele und sechs BO-Aktivitäten prüfen
- [ ] Klassensammel-PDF mit EP/KP/PV und A–Z/Z–A prüfen
- [ ] ZIP mit Schüler-Unterordnern, Dokumentart-Unterordnern, zusammengefassten Schüler-PDFs
- [ ] EP-Formularfelder in Adobe Reader nach Speichern erneut bearbeiten
- [ ] Firefox-Schnelltest und Windows-Druckdialog

Hinweis: Automatischer Browser-End-to-End-Test war in dieser Erstellungsumgebung technisch nicht möglich; PDF-Engine separat auf realen Beispiel-PDFs geprüft.

## Regression EP-PDF-Raster (v0.2.1 / 14.11.2026)
- [ ] Klassendruck (mindestens 2 Schüler): EP Seite 2 mit **vollständigen schwarzen Rasterlinien** und sichtbaren 3 Kästchen pro BO-Zeile in Firefox und Edge öffnen.
- [ ] Eine BO-Aktivität mit Datum und Ort, weitere Zeilen leer; Linien auch durch leere Formularfelder erkennbar.
- [ ] Papierdruck prüfen: horizontale Trennlinien und Checkbox-Rahmen vollständig.
- [ ] EP-Felder nach Ausgabe bearbeiten und speichern; getrennte Schüler dürfen keine Werte spiegeln.
- [ ] Mit ZIP-Dateiausgabe „zusammengefasst je Schüler“ und Klassendruck dieselbe Darstellung prüfen.
- [x] Entwickler-Test: `node --test Tests/test_ep_form_transparency.js`


## v1.6.3: Fortschrittsanzeige / Druckablauf (14.11.2026)
- [ ] Nach „Ausgabe erstellen“ erscheint sofort die Sanduhr und **0 %**; der Prozentwert steigt mit der Bearbeitung.
- [ ] EP-Klassen-PDF: Fortschritt für KP/PV-Seiten, bearbeitete Schüler, Zusammenführung; am Schluss **100 %**.
- [ ] EP-ZIP: Fortschritt beim Packen bis **100 %**, Download vollständig und lesbar.
- [ ] Kein neuer Tab beim Klick auf „Ausgabe erstellen“; nur nach Fertigstellung über den Link „PDF öffnen / drucken“.
- [ ] EP-Formularfelder und BO-Rasterlinien in Firefox, Edge und nach dem Drucken weiterhin intakt.
- [ ] PA-Drucktool Klassen- und Einzeldruck-ZIP: sichtbarer Prozentfortschritt und Datei korrekt.
- [ ] Bei absichtlicher Fehlkonfiguration zeigt die Anzeige einen Fehler, nicht irreführend 100 %.
- [x] Automatisierte Offline-Browserprüfung mit Dummy-Excel: EP-Klassen-PDF und EP-ZIP, PA-Einzeldruck-ZIP, keine zusätzlichen Tabs.
- [x] JavaScript-Tests: `node --test Tests/*.js`.
