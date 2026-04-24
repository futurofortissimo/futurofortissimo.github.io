#!/usr/bin/env python3
"""Inject chapter grid into preview HTML."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / "book"
PREVIEW = ROOT / "generated" / "style_migration_preview_2026-04-24.html"

MACRO_BY_PREFIX = {
    "chapter-01": ("natura", "Natura"),
    "chapter-02": ("tech", "Tech"),
    "chapter-03": ("corpo", "Corpo/Mente"),
}

def macro_of(fname: str):
    for prefix, (m, label) in MACRO_BY_PREFIX.items():
        if fname.startswith(prefix):
            return m, label
    return ("index", "Index")


def extract_title(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
        if m:
            t = m.group(1).strip()
            t = re.sub(r'\s*\|\s*Futuro Fortissimo.*$', '', t)
            t = re.sub(r'&mdash;', '—', t)
            t = re.sub(r'&ndash;', '–', t)
            t = re.sub(r'&hellip;', '…', t)
            t = re.sub(r'&agrave;', 'à', t)
            t = re.sub(r'&egrave;', 'è', t)
            t = re.sub(r'&igrave;', 'ì', t)
            t = re.sub(r'&ograve;', 'ò', t)
            t = re.sub(r'&ugrave;', 'ù', t)
            t = re.sub(r'&rsquo;', '’', t)
            t = re.sub(r'&lsquo;', '‘', t)
            t = re.sub(r'&ldquo;', '“', t)
            t = re.sub(r'&rdquo;', '”', t)
            return t[:110]
    except Exception:
        pass
    return path.stem


def main():
    targets = sorted(BOOK.glob("chapter-*.html"))
    for extra in ["index.html", "ffxy-index.html"]:
        p = BOOK / extra
        if p.exists():
            targets.append(p)

    cards = []
    for p in targets:
        macro, macro_label = macro_of(p.name)
        title = extract_title(p)
        href = f"../book/{p.name}"
        cards.append(
            f'    <div class="card"><a href="{href}" target="_blank">'
            f'<span class="chip {macro}">{macro_label} · {p.stem}</span>'
            f'<div class="title">{title}</div></a></div>'
        )

    grid = "\n".join(cards)
    html = PREVIEW.read_text(encoding="utf-8")
    html = html.replace("PLACEHOLDER_GRID", grid)
    PREVIEW.write_text(html, encoding="utf-8")
    print(f"Grid injected: {len(cards)} cards")


if __name__ == "__main__":
    main()
