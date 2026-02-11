#!/usr/bin/env node
/**
 * integrate_notes.mjs v3
 *
 * Properly integrates dumped note blocks and newsletter paragraphs
 * into the chapter prose. Uses the first template paragraph as the
 * boundary marker to distinguish original prose from dumped content.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TEMPLATE_PREFIXES = [
  'Un dato recente lo conferma:',
  'La ricerca documenta un fenomeno parallelo:',
  'I numeri parlano:',
  "Un\u2019ulteriore evidenza emerge dalla scienza:",
  "Un'ulteriore evidenza emerge dalla scienza:",
  'Il panorama si arricchisce:',
  'Come documenta uno studio recente:',
];

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function isTemplateP(pHtml) {
  const text = stripTags(pHtml);
  return TEMPLATE_PREFIXES.some(t => text.startsWith(t));
}

function extractNoteFromP(pHtml) {
  const m = pHtml.match(/<a\s+class="note-highlight"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  if (m) return { url: m[1], title: m[2].replace(/\s+/g, ' ').trim() };
  return null;
}

function findAllParagraphs(html) {
  const results = [];
  const re = /<p[\s>][\s\S]*?<\/p>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    results.push({ start: m.index, end: m.index + m[0].length, html: m[0] });
  }
  return results;
}

function processChapter(htmlPath) {
  let html = readFileSync(htmlPath, 'utf8');

  // Find section boundaries
  const sectionRe = /(<h2\s+id="s\d"[\s\S]*?)(?=<div class="sep">|<\/article>)/g;
  const sections = [];
  let m;
  while ((m = sectionRe.exec(html)) !== null) {
    sections.push({ start: m.index, end: m.index + m[0].length, content: m[0] });
  }

  console.log(`  Found ${sections.length} sections`);

  // Process sections in reverse
  for (let si = sections.length - 1; si >= 0; si--) {
    const sec = sections[si];
    let content = sec.content;

    // Find ALL paragraphs
    const allPs = findAllParagraphs(content);

    // Find the FIRST template paragraph — this marks the boundary
    let boundaryP = null;
    for (const p of allPs) {
      if (isTemplateP(p.html)) {
        boundaryP = p;
        break;
      }
    }

    if (!boundaryP) {
      console.log(`    Section ${si + 1}: No template blocks, skipping`);
      continue;
    }

    // Split: everything before boundary = original prose, after = dumped
    const originalProse = content.substring(0, boundaryP.start);
    const dumpedContent = content.substring(boundaryP.start);

    // Parse dumped content
    const dumpedPs = findAllParagraphs(dumpedContent);

    const notes = [];
    const newsletterHtmls = [];

    for (const dp of dumpedPs) {
      if (isTemplateP(dp.html)) {
        const note = extractNoteFromP(dp.html);
        if (note) notes.push(note);
      } else {
        // This is a newsletter paragraph (added by enrichment script)
        newsletterHtmls.push(dp.html);
      }
    }

    console.log(`    Section ${si + 1}: ${notes.length} notes, ${newsletterHtmls.length} newsletters`);

    // Rebuild: original prose + woven notes + newsletter paragraphs
    let newContent = originalProse.trimEnd();

    // Find regular (non-drop-cap, non-blockquote) paragraphs in original prose
    const prosePs = findAllParagraphs(originalProse);
    const eligiblePs = prosePs.filter(p =>
      !p.html.includes('class="drop-cap"') &&
      !p.html.startsWith('<p class="text-zinc')  // Skip metadata paragraphs
    );

    // Weave notes into original prose paragraphs
    // Group notes by target paragraph, then process paragraphs in reverse
    if (notes.length > 0 && eligiblePs.length > 0) {
      const nNotes = notes.length;
      const startIdx = Math.max(0, eligiblePs.length - nNotes);

      // Group notes by target paragraph index
      const notesByPIdx = new Map();
      for (let ni = 0; ni < nNotes; ni++) {
        const pIdx = Math.min(startIdx + ni, eligiblePs.length - 1);
        if (!notesByPIdx.has(pIdx)) notesByPIdx.set(pIdx, []);
        notesByPIdx.get(pIdx).push(notes[ni]);
      }

      // Process paragraphs in reverse order (to preserve string positions)
      const sortedPIdxs = [...notesByPIdx.keys()].sort((a, b) => b - a);

      for (const pIdx of sortedPIdxs) {
        const p = eligiblePs[pIdx];
        const pNotes = notesByPIdx.get(pIdx);

        // Build all note refs for this paragraph
        const noteRefs = pNotes.map(note =>
          `\n    (<a class="note-highlight" href="${note.url}" target="_blank" rel="noopener">${note.title}</a>)`
        ).join('');

        // Find the closing </p>
        const closeIdx = p.html.lastIndexOf('</p>');
        if (closeIdx === -1) continue;

        const before = p.html.substring(0, closeIdx).trimEnd();
        let newPHtml;

        if (before.endsWith('.')) {
          newPHtml = before.slice(0, -1) + noteRefs + '.' + p.html.substring(closeIdx);
        } else if (before.endsWith(').') || before.endsWith(')')) {
          newPHtml = before + noteRefs + p.html.substring(closeIdx);
        } else {
          newPHtml = before + noteRefs + p.html.substring(closeIdx);
        }

        // Replace in newContent
        newContent = newContent.substring(0, p.start) + newPHtml + newContent.substring(p.end);
      }
    }

    // Insert newsletter paragraphs before the last paragraph of prose
    if (newsletterHtmls.length > 0) {
      const updatedPs = findAllParagraphs(newContent);
      const updatedEligible = updatedPs.filter(p => !p.html.includes('class="drop-cap"'));

      if (updatedEligible.length >= 2) {
        const lastP = updatedEligible[updatedEligible.length - 1];
        const nlBlock = '\n\n    ' + newsletterHtmls.join('\n\n    ') + '\n\n    ';
        newContent = newContent.substring(0, lastP.start) + nlBlock + newContent.substring(lastP.start);
      } else if (updatedEligible.length >= 1) {
        // Just append after last paragraph
        newContent = newContent.trimEnd() + '\n\n    ' + newsletterHtmls.join('\n\n    ');
      }
    }

    // Ensure trailing newline
    newContent = newContent.trimEnd() + '\n\n    ';

    // Replace section in full HTML
    html = html.substring(0, sec.start) + newContent + html.substring(sec.end);
  }

  // Clean up multiple blank lines
  html = html.replace(/\n{4,}/g, '\n\n');

  // Update reference count
  const fcCount = (html.match(/class="fc"/g) || []).length;
  html = html.replace(/(\d+)\+\s*riferimenti dal corpus/, `${fcCount}+ riferimenti dal corpus`);

  return html;
}

const chapters = ['chapter-01.html', 'chapter-02.html', 'chapter-03.html'];

for (const ch of chapters) {
  const path = join(ROOT, 'book', ch);
  console.log(`Processing ${ch}...`);
  const result = processChapter(path);
  writeFileSync(path, result, 'utf8');
  console.log(`  Written.`);
}

console.log('\nDone!');
