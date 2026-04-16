#!/usr/bin/env node
/**
 * build_ffxy_index.mjs
 *
 * 1. Scans all chapter HTML files → book/ffxy-index.json  (injected refs only)
 * 2. Reads data.js corpus + used_codes_book.txt + ffxy-index.json
 *    → book/ffxy-historical.json  (ALL ff.x.y from corpus, with injection status)
 *
 * Run after every injection cycle:
 *   node scripts/build_ffxy_index.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BOOK = join(ROOT, 'book');

// Chapter definitions
const CHAPTERS = [
  { file: 'chapter-01-mobilita.html',      chapter: 1, chapterName: 'Natura',     chapterColor: '#2ecc71' },
  { file: 'chapter-01-ambiente.html',       chapter: 1, chapterName: 'Natura',     chapterColor: '#2ecc71' },
  { file: 'chapter-01-cibo.html',           chapter: 1, chapterName: 'Natura',     chapterColor: '#2ecc71' },
  { file: 'chapter-02-robotica.html',       chapter: 2, chapterName: 'Tecnologia', chapterColor: '#4a90e2' },
  { file: 'chapter-02-metaverso.html',      chapter: 2, chapterName: 'Tecnologia', chapterColor: '#4a90e2' },
  { file: 'chapter-02-prodotti.html',       chapter: 2, chapterName: 'Tecnologia', chapterColor: '#4a90e2' },
  { file: 'chapter-03-psicologia.html',     chapter: 3, chapterName: 'Società',    chapterColor: '#d0021b' },
  { file: 'chapter-03-alimentazione.html',  chapter: 3, chapterName: 'Società',    chapterColor: '#d0021b' },
  { file: 'chapter-03-cultura.html',        chapter: 3, chapterName: 'Società',    chapterColor: '#d0021b' },
];

// Load emoji map
const emojiMap = JSON.parse(readFileSync(join(BOOK, 'emoji-map.json'), 'utf8'));

// Decode HTML entities in a string
function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&agrave;/g, '\u00E0')
    .replace(/&egrave;/g, '\u00E8')
    .replace(/&igrave;/g, '\u00EC')
    .replace(/&ograve;/g, '\u00F2')
    .replace(/&ugrave;/g, '\u00F9')
    .replace(/&eacute;/g, '\u00E9')
    .replace(/&nbsp;/g, ' ')
    .replace(/&deg;/g, '\u00B0')
    .replace(/&sect;/g, '\u00A7')
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

function extractFcRefs(html, chapterDef) {
  const entries = [];
  const seen = new Set();

  const fcRegex = /<span\s+class="fc">([\s\S]*?)<\/span>/g;
  let match;

  const headingRegex = /<h[23]\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g;
  const headings = [];
  let hm;
  while ((hm = headingRegex.exec(html)) !== null) {
    const id = hm[1];
    const title = decodeEntities(hm[2].replace(/<[^>]+>/g, '').trim());
    headings.push({ id, title, pos: hm.index });
  }

  while ((match = fcRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    const decoded = decodeEntities(raw.replace(/<[^>]+>/g, '').trim());

    const ffMatch = decoded.match(/ff\.(\d+)(?:\.(\d+))?\s*(.*)/s);
    if (!ffMatch) continue;

    const num = parseInt(ffMatch[1], 10);
    const sub = ffMatch[2] ? parseInt(ffMatch[2], 10) : 0;
    const code = sub ? `ff.${num}.${sub}` : `ff.${num}`;
    const titleRaw = ffMatch[3] ? ffMatch[3].replace(/\n\s*/g, ' ').trim() : '';

    if (seen.has(code)) continue;
    seen.add(code);

    const emojiKey = sub ? `${num}.${sub}` : `${num}`;
    const emoji = emojiMap[emojiKey] || '';

    let sectionId = '';
    let sectionTitle = '';
    const pos = match.index;
    for (let i = headings.length - 1; i >= 0; i--) {
      if (headings[i].pos < pos) {
        sectionId = headings[i].id;
        sectionTitle = headings[i].title;
        break;
      }
    }

    // Generate precise anchor ID matching chapter-ui.js runtime IDs
    const anchorId = sub ? `ffxy-${num}-${sub}` : `ffxy-${num}`;

    entries.push({
      code, num, sub, emoji,
      title: titleRaw,
      chapter: chapterDef.chapter,
      chapterName: chapterDef.chapterName,
      chapterColor: chapterDef.chapterColor,
      file: chapterDef.file,
      anchorId,
      sectionId,
      sectionTitle,
    });
  }

  return entries;
}

// ── PART 1: Build ffxy-index.json (injected refs from chapter HTML) ──

