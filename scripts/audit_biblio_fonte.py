"""Audit bibliography <li id="fonte-N"> numbering + prose refs per chapter."""
import json
import re
import glob
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
BOOK_DIR = os.path.join(ROOT, "book")


def extract_biblio_section(html: str):
    """Return (start_idx, end_idx, inner) for <section id="bibliografia" ...>...</section>."""
    m = re.search(r'<section id="bibliografia"[^>]*>', html)
    if not m:
        return None
    start = m.end()
    # find matching </section>
    end_m = re.search(r'</section>', html[start:])
    if not end_m:
        return None
    end = start + end_m.start()
    return (m.start(), end + len('</section>'), html[start:end])


def audit_file(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    sec = extract_biblio_section(html)
    result = {
        "file": os.path.basename(path),
        "has_biblio": sec is not None,
        "biblio_ids": [],
        "biblio_ids_duplicates": [],
        "prose_refs": [],
        "prose_ref_counts": {},
        "ref_fonte_anchors": [],
        "back_links": [],
        "biblio_count_header": None,
        "issues": [],
    }
    if not sec:
        return result, html

    biblio_inner = sec[2]
    prose_html = html[:sec[0]] + html[sec[1]:]

    # 1) biblio ids in order
    biblio_ids = [int(x) for x in re.findall(r'<li id="fonte-(\d+)"', biblio_inner)]
    result["biblio_ids"] = biblio_ids
    seen = set()
    dups = []
    for i in biblio_ids:
        if i in seen:
            dups.append(i)
        seen.add(i)
    result["biblio_ids_duplicates"] = dups

    # 2) prose refs #fonte-N (href + ref-fonte anchors)
    prose_hrefs = [int(x) for x in re.findall(r'href="#fonte-(\d+)"', prose_html)]
    ref_fonte = [int(x) for x in re.findall(r'id="ref-fonte-(\d+)"', prose_html)]
    result["prose_refs"] = sorted(set(prose_hrefs))
    from collections import Counter
    result["prose_ref_counts"] = dict(Counter(prose_hrefs))
    result["ref_fonte_anchors"] = sorted(set(ref_fonte))

    # back links inside biblio
    back = [int(x) for x in re.findall(r'href="#ref-fonte-(\d+)"', biblio_inner)]
    result["back_links"] = back

    # 3) biblio count header "N fonti"
    hdr_m = re.search(r'<p class="text-sm[^"]*"[^>]*>\s*(\d+)\s+fonti', html)
    if hdr_m:
        result["biblio_count_header"] = int(hdr_m.group(1))

    # issues
    prose_set = set(prose_hrefs)
    biblio_set = set(biblio_ids)
    expected = sorted(biblio_set)
    if biblio_ids != expected:
        result["issues"].append("out_of_order_or_dup")
    if dups:
        result["issues"].append("duplicates")
    gaps = []
    if biblio_ids:
        full_range = set(range(1, max(biblio_ids) + 1))
        gaps = sorted(full_range - biblio_set)
        if gaps:
            result["issues"].append(f"gaps:{gaps}")
    orphan_bib = sorted(biblio_set - prose_set)
    if orphan_bib:
        result["issues"].append(f"orphan_biblio:{orphan_bib}")
    orphan_prose = sorted(prose_set - biblio_set)
    if orphan_prose:
        result["issues"].append(f"orphan_prose:{orphan_prose}")

    return result, html


def main():
    files = sorted(glob.glob(os.path.join(BOOK_DIR, "chapter-*.html")))
    report = {"files": []}
    for f in files:
        r, _ = audit_file(f)
        report["files"].append(r)

    out = os.path.join(ROOT, "openclaw", "tmp", "biblio-audit-2026-04-22.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as o:
        json.dump(report, o, indent=2, ensure_ascii=False)

    # summary
    n_total = len(report["files"])
    n_biblio = sum(1 for r in report["files"] if r["has_biblio"])
    n_issues = sum(1 for r in report["files"] if r["issues"])
    print(f"Audited {n_total} files. {n_biblio} have <section id=bibliografia>. {n_issues} have issues.")
    for r in report["files"]:
        if r["issues"]:
            print(f"  - {r['file']}: {r['issues']}")


if __name__ == "__main__":
    main()
