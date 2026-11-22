/**
 * site_chrome.mjs — shared page chrome for every static page (top bar, navigation,
 * footer, <head> extras, buttons). Used by build_archive_seo.mjs and build_static_pages.mjs.
 */
import { SITE, SUBSTACK, L, S } from './i18n_strings.mjs';
import { UI_SEO, UI_APP, SOCIAL } from './seo_strings.mjs';
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
  const items = LANG_CODES.map((lg) => `<a href="${escapeHtml(hrefs[lg])}" hreflang="${lg}" lang="${lg}" title="${escapeHtml(L[lg].name)}" data-keep-state${lg === lang ? ' aria-current="page"' : ''}>${L[lg].label}</a>`).join('');
  return `<div class="ff-lang" role="group" aria-label="${escapeHtml(S[lang].langLabel)}">${items}</div>`;
}
const noEmoji = (s) => s.replace(/^\S+\s/, '');
/**
 * App shell: sticky top bar (brand · primary nav · search · language · subscribe · more menu),
 * mobile bottom tab bar, global search dialog. `active`: home | archivio | themes | libri | connections | note | book
 */
export function navHtml(lang, active, hrefs) {
  const s = S[lang]; const a = UI_APP[lang];
  const cur = (k) => (active === k ? ' aria-current="page"' : '');
  const primary = [['home', L[lang].home, a.tabHome], ['archivio', L[lang].archive, a.tabArchive], ['themes', L[lang].themes, a.tabThemes], ['libri', L[lang].books, a.tabBooks]];
  const secondary = [
    ['book', '/book/', s.book], ...(lang === 'it' ? [['ffxy', '/book/ffxy-index.html', s.ffxy]] : []),
    ['connections', L[lang].connections, s.connections], ['note', L[lang].notes, s.notes],
  ];
  return `<a class="ff-skip" href="#main">${escapeHtml(a.skip)}</a>
  <header class="ff-appbar">
    <div class="ff-appbar-in">
      <a href="${L[lang].home}" class="ff-brand" aria-label="Futuro Fortissimo — ${escapeHtml(a.tabHome)}"><img src="/assets/icons/icon-192.png" alt="" width="30" height="30" /><span>Fortissimo</span></a>
      <nav class="ff-primary" aria-label="${escapeHtml(s.navLabel)}">
        ${primary.map(([k, href, label]) => `<a href="${href}"${cur(k)}>${escapeHtml(label)}</a>`).join('\n        ')}
      </nav>
      <div class="ff-actions">
        <button type="button" class="ff-search-btn" data-ff-search aria-label="${escapeHtml(a.search)} (/)" aria-haspopup="dialog" aria-controls="ff-search"><span aria-hidden="true">🔍</span><span class="ff-l">${escapeHtml(a.search)}</span><kbd aria-hidden="true">/</kbd></button>
        ${langSwitchHtml(lang, hrefs)}
        ${active === 'home' ? '' : `<a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener" class="ff-btn ff-btn-primary">${escapeHtml(noEmoji(s.subscribe))}</a>`}
        <details class="ff-more">
          <summary aria-label="${escapeHtml(a.more)}"><span aria-hidden="true">☰</span><span class="sr-only">${escapeHtml(a.more)}</span></summary>
          <nav class="ff-menu" aria-label="${escapeHtml(a.more)}">
            ${secondary.map(([k, href, label]) => `<a href="${href}"${cur(k)}>${escapeHtml(label)}</a>`).join('\n            ')}
            <hr />
            <a class="ff-menu-sub" href="${SUBSTACK}/subscribe" target="_blank" rel="noopener">${escapeHtml(s.subscribe)} ↗</a>
          </nav>
        </details>
      </div>
    </div>
  </header>`;
}
/** mobile bottom tab bar + search dialog + app script (place right before </body>) */
export function chromeEnd(lang, active) {
  const a = UI_APP[lang];
  const tab = (k, href, icon, label) => `<a href="${href}"${active === k ? ' aria-current="page"' : ''}><span class="ff-ti" aria-hidden="true">${icon}</span>${escapeHtml(label)}</a>`;
  return `<nav class="ff-tabbar" aria-label="${escapeHtml(S[lang].navLabel)}">
    ${tab('home', L[lang].home, '🏠', a.tabHome)}
    ${tab('archivio', L[lang].archive, '🗂', a.tabArchive)}
    ${tab('themes', L[lang].themes, '🧭', a.tabThemes)}
    ${tab('libri', L[lang].books, '📚', a.tabBooks)}
    <button type="button" data-ff-search aria-haspopup="dialog" aria-controls="ff-search"><span class="ff-ti" aria-hidden="true">🔍</span>${escapeHtml(a.tabSearch)}</button>
  </nav>
  <dialog id="ff-search" class="ff-search" aria-label="${escapeHtml(a.search)}" data-empty="${escapeHtml(a.searchEmpty)}">
    <form role="search">
      <label for="ff-q" class="sr-only">${escapeHtml(a.search)}</label>
      <input id="ff-q" type="search" autocomplete="off" placeholder="${escapeHtml(a.searchPh)}" aria-controls="ff-results" />
      <button type="button" class="ff-btn ff-btn-icon" data-ff-close aria-label="${escapeHtml(a.close)}">✕</button>
    </form>
    <ul id="ff-results" role="listbox" aria-label="${escapeHtml(a.search)}"></ul>
    <div class="ff-s-foot"><a href="${L[lang].archive}" data-ff-all data-base="${L[lang].archive}">${escapeHtml(a.searchAll)}</a><span>${escapeHtml(a.hint)}</span></div>
  </dialog>
  <script src="/assets/ff-app.js" defer></script>`;
}
export const chromeHead = () => '<link rel="stylesheet" href="/assets/ff-app.css" />';

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
  ${chromeHead()}
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


export const subscribeCta = (lang) => `<section data-ff-end-cta class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">${escapeHtml(S[lang].newsletterTitle)}</h2>
        <p class="text-sm text-black/80 mt-1">${escapeHtml(S[lang].newsletterText)}</p>
      </div>
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="ff-btn ff-btn-primary">${S[lang].subscribeFree}</a>
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
          <li><a class="hover:underline" href="https://www.paypal.com/paypalme/MicheleMerelli" rel="noopener" target="_blank">${escapeHtml(UI_APP[lang].support)} ↗</a></li>
          <li><a class="hover:underline" href="https://micmer-git.github.io/" rel="noopener" target="_blank">${escapeHtml(UI_APP[lang].projects)} ↗</a></li>
        </ul>
      </div>
    </div>
    <p class="max-w-5xl mx-auto px-4 pb-8 text-xs font-mono text-black/70">© ${new Date().getFullYear()} Michele Merelli · <a class="underline" href="/" hreflang="it" lang="it">Italiano</a> · <a class="underline" href="/en/" hreflang="en" lang="en">English</a> · <a class="underline" href="/hi/" hreflang="hi" lang="hi">हिन्दी</a></p>
  </footer>`;
}


/** issue pages: reading progress + sticky subscribe (mobile above the tab bar, desktop bottom-right) */
export const readingTools = (lang) => `<div class="ff-progress" aria-hidden="true"><span></span></div>`;
export const stickySubscribe = (lang) => `<aside class="ff-sticky-sub" aria-label="Newsletter">
    <p>${escapeHtml(UI_APP[lang].stickySub)}</p>
    <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener" class="ff-btn ff-btn-primary ff-btn-sm">${escapeHtml(noEmoji(S[lang].subscribe))}</a>
    <button type="button" class="ff-btn ff-btn-ghost ff-btn-icon" data-ff-dismiss aria-label="${escapeHtml(UI_APP[lang].dismiss)}">✕</button>
  </aside>`;
