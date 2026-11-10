"use strict";
const tasks={
 'AK I':['Brücke','Davids Beruf','Drei Kartenhäuser','Dreigängemenü','Fahrradunfall','Ferienprogramm','Figur','Kindertagesstätte','Klassenausflug','Lenas Ausbildungsplatz','Murmelbahn','Tischtennis','Was isst Lorenz?','Wem gehört der Hamster?','Werbeplakat','Zeltlager'],
 'AK II':['Auto','Barfußpark','Chillecke','Eisenbahnwaggon','Flohmarkt','Flugzeug','Haus','Holzhäuschen','Jahreszeitenkreis','Jahrmarkt','Lichttunnel','Schaufenster','Schwingvogel','Standbild','Turmbau'],
 'AK III':['Bilderrahmen','Draht biegen','Heißer Draht','Kräutersalz','Lesezeichen','Mosaik','Schiff','Schlüsselanhänger','Servietten falten','Tierisch beste Freunde','Zettel-Box']
};
const area=document.getElementById('taskSelection');
for(const [category,names] of Object.entries(tasks)){
 const section=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=category;section.append(legend);
 for(const name of names){const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.dataset.category=category;input.value=name;input.addEventListener('change',checkTasks);label.append(input,document.createTextNode(' '+name));section.append(label);}
 area.append(section);
}
function checkTasks(){const counts=Object.keys(tasks).map(cat=>[cat,area.querySelectorAll(`input[data-category="${cat}"]:checked`).length]);const ok=counts.every(([,n])=>n===2);const status=document.getElementById('taskStatus');status.textContent=counts.map(([cat,n])=>`${cat}: ${n}/2`).join(' · ')+(ok?' – Auswahl gültig.':' – Bitte genau 2 je Kategorie wählen.');status.className=ok?'ok':'err';return ok;}
checkTasks();
