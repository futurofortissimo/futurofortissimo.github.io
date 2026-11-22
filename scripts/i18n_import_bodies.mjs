#!/usr/bin/env node
/**
 * i18n_import_bodies.mjs — imports body translations
 *   ### <issue-id>/<section-index>
 *   <translated content, one paragraph>
 *   C<j>: <translated image caption j>   (optional)
 *   R<k>: <translated anchor text of references[k]> (optional)
 * into i18n/<lang>.json with content hashes. Usage: node scripts/i18n_import_bodies.mjs <lang> <files...>
 */
import fs from 'node:fs';
import { rawData } from '../data.js';
import { dedupe, issueSlugOf, sectionContentHash, refsHash, loadTranslations, saveTranslations } from './i18n_lib.mjs';

const [lang, ...files] = process.argv.slice(2);
const src = new Map(dedupe(rawData).map((ch, i) => [issueSlugOf(ch, i), ch]));
const tr = loadTranslations(lang);
const errors = []; let n = 0;
const blocks = [];
for (const f of files) {
  let cur = null;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = /^### (.+)\/(\d+)$/.exec(line);
    if (m) { cur = { id: m[1], i: +m[2], content: [], caps: {}, refs: {} }; blocks.push(cur); continue; }
    if (!cur || !line.trim()) continue;
    const c = /^C(\d+): (.*)$/.exec(line);
    const r = /^R(\d+): (.*)$/.exec(line);
    if (c) cur.caps[+c[1]] = c[2].trim();
    else if (r) cur.refs[+r[1]] = r[2].trim();
    else cur.content.push(line.trim());
  }
}
for (const b of blocks) {
  const ch = src.get(b.id); const s = ch?.subchapters?.[b.i];
  if (!s) { errors.push(`unknown ${b.id}/${b.i}`); continue; }
  const issue = tr.issues[b.id];
  if (!issue) { errors.push(`${b.id}: import meta first`); continue; }
  const content = b.content.join('\n'); // keep paragraph breaks like the Italian source
  const ratio = content.length / Math.max(1, s.content.length);
  if (ratio < 0.6 || ratio > 2.2) errors.push(`${b.id}/${b.i}: suspicious length ratio ${ratio.toFixed(2)}`);
  const srcCaps = (s.images || []).map((im) => im.caption || '');
  for (const j of Object.keys(b.caps)) if (!srcCaps[j]) errors.push(`${b.id}/${b.i}: caption C${j} has no source caption`);
  const missingCaps = srcCaps.map((c, j) => (c && !b.caps[j] ? j : null)).filter((x) => x !== null);
  if (missingCaps.length) errors.push(`${b.id}/${b.i}: missing captions ${missingCaps}`);
  const sec = issue.sections[String(b.i)] || {};
  sec.ch = sectionContentHash(s); sec.content = content;
  if (srcCaps.some(Boolean)) sec.captions = srcCaps.map((c, j) => (c ? b.caps[j] ?? c : ''));
  const nRefs = (s.references || []).length;
  for (const k of Object.keys(b.refs)) if (+k >= nRefs) errors.push(`${b.id}/${b.i}: R${k} out of range (${nRefs} refs)`);
  if (Object.keys(b.refs).length) { sec.refs = Object.fromEntries(Object.entries(b.refs).filter(([k]) => +k < nRefs)); sec.rh = refsHash(s); }
  issue.sections[String(b.i)] = sec; n++;
}
saveTranslations(lang, tr);
console.log(`${lang}: imported ${n} section bodies`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
