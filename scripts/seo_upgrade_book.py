#!/usr/bin/env python3
"""
SEO upgrade per le 9 subchapter pages + ffxy-index.html.
Inietta: twitter card, og:description/site_name/locale, meta keywords/author/robots,
hreflang, JSON-LD BreadcrumbList. Preserva titolo + description esistenti.
Idempotente: se i tag ci sono gia', non li aggiunge di nuovo.
"""
import re
from pathlib import Path

BOOK_DIR = Path(__file__).resolve().parent.parent / "book"
BASE_URL = "https://futurofortissimo.github.io/book"

# slug → (axis color, keywords, axis name, chapter num, section num)
PAGES = {
    "chapter-01-mobilita.html": ("natura", "mobilit\u00e0 urbana, citt\u00e0 a 15 minuti, micromobilit\u00e0, e-bike, auto elettriche, trasporti sostenibili, smart city", "Natura", 1, "1.1"),
    "chapter-01-ambiente.html": ("natura", "energia rinnovabile, solare, eolico, clima, biodiversit\u00e0, geoingegneria, transizione energetica, sostenibilit\u00e0", "Natura", 1, "1.2"),
    "chapter-01-cibo.html":     ("natura", "microbioma, alimentazione, cibo sostenibile, moda sostenibile, nutrizione, metabolismo, fashion", "Natura", 1, "1.3"),
    "chapter-02-robotica.html": ("tecnologia", "robotica, intelligenza artificiale, AI, LLM, agenti autonomi, Claude, GPT, world models, compute", "Tecnologia", 2, "2.1"),
    "chapter-02-metaverso.html":("tecnologia", "metaverso, criptovalute, blockchain, NFT, avatar, realt\u00e0 virtuale, simulazione, Web3", "Tecnologia", 2, "2.2"),
    "chapter-02-prodotti.html": ("tecnologia", "prodotti di consumo AI, agenti personali, AI medica, stablecoin, interfacce, consumer tech", "Tecnologia", 2, "2.3"),
    "chapter-03-psicologia.html":   ("societa", "psicologia, attenzione, mindfulness, significato, noia, routine, salute mentale, flow", "Societ\u00e0", 3, "3.1"),
    "chapter-03-alimentazione.html":("societa", "alimentazione, sport, HIIT, longevit\u00e0, performance fisica, metabolismo, dieta", "Societ\u00e0", 3, "3.2"),
    "chapter-03-cultura.html":      ("societa", "cultura, demografia, solitudine, politica, lavoro, identit\u00e0, arte, social media", "Societ\u00e0", 3, "3.3"),
}

AXIS_COLORS = {"natura": "Natura", "tecnologia": "Tecnologia", "societa": "Societ\u00e0"}

def extract_title_desc(html):
    t = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
    d = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.DOTALL)
    return (t.group(1).strip() if t else ""), (d.group(1).strip() if d else "")

def upgrade_subchapter(path: Path):
    html = path.read_text(encoding="utf-8")
    if 'name="twitter:card"' in html and 'data-seo-upgraded' in html:
        return False  # already upgraded
    meta = PAGES[path.name]
    axis, keywords, axis_name, ch_num, sec = meta
    title, desc = extract_title_desc(html)
    # Short titles/descriptions for twitter/og
    og_title = title.replace(" | Futuro Fortissimo", "").replace("&mdash;", "\u2014")
    # Short desc (fallback to title if description too long)
    short_desc = desc if len(desc) < 200 else desc[:197] + "..."

    block = f'''
    <!-- data-seo-upgraded: 2026-04-17 -->
    <meta name="keywords" content="{keywords}, Futuro Fortissimo, libro"/>
    <meta name="author" content="Michele Merelli"/>
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
    <link rel="alternate" hreflang="it" href="{BASE_URL}/{path.name}"/>
    <link rel="alternate" hreflang="x-default" href="{BASE_URL}/{path.name}"/>

    <meta property="og:site_name" content="Futuro Fortissimo"/>
    <meta property="og:locale" content="it_IT"/>
    <meta property="og:description" content="{short_desc}"/>
    <meta property="article:section" content="{axis_name}"/>
    <meta property="article:modified_time" content="2026-04-17"/>

    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="@micmer"/>
    <meta name="twitter:creator" content="@micmer"/>
    <meta name="twitter:title" content="{og_title}"/>
    <meta name="twitter:description" content="{short_desc}"/>
    <meta name="twitter:image" content="https://futurofortissimo.github.io/logo.png"/>

    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{og_title}",
      "description": "{short_desc}",
      "author": {{ "@type": "Person", "name": "Michele Merelli", "url": "https://futurofortissimo.substack.com/" }},
      "publisher": {{ "@type": "Organization", "name": "Futuro Fortissimo", "url": "https://futurofortissimo.github.io/" }},
      "datePublished": "2024-01-01",
      "dateModified": "2026-04-17",
      "inLanguage": "it",
      "mainEntityOfPage": {{ "@type": "WebPage", "@id": "{BASE_URL}/{path.name}" }},
      "isPartOf": {{ "@type": "Book", "name": "Futuro Fortissimo \u2014 Tre Macro Temi", "url": "{BASE_URL}/" }},
      "keywords": "{keywords}"
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://futurofortissimo.github.io/" }},
        {{ "@type": "ListItem", "position": 2, "name": "Libro", "item": "{BASE_URL}/" }},
        {{ "@type": "ListItem", "position": 3, "name": "Cap. {ch_num} \u2014 {axis_name}", "item": "{BASE_URL}/chapter-0{ch_num}.html" }},
        {{ "@type": "ListItem", "position": 4, "name": "{sec}", "item": "{BASE_URL}/{path.name}" }}
      ]
    }}
    </script>'''

    # Inject before <link rel="icon" if present, else before </head>
    anchor_icon = '<link rel="icon" href="/favicon.ico"/>'
    if anchor_icon in html:
        new_html = html.replace(anchor_icon, block + "\n    " + anchor_icon, 1)
    else:
        new_html = html.replace("</head>", block + "\n</head>", 1)
    path.write_text(new_html, encoding="utf-8")
    return True

