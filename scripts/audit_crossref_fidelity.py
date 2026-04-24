#!/usr/bin/env python3
"""
PR 7/10 — Crossref fidelity audit.

Step 1: Build authority index from data.js (parse JS object literal → JSON-ish).
Step 2: Extract every inline ff.X.Y occurrence from book/chapter-*.html with context.
Step 3: Classify against authority:
    - MISSING (code not in data.js)           -> RED
    - EXIST + CONTENT_MATCH (>=2 kw overlap)  -> GREEN
    - EXIST + TITLE_ONLY_MATCH (0-1 kw)       -> YELLOW
    - (MISMATCH handled as YELLOW + manual)   -> YELLOW

Outputs:
    generated/ffxy_authority_2026-04-24.json
    generated/ffxy_inline_uses_2026-04-24.json
    generated/crossref_audit_report_2026-04-24.html
"""
import json
import os
import re
import sys
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(r"C:\Users\micme\Desktop\micmer\futuro fortissimo")
BOOK = ROOT / "book"
GEN = ROOT / "generated"
GEN.mkdir(exist_ok=True)

# -------- Italian stop-word list (compact) --------
STOP = set("""
a al alla allo alle agli ai ad anche ancora avere ben bene c che chi ci cio cioe come con contro cosa cosi cui d da dal dalla dalle dagli dai del della delle dello degli dei di do dove due e ed egli elle essere fra ha ho il in io l la le lo loro ma me mi mia mie miei mio ne ne' ne non nostra nostre nostri nostro o od oggi ogni oltre per piu poco poi pero quale quali quanto quante quando quasi quel quella quelle quelli quello questa queste questi questo se sei sia sie sole solo sono su sua sue suo sugli sul sulla sulle sullo sua suoi te ti tra tre tu tua tue tuo tuoi un una uno up vai vi voi volta volte vostra vostre vostri vostro y your gia gia' piu' gia puo puo' po ora molto molti molte senza cosi' essere fare fa fanno fatto dell dell' sull sull' dall dall' nell nell' all all' un' qui qua la' li' verso dopo prima durante the and or of to is it an as are was were be been being this that these those there here their its his her he she they we you our ours my me him them thus hence where when why how not no if else then
""".split())

def simple_stem(word: str) -> str:
    w = word.lower()
    # strip non-alpha
    w = re.sub(r"[^a-zà-ÿ]+", "", w)
    # very rough italian suffix stripping
    for suf in ("zione", "zioni", "mente", "ismo", "ista", "bili", "bile", "mente",
                "ano", "ate", "ati", "ato", "are", "ire", "ere", "ono",
                "ini", "ine", "ico", "ica", "ici", "iche",
                "oso", "osi", "ose", "osa",
                "i", "e", "a", "o"):
        if len(w) > len(suf) + 3 and w.endswith(suf):
            return w[: -len(suf)]
    return w

def tokens(text: str) -> list:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    return [simple_stem(w) for w in re.findall(r"[A-Za-zÀ-ÿ]{3,}", text) if simple_stem(w) and simple_stem(w) not in STOP and len(simple_stem(w)) > 2]

