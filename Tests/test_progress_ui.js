/* Node.js >= 18: node --test Tests/test_progress_ui.js */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function makeUI(){
 const components={
  'progress':{value:0},'[data-progress-percent]':{textContent:''},
  '[data-progress-label]':{textContent:''},'[data-progress-title]':{textContent:''}
 };
 const attrs=new Map();
 const element={hidden:true,dataset:{},querySelector(k){return components[k];},setAttribute(k,v){attrs.set(k,v);},removeAttribute(k){attrs.delete(k);}};
 const context={document:{getElementById(k){assert.equal(k,'testProgress');return element;}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'progress-ui.js'),'utf8')+'\n;this.ui=PAProgress;',context);
 return {ui:context.ui.connect('testProgress'),element,components,attrs};
}
test('Fortschritt startet bei 0, steigt monoton und erreicht bei Erfolg 100',()=>{
 const {ui,element,components,attrs}=makeUI();
 ui.start('Lade Vorlagen');
 assert.equal(element.hidden,false);
 assert.equal(attrs.get('aria-busy'),'true');
 assert.equal(components['progress'].value,0);
 ui.update(42.8,'Schüler 2/5');
 ui.update(35,'Wert darf nicht zurückspringen');
 assert.equal(components['progress'].value,42);
 ui.finish('ZIP bereit');
 assert.equal(components['progress'].value,100);
 assert.equal(components['[data-progress-percent]'].textContent,'100 %');
 assert.equal(attrs.get('aria-busy'),'false');
 assert.equal(element.dataset.state,'done');
 ui.start('Weitere Klasse');assert.equal(components['progress'].value,0);
});
test('Fehler zeigt keinen falschen 100%-Erfolg und beendet busy-Status',()=>{
 const {ui,element,components,attrs}=makeUI();ui.start('Vorbereitung');ui.update(58,'In Arbeit');ui.fail('PDF defekt');
 assert.equal(components.progress.value,58);
 assert.equal(element.dataset.state,'error');
 assert.equal(attrs.get('aria-busy'),'false');
 assert.equal(components['[data-progress-label]'].textContent,'PDF defekt');
 ui.hide();assert.equal(element.hidden,true);
});
test('EP: neues Fenster nur über den Link nach fertiger PDF, kein leeres Pop-up',()=>{
 const app=fs.readFileSync(path.join(root,'ep-app.js'),'utf8');
 const html=fs.readFileSync(path.join(root,'ep-generator.html'),'utf8');
 assert.doesNotMatch(app,/window\.open\s*\(/);
 assert.match(app,/link\.target='_blank'/);
 assert.match(app,/lastClassPdfUrl=save\(blob,filename,true\)/);
 assert.match(app,/epProgress\.finish/);
 assert.match(html,/id="epProgress"/);
 assert.match(html,/progress-ui\.js\?v=163/);
 assert.match(html,/PDF öffnen \/ drucken|PDF öffnen \/ drucken|zum Öffnen und Drucken/);
});
test('PA-Drucktool: Fortschrittsanzeige bei ZIP-Erstellung vorhanden',()=>{
 const app=fs.readFileSync(path.join(root,'pdf-engine.js'),'utf8');
 const html=fs.readFileSync(path.join(root,'tool.html'),'utf8');
 assert.match(app,/PAProgress\.connect\('paProgress'\)/);
 assert.match(app,/progress\.finish/);
 assert.match(html,/id="paProgress"/);
});
