import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),chat=read("auren-conversation-v1.js"),voice=read("auren-voice-parity-v1.js"),lookup=read("auren-public-lookup-v1.js");
const source=JSON.parse(read("knowledge/public-qa.v1.json"));
const shard=JSON.parse(read("knowledge/additions-0052-0063.json"));
test("Auren's source and approved additions remain intact",()=>{
 assert.equal(source.records.length,51);
 assert.equal(shard.records.length,12);
 assert.equal(new Set([...source.records,...shard.records].map(x=>x.id)).size,63);
 assert.ok([...source.records,...shard.records].every(x=>["approved-public","approved-public-seed"].includes(x.status)));
});
test("draft knowledge is independently unpublished",()=>{
 const d=JSON.parse(read("knowledge/drafts/archival-candidates-2026-11.json"));
 assert.equal(d.records.length,10);
 assert.ok(d.records.every(x=>x.status==="draft"&&!x.published));
 assert.doesNotMatch(html,/archival-candidates-2026-11/);
});
test("public chat rejects private-record requests and weak archival matches",()=>{
 assert.match(chat,/private archive|private originals/i);
 assert.match(chat,/bank\.length!==51/);
 assert.match(chat,/extra\.records\.length===12/);
 assert.match(chat,/best>=24&&\(best>=runner\+8\|\|best>=90\)/);
 assert.doesNotMatch(chat,/localStorage|indexedDB|sessionStorage/);
});
test("Auren's voice controls are explicit, persistent, and keep manual replay",()=>{
 assert.match(voice,/vnv\.public\.voice\.autoplay\.auren\.v1/);
 assert.match(voice,/Voice On/);
 assert.match(voice,/if\(readNew&&autoRead&&content\)speak\(content\)/);
 assert.match(voice,/Listen to this reply/);
 assert.doesNotMatch(voice,/XMLHttpRequest|indexedDB|innerHTML/);
});
test("VNV/KA styling and official navigation remain intact",()=>{
 const css=read("styles/auren-landing-refinement-v1.css");
 assert.match(html,/id="auren-introduction"/);
 assert.match(html,/class="auren-chat-anchor"/);
 assert.match(css,/\.auren-chat-anchor\{position:sticky/);
 assert.match(css,/--radius:7px/);
 assert.match(html,/vnv-header-autopopulate\.js/);
 assert.match(html,/vnv-ticker-autopopulate\.js/);
 assert.match(html,/vnv-333-ticker\.js/);
 assert.match(html,/vnv-ecosystem-toolbar\.js/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(html,/AurenCore\.html|privateTranscript/);
});
test("optional public mentor reference search is attributed and has no private source",()=>{
 assert.match(lookup,/approved-public-seed/);
 assert.match(lookup,/mentor\.name/);
 assert.match(lookup,/approved public mentor knowledge/i);
 assert.doesNotMatch(lookup,/localStorage|indexedDB|privateTranscript/);
});
