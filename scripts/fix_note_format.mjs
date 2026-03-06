/**
 * fix_note_format.mjs — Reformat external notes in ch01-03
 *
 * NEW FORMAT:
 *   [claim integrated in prose] <a href="URL" style="...">Short 5-10 word title</a> (domain.com).
 *
 * - Link text shortened to 5-10 words
 * - No parentheses around the <a> tag (clickable inline)
 * - Domain in parentheses AFTER the link
 * - Remove old " — domain.com" suffix and wrapping parens
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

function shortenTitle(title, maxWords = 8) {
  // Remove existing " — domain" suffix from title text
  const cleaned = title.replace(/\s*[—–-]\s*[a-z0-9.-]+\.[a-z]{2,}$/i, '').trim();
  const words = cleaned.split(/\s+/);
  if (words.length <= maxWords) return cleaned;
  return words.slice(0, maxWords).join(' ');
}

for (const chFile of CHAPTERS) {
  const filePath = resolve(BOOK, chFile);
  let html = readFileSync(filePath, 'utf-8');

  let count = 0;

  // Pattern 1: (link — domain) or (link &mdash; domain)
  // Match: (<a href="URL" ...>TITLE</a> — domain) or (<a ...>TITLE</a> &mdash; domain)
  html = html.replace(
    /\((<a\s+href="([^"]+)"[^>]*>)([^<]+?)(<\/a>)\s*(?:&mdash;|—)\s*[a-z0-9.-]+\.[a-z]{2,}\)/gi,
    (match, openTag, url, title, closeTag) => {
      const domain = extractDomain(url);
      const shortTitle = shortenTitle(title);
      count++;
      return `${openTag}${shortTitle}${closeTag}` + (domain ? ` (${domain})` : '');
    }
  );

  // Pattern 2: standalone links with — domain but no parentheses wrapping
  html = html.replace(
    /(<a\s+href="([^"]+)"[^>]*>)([^<]+?)(<\/a>)\s*(?:&mdash;|—)\s*[a-z0-9.-]+\.[a-z]{2,}/gi,
    (match, openTag, url, title, closeTag) => {
      // Skip if this was inside a bibliography section
      const domain = extractDomain(url);
      const shortTitle = shortenTitle(title);
      count++;
      return `${openTag}${shortTitle}${closeTag}` + (domain ? ` (${domain})` : '');
    }
  );

  // Pattern 3: links that still have long titles (no domain suffix) wrapped in parens
  html = html.replace(
    /\((<a\s+href="([^"]+)"[^>]*style="font-family:'IBM Plex Mono'[^>]*>)([^<]{40,}?)(<\/a>)\)/g,
    (match, openTag, url, title, closeTag) => {
      const domain = extractDomain(url);
      const shortTitle = shortenTitle(title);
      count++;
      return `${openTag}${shortTitle}${closeTag}` + (domain ? ` (${domain})` : '');
    }
  );

  // Pattern 4: remaining links with IBM Plex Mono that have long titles (>40 chars), not in parens
  html = html.replace(
    /(<a\s+href="([^"]+)"[^>]*style="font-family:'IBM Plex Mono'[^>]*>)([^<]{40,}?)(<\/a>)/g,
    (match, openTag, url, title, closeTag) => {
      // Skip bibliography links (they have class="text-blue-700")
      if (openTag.includes('text-blue-700')) return match;
      const domain = extractDomain(url);
      const shortTitle = shortenTitle(title);
      count++;
      return `${openTag}${shortTitle}${closeTag}` + (domain ? ` (${domain})` : '');
    }
  );

  writeFileSync(filePath, html, 'utf-8');
  console.log(`${chFile}: ${count} note links reformatted`);
}

console.log('✅ Note format fixed (short titles, inline clickable, domain in brackets)');
