'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const S=require(path.join(root,'ep-selection.js'));
const students=[
 {cls:'7a',id:1,name:'Anna A'},
 {cls:'7b',id:1,name:'Bernd B'},
 {cls:'7a',id:2,name:'Carl C'},
 {cls:'7a',id:3,name:'Beate B'},
 {cls:'7b',id:2,name:'Erik E'}
];
test('Einzeldruck: Klasse 7a filtert nur ihre Schüler, alphabetisch',()=>{
 assert.deepEqual(S.entries(students,'7a').map(e=>e.student.name),['Anna A','Beate B','Carl C']);
 assert.deepEqual(S.entries(students,'7b').map(e=>e.student.name),['Bernd B','Erik E']);
});
test('Einzel- oder Mehrfachauswahl greift nicht in andere Klassen ein',()=>{
 assert.deepEqual(S.selected(students,'7a',new Set([1,2,3])).map(s=>s.name),['Beate B','Carl C']);
 assert.deepEqual(S.selected(students,'7b',new Set([0,2,3])).map(s=>s.name),[]);
});
test('Suchfeld sucht nach Namen oder ID, ohne die Klassengrenze zu verlieren',()=>{
 assert.deepEqual(S.entries(students,'7a','beate').map(e=>e.student.id),[3]);
 assert.deepEqual(S.entries(students,'7a','2').map(e=>e.student.name),['Carl C']);
 assert.deepEqual(S.entries(students,'7a','erik'),[]);
});
test('Druck-PDF-Dateinamen für einen oder mehrere ausgewählte Schüler',()=>{
 assert.equal(S.filename([students[0]],'7a',['EP','KP'],s=>s),'EP+KP Anna A 7a.pdf');
 assert.equal(S.filename([students[0],students[2]],'7a',['EP'],s=>s),'Einzeldruck Auswahl 7a 2 Schüler EP.pdf');
});
test('Einzeldruck bleibt optional und verwendet bestehende PDF- und Dokumentauswahl',()=>{
 const html=fs.readFileSync(path.join(root,'ep-generator.html'),'utf8');
 const app=fs.readFileSync(path.join(root,'ep-app.js'),'utf8');
 assert.match(html,/<details class="ep-single" id="epSingleDetails">/); // kein open-Attribut
 assert.match(html,/id="epSingleList"/);
 assert.match(html,/id="epGenerateSelected"/);
 assert.match(html,/Mehrere Einzel-PDFs oder Sammel-PDFs möglich/);
 assert.doesNotMatch(html,/Kompetenzprofile KP \(/);
 assert.doesNotMatch(html,/Profilvergleiche PV \(/);
 assert.match(app,/mode=single\?'single':\$\('epMode'\)\.value/);
 assert.match(app,/const targets=single\?S\.selected/);
 assert.match(app,/scan\(\(pct,msg\)=>epProgress\.update\(pct,msg\),targets\)/);
 assert.match(app,/if\(mode==='class'\|\|mode==='single'\)/);
 assert.match(app,/const chosen=S\.sortStudents\(selected,\$\('epSort'\)\.value\)/);
 assert.doesNotMatch(app,/window\.open\s*\(/);
});
