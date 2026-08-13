// pick candidate notes for FF inject 2026-08-03
const fs = require('fs');
const path = require('path');

const notes = JSON.parse(fs.readFileSync('notes.json', 'utf8'));
const arr = Array.isArray(notes) ? notes : (notes.notes || []);

// collect all text of book/*.html to test dedup
const bookDir = 'book';
const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.html'));
let blob = '';
for (const f of files) {
  blob += fs.readFileSync(path.join(bookDir, f), 'utf8');
}
console.log('book html files:', files.length, 'blob MB:', (blob.length / 1e6).toFixed(1));

const usedIds = new Set();
const re = /note_id[:=\s"']*([0-9]{2,5})/gi;
let m;
while ((m = re.exec(blob))) usedIds.add(Number(m[1]));
console.log('note_ids referenced in book:', [...usedIds].sort((a, b) => a - b).join(','));

const cands = arr.filter(n => n.id >= 1590 && !usedIds.has(n.id));
console.log('\n=== candidates id>=1590 not referenced ===');
for (const n of cands) {
  const url = n.url || '';
  const urlUsed = url && blob.includes(url.replace(/^https?:\/\//, '').split('?')[0]);
  console.log(`\n[${n.id}] used=${urlUsed ? 'URL-IN-BOOK' : 'free'} tags=${JSON.stringify(n.tags)}`);
  console.log('  title: ' + (n.title || ''));
  console.log('  url  : ' + url);
  console.log('  desc : ' + String(n.description || '').slice(0, 400).replace(/\s+/g, ' '));
}
