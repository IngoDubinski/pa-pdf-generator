# SE-Durchstreichungen – Fix 08.11.2026
Die hochgeladene Ausgabe aus dem Expertenmodus enthielt keine Durchstreichungen. 
Die Ursache kann eine zwischengespeicherte alte `pdf-engine.js` sein; das Skript hatte zuvor eine unveränderte Versionskennung (`saxsvs-1`).
Die neue Version nutzt `?v=se-striche-fix-20261108` und zeigt `v1.4.1` an.
Die zwölf Striche (sechs Merkmale × Name + Skala) wurden in einer Kontrollvorschau unabhängig anhand der PDF-Koordinaten erzeugt.
Nach dem Hochladen der Dateien die Webseite mit Strg+F5 neu laden. Prüfen, ob v1.4.1 angezeigt wird.
Danach einen SE-Testdruck mit aktivierter Option erstellen.
