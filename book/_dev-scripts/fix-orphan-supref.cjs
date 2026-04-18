#!/usr/bin/env node
// Some prose contains orphan superscript refs like:
//   <a href="#fonte-N" class="fnote-ref" …>[N]</a>
// without a matching <a id="ref-fonte-N"></a> anchor for the bibliography ↩ back-arrow.
// Wrap each such orphan with <a id="ref-fonte-N"></a> so back-arrows land somewhere.
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

const orphanRe = /<a href="#fonte-(\d+)"\s+class="fnote-ref"[^>]*>\[\d+\]<\/a>/g;

let total = 0;
for (const f of files) {
  const full = path.join(rootDir, f);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full, 'utf8');
  let local = 0;
  // Process matches in reverse so offsets stay valid
  const matches = [...txt.matchAll(orphanRe)].reverse();
  for (const m of matches) {
    const n = m[1];
    const offset = m.index;
    const matchStr = m[0];
    // Skip if preceded by ref-fonte-N anchor in the previous 80 chars
    const before = txt.substring(Math.max(0, offset - 80), offset);
    if (before.includes(`id="ref-fonte-${n}"`)) continue;
    txt = txt.substring(0, offset) + `<a id="ref-fonte-${n}"></a>` + matchStr + txt.substring(offset + matchStr.length);
    local++;
  }
  if (local > 0) {
    fs.writeFileSync(full, txt, 'utf8');
    console.log(`${f}: +${local} orphan refs anchored`);
    total += local;
  } else {
    console.log(`${f}: 0`);
  }
}
console.log(`Total: ${total}`);
