/**
 * Editorial Refresh Script — Rules B, C, F
 *
 * Rule B: Remove &#128206; (📎) and wrapping parentheses from note links
 * Rule C: Add source domain after each note link
 * Rule F: Generate bibliography section at bottom of each chapter
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const BOOK_DIR = resolve(import.meta.dirname, '..', 'book');
const CHAPTERS = ['chapter-01.html', 'chapter-02.html', 'chapter-03.html'];

function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function processRulesBC(html) {
  // Pattern: links with &#128206; inside <a> tags
  // Match: (<a href="URL" ...>&#128206; TITLE</a>) with optional period/comma after )
  // Also match without parentheses

  const externalNotes = [];

  // First, handle cases wrapped in parentheses: (&#128206; <a...>TITLE</a>) or (<a...>&#128206; TITLE</a>)
  // The &#128206; is INSIDE the <a> tag based on the actual HTML

  let result = html.replace(
    /\((<a\s+href="([^"]+)"[^>]*>)\s*&#128206;\s*([^<]*?)(<\/a>)\)/g,
    (match, openTag, url, title, closeTag) => {
      const domain = extractDomain(url);
      const trimmedTitle = title.trim();
      externalNotes.push({ url, title: trimmedTitle, domain });
      return `(${openTag}${trimmedTitle}${closeTag}` + (domain ? ` &mdash; ${domain})` : ')');
    }
  );

  // Handle cases NOT wrapped in parentheses (standalone inline links with &#128206;)
  result = result.replace(
    /(<a\s+href="([^"]+)"[^>]*>)\s*&#128206;\s*([^<]*?)(<\/a>)/g,
    (match, openTag, url, title, closeTag) => {
      const domain = extractDomain(url);
      const trimmedTitle = title.trim();
      // Only add if not already processed (check if preceded by '(')
      if (externalNotes.find(n => n.url === url)) return match.replace(/&#128206;\s*/, '');
      externalNotes.push({ url, title: trimmedTitle, domain });
      return `(${openTag}${trimmedTitle}${closeTag}` + (domain ? ` &mdash; ${domain})` : ')');
    }
  );

  return { html: result, externalNotes };
}

function collectFFReferences(html) {
  const ffRefs = [];
  // Match ff.X.Y patterns in <span class="fc"> tags
  const regex = /<span class="fc">[^<]*?(ff\.\d+(?:\.\d+)?)\s*\n?\s*([^<]*?)<\/span>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const ref = m[1];
    const title = m[2].trim();
    if (!ffRefs.find(r => r.ref === ref)) {
      ffRefs.push({ ref, title });
    }
  }
  return ffRefs;
}

function collectSections(html) {
  const sections = [];
  const regex = /<h2\s+id="(s\d+)"[^>]*>([^<]*(?:<[^>]*>[^<]*)*?)<\/h2>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const id = m[1];
    // Clean HTML entities and tags from section title
    const rawTitle = m[2].replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—').replace(/&agrave;/g, 'à').replace(/&egrave;/g, 'è').replace(/&ograve;/g, 'ò').replace(/&ugrave;/g, 'ù').replace(/&igrave;/g, 'ì').trim();
    sections.push({ id, title: rawTitle });
  }
  return sections;
}

function generateBibliography(ffRefs, externalNotes, sections) {
  let bib = `\n    <section id="bibliografia" class="mt-16 mb-10 border-t-4 border-zinc-900 pt-8">\n`;
  bib += `      <h2 class="text-xl sm:text-2xl font-bold mb-6">Bibliografia</h2>\n`;

  // FF references grouped
  if (ffRefs.length > 0) {
    bib += `      <h3 class="text-lg font-semibold mt-6 mb-3">Riferimenti dal corpus Futuro Fortissimo</h3>\n`;
    bib += `      <ul class="list-disc pl-6 space-y-1 text-sm text-zinc-700">\n`;
    for (const ref of ffRefs) {
      bib += `        <li><span class="fc">${ref.ref} ${ref.title}</span></li>\n`;
    }
    bib += `      </ul>\n`;
  }

  // External notes with URL and domain
  if (externalNotes.length > 0) {
    bib += `      <h3 class="text-lg font-semibold mt-8 mb-3">Fonti esterne</h3>\n`;
    bib += `      <ol class="list-decimal pl-6 space-y-2 text-sm text-zinc-700">\n`;
    const seen = new Set();
    for (const note of externalNotes) {
      if (seen.has(note.url)) continue;
      seen.add(note.url);
      bib += `        <li><a href="${note.url}" target="_blank" rel="noopener" class="text-blue-700 hover:underline">${note.title}</a>`;
      if (note.domain) bib += ` &mdash; <span class="text-zinc-500">${note.domain}</span>`;
      bib += `</li>\n`;
    }
    bib += `      </ol>\n`;
  }

  bib += `    </section>\n`;
  return bib;
}

// Process each chapter
for (const chFile of CHAPTERS) {
  const filePath = resolve(BOOK_DIR, chFile);
  let html = readFileSync(filePath, 'utf-8');

  console.log(`\n=== Processing ${chFile} ===`);

  // Count &#128206; before
  const countBefore = (html.match(/&#128206;/g) || []).length;
  console.log(`  📎 before: ${countBefore}`);

  // Collect FF references before modification
  const ffRefs = collectFFReferences(html);
  console.log(`  FF refs: ${ffRefs.length}`);

  // Apply Rules B + C
  const { html: processed, externalNotes } = processRulesBC(html);
  html = processed;
  console.log(`  External notes: ${externalNotes.length}`);

  // Count &#128206; after
  const countAfter = (html.match(/&#128206;/g) || []).length;
  console.log(`  📎 after: ${countAfter}`);

  // Generate bibliography
  const bibliography = generateBibliography(ffRefs, externalNotes, collectSections(html));

  // Insert bibliography before the navigation footer
  const navPattern = /(\s*<nav class="mt-10 mb-8" aria-label="Navigazione capitoli">)/;
  if (navPattern.test(html)) {
    html = html.replace(navPattern, bibliography + '$1');
    console.log(`  ✅ Bibliography inserted`);
  } else {
    console.log(`  ⚠️ Could not find nav insertion point`);
  }

  writeFileSync(filePath, html, 'utf-8');
  console.log(`  ✅ Saved ${chFile}`);
}

console.log('\n✅ Editorial refresh complete (Rules B, C, F)');
