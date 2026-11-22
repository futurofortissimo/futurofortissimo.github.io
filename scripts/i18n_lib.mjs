/**
 * i18n_lib.mjs — shared helpers for the trilingual archive (it default, en, hi).
 * Translations live in i18n/<lang>.json keyed by stable ids:
 *   issue id   = issue slug (ff-158, or Substack slug for special issues)
 *   section id = <issue id>/<index>  (index in data.js subchapters order)
 * Each entry stores `h` = short hash of the Italian source it was translated from,
 * so changed/new Italian content is detected as "stale"/"missing".
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const LANGS = ['it', 'en', 'hi'];
export const TARGET_LANGS = ['en', 'hi'];

export const hash = (s) => crypto.createHash('sha1').update(String(s ?? ''), 'utf8').digest('hex').slice(0, 10);

export function issueSlugOf(ch, idx) {
  const m = /ff\.(\d+)/i.exec(ch.title || '');
  if (m) return `ff-${m[1]}`;
  const slug = (ch.url || '').replace(/\/$/, '').split('/').pop();
  return slug || `issue-${idx}`;
}

export function dedupe(rawData) {
  const seen = new Set();
  return rawData.filter((ch) => {
    const k = ch.url || ch.title;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function metaHash(ch) {
  return hash([ch.title, ch.subtitle, ...(ch.keypoints || [])].join('\u241E'));
}
export function sectionTitleHash(s) { return hash(s.title); }
export function sectionContentHash(s) { return hash(s.content); }

export const refsHash = (s) => hash(JSON.stringify((s.references || []).map((r) => r?.text || '')));
const cleanAmz = (u = '') => u.trim().replace(/^(https:\/\/amzn\.to\/[A-Za-z0-9]+)\1+$/, '$1');

/** Context for translating link anchors: Amazon book URL → original title, ff.x.y code → translated title */
export function buildRefContext(rawData, tr) {
  const ctx = { bookByUrl: new Map(), codeTitle: new Map() };
  try {
    const books = JSON.parse(fs.readFileSync(path.join(ROOT, 'libri', 'books_cited.json'), 'utf8')).books || [];
    const titles = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', 'books.json'), 'utf8')).titles || {};
    for (const b of books) {
      const t = titles[b.id];
      if (!t) continue;
      for (const u of [...(b.sourceUrls || []), b.amazonUrl, b.altAmazonUrl].filter(Boolean)) ctx.bookByUrl.set(cleanAmz(u), t);
    }
  } catch { /* books optional */ }
  dedupe(rawData).forEach((ch, idx) => {
    const id = issueSlugOf(ch, idx);
    const t = tr.issues[id];
    if (!t || t.h !== metaHash(ch)) return;
    const m = /ff\.(\d+)/i.exec(ch.title || '');
    if (m && t.title) ctx.codeTitle.set(`ff.${m[1]}`, t.title);
    (ch.subchapters || []).forEach((s, i) => {
      const ts = t.sections?.[String(i)];
      const c = /ff\.(\d+)\.(\d+)/i.exec(s.title || '');
      if (c && ts?.title && ts.th === sectionTitleHash(s)) ctx.codeTitle.set(`ff.${c[1]}.${c[2]}`, ts.title);
    });
  });
  return ctx;
}

function localizeRef(ref, translated, lang, ctx) {
  if (!ref) return ref;
  const out = { ...ref, _src: ref.text, _lang: 'it' };
  const book = ctx?.bookByUrl.get(cleanAmz(ref.url || ''));
  if (book) return { ...out, text: book, _lang: lang };
  const stripped = (ref.text || '').replace(/^[^\p{L}\p{N}]+/u, '');
  const code = /^ff\.(\d+(?:\.\d+)?)/i.exec(stripped);
  if (code && ctx?.codeTitle.has(`ff.${code[1]}`)) return { ...out, text: ctx.codeTitle.get(`ff.${code[1]}`), _lang: lang };
  if (translated) return { ...out, text: translated, _lang: lang };
  return out;
}

export function loadTranslations(lang) {
  const p = path.join(ROOT, 'i18n', `${lang}.json`);
  if (!fs.existsSync(p)) return { lang, issues: {} };
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function saveTranslations(lang, data) {
  const p = path.join(ROOT, 'i18n', `${lang}.json`);
  // stable key order for clean diffs
  const sorted = { lang: data.lang || lang, note: data.note, issues: {} };
  for (const k of Object.keys(data.issues).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
    const it = data.issues[k];
    const secs = {};
    for (const sk of Object.keys(it.sections || {}).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) secs[sk] = it.sections[sk];
    sorted.issues[k] = { ...it, sections: secs };
  }
  fs.writeFileSync(p, JSON.stringify(sorted, null, 1) + '\n');
}

/**
 * Overlay translations onto the Italian issue. Returns { issue, status }
 * status: 'full' (meta + all section titles + all bodies current),
 *         'partial' (meta translated, some bodies still Italian),
 *         'none'.
 */
export function localizeIssue(ch, idx, tr, idOverride, ctx) {
  const id = idOverride || issueSlugOf(ch, idx);
  const t = tr.issues[id];
  const out = { ...ch, _id: id, _lang: 'it', subchapters: (ch.subchapters || []).map((s) => ({
    ...s, _lang: 'it', _titleLang: 'it',
    references: (s.references || []).map((r) => localizeRef(r, null, tr.lang, ctx)),
    connections: (s.connections || []).map((r) => localizeRef(r, null, tr.lang, ctx)),
  })) };
  if (!t || t.h !== metaHash(ch)) return { issue: out, status: 'none', id };
  out._lang = tr.lang;
  out.title = t.title || ch.title;
  out.subtitle = t.subtitle ?? ch.subtitle;
  if (Array.isArray(t.keypoints) && t.keypoints.length === (ch.keypoints || []).length) out.keypoints = t.keypoints;
  let bodies = 0;
  out.subchapters = (ch.subchapters || []).map((s, i) => {
    const ts = (t.sections || {})[String(i)];
    const o = { ...out.subchapters[i] };
    if (ts && ts.refs && ts.rh === refsHash(s)) {
      o.references = (s.references || []).map((r, k) => localizeRef(r, ts.refs[String(k)], tr.lang, ctx));
    }
    if (ts && ts.th === sectionTitleHash(s) && ts.title) { o.title = ts.title; o._titleLang = tr.lang; }
    if (ts && ts.ch === sectionContentHash(s) && ts.content) { o.content = ts.content; o._lang = tr.lang; bodies++; }
    if (ts && ts.ch === sectionContentHash(s) && Array.isArray(ts.captions) && ts.captions.length === (s.images || []).length) {
      o.images = (s.images || []).map((im, j) => ({ ...im, caption: ts.captions[j] ?? im.caption }));
    }
    return o;
  });
  const n = out.subchapters.length;
  const titlesDone = out.subchapters.every((s) => s._titleLang === tr.lang);
  const status = titlesDone && bodies === n ? 'full' : 'partial';
  return { issue: out, status, id };
}
