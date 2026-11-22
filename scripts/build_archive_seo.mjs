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
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawData } from '../data.js';
import { loadTranslations, localizeIssue, buildRefContext } from './i18n_lib.mjs';
import { SITE, SUBSTACK, L, S, BOOKS_S } from './i18n_strings.mjs';
import { PAGE_SEO, UI_SEO, UI_APP, SOCIAL } from './seo_strings.mjs';
import {
  escapeHtml, safeJsonLd, clip, decodeEntities, cleanTitle, fitTitle, fitDesc, imgDims, cdnImg, metaBlock, pwaHead,
  altLinksHtml, groupAlternates, websiteLd, breadcrumbLd, PERSON, PUBLISHER, DEFAULT_OG, ROBOTS_INDEX, ROBOTS_NOINDEX,
} from './seo_lib.mjs';
import { issueMeta } from './issue_meta_lib.mjs';
import { SHARED_STYLES, langSwitchHtml, navHtml, headExtras, subscribeCta, imgTag, themesHref, siteFooter, chromeEnd, readingTools, stickySubscribe } from './site_chrome.mjs';
import { THEMES, issueThemeMap, sectionThemes } from './site_themes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const LANG_CODES = ['it', 'en', 'hi'];
const dirOf = (lang) => path.join(ROOT, L[lang].archive.replace(/^\//, ''));
LANG_CODES.forEach((lg) => fs.mkdirSync(dirOf(lg), { recursive: true }));

function escapeXml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
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
function makeDescription(ch, lang, bodyUsable) {
  const parts = [ch.subtitle];
  if (bodyUsable) parts.push((ch.subchapters || []).map((x) => (x.content || '').replace(/\s+/g, ' ').trim()).find(Boolean) || '');
  // never leak Italian body text into en/hi meta descriptions
  else parts.push([...(ch.keypoints || []), ...(ch.subchapters || []).map((x) => cleanTitle(x.title))].filter(Boolean).join(' · '));
  if (!ch.subtitle && !parts[1]) parts.push(S[lang].descFallback(cleanTitle(ch.title || '')));
  return fitDesc(parts, lang);
}
/** og:image of an issue: first image in the issue, else the Substack cover, else the site default */
function issueImage(ch, meta = {}) {
  for (const sub of ch.subchapters || []) for (const img of sub.images || []) {
    if (img?.src && /^https?:\/\//.test(img.src)) return { url: img.src, ...(imgDims(img.src) || {}), caption: img.caption || '' };
  }
  if (meta.cover) return { url: meta.cover, ...(imgDims(meta.cover) || {}) };
  return { ...DEFAULT_OG };
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
  // display copy: decode HTML entities leaking from the RSS (hashes in localizeIssue use the raw text)
  LOC.it[ch.slug] = { issue: { ...ch, title: decodeEntities(ch.title), subtitle: decodeEntities(ch.subtitle || ''), keypoints: (ch.keypoints || []).map(decodeEntities) }, status: 'full' };
  for (const lg of ['en', 'hi']) {
    const r = localizeIssue(ch, ch._idx, TR[lg], ch.slug, CTX[lg]);
    LOC[lg][ch.slug] = { issue: { ...r.issue, title: decodeEntities(r.issue.title), subtitle: decodeEntities(r.issue.subtitle || ''), keypoints: (r.issue.keypoints || []).map(decodeEntities), slug: ch.slug, ffNum: ch.ffNum }, status: r.status };
  }
}
// publication dates / covers (i18n/issue_meta.json) + theme weights + related issues
const META = Object.fromEntries(issues.map((o) => [o.slug, issueMeta(o)]));
const THEME_W = issueThemeMap(issues);
const sectionThemesOf = (o, i) => sectionThemes(o, (o.subchapters || [])[i] || {});
const themeName = (key, lang) => THEMES.find((t) => t.key === key)?.name[lang] || key;
const topThemes = (slug, n = 3) => Object.entries(THEME_W[slug] || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
// explicit cross-references: section connections pointing to other issues (by Substack post slug or /i/<id>/)
const slugByPost = {};
issues.forEach((o) => { slugByPost[(o.url || '').replace(/\/$/, '').split('/').pop()] = o.slug; if (META[o.slug].id) slugByPost[`i${META[o.slug].id}`] = o.slug; });
function linkedIssues(o) {
  const out = new Map();
  (o.subchapters || []).forEach((sub) => [...(sub.connections || []), ...(sub.references || [])].forEach((r) => {
    const u = r?.url || '';
    const m = /fortissimo\.substack\.com\/(?:p\/([^/?#]+)|i\/(\d+))/.exec(u);
    const target = m && (m[1] ? slugByPost[m[1]] : slugByPost[`i${m[2]}`]);
    if (target && target !== o.slug) out.set(target, (out.get(target) || 0) + 3);
  }));
  return out;
}
const RELATED = {};
for (const o of issues) {
  const score = linkedIssues(o);
  const mine = THEME_W[o.slug] || {};
  for (const other of issues) {
    if (other.slug === o.slug) continue;
    const w = THEME_W[other.slug] || {};
    let sc = 0;
    for (const k of Object.keys(mine)) if (w[k]) sc += Math.min(mine[k], w[k]);
    if (sc) score.set(other.slug, (score.get(other.slug) || 0) + sc + (Math.abs(other.ffNum - o.ffNum) < 15 ? 0.5 : 0));
  }
  RELATED[o.slug] = [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
}
const isoDate = (d) => (d ? new Date(d).toISOString() : undefined);
const dayOf = (d) => (d ? new Date(d).toISOString().slice(0, 10) : TODAY);
const LATEST_DATE = issues.map((o) => META[o.slug].date).filter(Boolean).sort().pop();
const fmtDate = (d, lang) => (d ? new Date(d).toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

const issueUrl = (lang, slug) => `${SITE}${L[lang].archive}${slug}.html`;
const issuePath = (lang, slug) => `${L[lang].archive}${slug}.html`;
const indexable = (lang, slug) => lang === 'it' || LOC[lang][slug].status === 'full';
/** hreflang group for an issue: only indexable versions (reciprocal by construction) */
function issueAlternates(slug) {
  const alts = LANG_CODES.filter((lg) => indexable(lg, slug)).map((lg) => ({ hreflang: lg, href: issueUrl(lg, slug) }));
  alts.push({ hreflang: 'x-default', href: issueUrl('it', slug) });
  return alts;
}
const ARCHIVE_PATHS = { it: L.it.archive, en: L.en.archive, hi: L.hi.archive };
const BOOKS_PATHS = { it: L.it.books, en: L.en.books, hi: L.hi.books };

// ── Shared chrome: scripts/site_chrome.mjs ──────────────────────────────────

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
    const meta = META[orig.slug];
    const titleText = fitTitle(ch.title, lang);
    const desc = makeDescription(ch, lang, lang === 'it' || isFull);
    const ogImage = issueImage(ch, meta);
    const imageAlt = (lang === 'it' || isFull) && ogImage.caption ? ogImage.caption : cleanTitle(ch.title);
    const alts = isFull ? issueAlternates(orig.slug) : [];
    const hrefs = Object.fromEntries(LANG_CODES.map((lg) => [lg, issuePath(lg, orig.slug)]));
    const published = isoDate(meta.date);
    const modified = isoDate(meta.updated || meta.date);
    const keyThemes = topThemes(orig.slug);

    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: clip(cleanTitle(ch.title), 110),
      description: desc,
      image: { '@type': 'ImageObject', url: ogImage.url, ...(ogImage.width ? { width: ogImage.width, height: ogImage.height } : {}) },
      inLanguage: lang,
      ...(published ? { datePublished: published, dateModified: modified } : {}),
      isAccessibleForFree: true,
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      url: pageUrl,
      sameAs: ch.url,
      author: PERSON,
      publisher: PUBLISHER,
      isPartOf: { '@type': 'Blog', name: s.blogName, url: `${SITE}${L[lang].archive}` },
      ...(keyThemes.length ? { keywords: keyThemes.map((k) => themeName(k, lang)).join(', '), about: keyThemes.map((k) => ({ '@type': 'Thing', name: themeName(k, lang) })) } : {}),
      articleSection: (ch.subchapters || []).map((x) => cleanTitle(x.title)).filter(Boolean).slice(0, 12),
    };
    if (lang === 'it') {
      const tr = ['en', 'hi'].filter((lg) => indexable(lg, orig.slug));
      if (tr.length) articleLd.workTranslation = tr.map((lg) => ({ '@type': 'BlogPosting', '@id': issueUrl(lg, orig.slug), inLanguage: lg }));
    } else {
      articleLd.translationOfWork = { '@type': 'BlogPosting', '@id': issueUrl('it', orig.slug), inLanguage: 'it' };
    }
    const breadcrumbJson = breadcrumbLd([[s.crumbHome, `${SITE}${L[lang].home}`], [s.crumbArchive, `${SITE}${L[lang].archive}`], [cleanTitle(ch.title), pageUrl]]);

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
          ${imgTag(img.src, alt)}
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
              return `<a href="${escapeHtml(r.url)}" target="_blank" rel="${rel}"${lang !== 'it' && !tr ? ` title="${escapeHtml(r._src ?? r.text)}" lang="it"` : ''} class="inline-flex items-center min-h-[44px] px-3 py-1.5 border-2 border-black ${isAmzn ? 'bg-[var(--ff-yellow)]' : 'bg-white'} text-xs font-mono font-bold hover:underline">${isAmzn ? '📚 ' : '↗ '}${escapeHtml(label)}</a>`;
            }).join('\n            ')}
          </div>
        </div>` : '';
      const paragraphs = (sub.content || '').split(/\n+/).map((p) => p.trim()).filter(Boolean)
        .map((p) => `<p class="text-base leading-relaxed text-black/90">${escapeHtml(p)}</p>`).join('\n        ');
      const titleLang = lang === 'it' ? 'it' : sub._titleLang;
      return `<section id="${anchor}" class="brutal-card no-round space-y-3 scroll-mt-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <h2${langAttr(titleLang)} class="text-lg sm:text-xl font-bold text-black">${escapeHtml(sub.title || `${s.section} ${sIdx + 1}`)}</h2>
        ${sub.link ? `<a href="${escapeHtml(sub.link)}" target="_blank" rel="noopener noreferrer" class="ff-btn ff-btn-ghost ff-btn-sm" aria-label="Substack ↗ ${escapeHtml(cleanTitle(sub.title || ''))}">Substack ↗</a>` : ''}
      </div>
      <div class="space-y-3"${langAttr(bodyLang)}>
        ${paragraphs}
      </div>
      ${imgsHtml}
      ${refsHtml}
    </section>`;
    }).join('\n\n    ');

    const tocHtml = (ch.subchapters || []).length > 1 ? `<nav aria-label="${escapeHtml(s.tocLabel)}" class="ff-toc mt-5 pt-4 border-t-2 border-black/15">
        <h2 class="ff-eyebrow text-black/70 mb-2">${escapeHtml(s.inThisIssue)}</h2>
        <ol>
          ${(ch.subchapters || []).map((sub, sIdx) => `<li><a href="#${anchorOf(orig.subchapters[sIdx] || sub, sIdx)}"${langAttr(lang === 'it' ? 'it' : sub._titleLang)}>${escapeHtml(sub.title)}</a></li>`).join('\n          ')}
        </ol>
      </nav>` : '';

    const partialNotice = lang !== 'it' && !isFull ? `<aside class="brutal-card accent-bar accent-yellow no-round flex flex-col sm:flex-row sm:items-center justify-between gap-3" role="note">
      <p class="text-sm font-medium">🌐 ${escapeHtml(s.partialNotice)}</p>
      <a href="${issuePath('it', orig.slug)}" hreflang="it" class="px-3 py-1.5 border-2 border-black bg-white ff-button text-xs whitespace-nowrap">IT · Italiano →</a>
    </aside>` : '';

    const u = UI_SEO[lang];
    const relatedHtml = (RELATED[orig.slug] || []).length ? `<section aria-labelledby="rel-h" class="brutal-card no-round space-y-3">
      <h2 id="rel-h" class="text-lg font-bold">${escapeHtml(u.related)}</h2>
      <ul class="grid gap-3 sm:grid-cols-2">
        ${RELATED[orig.slug].map((sl) => {
          const r = LOC[lang][sl].issue;
          const rl = lang !== 'it' && r._lang !== lang ? ' lang="it"' : '';
          return `<li class="border-2 border-black p-3 bg-white"><a href="${issuePath(lang, sl)}" class="font-bold hover:underline"${rl}>${escapeHtml(cleanTitle(r.title))}</a>${r.subtitle ? `<p class="text-sm text-black/75 mt-1"${rl}>${escapeHtml(clip(r.subtitle, 110))}</p>` : ''}</li>`;
        }).join('\n        ')}
      </ul>
    </section>` : '';
    const themeChips = keyThemes.length ? `<p class="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono"><span class="ff-eyebrow text-black/70">${escapeHtml(u.themesOf)}</span>${keyThemes.map((k) => `<a href="${themesHref(lang, k)}" class="px-2 py-1 border-2 border-black bg-white hover:bg-[var(--ff-yellow)] font-bold">${THEMES.find((t) => t.key === k).emoji} ${escapeHtml(themeName(k, lang))}</a>`).join('')}</p>` : '';
    const dateHtml = published ? `<p class="mt-2 text-xs font-mono text-black/70">${escapeHtml(u.published)} <time datetime="${published}">${escapeHtml(fmtDate(published, lang))}</time> · Michele Merelli</p>` : '';

    const html = `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  ${metaBlock({ lang, title: titleText, desc, url: pageUrl, image: ogImage, imageAlt, type: 'article', robots: (lang === 'it' || isFull) ? ROBOTS_INDEX : ROBOTS_NOINDEX, alts, published, modified })}

  <script type="application/ld+json">${safeJsonLd(articleLd)}</script>
  <script type="application/ld+json">${safeJsonLd(breadcrumbJson)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round ff-has-tabbar">
  ${readingTools(lang)}
  ${navHtml(lang, 'archivio', hrefs)}

  <main id="main" class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <nav aria-label="Breadcrumb" class="text-xs font-mono"><ol class="flex flex-wrap gap-1"><li><a class="underline" href="${L[lang].home}">${escapeHtml(s.crumbHome)}</a> /</li><li><a class="underline" href="${L[lang].archive}">${escapeHtml(s.crumbArchive)}</a> /</li><li aria-current="page"${metaLang}>${escapeHtml(cleanTitle(ch.title))}</li></ol></nav>
    <article class="space-y-6" aria-labelledby="issue-title" data-ff-article>
    <header class="brutal-card accent-bar accent-blue no-round">
      <p class="ff-eyebrow text-black/70 mb-3">${escapeHtml(s.eyebrow)}</p>
      <h1 id="issue-title"${metaLang} class="text-2xl sm:text-3xl font-bold text-black">${escapeHtml(ch.title)}</h1>
      ${ch.subtitle ? `<p${metaLang} class="mt-3 text-base sm:text-lg text-black/80 font-medium">${escapeHtml(ch.subtitle)}</p>` : ''}
      ${dateHtml}
      <div class="ff-btn-row mt-4">
        <button type="button" class="ff-btn ff-btn-sm" data-ff-share data-url="${pageUrl}" data-done="${escapeHtml(UI_APP[lang].copied)}"><span aria-hidden="true">↗</span> ${escapeHtml(UI_APP[lang].share)}</button>
        <button type="button" class="ff-btn ff-btn-sm" data-ff-copy data-url="${pageUrl}" data-done="${escapeHtml(UI_APP[lang].copied)}"><span aria-hidden="true">🔗</span> ${escapeHtml(UI_APP[lang].copy)}</button>
        <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="ff-btn ff-btn-ghost ff-btn-sm">${escapeHtml(s.readOriginal)}</a>
      </div>
      ${keypointsHtml}
      ${themeChips}
      ${tocHtml}
    </header>

    ${partialNotice}

    ${subchaptersHtml}
    </article>

    ${relatedHtml}

    ${subscribeCta(lang)}

    <nav aria-label="${escapeHtml(s.adjacent)}" class="ff-pn">
      ${older ? `<a href="${issuePath(lang, older.slug)}" rel="prev"><span class="ff-pn-l">← ${escapeHtml(UI_APP[lang].prev)}</span><span class="ff-pn-t">${escapeHtml(cleanTitle(older.title))}</span></a>` : '<span></span>'}
      ${newer ? `<a href="${issuePath(lang, newer.slug)}" rel="next" class="ff-next"><span class="ff-pn-l">${escapeHtml(UI_APP[lang].next)} →</span><span class="ff-pn-t">${escapeHtml(cleanTitle(newer.title))}</span></a>` : '<span></span>'}
    </nav>
  </main>

  ${siteFooter(lang)}
  ${stickySubscribe(lang)}
  ${chromeEnd(lang, 'archivio')}
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
    description: PAGE_SEO.archive[lang].desc(n),
    url,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'Futuro Fortissimo', url: `${SITE}/` },
    author: PERSON,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: n,
      itemListElement: issues.slice(0, 30).map((o, i) => ({ '@type': 'ListItem', position: i + 1, url: issueUrl(lang, o.slug), name: cleanTitle(LOC[lang][o.slug].issue.title) })),
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
        <a href="${L[lang].books}" class="ff-btn">${s.books}</a>
        <a href="${L[lang].themes}" class="ff-btn">${s.themes}</a>
      </div>
    </section>`;
  const fullCount = stats[lang].full;
  const filterPills = lang === 'it' ? '' : `<div class="flex flex-wrap gap-2" role="group">
        <button type="button" data-f="all" aria-pressed="true" class="ff-f ff-btn ff-btn-sm ff-btn-ghost bg-[var(--ff-yellow)]">${escapeHtml(s.filterAll)} · ${n}</button>
        <button type="button" data-f="full" aria-pressed="false" class="ff-f ff-btn ff-btn-sm ff-btn-ghost bg-white">${escapeHtml(s.filterFull)} · ${fullCount}</button>
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
            <h2${ml} class="text-lg font-bold"><a href="${issuePath(lang, o.slug)}" class="hover:underline inline-flex min-h-[44px] items-center">${escapeHtml(ch.title)}</a></h2>
            <a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" class="ff-btn ff-btn-ghost ff-btn-sm" aria-label="Substack ↗ ${escapeHtml(cleanTitle(ch.title))}">Substack ↗</a>
          </div>
          ${META[o.slug].date ? `<p class="text-xs font-mono text-black/70"><time datetime="${isoDate(META[o.slug].date)}">${escapeHtml(fmtDate(META[o.slug].date, lang))}</time></p>` : ''}
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  ${metaBlock({ lang, title: PAGE_SEO.archive[lang].title(n), desc: PAGE_SEO.archive[lang].desc(n), url, type: 'website', robots: ROBOTS_INDEX, alts: groupAlternates(ARCHIVE_PATHS) })}

  <script type="application/ld+json">${safeJsonLd(ld)}</script>
  <script type="application/ld+json">${safeJsonLd(websiteLd(lang))}</script>
  <script type="application/ld+json">${safeJsonLd(crumbs)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round ff-has-tabbar">
  ${navHtml(lang, 'archivio', hrefs)}

  <main id="main" class="max-w-5xl mx-auto px-4 py-8 space-y-6">
    ${intro}
    <section class="brutal-card accent-bar accent-yellow no-round space-y-4">
      <div class="ff-eyebrow text-black/70">${escapeHtml(s.idxEyebrow(n))}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">${escapeHtml(s.idxH1)}</h1>
      <p class="text-base text-black/80">${s.idxIntro}</p>
      <div role="search">
        <label for="q" class="sr-only">${escapeHtml(s.idxFilter)}</label>
        <input id="q" type="search" data-ff-local-search placeholder="${escapeHtml(s.idxFilter)}" class="w-full min-h-[48px] px-4 border-3 border-black bg-white text-base font-medium" />
        <p id="q-count" class="mt-2 text-xs font-mono text-black/70" aria-live="polite"></p>
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
        let shown = 0;
        items.forEach((el) => {
          const okTerm = !term || el.dataset.search.includes(term);
          const okMode = mode === 'all' || el.dataset.status === 'full';
          el.style.display = okTerm && okMode ? '' : 'none';
          if (okTerm && okMode) shown++;
        });
        document.getElementById('q-count').textContent = shown + ' / ' + items.length;
      };
      const pre = new URLSearchParams(location.search).get('q');
      if (pre) q.value = pre;
      q.addEventListener('input', apply);
      document.querySelectorAll('.ff-f').forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.f;
        document.querySelectorAll('.ff-f').forEach((x) => {
          x.classList.toggle('bg-[var(--ff-yellow)]', x === b);
          x.classList.toggle('bg-white', x !== b);
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        apply();
      }));
      apply();
    })();
  </script>
  ${siteFooter(lang)}
  ${chromeEnd(lang, 'archivio')}
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
            <a href="${escapeHtml(b.amazonUrl)}" target="_blank" rel="noopener noreferrer sponsored" class="ff-btn ff-btn-accent ff-btn-sm">${escapeHtml(bs.buy)}</a>
          </div>
        </article>`;
  }).join('\n        ');
  bookLangStats[lang] = { books: books.length, citations: totalCites, missingTitles };

  const url = `${SITE}${L[lang].books}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: bs.ogTitle,
    description: PAGE_SEO.books[lang].desc(books.length, totalCites),
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  ${metaBlock({ lang, title: PAGE_SEO.books[lang].title(books.length), desc: PAGE_SEO.books[lang].desc(books.length, totalCites), url, type: 'website', robots: ROBOTS_INDEX, alts: groupAlternates(BOOKS_PATHS) })}

  <script type="application/ld+json">${safeJsonLd(ld)}</script>
  <script type="application/ld+json">${safeJsonLd(crumbs)}</script>
  ${headExtras(lang)}
</head>
<body class="bg-white text-black antialiased no-round ff-has-tabbar">
  ${navHtml(lang, 'libri', { ...BOOKS_PATHS })}

  <main id="main" class="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <section class="brutal-card accent-bar accent-yellow no-round space-y-4">
      <div class="ff-eyebrow text-black/70">${escapeHtml(bs.eyebrow(books.length, totalCites))}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">${escapeHtml(bs.h1)}</h1>
      <p class="text-base text-black/80">${escapeHtml(bs.intro)}</p>
      <p class="text-xs font-mono border-2 border-black bg-gray-50 px-3 py-2">${escapeHtml(bs.disclosure)}</p>
      <label for="q" class="sr-only">${escapeHtml(bs.filter)}</label>
      <input id="q" type="search" data-ff-local-search placeholder="${escapeHtml(bs.filter)}" class="w-full min-h-[48px] px-4 border-3 border-black bg-white text-base font-medium" />
      <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="${escapeHtml(UI_SEO[lang].themes)}">
        <button type="button" data-theme="ALL" aria-pressed="true" class="theme-pill ff-btn ff-btn-sm ff-btn-ghost bg-[var(--ff-yellow)]">${escapeHtml(bs.all)}</button>
        ${themes.map((t) => `<button type="button" data-theme="${escapeHtml(t)}" aria-pressed="false" class="theme-pill ff-btn ff-btn-sm ff-btn-ghost bg-white">${escapeHtml(themeName(t))}</button>`).join('\n        ')}
      </div>
    </section>

    <section id="grid" class="grid grid-cols-1 md:grid-cols-2 gap-5" aria-live="polite">
        ${cards}
    </section>
    <p id="empty" class="hidden brutal-card no-round text-center font-mono font-bold">${escapeHtml(bs.empty)}</p>

    <section data-ff-end-cta class="brutal-card accent-bar accent-green no-round flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="ff-eyebrow text-black/80">Newsletter</div>
        <h2 class="text-lg font-bold mt-1">${escapeHtml(bs.ctaTitle)}</h2>
        <p class="text-sm text-black/80 mt-1">${escapeHtml(bs.ctaText)}</p>
      </div>
      <a href="${SUBSTACK}/subscribe" target="_blank" rel="noopener noreferrer" class="ff-btn ff-btn-primary">${S[lang].subscribeFree}</a>
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
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        apply();
      }));
    })();
  </script>
  ${siteFooter(lang)}
  ${chromeEnd(lang, 'libri')}
  <script type="module" src="/analytics.js"></script>
