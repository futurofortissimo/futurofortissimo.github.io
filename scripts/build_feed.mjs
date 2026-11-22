/**
 * build_feed.mjs — Generates an Atom 1.0 feed for Futuro Fortissimo
 *
 * Sources:
 *   - data.js            → newsletter entries (newest-first)
 *   - book/chapter-*.html → book chapter entries
 *
 * Output: feed.xml (Atom 1.0)
 */

import { readFileSync, writeFileSync, statSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { rawData } from '../data.js';

const ROOT = resolve(import.meta.dirname, '..');
const SITE = 'https://futurofortissimo.github.io';
const AUTHOR = 'Michele Merelli';

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRFC3339(date) {
  return date.toISOString();
}

function issueSlugOf(ch, idx) {
  const m = /ff\.(\d+)/i.exec(ch.title || '');
  if (m) return `ff-${m[1]}`;
  const slug = (ch.url || '').replace(/\/$/, '').split('/').pop();
  return slug || `issue-${idx}`;
}

function getNewsletterEntries() {
  const seen = new Set();
  const entries = [];
  rawData.forEach((ch, idx) => {
    const url = (ch?.url || '').replace(/\/$/, '');
    if (!url || seen.has(url)) return;
    seen.add(url);
    const slug = issueSlugOf(ch, idx);
    entries.push({
      id: ch.url,
      link: `${SITE}/archivio/${slug}.html`,
      substackLink: ch.url,
      slug,
      title: ch.title || slug,
      summary: ch.subtitle || `Archivio Futuro Fortissimo — ${ch.title || slug}`
    });
  });
  return entries;
}

function getChapterEntries() {
  const bookDir = resolve(ROOT, 'book');
  const files = readdirSync(bookDir)
    .filter((f) => /^chapter-\d+\.html$/.test(f))
    .sort();

  return files.map((f) => {
    const filePath = resolve(bookDir, f);
    const html = readFileSync(filePath, 'utf-8');
    const stat = statSync(filePath);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch
      ? titleMatch[1].replace(/\s*\|\s*Futuro Fortissimo$/, '')
      : f.replace('.html', '');

    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : '';

    return {
      id: `${SITE}/book/${f}`,
      link: `${SITE}/book/${f}`,
      title,
      description,
      updated: stat.mtime
    };
  });
}

function buildAtomFeed() {
  const newsletters = getNewsletterEntries();
  const chapters = getChapterEntries();
  const now = toRFC3339(new Date());

  const nlEntries = newsletters.slice(0, 40).map((nl, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 10);
    return {
      id: nl.id,
      link: nl.link,
      title: nl.title,
      updated: toRFC3339(date),
      summary: nl.summary
    };
  });

  const chEntries = chapters.map((ch) => ({
    id: ch.id,
    link: ch.link,
    title: ch.title,
    updated: toRFC3339(ch.updated),
    summary: ch.description
  }));

  const allEntries = [...nlEntries, ...chEntries];

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Futuro Fortissimo</title>
  <subtitle>Archivio tipografico: letture, note e percorsi su AI, natura, società</subtitle>
  <link href="${SITE}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE}/" rel="alternate" type="text/html"/>
  <id>${SITE}/</id>
  <updated>${now}</updated>
  <author>
    <name>${escapeXml(AUTHOR)}</name>
    <uri>https://fortissimo.substack.com</uri>
  </author>
  <rights>© ${new Date().getFullYear()} ${escapeXml(AUTHOR)}</rights>
  <generator>build_feed.mjs</generator>
`;

  for (const entry of allEntries) {
    xml += `
  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link href="${escapeXml(entry.link)}" rel="alternate" type="text/html"/>
    <id>${escapeXml(entry.id)}</id>
    <updated>${entry.updated}</updated>
    <summary>${escapeXml(entry.summary || '')}</summary>
  </entry>`;
  }

  xml += `
</feed>
`;

  return xml;
}

const feed = buildAtomFeed();
const outPath = resolve(ROOT, 'feed.xml');
writeFileSync(outPath, feed, 'utf-8');
console.log(`✅ feed.xml written (${feed.length} bytes)`);
