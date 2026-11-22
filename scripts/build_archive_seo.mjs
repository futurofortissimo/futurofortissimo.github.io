#!/usr/bin/env node
/**
 * build_archive_seo.mjs — Generates static per-issue SEO pages under archivio/,
 * archivio/index.html, updates index.html Blog+WebSite JSON-LD, and rebuilds sitemap.xml.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawData } from '../data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://futurofortissimo.github.io';
const ARCHIVIO_DIR = path.join(ROOT, 'archivio');
const TODAY = new Date().toISOString().slice(0, 10);

fs.mkdirSync(ARCHIVIO_DIR, { recursive: true });

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function safeJsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
}

function isLinkValid(text = '', url = '') {
  const lt = (text || '').toLowerCase();
  const lu = (url || '').toLowerCase();
  if (!text || !url) return false;
  if (lt.includes('whatsapp') || lt.includes('offrimi') || lt.includes('caffè') || lt.includes('caffe')) return false;
  if (lt.includes('micmer') || lt.includes('iscriviti') || lt.includes('supportare questo progetto')) return false;
  if (lt.trim() === '☕' || lt.trim() === '❤️' || lt.trim() === '.') return false;
  if (lu.includes('paypal') || lu.includes('whatsapp')) return false;
  return true;
}

function issueSlugOf(ch, idx) {
  const m = /ff\.(\d+)/i.exec(ch.title || '');
  if (m) return `ff-${m[1]}`;
  const slug = (ch.url || '').replace(/\/$/, '').split('/').pop();
  return slug || `issue-${idx}`;
}

function issueNumOf(ch) {
  const m = /ff\.(\d+)/i.exec(ch.title || '');
  return m ? Number(m[1]) : -1;
}

function makeDescription(ch) {
  const base = (ch.subtitle || '').trim();
  if (base.length >= 60) {
    return base.length <= 158 ? base : base.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  }
  const firstProse = (ch.subchapters || [])
    .map((s) => (s.content || '').replace(/\s+/g, ' ').trim())
    .find(Boolean) || '';
  const combined = [base, firstProse].filter(Boolean).join(' — ');
  if (!combined) return `Numero dell'archivio Futuro Fortissimo: ${ch.title || ''}`.trim();
  return combined.length <= 158 ? combined : combined.slice(0, 155).replace(/\s+\S*$/, '') + '…';
}

function firstImageOf(ch) {
  for (const sub of ch.subchapters || []) {
    for (const img of sub.images || []) {
      if (img?.src && /^https?:\/\//.test(img.src)) return img.src;
    }
  }
  return `${SITE}/logo.png`;
}

// Deduplicate & sort newest-first (keeping special issues in place relative to ff numbers)
const seenUrls = new Set();
const issues = [];
rawData.forEach((ch, idx) => {
  const u = (ch?.url || '').replace(/\/$/, '');
  if (!u || seenUrls.has(u)) return;
  seenUrls.add(u);
  issues.push({
    ...ch,
    slug: issueSlugOf(ch, idx),
    ffNum: issueNumOf(ch),
  });
});

// Ensure newest ff numbers appear first while keeping non-numbered issues after numbered ones in original relative order
issues.sort((a, b) => {
  if (a.ffNum >= 0 && b.ffNum >= 0) return b.ffNum - a.ffNum;
  if (a.ffNum >= 0) return -1;
  if (b.ffNum >= 0) return 1;
  return 0;
});

const SHARED_STYLES = `
  :root {
    --ff-blue: #4a90e2;
    --ff-red: #d0021b;
    --ff-yellow: #f5a623;
    --ff-green: #2ecc71;
    --ff-black: #0a0a0a;
    --ff-grid: rgba(0, 0, 0, 0.03);
  }
  body {
    font-family: 'Inter', sans-serif;
    background-color: #fdfdfd;
    color: var(--ff-black);
    min-height: 100vh;
    line-height: 1.65;
    position: relative;
  }
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--ff-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--ff-grid) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: -1;
  }
  h1, h2, h3, h4, .font-heading {
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .brutal-card {
    border: 4px solid var(--ff-black);
    background: #ffffff;
    box-shadow: 6px 6px 0 var(--ff-black);
    padding: 24px;
  }
  .brutal-shadow { box-shadow: 4px 4px 0 var(--ff-black); }
  .border-3 { border-width: 3px !important; }
  .accent-bar { position: relative; }
  .accent-bar::before {
    content: '';
    position: absolute;
    top: -4px; left: -4px; right: -4px;
    height: 10px;
    background: var(--ff-blue);
  }
  .accent-yellow::before { background: var(--ff-yellow); }
  .accent-green::before { background: var(--ff-green); }
  .ff-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .ff-button {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .ff-lang-bar {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    background: var(--ff-black);
    color: #fff;
  }
  .ff-lang-bar a { color: rgba(255,255,255,0.65); text-decoration: none; padding: 6px 8px; }
  .ff-lang-bar a:hover, .ff-lang-bar a[aria-current="page"] { color: #fff; }
  .ff-lang-bar a[aria-current="page"] { border-bottom: 2px solid var(--ff-yellow); }
  .no-round, .no-round * { border-radius: 0 !important; }
  @media (max-width: 640px) {
    .brutal-card { border-width: 2px; box-shadow: 3px 3px 0 var(--ff-black); padding: 16px; }
  }
`;

function navHtml(active = 'archivio') {
  const link = (href, label, key) => {
    const isCurrent = active === key;
    return `<a href="${href}"${isCurrent ? ' aria-current="page"' : ''} class="px-3 py-2 border-2 border-black ff-button ${isCurrent ? 'bg-[var(--ff-yellow)] text-black' : 'bg-white text-black hover:-translate-y-0.5 transition-transform'} whitespace-nowrap">${label}</a>`;
  };
  return `
  <nav class="ff-lang-bar" aria-label="Language">
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-2 px-4 py-1">
      <a href="/" style="color:#fff;">FUTURO FORTISSIMO</a>
      <div class="flex items-center gap-1">
        <a href="https://futurofortissimo.github.io/" aria-current="page">IT</a>
        <span style="color:rgba(255,255,255,0.3);">/</span>
        <a href="https://translate.google.com/translate?sl=it&tl=en&u=https://futurofortissimo.github.io/" rel="noopener">EN</a>
        <span style="color:rgba(255,255,255,0.3);">/</span>
        <a href="https://translate.google.com/translate?sl=it&tl=hi&u=https://futurofortissimo.github.io/" rel="noopener">HI</a>
      </div>
    </div>
  </nav>
  <header class="max-w-5xl mx-auto px-4 pt-6">
    <nav aria-label="Navigazione principale" class="flex flex-wrap items-center gap-2 pb-4 border-b-3 border-black">
      ${link('/', '🏠 Home', 'home')}
      ${link('/archivio/', '🗂 Archivio', 'archivio')}
      ${link('/libri/', '📚 Libri', 'libri')}
      ${link('/book/', '📖 Il Libro', 'book')}
      ${link('/book/ffxy-index.html', '🔢 ff.x.y', 'ffxy')}
      ${link('/themes.html', '🧭 Temi', 'themes')}
      ${link('/connections.html', '🔗 Connessioni', 'connections')}
      ${link('/note.html', '📝 Note', 'note')}
      <a href="https://fortissimo.substack.com/subscribe" target="_blank" rel="noopener noreferrer" class="ml-auto px-3 py-2 border-2 border-black bg-[var(--ff-green)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform whitespace-nowrap">📩 Iscriviti</a>
    </nav>
  </header>`;
}

const HEAD_EXTRAS = `
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/favicon.ico" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NQ7MQR0VL8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NQ7MQR0VL8');
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap" rel="stylesheet" />
  <style>${SHARED_STYLES}</style>
`;

// 1. Generate each issue page
issues.forEach((ch, idx) => {
  const prevIssue = idx + 1 < issues.length ? issues[idx + 1] : null; // older
  const nextIssue = idx - 1 >= 0 ? issues[idx - 1] : null; // newer
  const pageUrl = `${SITE}/archivio/${ch.slug}.html`;
  const titleText = `${ch.title} — Futuro Fortissimo`;
  const desc = makeDescription(ch);
  const ogImage = firstImageOf(ch);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ch.title,
    description: desc,
    image: [ogImage],
    inLanguage: 'it',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    url: pageUrl,
    sameAs: ch.url,
    author: { '@type': 'Person', name: 'Michele Merelli', url: 'https://fortissimo.substack.com/' },
    publisher: {
      '@type': 'Organization',
      name: 'Futuro Fortissimo',
      url: `${SITE}/`,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'Futuro Fortissimo — Archivio',
      url: `${SITE}/`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Archivio', item: `${SITE}/archivio/` },
      { '@type': 'ListItem', position: 3, name: ch.title, item: pageUrl },
    ],
  };

  const keypointsHtml = Array.isArray(ch.keypoints) && ch.keypoints.length
    ? `<ul class="mt-4 space-y-2 border-l-4 border-black pl-4 text-sm sm:text-base font-medium">
        ${ch.keypoints.map((k) => `<li>• ${escapeHtml(k)}</li>`).join('\n        ')}
      </ul>`
    : '';

  const subchaptersHtml = (ch.subchapters || []).map((sub, sIdx) => {
    const subMatch = /ff\.(\d+)\.(\d+)/i.exec(sub.title || '');
    const anchor = subMatch ? `ff-${subMatch[1]}-${subMatch[2]}` : `sec-${sIdx + 1}`;
    const validRefs = [];
    const seenRef = new Set();
    [...(sub.references || []), ...(sub.connections || [])].forEach((ref) => {
      if (!isLinkValid(ref?.text, ref?.url)) return;
      if (seenRef.has(ref.url)) return;
      seenRef.add(ref.url);
      validRefs.push(ref);
    });

    const imgsHtml = (sub.images || [])
      .filter((img) => img?.src)
      .map((img) => `<figure class="mt-4 border-3 border-black bg-white p-2">
          <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || sub.title)}" loading="lazy" class="w-full max-h-[520px] object-contain mx-auto" />
          ${img.caption ? `<figcaption class="mt-2 text-xs font-mono text-black/70">${escapeHtml(img.caption)}</figcaption>` : ''}
        </figure>`)
      .join('\n');

    const refsHtml = validRefs.length
      ? `<div class="mt-4 pt-3 border-t-2 border-black/15">
          <div class="ff-eyebrow text-black/70 mb-2">Fonti e link citati (${validRefs.length})</div>
          <div class="flex flex-wrap gap-2">
            ${validRefs.map((r) => {
              const isAmzn = /amzn\.|amazon\./i.test(r.url);
              const badge = isAmzn ? '📚 ' : '↗ ';
              return `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-2.5 py-1.5 border-2 border-black ${isAmzn ? 'bg-[var(--ff-yellow)]' : 'bg-white'} text-xs font-mono font-bold hover:underline">${badge}${escapeHtml(r.text)}</a>`;
            }).join('\n            ')}
          </div>
        </div>`
      : '';

    const paragraphs = (sub.content || '')
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p class="text-base leading-relaxed text-black/90">${escapeHtml(p)}</p>`)
      .join('\n        ');

    return `<section id="${anchor}" class="brutal-card no-round space-y-3 scroll-mt-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <h2 class="text-lg sm:text-xl font-bold text-black">${escapeHtml(sub.title || `Sezione ${sIdx + 1}`)}</h2>
        ${sub.link ? `<a href="${escapeHtml(sub.link)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 border-2 border-black bg-white ff-button text-xs hover:bg-[var(--ff-yellow)]">Substack ↗</a>` : ''}
      </div>
      <div class="space-y-3">
        ${paragraphs}
      </div>
      ${imgsHtml}
      ${refsHtml}
    </section>`;
  }).join('\n\n    ');

  const tocHtml = (ch.subchapters || []).length > 1
    ? `<nav aria-label="Sezioni del numero" class="mt-5 pt-4 border-t-2 border-black/15">
        <div class="ff-eyebrow text-black/70 mb-2">In questo numero</div>
        <div class="flex flex-wrap gap-2">
          ${(ch.subchapters || []).map((sub, sIdx) => {
            const subMatch = /ff\.(\d+)\.(\d+)/i.exec(sub.title || '');
            const anchor = subMatch ? `ff-${subMatch[1]}-${subMatch[2]}` : `sec-${sIdx + 1}`;
            return `<a href="#${anchor}" class="px-2.5 py-1 border-2 border-black bg-gray-50 hover:bg-[var(--ff-yellow)] text-xs font-mono font-bold">${escapeHtml(sub.title)}</a>`;
          }).join('\n          ')}
        </div>
      </nav>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="it" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(titleText)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta name="author" content="Michele Merelli" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />
  <link rel="alternate" type="application/atom+xml" title="Futuro Fortissimo Feed" href="/feed.xml" />

  <meta property="og:site_name" content="Futuro Fortissimo" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(titleText)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(titleText)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <script type="application/ld+json">${safeJsonLd(articleLd)}</script>
  <script type="application/ld+json">${safeJsonLd(breadcrumbLd)}</script>
  ${HEAD_EXTRAS}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml('archivio')}

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <article class="brutal-card accent-bar accent-blue no-round">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span class="ff-eyebrow text-black/70">Archivio Futuro Fortissimo</span>
        <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs hover:-translate-y-0.5 transition-transform">Leggi originale su Substack ↗</a>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-black">${escapeHtml(ch.title)}</h1>
      ${ch.subtitle ? `<p class="mt-3 text-base sm:text-lg text-black/80 font-medium">${escapeHtml(ch.subtitle)}</p>` : ''}
      ${keypointsHtml}
      ${tocHtml}
    </article>

    ${subchaptersHtml}

    <section class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">Ricevi i nuovi numeri di Futuro Fortissimo</h2>
        <p class="text-sm text-black/80 mt-1">Ogni uscita su tecnologia, AI, natura e società direttamente via email su Substack.</p>
      </div>
      <a href="https://fortissimo.substack.com/subscribe" target="_blank" rel="noopener noreferrer" class="px-5 py-3 border-3 border-black bg-[var(--ff-yellow)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform whitespace-nowrap">📩 Iscriviti gratis ↗</a>
    </section>

    <nav aria-label="Numeri adiacenti" class="flex flex-wrap items-center justify-between gap-3 pt-2">
      ${prevIssue ? `<a href="/archivio/${escapeHtml(prevIssue.slug)}.html" class="px-4 py-2.5 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-0.5 transition-transform">← ${escapeHtml(prevIssue.title)}</a>` : '<span></span>'}
      ${nextIssue ? `<a href="/archivio/${escapeHtml(nextIssue.slug)}.html" class="px-4 py-2.5 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-0.5 transition-transform">${escapeHtml(nextIssue.title)} →</a>` : '<span></span>'}
    </nav>
  </main>

  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ARCHIVIO_DIR, `${ch.slug}.html`), html, 'utf-8');
});

// 2. Generate archivio/index.html
const archivioIndexLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Archivio completo — Futuro Fortissimo',
  description: `Indice completo di tutti i ${issues.length} numeri pubblicati su Futuro Fortissimo.`,
  url: `${SITE}/archivio/`,
  inLanguage: 'it',
  isPartOf: { '@type': 'Blog', name: 'Futuro Fortissimo', url: `${SITE}/` },
  author: { '@type': 'Person', name: 'Michele Merelli' },
};

const archivioIndexHtml = `<!DOCTYPE html>
<html lang="it" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Archivio completo (${issues.length} numeri) — Futuro Fortissimo</title>
  <meta name="description" content="Tutti i ${issues.length} numeri di Futuro Fortissimo con riassunti, sezioni ff.x.y, fonti e link diretti." />
  <meta name="author" content="Michele Merelli" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="${SITE}/archivio/" />
  <link rel="alternate" type="application/atom+xml" title="Futuro Fortissimo Feed" href="/feed.xml" />

  <meta property="og:site_name" content="Futuro Fortissimo" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Archivio completo — Futuro Fortissimo" />
  <meta property="og:description" content="Tutti i ${issues.length} numeri di Futuro Fortissimo indicizzati per lettura e ricerca." />
  <meta property="og:url" content="${SITE}/archivio/" />
  <meta property="og:image" content="${SITE}/logo.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Archivio completo — Futuro Fortissimo" />
  <meta name="twitter:description" content="Tutti i ${issues.length} numeri di Futuro Fortissimo indicizzati per lettura e ricerca." />
  <meta name="twitter:image" content="${SITE}/logo.png" />

  <script type="application/ld+json">${safeJsonLd(archivioIndexLd)}</script>
  ${HEAD_EXTRAS}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml('archivio')}

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <section class="brutal-card accent-bar accent-yellow no-round space-y-4">
      <div class="ff-eyebrow text-black/70">Indice completo · ${issues.length} numeri</div>
      <h1 class="text-2xl sm:text-3xl font-bold">Archivio Futuro Fortissimo</h1>
      <p class="text-base text-black/80">Ogni numero con la sua pagina dedicata, i sottocapitoli <code>ff.x.y</code>, le fonti citate e il link all'originale su Substack.</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <input id="q" type="search" placeholder="Filtra numeri per titolo, sottotitolo o codice (es. ff.158, Riemann, AI)..." class="flex-1 px-4 py-2.5 border-3 border-black bg-white text-sm font-medium focus:outline-none" />
        <a href="https://fortissimo.substack.com/subscribe" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 border-3 border-black bg-[var(--ff-yellow)] ff-button brutal-shadow text-center">📩 Iscriviti ↗</a>
      </div>
    </section>

    <div id="list" class="space-y-4">
      ${issues.map((ch) => {
        const subLinks = (ch.subchapters || [])
          .map((s) => `<span class="inline-block px-2 py-0.5 border border-black/30 bg-gray-50 text-xs font-mono">${escapeHtml(s.title)}</span>`)
          .join(' ');
        const searchBlob = escapeHtml(`${ch.title} ${ch.subtitle || ''} ${(ch.subchapters || []).map((s) => s.title).join(' ')}`.toLowerCase());
        return `<article class="brutal-card no-round space-y-2 issue-item" data-search="${searchBlob}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <h2 class="text-lg font-bold"><a href="/archivio/${escapeHtml(ch.slug)}.html" class="hover:underline">${escapeHtml(ch.title)}</a></h2>
            <div class="flex gap-2">
              <a href="/archivio/${escapeHtml(ch.slug)}.html" class="px-2.5 py-1 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs">Apri scheda →</a>
              <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 border-2 border-black bg-white ff-button text-xs">Substack ↗</a>
            </div>
          </div>
          ${ch.subtitle ? `<p class="text-sm text-black/80">${escapeHtml(ch.subtitle)}</p>` : ''}
          ${subLinks ? `<div class="flex flex-wrap gap-1.5 pt-1">${subLinks}</div>` : ''}
        </article>`;
      }).join('\n      ')}
    </div>
  </main>

  <script>
    const q = document.getElementById('q');
    const items = Array.from(document.querySelectorAll('.issue-item'));
    q.addEventListener('input', () => {
      const term = q.value.trim().toLowerCase();
      items.forEach((el) => {
        el.style.display = !term || el.dataset.search.includes(term) ? '' : 'none';
      });
    });
  </script>
  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ARCHIVIO_DIR, 'index.html'), archivioIndexHtml, 'utf-8');

// 3. Update index.html JSON-LD (WebSite + Blog)
const indexPath = path.join(ROOT, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');
const homeLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Futuro Fortissimo',
    alternateName: 'FF',
    url: `${SITE}/`,
    description: 'Archivio tipografico di Futuro Fortissimo: letture, note e percorsi su AI, attenzione, società, natura.',
    inLanguage: ['it', 'en', 'hi'],
    author: { '@type': 'Person', name: 'Michele Merelli', url: 'https://fortissimo.substack.com' },
    publisher: { '@type': 'Person', name: 'Michele Merelli' },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Futuro Fortissimo — Archivio Newsletter',
    description: `Archivio completo dei ${issues.length} numeri della newsletter Futuro Fortissimo di Michele Merelli.`,
    url: `${SITE}/archivio/`,
    inLanguage: 'it',
    author: { '@type': 'Person', name: 'Michele Merelli', url: 'https://fortissimo.substack.com' },
    blogPost: issues.slice(0, 15).map((ch) => ({
      '@type': 'BlogPosting',
      headline: ch.title,
      description: makeDescription(ch),
      url: `${SITE}/archivio/${ch.slug}.html`,
      sameAs: ch.url,
      author: { '@type': 'Person', name: 'Michele Merelli' },
    })),
  },
];

const ldRegex = /<!-- JSON-LD Structured Data -->[\s\S]*?<\/script>(?:\s*<script type="application\/ld\+json">[\s\S]*?<\/script>)*/;
const replacementLd = `<!-- JSON-LD Structured Data -->\n    <script type="application/ld+json">\n    ${safeJsonLd(homeLd)}\n    </script>`;
if (ldRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(ldRegex, replacementLd);
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');
}

