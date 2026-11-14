# Architektur und Datenschutz

GitHub Pages liefert HTML, CSS, JavaScript, PDF-Vorlagen und die freigegebene Datenflussgrafik. JavaScript liest die vom Benutzer lokal ausgewählten Excel-/SaxSVS-Dateien im Browser. `app.js` und `saxsvs-import.js` übernehmen den Import, `klassenverbund.js` die Zuordnung von Beobachtern und Aufgabenblöcken, `pdf-engine.js` erzeugt die PDFs mittels lokaler `js/pdf-lib.min.js` und `js/jszip.min.js`.

**Sicherheitsgrenze:** Die Anwendung überträgt Schülerlisten nach ihrer vorgesehenen Funktionsweise nicht an GitHub. Dennoch entstehen normale HTTP-Anfragen für Website-Ressourcen. GitHub Pages ist ein öffentlicher Server, keine private Dateiverwaltung. Persönliche Gastlinks und `tool-nav.js` sind clientseitige Bedien-/Sichtbarkeitskontrollen, keine sichere Authentifizierung. Der Online-Adminbereich verwendet separat eingegebene GitHub-Zugangsdaten; keine Tokens in das Paket aufnehmen. Vorlagenverschlüsselung/geschützter Abruf ist eine offene Projektidee.

Die offline gestartete Thonny-Ausgabe verwendet denselben Browsercode und einen Python-HTTP-Server ausschließlich auf 127.0.0.1. Es werden keine Daten an einen externen Dienst gesendet, solange keine externen Seiten geöffnet werden. Die lokale Ausgabe deaktiviert Online-Admin-/Gastlink-Funktionen.


## PA-Tools Web v1.6.0 · EP Generator Web v0.2.0 (12.11.2026)
Dieses GitHub-Pages-Komplettpaket enthält das bestehende PA-Drucktool und neu ep-generator.html, ep-core.js, ep-app.js. Zugangskontrolle erfolgt über dieselben statischen Gast-/Admin-Links (keine echte serverseitige Authentisierung). Der Web-EP liest Excel, KP- und PV-PDFs lokal, findet ID und Klasse aus den PDF-Textströmen und 4/5-grüne Fremdeinschätzungsfelder aus Grafikoperatoren der vorliegenden Profil-AC-Ausgaben. Für andere PDF-Varianten sind Stichproben nötig; bei unbekannten IDs keine Zuordnung nach Seitenreihenfolge. EP enthält dauerhaft bearbeitbare AcroForm-Felder. Der Browser kann nur Downloads auslösen oder PDF-Tabs öffnen, keine Verzeichnisse direkt in Downloads anlegen. Dateiausgabe deshalb ZIP mit Klassenordnern; Nutzer entpackt in Downloads. SaxSVS-PDF-Import bleibt vorerst in der lokalen Python-/Thonny-Version, nicht im Browser.
GitHub enthält ausschließlich anonymisierte Beispiele und leere Vorlagen; niemals Original-KP/PV, echte Schülerlisten oder Unterschriften ins Repository einchecken.

## Webportal v1.6.1
Das Portal unterscheidet Gastlink, Admin-Dauerlink und fehlenden/abgelaufenen Link rein auf dem Client. `access.js` liefert `allowed()`, `isPermanent()` und `requireLink()`, `tool-nav.js` blendet die passenden Tool-Einträge ein. `index.html` bleibt öffentlich lesbar, auch bei abgelaufenen Links. Die beiden geplanten Module besitzen noch keine fachliche Funktion oder zusätzlichen Vorlagen. Ein Admin-Dauerlink in statischem Quellcode ersetzt **keine** sichere serverseitige Anmeldung; für echten exklusiven Zugriff ist später ein authentisierter Server nötig.

## EP Web v0.2.1 / Portal v1.6.2 – Formular-Rendering (14.11.2026)
`ep-core.js` führt PDF-Teile weiterhin mit `pdf-lib` zusammen. Zur Isolation der Formularfeldnamen werden PDF-Widgets je Schüler neu aufgebaut. **Pflicht:** Texteingabefelder bei `addToPage` mit `backgroundColor: undefined`, `borderColor: undefined`, `borderWidth: 0` anlegen; Checkboxen ebenfalls transparent, aber mit schwarzem Rand. Sonst erzeugt `pdf-lib` standardmäßig weiße Füllungen und verdeckt Linien der Original-PDF. Kein `flatten()` der EP-Formulare!
