'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

test('Info/Hilfe enthaelt die sechs gewuenschten Ziele, nicht als einzelne Hauptnavigation',()=>{
 const js=read('tool-nav.js');
 for (const file of ['vorlagen.html','excel-anleitung.html','quellcode.html','architektur.html','projektideen.html','tipp.html'])
   assert.ok(js.includes("['"+file+"'"),file);
 assert.match(js,/summary\.textContent = 'Info\/Hilfe'/);
 assert.match(js,/menu\.open = false/);
 assert.match(js,/if \(nav && authorized\)/);
 assert.match(js,/nav\.replaceChildren\(\)/);
});
test('Fehlende Berechtigung: Navigation und Werkzeugportal verborgen',()=>{
 const js=read('tool-nav.js');
 const html=read('index.html');
 assert.match(html,/<nav id="mainNavigation" hidden><\/nav>/);
 assert.match(html,/<section class="panel" id="toolPortal" hidden>/);
 assert.match(js,/nav\.hidden = true/);
 assert.match(js,/portal\.hidden = !authorized/);
});
test('EP weist auf Einmalcodes auch bei Nichtteilnahme und sichere ID-Zuordnung hin',()=>{
 for(const name of ['ep-generator.html','excel-anleitung.html','tipp.html']){
   const html=read(name);
   assert.match(html,/Einmalcodes\/Passwörter/);
   assert.match(html,/Schüler-ID/);
   assert.match(html,/potenzialanalyse\.sachsen\.de/);
 }
});
test('Alle Seiten verwenden aktuelle Styles und Navigation',()=>{
 for(const name of ['index.html','ep-generator.html','tool.html','vorlagen.html','excel-anleitung.html','quellcode.html','architektur.html','projektideen.html','tipp.html','ep-seite2.html','antrag-be.html']){
  const html=read(name);
  assert.match(html,/style\.css\?v=165/,name);
  assert.match(html,/tool-nav\.js\?v=165/,name);
  assert.match(html,/<nav id="mainNavigation" hidden><\/nav>/,name);
 }
});
test('Vorherige EP-Erweiterungen bleiben vorhanden',()=>{
 const html=read('ep-generator.html'),js=read('ep-app.js');
 assert.match(html,/id="epAddExtra"/);
 assert.match(html,/<option value="nr" selected>/);
 assert.match(js,/S\.sortStudents/);
});
