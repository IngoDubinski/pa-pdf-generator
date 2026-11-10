# PA-Drucktool – GitHub-Pages-Webversion v1.4.5

Stand 09.11.2026. Browseranwendung für die Potenzialanalyse (BB, BKB, SE). Vollständige Original-PDF-Vorlagen im Ordner `Vorlagen/`. Programmcode und Bibliotheken sind im Projekt enthalten. Die Schul-/Schülerdaten werden ausschließlich im Browser eingelesen und zu PDFs verarbeitet; es gibt keinen vorgesehenen Upload dieser Daten. Beim Laden der Seite werden Programmdateien und PDF-Vorlagen vom GitHub-Server heruntergeladen. Das öffentliche Repository und clientseitige Gastlinks bieten **keinen echten Zugriffsschutz** auf die Vorlagen.

## Installation
Den gesamten Inhalt dieses Verzeichnisses in das GitHub-Pages-Repository kopieren; GitHub Pages mit `index.html` im Repository-Root betreiben. `tool.html` enthält das Drucktool, `excel-anleitung.html` die Anleitung, `quellcode.html` Transparenzhinweise. `admin.html` ist ausschließlich für die Online-Verwaltung der Gastlinks gedacht. Keine GitHub-Tokens oder realen Schülerdaten ins Repository übernehmen.

## Funktionen
Excel-Import, SaxSVS-PDF-Import, BB/BKB/SE-Erzeugung, Einzeldruck, Klassenverbund (Aufgabenblöcke/Beobachterzuordnung), automatische SE-Durchstreichung (optional), BKB-Schriftverkleinerung bei langen Aufgabenlisten, Flatten/Editable, ZIP-Ausgabe, Beispiel-Excel-Datei und lokale Testdaten. Zuordnung nach Gruppen 1/2, 3/4 und 5/6 ist vorbelegt und kann korrigiert werden.

## Hinweise
Die grafische Datenflussdarstellung wurde freigegeben und oben auf Anleitung und Transparenz eingebunden. Die früheren Dokumentationen sind unter `Archiv/` zur historischen Nachvollziehbarkeit enthalten. Die BKB-Anpassung wurde statisch geprüft; ein vollständiger Browser-Drucktest mit allen Eingabevarianten ist noch erforderlich.


v1.4.6: Dark Mode, optional Blanko-BB ohne Schülerliste, Druckhinweise in Anleitung. PDF-Viewer-Kompatibilität bleibt zu prüfen.


v1.4.8: Einstellungen lokal in settings.js; Speicherung nur Aufgabenwahl, PDF-Modus, Sortierung; keine Schülerdaten.

## v1.4.9 (10.11.2026)
- Hell/Dunkel wird wie bisher im Browser gespeichert.
- Einheitliche Signatur und Version mit Datum auf allen Seiten mit Kopfbereich.

## v1.5.0 (10.11.2026)
- Drei Arbeitswege: Klassenweise, Einzeldruck, Blanko-Vorlagen.
- SE-Kürzung wird lokal gemerkt.
- Aufgabenprüfknopf entfernt; direkte Prüfung bleibt.
- Eigene PDF-Vorlagen mit genauen Dateinamen erklärt.
- Farbschalter tiefer; Versionsanzeige auf allen HTML-Seiten aktualisiert.
