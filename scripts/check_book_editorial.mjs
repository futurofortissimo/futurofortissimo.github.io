#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const bookDir = path.resolve('book');
const chapterFiles = fs
  .readdirSync(bookDir)
  .filter((name) => /^chapter-\d+\.html$/.test(name))
  .map((name) => path.join(bookDir, name));

const violations = [];

for (const file of chapterFiles) {
  const html = fs.readFileSync(file, 'utf8');

  const checks = [
    { id: 'search-section', ok: /id=["']search["']/i.test(html) },
    { id: 'last-updated', ok: /ultimo aggiornamento|last updated/i.test(html) },
    { id: 'reading-time', ok: /min di lettura|reading time/i.test(html) },
    { id: 'ref-count', ok: /riferimenti\s*:\s*\d+|references\s*:\s*\d+/i.test(html) },
  ];

  for (const check of checks) {
    if (!check.ok) {
      violations.push(`${file}: missing ${check.id}`);
    }
  }

  const rawStylePatterns = [
    /note\s*:\s*raw/i,
    /raw\s*note/i,
    /TODO\s*:/,
    /\bbozza\b/i,
    /\bdraft\b/i,
  ];

  for (const pattern of rawStylePatterns) {
    if (pattern.test(html)) {
      violations.push(`${file}: contains raw/note marker (${pattern})`);
      break;
    }
  }

  const anchorRegex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    const innerText = match[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const words = innerText ? innerText.split(' ').length : 0;

    if (words > 15) {
      const excerpt = innerText.slice(0, 80);
      violations.push(`${file}: linked claim text > 15 words (${words}) — "${excerpt}${innerText.length > 80 ? '…' : ''}"`);
      break;
    }
  }
}

if (violations.length) {
  console.error('Book editorial checks failed:\n');
  for (const issue of violations) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Book editorial checks passed for ${chapterFiles.length} chapters.`);
