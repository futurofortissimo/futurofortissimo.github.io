const {execSync}=require('child_process');
const fs=require('fs');
const refs=execSync('git ls-remote --heads origin').toString().split('\n')
  .map(l=>l.split('\t')[1]).filter(Boolean).map(r=>r.replace('refs/heads/',''));
const scan=['origin/main', ...refs.filter(r=>r.startsWith('inject/')).map(r=>'origin/'+r)];
const used=new Set();
for(const ref of scan){
  let files=[];
  try{files=execSync(`git ls-tree -r --name-only ${ref} book/`,{maxBuffer:1e8}).toString().split('\n').filter(f=>f.endsWith('.html'));}catch(e){continue;}
  for(const f of files){
    let t='';try{t=execSync(`git show ${ref}:"${f}"`,{maxBuffer:1e8}).toString();}catch(e){continue;}
    for(const m of t.matchAll(/ff\.(\d+)\.(\d+)/g)) used.add('ff.'+m[1]+'.'+m[2]);
  }
}
console.log('REFS',scan.length,'USED_XREF',used.size);
fs.writeFileSync('_usedxr0812.json',JSON.stringify([...used].sort()));
