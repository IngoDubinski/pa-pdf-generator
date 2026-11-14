# Datenschutz und Bereitstellung

- Die Excel-Datei mit Schülerdaten und erzeugte PDFs verlassen den Browser nicht.
- GitHub Pages liefert nur HTML, JavaScript und die **unveränderten leeren PDF-Vorlagen** aus.
- Die Originalvorlagen sind in `Vorlagen/` enthalten und werden beim Webbetrieb automatisch geladen.
- Es gibt keine Tracking-Skripte, keinen Login und keine Daten-Uploadfunktion.
- GitHub erhält beim Seitenaufruf technische Zugriffsdaten.
- `robots.txt` und `noindex` bitten Suchmaschinen um Nichtindexierung, sind aber kein Zugriffsschutz.
- Originalvorlagen sind nicht automatisch Open Source; Nutzungsrechte für unveränderte Bereitstellung sind laut Projektinhaber geklärt.


## PA-Tools Web v1.6.0 · EP Generator Web v0.2.0 (12.11.2026)
Dieses GitHub-Pages-Komplettpaket enthält das bestehende PA-Drucktool und neu ep-generator.html, ep-core.js, ep-app.js. Zugangskontrolle erfolgt über dieselben statischen Gast-/Admin-Links (keine echte serverseitige Authentisierung). Der Web-EP liest Excel, KP- und PV-PDFs lokal, findet ID und Klasse aus den PDF-Textströmen und 4/5-grüne Fremdeinschätzungsfelder aus Grafikoperatoren der vorliegenden Profil-AC-Ausgaben. Für andere PDF-Varianten sind Stichproben nötig; bei unbekannten IDs keine Zuordnung nach Seitenreihenfolge. EP enthält dauerhaft bearbeitbare AcroForm-Felder. Der Browser kann nur Downloads auslösen oder PDF-Tabs öffnen, keine Verzeichnisse direkt in Downloads anlegen. Dateiausgabe deshalb ZIP mit Klassenordnern; Nutzer entpackt in Downloads. SaxSVS-PDF-Import bleibt vorerst in der lokalen Python-/Thonny-Version, nicht im Browser.
GitHub enthält ausschließlich anonymisierte Beispiele und leere Vorlagen; niemals Original-KP/PV, echte Schülerlisten oder Unterschriften ins Repository einchecken.

## Öffentliche Startseite v1.6.1
`index.html` ist auch ohne Link öffentlich. Die vier Tool-Namen beschreiben den Portalstand, wobei „Antrag BE“ nur mit dem Admin-Dauerlink eingeblendet wird. Es gibt keine neuen Upload-Funktionen. Link-Codes in GitHub-Pages-Quelltext bieten **keinen echten Zugriffsschutz**; niemals geheime Unterschriften oder Schülerunterlagen in das Repository aufnehmen. Der Hinweis „Open Source“ bezieht sich auf die einsehbare Programmierung; PDF-Vorlagen können gesonderten Nutzungsrechten unterliegen.
