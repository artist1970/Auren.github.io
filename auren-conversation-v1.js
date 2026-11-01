/* Auren public conversation scaffold v0.1 — curated answers only, no private data access. */
(()=>{"use strict";
const byId=id=>document.getElementById(id);
const input=byId("message"), send=byId("send"), clear=byId("clear"), log=byId("conversation"), status=byId("knowledge-status");
if(!input||!send||!log)return;
let bank=[],lastReply="",voiceList=[];
const normalize=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
function bubble(who,message){const box=document.createElement("div");box.className="bubble"+(who==="You"?" you":"");const speaker=document.createElement("div");speaker.className="speaker";speaker.textContent=who;const p=document.createElement("p");p.textContent=message;box.append(speaker,p);log.append(box);log.scrollTop=log.scrollHeight;}
const ignored=new Set(["what","how","can","could","would","should","does","have","your","about","this","that","with","from","where","when","which","there","into","will","some","help","tell","please","know","want","give","make","here","them","their","then","more","the","are","you","and","for","why","who","do","is","a","an","my","me","to","in","of","on"]);
function words(s){return normalize(s).split(" ").filter(t=>t.length>2&&!ignored.has(t));}
function respond(question){
 const q=normalize(question),terms=new Set(words(question));
 if(!bank.length)return "The public knowledge file is not available. You can still explore the preservation principles on this page; the chat does not connect to private archives.";
 let winner=null,best=0,runner=0;
 for(const entry of bank){
  const title=normalize(entry.question),keys=(entry.keywords||[]).map(normalize).filter(Boolean),titleTerms=new Set(words(title));
  let score=q===title?100:0;
  for(const k of keys){if(q===k)score=Math.max(score,65);else if(k.length>=6&&q.includes(k))score+=12;}
  for(const t of terms){if(titleTerms.has(t))score+=5;else if(keys.some(k=>words(k).includes(t)))score+=3;}
  if(terms.size&&[...terms].every(t=>titleTerms.has(t)))score+=8;
  if(score>best){runner=best;best=score;winner=entry;}else if(score>runner)runner=score;
 }
 if(winner&&best>=9&&(best>=runner+3||best>=55))return winner.answer;
 return "I don't have a sufficiently clear approved public answer for that question yet. Try asking specifically about preservation, provenance, source custody, creative works, Memory Codices, or our archive's privacy rules. I can't access private records here.";
}
function submit(){const q=input.value.trim();if(!q)return;if(q.length>1200)return;bubble("You",q);lastReply=respond(q);bubble("Auren",lastReply);input.value="";}
send.addEventListener("click",submit);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}});
clear.addEventListener("click",()=>{log.replaceChildren();lastReply="";stopSpeech();bubble("Auren","A new page begins. What would you like to preserve or explore?");});
document.querySelectorAll("[data-question]").forEach(btn=>btn.addEventListener("click",()=>{input.value=btn.dataset.question||"";submit();}));
async function load(){try{const r=await fetch("knowledge/public-qa.v1.json",{cache:"no-cache"});if(!r.ok)throw Error("unavailable");const data=await r.json();if(data.schema!=="auren-public-knowledge-v1"||!Array.isArray(data.records))throw Error("invalid");bank=data.records.filter(x=>x&&typeof x.question==="string"&&typeof x.answer==="string"&&Array.isArray(x.keywords)&&x.answer.length<3000&&["approved-public","approved-public-seed"].includes(x.status));
try{
 const extraResponse=await fetch("knowledge/additions-0052-0063.json",{cache:"no-cache"});
 if(extraResponse.ok){
  const extra=await extraResponse.json();
  if(extra.schema==="auren-public-knowledge-shard-v1"&&Array.isArray(extra.records)){
   const seen=new Set(bank.map(x=>x.id));
   for(const entry of extra.records){
    if(entry&&typeof entry.id==="string"&&!seen.has(entry.id)&&typeof entry.question==="string"&&typeof entry.answer==="string"&&Array.isArray(entry.keywords)&&["approved-public","approved-public-seed"].includes(entry.status)){bank.unshift(entry);seen.add(entry.id);}
   }
  }
 }
}catch{}
status.textContent="Public knowledge ready: "+bank.length+" curated topics. No private archive connection.";}catch{status.textContent="Public knowledge is unavailable; the introductory site remains accessible.";}}
const speech=window.speechSynthesis,Speech=window.SpeechSynthesisUtterance,select=byId("voice-select"),volume=byId("volume"),pace=byId("pace"),audioStatus=byId("audio-status");
function stopSpeech(){if(speech)speech.cancel();}
function populate(){if(!speech||!select)return;voiceList=speech.getVoices();const previous=select.value;select.replaceChildren(new Option("Device default",""));voiceList.forEach((v,i)=>select.add(new Option(v.name+" ("+v.lang+")",String(i))));if(voiceList[Number(previous)])select.value=previous;}
if(speech&&Speech){populate();speech.addEventListener?.("voiceschanged",populate);}else{audioStatus.textContent="Speech is not supported by this browser.";}
byId("voice").addEventListener("click",()=>{if(!speech||!Speech){audioStatus.textContent="Speech is unavailable on this device.";return;}if(!lastReply){audioStatus.textContent="Ask a question first, then choose Listen to reply.";return;}stopSpeech();const u=new Speech(lastReply);u.lang="en-US";u.volume=Number(volume.value)/100;u.rate=Number(pace.value);const chosen=voiceList[Number(select.value)];if(select.value!==""&&chosen)u.voice=chosen;u.onerror=()=>{audioStatus.textContent="Speech playback was unavailable.";};speech.speak(u);audioStatus.textContent="Reading the latest reply aloud."});
byId("stop-voice").addEventListener("click",()=>{stopSpeech();audioStatus.textContent="Audio stopped.";});
volume.addEventListener("input",()=>{byId("volume-value").textContent=volume.value+"%";});pace.addEventListener("input",()=>{byId("pace-value").textContent=Number(pace.value).toFixed(2)+"×";});
window.addEventListener("pagehide",stopSpeech);
bubble("Auren","Welcome to the Living Archive. I can introduce our preservation methods, provenance, Memory Codices, and the care we give to original creative work. What would you like to explore?");
load();
})();