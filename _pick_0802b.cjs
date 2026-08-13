const fs=require('fs');
const notes=JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr=Array.isArray(notes)?notes:(notes.notes||[]);
const used=new Set(fs.readFileSync('_used_all_0802.txt','utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
const out=arr.filter(n=>!used.has(String(n.id))).filter(n=>{
  const t=(n.text||n.content||n.title||'');
  return t.length>80 && !/^NEW:/.test(t);
});
out.sort((a,b)=>b.id-a.id);
console.log('total notes',arr.length,'unused-good',out.length);
for(const n of out.slice(0,45)){
  const t=(n.text||n.content||n.title||'').replace(/\s+/g,' ');
  console.log(n.id+' | '+(n.emoji||JSON.stringify(n.tags||n.categories||''))+' | '+t.slice(0,190)+' | '+(n.url||n.source||''));
}
