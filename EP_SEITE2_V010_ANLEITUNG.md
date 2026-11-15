# EP 2. Seite v0.1.0 – PA-Tools v1.6.6

- URL: `ep-seite2.html` (gültiger PA-Tools-Freigabelink erforderlich).
- Für eine Klasse: Klasse im Filter wählen. Für klassenübergreifende Schülerauswahl: Modus wechseln, bei Bedarf Klassenfilter leeren.
- Bestehende **ausfüllbare, individuelle** EP-PDFs mit der Dateiauswahl oder Ordnerauswahl importieren. Die PDF-Formularfelder müssen den Original-EP-Feldern entsprechen.
- Auswählen, welche Schüler eine neue BO-Veranstaltung erhalten. Datum + Veranstaltungstitel sind Pflicht. Ort ist mit `Schule` vorbelegt. Smiley und Notizen optional. Die Angaben gelten für alle ausgewählten Schüler.
- Das Tool erkennt pro EP die letzte BO-Zeile, die irgendwo (Datum, Titel, Ort, Notiz oder Bewertung) einen Inhalt hat. Es schreibt ausschließlich in die *darauffolgende* komplett freie Zeile. Lücken davor werden nicht aufgefüllt. Maximal 14 Zeilen. Kein Überschreiben vorhandener Zeilen.
- Ausgabe entweder ZIP-Download oder (bei unterstütztem Browser) Auswahl eines Zielordners. Ausgabe sind weiterhin ausfüllbare Einzel-PDFs mit `_BO_ergaenzt` im Namen; existierende gleichnamige Dateien im Zielordner erhalten einen Nummernzusatz statt überschrieben zu werden.
- Optionales Sammeldruck-PDF: Nur neue Einträge oder alle erfolgreich eingelesenen EPs der gewählten Klasse (im gemischten Modus alle Klassen). Die Druckfassung wird nur als Kopie flachgerechnet; die einzelnen ausfüllbaren EPs bleiben bearbeitbar.
- Originale bleiben unverändert; alle Schritte finden im Browser statt. Keine Übertragung von Schüler-PDFs zu GitHub. Keine Schülerdaten in diesem ZIP.

## Grenzen

- In v0.1.0 wird je Durchlauf **eine Veranstaltung für die gewählten Schüler** ergänzt. Für weitere Termine erneut die gerade ausgegebenen EP-PDFs auswählen.
- Vollständig belegte 14 BO-Zeilen erhalten keinen zusätzlichen Fortsetzungsbogen. Die Dateien werden übersprungen und gemeldet.
- PDF-Dateien mit fehlenden/abweichenden Formularfeldern oder fehlender Name/Klasse werden nicht bearbeitet. Bilder oder bereits flachgerechnete EPs sind nicht geeignet.
- Auswahl über Microsoft Forms, Links oder Excel-Exporte ist für eine spätere Version vorgemerkt.
- Der Browser kann nicht ohne Nutzeraktion beliebige Ordner auf der Festplatte lesen oder beschreiben. Die Ordnerausgabe benötigt `showDirectoryPicker`; Firefox bietet diese Funktion ggf. nicht. Dann ZIP verwenden.
- Die Browser-Druckfunktion erfordert einen separaten Klick auf `Druck-PDF öffnen` und danach den Druckdialog (Strg+P). Kein stiller Direktdruck.

Test: `node --test Tests/test_ep_seite2.js`.
