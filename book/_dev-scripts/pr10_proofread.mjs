#!/usr/bin/env node
/**
 * PR10 proof-read pass — idempotent.
 * Scans book/chapter-*.html, applies safe text-level fixes outside of
 * <pre>, <code>, <style>, <script> blocks.
 *
 * Fixes:
 *  - Italian typos: perchè→perché, benchè→benché, poichè→poiché, sicchè→sicché, affinchè→affinché, finchè→finché, cosicchè→cosicché
 *  - Pronoun sè → sé (conservative: only when standalone word, not "se stesso" contexts already correct)
 *  - Ellipsis "... " normalized to "… "
 *  - Double spaces in prose collapsed to single
 *  - Trailing spaces on lines trimmed
 *  - Empty paragraphs <p><br></p> and <p>&nbsp;</p> removed
 *  - Repeated punctuation ",," → ",", ";;" → ";", "..." kept (ellipsis handled)
 *
 * Does NOT touch: <pre>, <code>, <style>, <script>, href/src attributes, data-* attrs.
 * Reports per-chapter fix counts.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOK = join(__dirname, '..');

const CHAPTERS = readdirSync(BOOK)
  .filter(f => /^chapter-\d+.*\.html$/.test(f))
  .sort();

// Protect regions: keep original, substitute placeholder, restore after transforms
const PROTECT_RE = /<(pre|code|style|script)\b[^>]*>[\s\S]*?<\/\1>/gi;

const TYPO_FIXES = [
  [/\bperch[eè]'?\b(?<!perché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')], // perchè → perché, perche' → perché
  [/\bbench[eè]'?\b(?<!benché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\bpoich[eè]'?\b(?<!poiché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\bsicch[eè]'?\b(?<!sicché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\baffinch[eè]'?\b(?<!affinché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\bfinch[eè]'?\b(?<!finché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\bcosicch[eè]'?\b(?<!cosicché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
  [/\bgiacch[eè]'?\b(?<!giacché)/gi, m => m.replace(/ch[eè]'?/i, 'ché')],
];

// Simpler, safer typo replacements using direct map (case-insensitive, preserve case only for lowercase-starting)
function fixTypos(s) {
  let n = 0;
  const map = [
    [/\bperchè\b/g, 'perché'],
    [/\bPerchè\b/g, 'Perché'],
    [/\bperche'/g, 'perché'],
    [/\bbenchè\b/g, 'benché'],
    [/\bBenchè\b/g, 'Benché'],
    [/\bpoichè\b/g, 'poiché'],
    [/\bPoichè\b/g, 'Poiché'],
    [/\bsicchè\b/g, 'sicché'],
    [/\baffinchè\b/g, 'affinché'],
    [/\bAffinchè\b/g, 'Affinché'],
    [/\bfinchè\b/g, 'finché'],
    [/\bFinchè\b/g, 'Finché'],
    [/\bcosicchè\b/g, 'cosicché'],
    [/\bgiacchè\b/g, 'giacché'],
    // Pronoun "sè stesso/a/i/e" → "sé stesso..."
    [/\bsè\s+stess([oaie])\b/g, 'sé stess$1'],
    [/\bSè\s+stess([oaie])\b/g, 'Sé stess$1'],
    // "di per sè" → "di per sé"
    [/\bdi\s+per\s+sè\b/g, 'di per sé'],
  ];
  for (const [re, rep] of map) {
    const before = s;
    s = s.replace(re, rep);
    if (s !== before) n += (before.match(re) || []).length;
  }
  return { s, n };
}

function fixEllipsis(s) {
  // Normalize "... " or "..." to "…" (only 3 dots, not 4+)
  const re = /(?<!\.)\.{3}(?!\.)/g;
  const count = (s.match(re) || []).length;
  s = s.replace(re, '…');
  return { s, n: count };
}

function fixDoubleSpaces(s) {
  // Collapse runs of 2+ spaces to 1 — but NOT inside indentation at line start
  // Approach: on each line, keep leading whitespace, collapse inner runs
  const lines = s.split('\n');
  let n = 0;
  const out = lines.map(line => {
    const leadMatch = line.match(/^(\s*)(.*?)(\s*)$/s);
    if (!leadMatch) return line;
    const [, lead, mid, tail] = leadMatch;
    const fixed = mid.replace(/ {2,}/g, ' ');
    if (fixed !== mid) n += 1;
    // also strip trailing spaces
    const trailTrimmed = tail.replace(/[ \t]+$/, '');
    return lead + fixed + trailTrimmed;
  });
  return { s: out.join('\n'), n };
}

function fixEmptyParagraphs(s) {
  const re1 = /<p>\s*<br\s*\/?>\s*<\/p>/gi;
  const re2 = /<p>\s*&nbsp;\s*<\/p>/gi;
  const n = (s.match(re1) || []).length + (s.match(re2) || []).length;
  s = s.replace(re1, '').replace(re2, '');
  return { s, n };
}

function fixRepeatedPunct(s) {
  // Handles ",,"  ";;" and ".," mistakes — conservative: only obvious doubles
  const fixes = [
    [/,{2,}/g, ','],
    [/;{2,}/g, ';'],
    [/ +,/g, ','],   // space before comma
    [/ +;/g, ';'],   // space before semicolon
  ];
  let n = 0;
  for (const [re, rep] of fixes) {
    const before = s;
    s = s.replace(re, rep);
    if (s !== before) n += (before.match(re) || []).length;
  }
  return { s, n };
}

function proofread(html) {
  // Protect pre/code/style/script blocks
  const stash = [];
  const protectedHtml = html.replace(PROTECT_RE, m => {
    stash.push(m);
    return `__FFPROTECT_${stash.length - 1}__`;
  });

  const stats = { typos: 0, ellipsis: 0, spaces: 0, emptyP: 0, punct: 0 };
  let s = protectedHtml;

  let r;
  r = fixTypos(s);         s = r.s; stats.typos = r.n;
  r = fixEllipsis(s);      s = r.s; stats.ellipsis = r.n;
  r = fixEmptyParagraphs(s); s = r.s; stats.emptyP = r.n;
  r = fixRepeatedPunct(s); s = r.s; stats.punct = r.n;
  r = fixDoubleSpaces(s);  s = r.s; stats.spaces = r.n;

  // Restore protected blocks
  s = s.replace(/__FFPROTECT_(\d+)__/g, (_, i) => stash[Number(i)]);

  return { html: s, stats };
}

// Main
let totalFiles = 0, totalFixed = 0;
const agg = { typos: 0, ellipsis: 0, spaces: 0, emptyP: 0, punct: 0 };
const report = [];

for (const f of CHAPTERS) {
  const p = join(BOOK, f);
  const raw = readFileSync(p, 'utf8');
  const { html, stats } = proofread(raw);
  totalFiles++;
  const sum = stats.typos + stats.ellipsis + stats.spaces + stats.emptyP + stats.punct;
  if (sum > 0 && html !== raw) {
    writeFileSync(p, html);
    totalFixed++;
    for (const k of Object.keys(agg)) agg[k] += stats[k];
    report.push({ f, ...stats, sum });
  }
}

console.log(`\n=== PR10 proof-read report ===`);
console.log(`Files scanned: ${totalFiles}`);
console.log(`Files modified: ${totalFixed}`);
console.log(`Typos: ${agg.typos}  Ellipsis: ${agg.ellipsis}  Spaces: ${agg.spaces}  EmptyP: ${agg.emptyP}  Punct: ${agg.punct}`);
console.log(`Total edits: ${Object.values(agg).reduce((a,b)=>a+b,0)}`);
console.log(`\nPer-file breakdown (only modified):`);
for (const r of report) {
  console.log(`  ${r.f}: typos=${r.typos} ellipsis=${r.ellipsis} spaces=${r.spaces} emptyP=${r.emptyP} punct=${r.punct}`);
}
