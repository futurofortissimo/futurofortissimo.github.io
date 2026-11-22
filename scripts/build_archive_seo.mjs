#!/usr/bin/env node
/**
 * build_archive_seo.mjs — trilingual (it default · en · hi) static SEO archive.
 *
 * Generates:
 *   archivio/<slug>.html, archivio/index.html            (Italian, source)
 *   en/archive/<slug>.html, en/archive/index.html        (English)
 *   hi/archive/<slug>.html, hi/archive/index.html        (Hindi)
 *   en/books/index.html, hi/books/index.html             (books cited, affiliate links)
 *   sitemap.xml (sitemap index) + sitemap-pages.xml + sitemap-archive.xml (xhtml:link alternates)
 *   index.html Blog+WebSite JSON-LD, libri/index.html hreflang + language switcher
 *
 * Translations: i18n/en.json, i18n/hi.json (see scripts/i18n_lib.mjs).
 * An en/hi issue page is "full" when every section body is translated from the
 * current Italian text; otherwise it is "partial": metadata translated, body in
 * Italian (lang="it"), robots noindex,follow, excluded from sitemap + hreflang.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawData } from '../data.js';
import { loadTranslations, localizeIssue, buildRefContext } from './i18n_lib.mjs';
import { SITE, SUBSTACK, L, S, BOOKS_S } from './i18n_strings.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const LANG_CODES = ['it', 'en', 'hi'];
const dirOf = (lang) => path.join(ROOT, L[lang].archive.replace(/^\//, ''));
LANG_CODES.forEach((lg) => fs.mkdirSync(dirOf(lg), { recursive: true }));

function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeXml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
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
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, n - 3).replace(/\s+\S*$/, '') + '…');
function makeDescription(ch, lang, bodyUsable) {
  const base = (ch.subtitle || '').trim();
  if (base.length >= 60) return clip(base);
  let extra = '';
  if (bodyUsable) {
    extra = (ch.subchapters || []).map((s) => (s.content || '').replace(/\s+/g, ' ').trim()).find(Boolean) || '';
  } else {
    // never leak Italian body text into en/hi meta descriptions
    extra = [...(ch.keypoints || []), ...(ch.subchapters || []).map((s) => s.title)].filter(Boolean).join(' · ');
  }
  const combined = [base, extra].filter(Boolean).join(' — ');
  if (!combined) return S[lang].descFallback(ch.title || '');
  return clip(combined);
}
function firstImageOf(ch) {
  for (const sub of ch.subchapters || []) for (const img of sub.images || []) if (img?.src && /^https?:\/\//.test(img.src)) return img.src;
  return `${SITE}/logo.png`;
}
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
const anchorOf = (sub, sIdx) => {
  const m = /ff\.(\d+)\.(\d+)/i.exec(sub.title || '');
  return m ? `ff-${m[1]}-${m[2]}` : `sec-${sIdx + 1}`;
};

// ── Data: dedupe, sort newest-first, localize ───────────────────────────────
const seenUrls = new Set();
const issues = [];
rawData.forEach((ch, idx) => {
  const u = (ch?.url || '').replace(/\/$/, '');
  if (!u || seenUrls.has(u)) return;
  seenUrls.add(u);
  issues.push({ ...ch, slug: issueSlugOf(ch, idx), ffNum: issueNumOf(ch), _idx: idx });
});
issues.sort((a, b) => {
  if (a.ffNum >= 0 && b.ffNum >= 0) return b.ffNum - a.ffNum;
  if (a.ffNum >= 0) return -1;
  if (b.ffNum >= 0) return 1;
  return 0;
});

const TR = { en: loadTranslations('en'), hi: loadTranslations('hi') };
const CTX = { en: buildRefContext(rawData, TR.en), hi: buildRefContext(rawData, TR.hi) };
// LOC[lang][slug] = { issue, status }
const LOC = { it: {}, en: {}, hi: {} };
for (const ch of issues) {
  LOC.it[ch.slug] = { issue: ch, status: 'full' };
  for (const lg of ['en', 'hi']) {
    const r = localizeIssue(ch, ch._idx, TR[lg], ch.slug, CTX[lg]);
    LOC[lg][ch.slug] = { issue: { ...r.issue, slug: ch.slug, ffNum: ch.ffNum }, status: r.status };
  }
}
const issueUrl = (lang, slug) => `${SITE}${L[lang].archive}${slug}.html`;
const issuePath = (lang, slug) => `${L[lang].archive}${slug}.html`;
const indexable = (lang, slug) => lang === 'it' || LOC[lang][slug].status === 'full';
/** hreflang group for an issue: only indexable versions (reciprocal by construction) */
function issueAlternates(slug) {
  const alts = LANG_CODES.filter((lg) => indexable(lg, slug)).map((lg) => ({ hreflang: lg, href: issueUrl(lg, slug) }));
  alts.push({ hreflang: 'x-default', href: issueUrl('it', slug) });
  return alts;
}
const groupAlternates = (paths) => [
  ...LANG_CODES.map((lg) => ({ hreflang: lg, href: `${SITE}${paths[lg]}` })),
  { hreflang: 'x-default', href: `${SITE}${paths.it}` },
];
const ARCHIVE_PATHS = { it: L.it.archive, en: L.en.archive, hi: L.hi.archive };
const BOOKS_PATHS = { it: L.it.books, en: L.en.books, hi: L.hi.books };
const altLinksHtml = (alts) => alts.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`).join('\n  ');

// ── Shared chrome ───────────────────────────────────────────────────────────
const SHARED_STYLES = `
  :root { --ff-blue:#4a90e2; --ff-red:#d0021b; --ff-yellow:#f5a623; --ff-green:#2ecc71; --ff-black:#0a0a0a; --ff-grid:rgba(0,0,0,0.03); }
  body { font-family:'Inter',sans-serif; background-color:#fdfdfd; color:var(--ff-black); min-height:100vh; line-height:1.65; position:relative; }
  body::before { content:''; position:fixed; inset:0; background-image:linear-gradient(var(--ff-grid) 1px,transparent 1px),linear-gradient(90deg,var(--ff-grid) 1px,transparent 1px); background-size:32px 32px; pointer-events:none; z-index:-1; }
  h1, h2, h3, h4, .font-heading { font-family:'IBM Plex Mono',monospace; letter-spacing:0.03em; text-transform:uppercase; }
  .brutal-card { border:4px solid var(--ff-black); background:#fff; box-shadow:6px 6px 0 var(--ff-black); padding:24px; }
  .brutal-shadow { box-shadow:4px 4px 0 var(--ff-black); }
  .border-3 { border-width:3px !important; }
  .accent-bar { position:relative; }
  .accent-bar::before { content:''; position:absolute; top:-4px; left:-4px; right:-4px; height:10px; background:var(--ff-blue); }
  .accent-yellow::before { background:var(--ff-yellow); }
  .accent-green::before { background:var(--ff-green); }
  .accent-red::before { background:var(--ff-red); }
  .ff-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; font-weight:700; }
  .ff-button { font-family:'IBM Plex Mono',monospace; font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase; font-weight:700; }
  .ff-topbar { font-family:'IBM Plex Mono',monospace; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; font-weight:700; background:var(--ff-black); color:#fff; }
  .ff-topbar .ff-brand { color:#fff; text-decoration:none; }
  .ff-lang-switch { display:inline-flex; border:2px solid #fff; box-shadow:3px 3px 0 var(--ff-yellow); margin:2px 3px 3px 0; }
  .ff-lang-switch a { display:inline-flex; align-items:center; gap:0.4em; padding:3px 10px; color:#fff; text-decoration:none; border-left:2px solid #fff; transition:background .15s,color .15s; }
  .ff-lang-switch a:first-child { border-left:0; }
  .ff-lang-switch a:hover, .ff-lang-switch a:focus-visible { background:#fff; color:#000; outline:none; }
  .ff-lang-switch a[aria-current="page"] { background:var(--ff-yellow); color:#000; }
  .ff-lang-switch .ff-ln { text-transform:none; letter-spacing:0; font-weight:600; opacity:.85; }
  @media (max-width:640px) { .ff-lang-switch .ff-ln { display:none; } .brutal-card { border-width:2px; box-shadow:3px 3px 0 var(--ff-black); padding:16px; } }
  .no-round, .no-round * { border-radius:0 !important; }
  html[lang="hi"] body { font-family:'Noto Sans Devanagari','Inter',sans-serif; line-height:1.8; }
  html[lang="hi"] h1, html[lang="hi"] h2, html[lang="hi"] h3, html[lang="hi"] h4,
  html[lang="hi"] .ff-eyebrow, html[lang="hi"] .ff-button { font-family:'IBM Plex Mono','Noto Sans Devanagari',monospace; letter-spacing:0.02em; line-height:1.5; }
  html[lang="hi"] [lang="it"], html[lang="hi"] [lang="en"] { font-family:'Inter',sans-serif; }
  .ff-badge-full { background:var(--ff-green); }
  .ff-badge-partial { background:#f3f4f6; }
`;

function langSwitchHtml(lang, hrefs) {
  const items = LANG_CODES.map((lg) => {
    const cur = lg === lang;
    return `<a href="${escapeHtml(hrefs[lg])}" hreflang="${lg}" lang="${lg}" title="${escapeHtml(L[lg].name)}"${cur ? ' aria-current="page"' : ''}>${L[lg].label}<span class="ff-ln">${escapeHtml(L[lg].name)}</span></a>`;
  }).join('');
  return `<nav class="ff-topbar" aria-label="${escapeHtml(S[lang].langLabel)}">
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-2 px-4 py-1">
      <a href="${L[lang].home}" class="ff-brand">FUTURO FORTISSIMO</a>
      <div class="ff-lang-switch" role="group" aria-label="${escapeHtml(S[lang].langLabel)}">${items}</div>
    </div>
  </nav>`;
}

function navHtml(lang, active, hrefs) {
  const s = S[lang];
  const link = (href, label, key) => {
    const isCurrent = active === key;
    return `<a href="${href}"${isCurrent ? ' aria-current="page"' : ''} class="px-3 py-2 border-2 border-black ff-button ${isCurrent ? 'bg-[var(--ff-yellow)] text-black' : 'bg-white text-black hover:-translate-y-0.5 transition-transform'} whitespace-nowrap">${label}</a>`;
  };
  return `
  ${langSwitchHtml(lang, hrefs)}
  <header class="max-w-5xl mx-auto px-4 pt-6">
    <nav aria-label="${escapeHtml(s.navLabel)}" class="flex flex-wrap items-center gap-2 pb-4 border-b-3 border-black">
      ${link(L[lang].home, s.home, 'home')}
      ${link(L[lang].archive, s.archive, 'archivio')}
      ${link(L[lang].books, s.books, 'libri')}
      ${link('/book/', s.book, 'book')}
      ${lang === 'it' ? link('/book/ffxy-index.html', s.ffxy, 'ffxy') : ''}
      ${link(L[lang].themes, s.themes, 'themes')}
      ${link(L[lang].connections, s.connections, 'connections')}
      ${link(L[lang].notes, s.notes, 'note')}
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="ml-auto px-3 py-2 border-2 border-black bg-[var(--ff-green)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform whitespace-nowrap">${s.subscribe}</a>
    </nav>
  </header>`;
}

function headExtras(lang) {
  const fonts = lang === 'hi'
    ? 'family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700'
    : 'family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700';
  return `
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/favicon.ico" />
  <link rel="alternate" type="application/atom+xml" title="Futuro Fortissimo Feed" href="/feed.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="/assets/ff-archive.css" />
  <link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet" />
  <style>${SHARED_STYLES}</style>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NQ7MQR0VL8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NQ7MQR0VL8');
  </script>`;
}

function metaBlock({ lang, title, desc, url, image, type, robots, alts }) {
  const others = LANG_CODES.filter((lg) => lg !== lang).map((lg) => `<meta property="og:locale:alternate" content="${L[lg].locale}" />`).join('\n  ');
  return `<title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta name="author" content="Michele Merelli" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${escapeHtml(url)}" />
  ${alts.length ? altLinksHtml(alts) : ''}

  <meta property="og:site_name" content="Futuro Fortissimo" />
  <meta property="og:locale" content="${L[lang].locale}" />
  ${others}
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />`;
}

const ROBOTS_INDEX = 'index, follow, max-snippet:-1, max-image-preview:large';
const ROBOTS_NOINDEX = 'noindex, follow';
const subscribeCta = (lang) => `<section class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">${escapeHtml(S[lang].newsletterTitle)}</h2>
        <p class="text-sm text-black/80 mt-1">${escapeHtml(S[lang].newsletterText)}</p>
      </div>
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="px-5 py-3 border-3 border-black bg-[var(--ff-yellow)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform whitespace-nowrap">${S[lang].subscribeFree}</a>
    </section>`;

// ── 1. Issue pages (it/en/hi) ───────────────────────────────────────────────
const stats = { it: { full: 0, partial: 0 }, en: { full: 0, partial: 0 }, hi: { full: 0, partial: 0 } };
for (const lang of LANG_CODES) {
  const s = S[lang];
  issues.forEach((orig, idx) => {
    const { issue: ch, status } = LOC[lang][orig.slug];
    stats[lang][status === 'full' ? 'full' : 'partial']++;
    const isFull = status === 'full';
    const older = idx + 1 < issues.length ? LOC[lang][issues[idx + 1].slug].issue : null;
    const newer = idx - 1 >= 0 ? LOC[lang][issues[idx - 1].slug].issue : null;
    const pageUrl = issueUrl(lang, orig.slug);
    const titleText = `${ch.title} — Futuro Fortissimo${lang === 'en' ? ' (English)' : lang === 'hi' ? ' (हिन्दी)' : ''}`;
    const desc = makeDescription(ch, lang, lang === 'it' || isFull);
    const ogImage = firstImageOf(ch);
    const alts = isFull ? issueAlternates(orig.slug) : [];
    const hrefs = Object.fromEntries(LANG_CODES.map((lg) => [lg, issuePath(lg, orig.slug)]));

    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: clip(ch.title, 110),
      description: desc,
      image: [ogImage],
      inLanguage: lang,
      isAccessibleForFree: true,
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      url: pageUrl,
      sameAs: ch.url,
      author: { '@type': 'Person', name: 'Michele Merelli', url: `${SUBSTACK}/` },
      publisher: { '@type': 'Organization', name: 'Futuro Fortissimo', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
      isPartOf: { '@type': 'Blog', name: s.blogName, url: `${SITE}${L[lang].archive}` },
    };
    if (lang === 'it') {
      const tr = ['en', 'hi'].filter((lg) => indexable(lg, orig.slug));
      if (tr.length) articleLd.workTranslation = tr.map((lg) => ({ '@type': 'Article', '@id': issueUrl(lg, orig.slug), inLanguage: lg }));
    } else {
      articleLd.translationOfWork = { '@type': 'Article', '@id': issueUrl('it', orig.slug), inLanguage: 'it' };
    }
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: s.crumbHome, item: `${SITE}${L[lang].home}` },
        { '@type': 'ListItem', position: 2, name: s.crumbArchive, item: `${SITE}${L[lang].archive}` },
        { '@type': 'ListItem', position: 3, name: ch.title, item: pageUrl },
      ],
    };

    const metaLang = lang !== 'it' && ch._lang !== lang ? ' lang="it"' : '';
    const keypointsHtml = Array.isArray(ch.keypoints) && ch.keypoints.length
      ? `<ul${metaLang} class="mt-4 space-y-2 border-l-4 border-black pl-4 text-sm sm:text-base font-medium">
        ${ch.keypoints.map((k) => `<li>• ${escapeHtml(k)}</li>`).join('\n        ')}
      </ul>` : '';

    const langAttr = (l) => (l !== lang ? ` lang="${l}"` : '');
    const subchaptersHtml = (ch.subchapters || []).map((sub, sIdx) => {
      const anchor = anchorOf(orig.subchapters[sIdx] || sub, sIdx);
      const validRefs = [];
      const seenRef = new Set();
      [...(sub.references || []), ...(sub.connections || [])].forEach((ref) => {
        if (!isLinkValid(ref?._src ?? ref?.text, ref?.url) || seenRef.has(ref.url)) return;
        seenRef.add(ref.url);
        validRefs.push(ref);
      });
      const bodyLang = lang === 'it' ? 'it' : sub._lang;
      const imgsHtml = (sub.images || []).filter((img) => img?.src).map((img) => {
        const cap = img.caption || '';
        const alt = bodyLang === lang ? (cap || sub.title) : sub.title;
        return `<figure class="mt-4 border-3 border-black bg-white p-2">
          <img src="${escapeHtml(img.src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" class="w-full max-h-[520px] object-contain mx-auto" />
          ${cap ? `<figcaption${langAttr(bodyLang)} class="mt-2 text-xs font-mono text-black/70">${escapeHtml(cap)}</figcaption>` : ''}
        </figure>`;
      }).join('\n');
      const refsHtml = validRefs.length ? `<div class="mt-4 pt-3 border-t-2 border-black/15">
          <div class="ff-eyebrow text-black/70 mb-2">${escapeHtml(s.sources)} (${validRefs.length})</div>
          <div class="flex flex-wrap gap-2">
            ${validRefs.map((r) => {
              const isAmzn = /amzn\.|amazon\./i.test(r.url);
              // Italian anchor text on it pages; neutral host label on en/hi (no leftover Italian)
              const tr = lang === 'it' || r._lang === lang;
              const label = tr ? r.text : (isAmzn ? 'Amazon' : hostOf(r.url));
              const rel = isAmzn ? 'noopener noreferrer sponsored' : 'noopener noreferrer';
              return `<a href="${escapeHtml(r.url)}" target="_blank" rel="${rel}"${lang !== 'it' && !tr ? ` title="${escapeHtml(r._src ?? r.text)}" lang="it"` : ''} class="inline-flex items-center px-2.5 py-1.5 border-2 border-black ${isAmzn ? 'bg-[var(--ff-yellow)]' : 'bg-white'} text-xs font-mono font-bold hover:underline">${isAmzn ? '📚 ' : '↗ '}${escapeHtml(label)}</a>`;
            }).join('\n            ')}
          </div>
        </div>` : '';
      const paragraphs = (sub.content || '').split(/\n+/).map((p) => p.trim()).filter(Boolean)
        .map((p) => `<p class="text-base leading-relaxed text-black/90">${escapeHtml(p)}</p>`).join('\n        ');
      const titleLang = lang === 'it' ? 'it' : sub._titleLang;
      return `<section id="${anchor}" class="brutal-card no-round space-y-3 scroll-mt-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <h2${langAttr(titleLang)} class="text-lg sm:text-xl font-bold text-black">${escapeHtml(sub.title || `${s.section} ${sIdx + 1}`)}</h2>
        ${sub.link ? `<a href="${escapeHtml(sub.link)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 border-2 border-black bg-white ff-button text-xs hover:bg-[var(--ff-yellow)]">Substack ↗</a>` : ''}
      </div>
      <div class="space-y-3"${langAttr(bodyLang)}>
        ${paragraphs}
      </div>
      ${imgsHtml}
      ${refsHtml}
    </section>`;
    }).join('\n\n    ');

    const tocHtml = (ch.subchapters || []).length > 1 ? `<nav aria-label="${escapeHtml(s.tocLabel)}" class="mt-5 pt-4 border-t-2 border-black/15">
        <div class="ff-eyebrow text-black/70 mb-2">${escapeHtml(s.inThisIssue)}</div>
        <div class="flex flex-wrap gap-2">
          ${(ch.subchapters || []).map((sub, sIdx) => `<a href="#${anchorOf(orig.subchapters[sIdx] || sub, sIdx)}"${langAttr(lang === 'it' ? 'it' : sub._titleLang)} class="px-2.5 py-1 border-2 border-black bg-gray-50 hover:bg-[var(--ff-yellow)] text-xs font-mono font-bold">${escapeHtml(sub.title)}</a>`).join('\n          ')}
        </div>
      </nav>` : '';

    const partialNotice = lang !== 'it' && !isFull ? `<aside class="brutal-card accent-bar accent-yellow no-round flex flex-col sm:flex-row sm:items-center justify-between gap-3" role="note">
      <p class="text-sm font-medium">🌐 ${escapeHtml(s.partialNotice)}</p>
      <a href="${issuePath('it', orig.slug)}" hreflang="it" class="px-3 py-1.5 border-2 border-black bg-white ff-button text-xs whitespace-nowrap">IT · Italiano →</a>
    </aside>` : '';

    const html = `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaBlock({ lang, title: titleText, desc, url: pageUrl, image: ogImage, type: 'article', robots: (lang === 'it' || isFull) ? ROBOTS_INDEX : ROBOTS_NOINDEX, alts })}

  <script type="application/ld+json">${safeJsonLd(articleLd)}</script>
  <script type="application/ld+json">${safeJsonLd(breadcrumbLd)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml(lang, 'archivio', hrefs)}

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <article class="brutal-card accent-bar accent-blue no-round">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span class="ff-eyebrow text-black/70">${escapeHtml(s.eyebrow)}</span>
        <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs hover:-translate-y-0.5 transition-transform">${escapeHtml(s.readOriginal)}</a>
      </div>
      <h1${metaLang} class="text-2xl sm:text-3xl font-bold text-black">${escapeHtml(ch.title)}</h1>
      ${ch.subtitle ? `<p${metaLang} class="mt-3 text-base sm:text-lg text-black/80 font-medium">${escapeHtml(ch.subtitle)}</p>` : ''}
      ${keypointsHtml}
      ${tocHtml}
    </article>

    ${partialNotice}

    ${subchaptersHtml}

    ${subscribeCta(lang)}

    <nav aria-label="${escapeHtml(s.adjacent)}" class="flex flex-wrap items-center justify-between gap-3 pt-2">
      ${older ? `<a href="${issuePath(lang, older.slug)}" class="px-4 py-2.5 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-0.5 transition-transform">← ${escapeHtml(older.title)}</a>` : '<span></span>'}
      ${newer ? `<a href="${issuePath(lang, newer.slug)}" class="px-4 py-2.5 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-0.5 transition-transform">${escapeHtml(newer.title)} →</a>` : '<span></span>'}
    </nav>
  </main>

  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(dirOf(lang), `${orig.slug}.html`), html, 'utf-8');
  });
}

// ── 2. Archive index pages (it/en/hi) ───────────────────────────────────────
for (const lang of LANG_CODES) {
  const s = S[lang];
  const n = issues.length;
  const url = `${SITE}${L[lang].archive}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: s.idxOgTitle,
    description: s.idxDesc(n),
    url,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'Futuro Fortissimo', url: `${SITE}/` },
    author: { '@type': 'Person', name: 'Michele Merelli', url: `${SUBSTACK}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: n,
      itemListElement: issues.slice(0, 30).map((o, i) => ({ '@type': 'ListItem', position: i + 1, url: issueUrl(lang, o.slug), name: LOC[lang][o.slug].issue.title })),
    },
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: s.crumbHome, item: `${SITE}${L[lang].home}` },
      { '@type': 'ListItem', position: 2, name: s.crumbArchive, item: url },
    ],
  };
  const intro = lang === 'it' ? '' : `<section class="brutal-card accent-bar accent-red no-round space-y-3">
      <div class="ff-eyebrow text-black/70">${escapeHtml(s.introKicker)}</div>
      <p class="text-base sm:text-lg font-medium">${escapeHtml(s.introText)}</p>
      <div class="flex flex-wrap gap-2">
        <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 border-3 border-black bg-[var(--ff-green)] ff-button brutal-shadow">${s.subscribeFree}</a>
        <a href="${L[lang].books}" class="px-4 py-2.5 border-3 border-black bg-white ff-button brutal-shadow">${s.books}</a>
      </div>
    </section>`;
  const fullCount = stats[lang].full;
  const filterPills = lang === 'it' ? '' : `<div class="flex flex-wrap gap-2" role="group">
        <button type="button" data-f="all" class="ff-f px-3 py-1.5 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs">${escapeHtml(s.filterAll)} · ${n}</button>
        <button type="button" data-f="full" class="ff-f px-3 py-1.5 border-2 border-black bg-white ff-button text-xs">${escapeHtml(s.filterFull)} · ${fullCount}</button>
      </div>`;
  const items = issues.map((o) => {
    const { issue: ch, status } = LOC[lang][o.slug];
    const subLinks = (ch.subchapters || []).map((x) => `<span${lang !== 'it' && x._titleLang !== lang ? ' lang="it"' : ''} class="inline-block px-2 py-0.5 border border-black/30 bg-gray-50 text-xs font-mono">${escapeHtml(x.title)}</span>`).join(' ');
    const blob = escapeHtml(`${ch.title} ${ch.subtitle || ''} ${(ch.subchapters || []).map((x) => x.title).join(' ')} ${o.title}`.toLowerCase());
    const badge = lang === 'it' ? '' : (status === 'full'
      ? `<span class="inline-block px-2 py-0.5 border-2 border-black ff-badge-full text-[11px] font-mono font-bold">${escapeHtml(s.full)}</span>`
      : `<span class="inline-block px-2 py-0.5 border border-black/40 ff-badge-partial text-[11px] font-mono">${escapeHtml(s.partial)}</span>`);
    const ml = lang !== 'it' && ch._lang !== lang ? ' lang="it"' : '';
    return `<article class="brutal-card no-round space-y-2 issue-item" data-status="${status}" data-search="${blob}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <h2${ml} class="text-lg font-bold"><a href="${issuePath(lang, o.slug)}" class="hover:underline">${escapeHtml(ch.title)}</a></h2>
            <div class="flex gap-2">
              <a href="${issuePath(lang, o.slug)}" class="px-2.5 py-1 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs">${escapeHtml(s.idxOpen)}</a>
              <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 border-2 border-black bg-white ff-button text-xs">Substack ↗</a>
            </div>
          </div>
          ${badge}
          ${ch.subtitle ? `<p${ml} class="text-sm text-black/80">${escapeHtml(ch.subtitle)}</p>` : ''}
          ${subLinks ? `<div class="flex flex-wrap gap-1.5 pt-1">${subLinks}</div>` : ''}
        </article>`;
  }).join('\n      ');

  const hrefs = { ...ARCHIVE_PATHS };
  const html = `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaBlock({ lang, title: s.idxTitle(n), desc: s.idxDesc(n), url, image: `${SITE}/logo.png`, type: 'website', robots: ROBOTS_INDEX, alts: groupAlternates(ARCHIVE_PATHS) })}

  <script type="application/ld+json">${safeJsonLd(ld)}</script>
  <script type="application/ld+json">${safeJsonLd(crumbs)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml(lang, 'archivio', hrefs)}

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    ${intro}
    <section class="brutal-card accent-bar accent-yellow no-round space-y-4">
      <div class="ff-eyebrow text-black/70">${escapeHtml(s.idxEyebrow(n))}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">${escapeHtml(s.idxH1)}</h1>
      <p class="text-base text-black/80">${s.idxIntro}</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <input id="q" type="search" placeholder="${escapeHtml(s.idxFilter)}" aria-label="${escapeHtml(s.idxFilter)}" class="flex-1 px-4 py-2.5 border-3 border-black bg-white text-sm font-medium focus:outline-none" />
        <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 border-3 border-black bg-[var(--ff-yellow)] ff-button brutal-shadow text-center">${s.subscribeShort}</a>
      </div>
      ${filterPills}
    </section>

    <div id="list" class="space-y-4">
      ${items}
    </div>
  </main>

  <script>
    (function () {
      const q = document.getElementById('q');
      const items = Array.from(document.querySelectorAll('.issue-item'));
      let mode = 'all';
      const apply = () => {
        const term = q.value.trim().toLowerCase();
        items.forEach((el) => {
          const okTerm = !term || el.dataset.search.includes(term);
          const okMode = mode === 'all' || el.dataset.status === 'full';
          el.style.display = okTerm && okMode ? '' : 'none';
        });
      };
      const pre = new URLSearchParams(location.search).get('q');
      if (pre) q.value = pre;
      q.addEventListener('input', apply);
      document.querySelectorAll('.ff-f').forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.f;
        document.querySelectorAll('.ff-f').forEach((x) => {
          x.classList.toggle('bg-[var(--ff-yellow)]', x === b);
          x.classList.toggle('bg-white', x !== b);
        });
        apply();
      }));
      apply();
    })();
  </script>
  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(dirOf(lang), 'index.html'), html, 'utf-8');
}

// ── 3. Books pages (en/hi) ──────────────────────────────────────────────────
const booksData = JSON.parse(fs.readFileSync(path.join(ROOT, 'libri', 'books_cited.json'), 'utf-8'));
const booksI18n = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', 'books.json'), 'utf-8'));
const bySlug = Object.fromEntries(issues.map((o) => [o.slug, o]));
function sectionFor(lang, slug, ffCode) {
  const o = bySlug[slug];
  if (!o) return null;
  const i = (o.subchapters || []).findIndex((x) => (x.title || '').toLowerCase().startsWith(String(ffCode).toLowerCase() + ' ') || (x.title || '').toLowerCase() === String(ffCode).toLowerCase());
  if (i < 0) return null;
  const sub = LOC[lang][slug].issue.subchapters[i];
  return { sub, anchor: anchorOf(o.subchapters[i], i) };
}
const ffNumOf = (b) => Math.max(-1, ...(b.citations || []).map((c) => Number((/ff\.(\d+)/.exec(c.ffCode) || [])[1] ?? -1)));
const bookLangStats = {};
for (const lang of ['en', 'hi']) {
  const bs = BOOKS_S[lang];
  const books = [...booksData.books].sort((a, b) => ffNumOf(b) - ffNumOf(a));
  const totalCites = books.reduce((acc, b) => acc + (b.citations || []).length, 0);
  let missingTitles = 0;
  const themeName = (t) => booksI18n.themes[t]?.[lang] || t;
  const themes = Array.from(new Set(books.map((b) => b.theme).filter(Boolean)));
  const cards = books.map((b) => {
    const title = booksI18n.titles[b.id] || (missingTitles++, b.title);
    const cites = (b.citations || []).map((c) => {
      const sec = sectionFor(lang, c.issueSlug, c.ffCode);
      const href = sec ? `${issuePath(lang, c.issueSlug)}#${sec.anchor}` : issuePath(lang, c.issueSlug);
      const secTitle = sec && sec.sub._titleLang === lang ? sec.sub.title : '';
      const excerpt = sec && sec.sub._lang === lang ? clip((sec.sub.content || '').replace(/\s+/g, ' ').trim(), 180) : '';
      return `<div class="border-l-4 border-black pl-3 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <a href="${escapeHtml(href)}" class="px-2 py-0.5 border-2 border-black bg-[var(--ff-blue)] text-black font-mono text-xs font-bold hover:underline">${escapeHtml(c.ffCode)}</a>
                ${secTitle ? `<a href="${escapeHtml(href)}" class="text-xs font-mono font-bold hover:underline">${escapeHtml(secTitle.replace(/^ff\.\d+\.\d+\s*/i, ''))}</a>` : ''}
              </div>
              ${excerpt ? `<p class="text-xs sm:text-sm text-black/80">${escapeHtml(excerpt)}</p>` : ''}
            </div>`;
    }).join('\n            ');
    const blob = escapeHtml(`${title} ${b.title} ${b.author || ''} ${themeName(b.theme)} ${(b.citations || []).map((c) => c.ffCode).join(' ')}`.toLowerCase());
    return `<article class="brutal-card no-round flex flex-col gap-4 h-full book-item" data-theme="${escapeHtml(b.theme || '')}" data-search="${blob}">
          <div class="space-y-1">
            <span class="inline-block px-2 py-0.5 border border-black bg-gray-100 font-mono text-[11px] font-bold uppercase">${escapeHtml(themeName(b.theme))}</span>
            <h2 lang="${/[\u0900-\u097F]/.test(title) ? 'hi' : (title === b.title && b.id === 'come-saremo' ? 'it' : 'en')}" class="text-lg sm:text-xl font-bold text-black leading-snug">${escapeHtml(title)}</h2>
            ${b.author ? `<p class="text-sm font-mono font-semibold text-black/75">${escapeHtml(b.author)}</p>` : ''}
          </div>
          <div class="space-y-1">
            <div class="ff-eyebrow text-black/60">${escapeHtml(bs.citedIn)}</div>
            ${cites}
          </div>
          <div class="flex flex-wrap gap-2 pt-2 border-t-2 border-black/15 mt-auto">
            <a href="${escapeHtml(b.amazonUrl)}" target="_blank" rel="noopener noreferrer sponsored" class="px-3.5 py-2 border-2 border-black bg-[var(--ff-yellow)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform">${escapeHtml(bs.buy)}</a>
          </div>
        </article>`;
  }).join('\n        ');
  bookLangStats[lang] = { books: books.length, citations: totalCites, missingTitles };

  const url = `${SITE}${L[lang].books}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: bs.ogTitle,
    description: bs.desc(books.length, totalCites),
    url,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'Futuro Fortissimo', url: `${SITE}/` },
    author: { '@type': 'Person', name: 'Michele Merelli', url: `${SUBSTACK}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.map((b, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Book', name: booksI18n.titles[b.id] || b.title, ...(b.author ? { author: { '@type': 'Person', name: b.author } } : {}), url: b.amazonUrl },
      })),
    },
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: S[lang].crumbHome, item: `${SITE}${L[lang].home}` },
      { '@type': 'ListItem', position: 2, name: S[lang].crumbBooks, item: url },
    ],
  };
  const html = `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaBlock({ lang, title: bs.title(books.length), desc: bs.desc(books.length, totalCites), url, image: `${SITE}/logo.png`, type: 'website', robots: ROBOTS_INDEX, alts: groupAlternates(BOOKS_PATHS) })}

  <script type="application/ld+json">${safeJsonLd(ld)}</script>
  <script type="application/ld+json">${safeJsonLd(crumbs)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round">
  ${navHtml(lang, 'libri', { ...BOOKS_PATHS })}

  <main class="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <section class="brutal-card accent-bar accent-yellow no-round space-y-4">
      <div class="ff-eyebrow text-black/70">${escapeHtml(bs.eyebrow(books.length, totalCites))}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">${escapeHtml(bs.h1)}</h1>
      <p class="text-base text-black/80">${escapeHtml(bs.intro)}</p>
      <p class="text-xs font-mono border-2 border-black bg-gray-50 px-3 py-2">${escapeHtml(bs.disclosure)}</p>
      <input id="q" type="search" placeholder="${escapeHtml(bs.filter)}" aria-label="${escapeHtml(bs.filter)}" class="w-full px-4 py-2.5 border-3 border-black bg-white text-sm font-medium focus:outline-none" />
      <div class="flex flex-wrap gap-2" role="group">
        <button type="button" data-theme="ALL" class="theme-pill px-3 py-1.5 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs">${escapeHtml(bs.all)}</button>
        ${themes.map((t) => `<button type="button" data-theme="${escapeHtml(t)}" class="theme-pill px-3 py-1.5 border-2 border-black bg-white ff-button text-xs">${escapeHtml(themeName(t))}</button>`).join('\n        ')}
      </div>
    </section>

    <section id="grid" class="grid grid-cols-1 md:grid-cols-2 gap-5" aria-live="polite">
        ${cards}
    </section>
    <p id="empty" class="hidden brutal-card no-round text-center font-mono font-bold">${escapeHtml(bs.empty)}</p>

    <section class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">${escapeHtml(bs.ctaTitle)}</h2>
        <p class="text-sm text-black/80 mt-1">${escapeHtml(bs.ctaText)}</p>
      </div>
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="px-5 py-3 border-3 border-black bg-[var(--ff-yellow)] text-black ff-button brutal-shadow whitespace-nowrap">${S[lang].subscribeFree}</a>
    </section>
  </main>

  <script>
    (function () {
      const q = document.getElementById('q');
      const items = Array.from(document.querySelectorAll('.book-item'));
      const empty = document.getElementById('empty');
      let theme = 'ALL';
      const apply = () => {
        const term = q.value.trim().toLowerCase();
        let shown = 0;
        items.forEach((el) => {
          const ok = (theme === 'ALL' || el.dataset.theme === theme) && (!term || el.dataset.search.includes(term));
          el.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        empty.classList.toggle('hidden', shown > 0);
      };
      q.addEventListener('input', apply);
      document.querySelectorAll('.theme-pill').forEach((b) => b.addEventListener('click', () => {
        theme = b.dataset.theme;
        document.querySelectorAll('.theme-pill').forEach((x) => {
          x.classList.toggle('bg-[var(--ff-yellow)]', x === b);
          x.classList.toggle('bg-white', x !== b);
        });
        apply();
      }));
    })();
  </script>
  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
  const dir = path.join(ROOT, L[lang].books.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
}

// ── 4. Home JSON-LD (WebSite + Blog) ────────────────────────────────────────
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
    author: { '@type': 'Person', name: 'Michele Merelli', url: SUBSTACK },
    publisher: { '@type': 'Person', name: 'Michele Merelli' },
    potentialAction: { '@type': 'SearchAction', target: `${SITE}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Futuro Fortissimo — Archivio Newsletter',
    description: `Archivio completo dei ${issues.length} numeri della newsletter Futuro Fortissimo di Michele Merelli.`,
    url: `${SITE}/archivio/`,
    inLanguage: 'it',
    author: { '@type': 'Person', name: 'Michele Merelli', url: SUBSTACK },
    blogPost: issues.slice(0, 15).map((ch) => ({
      '@type': 'BlogPosting',
      headline: ch.title,
      description: makeDescription(ch, 'it', true),
      url: issueUrl('it', ch.slug),
      sameAs: ch.url,
      author: { '@type': 'Person', name: 'Michele Merelli' },
    })),
  },
];
const ldRegex = /<!-- JSON-LD Structured Data -->[\s\S]*?<\/script>(?:\s*<script type="application\/ld\+json">[\s\S]*?<\/script>)*/;
if (ldRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(ldRegex, `<!-- JSON-LD Structured Data -->\n    <script type="application/ld+json">\n    ${safeJsonLd(homeLd)}\n    </script>`);
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');
}

