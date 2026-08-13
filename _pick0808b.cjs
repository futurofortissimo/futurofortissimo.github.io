const fs=require('fs');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
// gather used note ids from book html on origin/main
const {execSync}=require('child_process');
const used=new Set();
const files=execSync('git ls-tree -r --name-only origin/main book/',{cwd:process.cwd()}).toString().split('\n').filter(f=>f.endsWith('.html'));
for(const f of files){
  let t='';try{t=execSync(`git show origin/main:"${f}"`,{maxBuffer:1e8}).toString();}catch(e){continue;}
  for(const m of t.matchAll(/note_id[:=]\s*"?(\d+)/g)) used.add(m[1]);
}
console.log('USED_COUNT',used.size);
const cands=arr.filter(n=>n.id>=1560 && !used.has(String(n.id)));
cands.sort((a,b)=>b.id-a.id);
console.log('CANDS',cands.length);
for(const c of cands.slice(0,80)) console.log(c.id,'|',(c.tags||[]).join?.('')||c.tags,'|',(c.title||'').slice(0,110),'|',c.url||'');
