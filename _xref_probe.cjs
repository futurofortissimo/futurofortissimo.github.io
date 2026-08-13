const fs = require('fs');
const src = fs.readFileSync('data.js', 'utf8');
const mod = src.replace('export const rawData', 'const rawData') + '\nmodule.exports = rawData;';
fs.writeFileSync('_dj_tmp2.cjs', mod);
const data = require('./_dj_tmp2.cjs');
const want = process.argv.slice(2);
const all = [];
for (const p of data) for (const s of (p.subchapters || [])) all.push({ p, s });
if (!want.length) { console.log('total subchapters', all.length); process.exit(0); }
for (const code of want) {
  const hit = all.filter(x => new RegExp('\\b' + code.replace(/\./g, '\\.') + '\\b').test(x.s.title));
  for (const h of hit) {
    console.log('===== ' + h.s.title + ' ===== [' + h.p.title + ']');
    console.log('LINK: ' + h.s.link);
    console.log((h.s.content || '').slice(0, 1100));
    console.log('');
  }
  if (!hit.length) console.log('!! NOT FOUND ' + code);
}