// ── 5. Italian /libri/: hreflang + real language switcher (idempotent) ──────
function patchStatic(rel, lang, hrefs, alts) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return;
  let h = fs.readFileSync(p, 'utf-8');
  const altBlock = `<!-- ff:hreflang -->\n  ${altLinksHtml(alts)}\n  <!-- /ff:hreflang -->`;
  if (h.includes('<!-- ff:hreflang -->')) h = h.replace(/<!-- ff:hreflang -->[\s\S]*?<!-- \/ff:hreflang -->/, altBlock);
  else h = h.replace(/(<link rel="canonical"[^>]*>)/, `$1\n  ${altBlock}`);
  const sw = `<!-- ff:langswitch -->\n  ${langSwitchHtml(lang, hrefs).replace('max-w-5xl', 'max-w-6xl')}\n  <!-- /ff:langswitch -->`;
  if (h.includes('<!-- ff:langswitch -->')) h = h.replace(/<!-- ff:langswitch -->[\s\S]*?<!-- \/ff:langswitch -->/, sw);
  else h = h.replace(/<nav class="ff-lang-bar"[\s\S]*?<\/nav>/, sw);
  const css = `<style id="ff-lang-switch-css">${SHARED_STYLES.split('\n').filter((x) => /ff-topbar|ff-lang-switch/.test(x)).join('\n')}</style>`;
  if (h.includes('<style id="ff-lang-switch-css">')) h = h.replace(/<style id="ff-lang-switch-css">[\s\S]*?<\/style>/, css);
  else h = h.replace('</head>', `  ${css}\n</head>`);
  fs.writeFileSync(p, h, 'utf-8');
}
patchStatic('libri/index.html', 'it', { ...BOOKS_PATHS }, groupAlternates(BOOKS_PATHS));

