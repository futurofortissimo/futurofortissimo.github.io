const fs=require('fs'),cp=require('child_process');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
// blob = book/*.html on origin/main
const files=cp.execSync('git ls-tree --name-only origin/main book/',{encoding:'utf8'}).trim().split('\n').filter(f=>f.endsWith('.html'));
let blob='';
for(const f of files) blob+=cp.execSync(`git show origin/main:"${f}"`,{encoding:'utf8',maxBuffer:1e8});
// plus open-PR added lines
const pr=fs.readFileSync('./_prclaims_0810.txt','utf8');
blob+=pr;
const usedIds=new Set([...blob.matchAll(/note_id:(\d+)/g)].map(m=>m[1]));
[...blob.matchAll(/note (\d{4})/g)].forEach(m=>usedIds.add(m[1]));
const out=[];
for(const n of arr){
  const id=String(n.id);
  if(usedIds.has(id)) continue;
  const t=(n.title||'').trim();
  if(!t||t.startsWith('NEW:')||t.length<40) continue;
  if(!n.url) continue;
  if(blob.includes(n.url)) continue;
  out.push({id:n.id,title:t,desc:(n.description||'').trim(),url:n.url,tags:(n.tags||[]).join('')});
}
out.sort((a,b)=>b.id-a.id);
console.log('unused candidates:',out.length);
fs.writeFileSync('_cand2_0810.json',JSON.stringify(out,null,1));
for(const c of out.slice(0,40)) console.log(c.id,'|',c.tags,'|',c.title.slice(0,140));
