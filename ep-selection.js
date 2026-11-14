/* Schülerauswahl für den optionalen Einzeldruck. Keine Schülerdaten werden gespeichert oder übertragen. */
'use strict';
const EPSelection=(()=>{
 // Nr. ist die Schüler-ID aus der ersten Excel-Spalte; NICHT die PDF-Seitennummer.
 // Ohne ID werden Schüler hinten einsortiert. Die stabile Sortierung bewahrt
 // bei identischen Nummern die Excel-Reihenfolge.
 function compare(a,b,order='nr'){
  const name=a.name.localeCompare(b.name,'de',{sensitivity:'base'});
  const idA=Number.isSafeInteger(a.id)?a.id:null;
  const idB=Number.isSafeInteger(b.id)?b.id:null;
  if(order==='az')return name || (idA??Infinity)-(idB??Infinity) || 0;
  if(order==='za')return -name || (idA??Infinity)-(idB??Infinity) || 0;
  if(idA===null)return idB===null?0:1;
  if(idB===null)return -1;
  return idA-idB;
 }
 function sortStudents(students,order='nr'){
  return [...students].sort((a,b)=>compare(a,b,order));
 }
 function entries(students,cls,query='',order='az'){
  const q=String(query).trim().toLocaleLowerCase('de');
  return students.map((student,index)=>({student,index})).filter(({student})=>
    student.cls===cls && (!q || `${student.name} ${student.id??''}`.toLocaleLowerCase('de').includes(q)))
   .sort((a,b)=>compare(a.student,b.student,order));
 }
 function selected(students,cls,indices){return entries(students,cls).filter(x=>indices.has(x.index)).map(x=>x.student);}
 function filename(students,cls,docs,safe){
  const types=docs.join('+');
  if(students.length===1)return `${types} ${safe(students[0].name)} ${cls}.pdf`;
  return `Einzeldruck Auswahl ${cls} ${students.length} Schüler ${types}.pdf`;
 }
 return Object.freeze({entries,selected,filename,sortStudents});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=EPSelection;
