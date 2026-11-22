#!/usr/bin/env node
/**
 * i18n_import_meta.mjs — imports line-based translation batches
 *   ## <issue-id>
 *   T: title / S: subtitle / K<n>: keypoint / <n>: section title
 * into i18n/<lang>.json, stamping source hashes. Strict checks: every issue,
 * keypoint and section title must be present and ff.x.y labels must match.
 * Usage: node scripts/i18n_import_meta.mjs <lang> <file...>
 */
import fs from 'node:fs';
import { rawData } from '../data.js';
import { dedupe, issueSlugOf, metaHash, sectionTitleHash, loadTranslations, saveTranslations } from './i18n_lib.mjs';

const [lang, ...files] = process.argv.slice(2);
if (!lang || !files.length) { console.error('usage: i18n_import_meta.mjs <lang> <files...>'); process.exit(2); }
const src = new Map(dedupe(rawData).map((ch, i) => [issueSlugOf(ch, i), ch]));
const tr = loadTranslations(lang);
tr.lang = lang;
const errors = [];
let cur = null; const parsed = {};
for (const f of files) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  let m;
  if ((m = /^## (.+)$/.exec(line))) { cur = m[1].trim(); parsed[cur] = { keypoints: [], sections: {} }; continue; }
  if (!cur) continue;
  if ((m = /^T: (.*)$/.exec(line))) parsed[cur].title = m[1].trim();
  else if ((m = /^S: ?(.*)$/.exec(line))) parsed[cur].subtitle = m[1].trim();
  else if ((m = /^K(\d+): (.*)$/.exec(line))) parsed[cur].keypoints[+m[1]] = m[2].trim();
  else if ((m = /^(\d+): (.*)$/.exec(line))) parsed[cur].sections[m[1]] = m[2].trim();
  else errors.push(`${f}: unparsed line in ${cur}: ${line.slice(0, 60)}`);
}
const label = (s) => (/ff\.\d+(\.\d+)?/i.exec(s || '') || [''])[0];
for (const [id, p] of Object.entries(parsed)) {
  const ch = src.get(id);
  if (!ch) { errors.push(`unknown issue ${id}`); continue; }
  const kp = ch.keypoints || [];
  if (p.keypoints.length !== kp.length) errors.push(`${id}: keypoints ${p.keypoints.length}/${kp.length}`);
  if (label(p.title) !== label(ch.title)) errors.push(`${id}: title label mismatch`);
  const entry = tr.issues[id] || { sections: {} };
  entry.h = metaHash(ch);
  entry.title = p.title; entry.subtitle = p.subtitle ?? ''; entry.keypoints = p.keypoints;
  entry.sections = entry.sections || {};
  (ch.subchapters || []).forEach((s, i) => {
    const t = p.sections[String(i)];
    if (!t) { errors.push(`${id}: missing section ${i}`); return; }
    if (!label(s.title).startsWith(label(t))) errors.push(`${id}/${i}: label ${label(t)} != ${label(s.title)}`);
    entry.sections[String(i)] = { ...(entry.sections[String(i)] || {}), th: sectionTitleHash(s), title: t };
  });
  tr.issues[id] = entry;
}
const missing = [...src.keys()].filter((id) => !tr.issues[id]);
saveTranslations(lang, tr);
console.log(`${lang}: imported ${Object.keys(parsed).length} issues; total ${Object.keys(tr.issues).length}/${src.size}; missing: ${missing.join(', ') || 'none'}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