def upgrade_ffxy_index():
    path = BOOK_DIR / "ffxy-index.html"
    html = path.read_text(encoding="utf-8")
    if 'data-seo-upgraded' in html:
        return False
    block = '''
    <!-- data-seo-upgraded: 2026-04-17 -->
  <meta name="keywords" content="ff.x.y, indice Futuro Fortissimo, riferimenti corpus, AI, natura, tecnologia, societ\u00e0"/>
  <meta name="author" content="Michele Merelli"/>
  <meta name="robots" content="index, follow, max-snippet:-1"/>
  <link rel="alternate" hreflang="it" href="https://futurofortissimo.github.io/book/ffxy-index.html"/>

  <meta property="og:site_name" content="Futuro Fortissimo"/>
  <meta property="og:locale" content="it_IT"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="Indice ff.x.y | Futuro Fortissimo"/>
  <meta property="og:description" content="Tutti i riferimenti ff.x.y del libro, cercabili e raggruppati per capitolo. 629+ voci dal corpus Futuro Fortissimo."/>
  <meta property="og:url" content="https://futurofortissimo.github.io/book/ffxy-index.html"/>
  <meta property="og:image" content="https://futurofortissimo.github.io/logo.png"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@micmer"/>
  <meta name="twitter:title" content="Indice ff.x.y | Futuro Fortissimo"/>
  <meta name="twitter:description" content="Tutti i riferimenti ff.x.y del libro, cercabili e raggruppati per capitolo."/>
  <meta name="twitter:image" content="https://futurofortissimo.github.io/logo.png"/>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Indice ff.x.y",
    "description": "Tutti i riferimenti ff.x.y nel libro Futuro Fortissimo.",
    "url": "https://futurofortissimo.github.io/book/ffxy-index.html",
    "inLanguage": "it",
    "isPartOf": { "@type": "Book", "name": "Futuro Fortissimo \u2014 Tre Macro Temi", "url": "https://futurofortissimo.github.io/book/" },
    "author": { "@type": "Person", "name": "Michele Merelli" }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://futurofortissimo.github.io/" },
      { "@type": "ListItem", "position": 2, "name": "Libro", "item": "https://futurofortissimo.github.io/book/" },
      { "@type": "ListItem", "position": 3, "name": "Indice ff.x.y", "item": "https://futurofortissimo.github.io/book/ffxy-index.html" }
    ]
  }
  </script>'''
    anchor = '<link rel="icon" href="/favicon.ico" />'
    if anchor in html:
        new_html = html.replace(anchor, block + "\n  " + anchor, 1)
    else:
        new_html = html.replace("</head>", block + "\n</head>", 1)
    path.write_text(new_html, encoding="utf-8")
    return True

if __name__ == "__main__":
    upgraded = 0
    for name in PAGES:
        p = BOOK_DIR / name
        if p.exists() and upgrade_subchapter(p):
            print(f"[OK] {name}")
            upgraded += 1
        elif not p.exists():
            print(f"[SKIP missing] {name}")
        else:
            print(f"[SKIP already] {name}")
    if upgrade_ffxy_index():
        print("[OK] ffxy-index.html")
        upgraded += 1
    else:
        print("[SKIP already] ffxy-index.html")
    print(f"\nTotale upgradate: {upgraded}")
