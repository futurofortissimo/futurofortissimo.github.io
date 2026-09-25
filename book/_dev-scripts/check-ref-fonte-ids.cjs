#!/usr/bin/env node
// Verifica le ancore di ritorno della bibliografia in book/*.html.
//
// Due cose, e basta:
//   1. nessun id="ref-fonte-..." duplicato dentro la stessa pagina
//      (un id doppio e' HTML non valido e la freccia di ritorno atterra
//      sempre sulla prima occorrenza, cioe' sul paragrafo sbagliato)
//   2. ogni href="#ref-fonte-..." della bibliografia punta a un id che esiste
//
// Esce 1 se trova qualcosa. Nessun argomento: gira su tutto book/.

const fs = require('fs');
const path = require('path');

const bookDir = path.join(__dirname, '..');
const files = fs.readdirSync(bookDir).filter(f => f.endsWith('.html')).sort();

let dupTot = 0;
let brokenTot = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(bookDir, file), 'utf8');

  const ids = [...html.matchAll(/id="(ref-fonte-[0-9a-z-]+)"/g)].map(m => m[1]);
  const seen = new Map();
  const dups = [];
  for (const id of ids) {
    const n = (seen.get(id) || 0) + 1;
    seen.set(id, n);
    if (n === 2) dups.push(id);
  }

  const targets = [...html.matchAll(/href="#(ref-fonte-[0-9a-z-]+)"/g)].map(m => m[1]);
  const broken = [...new Set(targets)].filter(t => !seen.has(t));

  if (dups.length || broken.length) {
    console.log(`${file}`);
    if (dups.length) console.log(`  id duplicati (${dups.length}): ${dups.join(', ')}`);
    if (broken.length) console.log(`  rimandi rotti (${broken.length}): ${broken.join(', ')}`);
    dupTot += dups.length;
    brokenTot += broken.length;
  }
}

console.log(`\n${files.length} pagine — ${dupTot} id duplicati, ${brokenTot} rimandi rotti`);
process.exit(dupTot + brokenTot === 0 ? 0 : 1);
