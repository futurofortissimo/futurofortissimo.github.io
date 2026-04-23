"""Renumber <li id="fonte-N"> sequences + prose refs to canonical 1..K.

Strategy per page:
  1. Extract biblio <ol>...</ol> and list all <li id="fonte-N">...</li> entries
  2. In prose, find all distinct fonte-N references in order of first occurrence
     (using regex on href="#fonte-N")
  3. Build canonical mapping:
       - For each N with a prose ref: map N -> (order of first-occurrence)
       - Orphan biblio entries (in biblio but NO prose ref) are DROPPED
       - Orphan prose refs (in prose but NO biblio entry) are LEFT (logged)
  4. Rewrite prose: every href="#fonte-N", id="ref-fonte-N", visible [N] inside
     the sup linked to fonte-N
  5. Rewrite biblio: reorder <li> by new number, rewrite id="fonte-N" and
     the back-link href="#ref-fonte-N"
  6. Update count header "N fonti"
"""
import os
import re
import glob
import json
import sys
from collections import OrderedDict

ROOT = os.path.join(os.path.dirname(__file__), "..")
BOOK_DIR = os.path.join(ROOT, "book")
LOG_DIR = os.path.join(ROOT, "openclaw", "logs")
MANUAL_LOG = os.path.join(LOG_DIR, "biblio-manual-review.log")
os.makedirs(LOG_DIR, exist_ok=True)


def find_biblio_section(html: str):
    m = re.search(r'<section id="bibliografia"[^>]*>', html)
    if not m:
        return None
    sec_start = m.start()
    sec_open_end = m.end()
    # locate the <ol> inside
    ol_m = re.search(r'<ol[^>]*>', html[sec_open_end:])
    if not ol_m:
        return None
    ol_start = sec_open_end + ol_m.start()
    ol_open_end = sec_open_end + ol_m.end()
    ol_close = html.find('</ol>', ol_open_end)
    if ol_close == -1:
        return None
    sec_close = html.find('</section>', ol_close)
    if sec_close == -1:
        return None
    return {
        "sec_start": sec_start,
        "sec_end": sec_close + len('</section>'),
        "ol_start": ol_start,
        "ol_open_end": ol_open_end,
        "ol_close": ol_close,
        "ol_inner": html[ol_open_end:ol_close],
    }


def split_li_entries(ol_inner: str):
    """Return list of (N, full_li_html) in order. Matches <li id="fonte-N"...>...</li>."""
    entries = []
    # iterate using regex match of opening tag
    pos = 0
    pattern = re.compile(r'<li id="fonte-(\d+)"[^>]*>')
    while True:
        m = pattern.search(ol_inner, pos)
        if not m:
            break
        n = int(m.group(1))
        # find matching </li> — handle any nested li? No nested li expected.
        close = ol_inner.find('</li>', m.end())
        if close == -1:
            # malformed, bail
            break
        full = ol_inner[m.start():close + len('</li>')]
        entries.append({"n": n, "start": m.start(), "end": close + len('</li>'), "html": full})
        pos = close + len('</li>')
    return entries


def first_occurrence_order(prose_html: str):
    """Return list of N in order of first appearance among href="#fonte-N"."""
    order = []
    seen = set()
    for m in re.finditer(r'href="#fonte-(\d+)"', prose_html):
        n = int(m.group(1))
        if n not in seen:
            seen.add(n)
            order.append(n)
    return order


