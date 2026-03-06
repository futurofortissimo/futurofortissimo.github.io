/**
 * fix_bibliography.mjs — Remove duplicate bibliography sections,
 * then regenerate a single one with all external notes (including Rule D additions).
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOK = resolve(__dirname, '..', 'book');
const CHAPTERS = ['chapter-01.html', 'chapter-02.html', 'chapter-03.html'];

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

for (const chFile of CHAPTERS) {
  const filePath = resolve(BOOK, chFile);
  let html = readFileSync(filePath, 'utf-8');

  // Remove ALL existing bibliography sections
  html = html.replace(/\s*<section id="bibliografia"[\s\S]*?<\/section>\s*/g, '\n');

  // Collect FF references
  const ffRefs = [];
  const ffRe = /<span class="fc">[^<]*?(ff\.\d+(?:\.\d+)?)\s*\n?\s*([^<]*?)<\/span>/g;
  let m;
  while ((m = ffRe.exec(html)) !== null) {
    const ref = m[1], title = m[2].trim();
    if (!ffRefs.find(r => r.ref === ref)) ffRefs.push({ ref, title });
  }

  // Collect ALL external notes (style="font-family:'IBM Plex Mono'")
  const extNotes = [];
  const extRe = /<a\s+href="([^"]+)"[^>]*style="font-family:'IBM Plex Mono'[^>]*>([^<]*?)<\/a>/g;
  while ((m = extRe.exec(html)) !== null) {
    const url = m[1], title = m[2].trim();
    if (!extNotes.find(n => n.url === url)) {
      extNotes.push({ url, title, domain: extractDomain(url) });
    }
  }

  // Build bibliography HTML
  let bib = `\n    <section id="bibliografia" class="mt-16 mb-10 border-t-4 border-zinc-900 pt-8">\n`;
  bib += `      <h2 class="text-xl sm:text-2xl font-bold mb-6">Bibliografia</h2>\n`;

  if (ffRefs.length > 0) {
    bib += `      <h3 class="text-lg font-semibold mt-6 mb-3">Riferimenti dal corpus Futuro Fortissimo</h3>\n`;
    bib += `      <ul class="list-disc pl-6 space-y-1 text-sm text-zinc-700">\n`;
    for (const ref of ffRefs) {
      bib += `        <li><span class="fc">${ref.ref} ${ref.title}</span></li>\n`;
    }
    bib += `      </ul>\n`;
  }

  if (extNotes.length > 0) {
    bib += `      <h3 class="text-lg font-semibold mt-8 mb-3">Fonti esterne</h3>\n`;
    bib += `      <ol class="list-decimal pl-6 space-y-2 text-sm text-zinc-700">\n`;
    for (const note of extNotes) {
      bib += `        <li><a href="${note.url}" target="_blank" rel="noopener" class="text-blue-700 hover:underline">${escHtml(note.title)}</a>`;
      if (note.domain) bib += ` &mdash; <span class="text-zinc-500">${note.domain}</span>`;
      bib += `</li>\n`;
    }
    bib += `      </ol>\n`;
  }

  bib += `    </section>\n`;

  // Insert before the nav footer
  const navPattern = /(\s*<nav class="mt-10 mb-8" aria-label="Navigazione capitoli">)/;
  html = html.replace(navPattern, bib + '$1');

  writeFileSync(filePath, html, 'utf-8');

  console.log(`${chFile}: ${ffRefs.length} FF refs, ${extNotes.length} ext notes → bibliography rebuilt`);
}

console.log('✅ Bibliography sections fixed');
