import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const file=new URL("../knowledge/public-qa.v1.json",import.meta.url);
const data=JSON.parse(readFileSync(file,"utf8"));
test("public knowledge release has expected schema and nonempty records",()=>{
 assert.equal(data.schema,"auren-public-knowledge-v1");
 assert.equal(data.privacy,"public-only");
 assert.ok(Array.isArray(data.records)&&data.records.length>=50);
});
test("public knowledge records have unique stable IDs, public states and bounded strings",()=>{
 const ids=new Set();
 for(const r of data.records){
  assert.match(r.id,/^auren-[a-z0-9-]{4,40}$/);
  assert.equal(ids.has(r.id),false,"duplicate "+r.id);ids.add(r.id);
  assert.ok(["approved-public","approved-public-seed"].includes(r.status));
  assert.ok(typeof r.question==="string"&&r.question.trim()&&r.question.length<=1000);
  assert.ok(typeof r.answer==="string"&&r.answer.trim()&&r.answer.length<=3000);
  assert.ok(Array.isArray(r.keywords)&&r.keywords.every(k=>typeof k==="string"&&k.length<=100));
 }
});
test("private-only metadata and sensitive records cannot be included",()=>{
 const forbidden=["classification","source","verifiedPrivateCitation","privateTranscript","vault","passphrase","secret","token","credential","accessKey","privateNotes"];
 for(const r of data.records){
  for(const key of Object.keys(r))assert.equal(forbidden.includes(key),false,key+" leaked in "+r.id);
 }
});
test("public seed contains crucial archival guidance",()=>{
 const all=data.records.map(r=>r.question.toLowerCase()).join("\n");
 for(const concept of ["provenance","conversation","memory codex","privacy","original"])assert.ok(all.includes(concept),"missing "+concept);
});
