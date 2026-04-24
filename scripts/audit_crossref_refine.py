#!/usr/bin/env python3
"""
Refinement pass: take previous YELLOW_LOW/YELLOW classifications and re-score
with a more forgiving heuristic that uses title-word substrings too.
Outputs a shortlist of genuinely problematic ff.X.Y usages.
"""
import json
import re
import sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"C:\Users\micme\Desktop\micmer\futuro fortissimo")
GEN = ROOT / "generated"

STOP = set("""a al alla allo alle agli ai ad anche come con contro cosa cosi cui d da dal dalla dalle dagli dai del della delle dello degli dei di dove due e ed egli elle essere fra ha ho il in io l la le lo loro ma me mi mia mie miei mio ne non nostra nostre nostri nostro o od oggi ogni oltre per piu poi pero quale quali quanto quando quasi quel quella quelle quelli quello questa queste questi questo se sia sono su sua sue suo sugli sul sulla sulle sullo suoi te ti tra tre tu tua tue tuo tuoi un una uno vi voi gia fare fatto dell dell nell nell sull sull all all un dove quando chi come""".split())

def words(text):
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    return [w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ]{4,}", text) if w.lower() not in STOP]

def core_words(s):
    return [w for w in words(s) if len(w) >= 5]

authority = json.load(open(GEN / "ffxy_authority_2026-04-24.json", encoding="utf-8"))
uses = json.load(open(GEN / "ffxy_inline_uses_2026-04-24.json", encoding="utf-8"))

def refine(u):
    code = u["ff_code"]
    auth = authority.get(code)
    if not auth:
        return "RED"
    ctx = u["context"].lower()
    # gather key substrings from title + content (first 200)
    title_cores = core_words(auth["title"])
    content_cores = core_words(auth.get("content", "")[:400])
    desc_cores = core_words(auth.get("description", ""))
    # unique 5+char roots
    roots = set()
    for w in title_cores + content_cores[:20] + desc_cores:
        # take 5-char prefix as crude root
        roots.add(w[:5])
    # count how many root-prefixes appear in context (excluding title echo)
    # Remove the title echo from ctx to avoid false positives
    title_raw = re.sub(r"ff\.\d+\.\d+", "", auth["title"]).lower()
    ctx_stripped = ctx
    # we keep ctx with title — it's ok because we want to detect BEYOND title
    # Count distinct root hits in the surrounding 250 chars on EACH side of the code
    mstart = ctx.find(code.lower())
    if mstart < 0:
        # fallback: entire ctx
        left = ctx
        right = ""
    else:
        left = ctx[:mstart]
        right = ctx[mstart + len(code):]
    # Additionally remove the rendered title phrase from left/right if present
    # find chunk "ff.X.Y TITLE )" — strip title text
    title_text_clean = re.sub(r"[^\w ]", " ", title_raw)
    for word in title_text_clean.split():
        if len(word) >= 5:
            left = left.replace(word, " ")
            right = right.replace(word, " ")
    hits = 0
    hit_words = set()
    for root in roots:
        if len(root) < 4:
            continue
        # find in left OR right
        if root in left or root in right:
            hits += 1
            hit_words.add(root)
    if hits >= 2:
        return "GREEN_REFINED"
    if hits == 1:
        return "YELLOW_REFINED"
    return "RED_WEAK"

# apply refinement to everything NOT already GREEN and NOT fc_span-toc etc.
# focus on fc_span + text kinds
interesting = [u for u in uses if u["flag"] in ("YELLOW", "YELLOW_LOW", "RED_MISSING")]
print(f"Refining {len(interesting)} flagged usages …")

refined_reds = []
refined_yellows = []
refined_greens = 0

for u in interesting:
    r = refine(u)
    u["refined"] = r
    if r == "RED":
        refined_reds.append(u)
    elif r == "RED_WEAK":
        refined_reds.append(u)
    elif r == "YELLOW_REFINED":
        refined_yellows.append(u)
    else:
        refined_greens += 1

from collections import Counter
print(f"Refined GREEN: {refined_greens}")
print(f"Refined YELLOW: {len(refined_yellows)}")
print(f"Refined RED: {len(refined_reds)}")
print(f"  of which RED_MISSING: {sum(1 for u in refined_reds if u['refined']=='RED')}")
print(f"  of which RED_WEAK: {sum(1 for u in refined_reds if u['refined']=='RED_WEAK')}")

# breakdown by kind for the weak reds (most concerning)
by_kind = Counter(u["kind"] for u in refined_reds if u["refined"] == "RED_WEAK")
print(f"RED_WEAK by kind: {dict(by_kind)}")

# Save shortlist
json.dump(
    {
        "red_missing": [u for u in refined_reds if u["refined"] == "RED"],
        "red_weak": [u for u in refined_reds if u["refined"] == "RED_WEAK"],
        "yellow_refined": refined_yellows,
    },
    open(GEN / "ffxy_fix_shortlist_2026-04-24.json", "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=2,
)
print(f"\nShortlist -> generated/ffxy_fix_shortlist_2026-04-24.json")

# Print a sample of RED_WEAK fc_span for inspection
weak_fc = [u for u in refined_reds if u["refined"] == "RED_WEAK" and u["kind"] == "fc_span"]
print(f"\nRED_WEAK fc_span: {len(weak_fc)} — sample 20")
for u in weak_fc[:20]:
    print(f"  {u['chapter']} :: {u['ff_code']}")
    print("    auth title:", authority[u['ff_code']]['title'][:80])
    print("    ctx:", u['context'][:260].replace(chr(10), ' '))
