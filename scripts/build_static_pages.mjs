#!/usr/bin/env node
/**
 * build_static_pages.mjs — SEO + structure for the hand-made / SPA pages, run after build_archive_seo.mjs.
 *
 *  - themes.html, en/themes.html, hi/themes.html  → fully generated, static (crawlable) theme index
 *  - index.html, en/index.html, hi/index.html      → <head> SEO block (title, description, canonical, hreflang,
 *                                                     OG/Twitter, JSON-LD) + static crawlable content inside #root
 *  - connections.html, note.html (it/en/hi), libri/index.html → <head> SEO block
 *  - robots.txt, manifest.webmanifest, 404.html
 * Everything is written between <!-- ff:… --> markers, so the script is idempotent and the daily
 * rss-sync workflow keeps the pages up to date.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, SUBSTACK, L, S } from './i18n_strings.mjs';
import { PAGE_SEO, UI_SEO, SOCIAL } from './seo_strings.mjs';
import {
  LANG_CODES, escapeHtml, safeJsonLd, metaBlock, pwaHead, groupAlternates, websiteLd, breadcrumbLd,
  PERSON, PUBLISHER, DEFAULT_OG, ROBOTS_INDEX, clip,
} from './seo_lib.mjs';
import { THEMES } from './site_themes.mjs';
import { navHtml, headExtras, siteFooter, subscribeCta } from './site_chrome.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');
const write = (rel, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true }); fs.writeFileSync(path.join(ROOT, rel), s, 'utf-8'); };
const INDEX = Object.fromEntries(LANG_CODES.map((lg) => [lg, JSON.parse(read(`assets/site-index-${lg}.json`))]));
const BOOKS = JSON.parse(read('libri/books_cited.json')).books || [];
const BOOKS_I18N = JSON.parse(read('i18n/books.json'));
const N = INDEX.it.length;
const LATEST = INDEX.it.map((r) => r.d).filter(Boolean).sort().pop();
const fileOf = (lang, key) => ({ home: { it: 'index.html', en: 'en/index.html', hi: 'hi/index.html' }, themes: { it: 'themes.html', en: 'en/themes.html', hi: 'hi/themes.html' }, connections: { it: 'connections.html', en: 'en/connections.html', hi: 'hi/connections.html' }, notes: { it: 'note.html', en: 'en/note.html', hi: 'hi/note.html' }, books: { it: 'libri/index.html' } }[key][lang]);
const pathsOf = (key) => Object.fromEntries(LANG_CODES.map((lg) => [lg, L[lg][key]]));

/** <head> SEO block for a page group */
function seoBlock(lang, key, { title, desc, ld = [], type = 'website', image } = {}) {
  const seo = PAGE_SEO[key][lang];
  const t = title || (typeof seo.title === 'function' ? seo.title(N) : seo.title);
  const d = desc || (typeof seo.desc === 'function' ? seo.desc(N) : seo.desc);
  const paths = pathsOf(key === 'notes' ? 'notes' : key);
  const url = `${SITE}${paths[lang]}`;
  return `<!-- ff:seo -->
  ${metaBlock({ lang, title: t, desc: d, url, image: image || DEFAULT_OG, type, robots: ROBOTS_INDEX, alts: groupAlternates(paths) })}
  ${ld.map((x) => `<script type="application/ld+json">${safeJsonLd(x)}</script>`).join('\n  ')}
  ${pwaHead()}
  <!-- /ff:seo -->`;
}

