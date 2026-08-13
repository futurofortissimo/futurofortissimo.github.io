// Build ff.X.Y index from data.js subchapters and search by keyword.
const fs = require('fs');
const src = fs.readFileSync('data.js', 'utf8');
const json = src.slice(src.indexOf('['), src.lastIndexOf(']') + 1);
const data = JSON.parse(json);
const idx = [];
for (const iss of data) {
  for (const sc of iss.subchapters || []) {
    const t = sc.title || '';
    const m = t.match(/ff\.(\d+)\.(\d+)/);
    if (!m) continue;
    idx.push({ code: 'ff.' + m[1] + '.' + m[2], major: +m[1], title: t, content: sc.content || '' });
  }
}
const seen = new Set();
const uniq = idx.filter(e => (seen.has(e.code) ? false : (seen.add(e.code), true)));
console.log('ENTRIES', uniq.length);
if (process.argv[2] === '--dump') {
  fs.writeFileSync('_ffidx0811c.json', JSON.stringify(uniq, null, 1));
  process.exit(0);
}
for (const kw of process.argv.slice(2)) {
  const rx = new RegExp(kw, 'i');
  const hits = uniq.filter(e => rx.test(e.title) || rx.test(e.content));
  console.log('\n=== ' + kw + ' -> ' + hits.length + ' ===');
  for (const h of hits.slice(0, 25)) console.log(h.code + ' | ' + h.title);
}