console.log('=== Part 1: ffxy-index.json (injected refs from HTML) ===');
const allEntries = [];

for (const ch of CHAPTERS) {
  const html = readFileSync(join(BOOK, ch.file), 'utf8');
  const refs = extractFcRefs(html, ch);
  allEntries.push(...refs);
  console.log(`  ${ch.file}: ${refs.length} refs`);
}

allEntries.sort((a, b) => a.num - b.num || a.sub - b.sub);

const indexPath = join(BOOK, 'ffxy-index.json');
writeFileSync(indexPath, JSON.stringify(allEntries, null, 2), 'utf8');
console.log(`\nTotal injected refs: ${allEntries.length}`);
console.log(`Written to: ${indexPath}`);

// ── PART 2: Build ffxy-historical.json (ALL ff.x.y from data.js corpus) ──

console.log('\n=== Part 2: ffxy-historical.json (full corpus) ===');

// 2a. Parse data.js
const dataJsContent = readFileSync(join(ROOT, 'data.js'), 'utf8');
// Strip the "export const rawData = " prefix and trailing ";"
const jsonStart = dataJsContent.indexOf('[');
const jsonEnd = dataJsContent.lastIndexOf(']') + 1;
const rawJson = dataJsContent.slice(jsonStart, jsonEnd);

// data.js may contain JS template strings or special chars; use Function eval
let rawData;
try {
  rawData = (new Function(`return ${rawJson}`))();
} catch (e) {
  console.error('Failed to parse data.js:', e.message);
  process.exit(1);
}

console.log(`  data.js: ${rawData.length} newsletter entries`);

// 2b. Read used_codes_book.txt
const usedCodesRaw = readFileSync(join(ROOT, 'used_codes_book.txt'), 'utf8');
const usedCodes = new Set(
  usedCodesRaw.split('\n').map(l => l.trim()).filter(Boolean)
);
console.log(`  used_codes_book.txt: ${usedCodes.size} injected codes`);

// 2c. Build lookup from ffxy-index.json for injection details
const indexData = JSON.parse(readFileSync(indexPath, 'utf8'));
const indexLookup = {};
for (const entry of indexData) {
  // For duplicate codes (same code in multiple files), keep the first
  if (!indexLookup[entry.code]) {
    indexLookup[entry.code] = entry;
  }
}

// 2d. Extract all ff.x.y from data.js
const historical = [];

for (const newsletter of rawData) {
  // Parse newsletter number from title: "🎼 ff.148 Il \"Mito\" dell'AI"
  const nlMatch = newsletter.title.match(/ff\.(\d+)/);
  if (!nlMatch) continue;
  const nlNum = parseInt(nlMatch[1], 10);

  if (!newsletter.subchapters || !newsletter.subchapters.length) continue;

  for (const sub of newsletter.subchapters) {
    // Parse subchapter title: "🐉 ff.148.1 Claude Mythos: non per tutti"
    const subMatch = sub.title.match(/^(.+?)\s*ff\.(\d+)\.(\d+)\s+(.*)/s);
    if (!subMatch) continue;

    const emoji = subMatch[1].trim();
    const num = parseInt(subMatch[2], 10);
    const subNum = parseInt(subMatch[3], 10);
    const title = subMatch[4].trim();
    const code = `ff.${num}.${subNum}`;

    const isInjected = usedCodes.has(code);
    const idx = indexLookup[code];

    const anchorId = `ffxy-${num}-${subNum}`;

    historical.push({
      code,
      num,
      sub: subNum,
      emoji,
      title,
      injected: isInjected,
      file: idx ? idx.file : null,
      anchorId: isInjected ? anchorId : null,
      sectionId: idx ? idx.sectionId : null,
      chapter: idx ? idx.chapter : null,
      chapterName: idx ? idx.chapterName : null,
      chapterColor: idx ? idx.chapterColor : null,
    });
  }
}

// Sort by num, sub ascending
historical.sort((a, b) => a.num - b.num || a.sub - b.sub);

const histPath = join(BOOK, 'ffxy-historical.json');
writeFileSync(histPath, JSON.stringify(historical, null, 2), 'utf8');

const injectedCount = historical.filter(h => h.injected).length;
console.log(`\nTotal ff.x.y in corpus: ${historical.length}`);
console.log(`Injected: ${injectedCount} / ${historical.length}`);
console.log(`Written to: ${histPath}`);

console.log(`
────────────────────────────────────────────
Run this script after every injection cycle:
  node scripts/build_ffxy_index.mjs

It updates both:
  • book/ffxy-index.json      (injected refs from chapter HTML)
  • book/ffxy-historical.json (full corpus, read at runtime by index.html)
────────────────────────────────────────────`);
