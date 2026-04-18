#!/usr/bin/env node
// Remove "il punto era lo stesso: X" inject artefacts and restore clean (cfr. …) closure.
// Idempotent: safe to re-run.
const fs = require('fs');
const path = require('path');
const files = ['chapter-01-mobilita.html','chapter-01-ambiente.html'];
const rootDir = path.resolve(__dirname, '..');
const pattern = /(\s*)In\s+(<span class="fc">[^<]*<\/span>)\s+il punto era lo stesso:[^.]*\./g;
let totalFixed = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full, 'utf8');
  const before = txt;
  txt = txt.replace(pattern, (_m, lead, span) => {
    const cleanedSpan = span.replace(/\s+/g, ' ').replace('<span class="fc"> ', '<span class="fc">').replace(' </span>', '</span>');
    return `${lead}(cfr. ${cleanedSpan}).`;
  });
  if (txt !== before) {
    const count = (before.match(pattern) || []).length;
    fs.writeFileSync(full, txt, 'utf8');
    console.log(`${f}: fixed ${count} artefacts`);
    totalFixed += count;
  } else {
    console.log(`${f}: no matches`);
  }
}
console.log(`Total: ${totalFixed}`);
