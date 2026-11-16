# PA-Tools v1.6.9 · 16.11.2026

## EP-Generator
- Vorbelegte, vollständig löschbare und bearbeitbare Ziele der beruflichen Orientierung (optional).
- Kompetenzprofile und Profilvergleiche: beschreibende Hinweise zu automatischer Beschriftung/Übernahme der Stärken.

## Antrag BE v0.1.2
- Einverständniserklärungen je Schüler abhaken, Rücklaufzähler, JSON v2 mit Veranstaltung/Teilnehmerauswahl/EV-Status.
- JSON v1 bleibt lesbar. Bei Import einer gespeicherten JSON vor der Excel-Liste werden die Schüler nach Import zugeordnet.
- Schulleitungsantrag: zusätzliches Word-Datumsfeld deaktiviert, Teilnehmerliste mit Seitenumbruch vor der Überschrift statt leerer Seite.
- Excel: einheitliche Datenzeilen nach originaler Musterzeile 8; Fußbereich an variable Teilnehmerzahl angepasst.

## Gemeinsame Beispieldaten
- Neue Datei `Vorlagen/Klassenlisten Dummydaten_7a-8c.xlsx` mit fiktiven Daten für sechs Klassen.
- Buttons „Testdaten laden“ und „Beispiel-Excel herunterladen“ in tool.html, ep-generator.html und antrag-be.html.
- Alte eingebettete Testdatei (testdatei.js) entfällt.

## Hinweise
- Excel- und Word-Dateien werden nur im Browser erzeugt; bitte das Druckbild mit den eigenen Office-Versionen prüfen.
- Die Originalvorlagen bleiben Grundlage; kein Layout-Neudesign, kein Gesamtdruck.
- Ein Browser-End-to-End-Test konnte in der Erstellumgebung wegen gesperrter lokaler Browsernavigation nicht abgeschlossen werden.
