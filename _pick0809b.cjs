const fs=require('fs'),cp=require('child_process');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
console.log('total notes:',arr.length);
// used note ids on origin/main book/*.html
let used=new Set();
const files=cp.execSync('git ls-tree --name-only origin/main book/',{encoding:'utf8'}).split('\n').filter(f=>f.endsWith('.html'));
let blob='';
for(const f of files){ try{ blob+=cp.execSync(`git show origin/main:"${f}"`,{encoding:'utf8',maxBuffer:1e9}); }catch(e){} }
// also branches with open PRs
let brblob='';
const brs=cp.execSync('git for-each-ref --format="%(refname:short)" refs/heads/',{encoding:'utf8'}).split('\n').filter(b=>b.startsWith('inject/'));
for(const b of brs){ try{ const fl=cp.execSync(`git diff --name-only origin/main..${b} -- book/`,{encoding:'utf8'}).split('\n').filter(Boolean); for(const f of fl){ if(!f.endsWith('.html'))continue; brblob+=cp.execSync(`git show ${b}:"${f}"`,{encoding:'utf8',maxBuffer:1e9}); } }catch(e){} }
const all=blob+brblob;
const cand=arr.filter(n=>{
  const t=(n.title||'');
  if(/^NEW:/.test(t)) return false;
  if(t.length<40) return false;
  if(!n.description||n.description.length<120) return false;
  if(all.includes('note_id:'+n.id)||all.includes('note_id: '+n.id)) return false;
  return true;
});
console.log('candidates:',cand.length);
const top=cand.sort((a,b)=>b.id-a.id).slice(0,40);
fs.writeFileSync('_pick0809b.json',JSON.stringify(top,null,1));
top.forEach(n=>console.log(n.id,'|',(n.tags||[]).join(''),'|',n.title.slice(0,120)));
