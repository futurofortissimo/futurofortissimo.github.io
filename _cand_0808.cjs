const fs=require('fs');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
// used note ids + urls from book html
const files=fs.readdirSync('book').filter(f=>f.endsWith('.html'));
let blob='';
for(const f of files) blob+=fs.readFileSync('book/'+f,'utf8');
const usedIds=new Set([...blob.matchAll(/note_id:(\d+)/g)].map(m=>m[1]));
const usedNotes=new Set([...blob.matchAll(/note (\d{3,5})/g)].map(m=>m[1]));
const out=[];
for(const n of arr){
  const id=String(n.id);
  if(usedIds.has(id)||usedNotes.has(id)) continue;
  const t=(n.title||'').trim();
  const d=(n.description||'').trim();
  if(!t||t.startsWith('NEW:')) continue;
  if(t.length<40) continue;
  if(!n.url) continue;
  // dedup: url already in book?
  if(n.url && blob.includes(n.url)) continue;
  out.push({id:n.id,title:t,desc:d,url:n.url,tags:(n.tags||[]).join(''),ts:n.source_timestamp||''});
}
out.sort((a,b)=>b.id-a.id);
console.log('total unused candidates:',out.length);
fs.writeFileSync('_cand_0808.json',JSON.stringify(out,null,1));
for(const c of out.slice(0,45)) console.log(c.id,'|',c.tags,'|',c.title.slice(0,150));
