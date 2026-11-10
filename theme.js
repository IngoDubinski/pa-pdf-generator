"use strict";
(function(){
 const key="pa-drucktool-theme";
 let theme="light";
 try{theme=localStorage.getItem(key)==="dark"?"dark":"light";}catch(e){}
 function apply(){document.documentElement.dataset.theme=theme;const b=document.getElementById("themeToggle");if(b){b.textContent=theme==="dark"?"☀ Hell":"☾ Dunkel";b.setAttribute("aria-pressed",String(theme==="dark"));}}
 apply();
 document.addEventListener("DOMContentLoaded",()=>{
  const header=document.querySelector("header .wrap");if(!header)return;
  const b=document.createElement("button");b.type="button";b.id="themeToggle";b.className="theme-toggle";b.title="Farbschema wechseln";
  b.addEventListener("click",()=>{theme=theme==="dark"?"light":"dark";try{localStorage.setItem(key,theme);}catch(e){}apply();});
  header.append(b);apply();
 });
})();
