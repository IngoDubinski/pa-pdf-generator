/* EP 2. Seite v0.1.0 – nur freie BO-Zeilen, keine Änderungen an Bestandsfeldern. */
'use strict';
const EPSeite2Core = (()=>{
 const MAX=14;
 const clean=v=>String(v??'').trim();
 const text=(form,name)=>{try{return form.getTextField(name)}catch{return null}};
 const checkbox=(form,name)=>{try{return form.getCheckBox(name)}catch{return null}};
 function inspect(form){
  const lines=[];
  for(let i=1;i<=MAX;i++){
   const fields=[`BO${i} Datum`,`BO${i}`,`BO${i} Ort`,`BO${i} Notizen`];
   const cb=[1,2,3].map(j=>checkbox(form,`Check BoxBO${i}_${j}`));
   // BO10 has a different spelling in the original 2023 template.
   if(i===10&&!cb[2])cb[2]=checkbox(form,'Check Box4BO10_3');
   if(fields.some(name=>!text(form,name))||cb.some(x=>!x))throw Error(`Unbekannte EP-Vorlage: BO-Zeile ${i} ist unvollständig. Keine Änderung.`);
   const occupied=fields.some(n=>clean(text(form,n).getText()))||cb.some(c=>c.isChecked());
   lines.push({index:i,occupied});
  }
  const last=lines.reduce((n,l)=>l.occupied?l.index:n,0);
  const next=last<MAX?last+1:null;
  return {lines,last,next,free:MAX-last};
 }
 function person(form){
  const field=text(form,'Name Schülerin Schüler');
  const cls=text(form,'Klasse');
  if(!field||!cls)throw Error('Name/Klasse fehlen als Formularfelder. Keine Änderung.');
  return {name:clean(field.getText()),cls:clean(cls.getText())};
 }
 function append(form,data){
  const status=inspect(form);
  if(!status.next)throw Error('Alle 14 BO-Zeilen belegt. Datei unverändert.');
  if(!clean(data.date)||!clean(data.title))throw Error('Datum und Veranstaltungstitel sind Pflicht.');
  const i=status.next;
  const values={[`BO${i} Datum`]:data.date,[`BO${i}`]:data.title,[`BO${i} Ort`]:data.place||'Schule',[`BO${i} Notizen`]:data.notes||''};
  Object.entries(values).forEach(([name,value])=>text(form,name).setText(clean(value)));
  if(data.rating){const k=Number(data.rating);if(![1,2,3].includes(k))throw Error('Ungültige Einschätzung.');
   const target=checkbox(form,`Check BoxBO${i}_${k}`)|| (i===10&&k===3?checkbox(form,'Check Box4BO10_3'):null);
   if(!target)throw Error('Bewertungsfeld fehlt.');target.check();
  }
  return i;
 }
 function safeFile(s){return clean(s).replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,100)||'EP';}
 return Object.freeze({inspect,person,append,safeFile});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=EPSeite2Core;