// ── 6. Sitemaps: index + pages + archive (xhtml:link alternates) ───────────
const bookFiles = fs.readdirSync(path.join(ROOT, 'book')).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
const libriFiles = fs.readdirSync(path.join(ROOT, 'libri')).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
const groupEntries = (paths, priority, changefreq) => LANG_CODES.map((lg) => ({
  loc: `${SITE}${paths[lg]}`, priority: lg === 'it' ? priority : String((Number(priority) - 0.1).toFixed(1)), changefreq, alternates: groupAlternates(paths),
}));
const staticEntries = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily', alternates: [
    { hreflang: 'it', href: `${SITE}/` },
    { hreflang: 'en', href: `${SITE}/en/` },
    { hreflang: 'hi', href: `${SITE}/hi/` },
    { hreflang: 'x-default', href: `${SITE}/` },
  ]},
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
  ...groupEntries(ARCHIVE_PATHS, '0.9', 'daily'),
  ...groupEntries(BOOKS_PATHS, '0.9', 'weekly'),
];
// make sitemap hreflang reciprocal: every member of an alternates group carries the whole group
{
  const groupOf = new Map();
  staticEntries.forEach((e) => (e.alternates || []).forEach((a) => { if (a.hreflang !== 'x-default') groupOf.set(a.href, e.alternates); }));
  staticEntries.forEach((e) => { if (!e.alternates && groupOf.has(e.loc)) e.alternates = groupOf.get(e.loc); });
}
const archiveEntries = [];
for (const o of issues) {
  for (const lg of LANG_CODES) {
    if (!indexable(lg, o.slug)) continue;
    archiveEntries.push({
      loc: issueUrl(lg, o.slug),
      priority: o.ffNum >= 150 ? (lg === 'it' ? '0.8' : '0.7') : (lg === 'it' ? '0.7' : '0.6'),
      changefreq: 'monthly',
      alternates: issueAlternates(o.slug),
    });
  }
}
const urlset = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((e) => {
  const alts = (e.alternates || []).map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />`).join('\n');
  return `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${alts ? '\n' + alts : ''}
  </url>`;
}).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap-pages.xml'), urlset(staticEntries), 'utf-8');
fs.writeFileSync(path.join(ROOT, 'sitemap-archive.xml'), urlset(archiveEntries), 'utf-8');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap-pages.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-archive.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
</sitemapindex>
`, 'utf-8');

// ── 7. Status for CI / docs ─────────────────────────────────────────────────
const status = {
  generated: TODAY,
  issues: issues.length,
  languages: Object.fromEntries(LANG_CODES.map((lg) => [lg, { fullIssues: stats[lg].full, partialIssues: stats[lg].partial, indexedIssuePages: issues.filter((o) => indexable(lg, o.slug)).length }])),
  books: bookLangStats,
  sitemap: { pages: staticEntries.length, archive: archiveEntries.length, total: staticEntries.length + archiveEntries.length },
};
fs.writeFileSync(path.join(ROOT, 'i18n', 'build-status.json'), JSON.stringify(status, null, 2) + '\n');
console.log(`✅ Archive built: ${issues.length} issues × 3 languages`);
console.log(JSON.stringify(status));
