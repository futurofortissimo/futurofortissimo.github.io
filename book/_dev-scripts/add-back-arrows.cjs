#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const files = [
  'chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html',
  'chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html',
  'chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html',
];
const rootDir = path.resolve(__dirname, '..');
const pattern = /<li id="fonte-(\d+)">([\s\S]*?)<\/li>/g;
let totalFixed = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full, 'utf8');
  const before = txt;
  let localFixes = 0;
  txt = txt.replace(pattern, (m, n, inner) => {
    if (inner.includes(`#ref-fonte-${n}`)) return m;
    const trimmed = inner.replace(/\s+$/, '');
    localFixes++;
    return `<li id="fonte-${n}">${trimmed} <a href="#ref-fonte-${n}" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>`;
  });
  if (txt !== before) {
    fs.writeFileSync(full, txt, 'utf8');
    console.log(`${f}: +${localFixes}`);
    totalFixed += localFixes;
  } else console.log(`${f}: 0`);
}
console.log(`Total: ${totalFixed}`);
