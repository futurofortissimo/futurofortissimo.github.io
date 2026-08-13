// cross-ref candidate search for inject 2026-08-03 (note 1646, Tinker/Bridgewater)
const fs = require('fs');
let src = fs.readFileSync('data.js', 'utf8');
src = src.replace(/^export const rawData =/, 'module.exports =').replace(/;\s*$/, '');
const data = eval('(' + src.replace('module.exports =', '') + ')');

const subs = [];
for (const issue of data) {
  for (const sc of (issue.subchapters || [])) {
    subs.push({ title: sc.title, content: String(sc.content || ''), link: sc.link, issue: issue.title });
  }
}
console.log('total subchapters:', subs.length);

const terms = process.argv.slice(2);
for (const t of terms) {
  const re = new RegExp(t, 'i');
  const hits = subs.filter(s => re.test(s.content) || re.test(s.title));
  console.log('\n######## ' + t + '  (' + hits.length + ')');
  hits.slice(0, 8).forEach(h => {
    const m = h.content.match(new RegExp('[\\s\\S]{0,140}' + t + '[\\s\\S]{0,140}', 'i'));
    console.log('  * ' + h.title);
    if (m) console.log('      ' + m[0].replace(/\s+/g, ' '));
  });
}
