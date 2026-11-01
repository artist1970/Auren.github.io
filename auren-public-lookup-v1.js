/* Auren · user-initiated approved public cross-mentor lookup. No private source access or question upload. */
(()=>{"use strict";
const root=document.getElementById("auren-public-lookup");if(!root)return;
const input=root.querySelector("#auren-lookup-query"),result=root.querySelector("#auren-lookup-results"),button=root.querySelector("#auren-lookup-button");
const directory="https://artist1970.github.io/creative-spark.github.io/data/mentor-public-directory.v1.json";
const words=s=>String(s||"").toLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]{3,}/gu)||[];
const stop=new Set(["what","that","this","with","from","have","would","could","should","about","please","your","they","there","their","where","when","which","tell","help","some","will","into"]);
const tokens=s=>new Set(words(s).filter(w=>!stop.has(w)));
const allowedUrl=value=>{try{const u=new URL(value);return u.protocol==="https:"&&u.hostname==="artist1970.github.io"&&u.pathname.endsWith(".json")?u.href:null}catch{return null}};
function message(s){result.replaceChildren();result.textContent=s}
button.addEventListener("click",async()=>{
 const query=input.value.trim();if(query.length<4||query.length>250){message("Enter a question of 4–250 characters.");return}
 button.disabled=true;message("Searching approved public mentor knowledge…");
 try{
  const response=await fetch(directory,{credentials:"omit",cache:"no-cache"});if(!response.ok)throw Error("directory unavailable");const registry=await response.json();
  if(registry.schema!=="mentor-public-directory-v1"||!Array.isArray(registry.mentors))throw Error("unexpected directory");
  const target=tokens(query),matches=[];
  for(const mentor of registry.mentors){
   if(mentor.id==="auren")continue;
   const bankUrl=allowedUrl(mentor.publicKnowledgeUrl);if(!bankUrl)continue;
   try{
    const r=await fetch(bankUrl,{credentials:"omit",cache:"no-cache"});if(!r.ok)continue;const bank=await r.json();if(!Array.isArray(bank.records))continue;
    for(const item of bank.records.slice(0,1500)){
     if(!["approved-public","approved-public-seed"].includes(item.status))continue;
     const answer=item.answer||item.response;if(typeof answer!=="string"||typeof item.question!=="string")continue;
     const title=tokens(item.question),overlap=[...target].filter(w=>title.has(w)).length;
     if(overlap>=2||query.toLowerCase().trim()===item.question.toLowerCase().trim())matches.push({name:mentor.name,url:mentor.url,question:item.question,answer,score:overlap});
    }
   }catch{}
  }
  matches.sort((a,b)=>b.score-a.score);result.replaceChildren();
  if(!matches.length){message("No close public mentor reference was found. Try a more specific question.");return}
  for(const x of matches.slice(0,4)){
   const article=document.createElement("article"),h=document.createElement("strong"),p=document.createElement("p"),a=document.createElement("a");
   h.textContent=x.name+" · "+x.question;p.textContent=x.answer;
   a.href=x.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Visit "+x.name;
   article.style.cssText="padding:12px;border:1px solid #a18ba9;border-radius:7px;margin:9px 0";
   article.append(h,p,a);result.append(article);
  }
 }catch{message("The public mentor directory could not be loaded. Auren's own chat remains available.")}
 finally{button.disabled=false}
});
})();
