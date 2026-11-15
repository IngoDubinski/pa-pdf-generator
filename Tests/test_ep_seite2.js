const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const PDF=require('../js/pdf-lib.min.js'),Core=require('../ep-seite2-core.js');
const template=fs.readFileSync(path.join(__dirname,'../Vorlagen/EP/Entwicklungsplan_ausfuellbar.pdf'));
const load=()=>PDF.PDFDocument.load(template);
test('Antrag: zuerst nur freie BO-Zeile, vorhandene Inhalte bleiben',async()=>{
 const pdf=await load(),form=pdf.getForm();form.getTextField('BO1').setText('Altveranstaltung');
 form.getTextField('BO3 Notizen').setText('Vorhandene Notiz');
 const i=Core.append(form,{date:'16.11.2026',title:'Neue Veranstaltung',place:'Schule',notes:'Feedback',rating:'1'});
 assert.equal(i,4);assert.equal(form.getTextField('BO1').getText(),'Altveranstaltung');
 assert.equal(form.getTextField('BO3 Notizen').getText(),'Vorhandene Notiz');
 assert.equal(form.getTextField('BO2').getText()||'','');
 assert.equal(form.getTextField('BO4').getText(),'Neue Veranstaltung');
 assert.equal(form.getCheckBox('Check BoxBO4_1').isChecked(),true);
 const reloaded=(await PDF.PDFDocument.load(await pdf.save())).getForm();assert.equal(Core.inspect(reloaded).next,5);
});
test('letzte Zeile 14 bereits gefüllt, keine Änderungen',async()=>{
 const pdf=await load(),form=pdf.getForm();form.getTextField('BO14').setText('voll');
 assert.equal(Core.inspect(form).next,null);
 assert.throws(()=>Core.append(form,{date:'17.11.2026',title:'Test'}),/Alle 14/);
 assert.equal(form.getTextField('BO14').getText(),'voll');
});
test('Ungültige Pflichtfelder verändern nichts',async()=>{
 const pdf=await load(),form=pdf.getForm();
 assert.throws(()=>Core.append(form,{date:'',title:'Test'}),/Pflicht/);
 assert.equal(Core.inspect(form).next,1);
});
test('Sonderfeld in BO10 und checkbox zählt als belegte Zeile',async()=>{
 const pdf=await load(),form=pdf.getForm();form.getCheckBox('Check Box4BO10_3').check();
 assert.equal(Core.inspect(form).next,11);
 assert.equal(Core.append(form,{date:'18.11.2026',title:'Neue Veranstaltung',rating:'2'}),11);
 assert.equal(form.getCheckBox('Check BoxBO11_2').isChecked(),true);
});
