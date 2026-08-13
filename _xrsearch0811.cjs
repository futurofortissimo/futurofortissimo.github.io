// Search data.js subchapters by keyword, print exact "emoji ff.X.Y\nTitolo" payloads.
const fs = require('fs');
const src = fs.readFileSync('data.js', 'utf8');

// collect every ff.X.Y entry with its emoji + title as they appear in data.js
const entries = [];
const re = /"(?:code|id)"\s*:\s*"(ff\.\d+\.\d+)"/g;
// fallback: generic scan for objects containing ff.X.Y
const objRe = /\{[^{}]*ff\.\d+\.\d+[^{}]*\}/g;
let m;
while ((m = objRe.exec(src))) {
  const blob = m[0];
  const code = (blob.match(/ff\.\d+\.\d+/) || [])[0];
  const title = (blob.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || '';
  const emoji = (blob.match(/"emoji"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || '';
  const body = (blob.match(/"(?:content|text|body|description)"\s*:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || '';
  if (code) entries.push({ code, title, emoji, body });
}
const seen = new Set();
const uniq = entries.filter(e => (seen.has(e.code) ? false : (seen.add(e.code), true)));
console.log('ENTRIES', uniq.length);

const kws = process.argv.slice(2);
for (const kw of kws) {
  const rx = new RegExp(kw, 'i');
  const hits = uniq.filter(e => rx.test(e.title) || rx.test(e.body));
  console.log('\n=== ' + kw + ' -> ' + hits.length + ' ===');
  for (const h of hits.slice(0, 12)) {
    console.log(h.code + ' | ' + h.emoji + ' | ' + h.title.slice(0, 100));
  }
}
