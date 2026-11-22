#!/usr/bin/env node
/**
 * i18n_status.mjs — what is translated, stale or missing in i18n/<lang>.json vs data.js.
 *   node scripts/i18n_status.mjs            → summary + writes i18n/status.json
 *   node scripts/i18n_status.mjs --list     → also lists missing/stale ids
 */
import fs from 'node:fs';
import path from 'node:path';
import { rawData } from '../data.js';
import { ROOT, TARGET_LANGS, dedupe, issueSlugOf, loadTranslations, metaHash, sectionTitleHash, sectionContentHash } from './i18n_lib.mjs';

const list = process.argv.includes('--list');
const issues = dedupe(rawData);
const out = { generated: new Date().toISOString().slice(0, 10), issues: issues.length, sections: issues.reduce((a, c) => a + (c.subchapters || []).length, 0), langs: {} };
for (const lang of TARGET_LANGS) {
  const tr = loadTranslations(lang);
  const st = { metaOk: 0, metaMissing: [], metaStale: [], titlesOk: 0, bodiesOk: 0, bodiesMissing: 0, bodiesStale: [], fullIssues: 0 };
  issues.forEach((ch, idx) => {
    const id = issueSlugOf(ch, idx);
    const t = tr.issues[id];
    if (!t) st.metaMissing.push(id);
    else if (t.h !== metaHash(ch)) st.metaStale.push(id);
    else st.metaOk++;
    let full = !!t && t.h === metaHash(ch);
    (ch.subchapters || []).forEach((s, i) => {
      const ts = t?.sections?.[String(i)];
      if (ts && ts.th === sectionTitleHash(s) && ts.title) st.titlesOk++; else full = false;
      if (ts && ts.ch === sectionContentHash(s) && ts.content) st.bodiesOk++;
      else { full = false; if (ts?.content) st.bodiesStale.push(`${id}/${i}`); else st.bodiesMissing++; }
    });
    if (full) st.fullIssues++;
  });
  out.langs[lang] = {
    metaOk: st.metaOk, metaMissing: st.metaMissing.length, metaStale: st.metaStale.length,
    sectionTitlesOk: st.titlesOk, sectionBodiesOk: st.bodiesOk, sectionBodiesMissing: st.bodiesMissing, sectionBodiesStale: st.bodiesStale.length,
    fullIssues: st.fullIssues,
    ...(list ? { metaMissingIds: st.metaMissing, metaStaleIds: st.metaStale, bodiesStaleIds: st.bodiesStale } : {}),
  };
}
fs.writeFileSync(path.join(ROOT, 'i18n', 'status.json'), JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