/** remove every legacy SEO tag from <head> and insert the generated block (idempotent) */
function patchHead(rel, block) {
  let h = read(rel);
  const [head, ...rest] = h.split('</head>');
  let hd = head;
  if (hd.includes('<!-- ff:seo -->')) hd = hd.replace(/<!-- ff:seo -->[\s\S]*?<!-- \/ff:seo -->/, '@@FFSEO@@');
  const drop = [
    /[ \t]*<title>[\s\S]*?<\/title>\s*\n?/g,
    /[ \t]*<meta\s+name="(description|author|keywords|robots|theme-color|twitter:[^"]+)"[^>]*>\s*\n?/g,
    /[ \t]*<meta\s+property="(og:[^"]+|article:[^"]+)"[^>]*>\s*\n?/g,
    /[ \t]*<link\s+rel="(canonical|icon|apple-touch-icon|manifest|shortcut icon)"[^>]*>\s*\n?/g,
    /[ \t]*<link\s+rel="alternate"\s+hreflang[^>]*>\s*\n?/g,
    /[ \t]*<link\s+rel="alternate"\s+type="application\/atom\+xml"[^>]*>\s*\n?/g,
    /[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n?/g,
    /[ \t]*<!-- (hreflang[^>]*|JSON-LD[^>]*|\/?ff:hreflang) -->\s*\n?/g,
  ];
  for (const rx of drop) hd = hd.replace(rx, '');
  if (hd.includes('@@FFSEO@@')) hd = hd.replace('@@FFSEO@@', block);
  else hd = hd.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  ${block}`);
  write(rel, [hd, ...rest].join('</head>'));
}

/** replace (or insert after <body…>) a marked region of the body */
function patchRegion(rel, name, content, anchor) {
  let h = read(rel);
  const blk = `<!-- ff:${name} -->\n${content}\n<!-- /ff:${name} -->`;
  const rx = new RegExp(`<!-- ff:${name} -->[\\s\\S]*?<!-- \\/ff:${name} -->`);
  if (rx.test(h)) h = h.replace(rx, blk);
  else if (anchor) h = anchor(h, blk);
  write(rel, h);
}
const issueLd = (lang, r) => ({
  '@type': 'BlogPosting', headline: r.t, url: `${SITE}${r.u}`, inLanguage: lang,
  ...(r.d ? { datePublished: r.d } : {}), ...(r.img ? { image: r.img } : {}), author: { '@id': PERSON['@id'] },
});
const homeLd = (lang) => [
  websiteLd(lang),
  { '@context': 'https://schema.org', ...PUBLISHER },
  { '@context': 'https://schema.org', ...PERSON, jobTitle: 'Author of Futuro Fortissimo' },
  {
    '@context': 'https://schema.org', '@type': 'Blog', '@id': `${SITE}${L[lang].home}#blog`,
    name: `Futuro Fortissimo${lang === 'it' ? '' : lang === 'en' ? ' (English)' : ' (हिन्दी)'}`,
    description: PAGE_SEO.home[lang].desc, url: `${SITE}${L[lang].home}`, inLanguage: lang,
    author: { '@id': PERSON['@id'] }, publisher: { '@id': PUBLISHER['@id'] },
    blogPost: INDEX[lang].slice(0, 10).map((r) => issueLd(lang, r)),
  },
];

