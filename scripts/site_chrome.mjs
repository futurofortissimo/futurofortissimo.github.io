/**
 * site_chrome.mjs — shared page chrome for every static page (top bar, navigation,
 * footer, <head> extras, buttons). Used by build_archive_seo.mjs and build_static_pages.mjs.
 */
import { SITE, SUBSTACK, L, S } from './i18n_strings.mjs';
import { UI_SEO, SOCIAL } from './seo_strings.mjs';
import { escapeHtml, imgDims, cdnImg, pwaHead, LANG_CODES } from './seo_lib.mjs';

export const SHARED_STYLES = `
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

export function langSwitchHtml(lang, hrefs) {
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

export function navHtml(lang, active, hrefs) {
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

export function headExtras(lang) {
  const fonts = lang === 'hi'
    ? 'family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700'
    : 'family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700';
  const fontUrl = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
  return `
  ${pwaHead()}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://substackcdn.com" crossorigin />
  <link rel="stylesheet" href="/assets/ff-archive.css" />
  <link rel="preload" as="style" href="${fontUrl}" />
  <link rel="stylesheet" href="${fontUrl}" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="${fontUrl}" /></noscript>
  <style>${SHARED_STYLES}</style>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-NQ7MQR0VL8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NQ7MQR0VL8');
  </script>`;
}


export const subscribeCta = (lang) => `<section class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">${escapeHtml(S[lang].newsletterTitle)}</h2>
        <p class="text-sm text-black/80 mt-1">${escapeHtml(S[lang].newsletterText)}</p>
      </div>
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="px-5 py-3 border-3 border-black bg-[var(--ff-yellow)] text-black ff-button brutal-shadow hover:-translate-y-0.5 transition-transform whitespace-nowrap">${S[lang].subscribeFree}</a>
    </section>`;

/** responsive, lazy <img> with intrinsic size (no layout shift) */
export function imgTag(src, alt, { sizes = '(max-width: 1024px) 100vw, 960px', cls = 'w-full h-auto max-h-[520px] object-contain mx-auto', eager = false } = {}) {
  const d = imgDims(src);
  const cdn = cdnImg(src, 960) !== src;
  const srcset = cdn ? ` srcset="${[480, 960, 1440].filter((w) => !d || w <= d.width * 1.5).map((w) => `${escapeHtml(cdnImg(src, w))} ${w}w`).join(', ')}" sizes="${sizes}"` : '';
  const dims = d ? ` width="${d.width}" height="${d.height}"` : '';
  return `<img src="${escapeHtml(cdn ? cdnImg(src, 960) : src)}"${srcset}${dims} alt="${escapeHtml(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" class="${cls}" />`;
}
export const themesHref = (lang, key) => `${L[lang].themes}#${key}`;
export function siteFooter(lang) {
  const s = S[lang]; const u = UI_SEO[lang];
  return `<footer class="ff-footer mt-12 border-t-4 border-black bg-white" role="contentinfo">
    <div class="max-w-5xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3 text-sm">
      <div class="space-y-2">
        <p class="ff-eyebrow">Futuro Fortissimo</p>
        <p class="text-black/80">${escapeHtml(u.about)}</p>
      </div>
      <nav aria-label="${escapeHtml(u.explore)}" class="space-y-2">
        <p class="ff-eyebrow">${escapeHtml(u.explore)}</p>
        <ul class="space-y-1 font-medium">
          <li><a class="hover:underline" href="${L[lang].archive}">${escapeHtml(u.allIssues)}</a></li>
          <li><a class="hover:underline" href="${L[lang].themes}">${escapeHtml(u.themes)}</a></li>
          <li><a class="hover:underline" href="${L[lang].books}">${escapeHtml(s.books.replace(/^\S+\s/, ''))}</a></li>
          <li><a class="hover:underline" href="${L[lang].connections}">${escapeHtml(s.connections.replace(/^\S+\s/, ''))}</a></li>
          <li><a class="hover:underline" href="${L[lang].notes}">${escapeHtml(s.notes.replace(/^\S+\s/, ''))}</a></li>
          <li><a class="hover:underline" href="/book/">${escapeHtml(s.book.replace(/^\S+\s/, ''))}</a></li>
        </ul>
      </nav>
      <div class="space-y-2">
        <p class="ff-eyebrow">${escapeHtml(u.follow)}</p>
        <ul class="space-y-1 font-medium">
          <li><a class="hover:underline" href="${SUBSTACK}/" rel="me noopener" target="_blank">Substack ↗</a></li>
          <li><a class="hover:underline" href="${SOCIAL.x}" rel="me noopener" target="_blank">X ${SOCIAL.xHandle} ↗</a></li>
          <li><a class="hover:underline" href="${SOCIAL.instagram}" rel="me noopener" target="_blank">Instagram ↗</a></li>
          <li><a class="hover:underline" href="/feed.xml">RSS / Atom</a></li>
        </ul>
      </div>
    </div>
    <p class="max-w-5xl mx-auto px-4 pb-8 text-xs font-mono text-black/70">© ${new Date().getFullYear()} Michele Merelli · <a class="underline" href="/" hreflang="it" lang="it">Italiano</a> · <a class="underline" href="/en/" hreflang="en" lang="en">English</a> · <a class="underline" href="/hi/" hreflang="hi" lang="hi">हिन्दी</a></p>
  </footer>`;
}

