/* Schülerauswahl für den optionalen Einzeldruck. Keine Schülerdaten werden gespeichert oder übertragen. */
'use strict';
const EPSelection=(()=>{
 function entries(students,cls,query=''){
  const q=String(query).trim().toLocaleLowerCase('de');
  return students.map((student,index)=>({student,index})).filter(({student})=>
    student.cls===cls && (!q || `${student.name} ${student.id??''}`.toLocaleLowerCase('de').includes(q)))
   .sort((a,b)=>a.student.name.localeCompare(b.student.name,'de'));
 }
 function selected(students,cls,indices){return entries(students,cls).filter(x=>indices.has(x.index)).map(x=>x.student);}
 function filename(students,cls,docs,safe){
  const types=docs.join('+');
  if(students.length===1)return `${types} ${safe(students[0].name)} ${cls}.pdf`;
  return `Einzeldruck Auswahl ${cls} ${students.length} Schüler ${types}.pdf`;
 }
 return Object.freeze({entries,selected,filename});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=EPSelection;
