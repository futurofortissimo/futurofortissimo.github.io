/**
 * Rule D — Double the external notes per subchapter
 *
 * Strategy:
 * 1. Parse notes.json for all available notes
 * 2. Identify already-used URLs in each chapter
 * 3. Find unused notes matching subchapter topics by tag
 * 4. Inject at most 2 new notes per paragraph that currently has 0-1
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BOOK = resolve(ROOT, 'book');

const notesData = JSON.parse(readFileSync(resolve(ROOT, 'notes.json'), 'utf-8'));
const allNotes = notesData.notes;

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function noteLink(note) {
  const title = note.title.length > 90 ? note.title.slice(0, 87) + '...' : note.title;
  const domain = extractDomain(note.url);
  return `(<a href="${note.url}" target="_blank" rel="noopener" style="font-family:'IBM Plex Mono',monospace;font-size:0.78rem;font-weight:bold;color:var(--accent);text-decoration:none;">${escHtml(title)}</a>${domain ? ` &mdash; ${domain}` : ''})`;
}

// Tag mapping for subchapter topics
const CH1_SECTIONS = {
  's1': { name: 'Mobilità e Città', tags: ['🚕', '🍃'], keywords: ['mobilità', 'città', 'auto', 'bici', 'trasport', 'urban'] },
  's2': { name: 'Ambiente ed Energia', tags: ['🍃', '💸'], keywords: ['ambiente', 'energia', 'solare', 'plastica', 'clima', 'CO2', 'ricicl'] },
  's3': { name: 'Alimentazione e Microbioma', tags: ['🍽', '❤️'], keywords: ['cibo', 'dieta', 'microbioma', 'nutrizione', 'aliment'] },
  's4': { name: 'Moda Sostenibile', tags: ['🍃', '🎨'], keywords: ['moda', 'tessile', 'sostenibil', 'fast fashion'] }
};

const CH2_SECTIONS = {
  's1': { name: 'Robotica e AI', tags: ['💻', '🧠'], keywords: ['robot', 'AI', 'intelligenza artificiale', 'LLM', 'GPT', 'singolarit'] },
  's2': { name: 'Metaverso e Crypto', tags: ['💻', '💸'], keywords: ['metaverso', 'crypto', 'blockchain', 'NFT', 'VR', 'realtà virtuale', 'bitcoin'] },
  's3': { name: 'Prodotti e Consumi', tags: ['💻', '🎨'], keywords: ['prodott', 'consum', 'Apple', 'design', 'videogioc'] },
  's4': { name: 'Geopolitica Tech', tags: ['👥', '💻'], keywords: ['chip', 'geopolitic', 'Cina', 'Taiwan', 'semiconduttor'] }
};

const CH3_SECTIONS = {
  's1': { name: 'Psicologia e Attenzione', tags: ['👥', '💆'], keywords: ['psicolog', 'attenzion', 'flow', 'noia', 'stress', 'ansia', 'meditazion'] },
  's2': { name: 'Alimentazione e Sport', tags: ['👥', '⚽'], keywords: ['sport', 'corsa', 'maratona', 'VO2', 'salute', 'esercizio', 'movimento'] },
  's3': { name: 'Longevità e Farmaci', tags: ['❤️', '💊'], keywords: ['longevità', 'invecchiament', 'farmac', 'cellul', 'cancro', 'DNA'] },
  's4': { name: 'Cultura e Geopolitica', tags: ['👥', '🎨'], keywords: ['cultura', 'geopolitic', 'guerra', 'media', 'educazione', 'università'] }
};

function getUsedUrls(html) {
  const urls = new Set();
  const re = /href="([^"]+)"[^>]*style="font-family:'IBM Plex Mono'/g;
  let m;
  while ((m = re.exec(html)) !== null) urls.add(m[1]);
  return urls;
}

function findMatchingNotes(section, usedUrls, maxCount = 4) {
  return allNotes
    .filter(n => {
      if (usedUrls.has(n.url)) return false;
      // Match by tag
      const hasTag = n.tags.some(t => section.tags.includes(t));
      // Match by keyword in title/description
      const text = (n.title + ' ' + (n.description || '')).toLowerCase();
      const hasKeyword = section.keywords.some(k => text.includes(k.toLowerCase()));
      return hasTag && hasKeyword;
    })
    .slice(0, maxCount);
}

function findSectionBoundaries(html) {
  const boundaries = [];
  const re = /<h2\s+id="(s\d+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    boundaries.push({ id: m[1], pos: m.index });
  }
  return boundaries;
}

function countExternalNotesInRange(html, start, end) {
  const slice = html.substring(start, end);
  return (slice.match(/style="font-family:'IBM Plex Mono'/g) || []).length;
}

function findInjectionPoints(html, start, end) {
  // Find paragraphs with 0-1 external notes in this section range
  const slice = html.substring(start, end);
  const points = [];
  const re = /<\/p>/g;
  let m;
  while ((m = re.exec(slice)) !== null) {
    const pEnd = start + m.index;
    // Look back to find the <p that starts this paragraph
    const before = html.substring(Math.max(start, pEnd - 3000), pEnd);
    const pStart = before.lastIndexOf('<p');
    if (pStart === -1) continue;
    const paraHtml = before.substring(pStart) + '</p>';
    const noteCount = (paraHtml.match(/style="font-family:'IBM Plex Mono'/g) || []).length;
    if (noteCount < 2) {
      points.push({ pos: pEnd, noteCount, paraLength: paraHtml.length });
    }
  }
  // Sort by longest paragraphs first (more content = better injection point)
  return points.sort((a, b) => b.paraLength - a.paraLength);
}

function processChapter(filename, sectionDefs) {
  const filePath = resolve(BOOK, filename);
  let html = readFileSync(filePath, 'utf-8');
  const usedUrls = getUsedUrls(html);
  const boundaries = findSectionBoundaries(html);

  console.log(`\n=== ${filename} ===`);
  console.log(`  Used external notes: ${usedUrls.size}`);

  let totalInjected = 0;
  const injections = []; // {pos, text} sorted by pos descending for safe insertion

  for (let i = 0; i < boundaries.length; i++) {
    const sec = boundaries[i];
    const secEnd = boundaries[i + 1]?.pos || html.length;
    const secDef = sectionDefs[sec.id];
    if (!secDef) continue;

    const currentCount = countExternalNotesInRange(html, sec.pos, secEnd);
    const matching = findMatchingNotes(secDef, usedUrls, Math.max(2, 4 - currentCount));

    if (matching.length === 0) {
      console.log(`  ${sec.id} (${secDef.name}): ${currentCount} notes, 0 new matches`);
      continue;
    }

    console.log(`  ${sec.id} (${secDef.name}): ${currentCount} notes, ${matching.length} new matches`);

    const points = findInjectionPoints(html, sec.pos, secEnd);
    const toInject = Math.min(matching.length, points.length);

    for (let j = 0; j < toInject; j++) {
      const note = matching[j];
      const point = points[j];
      usedUrls.add(note.url);
      const link = noteLink(note);
      injections.push({ pos: point.pos, text: ` ${link}` });
      console.log(`    + [${note.id}] ${note.title.substring(0, 60)}...`);
    }

    totalInjected += toInject;
  }

  // Apply injections in reverse position order to avoid offset shifts
  injections.sort((a, b) => b.pos - a.pos);
  for (const inj of injections) {
    html = html.substring(0, inj.pos) + inj.text + html.substring(inj.pos);
  }

  writeFileSync(filePath, html, 'utf-8');
  console.log(`  Total injected: ${totalInjected}`);
  console.log(`  Total external notes now: ${usedUrls.size}`);
}

processChapter('chapter-01.html', CH1_SECTIONS);
processChapter('chapter-02.html', CH2_SECTIONS);
processChapter('chapter-03.html', CH3_SECTIONS);

console.log('\n✅ Rule D enrichment complete');
