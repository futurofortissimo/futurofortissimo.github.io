#!/usr/bin/env python3
"""
regen_index_2026-04-24.py — PR 8/10 index regen live (idempotent).

Artefatti prodotti come pura funzione di book/ state:
  1. book/ffxy-index.json         (gia' gestito da scripts/build_ffxy_index.mjs, richiamato qui)
  2. book/used_codes_book.txt     (flat unique ff.X.Y trovati in book/)
  3. book/unused_codes_book.txt   (codici presenti in data.js ma NON in book/)
  4. book/index.html              (stats block + meta + OG + Twitter + JSON-LD + Ultime aggiunte)
  5. book/ffxy-index.html         (HTML listing auto-rigenerato se presente)
  6. book/chapter-colors.json     (audit colori per capitolo)

Human-curated pieces (intro text, card chapter grid) sono preservati.
Run: python book/scripts/regen_index_2026-04-24.py
"""
import json, re, subprocess, sys, os
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT = Path(__file__).resolve().parents[2]
BOOK = ROOT / "book"
TODAY = "2026-04-24"

# -----------------------------------------------------------------
# Chapter metadata + color mapping (single source of truth)
# -----------------------------------------------------------------
CHAPTERS = [
    {"file": "chapter-01-mobilita.html",     "chapter": 1, "sub": "1.1", "name": "Mobilita e Citta",     "color": "#2ecc71", "var": "--ff-green"},
    {"file": "chapter-01-ambiente.html",      "chapter": 1, "sub": "1.2", "name": "Ambiente ed Energia",  "color": "#2ecc71", "var": "--ff-green"},
    {"file": "chapter-01-cibo.html",          "chapter": 1, "sub": "1.3", "name": "Cibo e Fashion",       "color": "#2ecc71", "var": "--ff-green"},
    {"file": "chapter-02-robotica.html",      "chapter": 2, "sub": "2.1", "name": "Robotica e AI",        "color": "#4a90e2", "var": "--ff-blue"},
    {"file": "chapter-02-metaverso.html",     "chapter": 2, "sub": "2.2", "name": "Metaverso e Cripto",   "color": "#4a90e2", "var": "--ff-blue"},
    {"file": "chapter-02-prodotti.html",      "chapter": 2, "sub": "2.3", "name": "Prodotti di consumo",  "color": "#4a90e2", "var": "--ff-blue"},
    {"file": "chapter-03-psicologia.html",    "chapter": 3, "sub": "3.1", "name": "Psicologia e Wellbeing","color": "#d0021b", "var": "--ff-red"},
    {"file": "chapter-03-alimentazione.html", "chapter": 3, "sub": "3.2", "name": "Alimentazione e Sport","color": "#d0021b", "var": "--ff-red"},
    {"file": "chapter-03-cultura.html",       "chapter": 3, "sub": "3.3", "name": "Cultura e Demografia", "color": "#d0021b", "var": "--ff-red"},
]

FFXY_RE = re.compile(r"(?<![\w.])ff\.(\d{1,3})\.(\d{1,2})(?!\d)")

# -----------------------------------------------------------------
# STEP 1 - parse live book state
# -----------------------------------------------------------------
def parse_book_state():
    used_codes = set()
    fonti_total = 0
    per_chapter = {}
    for ch in CHAPTERS:
        p = BOOK / ch["file"]
        txt = p.read_text(encoding="utf-8", errors="ignore")
        codes = set(f"ff.{a}.{b}" for a, b in FFXY_RE.findall(txt))
        # count "fonti esterne" - pattern in use: <li id="fonte-N">
        fonte_items = re.findall(r'<li[^>]*id="fonte-\d+"', txt)
        fonti = len(fonte_items)
        fonti_total += fonti
        per_chapter[ch["file"]] = {
            "codes": sorted(codes, key=lambda c: tuple(int(x) for x in c[3:].split("."))),
            "fonti": fonti,
            "ff_count": len(codes),
        }
        used_codes |= codes
    return used_codes, fonti_total, per_chapter


