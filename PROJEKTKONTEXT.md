# KI-Projektkontext / Übergabe

Projekt: PA-Drucktool, v1.4.5, GitHub Pages, deutscher Schulkontext. Ausgangsstand v1.4.4 wurde übernommen. Wichtige Dateien: `tool.html` (Oberfläche), `app.js` (Import/Verwaltung), `saxsvs-import.js` (PDF-Import), `klassenverbund.js` (Aufgabenblock A/B und Beobachterzuordnung), `pdf-engine.js` (BB/BKB/SE PDF-LIB), `Vorlagen/` (originale PDF-Formulare), `access.js`/`tool-nav.js` (clientseitige Linkkontrolle), `admin.html`/`admin.js` (Online-Gastlink-Verwaltung), `excel-anleitung.html`, `quellcode.html`, `projektideen.html`.

V1.4.5: automatische Schriftgrößenanpassung für Feld `Aufgaben` im BKB; freigegebene Datenflussgrafik auf Anleitung/Transparenz; Beispiel-Excel mit Dummydaten; aktualisierte Projektideen; Dokumentation und lokale Python-Verpackung.

Konventionen: Originalvorlagen möglichst unverändert lassen, SE-Durchstreichung nur optional im PDF, Flatten als Standard, kein Upload von Schülerdaten, keine Tokens/realen Schülerdaten in ZIP. Klassenverbund: 2 Aufgabenblöcke mit je 1 Aufgabe aus AK I/II/III, je Gruppe 2 Beobachter; bei Paaren 1/2, 3/4, 5/6 wechseln die Gruppen, Beobachter behalten ihre Aufgabenblöcke. Zuordnung muss auf BB erscheinen, BKB/SE unverändert. Bei fehlenden Beobachtern Feld leer.

Nächste Arbeit: Browser-End-to-End-Test der BKB-Schriftgröße für sehr lange Aufgabenlisten und beide PDF-Modi. Offen: Schutz der öffentlich zugänglichen PDF-Vorlagen.


Stand v1.4.6: theme.js für Dark Mode, Blanko-BB-Erstellung in pdf-engine.js (generateBlanko), Firefox/Adobe-Druckhinweis. PDF-Druckfehler bei Dritt-Viewern noch nicht behoben.


v1.4.8: Einstellungen lokal in settings.js; Speicherung nur Aufgabenwahl, PDF-Modus, Sortierung; keine Schülerdaten.

Projektidee (noch nicht umgesetzt): PDF-Kompatibilität mit Adobe Acrobat Reader verbessern bzw. Darstellungs- und Druckprobleme beheben.
