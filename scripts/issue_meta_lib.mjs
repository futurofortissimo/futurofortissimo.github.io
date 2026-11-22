/** Lookup of Substack publication metadata (i18n/issue_meta.json, see fetch_issue_meta.mjs). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'i18n', 'issue_meta.json');
const META = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf-8')) : {};
const numKey = (title = '') => {
  const m = /ff\.?\s?(\d+)/i.exec(title);
  if (m) return `ff${m[1]}`;
  const c = /100\s*[-.(]?\s*(\d)/.exec(title);
  return c ? `ff100-${c[1]}` : null;
};
const byNum = {};
for (const [slug, v] of Object.entries(META)) {
  const k = numKey(v.title) || numKey(slug.replace(/^futuro-fortissimo-100(\d)$/, 'x 100-$1'));
  if (k && !byNum[k]) byNum[k] = v;
}
/** @returns {{date?:string, cover?:string|null, updated?:string}} */
export function issueMeta(ch) {
  const slug = (ch?.url || '').replace(/\/$/, '').split('/').pop();
  if (META[slug]) return META[slug];
  const k = numKey(ch?.title) || numKey(slug.replace(/^futuro-fortissimo-100-(\d)$/, 'x 100-$1'));
  return (k && byNum[k]) || {};
}
