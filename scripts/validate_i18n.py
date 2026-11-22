#!/usr/bin/env python3
"""validate_i18n.py — checks for the trilingual static archive.
- sitemaps parse; every <loc> exists on disk
- every generated page: JSON-LD parses, has lang/canonical/title/description
- hreflang reciprocity (pages + sitemap)
- internal links resolve
- leftover Italian heuristic on indexable en/hi pages (outside lang="it" blocks)
Exit code 1 on hard errors.
"""
import json, os, re, sys, glob
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://futurofortissimo.github.io'
errors, warns = [], []

def url_to_file(u):
    p = u.replace(SITE, '').split('#')[0].split('?')[0]
    if p.endswith('/'): p += 'index.html'
    return os.path.join(ROOT, p.lstrip('/'))

# 1. sitemaps
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
idx = ET.parse(os.path.join(ROOT, 'sitemap.xml')).getroot()
sm_alts = {}
total = 0
for sm in idx.findall('s:sitemap/s:loc', ns):
    f = url_to_file(sm.text)
    tree = ET.parse(f).getroot()
    for u in tree.findall('s:url', ns):
        loc = u.find('s:loc', ns).text
        total += 1
        if not os.path.exists(url_to_file(loc)) and not loc.endswith('.xml'):
            errors.append(f'sitemap loc missing on disk: {loc}')
        alts = {a.get('hreflang'): a.get('href') for a in u.findall('x:link', ns)}
        if alts: sm_alts[loc] = alts
for loc, alts in sm_alts.items():
    for hl, href in alts.items():
        if hl == 'x-default': continue
        back = sm_alts.get(href)
        if back is None: errors.append(f'sitemap alt target has no alternates entry: {href} (from {loc})')
        elif back != alts: errors.append(f'sitemap hreflang not reciprocal: {loc} <-> {href}')

# 2. pages
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.lang=None; s.canon=None; s.alts={}; s.ld=[]; s._ld=False; s.title=''; s._t=False
        s.desc=None; s.robots=''; s.links=[]; s.stack=[]; s.text_nonit=[]; s.it_depth=0
    def handle_starttag(s, tag, a):
        a = dict(a)
        if tag == 'html': s.lang = a.get('lang')
        if tag == 'link' and a.get('rel') == 'canonical': s.canon = a.get('href')
        if tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'): s.alts[a['hreflang']] = a['href']
        if tag == 'meta' and a.get('name') == 'description': s.desc = a.get('content')
        if tag == 'meta' and a.get('name') == 'robots': s.robots = a.get('content', '')
        if tag == 'script' and a.get('type') == 'application/ld+json': s._ld = True; s.ld.append('')
        if tag == 'title': s._t = True
        if tag == 'a' and a.get('href'): s.links.append(a['href'])
        if tag not in ('img','br','meta','link','input','hr','source'):
            isit = a.get('lang') == 'it'
            s.stack.append(isit)
            if isit: s.it_depth += 1
    def handle_endtag(s, tag):
        if tag == 'script': s._ld = False
        if tag == 'title': s._t = False
        if tag not in ('img','br','meta','link','input','hr','source') and s.stack:
            if s.stack.pop(): s.it_depth -= 1
    def handle_data(s, d):
        if s._ld: s.ld[-1] += d
        if s._t: s.title += d
        if s.it_depth == 0 and not s._ld: s.text_nonit.append(d)

IT_WORDS = re.compile(r'\b(che|della|delle|sono|questo|questa|perché|anche|nel|degli|alla|quando|essere|molto|ancora|tutti)\b', re.I)
pages = (glob.glob(os.path.join(ROOT, 'archivio', '*.html')) + glob.glob(os.path.join(ROOT, 'en', 'archive', '*.html')) +
         glob.glob(os.path.join(ROOT, 'hi', 'archive', '*.html')) + [os.path.join(ROOT, x) for x in ('en/books/index.html', 'hi/books/index.html', 'libri/index.html', 'index.html', 'en/index.html', 'hi/index.html')])
parsed = {}
for f in pages:
    p = P(); p.feed(open(f, encoding='utf-8').read())
    rel = os.path.relpath(f, ROOT)
    parsed[rel] = p
    for blk in p.ld:
        try: json.loads(blk)
        except Exception as e: errors.append(f'JSON-LD invalid in {rel}: {e}')
    if not p.lang: errors.append(f'no lang: {rel}')
    if not p.canon: errors.append(f'no canonical: {rel}')
    if not p.title.strip() or not p.desc: errors.append(f'no title/description: {rel}')
    for h in p.links:
        if h.startswith('/') and not h.startswith('//'):
            if not os.path.exists(url_to_file(SITE + h)): errors.append(f'broken internal link in {rel}: {h}')
    if p.alts:
        if p.canon not in p.alts.values(): errors.append(f'self not in hreflang: {rel}')
        for hl, href in p.alts.items():
            tf = url_to_file(href)
            if not os.path.exists(tf): errors.append(f'hreflang target missing: {rel} -> {href}'); continue
            tr = os.path.relpath(tf, ROOT)
            q = parsed.get(tr)
            if q is None:
                q = P(); q.feed(open(tf, encoding='utf-8').read()); parsed[tr] = q
            if hl != 'x-default' and q.alts != p.alts: errors.append(f'hreflang not reciprocal: {rel} <-> {tr}')
            if 'noindex' in q.robots: errors.append(f'hreflang points to noindex page: {rel} -> {tr}')
    # leftover Italian on indexable en/hi pages
    if p.lang in ('en', 'hi') and ('/archive/' in '/' + rel or '/books/' in '/' + rel):
        body = ' '.join(p.text_nonit)
        hits = IT_WORDS.findall(body)
        if len(hits) > 3: warns.append(f'possible leftover Italian in {rel}: {len(hits)} hits e.g. {hits[:6]}')

print(f'pages checked: {len(pages)} · sitemap urls: {total}')
for w in warns: print('WARN', w)
for e in errors[:80]: print('ERROR', e)
print(f'{len(errors)} errors, {len(warns)} warnings')
sys.exit(1 if errors else 0)
