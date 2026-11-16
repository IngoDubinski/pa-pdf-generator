# Antrag BE v0.1.4 (PA-Tools v1.6.11)

- Schulleitungsantrag auf die vom Nutzer gelieferte amtliche Word-Vorlage „Vorbereitung und Genehmigung von Schulfahrten“ (Ausgabe 01/2025, fünf Seiten) umgestellt.
- Layout, Genehmigungs- und Unterschriftsfelder bleiben im Original erhalten. Die ausgefüllten Demo-Daten der Vorlage werden durch Veranstaltungsdaten ersetzt oder geleert.
- Teilnehmerzahl und Klassen automatisch aus der Schülerauswahl. Geschlecht/Volljährigkeit wird nicht geschätzt oder vorbelegt.
- Unterrichtstage, Nichtteilnehmende, begleitende Personen, Reiseverlauf, pädagogisches Ziel und Kosten zusätzlich als Eingabefelder vorgesehen.
- Einfache, vollständig alphabetisch sortierte Teilnehmeranlage als separat bearbeitbares DOCX.
- Klassenbezeichnungen durchgehend 7a statt 7A. Sortiert nach Klasse, dann Nachname, dann Vorname.
- Funktionierende originale Excel-Feedbackvorlage und Zeilen-Generator aus v1.6.10 unverändert (bis auf Kleinschreibung der Klasse/Sortierung).
- JSON-Speicherung inkl. Einverständniserklärung-Rücklauf unverändert/um die neuen Veranstaltungsfelder erweitert.
- Browser-Tests konnten wegen Testumgebungs-Netzwerksperre nicht durchgeführt werden; JavaScript-Syntax, Vorlagenstruktur und Beispiel-Word-Layout geprüft.

**Prüfen vor Unterschrift:** Amtliche Checkboxen (insbesondere Wochenenden, Kostenübernahme, Risiko, Verkehrsmittel und Einverständniserklärungen), Reisekosten, Unterrichtstage, personenbezogene Angaben zur Schulfahrtleitung und formale Zulässigkeit. Der Genehmigungsvermerk der Schulleitung bleibt leer.
