/**
 * seo_lib.mjs — shared SEO helpers for the static generators
 * (build_archive_seo.mjs, build_static_pages.mjs).
 */
import { SITE, SUBSTACK, L } from './i18n_strings.mjs';
import { SOCIAL, DESC_TAIL, TITLE_SUFFIXES } from './seo_strings.mjs';

export const LANG_CODES = ['it', 'en', 'hi'];
export const DEFAULT_OG = { url: `${SITE}/assets/og-default.png`, width: 1200, height: 630 };
export const ROBOTS_INDEX = 'index, follow, max-snippet:-1, max-image-preview:large';
export const ROBOTS_NOINDEX = 'noindex, follow';

export function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/** decode the few HTML entities that leak from the Substack RSS (&#8217; &amp; …) */
export const decodeEntities = (s = '') => String(s)
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
export const safeJsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
export const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:·—–-]+\S*$/, '').replace(/[\s,;:·—–-]+$/, '') + '…');
/** strip leading emoji/pictographs and squeeze spaces */
export const cleanTitle = (t = '') => String(t).replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s+/g, ' ').trim();

/** a title in the 50–60 char window: base + the first suffix that fits (base clipped when too long) */
export function fitTitle(base, lang, min = 50, max = 60) {
  const b = cleanTitle(base);
  const sfx = TITLE_SUFFIXES[lang] || TITLE_SUFFIXES.it;
  const cands = [];
  for (const x of sfx) {
    cands.push(b + x);
    const room = max - x.length;
    if (b.length > room && room > 12) {
      let cut = b.slice(0, room - 1);
      const sp = cut.lastIndexOf(' ');
      if (sp > room - 10) cut = cut.slice(0, sp);
      cands.push(cut.replace(/[\s,;:·—–-]+$/, '') + '…' + x);
    }
  }
  const ok = cands.filter((t) => t.length >= min && t.length <= max);
  if (ok.length) return ok.find((t) => t.startsWith(b)) || ok[0];
  return cands.filter((t) => t.length <= max).sort((a, c) => c.length - a.length)[0] || clip(b, max);
}

/** a description in the 140–160 window, built from the given parts + a language tail */
export function fitDesc(parts, lang, min = 140, max = 160) {
  const seen = new Set();
  const clean = parts.map((p) => String(p || '').replace(/\s+/g, ' ').trim()).filter((p) => p && !seen.has(p) && seen.add(p));
  let out = '';
  for (const p of clean) {
    const next = out ? `${out}${/[.!?…]$/.test(out) ? ' ' : '. '}${p}` : p;
    out = next;
    if (out.length >= min) break;
  }
  if (out.length < min) out = out ? `${out}${/[.!?…]$/.test(out) ? ' ' : '. '}${DESC_TAIL[lang]}` : DESC_TAIL[lang];
  if (out.length > max) out = clip(out, max);
  if (out.length < min) out = clip(`${out} ${DESC_TAIL[lang]}`, max);
  return out;
}

/** width/height encoded in Substack image URLs (…_1236x1273.png); null when unknown */
export function imgDims(src = '') {
  const m = /_(\d{2,5})x(\d{2,5})\.(?:jpe?g|png|gif|webp|heic)/i.exec(src);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}
/** Substack CDN resize (smaller, faster images). Leaves non-Substack URLs untouched. */
export function cdnImg(src, w) {
  if (!/^https:\/\/substack-post-media\.s3\.amazonaws\.com\//.test(src)) return src;
  return `https://substackcdn.com/image/fetch/w_${w},c_limit,f_auto,q_auto:good,fl_progressive:steep/${encodeURIComponent(src)}`;
}

export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#michele-merelli`,
  name: 'Michele Merelli',
  url: `${SUBSTACK}/`,
  sameAs: [SOCIAL.substack, SOCIAL.x, SOCIAL.instagram],
};
export const PUBLISHER = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Futuro Fortissimo',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/assets/icons/icon-512.png`, width: 512, height: 512 },
  founder: { '@id': `${SITE}/#michele-merelli` },
  sameAs: [SOCIAL.substack, SOCIAL.x, SOCIAL.instagram],
};
export function websiteLd(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    name: 'Futuro Fortissimo',
    alternateName: 'FF',
    url: `${SITE}${L[lang].home}`,
    inLanguage: lang,
    publisher: { '@id': `${SITE}/#organization` },
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}${L[lang].archive}?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
  };
}
export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

export const altLinksHtml = (alts) => alts.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`).join('\n  ');
/** hreflang group: it/en/hi + x-default (Italian) */
export const groupAlternates = (paths) => [
  ...LANG_CODES.map((lg) => ({ hreflang: lg, href: `${SITE}${paths[lg]}` })),
  { hreflang: 'x-default', href: `${SITE}${paths.it}` },
];

/** <title>, description, canonical, hreflang, OG + Twitter (one block, page language) */
export function metaBlock({ lang, title, desc, url, image = DEFAULT_OG, imageAlt, type = 'website', robots = ROBOTS_INDEX, alts = [], published, modified }) {
  const others = LANG_CODES.filter((lg) => lg !== lang).map((lg) => `<meta property="og:locale:alternate" content="${L[lg].locale}" />`).join('\n  ');
  const img = typeof image === 'string' ? { url: image } : image;
  const alt = imageAlt || title;
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
  <meta property="og:image" content="${escapeHtml(img.url)}" />
  ${img.width ? `<meta property="og:image:width" content="${img.width}" />\n  <meta property="og:image:height" content="${img.height}" />` : ''}
  <meta property="og:image:alt" content="${escapeHtml(alt)}" />
  ${published ? `<meta property="article:published_time" content="${published}" />` : ''}
  ${modified ? `<meta property="article:modified_time" content="${modified}" />` : ''}
  ${type === 'article' ? '<meta property="article:author" content="Michele Merelli" />' : ''}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="${SOCIAL.xHandle}" />
  <meta name="twitter:creator" content="${SOCIAL.xHandle}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${escapeHtml(img.url)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(alt)}" />`.split('\n').filter((l, i, arr) => l.trim() || (arr[i - 1] || '').trim()).join('\n');
}

/** icons, manifest, theme colour, feed (shared by every page) */
export const pwaHead = () => `<meta name="theme-color" content="#0a0a0a" />
  <meta name="color-scheme" content="light" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Fortissimo" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/assets/icons/icon-192.png" type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="alternate" type="application/atom+xml" title="Futuro Fortissimo Feed" href="/feed.xml" />`;