def process_file(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    sec = find_biblio_section(html)
    if not sec:
        return {"file": os.path.basename(path), "changed": False, "reason": "no_biblio"}

    prefix_html = html[:sec["sec_start"]]
    suffix_html = html[sec["sec_end"]:]
    prose_html = prefix_html + suffix_html  # only for scanning / analysis
    ol_inner = sec["ol_inner"]
    entries = split_li_entries(ol_inner)

    if not entries:
        return {"file": os.path.basename(path), "changed": False, "reason": "no_entries"}

    # order of first occurrence in prose
    prose_order = first_occurrence_order(prose_html)

    # Detect duplicates: if two <li> have same N, keep only the FIRST by position
    biblio_by_n = OrderedDict()
    duplicates_dropped = []
    for e in entries:
        if e["n"] in biblio_by_n:
            duplicates_dropped.append(e["n"])
            continue
        biblio_by_n[e["n"]] = e

    prose_set = set(prose_order)
    biblio_set = set(biblio_by_n.keys())

    orphan_biblio = sorted(biblio_set - prose_set)  # in biblio but no prose ref -> drop
    orphan_prose = sorted(prose_set - biblio_set)  # in prose but no biblio entry -> log

    # Build mapping old N -> new N:
    # New sequence is determined by prose first-occurrence order, skipping orphan_prose
    # (they remain as old N in prose but we can't build an entry for them, so log).
    # Actually: we want mapping only for N that have BOTH prose ref and biblio entry.
    # Those get new_n = 1..K based on prose first-occurrence order among surviving ones.
    survivors_in_order = [n for n in prose_order if n in biblio_set]
    mapping = {old: i + 1 for i, old in enumerate(survivors_in_order)}

    # If nothing actually changes (mapping is identity AND no orphan biblio AND no dup AND
    # biblio ordering matches), we can skip writing.
    current_order = [e["n"] for e in entries]
    desired_order = list(mapping.keys())  # the OLD Ns in the new desired order
    identity = all(mapping[n] == n for n in mapping) and not orphan_biblio and not duplicates_dropped

    # But we still need to check ordering: does current biblio ordering already == survivors order?
    # Current biblio_by_n order is insertion order of FIRST occurrences in biblio source.
    biblio_order_after_dedup = list(biblio_by_n.keys())

    if identity and biblio_order_after_dedup == desired_order:
        return {
            "file": os.path.basename(path),
            "changed": False,
            "reason": "already_canonical",
            "orphan_prose": orphan_prose,
        }

    # ---- rewrite prefix_html and suffix_html ----
    placeholder_token = "__FONTE_PH_{}__"

    def rewrite_prose(html_in):
        # Step 1: placeholders for href and id
        def repl_href(m):
            n = int(m.group(1))
            if n in mapping:
                return f'href="#fonte-{placeholder_token.format(n)}"'
            return m.group(0)
        html_in = re.sub(r'href="#fonte-(\d+)"', repl_href, html_in)

        def repl_refid(m):
            n = int(m.group(1))
            if n in mapping:
                return f'id="ref-fonte-{placeholder_token.format(n)}"'
            return m.group(0)
        html_in = re.sub(r'id="ref-fonte-(\d+)"', repl_refid, html_in)

        # Step 2: rewrite visible [N] inside anchors linked to fonte-PH
        ph_pattern = re.compile(
            r'<a href="#fonte-__FONTE_PH_(\d+)__"([^>]*)>(.*?)</a>', re.DOTALL
        )
        def repl_ph(m):
            old = int(m.group(1))
            attrs = m.group(2)
            inner = m.group(3)
            new_n = mapping[old]
            new_inner = re.sub(
                r'\[\s*' + str(old) + r'\s*\]', f'[{new_n}]', inner, count=1
            )
            return f'<a href="#fonte-{placeholder_token.format(old)}"{attrs}>{new_inner}</a>'
        html_in = ph_pattern.sub(repl_ph, html_in)

        # Step 3: replace placeholders with real new numbers
        for old, new_n in mapping.items():
            html_in = html_in.replace(placeholder_token.format(old), str(new_n))
        return html_in

    new_prefix = rewrite_prose(prefix_html)
    new_suffix = rewrite_prose(suffix_html)

    # ---- rewrite biblio ----
    # Build new <li> list in mapping order (= survivors_in_order).
    new_li_parts = []
    for old_n, new_n in mapping.items():
        li = biblio_by_n[old_n]["html"]
        # rewrite id="fonte-N"
        li = re.sub(r'id="fonte-\d+"', f'id="fonte-{new_n}"', li, count=1)
        # rewrite back-link href="#ref-fonte-N"
        li = re.sub(r'href="#ref-fonte-\d+"', f'href="#ref-fonte-{new_n}"', li)
        new_li_parts.append(li)

    # Preserve any non-li content (whitespace / comments) BETWEEN entries we can drop/flatten
    # We'll rebuild ol_inner as: leading newline + joined entries + trailing newline/indent
    # Find leading whitespace/text before first <li> and trailing after last </li>
    # Look at original ol_inner
    first_li_start = entries[0]["start"]
    last_li_end = entries[-1]["end"]
    leading = ol_inner[:first_li_start]
    trailing = ol_inner[last_li_end:]

    # Join with newline between entries to keep readability
    new_ol_inner = leading + "\n".join(new_li_parts) + trailing

    # The section block from html, with ol replaced
    orig_sec_block = html[sec["sec_start"]:sec["sec_end"]]
    # Replace the ol_inner portion inside orig_sec_block
    # ol_inner in original html starts at (sec["ol_open_end"] - sec["sec_start"])
    inner_offset_start = sec["ol_open_end"] - sec["sec_start"]
    inner_offset_end = sec["ol_close"] - sec["sec_start"]
    new_sec_block = orig_sec_block[:inner_offset_start] + new_ol_inner + orig_sec_block[inner_offset_end:]

    # Update "N fonti" count header inside section
    k = len(mapping)
    def update_count(m):
        return m.group(1) + str(k) + m.group(3)
    new_sec_block = re.sub(
        r'(<p class="text-sm[^"]*"[^>]*>\s*)(\d+)(\s+font[ie])',
        update_count,
        new_sec_block,
        count=1,
    )

    final_html = new_prefix + new_sec_block + new_suffix

    if final_html != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(final_html)

    return {
        "file": os.path.basename(path),
        "changed": final_html != html,
        "k": k,
        "duplicates_dropped": duplicates_dropped,
        "orphan_biblio_removed": orphan_biblio,
        "orphan_prose_left": orphan_prose,
        "mapping_sample": dict(list(mapping.items())[:5]),
    }


def main():
    files = sorted(glob.glob(os.path.join(BOOK_DIR, "chapter-*.html")))
    summary = []
    manual = []
    for f in files:
        try:
            r = process_file(f)
        except Exception as ex:
            r = {"file": os.path.basename(f), "error": str(ex)}
            manual.append(f"{os.path.basename(f)}: EXCEPTION {ex}")
        summary.append(r)
        if r.get("orphan_prose_left"):
            manual.append(f"{os.path.basename(f)}: orphan prose refs (no biblio entry) = {r['orphan_prose_left']}")

    out = os.path.join(ROOT, "openclaw", "tmp", "biblio-fix-result-2026-04-22.json")
    with open(out, 'w', encoding='utf-8') as o:
        json.dump(summary, o, indent=2, ensure_ascii=False)

    if manual:
        with open(MANUAL_LOG, 'a', encoding='utf-8') as ml:
            ml.write(f"\n=== fix_biblio_fonte run ===\n")
            for line in manual:
                ml.write(line + "\n")

    n_changed = sum(1 for r in summary if r.get("changed"))
    n_err = sum(1 for r in summary if r.get("error"))
    total_orphans_removed = sum(len(r.get("orphan_biblio_removed") or []) for r in summary)
    total_dups = sum(len(r.get("duplicates_dropped") or []) for r in summary)
    print(f"Processed {len(summary)} files. Changed: {n_changed}. Errors: {n_err}.")
    print(f"Orphan biblio <li> removed: {total_orphans_removed}.")
    print(f"Duplicate biblio <li> dropped: {total_dups}.")


if __name__ == "__main__":
    main()