# -------- Step 1: Parse data.js --------
def parse_data_js() -> dict:
    """Parse data.js as JSON after stripping `export const rawData = ` prefix and trailing semicolon."""
    raw = (ROOT / "data.js").read_text(encoding="utf-8")
    # find start of array
    m = re.search(r"rawData\s*=\s*", raw)
    if not m:
        raise RuntimeError("rawData not found in data.js")
    body = raw[m.end():]
    # strip trailing semicolon / whitespace
    body = body.rstrip().rstrip(";").rstrip()
    # data.js uses plain JSON syntax with double quotes per inspection
    try:
        data = json.loads(body)
    except json.JSONDecodeError as e:
        # try to locate the error
        print(f"JSON parse error at {e.pos}: ...{body[max(0,e.pos-60):e.pos+60]}...", file=sys.stderr)
        raise
    authority = {}  # ff.X.Y -> {title, content, description, keywords}
    for issue in data:
        # each issue may have subchapters
        for sub in issue.get("subchapters", []) or []:
            t = sub.get("title", "")
            mm = re.search(r"ff\.(\d+)\.(\d+)", t)
            if not mm:
                continue
            code = f"ff.{mm.group(1)}.{mm.group(2)}"
            title_text = re.sub(r"^[^A-Za-z0-9]+", "", t).strip()
            # remove the "ff.X.Y" label from title text for keyword purposes
            title_clean = re.sub(r"ff\.\d+\.\d+", "", title_text).strip()
            content = sub.get("content", "") or ""
            desc = sub.get("description", "") or sub.get("subtitle", "") or ""
            kw_source = f"{title_clean} {desc} {content}"
            kws = tokens(kw_source)
            kw_counter = Counter(kws)
            top_kws = [w for w, _ in kw_counter.most_common(15)]
            authority[code] = {
                "title": title_clean,
                "title_raw": title_text,
                "content": content[:600],
                "description": desc,
                "keywords": top_kws,
            }
    return authority

# -------- Step 2: Extract inline uses --------
FFXY_RE = re.compile(r"ff\.(\d+)\.(\d+)")

def extract_uses() -> list:
    uses = []
    # also map chapter file -> macro/sub for reporting
    for path in sorted(BOOK.glob("chapter-*.html")):
        name = path.name
        html = path.read_text(encoding="utf-8", errors="ignore")
        # skip top-level chapter-0X.html (index) from some heuristics? we still scan
        # extract body region (skip head/script metadata)
        body_start = html.find("<body")
        if body_start < 0:
            body_start = 0
        body = html[body_start:]
        # strip <script>…</script> and JSON-LD blocks
        body = re.sub(r"<script[^>]*>.*?</script>", " ", body, flags=re.S)
        # iterate
        for m in FFXY_RE.finditer(body):
            code = f"ff.{m.group(1)}.{m.group(2)}"
            start = max(0, m.start() - 250)
            end = min(len(body), m.end() + 250)
            ctx = body[start:end]
            # clean context for keyword extraction only
            clean = re.sub(r"<[^>]+>", " ", ctx)
            clean = re.sub(r"&[a-zA-Z#0-9]+;", " ", clean)
            clean = re.sub(r"\s+", " ", clean).strip()
            # Detect kind: inside <span class="fc"> ? or <a href="#ff-..."> ?
            before = body[max(0, m.start() - 100): m.start()]
            kind = "text"
            if 'class="fc"' in before[-80:]:
                kind = "fc_span"
            elif 'href="#ff-' in before[-100:]:
                kind = "anchor"
            elif 'href="' in before[-120:] and "fortissimo" in before[-200:].lower():
                kind = "external_link"
            uses.append({
                "chapter": name,
                "ff_code": code,
                "context": clean,
                "kind": kind,
                "offset": m.start(),
            })
    return uses

# -------- Step 3: Classify --------
def classify(uses: list, authority: dict) -> list:
    results = []
    for u in uses:
        code = u["ff_code"]
        auth = authority.get(code)
        if not auth:
            u2 = dict(u)
            u2["flag"] = "RED_MISSING"
            u2["overlap"] = 0
            u2["overlap_words"] = []
            results.append(u2)
            continue
        ctx_tokens = set(tokens(u["context"]))
        kw_set = set(auth["keywords"])
        overlap = ctx_tokens & kw_set
        # also strip the code itself from context before overlap scoring (already done by regex)
        if len(overlap) >= 2:
            flag = "GREEN"
        elif len(overlap) == 1:
            flag = "YELLOW"
        else:
            flag = "YELLOW_LOW"
        u2 = dict(u)
        u2["flag"] = flag
        u2["overlap"] = len(overlap)
        u2["overlap_words"] = sorted(list(overlap))[:5]
        results.append(u2)
    return results

