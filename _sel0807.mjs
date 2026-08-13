import fs from 'fs';
const notes = JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr = Array.isArray(notes) ? notes : (notes.notes || Object.values(notes)[0]);
let book='';
for (const f of fs.readdirSync('book')) if (f.endsWith('.html')) book += fs.readFileSync('book/'+f,'utf8');
// ids already injected (comment markers "note NNNN") + urls already present
const usedIds = new Set([...book.matchAll(/note\s+(\d{3,5})/gi)].map(m=>m[1]));
const good = arr.filter(n => {
  const t=(n.title||'').trim(), d=(n.description||'').trim();
  if (!t || t.startsWith('NEW:')) return false;
  if (d.length < 60) return false;
  if (!n.url) return false;
  if (usedIds.has(String(n.id))) return false;
  if (book.includes(n.url)) return false;   // url already cited somewhere
  return true;
});
console.log('total',arr.length,'| usedIds',usedIds.size,'| good unused',good.length);
console.log('--- top 30 by id desc ---');
for (const c of good.sort((a,b)=>b.id-a.id).slice(0,30))
  console.log(c.id,'|',(Array.isArray(c.tags)?c.tags.join(''):c.tags||''),'|',(c.title||'').slice(0,95));
fs.writeFileSync('_good0807.json', JSON.stringify(good.sort((a,b)=>b.id-a.id).slice(0,60),null,1));
