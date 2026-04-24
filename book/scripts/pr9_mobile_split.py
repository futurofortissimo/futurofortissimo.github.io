#!/usr/bin/env python
"""PR 9/10 - Mobile split subchapter pages.

Idempotent operations:
  1. Inject <script src="scripts/subchapter-nav.js" defer> in every
     book/chapter-0X-Y-Z.html (before </body> once).
  2. Generate book/sitemap.xml listing macros + 9 parents + 36 subpages.
  3. Generate book/mobile.html - mobile-first collapsible index with filter.
  4. Update /sitemap.xml to include the 36 split subchapter URLs (once).
  5. Ensure /robots.txt mentions both sitemaps.

Run: python book/scripts/pr9_mobile_split.py
"""
from __future__ import annotations
import os, re, io, sys, glob, html as html_mod
from datetime import date

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BOOK = os.path.join(ROOT, "book")
SITE = "https://futurofortissimo.github.io"
TODAY = date.today().isoformat()
NAV_TAG = '<script src="scripts/subchapter-nav.js" defer></script>'

MACROS = [
    (1, "Natura", "chapter-01.html", "#2ecc71"),
    (2, "Tecnologia", "chapter-02.html", "#4a90e2"),
    (3, "Società", "chapter-03.html", "#d0021b"),
]
PARENTS = [
    (1, 1, "Mobilità e Città", "chapter-01-mobilita.html"),
    (1, 2, "Ambiente ed Energia", "chapter-01-ambiente.html"),
    (1, 3, "Cibo e Salute", "chapter-01-cibo.html"),
    (2, 1, "Robotica e AI", "chapter-02-robotica.html"),
    (2, 2, "Metaverso e Cripto", "chapter-02-metaverso.html"),
    (2, 3, "Prodotti e Software", "chapter-02-prodotti.html"),
    (3, 1, "Psicologia e Mente", "chapter-03-psicologia.html"),
    (3, 2, "Cultura e Società", "chapter-03-cultura.html"),
    (3, 3, "Alimentazione e Corpo", "chapter-03-alimentazione.html"),
]

def read(p):  return io.open(p, encoding="utf-8").read()
def write(p, s):
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)

def subpages():
    out = []
    for f in sorted(glob.glob(os.path.join(BOOK, "chapter-0?-?-?.html"))):
        m = re.search(r"chapter-(\d\d)-(\d)-(\d)\.html$", f.replace("\\", "/"))
        if not m:
            continue
        x, y, z = int(m.group(1)), int(m.group(2)), int(m.group(3))
        html = read(f)
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
        title = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else f"{x}.{y}.{z}"
        title = html_mod.unescape(title)
        d = re.search(r'<meta name="description" content="([^"]+)"', html)
        desc = html_mod.unescape(d.group(1)) if d else ""
        # first line before the second sentence-ish break
        desc_short = desc.split(" Sottocapitolo ")[0].strip()
        out.append(dict(file=os.path.basename(f), x=x, y=y, z=z,
                        title=title, desc=desc_short))
    return out

# ---- Step 1: inject nav script ----
def inject_nav():
    changed = 0
    for f in sorted(glob.glob(os.path.join(BOOK, "chapter-0?-?-?.html"))):
        s = read(f)
        if "scripts/subchapter-nav.js" in s:
            continue
        if "</body>" not in s:
            continue
        s2 = s.replace("</body>", f"  {NAV_TAG}\n</body>", 1)
        write(f, s2)
        changed += 1
    return changed

