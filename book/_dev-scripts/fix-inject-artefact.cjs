#!/usr/bin/env node
// Fix "il punto era lo stesso: X" artefact left by buggy inject pipeline.
// Pattern: "In <span class="fc">EMOJI ff.X.Y\n TITLE</span> il punto era lo stesso: FRAGMENT."
// Replacement: "(cfr. <span class="fc">EMOJI ff.X.Y TITLE</span>)."
const fs = require('fs');
const path = require('path');

const files = [
  'chapter-01-mobilita.html',
  'chapter-01-ambiente.html',
];

const rootDir = path.resolve(__dirname, '..');

// Match: optional leading whitespace, "In " (capital I), a <span class="fc">...</span>,
// whitespace, "il punto era lo stesso:", then everything up to the first period (non-greedy).
// Multi-line flag needed because the fc span can span lines.
const pattern = /(\s*)In\s+(<span class="fc">[^<]*<\/span>)\s+il punto era lo stesso:[^.]*\./g;

let totalFixed = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  let txt = fs.readFileSync(full, 'utf8');
  const before = txt;
  txt = txt.replace(pattern, (_m, lead, span) => {
    // Normalise the span: collapse internal newlines/whitespace to single space
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
