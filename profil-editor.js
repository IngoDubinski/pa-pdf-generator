'use strict';
(()=>{
 const form=document.getElementById('profileForm'),sigFile=document.getElementById('profileSignature'),status=document.getElementById('profileStatus'),sigStatus=document.getElementById('signatureStatus'),preview=document.getElementById('signaturePreview');
 let sig='';const keys=['name','role','school','schoolAddress','email','phone'];
 function show(v){sig=v.signature||'';for(const k of keys)form.elements[k].value=v[k]||PAProfile.defaults[k]||'';form.elements.useSignature.checked=v.useSignature!==false;preview.hidden=!sig;preview.src=sig||'';sigStatus.textContent=sig?'Unterschrift im Profil vorhanden.':'Noch kein Unterschriftsbild hinterlegt.';}
 show(PAProfile.get()||{version:1,useSignature:true});
 sigFile.addEventListener('change',async()=>{const f=sigFile.files[0];if(!f)return;if(!['image/png','image/jpeg'].includes(f.type)||f.size>1400000){sigStatus.textContent='Bitte PNG/JPG mit höchstens 1,4 MB wählen.';sigFile.value='';return;}const r=new FileReader();r.onload=()=>{sig=r.result;preview.src=sig;preview.hidden=false;sigStatus.textContent='Unterschrift ausgewählt. Bitte Profil speichern.';};r.readAsDataURL(f);});
 document.getElementById('removeSignature').addEventListener('click',()=>{sig='';preview.hidden=true;preview.removeAttribute('src');sigFile.value='';sigStatus.textContent='Unterschrift beim nächsten Speichern entfernt.';});
 form.addEventListener('submit',e=>{e.preventDefault();try{const p={version:1,useSignature:form.elements.useSignature.checked};for(const k of keys)p[k]=form.elements[k].value.trim();if(sig)p.signature=sig;PAProfile.save(p);status.textContent='Profil lokal gespeichert. Alle unterstützten Werkzeuge übernehmen die Angaben.';}catch(err){status.textContent='Fehler: '+err.message;}});
 document.getElementById('exportProfile').onclick=()=>{const p=PAProfile.get();if(!p){status.textContent='Bitte Profil zuerst speichern.';return;}PAProfile.download(p);};
 document.getElementById('importProfile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const p=PAProfile.save(JSON.parse(await f.text()));show(p);status.textContent='Profildatei importiert.';}catch(err){status.textContent='Import nicht möglich: '+err.message;}};
})();
