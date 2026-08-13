const fs=require('fs');
const {execSync}=require('child_process');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
const used=new Set(); const urls=new Set();
// all remote inject branches + main
const refs=execSync('git ls-remote --heads origin').toString().split('\n')
  .map(l=>l.split('\t')[1]).filter(Boolean).map(r=>r.replace('refs/heads/',''));
const scan=['origin/main', ...refs.filter(r=>r.startsWith('inject/')).map(r=>'origin/'+r)];
for(const ref of scan){
  let files=[];
  try{files=execSync(`git ls-tree -r --name-only ${ref} book/`,{maxBuffer:1e8}).toString().split('\n').filter(f=>f.endsWith('.html'));}catch(e){continue;}
  for(const f of files){
    let t='';try{t=execSync(`git show ${ref}:"${f}"`,{maxBuffer:1e8}).toString();}catch(e){continue;}
    for(const m of t.matchAll(/note_id[:=]\s*"?(\d+)/g)) used.add(m[1]);
    for(const m of t.matchAll(/note (\d{3,5})/g)) used.add(m[1]);
    for(const m of t.matchAll(/href="(https?:\/\/[^"]+)"/g)) urls.add(m[1]);
  }
}
console.log('SCANNED_REFS',scan.length,'USED_IDS',used.size);
const out=arr.filter(n=>!used.has(String(n.id)) && n.url && !urls.has(n.url) && (n.title||'').length>40 && !(n.title||'').startsWith('NEW:'));
out.sort((a,b)=>b.id-a.id);
console.log('CANDS',out.length);
fs.writeFileSync('_cand_0809b.json',JSON.stringify(out.map(n=>({id:n.id,title:n.title,desc:n.description,url:n.url,tags:(n.tags||[]).join?.('')||n.tags})),null,1));
for(const c of out.slice(0,70)) console.log(c.id,'|',((c.tags||[]).join?.('')||c.tags),'|',(c.title||'').slice(0,120));
