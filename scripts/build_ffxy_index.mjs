#!/usr/bin/env node
/**
 * build_ffxy_index.mjs
 * Scans all chapter HTML files, extracts every <span class="fc"> reference,
 * and outputs book/ffxy-index.json.
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

  // Find all <span class="fc"> ... </span> blocks
  // They can span multiple lines, so use a regex with dotAll
  const fcRegex = /<span\s+class="fc">([\s\S]*?)<\/span>/g;
  let match;

  // Build a map of section headings: id -> { sectionId, sectionTitle }
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

    // Parse: optional emoji + ff.NUM or ff.NUM.SUB + optional title
    // Examples: "🛴 ff.1.3 L'80% dei tragitti è sotto i 16 km"
    //           "🏙️ ff.34\n    Ripensare le città"
    const ffMatch = decoded.match(/ff\.(\d+)(?:\.(\d+))?\s*(.*)/s);
    if (!ffMatch) continue;

    const num = parseInt(ffMatch[1], 10);
    const sub = ffMatch[2] ? parseInt(ffMatch[2], 10) : 0;
    const code = sub ? `ff.${num}.${sub}` : `ff.${num}`;
    const titleRaw = ffMatch[3] ? ffMatch[3].replace(/\n\s*/g, ' ').trim() : '';

    // Deduplicate by code within each file
    if (seen.has(code)) continue;
    seen.add(code);

    // Look up emoji from map
    const emojiKey = sub ? `${num}.${sub}` : `${num}`;
    const emoji = emojiMap[emojiKey] || '';

    // Find nearest preceding section heading
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

    entries.push({
      code,
      num,
      sub,
      emoji,
      title: titleRaw,
      chapter: chapterDef.chapter,
      chapterName: chapterDef.chapterName,
      chapterColor: chapterDef.chapterColor,
      file: chapterDef.file,
      sectionId,
      sectionTitle,
    });
  }

  return entries;
}

// Main
const allEntries = [];

for (const ch of CHAPTERS) {
  const html = readFileSync(join(BOOK, ch.file), 'utf8');
  const refs = extractFcRefs(html, ch);
  allEntries.push(...refs);
  console.log(`  ${ch.file}: ${refs.length} refs`);
}

// Sort by ff number ascending, then sub ascending
allEntries.sort((a, b) => a.num - b.num || a.sub - b.sub);

const outPath = join(BOOK, 'ffxy-index.json');
writeFileSync(outPath, JSON.stringify(allEntries, null, 2), 'utf8');

console.log(`\nTotal: ${allEntries.length} ff.x.y references`);
console.log(`Written to: ${outPath}`);
