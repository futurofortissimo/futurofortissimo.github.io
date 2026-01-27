#!/usr/bin/env node
/**
 * Generate static book outline pages from generated/book/outline.json
 *
 * Output:
 * - book/index.html
 * - book/chapter-01.html ... chapter-14
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const outlinePath = path.join(ROOT, 'generated', 'book', 'outline.json');
const outDir = path.join(ROOT, 'book');

const SITE_ORIGIN = 'https://futurofortissimo.github.io';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function pageShell({
  lang = 'it',
  title,
  description,
  canonical,
  ogImage = `${SITE_ORIGIN}/logo.png`,
  bodyHtml,
  jsonLd,
}) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonical);

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />

  <link rel="canonical" href="${safeCanonical}" />

  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${safeCanonical}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <link rel="icon" href="/favicon.ico" />

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=IBM+Plex+Mono:wght@600;700&display=swap" rel="stylesheet">

  <style>
    :root{--ink:#0a0a0a;}
    body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial; color:var(--ink);}
    .mono{font-family:"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; letter-spacing:.06em; text-transform:uppercase;}
  </style>

  ${jsonLd ? `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>` : ''}
</head>
<body class="bg-zinc-50">
  <header class="border-b border-zinc-200 bg-white">
    <div class="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-3">
      <div>
        <div class="mono text-xs text-zinc-500">Futuro Fortissimo — book</div>
        <div class="text-xl font-extrabold tracking-tight">${safeTitle}</div>
      </div>
      <nav class="flex gap-3 text-sm">
        <a data-nav="1" class="underline" href="/index.html">Home</a>
        <a data-nav="1" class="underline" href="/book/">Libro</a>
      </nav>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    ${bodyHtml}
  </main>

  <script src="/analytics.js"></script>
  <script>
    // Track page view (provider-agnostic). Implemented in analytics.js
    if (window.ffTrackPage) window.ffTrackPage();
  </script>
</body>
</html>`;
}

function writeFile(fp, content) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
}

function main() {
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

  const chapters = outline.chapters || [];

  // index page
  const bookCanonical = `${SITE_ORIGIN}/book/`;
  const bookDesc = 'Outline in 14 capitoli: un percorso di lettura su AI, attenzione, società, natura, corpo e sovranità digitale.';

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: outline.title || 'Futuro Fortissimo — 14 capitoli',
    inLanguage: 'it',
    url: bookCanonical,
    hasPart: chapters.map((c) => ({
      '@type': 'Chapter',
      name: c.title,
      position: c.n,
      url: `${SITE_ORIGIN}/book/chapter-${pad2(c.n)}.html`,
    })),
  };

  const listHtml = `
  <section class="rounded-xl border border-zinc-200 bg-white p-5">
    <p class="text-sm text-zinc-700">${escapeHtml(bookDesc)}</p>
    <div class="mono text-xs text-zinc-500 mt-3">generated ${escapeHtml(outline.generatedAt || '')}</div>
  </section>

  <section class="mt-6 grid gap-4">
    ${chapters.map((c) => {
      const href = `/book/chapter-${pad2(c.n)}.html`;
      return `
      <article class="rounded-xl border border-zinc-200 bg-white p-5">
        <div class="mono text-xs text-zinc-500">Capitolo ${pad2(c.n)}</div>
        <h2 class="text-lg font-extrabold tracking-tight mt-1">${escapeHtml(c.title)}</h2>
        <p class="text-sm text-zinc-700 mt-2">${escapeHtml(c.thesis || '')}</p>
        <div class="mt-3 flex items-center justify-between gap-3">
          <a class="underline font-semibold" data-track="chapter_open" href="${href}">Apri capitolo</a>
          <div class="mono text-[11px] text-zinc-500">refs: ${(c.refs || []).length}</div>
        </div>
      </article>`;
    }).join('')}
  </section>

  <section class="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
    <h2 class="text-base font-bold">Note</h2>
    <ul class="list-disc pl-5 mt-2 text-sm text-zinc-700 space-y-1">
      <li>Queste pagine sono scaffolding statico: utili per SEO, condivisione e navigazione.</li>
      <li>In futuro possono diventare un indice “vivo” con estratti e link ai subcapitoli.</li>
    </ul>
  </section>
  `;

  writeFile(
    path.join(outDir, 'index.html'),
    pageShell({
      title: 'Libro — 14 capitoli (outline)',
      description: bookDesc,
      canonical: bookCanonical,
      bodyHtml: listHtml,
      jsonLd: bookJsonLd,
    })
  );

  // chapter pages
  for (const c of chapters) {
    const canonical = `${SITE_ORIGIN}/book/chapter-${pad2(c.n)}.html`;
    const desc = c.thesis || bookDesc;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Chapter',
      name: c.title,
      position: c.n,
      isPartOf: {
        '@type': 'Book',
        name: outline.title || 'Futuro Fortissimo — 14 capitoli',
        url: bookCanonical,
      },
      url: canonical,
      inLanguage: 'it',
      description: desc,
    };

    const bodyHtml = `
    <section class="rounded-xl border border-zinc-200 bg-white p-5">
      <div class="mono text-xs text-zinc-500">Capitolo ${pad2(c.n)} / 14</div>
      <h1 class="text-2xl font-extrabold tracking-tight mt-1">${escapeHtml(c.title)}</h1>
      <p class="text-sm text-zinc-700 mt-3">${escapeHtml(desc)}</p>

      ${(c.refs && c.refs.length)
        ? `
        <div class="mt-5">
          <div class="mono text-xs text-zinc-500">Riferimenti (placeholder)</div>
          <ul class="mt-2 grid gap-2 text-sm">
            ${(c.refs || []).map((r) => `<li class="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2"><code>${escapeHtml(r)}</code></li>`).join('')}
          </ul>
          <p class="text-xs text-zinc-500 mt-3">TODO: collegare questi refs ai subcapitoli/URL reali (ff.xx.yy) e generare estratti.</p>
        </div>`
        : ''}

      <div class="mt-6 flex flex-wrap gap-3">
        ${c.n > 1 ? `<a class="underline" data-track="chapter_prev" href="/book/chapter-${pad2(c.n - 1)}.html">← Precedente</a>` : ''}
        <a class="underline" data-track="chapter_index" href="/book/">Indice capitoli</a>
        ${c.n < chapters.length ? `<a class="underline" data-track="chapter_next" href="/book/chapter-${pad2(c.n + 1)}.html">Successivo →</a>` : ''}
      </div>
    </section>
    `;

    writeFile(
      path.join(outDir, `chapter-${pad2(c.n)}.html`),
      pageShell({
        title: `Capitolo ${pad2(c.n)} — ${c.title}`,
        description: desc,
        canonical,
        bodyHtml,
        jsonLd,
      })
    );
  }

  console.log(`Generated ${chapters.length + 1} pages in ${path.relative(ROOT, outDir)}/`);
}

main();