def main():
    print("Step 1: building authority index …")
    authority = parse_data_js()
    print(f"  -> {len(authority)} ff.X.Y entries in authority")
    (GEN / "ffxy_authority_2026-04-24.json").write_text(
        json.dumps(authority, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print("Step 2: extracting inline uses from book/*.html …")
    uses = extract_uses()
    print(f"  -> {len(uses)} raw ff.X.Y occurrences (includes dup & non-prose)")

    print("Step 3: classifying …")
    classified = classify(uses, authority)
    (GEN / "ffxy_inline_uses_2026-04-24.json").write_text(
        json.dumps(classified, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # summary
    by_flag = Counter(c["flag"] for c in classified)
    print("Summary by flag:")
    for k, v in by_flag.most_common():
        print(f"  {k}: {v}")

    # report
    by_chapter = defaultdict(lambda: Counter())
    for c in classified:
        by_chapter[c["chapter"]][c["flag"]] += 1
    report_rows = []
    for ch in sorted(by_chapter):
        cnt = by_chapter[ch]
        report_rows.append({
            "chapter": ch,
            "total": sum(cnt.values()),
            "green": cnt.get("GREEN", 0),
            "yellow": cnt.get("YELLOW", 0) + cnt.get("YELLOW_LOW", 0),
            "red": cnt.get("RED_MISSING", 0),
        })
    # top RED examples
    reds = [c for c in classified if c["flag"] == "RED_MISSING"]
    yellows_low = [c for c in classified if c["flag"] == "YELLOW_LOW"]
    html_rows = "".join(
        f"<tr><td>{r['chapter']}</td><td>{r['total']}</td>"
        f"<td style='color:#16a34a'>{r['green']}</td>"
        f"<td style='color:#ca8a04'>{r['yellow']}</td>"
        f"<td style='color:#dc2626'>{r['red']}</td></tr>"
        for r in report_rows
    )
    red_examples = "".join(
        f"<li><b>{c['ff_code']}</b> in <code>{c['chapter']}</code>: …{c['context'][:220]}…</li>"
        for c in reds[:20]
    ) or "<li>none</li>"
    yellow_low_examples = "".join(
        f"<li><b>{c['ff_code']}</b> in <code>{c['chapter']}</code> (overlap={c['overlap']}): …{c['context'][:200]}…</li>"
        for c in yellows_low[:20]
    ) or "<li>none</li>"
    html = f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>Crossref Fidelity Audit — 2026-04-24</title>
<style>body{{font-family:system-ui;max-width:1100px;margin:2rem auto;padding:0 1rem}}
table{{border-collapse:collapse;width:100%;font-size:14px}}td,th{{border:1px solid #ccc;padding:4px 8px;text-align:left}}
h2{{margin-top:2rem}}
</style></head><body>
<h1>Crossref Fidelity Audit — PR 7/10</h1>
<p><b>Authority entries:</b> {len(authority)} — <b>Inline uses scanned:</b> {len(classified)}</p>
<p><b>Classification:</b>
GREEN {by_flag.get('GREEN',0)} ·
YELLOW (overlap=1) {by_flag.get('YELLOW',0)} ·
YELLOW_LOW (overlap=0) {by_flag.get('YELLOW_LOW',0)} ·
RED_MISSING {by_flag.get('RED_MISSING',0)}</p>
<h2>Per-chapter</h2>
<table><tr><th>chapter</th><th>total</th><th>green</th><th>yellow</th><th>red</th></tr>
{html_rows}</table>
<h2>RED — invented codes (sample 20)</h2>
<ul>{red_examples}</ul>
<h2>YELLOW_LOW — zero keyword overlap (sample 20)</h2>
<ul>{yellow_low_examples}</ul>
</body></html>"""
    (GEN / "crossref_audit_report_2026-04-24.html").write_text(html, encoding="utf-8")
    print(f"\nReport written to generated/crossref_audit_report_2026-04-24.html")

if __name__ == "__main__":
    main()
