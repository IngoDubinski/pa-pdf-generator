# Antrag BE v0.1.0 (PA-Tools v1.6.7)

Admin-exklusives Werkzeug `antrag-be.html`. GitHub Pages hat nur clientseitige Link-Sichtbarkeitskontrolle, keine echte serverseitige Authentifizierung. Deshalb keine vertraulichen Daten im Repository ablegen.

1. Veranstaltungsdaten ausfüllen oder eine zuvor gespeicherte `Veranstaltung.json` öffnen.
2. Eine Excel-Schülerliste mit Klassenreitern (7a usw.) und „Kompletter Name“ hochladen. Schüler klassenweise/individuell wählen.
3. Unterlagen ankreuzen und ZIP herunterladen.
4. ZIP im gewünschten Schuljahresordner entpacken. Pro Veranstaltung entsteht ein Ordner `BE Firma Jahr`.

Die ZIP enthält bearbeitbare Word-/Excel-Dokumente, eine getrennt gesetzte Gesamtdruck-PDF und `Veranstaltung.json` (ohne Namen/Schülerdaten). Der Schulleitungsantrag wird aus `Vorlagen/BE/Exkursionsantrag_Original.docx` erzeugt. Genehmigungsfelder und Unterschriften bleiben frei. TN-Liste als separate bearbeitbare Anlage.

**Grenzen von v0.1.0:** PDFs aus dem Browser sind eine eigens gesetzte Druckfassung, keine exakte PDF-Konvertierung der Original-DOCX-Datei; vor offiziellem Einsatz den Originalantrag in Word prüfen. Duplex im Druckdialog einstellen und ggf. Antrag und Anlage getrennt drucken. Speichern in einen fest voreingestellten Windows-Pfad ist ohne Browserberechtigung nicht möglich: ZIP im Zielordner entpacken. Die Forms-Anbindung ist noch nicht enthalten. Browser-Durchlauftest steht aus; die Umgebung blockiert die lokale grafische Browsernavigation. Keine Garantie auf layoutgetreue Word-Darstellung ohne Praxistest.
