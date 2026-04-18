#!/usr/bin/env node
// Add ↩ back-reference arrows to <li id="fonte-N"> bibliography items
// so the <sup>[N]</sup> anchors become bidirectional (matching Matrix e Materia style).
const fs = require('fs');
const path = require('path');

const files = [
  'chapter-01-mobilita.html',
  'chapter-01-ambiente.html',
  'chapter-01-cibo.html',
  'chapter-02-robotica.html',
  'chapter-02-prodotti.html',
  'chapter-03-psicologia.html',
  'chapter-03-alimentazione.html',
  'chapter-03-cultura.html',
];
const rootDir = path.resolve(__dirname, '..');

// Match: <li id="fonte-N">...</li> where the closing </li> is NOT already preceded by a ↩ link
// Simpler: find </li> of fonte-N that doesn't already have ref-fonte link
const pattern = /<li id="fonte-(\d+)">([\s\S]*?)<\/li>/g;

let totalFixed = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) { continue; }
  let txt = fs.readFileSync(full, 'utf8');
  const before = txt;
  let localFixes = 0;
  txt = txt.replace(pattern, (m, n, inner) => {
    if (inner.includes(`#ref-fonte-${n}`)) return m; // already has back-arrow
    // Append the ↩ arrow before closing
    const trimmed = inner.replace(/\s+$/,'');
    localFixes++;
    return `<li id="fonte-${n}">${trimmed} <a href="#ref-fonte-${n}" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>`;
  });
  if (txt !== before) {
    fs.writeFileSync(full, txt, 'utf8');
    console.log(`${f}: added ${localFixes} back-arrows`);
    totalFixed += localFixes;
  } else {
    console.log(`${f}: no changes`);
  }
}
console.log(`Total: ${totalFixed}`);
