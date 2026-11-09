import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const source=readFileSync(new URL('../auren-voice-parity-v1.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function el(tag='div'){const events={};return{tag,events,children:[],value:'',textContent:'',style:{},disabled:false,
 append(...xs){this.children.push(...xs)},setAttribute(){},addEventListener(k,f){events[k]=f},querySelectorAll(){return[]},querySelector(){return null}};}
function boot(){
 const map=new Map(['conversation','voice-select','voice','audio-status','pace','volume'].map(k=>[k,el()]));
 const controls=el();map.get('voice').parentNode=controls;
 map.get('voice-select').value='';map.get('volume').value='80';map.get('pace').value='0.85';
 const voices=[{name:'Arthur',lang:'en-GB',voiceURI:'a',localService:true},{name:'Amélie',lang:'fr-FR',voiceURI:'b',localService:true}];
 const storage=new Map(),spoken=[];
 function SpeechSynthesisUtterance(text){this.text=text;}
 const window={speechSynthesis:{getVoices:()=>voices,addEventListener(){},cancel(){},speak:x=>spoken.push(x)},SpeechSynthesisUtterance};
 const document={getElementById:k=>map.get(k)||null,createElement:el};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 vm.runInNewContext(source,{window,document,localStorage,SpeechSynthesisUtterance},{timeout:1000});
 return{controls,map,storage,spoken};
}
test('Auren retains the existing full voice selector and adds preview and replay',()=>{
 assert.match(html,/id="voice-select"/);
 assert.match(html,/src="auren-voice-parity-v1\.js"/);
 assert.match(source,/Listen to this reply/);
 assert.match(source,/Preview selected voice/);
});
test('preview honors chosen voice, volume and pace',()=>{
 const b=boot(),select=b.map.get('voice-select');
 select.value='1';select.events.change();
 b.controls.children[0].events.click();
 assert.equal(b.spoken.at(-1).voice.name,'Amélie');
 assert.equal(b.spoken.at(-1).lang,'fr-FR');
 assert.equal(b.spoken.at(-1).volume,.8);
 assert.equal(b.spoken.at(-1).rate,.85);
});
test('voice choice only is persisted; no chat uploads or storage',()=>{
 const b=boot();
 b.map.get('voice-select').value='1';b.map.get('voice-select').events.change();
 assert.deepEqual([...b.storage.keys()],['vnv.public.voice.auren.v1']);
 assert.doesNotMatch(source,/fetch\s*\(|XMLHttpRequest|indexedDB|innerHTML/);
});
