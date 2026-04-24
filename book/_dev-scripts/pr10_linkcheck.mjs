#!/usr/bin/env node
/**
 * Link check across book/*.html — internal <a href> targets only.
 * Flags: missing files, broken anchors to local files.
 * Skips: external http(s)://, mailto:, tel:, javascript:, #-only
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOK = join(__dirname, '..');
const ROOT = join(BOOK, '..');

const files = readdirSync(BOOK).filter(f => f.endsWith('.html'));
const hrefRe = /href="([^"]+)"/g;

let broken = [];
let checked = 0;

for (const f of files) {
  const html = readFileSync(join(BOOK, f), 'utf8');
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) continue;
    if (href === '' || href === '/') continue;
    checked++;
    // Resolve path — if starts with /, treat as root
    let target;
    const hashIdx = href.indexOf('#');
    const cleanHref = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
    if (cleanHref === '') continue; // pure anchor on same page
    if (cleanHref.startsWith('/')) {
      target = join(ROOT, cleanHref);
    } else {
      target = resolve(BOOK, cleanHref);
    }
    if (!existsSync(target)) {
      broken.push({ from: f, href, target });
    }
  }
}

console.log(`Checked ${checked} internal hrefs across ${files.length} files.`);
console.log(`Broken: ${broken.length}`);
for (const b of broken.slice(0, 30)) {
  console.log(`  ${b.from} -> ${b.href}`);
}
if (broken.length > 30) console.log(`  ...and ${broken.length - 30} more`);
