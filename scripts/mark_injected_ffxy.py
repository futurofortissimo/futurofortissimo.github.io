#!/usr/bin/env python3
"""
Marca injected:true sugli entry ffxy-historical.json che hanno avuto un
inject nel ciclo bulk 2026-04-17. Idempotente.
Source of truth: generated/review_inject_bulk_2026-04-17.html (22 entries).
"""
import json
from pathlib import Path

JSON_PATH = Path(__file__).resolve().parent.parent / "book" / "ffxy-historical.json"

# Mappatura esatta dal review bulk 2026-04-17
CHAPTER_COLORS = {1: "#2ecc71", 2: "#4a90e2", 3: "#d0021b"}
CHAPTER_NAMES  = {1: "Natura",  2: "Tecnologia", 3: "Societ\u00e0"}

INJECTIONS = [
    # code, file, anchor/section, chapter
    ("ff.26.5",  "chapter-01-mobilita.html",    "s1-4", 1),
    ("ff.148.1", "chapter-02-robotica.html",    "s1-1", 2),
    ("ff.148.3", "chapter-02-robotica.html",    "s1-2", 2),
    ("ff.37.4",  "chapter-02-robotica.html",    "s1-3", 2),
    ("ff.148.4", "chapter-02-metaverso.html",   "s2-1", 2),
    ("ff.3.1",   "chapter-02-metaverso.html",   "s2-1", 2),
    ("ff.3.4",   "chapter-02-metaverso.html",   "s2-1", 2),
    ("ff.15.2",  "chapter-02-metaverso.html",   "s2-1", 2),
    ("ff.26.1",  "chapter-02-metaverso.html",   "s2-1", 2),
    ("ff.41.5",  "chapter-02-prodotti.html",    "s3-2", 2),
    ("ff.68.3",  "chapter-03-psicologia.html",  "s1-2", 3),
    ("ff.76.4",  "chapter-03-psicologia.html",  "s1-4", 3),
    ("ff.112.3", "chapter-03-psicologia.html",  "s1-4", 3),
    ("ff.146.4", "chapter-03-psicologia.html",  "s1-4", 3),
    ("ff.62.5",  "chapter-03-cultura.html",     "s3-1", 3),
    ("ff.23.3",  "chapter-03-cultura.html",     "s3-2", 3),
    ("ff.23.4",  "chapter-03-cultura.html",     "s3-2", 3),
    ("ff.27.1",  "chapter-03-cultura.html",     "s3-4", 3),
    ("ff.27.2",  "chapter-03-cultura.html",     "s3-4", 3),
    ("ff.64.1",  "chapter-03-cultura.html",     "s3-4", 3),
    ("ff.18.2",  "chapter-03-cultura.html",     "s3-4", 3),
    ("ff.20.4",  "chapter-03-cultura.html",     "s3-4", 3),
]

RECENT_CODES = {c for c, *_ in INJECTIONS}

data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
by_code = {e["code"]: e for e in data}

updated = 0
missing = []
for code, file, section, chapter in INJECTIONS:
    e = by_code.get(code)
    if not e:
        missing.append(code)
        continue
    changed = False
    if not e.get("injected"):
        e["injected"] = True
        changed = True
    if e.get("file") != file:
        e["file"] = file; changed = True
    anchor = "ffxy-" + code.replace("ff.", "").replace(".", "-")
    if e.get("anchorId") != anchor:
        e["anchorId"] = anchor; changed = True
    if e.get("sectionId") != section:
        e["sectionId"] = section; changed = True
    if e.get("chapter") != chapter:
        e["chapter"] = chapter; changed = True
    if e.get("chapterName") != CHAPTER_NAMES[chapter]:
        e["chapterName"] = CHAPTER_NAMES[chapter]; changed = True
    if e.get("chapterColor") != CHAPTER_COLORS[chapter]:
        e["chapterColor"] = CHAPTER_COLORS[chapter]; changed = True
    # Tag as recently-injected (consumed by renderer for NEW badge)
    e["recentCycle"] = "2026-04-17"
    if changed:
        updated += 1

JSON_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

injected_count = sum(1 for e in data if e.get("injected"))
print(f"Updated: {updated}")
print(f"Missing codes in json (skipped): {missing}")
print(f"Total injected now: {injected_count}/{len(data)}")
