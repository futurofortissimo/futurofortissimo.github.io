#!/usr/bin/env node
/**
 * build-bibliography.cjs — Builds external-source bibliography for each subchapter page.
 * Extracts all external <a> links from prose, creates "Fonti esterne" section with id="fonte-N".
 * chapter-ui.js then creates bidirectional links: [N] in prose → bib, ↩ in bib → prose+highlight.
 */
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => /^chapter-0[123]-[a-z]+\.html$/.test(f)).sort();

for (const file of files) {
  let html = fs.readFileSync(file, 'utf-8');

  // 1. Extract all external links from article.prose content
  // Find the article section
  const articleStart = html.indexOf('<article class="prose"');
  const articleEnd = html.indexOf('</article>');
  if (articleStart < 0 || articleEnd < 0) {
    console.log(file + ': no article.prose found, skipping');
    continue;
  }
  const articleHtml = html.slice(articleStart, articleEnd);

  // Extract all <a href="https://..."> links (external only)
  const linkRegex = /<a href="(https?:\/\/[^"]+)"[^>]*>([^<]*(?:<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*)<\/a>/g;
  const seen = new Set();
  const sources = [];
  let match;

  while ((match = linkRegex.exec(articleHtml)) !== null) {
    const url = match[1];
    // Skip duplicate URLs and internal anchors
    if (seen.has(url)) continue;
    if (url.startsWith('#') || url.includes('translate.google.com')) continue;
    seen.add(url);

    // Clean link text
    let text = match[2]
      .replace(/<[^>]*>/g, '')        // strip inner tags
      .replace(/&[a-z]+;/g, c => ({   // decode common entities
        '&mdash;':'—','&agrave;':'à','&egrave;':'è','&igrave;':'ì',
        '&ograve;':'ò','&ugrave;':'ù','&rsquo;':"'",'&lsquo;':"'",
        '&ldquo;':'"','&rdquo;':'"','&eacute;':'é','&nbsp;':' ',
        '&amp;':'&','&thinsp;':' '
      }[c] || c))
      .trim();

    // Skip if text is too short (just a domain or fragment)
    if (text.length < 8) continue;

    // Truncate very long text
    if (text.length > 120) {
      text = text.substring(0, text.lastIndexOf(' ', 115)) + '...';
    }

    // Extract domain
    let domain;
    try { domain = new URL(url).hostname.replace(/^www\./, ''); }
    catch { domain = 'link'; }

    sources.push({ url, text, domain });
  }

  console.log(`${file}: ${sources.length} external sources`);

  // 2. Build bibliography HTML
  let bibHtml = `\n    <!-- ===== Fonti esterne ===== -->
    <section id="bibliografia" class="mt-12 mb-10 border-t-4 border-zinc-900 pt-8">
      <h2 class="text-xl sm:text-2xl font-bold mb-2" style="font-family:'IBM Plex Mono',monospace;">Fonti esterne</h2>
      <p class="text-sm text-zinc-500 mb-4">${sources.length} fonti in questa sezione.</p>
      <ol class="list-decimal pl-6 space-y-2 text-sm text-zinc-700">\n`;

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    bibHtml += `        <li id="fonte-${i + 1}"><a href="${s.url}" target="_blank" rel="noopener" class="text-blue-700 hover:underline">${s.text}</a> &mdash; <span class="text-zinc-500">${s.domain}</span></li>\n`;
  }

  bibHtml += `      </ol>
    </section>\n`;

  // 3. Remove old bibliography / note sections
  html = html.replace(/\n\s*<!-- ===== Note del capitolo ===== -->[\s\S]*?<\/section>\s*\n/g, '\n');
  html = html.replace(/\n\s*<!-- ===== Fonti esterne ===== -->[\s\S]*?<\/section>\s*\n/g, '\n');
  html = html.replace(/\n\s*<section id="bibliografia"[\s\S]*?<\/section>\s*\n/g, '\n');

  // 4. Insert bibliography before navigation
  const navPoint = html.indexOf('<!-- Navigation -->');
  if (navPoint > 0) {
    html = html.slice(0, navPoint) + bibHtml + '\n    ' + html.slice(navPoint);
  } else {
    const artEnd = html.lastIndexOf('</article>');
    if (artEnd > 0) {
      html = html.slice(0, artEnd) + '\n' + bibHtml + '\n    ' + html.slice(artEnd);
    }
  }

  fs.writeFileSync(file, html, 'utf-8');
}

console.log('\nDone — all bibliographies rebuilt as Fonti esterne with anchor IDs.');