# ---- Step 2: book/sitemap.xml ----
def gen_book_sitemap(subs):
    urls = []
    urls.append(f"{SITE}/book/")
    urls.append(f"{SITE}/book/ffxy-index.html")
    for _, _, file, _ in [(c, n, f, col) for c, n, f, col in MACROS]:
        urls.append(f"{SITE}/book/{file}")
    for x, y, name, f in PARENTS:
        urls.append(f"{SITE}/book/{f}")
    for s in subs:
        urls.append(f"{SITE}/book/{s['file']}")
    urls.append(f"{SITE}/book/mobile.html")

    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        prio = "1.0" if u.endswith("/book/") else (
               "0.9" if "/ffxy-index" in u or "/mobile.html" in u else (
               "0.8" if re.search(r"chapter-0\d\.html$", u) else (
               "0.7" if re.search(r"chapter-0\d-[a-z]+\.html$", u) else "0.6")))
        parts.append("  <url>")
        parts.append(f"    <loc>{u}</loc>")
        parts.append(f"    <lastmod>{TODAY}</lastmod>")
        parts.append("    <changefreq>monthly</changefreq>")
        parts.append(f"    <priority>{prio}</priority>")
        parts.append("  </url>")
    parts.append("</urlset>")
    parts.append("")
    write(os.path.join(BOOK, "sitemap.xml"), "\n".join(parts))
    return len(urls)

