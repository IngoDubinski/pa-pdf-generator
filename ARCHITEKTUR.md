# Architektur und Datenschutz

GitHub Pages liefert HTML, CSS, JavaScript, PDF-Vorlagen und die freigegebene Datenflussgrafik. JavaScript liest die vom Benutzer lokal ausgewählten Excel-/SaxSVS-Dateien im Browser. `app.js` und `saxsvs-import.js` übernehmen den Import, `klassenverbund.js` die Zuordnung von Beobachtern und Aufgabenblöcken, `pdf-engine.js` erzeugt die PDFs mittels lokaler `js/pdf-lib.min.js` und `js/jszip.min.js`.

**Sicherheitsgrenze:** Die Anwendung überträgt Schülerlisten nach ihrer vorgesehenen Funktionsweise nicht an GitHub. Dennoch entstehen normale HTTP-Anfragen für Website-Ressourcen. GitHub Pages ist ein öffentlicher Server, keine private Dateiverwaltung. Persönliche Gastlinks und `tool-nav.js` sind clientseitige Bedien-/Sichtbarkeitskontrollen, keine sichere Authentifizierung. Der Online-Adminbereich verwendet separat eingegebene GitHub-Zugangsdaten; keine Tokens in das Paket aufnehmen. Vorlagenverschlüsselung/geschützter Abruf ist eine offene Projektidee.

Die offline gestartete Thonny-Ausgabe verwendet denselben Browsercode und einen Python-HTTP-Server ausschließlich auf 127.0.0.1. Es werden keine Daten an einen externen Dienst gesendet, solange keine externen Seiten geöffnet werden. Die lokale Ausgabe deaktiviert Online-Admin-/Gastlink-Funktionen.
