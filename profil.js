/* PA-Tools: persönliches Profil – ausschließlich lokal im Browser. */
'use strict';
(()=>{
 const KEY='pa-tools-personal-profile-v1';
 const FIELDS=['name','role','school','schoolAddress','email','phone','signatureName'];
 const defaults={role:'Praxisberater',useSignature:true};
 let profile=null;
 function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&v.version===1?v:null;}catch{return null;}}
 function current(){return profile||read();}
 function validate(v){if(!v||v.version!==1||typeof v!=='object')throw Error('Keine gültige PA-Tools-Profildatei (Version 1).');const obj={version:1};for(const k of FIELDS)obj[k]=String(v[k]||'').slice(0,500);obj.useSignature=v.useSignature!==false;
 if(v.signature){if(typeof v.signature!=='string'||v.signature.length>1900000||!/^data:image\/(png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(v.signature))throw Error('Unterschrift muss ein PNG/JPEG mit maximal ca. 1,4 MB sein.');obj.signature=v.signature;}
 return obj;}
 function save(v){const p=validate(v);try{localStorage.setItem(KEY,JSON.stringify(p));}catch{throw Error('Browserspeicher voll oder blockiert. Bitte Unterschriftsdatei verkleinern.');}profile=p;window.dispatchEvent(new Event('pa-profile-changed'));return p;}
 function apply(force=false){const p=current();if(!p)return;const mapping= {
  epSchool:'school',epStaff:'name',
  leaderFullName:'name',leaderRole:'role'
 };
 for(const [id,key] of Object.entries(mapping)){const el=document.getElementById(id);if(!el||!p[key])continue;const defaultVal=defaults[key]||'';
 if(force||!el.value||el.value===defaultVal||id==='epSchool'&&!el.value.trim()||id==='epStaff'&&!el.value.trim()){el.value=p[key];el.dispatchEvent(new Event('input',{bubbles:true}));}}
 const epSig=document.getElementById('epUseSign');if(epSig&&p.signature)epSig.checked=p.useSignature!==false;
 const beSig=document.getElementById('beUseSign');if(beSig)beSig.checked=p.useSignature!==false;
 }
 function getSignatureBytes(){const p=current();if(!p?.signature)return null;try{const b=atob(p.signature.split(',')[1]);return Uint8Array.from(b,c=>c.charCodeAt(0));}catch{return null;}}
 function initWidget(){if(!window.PAAccess?.allowed?.())return;
 const main=document.querySelector('main');if(!main)return;
 const section=document.createElement('section');section.className='panel profile-widget';section.innerHTML='<details><summary>Persönliches Profil – optional (lokal speichern, importieren oder exportieren)</summary><p>Deine Stammdaten und eine Unterschrift können in den unterstützten Werkzeugen wiederverwendet werden. Die Profildatei bleibt auf deinem Computer und wird <strong>nicht auf GitHub hochgeladen</strong>. Zum Übertragen auf einen anderen PC das Profil exportieren und dort importieren. Ein eingebundenes Unterschriftsbild ist vertraulich – die JSON-Datei entsprechend schützen.</p><div class="profile-actions"><a id="profileEditLink" href="profil.html">Profil anlegen / bearbeiten</a><label class="profile-import">Profil-Datei einlesen <input id="profileQuickImport" type="file" accept=".json,application/json"></label><button type="button" id="profileQuickExport">Profil exportieren</button></div><p class="profile-status" id="profileQuickStatus"></p></details>';
 main.append(section);
 const a=section.querySelector('#profileEditLink');const tok=PAAccess.currentToken?.();if(tok)a.href+='?key='+encodeURIComponent(tok);
 const status=section.querySelector('#profileQuickStatus');status.textContent=current()?'Ein persönliches Profil ist lokal gespeichert.':'Noch kein persönliches Profil gespeichert.';
 section.querySelector('#profileQuickImport').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{save(JSON.parse(await f.text()));apply(true);status.textContent='Profil erfolgreich eingelesen und übernommen.';}catch(err){status.textContent='Import nicht möglich: '+err.message;}});
 section.querySelector('#profileQuickExport').addEventListener('click',()=>{const p=current();if(!p){status.textContent='Bitte zuerst ein Profil anlegen oder importieren.';return;}download(p);});
 }
 function download(p){const blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='PA-Tools_Mein-Profil.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 window.PAProfile={get:current,save,apply,getSignatureBytes,download,defaults};
 document.addEventListener('DOMContentLoaded',()=>{apply();initWidget();});
 window.addEventListener('pa-profile-changed',()=>apply(true));
})();
