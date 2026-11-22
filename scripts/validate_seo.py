#!/usr/bin/env python3
"""validate_seo.py — on-page SEO checks for every indexable page of the it/en/hi site.
Errors: missing/duplicate title|description|canonical, title not 50–60 chars, description not
140–160 chars, h1 count != 1, JSON-LD parse errors, hreflang not reciprocal / missing x-default,
og:image / og:locale missing, <img> without alt. Warnings: <img> without width/height, no <main>/<footer>.
Exit code 1 on errors.  Usage: python scripts/validate_seo.py [--quiet]
"""
import glob, html, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://futurofortissimo.github.io'
quiet = '--quiet' in sys.argv
PAGES = ['index.html', 'en/index.html', 'hi/index.html', 'themes.html', 'en/themes.html', 'hi/themes.html',
         'connections.html', 'en/connections.html', 'hi/connections.html', 'note.html', 'en/note.html', 'hi/note.html',
         'libri/index.html', 'en/books/index.html', 'hi/books/index.html',
         'archivio/index.html', 'en/archive/index.html', 'hi/archive/index.html']
PAGES += sorted(os.path.relpath(p, ROOT) for g in ('archivio/*.html', 'en/archive/*.html', 'hi/archive/*.html') for p in glob.glob(os.path.join(ROOT, g)) if not p.endswith('index.html'))
errors, warns, alts_of = [], [], {}

def strip_noscript(h):
    return re.sub(r'<script(?![^>]*ld\+json)[\s\S]*?</script>', '', h)

for rel in PAGES:
    f = os.path.join(ROOT, rel)
    if not os.path.exists(f):
        errors.append(f'{rel}: missing'); continue
    h = open(f, encoding='utf-8').read()
    head = h.split('</head>')[0]
    robots = (re.search(r'<meta name="robots" content="([^"]*)"', head) or [None, ''])[1]
    if 'noindex' in robots: continue
    def one(rx, what):
        m = re.findall(rx, head, re.S)
        if len(m) != 1: errors.append(f'{rel}: {len(m)} {what}')
        return html.unescape(m[0]).strip() if m else ''
    t = one(r'<title>(.*?)</title>', 'title'); d = one(r'<meta name="description" content="([^"]*)"', 'description')
    can = one(r'<link rel="canonical" href="([^"]*)"', 'canonical')
    if t and not 50 <= len(t) <= 60: errors.append(f'{rel}: title {len(t)} chars: {t}')
    if d and not 140 <= len(d) <= 160: errors.append(f'{rel}: description {len(d)} chars')
    for prop in ('og:image', 'og:locale', 'og:title', 'og:description', 'og:url', 'twitter:card'):
        if not re.search(rf'(property|name)="{prop}" content=', head): errors.append(f'{rel}: missing {prop}')
    body = strip_noscript(h.split('</head>', 1)[-1])
    n_h1 = len(re.findall(r'<h1[\s>]', body))
    if n_h1 != 1 and not rel.endswith(('/index.html', 'index.html')) or n_h1 > 1: errors.append(f'{rel}: {n_h1} <h1>')
    elif n_h1 == 0: errors.append(f'{rel}: no static <h1>')
    for blk in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', h):
        try: json.loads(blk)
        except Exception as e: errors.append(f'{rel}: JSON-LD {e}')
    for img in re.findall(r'<img\b[^>]*>', body):
        if ' alt=' not in img: errors.append(f'{rel}: img without alt {img[:80]}')
        elif not re.search(r'\bwidth=', img): warns.append(f'{rel}: img without width/height')
    if '<main' not in body: warns.append(f'{rel}: no <main>')
    if '<footer' not in body: warns.append(f'{rel}: no <footer>')
    alts = dict(re.findall(r'<link rel="alternate" hreflang="([\w-]+)" href="([^"]+)"', head))
    if alts:
        if 'x-default' not in alts: errors.append(f'{rel}: hreflang without x-default')
        if can not in alts.values(): errors.append(f'{rel}: canonical not in its hreflang group')
        alts_of[can] = alts
for url, alts in alts_of.items():
    for hl, href in alts.items():
        if hl == 'x-default': continue
        if href not in alts_of: errors.append(f'hreflang target not crawled/indexable: {href} (from {url})')
        elif alts_of[href] != alts: errors.append(f'hreflang not reciprocal: {url} <-> {href}')
if not quiet:
    for w in sorted(set(warns))[:40]: print('WARN', w)
for e in errors[:120]: print('ERROR', e)
print(f'validate_seo: {len(PAGES)} pages, {len(errors)} errors, {len(set(warns))} warnings')
sys.exit(1 if errors else 0)
