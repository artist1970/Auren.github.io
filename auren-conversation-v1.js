/* Auren public conversation scaffold v0.1 — curated answers only, no private data access. */
(()=>{"use strict";
const byId=id=>document.getElementById(id);
const input=byId("message"), send=byId("send"), clear=byId("clear"), log=byId("conversation"), status=byId("knowledge-status");
if(!input||!send||!log)return;
let bank=[],lastReply="",voiceList=[];
const normalize=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
function bubble(who,message){const box=document.createElement("div");box.className="bubble"+(who==="You"?" you":"");const speaker=document.createElement("div");speaker.className="speaker";speaker.textContent=who;const p=document.createElement("p");p.textContent=message;box.append(speaker,p);log.append(box);log.scrollTop=log.scrollHeight;}
function words(s){return normalize(s).split(" ").filter(t=>t.length>2);}
function respond(question){
  const q=normalize(question),terms=new Set(words(question));
  if(!bank.length)return "The public knowledge file is not available. You can still explore the preservation principles on this page; the chat does not connect to private archives.";
  let best=null,top=0;
  for(const entry of bank){const keys=[entry.question,...entry.keywords];let score=0;for(const key of keys){const k=normalize(key);if(q===k)score+=15;else if(k.length>5&&q.includes(k))score+=7;const overlap=words(k).filter(w=>terms.has(w));score+=overlap.length;}if(score>top){top=score;best=entry;}}
  return best&&top>=2?best.answer:"I don't have an approved public answer for that yet. You can ask about the Memory Project, provenance, preserving conversations, artwork, Memory Codices, or AIPCore. I won't invent access to private records.";
}
function submit(){const q=input.value.trim();if(!q)return;if(q.length>1200)return;bubble("You",q);lastReply=respond(q);bubble("Auren",lastReply);input.value="";}
send.addEventListener("click",submit);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}});
clear.addEventListener("click",()=>{log.replaceChildren();lastReply="";stopSpeech();bubble("Auren","A new page begins. What would you like to preserve or explore?");});
document.querySelectorAll("[data-question]").forEach(btn=>btn.addEventListener("click",()=>{input.value=btn.dataset.question||"";submit();}));
async function load(){try{const r=await fetch("knowledge/public-qa.v1.json",{cache:"no-cache"});if(!r.ok)throw Error("unavailable");const data=await r.json();if(data.schema!=="auren-public-knowledge-v1"||!Array.isArray(data.records))throw Error("invalid");bank=data.records.filter(x=>x&&typeof x.question==="string"&&typeof x.answer==="string"&&Array.isArray(x.keywords)&&x.answer.length<3000);status.textContent="Public knowledge ready: "+bank.length+" curated topics. No private archive connection.";}catch{status.textContent="Public knowledge is unavailable; the introductory site remains accessible.";}}
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