# -----------------------------------------------------------------
# STEP 2 - parse data.js to know full corpus
# -----------------------------------------------------------------
def parse_data_js_codes():
    dj = (ROOT / "data.js").read_text(encoding="utf-8", errors="ignore")
    # codes referenced in subchapter titles like "ff.148.1"
    codes = set(f"ff.{a}.{b}" for a, b in FFXY_RE.findall(dj))
    return codes


# -----------------------------------------------------------------
# STEP 3 - write used/unused flat files
# -----------------------------------------------------------------
def sort_codes(codes):
    def key(c):
        m = FFXY_RE.match(c)
        return (int(m.group(1)), int(m.group(2))) if m else (0, 0)
    return sorted(codes, key=key)


def write_codes(used, corpus):
    used_sorted = sort_codes(used)
    unused_sorted = sort_codes(corpus - used)
    (BOOK / "used_codes_book.txt").write_text("\n".join(used_sorted) + "\n", encoding="utf-8")
    (BOOK / "unused_codes_book.txt").write_text("\n".join(unused_sorted) + "\n", encoding="utf-8")
    return used_sorted, unused_sorted


# -----------------------------------------------------------------
# STEP 4 - chapter-colors.json + color audit
# -----------------------------------------------------------------
def audit_colors():
    colors = {
        "schema": {
            "natura":     {"var": "--ff-green", "hex": "#2ecc71"},
            "tecnologia": {"var": "--ff-blue",  "hex": "#4a90e2"},
            "societa":    {"var": "--ff-red",   "hex": "#d0021b"},
        },
        "chapters": []
    }
    audit_lines = [f"# Color audit — {TODAY}\n"]
    mismatches = 0
    fixes = 0
    for ch in CHAPTERS:
        p = BOOK / ch["file"]
        txt = p.read_text(encoding="utf-8", errors="ignore")
        # check --accent declaration (authoritative palette pointer)
        m = re.search(r"--accent\s*:\s*var\((--ff-[a-z]+)\)", txt)
        accent_var = m.group(1) if m else None
        expected = ch["var"]
        # count usages of accent value vs other palette colors for signal strength
        hits_green = len(re.findall(r"--ff-green|#2ecc71", txt))
        hits_blue  = len(re.findall(r"--ff-blue|#4a90e2", txt))
        hits_red   = len(re.findall(r"--ff-red|#d0021b", txt))
        totals = {"--ff-green": hits_green, "--ff-blue": hits_blue, "--ff-red": hits_red}
        ok = accent_var == expected
        if not ok:
            mismatches += 1
            audit_lines.append(
                f"- MISMATCH {ch['file']}: atteso --accent={expected}, trovato --accent={accent_var} ({totals})"
            )
        else:
            audit_lines.append(f"- OK {ch['file']}: --accent={accent_var} ({totals})")
        colors["chapters"].append({
            "file": ch["file"],
            "chapter": ch["chapter"],
            "sub": ch["sub"],
            "name": ch["name"],
            "accent_var": ch["var"],
            "accent_hex": ch["color"],
            "hits": totals,
            "ok": ok,
        })
    (BOOK / "chapter-colors.json").write_text(json.dumps(colors, indent=2, ensure_ascii=False), encoding="utf-8")
    gen_dir = ROOT / "generated"
    gen_dir.mkdir(exist_ok=True)
    audit_path = gen_dir / f"color_audit_{TODAY}.md"
    if mismatches == 0:
        audit_lines.append("\nTutti i capitoli usano la palette attesa. Nessun mismatch.\n")
    audit_path.write_text("\n".join(audit_lines), encoding="utf-8")
    return mismatches, fixes, audit_path


# -----------------------------------------------------------------
# STEP 5 - ffxy-index.html regen
# -----------------------------------------------------------------
def regen_ffxy_index_html(used_sorted, per_chapter):
    idx_path = BOOK / "ffxy-index.html"
    if not idx_path.exists():
        return False
    # map code -> chapter file (first chapter that contains it)
    code_to_file = {}
    for ch_file, info in per_chapter.items():
        for c in info["codes"]:
            code_to_file.setdefault(c, ch_file)
    rows = []
    for c in used_sorted:
        f = code_to_file.get(c, "")
        anchor = "ffxy-" + c.replace("ff.", "").replace(".", "-")
        href = f"/book/{f}#{anchor}" if f else "#"
        rows.append(f'  <li><a href="{href}">{c}</a> — <span class="ffxy-file">{f}</span></li>')
    html = f"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>Indice ff.x.y — Futuro Fortissimo (libro)</title>
