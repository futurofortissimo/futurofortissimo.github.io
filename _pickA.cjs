const fs=require('fs'),{execSync}=require('child_process');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
const used=new Set();
const refs=execSync('git branch -r --format="%(refname:short)"').toString().split('\n').map(s=>s.trim()).filter(s=>s&&(s==='origin/main'||s.includes('inject/')));
for(const ref of refs){
  let files=[];try{files=execSync(`git ls-tree -r --name-only ${ref} book/`,{maxBuffer:1e8}).toString().split('\n').filter(f=>f.endsWith('.html'));}catch(e){continue;}
  for(const f of files){let t='';try{t=execSync(`git show ${ref}:"${f}"`,{maxBuffer:1e8}).toString();}catch(e){continue;}
   for(const m of t.matchAll(/note_id[:=]\s*"?(\d+)/g)) used.add(m[1]);}
}
fs.writeFileSync('_used_all_0808.txt',[...used].sort((a,b)=>a-b).join('\n'));
console.log('USED',used.size);
const c=arr.filter(n=>n.id>=1560&&!used.has(String(n.id))&&(n.tags||[]).length>0).sort((a,b)=>b.id-a.id);
console.log('CANDS',c.length);
for(const x of c) console.log(x.id,'|',(x.tags||[]).join(''),'|',(x.title||'').slice(0,130));
