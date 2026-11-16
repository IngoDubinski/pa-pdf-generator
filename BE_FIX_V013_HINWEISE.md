# Antrag BE v0.1.3 – Korrektur Feedback-Excel

Der bisherige Excel-Export fügte zusätzliche Teilnehmerzeilen vor bereits eingefügte Zeilen ein. Bei neun oder mehr Teilnehmern entstanden dadurch falsch sortierte XML-Zeilen und doppelte Zelladressen. Excel versuchte, diese zu reparieren; dabei gingen Teilnehmerdaten verloren.

Jetzt werden die Folgezeilen zuerst verschoben und danach alle Schülerzeilen aufsteigend neu eingefügt. Mindestens acht formatierte Schülerzeilen bleiben erhalten. Original-Vorlagendateien werden nicht verändert.

Technisch geprüft: JavaScript-Syntax, Quellcode, Originalvorlage. Ein End-to-End-Browsertest und ein Test der erzeugten Datei in Microsoft Excel konnten in dieser Umgebung nicht durchgeführt werden. Bitte mit 13 oder mehr Schülern nachtesten.
