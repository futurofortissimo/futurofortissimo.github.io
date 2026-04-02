#!/usr/bin/env node
/**
 * build_epub.mjs
 * Converts the 5 enriched chapter HTML files into a single EPUB.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { EPub } = require('epub-gen-memory');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Extract just the <article> content from each HTML file
function extractContent(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');

  // Extract content between <main> and </main>
  const mainStart = html.indexOf('<main');
  const mainEnd = html.indexOf('</main>');
  if (mainStart === -1 || mainEnd === -1) {
    console.error('Could not find <main> in', htmlPath);
    return html;
  }

  let content = html.slice(mainStart, mainEnd + '</main>'.length);

  // Remove the header card (brutal-card accent-bar), nav, and newsletter CTA
  // Keep only the <article> part
  const articleStart = content.indexOf('<article');
  const articleEnd = content.indexOf('</article>');
  if (articleStart !== -1 && articleEnd !== -1) {
    content = content.slice(articleStart, articleEnd + '</article>'.length);
  }

  // Convert .fc spans to inline links (since JS won't run in EPUB)
  // Load canonical map (proven sitemap URLs) as primary source
  const canonical = JSON.parse(readFileSync(join(ROOT, 'canonical_substack_map.json'), 'utf8'));

  // Build fallback map from newsletter_data.json
  const nlRaw = readFileSync(join(ROOT, 'newsletter_data.json'), 'utf8');
  const nlMap = {};
  const reNL = /"buttonLabel":\s*"([^"]+)"[\s\S]*?"substackLink":\s*"([^"]+)"/g;
  let mm;
  while ((mm = reNL.exec(nlRaw)) !== null) {
    const ffm = mm[1].match(/ff\.(\d+)/);
    if (ffm && !nlMap[ffm[1]]) nlMap[ffm[1]] = mm[2];
  }

  // Replace <span class="fc">... ff.N ...</span> with <a href="substack-url">...</a>
  // Priority: canonical (proven) > newsletter_data > generic fallback
  content = content.replace(/<span class="fc">([\s\S]*?)<\/span>/g, (match, inner) => {
    const ffMatch = inner.match(/ff\.(\d+)/);
    if (ffMatch) {
      const num = ffMatch[1];
      const url = canonical[num] || nlMap[num] || `https://fortissimo.substack.com/p/ff${num}`;
      return `<a href="${url}" style="font-family:monospace;font-size:0.8em;font-weight:bold;color:#4a90e2;text-decoration:none;">${inner.trim()}</a>`;
    }
    return match;
  });

  // Remove images (EPUB readers have limited image support for webp/data URIs)
  content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, '');
  content = content.replace(/<img[^>]*\/?>/g, '');

  // Inline basic styles for EPUB compatibility
  content = content
    .replace(/class="drop-cap"/g, '')
    .replace(/class="note-highlight"/g, 'style="background:rgba(74,144,226,0.22);padding:0 2px;"')
    .replace(/class="sep"/g, 'style="height:2px;background:linear-gradient(90deg,#4a90e2,transparent);margin:2em 0;"')
    .replace(/class="prose max-w-none"/g, '')
    .replace(/class="prose"/g, '');

  return content;
}

// Chapter metadata — subchapter pages (split from monolithic chapters)
const chapters = [
  {
    title: '🌿 1.1 — Mobilità e Città',
    file: 'book/chapter-01-mobilita.html',
  },
  {
    title: '🌿 1.2 — Ambiente ed Energia',
    file: 'book/chapter-01-ambiente.html',
  },
  {
    title: '🌿 1.3 — Cibo e Fashion',
    file: 'book/chapter-01-cibo.html',
  },
  {
    title: '💻 2.1 — Robotica e AI',
    file: 'book/chapter-02-robotica.html',
  },
  {
    title: '💻 2.2 — Metaverso e Criptovalute',
    file: 'book/chapter-02-metaverso.html',
  },
  {
    title: '💻 2.3 — Prodotti di consumo',
    file: 'book/chapter-02-prodotti.html',
  },
  {
    title: '❤️ 3.1 — Psicologia e Wellbeing',
    file: 'book/chapter-03-psicologia.html',
  },
  {
    title: '❤️ 3.2 — Alimentazione e Sport',
    file: 'book/chapter-03-alimentazione.html',
  },
  {
    title: '❤️ 3.3 — Cultura e Demografia',
    file: 'book/chapter-03-cultura.html',
  },
];

async function buildEpub() {
  console.log('Building EPUB...');

  const epubChapters = chapters.map(ch => {
    console.log(`  Processing: ${ch.title}`);
    const content = extractContent(join(ROOT, ch.file));
    return {
      title: ch.title,
      content: content,
    };
  });

  const options = {
    title: 'Futuro Fortissimo — Cinque Macro Temi',
    author: 'Michele Merelli',
    publisher: 'Futuro Fortissimo',
    description: 'Natura, Tecnologia, Società, Letture e Note: cinque macro temi esplorati attraverso 140+ newsletter e 563 note dal corpus di Futuro Fortissimo.',
    lang: 'it',
    tocTitle: 'Indice',
    css: `
      body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.7; color: #0a0a0a; }
      h1, h2, h3 { font-family: 'Courier New', monospace; letter-spacing: 0.03em; }
      h2 { border-bottom: 3px solid #4a90e2; padding-bottom: 8px; margin-top: 2em; }
      p { margin-bottom: 1.1em; font-size: 1em; line-height: 1.75; }
      blockquote { border-left: 4px solid #4a90e2; padding: 12px 20px; margin: 1.5em 0; background: #f8fafc; font-style: italic; }
      a { color: #4a90e2; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .note-highlight, [style*="background:rgba"] { background: rgba(74,144,226,0.22); padding: 0 2px; }
    `,
  };

  try {
    const epubBuffer = await new EPub(options, epubChapters).genEpub();
    const outPath = join(ROOT, 'book', 'futuro-fortissimo-tre-macro-temi.epub');
    writeFileSync(outPath, epubBuffer);
    console.log(`\nEPUB written to: ${outPath}`);
    console.log(`Size: ${(epubBuffer.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error('EPUB generation failed:', err);
    process.exit(1);
  }
}

buildEpub();
