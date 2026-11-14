'use strict';
/* Node.js >=18, run from anywhere:
   node --test Tests/test_ep_form_transparency.js
   Tests the same browser PDF core, without uploading or requiring student data.
*/
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const PDFLib=require(path.join(root,'js/pdf-lib.min.js'));
const source=fs.readFileSync(path.join(root,'ep-core.js'),'utf8');
global.window={PDFLib};
vm.runInThisContext(source+'\n;global.__epCoreTest=EPCore;');
const Core=global.__epCoreTest;
const template=fs.readFileSync(path.join(root,'Vorlagen/EP/Entwicklungsplan_ausfuellbar.pdf'));
const params={school:'Beispielschule',staff:'R. Beispiel',goals:'Berufsorientierung',events:{Potenzialanalyse:'04.11.2026'}};
const make=(name)=>Core.buildEP({cls:'7b',id:1,name,birth:'01.02.2013',paDate:'04.11.2026'},params,{hasValues:true,strengths:['Teamfähigkeit']},template,null);

test('ausfüllbarer EP bleibt ohne deckende weiße Annotationen',async()=>{
 const a=await make('Max Mustermann');
 const b=await make('Erika Musterfrau');
 const output=await Core.mergePdf([a,b]);
 const pdf=await PDFLib.PDFDocument.load(output);
 assert.equal(pdf.getPageCount(),4,'je Schüler zwei Seiten');
 const fields=pdf.getForm().getFields();
 assert.ok(fields.length>200,'zahlreiche Formularfelder bleiben erhalten');
 assert.equal(new Set(fields.map(f=>f.getName())).size,fields.length,'Feldnamen eindeutig');
 let textCount=0,checkCount=0;
 for(const f of fields){
   const widgets=f.acroField.getWidgets();
   assert.ok(widgets.length>=1);
   for(const widget of widgets){
     const bg=widget.getAppearanceCharacteristics()?.getBackgroundColor();
     assert.equal(bg,undefined,`${f.getName()}: kein weißer Flächenhintergrund, Linien bleiben sichtbar`);
     if(f instanceof PDFLib.PDFCheckBox){
       checkCount++;
       assert.ok(widget.getAppearanceCharacteristics()?.getBorderColor(),`${f.getName()}: Häkchen-Kasten hat Rand`);
       assert.ok((widget.getBorderStyle()?.getWidth()||0)>0,`${f.getName()}: Rand ist sichtbar`);
     }
     if(f instanceof PDFLib.PDFTextField)textCount++;
   }
 }
 assert.ok(textCount>100&&checkCount>50);
 assert.equal(pdf.getForm().getTextField('s0_Name_Schülerin_Schüler_0').getText(),'Max Mustermann');
 assert.equal(pdf.getForm().getTextField('s1_Name_Schülerin_Schüler_0').getText(),'Erika Musterfrau');
 // Formular nach der Zusammenführung weiterhin tatsächlich beschreibbar.
 pdf.getForm().getTextField('s1_BO2_Notizen_0').setText('Auswertung vom 12.11.2026');
 const saved=await pdf.save({useObjectStreams:false});
 const reopened=await PDFLib.PDFDocument.load(saved);
 assert.equal(reopened.getForm().getTextField('s1_BO2_Notizen_0').getText(),'Auswertung vom 12.11.2026');
});

test('auch ein einzelner EP beim Klassendruck bleibt transparent',async()=>{
 const ep=await make('Schülerin Test');
 const merged=await Core.mergePdf([ep]);
 const pdf=await PDFLib.PDFDocument.load(merged);
 assert.equal(pdf.getPageCount(),2);
 const widget=pdf.getForm().getTextField('s0_BO1_Datum_0').acroField.getWidgets()[0];
 assert.equal(widget.getAppearanceCharacteristics()?.getBackgroundColor(),undefined);
 assert.equal(pdf.getForm().getTextField('s0_BO1_Datum_0').getText(),'04.11.26');
});
