/**
 * build_feed.mjs — Generates an Atom 1.0 feed for Futuro Fortissimo
 *
 * Sources:
 *   - newsletter_data.json → newsletter entries
 *   - book/chapter-*.html  → book chapter entries
 *
 * Output: feed.xml (Atom 1.0)
 */

import { readFileSync, writeFileSync, statSync, readdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const SITE = 'https://futurofortissimo.github.io';
const AUTHOR = 'Michele Merelli';

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRFC3339(date) {
  return date.toISOString();
}

// Extract newsletter entries via regex (newsletter_data.json may be malformed)
function getNewsletterEntries() {
  const raw = readFileSync(resolve(ROOT, 'newsletter_data.json'), 'utf-8');
  const entries = [];
  const re = /"substackLink"\s*:\s*"([^"]+)"[\s\S]*?"urlSlug"\s*:\s*"([^"]+)"[\s\S]*?"title"\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const [, link, slug, title] = m;
    // Skip if already seen (dedup by slug)
    if (entries.find(e => e.slug === slug)) continue;
    entries.push({ link, slug, title });
  }
  return entries;
}

// Extract book chapter entries from HTML files
function getChapterEntries() {
  const bookDir = resolve(ROOT, 'book');
  const files = readdirSync(bookDir)
    .filter(f => /^chapter-\d+\.html$/.test(f))
    .sort();

  return files.map(f => {
    const filePath = resolve(bookDir, f);
    const html = readFileSync(filePath, 'utf-8');
    const stat = statSync(filePath);

    // Extract title from <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch
      ? titleMatch[1].replace(/\s*\|\s*Futuro Fortissimo$/, '')
      : f.replace('.html', '');

    // Extract description from meta
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : '';

    const chNum = f.match(/chapter-(\d+)/)?.[1] || '0';

    return {
      id: `${SITE}/book/${f}`,
      link: `${SITE}/book/${f}`,
      title,
      description,
      updated: stat.mtime,
      chNum
    };
  });
}

function buildAtomFeed() {
  const newsletters = getNewsletterEntries();
  const chapters = getChapterEntries();

  const now = toRFC3339(new Date());

  // Assign synthetic dates to newsletters (newest first, weekly cadence from today)
  const nlEntries = newsletters.map((nl, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    return {
      id: nl.link,
      link: nl.link,
      title: nl.title,
      updated: toRFC3339(date),
      summary: `Newsletter ${nl.slug} — Futuro Fortissimo`
    };
  });

  const chEntries = chapters.map(ch => ({
    id: ch.id,
    link: ch.link,
    title: ch.title,
    updated: toRFC3339(ch.updated),
    summary: ch.description
  }));

  const allEntries = [...chEntries, ...nlEntries.slice(0, 30)]; // Latest 30 newsletters + all chapters

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Futuro Fortissimo</title>
  <subtitle>Archivio tipografico: letture, note e percorsi su AI, natura, societ&agrave;</subtitle>
  <link href="${SITE}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE}/" rel="alternate" type="text/html"/>
  <id>${SITE}/</id>
  <updated>${now}</updated>
  <author>
    <name>${escapeXml(AUTHOR)}</name>
    <uri>https://fortissimo.substack.com</uri>
  </author>
  <rights>&copy; ${new Date().getFullYear()} ${escapeXml(AUTHOR)}</rights>
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