<meta name="description" content="Indice completo dei {len(used_sorted)} riferimenti ff.x.y presenti nel libro Futuro Fortissimo.">
<style>
 body{{font-family:Inter,system-ui,sans-serif;max-width:780px;margin:2rem auto;padding:0 1rem;color:#111}}
 h1{{font-family:'Playfair Display',serif;font-size:1.8rem;margin-bottom:.4rem}}
 .meta{{color:#666;font-size:.85rem;margin-bottom:1.2rem}}
 ul{{list-style:none;padding:0;columns:2;column-gap:2rem}}
 li{{break-inside:avoid;padding:.2rem 0;font-size:.88rem}}
 a{{color:#0a0a0a;text-decoration:none;border-bottom:1px dotted #bbb}}
 .ffxy-file{{color:#888;font-size:.78rem}}
 @media(max-width:640px){{ul{{columns:1}}}}
</style>
</head>
<body>
<h1>Indice ff.x.y</h1>
<p class="meta">Rigenerato {TODAY} — {len(used_sorted)} riferimenti iniettati nel libro</p>
<ul>
{chr(10).join(rows)}
</ul>
<p class="meta"><a href="/book/">&larr; torna al libro</a></p>
</body>
</html>
"""
    idx_path.write_text(html, encoding="utf-8")
    return True


# -----------------------------------------------------------------
# STEP 6 - update index.html (stats + meta + JSON-LD + Ultime aggiunte)
# -----------------------------------------------------------------
def git_recent_ffxy(days=3):
    """Return set of ff.X.Y codes that appear as ADDED lines in commits touching
    book/ chapter files in the last N days on the current branch only (first-parent).
    Restricts to codes truly NEW (not present in the earliest parent of the window).
    """
    try:
        # Find commits on FIRST-PARENT line of current branch in last N days
        since = f"{days}.days.ago"
        cmd = ["git", "-C", str(ROOT), "log", "--first-parent", f"--since={since}",
               "--pretty=format:%H", "--", "book/chapter-*.html"]
        commits = subprocess.check_output(cmd, text=True).strip().splitlines()
        if not commits:
            return set()
        # compute baseline: parent of oldest commit in window
        oldest = commits[-1]
        try:
            baseline = subprocess.check_output(
                ["git", "-C", str(ROOT), "rev-parse", f"{oldest}^"], text=True
            ).strip()
        except subprocess.CalledProcessError:
            return set()
        # diff baseline..HEAD restricted to chapter files
        diff = subprocess.check_output(
            ["git", "-C", str(ROOT), "diff", "--unified=0", f"{baseline}..HEAD",
             "--", "book/chapter-*.html"],
            text=True, errors="ignore"
        )
        added = set()
        removed = set()
        for line in diff.splitlines():
            if line.startswith("+++") or line.startswith("---"):
                continue
            if line.startswith("+"):
                for a, b in FFXY_RE.findall(line):
                    added.add(f"ff.{a}.{b}")
            elif line.startswith("-"):
                for a, b in FFXY_RE.findall(line):
                    removed.add(f"ff.{a}.{b}")
        # a code is "truly new" if added but not already present at baseline
        return added - removed
    except Exception as e:
        print(f"[warn] git_recent_ffxy: {e}")
        return set()


def update_index_html(ffxy_total, fonti_total, words_k, used_sorted, recent_codes, code_titles):
    p = BOOK / "index.html"
    txt = p.read_text(encoding="utf-8")
    orig = txt
    # stats appear as "456 fonti esterne" + "134 ff.x.y citati" + "54k parole" + "481 riferimenti"
    fonti_str = str(fonti_total)
    ffxy_str = str(ffxy_total)
    words_str = f"{words_k}k"
    total_refs = ffxy_total  # injected unique codes
    # Replace "<N> fonti esterne"
    txt = re.sub(r"\b\d{2,4}\s+fonti\s+esterne", f"{fonti_str} fonti esterne", txt)
    txt = re.sub(r"\b\d{2,4}\s+fonti\s+esterne\b", f"{fonti_str} fonti esterne", txt)
    # "<N> fonti," in CTA
    txt = re.sub(r"\b\d{2,4}\s+fonti,", f"{fonti_str} fonti,", txt)
    # "<N> fonti esterne e <N> riferimenti al corpus"
    txt = re.sub(r"\b\d{2,4}\s+riferimenti\s+al\s+corpus", f"{ffxy_str} riferimenti al corpus", txt)
    # "<N> ff.x.y citati"
    txt = re.sub(r"\b\d{2,4}\s+ff\.x\.y\s+citati", f"{ffxy_str} ff.x.y citati", txt)
    # "<N>k parole"
    txt = re.sub(r"\b\d{2,3}k\s+parole", f"{words_str} parole", txt)
    # "<N> riferimenti in totale"
    txt = re.sub(r"\b\d{2,4}\s+riferimenti\s+in\s+totale", f"{total_refs} riferimenti in totale", txt)
    # Aggiornato <date>
    txt = re.sub(r"Aggiornato\s+\d{4}-\d{2}-\d{2}", f"Aggiornato {TODAY}", txt)
    # JSON-LD dateModified
    txt = re.sub(r'"dateModified":\s*"\d{4}-\d{2}-\d{2}"', f'"dateModified": "{TODAY}"', txt)
    # og:updated_time could exist or not - inject if present
    txt = re.sub(r'content="\d{4}-\d{2}-\d{2}"\s*/>\s*<!--\s*og:updated', f'content="{TODAY}" /><!-- og:updated', txt)

    # Ultime aggiunte toggle -- insert before Intro card
    # Remove any previous auto-generated block (tolerant match on start marker)
    txt = re.sub(r"\n?\s*<!-- ULTIME_AGGIUNTE:start[^>]*-->[\s\S]*?<!-- ULTIME_AGGIUNTE:end -->\n?", "", txt)

    recent_cards_html = ""
    cards_added = 0
    if recent_codes:
        cards = []
        for c in sorted(recent_codes, key=lambda x: tuple(int(n) for n in x[3:].split("."))):
            title = code_titles.get(c, "")
            anchor = "ffxy-" + c.replace("ff.", "").replace(".", "-")
            cards.append(
                f'  <li style="padding:0.45rem 0;border-bottom:1px dashed #e5e5e5;font-size:0.88rem;">'
                f'<a href="#{anchor}" style="color:#111;text-decoration:none;"><strong style="font-family:\'IBM Plex Mono\',monospace;">{c}</strong>'
                f' — {title}</a></li>'
            )
            cards_added += 1
        recent_cards_html = (
            "\n    <!-- ULTIME_AGGIUNTE:start (auto-gen, last 3 days) -->\n"
            '    <section class="brutal-card accent-bar mt-6" style="border-color:var(--ff-black);">\n'
            '      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;">\n'
            '        <span style="font-size:1.3rem;">&#128293;</span>\n'
            '        <div>\n'
            '          <div class="ff-eyebrow" style="color: var(--ff-black);">Fresh</div>\n'
            f'          <h2 class="text-base font-bold uppercase mt-1">Ultime aggiunte &middot; {cards_added} ff.x.y negli ultimi 3 giorni</h2>\n'
            '        </div>\n'
            '      </div>\n'
            '      <ul style="list-style:none;padding:0;margin:0;">\n'
            + "\n".join(cards) +
            '\n      </ul>\n'
            f'      <p class="ff-body-sm" style="margin-top:0.7rem;color:#666;font-size:0.8rem;">Rigenerato automaticamente il {TODAY}. Finestra: 3 giorni.</p>\n'
            '    </section>\n'
            "    <!-- ULTIME_AGGIUNTE:end -->\n"
        )
        # insert before intro card (section with class brutal-card accent-bar mt-6 followed by ff-body Tre saggi)
        marker = '    <!-- Intro card -->'
        if marker in txt:
            txt = txt.replace(marker, recent_cards_html + "\n" + marker, 1)
        else:
            # fallback: after main opening
            txt = txt.replace('<main class="max-w-4xl mx-auto px-4 py-10">',
                              '<main class="max-w-4xl mx-auto px-4 py-10">' + recent_cards_html, 1)

    changed = txt != orig
    if changed:
        p.write_text(txt, encoding="utf-8")
    return changed, cards_added


# -----------------------------------------------------------------
# STEP 7 - collect titles from ffxy-index.json (built by part 1)
# -----------------------------------------------------------------
def load_code_titles():
    idx = json.loads((BOOK / "ffxy-index.json").read_text(encoding="utf-8"))
    return {e["code"]: (e.get("title") or e.get("sectionTitle") or "") for e in idx}


# -----------------------------------------------------------------
# STEP 8 - word count (rough)
# -----------------------------------------------------------------
def approx_word_count():
    total = 0
    for ch in CHAPTERS:
        p = BOOK / ch["file"]
        txt = p.read_text(encoding="utf-8", errors="ignore")
        # strip head/script/style
        txt = re.sub(r"<head[\s\S]*?</head>", " ", txt, flags=re.I)
        txt = re.sub(r"<script[\s\S]*?</script>", " ", txt, flags=re.I)
        txt = re.sub(r"<style[\s\S]*?</style>", " ", txt, flags=re.I)
        # remove bibliography/fonti section (don't count URL spam as prose)
        txt = re.sub(r'<section[^>]*id="bibliografia"[\s\S]*?</section>', " ", txt, flags=re.I)
        plain = re.sub(r"<[^>]+>", " ", txt)
        plain = re.sub(r"\s+", " ", plain)
        total += len(plain.split())
    return total


# -----------------------------------------------------------------
# MAIN
# -----------------------------------------------------------------
def main():
    print(f"== PR 8/10 regen @ {TODAY} ==")
    # part 1 (ffxy-index.json + ffxy-historical.json) — delegated to canonical mjs script
    try:
        res = subprocess.run(
            ["node", "scripts/build_ffxy_index.mjs"], cwd=ROOT,
            check=False, capture_output=True, text=True
        )
        if res.returncode != 0:
            print("[warn] build_ffxy_index.mjs stderr:", res.stderr[-400:])
    except FileNotFoundError:
        print("[warn] node not available, ffxy-index.json not rebuilt here (run manually)")

    used, fonti_total, per_chapter = parse_book_state()
    corpus = parse_data_js_codes()
    used_sorted, unused_sorted = write_codes(used, corpus)
    mm, fx, audit_path = audit_colors()
    regen_html = regen_ffxy_index_html(used_sorted, per_chapter)

    # Ultime aggiunte: grab recent codes from git log
    recent = git_recent_ffxy(days=3) & used
    # drop codes that are truly brand-new in book/ (not previously in used)
    titles = load_code_titles() if (BOOK / "ffxy-index.json").exists() else {}
    total_words = approx_word_count()
    words_k = round(total_words / 1000)

    changed, cards_added = update_index_html(
        ffxy_total=len(used_sorted),
        fonti_total=fonti_total,
        words_k=words_k,
        used_sorted=used_sorted,
        recent_codes=recent,
        code_titles=titles,
    )

    print(f"Chapters parsed : {len(CHAPTERS)}")
    print(f"Fonti esterne   : {fonti_total}")
    print(f"ff.x.y in book/ : {len(used_sorted)}")
    print(f"Corpus total    : {len(corpus)}")
    print(f"Unused          : {len(unused_sorted)}")
    print(f"Color mismatches: {mm} (fixes {fx})")
    print(f"Color audit     : {audit_path.relative_to(ROOT)}")
    print(f"ffxy-index.html : {'regen' if regen_html else 'absent'}")
    print(f"Ultime aggiunte : {cards_added} card (finestra 3gg)")
    print(f"index.html      : {'updated' if changed else 'unchanged'}")
    print(f"Word count      : ~{total_words} ({words_k}k)")


if __name__ == "__main__":
    main()