</body>
</html>
`;
  const dir = path.join(ROOT, L[lang].books.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
}

// ── 4. Home pages (it/en/hi): SEO head + JSON-LD are written by build_static_pages.mjs ──

// ── 5. /libri/ chrome + SEO head: build_static_pages.mjs ──

// ── 6. Sitemaps: index + pages + archive (xhtml:link alternates) ───────────
const LATEST_DAY = dayOf(LATEST_DATE);
function gitDay(rel) {
  try { const d = execSync(`git log -1 --format=%cI -- "${rel}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); return d ? d.slice(0, 10) : LATEST_DAY; } catch { return LATEST_DAY; }
}
const bookFiles = fs.readdirSync(path.join(ROOT, 'book')).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
const libriFiles = fs.readdirSync(path.join(ROOT, 'libri')).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
const groupEntries = (paths, priority, changefreq) => LANG_CODES.map((lg) => ({
  lastmod: LATEST_DAY,
  loc: `${SITE}${paths[lg]}`, priority: lg === 'it' ? priority : String((Number(priority) - 0.1).toFixed(1)), changefreq, alternates: groupAlternates(paths),
}));
const staticEntries = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily', lastmod: LATEST_DAY, alternates: [
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
  ...groupEntries({ it: L.it.notes, en: L.en.notes, hi: L.hi.notes }, '0.7', 'weekly'),
  ...groupEntries({ it: L.it.themes, en: L.en.themes, hi: L.hi.themes }, '0.8', 'weekly'),
  ...groupEntries({ it: L.it.connections, en: L.en.connections, hi: L.hi.connections }, '0.7', 'monthly'),
  { loc: `${SITE}/strumenti.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/book/`, priority: '0.9', changefreq: 'weekly' },
  ...bookFiles.map((f) => ({ loc: `${SITE}/book/${f}`, priority: /^chapter-\d+\.html$/.test(f) ? '0.8' : '0.6', changefreq: 'monthly', lastmod: gitDay(`book/${f}`) })),
  ...libriFiles.map((f) => ({ loc: `${SITE}/libri/${f}`, priority: '0.7', changefreq: 'monthly', lastmod: gitDay(`libri/${f}`) })),
  { loc: `${SITE}/en/nature/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/technology/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/en/society/`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${SITE}/hi/prakriti/`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/taknik/`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/hi/samaj/`, priority: '0.5', changefreq: 'monthly' },
  ...groupEntries({ it: L.it.home, en: L.en.home, hi: L.hi.home }, '1.0', 'daily').slice(1),
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
      lastmod: dayOf(META[o.slug].updated || META[o.slug].date),
      image: issueImage(LOC[lg][o.slug].issue, META[o.slug]).url,
      alternates: issueAlternates(o.slug),
    });
  }
}
const urlset = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((e) => {
  const alts = (e.alternates || []).map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />`).join('\n');
  return `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod || LATEST_DAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${e.image && e.image !== DEFAULT_OG.url ? `\n    <image:image><image:loc>${escapeXml(e.image)}</image:loc></image:image>` : ''}${alts ? '\n' + alts : ''}
  </url>`;
}).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap-pages.xml'), urlset(staticEntries), 'utf-8');
fs.writeFileSync(path.join(ROOT, 'sitemap-archive.xml'), urlset(archiveEntries), 'utf-8');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap-pages.xml</loc><lastmod>${LATEST_DAY}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-archive.xml</loc><lastmod>${LATEST_DAY}</lastmod></sitemap>
</sitemapindex>
`, 'utf-8');

// ── 6b. Site index per language (search overlay, home cards, themes pages) ──
fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
for (const lang of LANG_CODES) {
  const rows = issues.map((o) => {
    const ch = LOC[lang][o.slug].issue;
    const img = issueImage(ch, META[o.slug]);
    return {
      s: o.slug, n: o.ffNum, t: cleanTitle(ch.title), st: ch.subtitle || '', u: issuePath(lang, o.slug), d: dayOf(META[o.slug].date),
      img: img.url === DEFAULT_OG.url ? '' : img.url, th: topThemes(o.slug),
      sec: (ch.subchapters || []).map((x, i) => ({ t: cleanTitle(x.title), a: anchorOf(o.subchapters[i] || x, i), th: sectionThemesOf(o, i) })),
      ...(lang !== 'it' && ch._lang !== lang ? { it: 1 } : {}),
    };
  });
  fs.writeFileSync(path.join(ROOT, 'assets', `site-index-${lang}.json`), JSON.stringify(rows) + '\n');
}

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
