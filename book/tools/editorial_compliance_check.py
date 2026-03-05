#!/usr/bin/env python3
"""Editorial compliance checker for Futuro Fortissimo book chapters.

Checks required per chapter:
- no note/raw-style passages
- linked claim text <= 15 words
- Search section exists
- last-updated timestamp exists
- reading-time estimate exists
- reference count exists
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BOOK_DIR = ROOT / "book"
CHAPTER_GLOB = "chapter-*.html"

RAW_PATTERNS = [
    re.compile(r"\bTODO\b", re.IGNORECASE),
    re.compile(r"\bbozza\b", re.IGNORECASE),
    re.compile(r"\bdraft\b", re.IGNORECASE),
    re.compile(r"\[\[|\]\]"),
]

LINKED_CLAIM_RE = re.compile(r'<(?:span|a) class="fc"[^>]*>(.*?)</(?:span|a)>', re.S)
TAG_RE = re.compile(r"<[^>]+>")
SCRIPT_STYLE_RE = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.S | re.IGNORECASE)


def strip_tags(value: str) -> str:
    return " ".join(TAG_RE.sub("", value).split())


def linked_claim_word_count(label: str) -> int:
    parts = label.split()
    if not parts:
        return 0
    if not parts[0].startswith("ff."):
        parts = parts[1:]
    if parts and parts[0].startswith("ff."):
        parts = parts[1:]
    return len(parts)


def check_file(path: Path) -> list[str]:
    html = path.read_text(encoding="utf-8")
    errors: list[str] = []
    content_only = SCRIPT_STYLE_RE.sub("", html)

    for pattern in RAW_PATTERNS:
        if pattern.search(content_only):
            errors.append(f"raw/note marker found: {pattern.pattern}")
            break

    for match in LINKED_CLAIM_RE.finditer(html):
        text = strip_tags(match.group(1))
        wc = linked_claim_word_count(text)
        if wc > 15:
            errors.append(f"linked claim >15 words ({wc}): {text[:100]}")
            break

    checks = {
        "search section": ("id=\"search\"" in html or "Search nel capitolo" in html),
        "last-updated timestamp": ("Ultimo aggiornamento:" in html),
        "reading-time estimate": ("min di lettura" in html),
        "reference count": ("Riferimenti:" in html),
    }
    for label, ok in checks.items():
        if not ok:
            errors.append(f"missing {label}")

    return errors


def main() -> int:
    chapters = sorted(BOOK_DIR.glob(CHAPTER_GLOB))
    if not chapters:
        print("No chapter files found.")
        return 1

    failed = 0
    for chapter in chapters:
        errors = check_file(chapter)
        if errors:
            failed += 1
            print(f"FAIL {chapter.relative_to(ROOT)}")
            for err in errors:
                print(f"  - {err}")
        else:
            print(f"OK   {chapter.relative_to(ROOT)}")

    if failed:
        print(f"\nCompliance check failed on {failed}/{len(chapters)} files.")
        return 1

    print(f"\nAll {len(chapters)} chapter files are compliant.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