# ---- Step 3: mobile.html ----
def gen_mobile(subs):
    # Group subs by (x, y)
    groups = {}
    for s in subs:
        groups.setdefault((s["x"], s["y"]), []).append(s)
    macro_meta = {x: (n, col) for x, n, _, col in MACROS}
    parent_meta = {(x, y): (name, f) for x, y, name, f in PARENTS}

    sections_html = []
    for x in (1, 2, 3):
        mname, mcol = macro_meta[x]
        macro_file = f"chapter-0{x}.html"
        sections_html.append(f'''    <section class="macro" data-chapter="{x}" style="--accent:{mcol}">
      <header class="macro-head">
        <a class="macro-link" href="{macro_file}">
          <span class="tag">Capitolo {x}</span>
          <span class="t">{mname}</span>
        </a>
      </header>
      <div class="parents">''')
        for y in (1, 2, 3):
            if (x, y) not in parent_meta:
                continue
            pname, pfile = parent_meta[(x, y)]
            sections_html.append(f'''        <details class="parent" open>
          <summary>
            <span class="yid">{x}.{y}</span>
            <span class="yn">{html_mod.escape(pname)}</span>
            <a class="ppage" href="{pfile}" aria-label="Apri {x}.{y} in pagina unica">vista unica</a>
          </summary>
          <ul class="subs">''')
            for s in groups.get((x, y), []):
                title = html_mod.escape(s["title"])
                desc = html_mod.escape(s["desc"])
                sections_html.append(f'''            <li class="sub" data-search="{title.lower()} {desc.lower()}">
              <a href="{s['file']}">
                <span class="sid">{s['x']}.{s['y']}.{s['z']}</span>
                <span class="st">{title}</span>
                <span class="sd">{desc}</span>
              </a>
            </li>''')
            sections_html.append("          </ul>\n        </details>")
        sections_html.append("      </div>\n    </section>")

    page = f"""<!doctype html>
<html lang="it" class="scroll-smooth">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Mobile — Futuro Fortissimo | Indice sottocapitoli</title>
  <meta name="description" content="Indice mobile-first di Futuro Fortissimo: 36 sottocapitoli tappabili, filtro rapido, navigazione swipe tra pagine."/>
  <link rel="canonical" href="{SITE}/book/mobile.html"/>
  <link rel="alternate" href="{SITE}/book/" hreflang="it"/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:title" content="Futuro Fortissimo — Indice mobile"/>
  <meta property="og:description" content="36 sottocapitoli navigabili come schede tappabili. Filtro, breadcrumb, swipe."/>
  <meta property="og:url" content="{SITE}/book/mobile.html"/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="{SITE}/logo.png"/>
  <link rel="icon" href="/favicon.ico"/>
  <style>
    :root{{--bg:#fdfdfd;--fg:#0a0a0a;--mute:#666;--line:rgba(0,0,0,.08);--accent:#0a0a0a}}
    *{{box-sizing:border-box}}
    html,body{{margin:0;padding:0;background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55;-webkit-text-size-adjust:100%}}
    header.top{{position:sticky;top:0;z-index:10;background:#0a0a0a;color:#fff;padding:14px 16px;border-bottom:2px solid #f5a623}}
    header.top .bar{{display:flex;align-items:center;gap:10px;max-width:720px;margin:0 auto}}
    header.top a{{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.04em;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:.78rem}}
    header.top .spacer{{flex:1}}
    main{{max-width:720px;margin:0 auto;padding:16px}}
    .hero{{padding:12px 4px 4px}}
    .hero h1{{margin:0 0 6px;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:1.4rem;letter-spacing:.01em}}
    .hero p{{margin:0;color:var(--mute);font-size:.92rem}}
    .search{{margin:14px 4px 8px;position:sticky;top:50px;z-index:5;background:var(--bg);padding:8px 0}}
    .search input{{width:100%;padding:12px 14px;font-size:1rem;border:2px solid #0a0a0a;border-radius:0;background:#fff;font-family:inherit;-webkit-appearance:none}}
    .macro{{margin:18px 0 4px;border-top:2px solid #0a0a0a;padding-top:14px}}
    .macro-head{{margin:0 0 8px}}
    .macro-link{{display:flex;align-items:baseline;gap:10px;text-decoration:none;color:#0a0a0a;padding:8px 4px}}
    .macro-link .tag{{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);font-weight:700}}
    .macro-link .t{{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:1.1rem;font-weight:700}}
    .parent{{border-bottom:1px solid var(--line);padding:4px 0}}
    .parent > summary{{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;padding:10px 4px;min-height:44px;font-family:'IBM Plex Mono',ui-monospace,monospace}}
    .parent > summary::-webkit-details-marker{{display:none}}
    .parent > summary::after{{content:'+';margin-left:auto;font-weight:700;color:var(--mute);font-size:1.2rem}}
    .parent[open] > summary::after{{content:'−'}}
    .parent .yid{{font-size:.82rem;color:var(--accent);font-weight:700;letter-spacing:.08em}}
    .parent .yn{{font-size:1rem;font-weight:600}}
    .parent .ppage{{margin-left:auto;margin-right:24px;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);text-decoration:none;border:1px solid var(--mute);padding:4px 8px}}
    ul.subs{{list-style:none;margin:0 0 12px;padding:0}}
    .sub{{border-top:1px dashed var(--line)}}
    .sub a{{display:grid;grid-template-columns:auto 1fr;grid-column-gap:10px;padding:12px 6px;color:#0a0a0a;text-decoration:none;min-height:56px;align-items:baseline}}
    .sub .sid{{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:.78rem;color:var(--accent);font-weight:700;letter-spacing:.06em}}
    .sub .st{{font-size:1rem;font-weight:600;grid-column:2}}
    .sub .sd{{grid-column:2;font-size:.86rem;color:var(--mute);margin-top:4px}}
    .sub:active{{background:#f6f6f6}}
    .empty{{padding:16px;text-align:center;color:var(--mute);font-size:.9rem;display:none}}
    footer{{padding:24px 16px;text-align:center;color:var(--mute);font-size:.78rem;font-family:'IBM Plex Mono',ui-monospace,monospace}}
    footer a{{color:var(--mute)}}
    @media(min-width:880px){{
      main{{max-width:980px}}
      .parents{{display:grid;grid-template-columns:1fr 1fr;gap:8px 22px}}
      .parent{{border-bottom:none;border-top:1px solid var(--line)}}
    }}
  </style>
</head>
<body>
  <header class="top">
    <div class="bar">
      <a href="/">FF</a>
      <span>/</span>
      <a href="/book/">Libro</a>
      <span class="spacer"></span>
      <a href="/book/" aria-label="Vista desktop">vista desktop</a>
    </div>
  </header>
  <main>
    <section class="hero">
      <h1>Indice mobile</h1>
      <p>36 sottocapitoli come schede tappabili. Tocca un sottocapitolo per aprirlo; swipe destra/sinistra naviga tra i sottocapitoli all'interno della pagina.</p>
    </section>
    <div class="search">
      <input id="q" type="search" inputmode="search" placeholder="Filtra per titolo o parola chiave…" aria-label="Filtra sottocapitoli"/>
    </div>
{chr(10).join(sections_html)}
    <div class="empty" id="empty">Nessun sottocapitolo corrisponde al filtro.</div>
  </main>
  <footer>
    <p>Futuro Fortissimo · <a href="/book/ffxy-index.html">Indice ff.x.y completo</a> · <a href="/book/">Versione desktop</a></p>
  </footer>
  <script>
    (function(){{
      var q = document.getElementById('q');
      var empty = document.getElementById('empty');
      if (!q) return;
      function apply(){{
        var v = (q.value || '').trim().toLowerCase();
        var items = document.querySelectorAll('.sub');
        var any = 0;
        items.forEach(function(it){{
          var hay = it.getAttribute('data-search') || '';
          var ok = !v || hay.indexOf(v) !== -1;
          it.style.display = ok ? '' : 'none';
          if (ok) any++;
        }});
        // Hide parent blocks whose children are all hidden
        document.querySelectorAll('.parent').forEach(function(p){{
          var visible = p.querySelectorAll('.sub:not([style*="display: none"])').length;
          p.style.display = visible ? '' : 'none';
        }});
        empty.style.display = any ? 'none' : '';
      }}
      q.addEventListener('input', apply);
    }})();
  </script>
</body>
</html>
"""
    write(os.path.join(BOOK, "mobile.html"), page)
    return os.path.join(BOOK, "mobile.html")

