import fs from 'fs';
const notes = JSON.parse(fs.readFileSync('notes.json','utf8'));
const arr = Array.isArray(notes) ? notes : (notes.notes || Object.values(notes)[0]);
console.log('total notes', arr.length, 'sample keys', Object.keys(arr[0]).join(','));
// collect used ids from book html
let book='';
for (const f of fs.readdirSync('book')) if (f.endsWith('.html')) book += fs.readFileSync('book/'+f,'utf8');
const usedIds = new Set([...book.matchAll(/note[_-]?id[:=]?\s*"?(\d+)/gi)].map(m=>m[1]));
console.log('used ids in book:', usedIds.size);
const cands = arr.filter(n => +n.id >= 1600 && !usedIds.has(String(n.id)));
console.log('candidates >=1600 unused:', cands.length);
fs.writeFileSync('_cand_0807.json', JSON.stringify(cands.slice(0,80),null,1));
for (const c of cands.slice(0,45)) console.log(c.id,'|',(c.tags||[]).join?.('')||c.tags,'|',(c.title||'').slice(0,110));
