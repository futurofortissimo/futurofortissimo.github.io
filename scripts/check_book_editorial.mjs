#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const bookDir = path.resolve('book');
const chapterFiles = fs
  .readdirSync(bookDir)
  .filter((name) => /^chapter-\d+\.html$/.test(name))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => path.join(bookDir, name));

const violations = [];

const normalize = (text) => text
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const countWords = (text) => normalize(text).split(' ').filter(Boolean).length;

for (const file of chapterFiles) {
  const html = fs.readFileSync(file, 'utf8');

  const checks = [
    { id: 'search-section', ok: /<section[^>]+id=["']search["'][\s\S]*?<h2[^>]*>\s*Search\s*<\/h2>/i.test(html) },
    { id: 'last-updated-timestamp', ok: /Ultimo aggiornamento\s*:\s*\d{4}-\d{2}-\d{2}/i.test(html) },
    { id: 'reading-time-estimate', ok: /~?\d+\s*min\s+di\s+lettura/i.test(html) },
    { id: 'ref-count', ok: /Riferimenti\s*:\s*\d+/i.test(html) },
  ];

  for (const check of checks) {
    if (!check.ok) violations.push(`${file}: missing ${check.id}`);
  }

  const rawStylePatterns = [
    /note\s*:\s*raw/i,
    /raw\s*note/i,
    /\[\s*note\s*\]/i,
    /TODO\s*:/,
    /\bbozza\b/i,
    /\bdraft\b/i,
    /\bTBD\b/,
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
    const words = countWords(match[1]);
    if (words > 15) {
      const excerpt = normalize(match[1]).slice(0, 80);
      violations.push(`${file}: linked claim text > 15 words (${words}) — "${excerpt}${excerpt.length >= 80 ? '…' : ''}"`);
      break;
    }
  }

  const fcRegex = /<span class="fc">([\s\S]*?)<\/span>/gi;
  while ((match = fcRegex.exec(html)) !== null) {
    const lines = match[1]
      .split(/\r?\n/)
      .map((line) => normalize(line))
      .filter(Boolean);

    const claim = lines.length > 1 ? lines.slice(1).join(' ') : lines[0] ?? '';
    const words = countWords(claim);

    if (words > 15) {
      const excerpt = normalize(claim).slice(0, 80);
      violations.push(`${file}: fc claim text > 15 words (${words}) — "${excerpt}${excerpt.length >= 80 ? '…' : ''}"`);
      break;
    }
  }

  const declaredRefs = html.match(/Riferimenti\s*:\s*(\d+)/i);
  const actualRefs = (html.match(/<span class="fc">/g) || []).length;
  if (declaredRefs) {
    const declared = Number(declaredRefs[1]);
    if (declared !== actualRefs) {
      violations.push(`${file}: ref-count mismatch (declared ${declared}, found ${actualRefs} .fc references)`);
    }
  }
}

if (violations.length) {
  console.error('Book editorial checks failed:\n');
  for (const issue of violations) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Book editorial checks passed for ${chapterFiles.length} chapters.`);