# ---- Step 4: patch root sitemap.xml to add 36 subpages (once) ----
def patch_root_sitemap(subs):
    p = os.path.join(ROOT, "sitemap.xml")
    if not os.path.exists(p):
        return 0
    s = read(p)
    to_add = []
    for sub in subs:
        url = f"{SITE}/book/{sub['file']}"
        if f"<loc>{url}</loc>" in s:
            continue
        to_add.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")
    # also ensure /book/mobile.html and /book/sitemap.xml referenced
    mobile_url = f"{SITE}/book/mobile.html"
    if f"<loc>{mobile_url}</loc>" not in s:
        to_add.append(f"""  <url>
    <loc>{mobile_url}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>""")
    if not to_add:
        return 0
    block = "\n".join(to_add) + "\n"
    marker = "</urlset>"
    s2 = s.replace(marker, block + marker, 1)
    write(p, s2)
    return len(to_add)

# ---- Step 5: ensure robots.txt lists both sitemaps ----
def patch_robots():
    p = os.path.join(ROOT, "robots.txt")
    if not os.path.exists(p):
        write(p, "User-agent: *\nDisallow:\n\nSitemap: https://futurofortissimo.github.io/sitemap.xml\nSitemap: https://futurofortissimo.github.io/book/sitemap.xml\n")
        return "created"
    s = read(p)
    changed = False
    if "/book/sitemap.xml" not in s:
        s = s.rstrip() + "\nSitemap: https://futurofortissimo.github.io/book/sitemap.xml\n"
        changed = True
    if changed:
        write(p, s)
        return "updated"
    return "ok"

def main():
    subs = subpages()
    print(f"[inventory] subpages found: {len(subs)}")
    injected = inject_nav()
    print(f"[step1] nav script injected in {injected} pages")
    n_book = gen_book_sitemap(subs)
    print(f"[step2] book/sitemap.xml written ({n_book} urls)")
    mobile_path = gen_mobile(subs)
    print(f"[step3] mobile index: {mobile_path}")
    added = patch_root_sitemap(subs)
    print(f"[step4] root sitemap.xml: {added} url(s) added")
    rob = patch_robots()
    print(f"[step5] robots.txt: {rob}")
    print("[done]")

if __name__ == "__main__":
    main()
