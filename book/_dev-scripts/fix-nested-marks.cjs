#!/usr/bin/env node
// Strip duplicate adjacent <mark class="note-highlight"> nesting.
// Pattern: <mark class="note-highlight"><mark class="note-highlight">X</mark></mark>
// → <mark class="note-highlight">X</mark>
const fs = require('fs');
const path = require('path');
const files = [
  'chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html',
  'chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html',
  'chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html',
];
const rootDir = path.resolve(__dirname, '..');
const re = /<mark class="note-highlight">\s*<mark class="note-highlight">([\s\S]*?)<\/mark>\s*<\/mark>/g;
let total = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full,'utf8');
  let local = 0;
  txt = txt.replace(re, (_m, inner) => { local++; return `<mark class="note-highlight">${inner}</mark>`; });
  if (local) { fs.writeFileSync(full, txt, 'utf8'); console.log(`${f}: ${local}`); total += local; }
  else console.log(`${f}: 0`);
}
console.log(`Total: ${total}`);