// 4. Rebuild sitemap.xml cleanly
const bookFiles = fs.readdirSync(path.join(ROOT, 'book'))
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .sort();

const libriFiles = fs.readdirSync(path.join(ROOT, 'libri'))
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .sort();

const staticEntries = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily', alternates: [
    { hreflang: 'it', href: `${SITE}/` },
    { hreflang: 'en', href: `${SITE}/en/` },
    { hreflang: 'hi', href: `${SITE}/hi/` },
    { hreflang: 'x-default', href: `${SITE}/en/` },
  ]},
  { loc: `${SITE}/archivio/`, priority: '0.9', changefreq: 'daily' },
  { loc: `${SITE}/libri/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE}/natura/`, priority: '0.8', changefreq: 'weekly', alternates: [
    { hreflang: 'it', href: `${SITE}/natura/` },
    { hreflang: 'en', href: `${SITE}/en/nature/` },
    { hreflang: 'hi', href: `${SITE}/hi/prakriti/` },
    { hreflang: 'x-default', href: `${SITE}/en/nature/` },
  ]},
  { loc: `${SITE}/tecnologia/`, priority: '0.8', changefreq: 'weekly', alternates: [
    { hreflang: 'it', href: `${SITE}/tecnologia/` },
    { hreflang: 'en', href: `${SITE}/en/technology/` },
    { hreflang: 'hi', href: `${SITE}/hi/taknik/` },
    { hreflang: 'x-default', href: `${SITE}/en/technology/` },
  ]},
  { loc: `${SITE}/societa/`, priority: '0.8', changefreq: 'weekly', alternates: [
    { hreflang: 'it', href: `${SITE}/societa/` },
    { hreflang: 'en', href: `${SITE}/en/society/` },
    { hreflang: 'hi', href: `${SITE}/hi/samaj/` },
    { hreflang: 'x-default', href: `${SITE}/en/society/` },
  ]},
  { loc: `${SITE}/note.html`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${SITE}/themes.html`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${SITE}/connections.html`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${SITE}/strumenti.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/book/`, priority: '0.9', changefreq: 'weekly' },
  ...bookFiles.map((f) => ({ loc: `${SITE}/book/${f}`, priority: /^chapter-\d+\.html$/.test(f) ? '0.8' : '0.6', changefreq: 'monthly' })),
  ...libriFiles.map((f) => ({ loc: `${SITE}/libri/${f}`, priority: '0.7', changefreq: 'monthly' })),
  { loc: `${SITE}/en/`, priority: '0.7', changefreq: 'weekly' },
  { loc: `${SITE}/en/note.html`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/themes.html`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/connections.html`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/nature/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/technology/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/society/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/hi/`, priority: '0.6', changefreq: 'weekly' },
  { loc: `${SITE}/hi/note.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/themes.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/connections.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/prakriti/`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/taknik/`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/samaj/`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/feed.xml`, priority: '0.5', changefreq: 'weekly' },
  ...issues.map((ch) => ({
    loc: `${SITE}/archivio/${ch.slug}.html`,
    priority: ch.ffNum >= 150 ? '0.8' : '0.7',
    changefreq: 'monthly',
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticEntries.map((e) => {
  const alts = (e.alternates || [])
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />`)
    .join('\n');
  return `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${alts ? '\n' + alts : ''}
  </url>`;
}).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✅ Generated ${issues.length} archivio/*.html pages + archivio/index.html + updated index.html JSON-LD + sitemap.xml (${staticEntries.length} URLs)`);