// ── 1. Themes pages (static, crawlable) ─────────────────────────────────────
const TH_S = {
  it: { h1: 'I temi di Futuro Fortissimo', intro: 'Otto macro-temi attraversano i numeri della newsletter. Per ogni tema trovi i numeri e le sezioni ff.x.y che ne parlano di più, con link diretti alle pagine dell’archivio.', sections: 'sezioni', more: (n) => `Altri ${n} numeri`, jump: 'Vai al tema', note: 'Classificazione automatica per parole chiave: serve per navigare, non è una tassonomia definitiva.' },
  en: { h1: 'Futuro Fortissimo themes', intro: 'Eight macro-themes run through the newsletter. For each theme you will find the issues and ff.x.y sections that discuss it most, linked to their archive pages.', sections: 'sections', more: (n) => `${n} more issues`, jump: 'Jump to theme', note: 'Automatic keyword classification: meant for browsing, not a definitive taxonomy.' },
  hi: { h1: 'Futuro Fortissimo की थीम', intro: 'न्यूज़लेटर के अंकों में आठ मुख्य थीम बार-बार आती हैं। हर थीम के लिए वे अंक और ff.x.y खंड देखें जो उस पर सबसे ज़्यादा बात करते हैं, संग्रह के पेजों के लिंक के साथ।', sections: 'खंड', more: (n) => `${n} और अंक`, jump: 'थीम पर जाएँ', note: 'कीवर्ड पर आधारित स्वचालित वर्गीकरण: ब्राउज़ करने के लिए, अंतिम वर्गीकरण नहीं।' },
};
const ACCENTS = ['accent-blue', 'accent-red', 'accent-yellow', 'accent-green'];
export function themeStats(lang) {
  return THEMES.map((t) => {
    const rows = INDEX[lang].map((r) => ({ r, secs: r.sec.filter((x) => (x.th || []).includes(t.key)) })).filter((x) => x.secs.length);
    rows.sort((a, b) => b.secs.length - a.secs.length || b.r.n - a.r.n);
    return { t, rows, sections: rows.reduce((a, x) => a + x.secs.length, 0) };
  }).sort((a, b) => b.sections - a.sections);
}
for (const lang of LANG_CODES) {
  const ts = TH_S[lang]; const s = S[lang];
  const stats = themeStats(lang);
  const itLang = (r) => (r.it ? ' lang="it"' : '');
  const issueLi = (lang2, { r, secs }) => `<li class="border-2 border-black bg-white p-3">
            <a href="${r.u}" class="font-bold hover:underline"${itLang(r)}>${escapeHtml(r.t)}</a>
            ${r.d ? `<span class="ml-1 text-xs font-mono text-black/60"><time datetime="${r.d}">${r.d.slice(0, 7)}</time></span>` : ''}
            <ul class="mt-1 text-sm space-y-0.5">${secs.slice(0, 3).map((x) => `<li><a class="underline decoration-black/30 hover:decoration-black" href="${r.u}#${x.a}"${itLang(r)}>${escapeHtml(x.t)}</a></li>`).join('')}</ul>
          </li>`;
  const cards = stats.map(({ t, rows, sections }, i) => `<section id="${t.key}" class="brutal-card accent-bar ${ACCENTS[i % 4]} no-round space-y-3 scroll-mt-24" aria-labelledby="h-${t.key}">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-${t.key}" class="text-lg sm:text-xl font-bold">${t.emoji} ${escapeHtml(t.name[lang])}</h2>
        <span class="text-xs font-mono font-bold border-2 border-black px-2 py-0.5">${escapeHtml(UI_SEO[lang].issuesOfTheme(rows.length))} · ${sections} ${escapeHtml(ts.sections)}</span>
      </div>
      <p class="text-sm sm:text-base text-black/80">${escapeHtml(t.blurb[lang])}</p>
      <ul class="grid gap-3 sm:grid-cols-2">
          ${rows.slice(0, 8).map((x) => issueLi(lang, x)).join('\n          ')}
      </ul>
      ${rows.length > 8 ? `<details class="border-2 border-black bg-gray-50 p-3"><summary class="ff-button cursor-pointer min-h-[44px] flex items-center">${escapeHtml(ts.more(rows.length - 8))}</summary>
        <ul class="mt-2 grid gap-1 sm:grid-cols-2 text-sm">${rows.slice(8).map(({ r }) => `<li><a class="underline" href="${r.u}"${itLang(r)}>${escapeHtml(r.t)}</a></li>`).join('')}</ul>
      </details>` : ''}
    </section>`).join('\n\n    ');
  const url = `${SITE}${L[lang].themes}`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: ts.h1, description: PAGE_SEO.themes[lang].desc, url, inLanguage: lang, isPartOf: { '@id': `${SITE}/#website` }, author: PERSON,
      hasPart: stats.map(({ t }) => ({ '@type': 'WebPageElement', name: t.name[lang], url: `${url}#${t.key}` })) },
    breadcrumbLd([[s.crumbHome, `${SITE}${L[lang].home}`], [UI_SEO[lang].themes, url]]),
  ];
  const html = `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  ${seoBlock(lang, 'themes', { ld })}
  ${headExtras(lang).replace(pwaHead(), '')}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml(lang, 'themes', pathsOf('themes'))}

  <main id="main" class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <header class="brutal-card accent-bar accent-yellow no-round space-y-3">
      <p class="ff-eyebrow text-black/70">Futuro Fortissimo · ${N} ${lang === 'it' ? 'numeri' : lang === 'en' ? 'issues' : 'अंक'}</p>
      <h1 class="text-2xl sm:text-3xl font-bold">${escapeHtml(ts.h1)}</h1>
      <p class="text-base text-black/80">${escapeHtml(ts.intro)}</p>
      <nav aria-label="${escapeHtml(ts.jump)}" class="flex flex-wrap gap-2">
        ${stats.map(({ t }) => `<a href="#${t.key}" class="px-3 py-2 min-h-[44px] inline-flex items-center border-2 border-black bg-white hover:bg-[var(--ff-yellow)] ff-button text-xs">${t.emoji} ${escapeHtml(t.name[lang])}</a>`).join('\n        ')}
      </nav>
    </header>

    ${cards}

    <p class="text-xs font-mono text-black/60">${escapeHtml(ts.note)}</p>
    ${subscribeCta(lang)}
  </main>

  ${siteFooter(lang)}
  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
  write(fileOf(lang, 'themes'), html);
}

// ── 2. Home pages: SEO head + static hero/cards (crawlable, no JS needed) ──
const HOME_S = {
  it: { tagline: 'La newsletter di Michele Merelli su tecnologia, AI, natura e società. Sezioni brevi ff.x.y, ognuna con le sue fonti, ogni ~10 giorni.', subscribe: 'Iscriviti gratis su Substack', archive: 'Archivio', themes: 'Temi', books: 'Libri', index: 'Indice interattivo' },
  en: { tagline: 'Michele Merelli’s newsletter on technology, AI, nature and society. Short ff.x.y sections, each with its sources, every ~10 days.', subscribe: 'Subscribe free on Substack', archive: 'Archive', themes: 'Themes', books: 'Books', index: 'Interactive index' },
  hi: { tagline: 'तकनीक, AI, प्रकृति और समाज पर मिकेले मेरेल्ली का न्यूज़लेटर। छोटे ff.x.y खंड, हर एक अपने स्रोतों के साथ, हर ~10 दिन में।', subscribe: 'Substack पर मुफ़्त सब्सक्राइब करें', archive: 'संग्रह', themes: 'थीम', books: 'किताबें', index: 'इंटरैक्टिव सूची' },
};
const HERO_BG = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#ffffff"/><path d="M26 0H0V26" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/></pattern><linearGradient id="h" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c8e6ff" stop-opacity="0.7"/><stop offset="100%" stop-color="#ffd6ec" stop-opacity="0.7"/></linearGradient></defs><rect width="1200" height="360" fill="url(#g)"/><rect y="360" width="1200" height="240" fill="url(#h)"/><circle cx="240" cy="220" r="110" fill="#c8e6ff" fill-opacity="0.35"/><circle cx="820" cy="160" r="140" fill="#ffd6ec" fill-opacity="0.3"/><circle cx="620" cy="440" r="170" fill="#c8e6ff" fill-opacity="0.25"/><circle cx="1040" cy="420" r="120" fill="#ffd6ec" fill-opacity="0.2"/></svg>');
const thumb = (src, alt) => {
  const m = /_(\d{2,5})x(\d{2,5})\./.exec(src);
  const cdn = /^https:\/\/substack-post-media\.s3\.amazonaws\.com\//.test(src) ? `https://substackcdn.com/image/fetch/w_480,h_270,c_fill,f_auto,q_auto:good/${encodeURIComponent(src)}` : src;
  return `<img src="${escapeHtml(cdn)}" alt="${escapeHtml(alt)}" width="480" height="270" loading="lazy" decoding="async" class="ff-card-img w-full aspect-video object-cover border-b-2 border-black bg-gray-100"${m ? '' : ''} />`;
};
const bookTitle = (b, lang) => (lang === 'it' ? b.title : BOOKS_I18N.titles?.[b.id] || b.title);
function homeStatic(lang) {
  const hs = HOME_S[lang]; const u = UI_SEO[lang];
  const latest = INDEX[lang].slice(0, 6);
  const stats = themeStats(lang);
  const books = [...BOOKS].sort((a, b) => (b.citations || []).length - (a.citations || []).length).slice(0, 6);
  const itLang = (r) => (r.it ? ' lang="it"' : '');
  return `<section class="ff-hero-card brutal-card mobile-unboxed accent-bar accent-blue no-round text-center space-y-4" aria-labelledby="ff-h1" style="background:url(&quot;${HERO_BG}&quot;) center/cover no-repeat">
      <h1 id="ff-h1" class="pixel-title ff-hero">FUTURO FORTISSIMO</h1>
      <p class="ff-body-sm text-black/80 max-w-2xl mx-auto">${escapeHtml(hs.tagline)}</p>
      <p><a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener" class="ff-cta inline-flex items-center justify-center min-h-[48px] px-6 py-3 border-3 border-black bg-[var(--ff-green)] text-black brutal-shadow ff-button">📩 ${escapeHtml(hs.subscribe)} ↗</a></p>
    </section>

    <section aria-labelledby="h-latest" class="space-y-3">
      <div class="flex items-baseline justify-between gap-2"><h2 id="h-latest" class="ff-heading-md">${escapeHtml(u.latest)}</h2><a class="ff-button underline min-h-[44px] inline-flex items-center" href="${L[lang].archive}">${escapeHtml(u.seeAll)} →</a></div>
      <ul class="ff-rail flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
        ${latest.map((r, i) => `<li class="snap-start shrink-0 w-[78%] sm:w-auto"><a href="${r.u}" class="ff-card block h-full border-3 border-black bg-white brutal-shadow hover:-translate-y-0.5 transition-transform">
          ${r.img ? thumb(r.img, r.t) : ''}
          <span class="block p-3 space-y-1">
            ${r.d ? `<time datetime="${r.d}" class="block text-xs font-mono text-black/70">${r.d}</time>` : ''}
            <span class="block font-bold leading-snug"${itLang(r)}>${escapeHtml(r.t)}</span>
            ${r.st ? `<span class="block text-sm text-black/75"${itLang(r)}>${escapeHtml(clip(r.st, 100))}</span>` : ''}
          </span>
        </a></li>`).join('\n        ')}
      </ul>
    </section>

    <section aria-labelledby="h-themes" class="space-y-3">
      <div class="flex items-baseline justify-between gap-2"><h2 id="h-themes" class="ff-heading-md">${escapeHtml(u.themes)}</h2><a class="ff-button underline min-h-[44px] inline-flex items-center" href="${L[lang].themes}">${escapeHtml(u.seeAll)} →</a></div>
      <ul class="grid gap-3 grid-cols-2 lg:grid-cols-4">
        ${stats.map(({ t, rows }) => `<li><a href="${L[lang].themes}#${t.key}" class="ff-card flex flex-col gap-1 h-full min-h-[88px] p-3 border-3 border-black bg-white brutal-shadow hover:-translate-y-0.5 transition-transform"><span class="text-2xl" aria-hidden="true">${t.emoji}</span><span class="font-bold leading-snug">${escapeHtml(t.name[lang])}</span><span class="text-xs font-mono text-black/70">${escapeHtml(u.issuesOfTheme(rows.length))}</span></a></li>`).join('\n        ')}
      </ul>
    </section>

    <section aria-labelledby="h-books" class="space-y-3">
      <div class="flex items-baseline justify-between gap-2"><h2 id="h-books" class="ff-heading-md">${escapeHtml(u.popularBooks)}</h2><a class="ff-button underline min-h-[44px] inline-flex items-center" href="${L[lang].books}">${escapeHtml(u.seeAll)} →</a></div>
      <ul class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        ${books.map((b) => `<li><a href="${L[lang].books}" class="ff-card flex flex-col gap-1 h-full p-3 border-3 border-black bg-white brutal-shadow hover:-translate-y-0.5 transition-transform"><span class="font-bold leading-snug">📚 ${escapeHtml(bookTitle(b, lang))}</span>${b.author ? `<span class="text-sm font-mono text-black/75">${escapeHtml(b.author)}</span>` : ''}<span class="text-xs font-mono text-black/70">${escapeHtml(u.citations((b.citations || []).length))}</span></a></li>`).join('\n        ')}
      </ul>
    </section>

    <h2 class="ff-heading-md pt-2" id="indice-h">${escapeHtml(hs.index)}</h2>`;
}
for (const lang of LANG_CODES) {
  const rel = fileOf(lang, 'home');
  patchHead(rel, seoBlock(lang, 'home', { ld: homeLd(lang) }));
  let h = read(rel);
  const blk = `<main id="main" class="ff-home max-w-6xl mx-auto px-4 md:px-8 pt-6 sm:pt-8 space-y-8">\n    <!-- ff:home -->\n    ${homeStatic(lang)}\n    <!-- /ff:home -->\n    <div id="root"></div>\n    </main>`;
  const nav = `<!-- ff:langswitch -->\n    ${navHtml(lang, 'home', pathsOf('home'))}\n    <!-- /ff:langswitch -->`;
  h = h.replace(/<!-- ff:langswitch -->[\s\S]*?<!-- \/ff:langswitch -->/, nav);
  if (h.includes('<!-- ff:home -->')) h = h.replace(/<main id="main" class="ff-home[\s\S]*?<div id="root"><\/div>\s*<\/main>/, blk);
  else h = h.replace('<div id="root"></div>', blk);
  write(rel, h);
}

// ── 3. Other hand-made pages: SEO head only ─────────────────────────────────
const crumbs = (lang, key, name) => breadcrumbLd([[S[lang].crumbHome, `${SITE}${L[lang].home}`], [name, `${SITE}${L[lang][key]}`]]);
const collLd = (lang, key, name) => ({ '@context': 'https://schema.org', '@type': 'CollectionPage', name, description: PAGE_SEO[key][lang].desc, url: `${SITE}${L[lang][key]}`, inLanguage: lang, isPartOf: { '@id': `${SITE}/#website` }, author: PERSON });
for (const lang of LANG_CODES) {
  for (const key of ['connections', 'notes']) {
    const name = S[lang][key].replace(/^\S+\s/, '');
    patchHead(fileOf(lang, key), seoBlock(lang, key, { ld: [collLd(lang, key, name), crumbs(lang, key, name)] }));
  }
}
{
  const nBooks = BOOKS.length; const nCites = BOOKS.reduce((a, b) => a + (b.citations || []).length, 0);
  const t = PAGE_SEO.books.it.title(nBooks); const d = PAGE_SEO.books.it.desc(nBooks, nCites);
  const ld = [{ ...collLd('it', 'books', 'Libri citati'), description: d }, crumbs('it', 'books', 'Libri')];
  patchHead('libri/index.html', seoBlock('it', 'books', { title: t, desc: d, ld }));
}

// ── 4. robots.txt, manifest.webmanifest, 404.html ───────────────────────────
write('robots.txt', `# Futuro Fortissimo — multilingual archive: Italian (default), English (/en/), Hindi (/hi/)
User-agent: *
Allow: /
Disallow: /_dev/
Disallow: /wip/
Disallow: /generated/*.html
Disallow: /openclaw/

Sitemap: ${SITE}/sitemap.xml
`);
const manifest = {
  name: 'Futuro Fortissimo', short_name: 'Fortissimo', id: '/', start_url: '/?source=pwa', scope: '/',
  description: PAGE_SEO.home.it.desc, lang: 'it', dir: 'ltr', display: 'standalone', orientation: 'portrait-primary',
  background_color: '#fdfdfd', theme_color: '#0a0a0a', categories: ['news', 'education', 'books'],
  icons: [
    { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/assets/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Archivio', url: '/archivio/', icons: [{ src: '/assets/icons/icon-192.png', sizes: '192x192' }] },
    { name: 'Archive (English)', url: '/en/archive/', icons: [{ src: '/assets/icons/icon-192.png', sizes: '192x192' }] },
    { name: 'Temi', url: '/themes.html', icons: [{ src: '/assets/icons/icon-192.png', sizes: '192x192' }] },
    { name: 'Libri', url: '/libri/', icons: [{ src: '/assets/icons/icon-192.png', sizes: '192x192' }] },
  ],
};
write('manifest.webmanifest', JSON.stringify(manifest, null, 2) + '\n');
write('manifest.json', JSON.stringify(manifest, null, 2) + '\n'); // legacy path, same content

const latest404 = INDEX.it.slice(0, 5);
write('404.html', `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Pagina non trovata · Page not found — Futuro Fortissimo</title>
  <meta name="robots" content="noindex, follow" />
  <meta name="description" content="Questa pagina non esiste. This page does not exist. यह पेज मौजूद नहीं है।" />
  ${pwaHead()}
  ${headExtras('it').replace(pwaHead(), '')}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml('it', '', pathsOf('home'))}
  <main id="main" class="max-w-3xl mx-auto px-4 py-10 space-y-6">
    <section class="brutal-card accent-bar accent-red no-round space-y-3">
      <p class="ff-eyebrow text-black/70">404</p>
      <h1 class="text-2xl sm:text-3xl font-bold">Pagina non trovata</h1>
      <p lang="en" class="text-black/80">Page not found — <span lang="hi">पेज नहीं मिला</span></p>
      <form action="/archivio/" method="get" role="search" class="flex flex-col sm:flex-row gap-3">
        <label for="q404" class="sr-only">Cerca nell’archivio</label>
        <input id="q404" name="q" type="search" placeholder="Cerca nell’archivio · Search the archive" class="flex-1 min-h-[48px] px-4 border-3 border-black text-base" />
        <button class="min-h-[48px] px-5 border-3 border-black bg-[var(--ff-yellow)] ff-button brutal-shadow">Cerca</button>
      </form>
      <p class="flex flex-wrap gap-2">
        <a class="px-4 py-3 border-3 border-black bg-white ff-button" href="/">Home</a>
        <a class="px-4 py-3 border-3 border-black bg-white ff-button" href="/en/" hreflang="en" lang="en">English</a>
        <a class="px-4 py-3 border-3 border-black bg-white ff-button" href="/hi/" hreflang="hi" lang="hi">हिन्दी</a>
      </p>
    </section>
    <section class="brutal-card no-round space-y-2">
      <h2 class="text-lg font-bold">${escapeHtml(UI_SEO.it.latest)}</h2>
      <ul class="space-y-1">${latest404.map((r) => `<li><a class="underline font-medium" href="${r.u}">${escapeHtml(r.t)}</a></li>`).join('')}</ul>
    </section>
  </main>
  ${siteFooter('it')}
</body>
</html>
`);
console.log(`✅ static pages: themes ×3, home ×3 (SEO + static hero), connections/note ×3, libri, robots.txt, manifest, 404 · ${N} issues`);
