const cp=require('child_process');
const ids=process.argv.slice(2);
let all='';
const refs=['origin/main'].concat(cp.execSync('git for-each-ref --format="%(refname:short)" refs/heads/',{encoding:'utf8'}).split('\n').filter(b=>b.trim().startsWith('inject/')));
for(const r of refs){
  let files=[];
  try{ files=cp.execSync(`git ls-tree -r --name-only ${r} book/`,{encoding:'utf8'}).split('\n').filter(f=>f.endsWith('.html')); }catch(e){ continue; }
  for(const f of files){ try{ all+=cp.execSync(`git show ${r}:"${f}"`,{encoding:'utf8',maxBuffer:1e9}); }catch(e){} }
}
console.log('scanned refs:',refs.length,'blob MB:',(all.length/1e6).toFixed(1));
for(const id of ids){
  const hit=all.includes('note_id:'+id)||all.includes('note_id: '+id)||all.includes('note_id="'+id+'"');
  console.log(id, hit?'USED':'free');
}
