/* Auren voice parity: selected narrator preview and chronological reply playback.
 * Reuses existing full browser voice dropdown, volume and pace controls.
 * Stores only the selected voice identity, never chat content.
 */
(()=>{"use strict";
const log=document.getElementById("conversation"),select=document.getElementById("voice-select"),voiceBtn=document.getElementById("voice"),status=document.getElementById("audio-status");
if(!log||!select||!voiceBtn||!status)return;
const controls=voiceBtn.parentNode;
const preview=document.createElement("button");preview.type="button";preview.className="secondary";preview.id="auren-voice-preview";preview.textContent="Preview selected voice";
controls.append(preview);
const autoButton=document.createElement("button");autoButton.type="button";autoButton.className="secondary";autoButton.id="auren-auto-voice";autoButton.setAttribute("aria-pressed","false");
controls.append(autoButton);
const supported=("speechSynthesis" in window)&&("SpeechSynthesisUtterance" in window);
const pref="vnv.public.voice.auren.v1",key=v=>JSON.stringify([v.voiceURI||"",v.name||"",v.lang||"",!!v.localService]);
let preferred="",autoRead=false;
const autoPref="vnv.public.voice.autoplay.auren.v1";
try{autoRead=localStorage.getItem(autoPref)==="on";}catch{}
function paintAuto(){autoButton.textContent=autoRead?"Voice On":"Voice Off";autoButton.setAttribute("aria-pressed",String(autoRead));}
paintAuto();
try{const k=localStorage.getItem(pref);if(k&&k.length<500)preferred=k;}catch{}
function voice(){const list=Array.from(window.speechSynthesis?.getVoices?.()||[]);return select.value!==""?list[Number(select.value)]||null:null;}
function speak(text){
 if(!supported){status.textContent="Speech is unavailable in this browser.";return;}
 try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(String(text||"").slice(0,2800));const v=voice();
  utterance.lang=v?.lang||"en-GB";if(v)utterance.voice=v;
  utterance.rate=Number(document.getElementById("pace")?.value||.85);
  utterance.volume=Number(document.getElementById("volume")?.value||80)/100;
  utterance.onstart=()=>{status.textContent="Reading with "+(v?.name||"browser default")+"."};
  utterance.onend=()=>{status.textContent="Playback finished."};
  utterance.onerror=()=>{status.textContent="Speech playback unavailable."};
  window.speechSynthesis.speak(utterance);
 }catch{status.textContent="Speech playback unavailable.";}
}
autoButton.addEventListener("click",()=>{
 if(!supported)return;
 autoRead=!autoRead;
 try{localStorage.setItem(autoPref,autoRead?"on":"off");}catch{}
 if(!autoRead)window.speechSynthesis.cancel();
 paintAuto();
 status.textContent=autoRead?"Future Auren replies will be read aloud.":"Automatic narration is off; manual replay is available.";
});
function restore(){
 if(!supported||!preferred)return;
 const list=Array.from(window.speechSynthesis.getVoices()||[]);
 const index=list.findIndex(v=>key(v)===preferred);
 if(index>=0)select.value=String(index);
 else if(list.length){preferred="";select.value="";status.textContent="Previously selected voice is unavailable; device default restored.";}
}
function decorate(readNew=false){
 for(const box of log.querySelectorAll(".bubble:not(.you)")){
  if(box.querySelector(".auren-replay"))continue;
  const p=box.querySelector("p");if(!p)continue;
  const content=p.textContent,button=document.createElement("button");
  button.type="button";button.className="secondary auren-replay";button.textContent="Listen to this reply";
  button.style.cssText="display:block;margin-top:8px;padding:9px 12px;font:inherit;font-size:16px;cursor:pointer";
  button.addEventListener("click",()=>speak(content));box.append(button);
  if(readNew&&autoRead&&content)speak(content);
 }
}
decorate();
if("MutationObserver" in window){const observer=new MutationObserver(changes=>{
 if(!changes.some(change=>change.type==="childList"&&Array.from(change.addedNodes||[]).some(n=>n.parentNode===log)))return;
 decorate(true);
});observer.observe(log,{childList:true});}
select.addEventListener("change",()=>{
 const v=voice();preferred=v?key(v):"";try{localStorage.setItem(pref,preferred);}catch{}
 status.textContent="Voice: "+(v?v.name+" · "+v.lang:"device default");
});
preview.addEventListener("click",()=>speak("Welcome to the Living Archive. Every creation has a history worth preserving."));
if(supported){restore();window.speechSynthesis.addEventListener?.("voiceschanged",restore);}
else{preview.disabled=true;autoButton.disabled=true;status.textContent="Speech is unavailable in this browser.";}
})();
