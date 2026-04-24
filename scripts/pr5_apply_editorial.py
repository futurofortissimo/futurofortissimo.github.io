#!/usr/bin/env python3
"""
PR 5/10 — substack-editorial style migration.
Class-level activation on all book/ HTML pages.

Per page:
  1) Inject <link rel="stylesheet" href="styles/editorial.css"> (or relative path) in <head>
  2) Add class "editorial" to <body> + data-macro / data-chapter attributes
  3) Leave content untouched.
"""
from __future__ import annotations
import re
from pathlib import Path

BOOK_DIR = Path(__file__).resolve().parent.parent / "book"

# Chapter-id macro-tema (cap 1/2/3) + per-chapter slug for data-chapter
# cap 1 = natura (green), cap 2 = tech (blue), cap 3 = corpo (red)
MACRO_BY_PREFIX = {
    "chapter-01": "natura",
    "chapter-02": "tech",
    "chapter-03": "corpo",
}

# Slug per chapter-0X-<named>.html (leaf subchapters without X-Y-Z)
NAMED_SLUGS = {
    "chapter-01-mobilita": "mobilita",
    "chapter-01-ambiente": "ambiente",
    "chapter-01-cibo": "cibo",
    "chapter-02-robotica": "robotica",
    "chapter-02-metaverso": "metaverso",
    "chapter-02-prodotti": "prodotti",
    "chapter-03-alimentazione": "alimentazione",
    "chapter-03-cultura": "cultura",
    "chapter-03-psicologia": "psicologia",
}

LINK_TAG = '<link rel="stylesheet" href="styles/editorial.css">'
INDEX_LINK_TAG = '<link rel="stylesheet" href="styles/editorial.css">'


def detect_macro(fname: str) -> str:
    for prefix, macro in MACRO_BY_PREFIX.items():
        if fname.startswith(prefix):
            return macro
    return "index"


def detect_chapter_slug(fname: str) -> str:
    stem = fname.replace(".html", "")
    if stem in NAMED_SLUGS:
        return NAMED_SLUGS[stem]
    # e.g. chapter-01-1-1 -> "1-1-1"
    m = re.match(r"chapter-(\d+)(?:-(\d+))?(?:-(\d+))?$", stem)
    if m:
        parts = [p for p in m.groups() if p]
        return "-".join(parts)
    # index, ffxy-index, etc.
    return stem


def process_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    original = text
    fname = path.name

    changes = []

    # --- 1) Inject stylesheet link in <head> if missing -------------------
    if 'styles/editorial.css' not in text:
        # Insert right before </head>
        if '</head>' in text:
            text = text.replace('</head>', f'    {LINK_TAG}\n</head>', 1)
            changes.append("link+")
        else:
            return {"file": fname, "skipped": "no </head>"}

    # --- 2) Add class="editorial" + data-macro + data-chapter to <body> ---
    macro = detect_macro(fname)
    slug = detect_chapter_slug(fname)

    body_re = re.compile(r'<body([^>]*)>', re.IGNORECASE)
    m = body_re.search(text)
    if not m:
        return {"file": fname, "skipped": "no <body>"}

    attrs = m.group(1)

    # Already migrated?
    if 'class="editorial"' in attrs or "class='editorial'" in attrs \
            or re.search(r'class\s*=\s*"[^"]*\beditorial\b', attrs) \
            or re.search(r"class\s*=\s*'[^']*\beditorial\b", attrs):
        # ensure data-macro present; otherwise add
        if 'data-macro=' not in attrs:
            new_attrs = attrs + f' data-macro="{macro}" data-chapter="{slug}"'
            text = text[:m.start()] + f'<body{new_attrs}>' + text[m.end():]
            changes.append("data+")
    else:
        # Add "editorial" to existing class, or create one
        class_re = re.search(r'class\s*=\s*"([^"]*)"', attrs)
        if class_re:
            existing = class_re.group(1).strip()
            new_class_val = f'{existing} editorial'.strip()
            new_attrs = attrs.replace(class_re.group(0), f'class="{new_class_val}"', 1)
        else:
            new_attrs = f' class="editorial"' + attrs
        # Append data attributes (guard against duplicates)
        if 'data-macro=' not in new_attrs:
            new_attrs = new_attrs + f' data-macro="{macro}" data-chapter="{slug}"'
        text = text[:m.start()] + f'<body{new_attrs}>' + text[m.end():]
        changes.append("body+")

    if text != original:
        path.write_text(text, encoding="utf-8")
        return {"file": fname, "macro": macro, "slug": slug, "changes": changes}
    return {"file": fname, "unchanged": True}


def main():
    report = []
    targets = []
    for p in sorted(BOOK_DIR.glob("chapter-*.html")):
        targets.append(p)
    # index + ffxy-index
    for extra in ["index.html", "ffxy-index.html"]:
        p = BOOK_DIR / extra
        if p.exists():
            targets.append(p)

    for p in targets:
        r = process_file(p)
        report.append(r)

    migrated = sum(1 for r in report if "changes" in r)
    unchanged = sum(1 for r in report if r.get("unchanged"))
    skipped = sum(1 for r in report if "skipped" in r)
    print(f"Total targets : {len(targets)}")
    print(f"Migrated      : {migrated}")
    print(f"Unchanged     : {unchanged}")
    print(f"Skipped       : {skipped}")
    for r in report:
        if "skipped" in r:
            print("  SKIP", r["file"], r["skipped"])

    # Print per-chapter accent mapping summary
    macros = {}
    for r in report:
        m = r.get("macro")
        if m:
            macros.setdefault(m, 0)
            macros[m] += 1
    print("By macro:", macros)


if __name__ == "__main__":
    main()
