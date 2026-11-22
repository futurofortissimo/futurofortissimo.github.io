#!/usr/bin/env node
/**
 * translate_missing.mjs — fills missing/stale translations in i18n/en.json + i18n/hi.json
 * using any OpenAI-compatible Chat Completions API. Newest issues first.
 *
 * Env (all optional except the key; without a key the script exits 0 and does nothing,
 * so the site keeps serving the Italian fallback for untranslated sections):
 *   TRANSLATE_API_KEY    API key (GitHub secret)
 *   TRANSLATE_API_BASE   default https://api.openai.com/v1
 *   TRANSLATE_MODEL      default gpt-4o-mini
 *   TRANSLATE_MAX_ISSUES max issues to touch per run (default 3)
 *   TRANSLATE_LANGS      default "en,hi"
 *
 * Guards: output must be JSON with the same keypoint/section/caption counts,
 * section titles must keep their ff.x.y label, body length ratio 0.5–2.5.
 * Anything failing a guard is skipped (Italian fallback stays).
 */
import { rawData } from '../data.js';
import { dedupe, issueSlugOf, loadTranslations, saveTranslations, metaHash, sectionTitleHash, sectionContentHash } from './i18n_lib.mjs';

const KEY = process.env.TRANSLATE_API_KEY;
if (!KEY) { console.log('ℹ️  TRANSLATE_API_KEY not set — skipping machine translation (Italian fallback stays).'); process.exit(0); }
const BASE = (process.env.TRANSLATE_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.TRANSLATE_MODEL || 'gpt-4o-mini';
const MAX = Number(process.env.TRANSLATE_MAX_ISSUES || 3);
const LANGS = (process.env.TRANSLATE_LANGS || 'en,hi').split(',').map((s) => s.trim()).filter(Boolean);

const STYLE = {
  en: 'Translate into natural, idiomatic, punchy English — the voice of a curious, witty Italian writer (Michele Merelli). Not literal.',
  hi: 'Translate into fluent, natural Hindi in Devanagari script — conversational and vivid, not literal or bureaucratic. Keep common tech terms (AI, chip, startup) in their usual form.',
};
const RULES = `Rules: keep every fact, number, unit, date, name, brand, URL and emoji exactly. Keep "ff.N" / "ff.N.M" codes unchanged at the same position. Book titles: use the original or official edition title when one exists. Do not add or drop content. Return ONLY JSON with exactly the same keys and array lengths as the input.`;

async function translate(lang, payload) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `You translate the Italian newsletter "Futuro Fortissimo". ${STYLE[lang]} ${RULES}` },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return JSON.parse(j.choices[0].message.content);
}
const label = (t) => (/ff\.\d+(?:\.\d+)?/i.exec(t || '') || [''])[0];

const issues = dedupe(rawData).map((ch, idx) => ({ ch, id: issueSlugOf(ch, idx) }))
  .sort((a, b) => (Number((/ff\.(\d+)/.exec(b.ch.title) || [])[1] ?? -1)) - (Number((/ff\.(\d+)/.exec(a.ch.title) || [])[1] ?? -1)));

for (const lang of LANGS) {
  const tr = loadTranslations(lang);
  let touched = 0;
  for (const { ch, id } of issues) {
    if (touched >= MAX) break;
    const t = tr.issues[id] || { sections: {} };
    const subs = ch.subchapters || [];
    const needMeta = t.h !== metaHash(ch);
    const needSecs = subs.map((s, i) => {
      const ts = t.sections?.[String(i)];
      return !ts || ts.th !== sectionTitleHash(s) || ts.ch !== sectionContentHash(s) || !ts.content;
    });
    if (!needMeta && !needSecs.some(Boolean)) continue;
    touched++;
    const payload = {
      title: ch.title, subtitle: ch.subtitle || '', keypoints: ch.keypoints || [],
      sections: subs.map((s) => ({ title: s.title, content: s.content || '', captions: (s.images || []).map((im) => im.caption || '') })),
    };
    try {
      const out = await translate(lang, payload);
      if (label(out.title) !== label(ch.title)) throw new Error('issue label changed');
      if ((out.keypoints || []).length !== payload.keypoints.length) throw new Error('keypoint count');
      if ((out.sections || []).length !== subs.length) throw new Error('section count');
      const next = { ...t, h: metaHash(ch), title: out.title, subtitle: out.subtitle, keypoints: out.keypoints, sections: { ...(t.sections || {}) } };
      subs.forEach((s, i) => {
        const o = out.sections[i];
        if (label(o.title) !== label(s.title)) { console.warn(`  skip ${id}/${i}: label`); return; }
        const r = (o.content || '').length / Math.max(1, (s.content || '').length);
        const bodyOk = !s.content || (r > 0.5 && r < 2.5);
        const caps = Array.isArray(o.captions) && o.captions.length === (s.images || []).length ? o.captions : undefined;
        next.sections[String(i)] = {
          th: sectionTitleHash(s), title: o.title,
          ...(bodyOk ? { ch: sectionContentHash(s), content: o.content, ...(caps ? { captions: caps } : {}) } : {}),
          mt: true, // machine translated (review welcome)
        };
      });
      tr.issues[id] = next;
      console.log(`✅ ${lang} ${id}`);
    } catch (e) {
      console.warn(`⚠️  ${lang} ${id}: ${e.message} — Italian fallback kept`);
    }
  }
  saveTranslations(lang, tr);
}
