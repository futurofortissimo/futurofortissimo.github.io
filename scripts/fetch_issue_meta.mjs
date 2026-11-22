#!/usr/bin/env node
/**
 * fetch_issue_meta.mjs — publication dates (+ cover image) of every Substack issue.
 * Writes i18n/issue_meta.json: { "<substack-slug>": { "date": ISO, "cover": url|null, "updated": ISO } }
 * Used by build_archive_seo.mjs for datePublished / sitemap lastmod / og:image fallback.
 * Network failures are non-fatal: the existing file is kept (CI keeps working offline).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'i18n', 'issue_meta.json');
const BASE = 'https://fortissimo.substack.com/api/v1/archive?sort=new&limit=12';
const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf-8')) : {};

async function main() {
  const out = { ...existing };
  let cursor = null;
  for (let page = 0; page < 60; page++) {
    const url = cursor ? `${BASE}&cursor=${encodeURIComponent(cursor)}` : BASE;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (ff-archive build)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const posts = Array.isArray(data) ? data : data.posts || [];
    for (const p of posts) {
      if (!p?.slug || !p.post_date) continue;
      out[p.slug] = { id: p.id, title: p.title || '', date: p.post_date, cover: p.cover_image || null, updated: p.updated_at || p.post_date };
    }
    cursor = data.nextCursor;
    if (!cursor || !posts.length) break;
  }
  const sorted = Object.fromEntries(Object.entries(out).sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '')));
  fs.writeFileSync(OUT, JSON.stringify(sorted, null, 1) + '\n');
  console.log(`issue_meta.json: ${Object.keys(sorted).length} posts`);
}
main().catch((e) => { console.warn(`fetch_issue_meta: kept existing file (${e.message})`); });
