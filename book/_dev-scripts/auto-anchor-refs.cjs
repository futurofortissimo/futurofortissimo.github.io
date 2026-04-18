#!/usr/bin/env node
// Auto-map prose links → bibliografia entries.
// For each <li id="fonte-N"> in the bibliography, find its href URL,
// then in <article class="prose"> wrap every matching <a href="URL">…</a>
// with <a id="ref-fonte-N"></a> + <sup><a href="#fonte-N">[N]</a></sup>.
// Skips links already wrapped (idempotent).
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

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function processFile(filename) {
  const full = path.join(rootDir, filename);
  if (!fs.existsSync(full)) { return { added: 0, skipped: 'missing' }; }
  let txt = fs.readFileSync(full, 'utf8');

  // Locate the bibliografia section
  const biblioMatch = txt.match(/<section id="bibliografia"[\s\S]*?<\/section>/);
  if (!biblioMatch) return { added: 0, skipped: 'no biblio' };
  const biblio = biblioMatch[0];

  // Extract all fonte entries: { n, url }
  const liRe = /<li id="fonte-(\d+)">\s*<a href="([^"]+)"/g;
  const fontes = [];
  let m;
  while ((m = liRe.exec(biblio)) !== null) {
    fontes.push({ n: parseInt(m[1], 10), url: m[2] });
  }
  if (!fontes.length) return { added: 0, skipped: 'no fontes' };

  // Locate <article class="prose">…</article>
  const artRe = /<article class="prose">([\s\S]*?)<\/article>/;
  const artMatch = txt.match(artRe);
  if (!artMatch) return { added: 0, skipped: 'no article' };
  let article = artMatch[1];

  let totalAdded = 0;

  for (const f of fontes) {
    const escUrl = escRe(f.url);
    // Match <a href="URL" …>TEXT</a> with non-greedy text (may contain <em>, <mark>)
    const linkRe = new RegExp(`<a href="${escUrl}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
    const matches = [...article.matchAll(linkRe)].reverse();
    for (const match of matches) {
      const offset = match.index;
      const matchStr = match[0];
      // Skip if preceded by ref-fonte-N anchor
      const before = article.substring(Math.max(0, offset - 80), offset);
      if (before.includes(`id="ref-fonte-${f.n}"`)) continue;
      // Skip if followed by sup ref to same fonte
      const after = article.substring(offset + matchStr.length, offset + matchStr.length + 100);
      if (after.match(new RegExp(`^\\s*<sup>\\s*<a href="#fonte-${f.n}"`))) continue;
      // Skip if this is itself the bibliografia link (shouldn't happen since article != biblio)
      // Wrap
      const replacement = `<a id="ref-fonte-${f.n}"></a>${matchStr}<sup><a href="#fonte-${f.n}" style="color:var(--accent);text-decoration:none;">[${f.n}]</a></sup>`;
      article = article.substring(0, offset) + replacement + article.substring(offset + matchStr.length);
      totalAdded++;
    }
  }

  if (totalAdded === 0) return { added: 0, skipped: 'no matches' };

  const newTxt = txt.replace(artMatch[0], `<article class="prose">${article}</article>`);
  fs.writeFileSync(full, newTxt, 'utf8');
  return { added: totalAdded };
}

let grand = 0;
for (const f of files) {
  const r = processFile(f);
  if (r.skipped && r.added === 0) console.log(`${f}: ${r.skipped}`);
  else { console.log(`${f}: +${r.added} anchors`); grand += r.added; }
}
console.log(`Total anchors added: ${grand}`);
