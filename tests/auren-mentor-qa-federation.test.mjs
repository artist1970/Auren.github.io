import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const page=fs.readFileSync(new URL("index.html",root),"utf8");
const own=fs.readFileSync(new URL("auren-conversation-v1.js",root),"utf8");
const shared=fs.readFileSync(new URL("creative-spark-mentor-qa-v1.js",root),"utf8");
test("Auren loads the approved nine-mentor adapter before his own conversation engine",()=>{
 const adapter=page.indexOf('<script src="creative-spark-mentor-qa-v1.js" defer></script>');
 const conversation=page.indexOf('<script src="auren-conversation-v1.js" defer></script>');
 assert.ok(adapter>=0&&conversation>adapter);
 assert.match(shared,/version:"1\.1\.0"/);
 assert.match(shared,/expectedTotal:1354/);
 new vm.Script(shared);
});
test("Auren retains original validated public bank first and credits cross-mentor references only as fallback",()=>{
 const primary=own.indexOf('if(winner&&best>=24');
 const bridge=own.indexOf('const cross=publicReference(question);if(cross)return cross;');
 assert.ok(primary>=0&&bridge>primary);
 assert.match(own,/mentorId:"auren"/);
 assert.match(own,/sourceName.*approved public knowledge/);
 assert.match(own,/data\.privacy!=="public-only"/);
 assert.match(own,/Please do not enter credentials/);
 new vm.Script(own);
});
test("cross-mentor retrieval never accesses draft Code Capsule files or transcripts",()=>{
 assert.doesNotMatch(shared,/language-data\.html|cloudFS|localStorage\.setItem|indexedDB|XMLHttpRequest/);
 assert.match(shared,/credentials:"omit"/);
 assert.match(shared,/unapproved-or-malformed/);
 assert.match(shared,/privateCOREAccess:false/);
});
