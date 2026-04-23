"""Capitalize first letter of every <a>...</a> anchor text inside every
<li id="fonte-N"> of every book/chapter-*.html.

Rules:
- only capitalize the FIRST alphabetic character
- preserve HTML entities (&ldquo;, &eacute;, etc)
- skip leading quotes (straight, &ldquo;, &laquo;, &#8220;, &#171;, "«")
- skip leading <em>/<strong>/<i>/<b> — descend inside and capitalize there
- skip if first non-whitespace char is a digit, emoji, or already uppercase
"""
import os
import re
import glob
import json

ROOT = os.path.join(os.path.dirname(__file__), "..")
BOOK_DIR = os.path.join(ROOT, "book")

# entities that are leading punctuation / quotes to skip
QUOTE_ENTITIES = (
    "&ldquo;", "&rdquo;", "&lsquo;", "&rsquo;",
    "&laquo;", "&raquo;", "&#8220;", "&#8221;", "&#8216;", "&#8217;",
    "&#171;", "&#187;", "&quot;",
)


def capitalize_anchor_text(text: str) -> tuple[str, bool]:
    """Capitalize the first alphabetic char of anchor text (HTML).

    Returns (new_text, changed).
    """
    i = 0
    n = len(text)
    # descend through nested em/strong/i/b wrappers
    while i < n:
        # whitespace
        while i < n and text[i].isspace():
            i += 1
        if i >= n:
            return text, False
        # leading quote entity
        matched_entity = False
        for ent in QUOTE_ENTITIES:
            if text.startswith(ent, i):
                i += len(ent)
                matched_entity = True
                break
        if matched_entity:
            continue
        # straight quote char
        if text[i] in ('"', '“', '”', '‘', '’', '«', '»', "'"):
            i += 1
            continue
        # inner tag wrapper
        m = re.match(r'<(em|strong|i|b|span)(\s[^>]*)?>', text[i:])
        if m:
            i += m.end()
            continue
        break

    if i >= n:
        return text, False

    ch = text[i]
    if ch.isalpha():
        if ch.islower():
            new_text = text[:i] + ch.upper() + text[i + 1:]
            return new_text, True
        return text, False
    # could be an entity that represents a lowercase letter, like &egrave;
    m = re.match(r'&([a-zA-Z]+);', text[i:])
    if m:
        name = m.group(1)
        # Map lowercase named entities to their uppercase counterpart when it
        # exists in HTML entity vocabulary.
        if name and name[0].islower():
            candidate = name[0].upper() + name[1:]
            # list of known uppercase entity names (same stems): conservative set
            upper_known = {
                "Agrave","Aacute","Acirc","Atilde","Auml","Aring","Aelig","AElig",
                "Egrave","Eacute","Ecirc","Euml","Igrave","Iacute","Icirc","Iuml",
                "Ograve","Oacute","Ocirc","Otilde","Ouml","Ugrave","Uacute","Ucirc",
                "Uuml","Ntilde","Ccedil","Yacute",
            }
            if candidate in upper_known:
                new_ent = "&" + candidate + ";"
                new_text = text[:i] + new_ent + text[i + m.end():]
                return new_text, True
    return text, False


def process_biblio_li_anchors(html: str) -> tuple[str, int]:
    """Inside each <li id="fonte-N">...</li>, find the FIRST <a>...</a> with text
    content (skip the 'Torna al testo' back-link) and capitalize the first letter."""
    changed_count = 0

    # Work only inside the bibliography section
    sec_m = re.search(r'<section id="bibliografia"[^>]*>', html)
    if not sec_m:
        return html, 0
    sec_start = sec_m.end()
    sec_close = html.find('</section>', sec_start)
    if sec_close == -1:
        return html, 0

    biblio_block = html[sec_start:sec_close]

    # find each <li id="fonte-N">...</li>
    def process_li(li_html: str) -> str:
        nonlocal changed_count
        # find the first <a ... >text</a> whose text is not just a back-link arrow
        # back-link pattern: <a href="#ref-fonte-..." ...>&#8617;</a> -> aria-label="Torna al testo"
        pos = 0
        while True:
            m = re.search(r'<a\s[^>]*>(.*?)</a>', li_html[pos:], re.DOTALL)
            if not m:
                return li_html
            a_tag = m.group(0)
            inner = m.group(1)
            abs_start = pos + m.start()
            abs_end = pos + m.end()
            # skip if it's a back-link (href starts with #ref-fonte-)
            # or contains only arrow entities / aria-label for back link
            if re.search(r'href="#ref-fonte-', a_tag) or 'Torna al testo' in a_tag:
                pos = abs_end
                continue
            new_inner, did = capitalize_anchor_text(inner)
            if did:
                # rebuild the a tag with new inner
                new_tag = a_tag[:m.start(1) - m.start()] + new_inner + a_tag[m.end(1) - m.start():]
                # Actually simpler: use the match offsets
                # the <a ...> open tag and </a> close tag are unchanged; only inner differs.
                open_tag_end = a_tag.index('>') + 1
                new_a = a_tag[:open_tag_end] + new_inner + '</a>'
                li_html = li_html[:abs_start] + new_a + li_html[abs_end:]
                changed_count += 1
            return li_html

    # split into <li>...</li> blocks
    li_pattern = re.compile(r'(<li id="fonte-\d+"[^>]*>)(.*?)(</li>)', re.DOTALL)
    def repl(m):
        head = m.group(1)
        body = m.group(2)
        tail = m.group(3)
        # process this li body (as the inner part between open/close)
        new_body = process_li(body)
        return head + new_body + tail

    new_biblio = li_pattern.sub(repl, biblio_block)
    if new_biblio == biblio_block:
        return html, 0
    return html[:sec_start] + new_biblio + html[sec_close:], changed_count


def main():
    files = sorted(glob.glob(os.path.join(BOOK_DIR, "chapter-*.html")))
    summary = []
    total = 0
    for f in files:
        html = open(f, "r", encoding="utf-8").read()
        new_html, n = process_biblio_li_anchors(html)
        if n > 0 and new_html != html:
            with open(f, "w", encoding="utf-8") as out:
                out.write(new_html)
        summary.append({"file": os.path.basename(f), "capitalized": n})
        total += n

    out_path = os.path.join(ROOT, "openclaw", "tmp", "capitalize-biblio-result-2026-04-22.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as o:
        json.dump(summary, o, indent=2, ensure_ascii=False)

    non_zero = [s for s in summary if s["capitalized"] > 0]
    print(f"Total capitalizations: {total} across {len(non_zero)} files (of {len(files)} scanned).")
    for s in non_zero:
        print(f"  {s['file']}: {s['capitalized']}")


if __name__ == "__main__":
    main()
