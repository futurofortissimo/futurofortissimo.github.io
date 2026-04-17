#!/usr/bin/env node
/**
 * sweep_legacy_notes.cjs — Converts legacy &#128206; inline-link note format to
 * v5 rule-compliant [N] anchor with entry in <section id="bibliografia">.
 *
 * Input pattern (legacy):
 *   <a href="URL" target="_blank" rel="noopener" style="..."> &#128206; TITLE</a>
 *
 * Output pattern (v5 §0.octies):
 *   <a href="#fonte-N" class="fnote-ref" ...>[N]</a>   (inline in prose)
 *   <li id="fonte-N"><a href="URL">MICRO_SUMMARY</a> &mdash; <span>DOMAIN</span></li>
 *
 * Behavior:
 * 1. Parse <section id="bibliografia"> of each chapter → map URL -> fonte-N
 * 2. Find every legacy <a> containing &#128206; in prose
 * 3. If URL already in bibliografia → replace <a>TITLE</a> with <a href="#fonte-N">[N]</a>
 *    If NOT in bibliografia → add new <li id="fonte-{max+1}"> and use that N
 * 4. Write transformed HTML back
 * 5. Produce audit report
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/micme/Desktop/micmer/futuro fortissimo';
const BOOK = path.join(ROOT, 'book');

const chapterFiles = fs.readdirSync(BOOK)
  .filter(f => /^chapter-0[123]-[a-z]+\.html$/.test(f));

const perFileStats = {};

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return 'link'; }
}

function cleanText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&#128206;/g, '')
    .replace(/&[a-z]+;/g, c => ({
      '&mdash;': '—', '&agrave;': 'à', '&egrave;': 'è', '&igrave;': 'ì',
      '&ograve;': 'ò', '&ugrave;': 'ù', '&rsquo;': "'", '&lsquo;': "'",
      '&ldquo;': '"', '&rdquo;': '"', '&eacute;': 'é', '&nbsp;': ' ',
      '&amp;': '&', '&thinsp;': ' ', '&ndash;': '–'
    }[c] || c))
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function microSummary(text, minWords = 10, maxWords = 20) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ');
}

for (const file of chapterFiles) {
  const full = path.join(BOOK, file);
  let html = fs.readFileSync(full, 'utf-8');

  // Parse existing bibliografia for URL → fonte-N mapping
  const urlToFonte = {};
  let maxN = 0;
  const bibMatch = html.match(/<section id="bibliografia"[\s\S]*?<\/section>/);
  if (bibMatch) {
    const bib = bibMatch[0];
    const reLi = /<li id="fonte-(\d+)"><a href="([^"]+)"/g;
    let m;
    while ((m = reLi.exec(bib)) !== null) {
      const n = parseInt(m[1], 10);
      urlToFonte[m[2]] = n;
      if (n > maxN) maxN = n;
    }
  }

  // Find legacy inline paperclip links:
  // <a href="URL" target="_blank" rel="noopener" style="...">&#128206; TEXT</a>
  // or: <a style="..." href="URL" ...>&#128206; TEXT</a>
  const legacyRe = /<a\s+([^>]*?)>\s*&#128206;\s*([\s\S]*?)<\/a>/g;

  let replaced = 0;
  let added = 0;
  const newEntries = []; // { url, text, domain, n }
  const examplesBefore = [];
  const examplesAfter = [];

  html = html.replace(legacyRe, (match, attrs, innerText) => {
    // Extract href from attrs
    const hrefMatch = attrs.match(/href="([^"]+)"/);
    if (!hrefMatch) return match; // unable to parse, leave intact
    const url = hrefMatch[1];

    let n = urlToFonte[url];
    if (!n) {
      // Try normalization match
      const norm = url.replace(/\/+$/, '');
      for (const [u, k] of Object.entries(urlToFonte)) {
        if (u.replace(/\/+$/, '') === norm) { n = k; break; }
      }
    }

    const cleaned = cleanText(innerText);

    if (!n) {
      maxN += 1;
      n = maxN;
      urlToFonte[url] = n;
      newEntries.push({
        url,
        text: microSummary(cleaned),
        domain: extractDomain(url),
        n
      });
      added += 1;
    }
    replaced += 1;

    const before = match.length < 220 ? match : match.slice(0, 220) + '…';
    const after = `<a href="#fonte-${n}" class="fnote-ref" style="color:var(--accent);text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:0.72rem;vertical-align:super;font-weight:bold;">[${n}]</a>`;
    if (examplesBefore.length < 5) {
      examplesBefore.push(before);
      examplesAfter.push(after);
    }
    return after;
  });

  // Insert any new entries into bibliografia section
  if (newEntries.length > 0) {
    const bibRe = /(<section id="bibliografia"[\s\S]*?<ol[^>]*>)([\s\S]*?)(<\/ol>\s*<\/section>)/;
    const mb = html.match(bibRe);
    if (mb) {
      let insertion = '';
      for (const e of newEntries) {
        insertion += `\n        <li id="fonte-${e.n}"><a href="${e.url}" target="_blank" rel="noopener" class="text-blue-700 hover:underline">${e.text}</a> &mdash; <span class="text-zinc-500">${e.domain}</span></li>`;
      }
      html = html.replace(bibRe, (full, p1, p2, p3) => p1 + p2 + insertion + '\n      ' + p3);
      // Update "N fonti in questa sezione." count if present
      const countRe = /(<section id="bibliografia"[\s\S]*?)(\d+)(\s+fonti in questa sezione\.)/;
      const cm = html.match(countRe);
      if (cm) {
        const newCount = Object.keys(urlToFonte).length;
        html = html.replace(countRe, (f, a, _old, c) => a + newCount + c);
      }
    }
  }

  fs.writeFileSync(full, html, 'utf-8');
  perFileStats[file] = {
    legacyReplaced: replaced,
    newBibEntriesAdded: added,
    examplesBefore: examplesBefore.slice(0, 2),
    examplesAfter: examplesAfter.slice(0, 2),
  };
  console.log(`${file}: replaced=${replaced} new_entries=${added}`);
}

// Write audit report data
const outPath = path.join(ROOT, 'generated', 'sweep_legacy_notes_stats.json');
fs.writeFileSync(outPath, JSON.stringify(perFileStats, null, 2));
console.log('\nStats saved:', outPath);
