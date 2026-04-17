"""Automated rewrite of cfr. <span class="fc">ff.X.Y ...</span> to autorial bridges.

Strict strategy (fidelity first):
 1. For each cfr. in scope, extract hosting paragraph and cited ff.X.Y content from data.js.
 2. Find a SHARED multi-word phrase (2-6 consecutive content words) that appears in BOTH
    the content and the paragraph (case-insensitive, stripped of entities).
 3. If found → rewrite cross-ref as autorial bridge citing that phrase.
 4. If NOT found → DROP the cross-ref parenthetical (fidelity > preservation, per §0.decies).

Writes JSON diff report + actually modifies the HTML.
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

# Words we never treat as "content" when seeking a shared phrase
STOP = set("""
il lo la i gli le un uno una e ed o ma se che chi cui come dove quando perché perche
di a da in su per con tra fra al allo alla ai agli alle del dello della dei degli delle
nel nello nella nei negli nelle sul sullo sulla sui sugli sulle col coi
mi ti si ci vi si me te sé lui lei noi voi loro
non più meno anche ancora già mai sempre ormai appena forse magari
questo questa quello quella quelle questi
è sono era erano stato stata stati state essere avere ho hai ha hanno avevo avevi
aveva avevano
davvero molto poco tanto troppo tanti molti molte tutti tutte
cosa cose modo modi caso casi anno anni mese mesi giorno giorni
solo solamente proprio stesso stessa stessi stesse
prima dopo dietro avanti sotto sopra dentro fuori verso
quindi però invece pure tuttavia dunque inoltre oltre
altro altra altri altre nuovo nuova nuovi nuove vecchio vecchia vecchi vecchie
dal dallo dalla dagli dalle
qualche alcuni alcune alcuno alcuna ogni ognuno ognuna ciascuno ciascuna entrambi entrambe
parecchi parecchie diverso diversa diversi diverse vari varie
molta poca pure anche mentre proprio simile simili pari talmente ecco insomma infine quasi
abbia avere avuto avuta avuti avute
""".split())

MIN_TOKEN_LEN = 4   # token must be >= 4 chars to count as content
MIN_PHRASE_TOKENS = 2  # phrase must be >= 2 content tokens

def load_ffxy_contents():
    ds = (BASE / 'data.js').read_text(encoding='utf-8')
    contents = {}
    # Subchapter-level (ff.X.Y)
    pattern = re.compile(r'"title":\s*"([^"]*?ff\.(\d+\.\d+)[^"]*)"[^{]*?"link":[^{]*?"content":\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)
    for m in pattern.finditer(ds):
        title = m.group(1)
        code = 'ff.' + m.group(2)
        content = m.group(3).replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
        contents[code] = {'title': title, 'content': content}
    # Newsletter-level (ff.X): aggregate content = concatenation of its subchapters
    # Find outer blocks: {"url":...,"title":"🎼 ff.N ...","subtitle":...,"keypoints":[...],"subchapters":[...]}
    # We match the top-level title and then aggregate subchapters' content under ff.N
    # Simpler: iterate all ff.N.Y and group by N
    from collections import defaultdict
    newsletter_content = defaultdict(list)
    newsletter_title = {}
    for code, data in contents.items():
        n = code.split('.')[1]
        newsletter_content[n].append(data['content'])
    # find titles like "ff.N "
    t_pattern = re.compile(r'"title":\s*"([^"]*\bff\.(\d+)(?!\.\d)\b[^"]*)"')
    for m in t_pattern.finditer(ds):
        title = m.group(1)
        n = m.group(2)
        if n not in newsletter_title:
            newsletter_title[n] = title
    for n, chunks in newsletter_content.items():
        code = f'ff.{n}'
        contents[code] = {
            'title': newsletter_title.get(n, code),
            'content': '\n'.join(chunks)
        }
    return contents

def entity_strip(s):
    s = re.sub(r'&mdash;', ' — ', s)
    s = re.sub(r'&rsquo;|&lsquo;', "'", s)
    s = re.sub(r'&ldquo;|&rdquo;|&quot;', '"', s)
    s = re.sub(r'&egrave;', 'è', s)
    s = re.sub(r'&agrave;', 'à', s)
    s = re.sub(r'&igrave;', 'ì', s)
    s = re.sub(r'&ograve;', 'ò', s)
    s = re.sub(r'&ugrave;', 'ù', s)
    s = re.sub(r'&eacute;', 'é', s)
    s = re.sub(r'&amp;', '&', s)
    s = re.sub(r'&nbsp;', ' ', s)
    s = re.sub(r'&[a-z#0-9]+;', ' ', s)
    return s

def strip_html(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = entity_strip(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def tokenize(s):
    """Lowercased word tokens (alpha + digit), preserving numbers/percentages."""
    return re.findall(r"[a-zàèéìòù]+|\d+(?:[.,]\d+)?%?", s.lower())

def is_content_token(t):
    if t in STOP:
        return False
    if len(t) < MIN_TOKEN_LEN:
        # allow numeric tokens (digits or percentages)
        if re.match(r'\d', t):
            return True
        return False
    return True

def find_shared_phrase(content, paragraph):
    """Find longest shared phrase of consecutive tokens where at least MIN_PHRASE_TOKENS
    are content-bearing. Returns (phrase, debug) or (None, None).

    Strict: phrase must have either a numeric/percentage/unit token OR be proper-named
    (2+ capitalized tokens). Otherwise reject to avoid weak bridges.
    """
    c_clean = strip_html(content)
    p_clean = strip_html(paragraph)

    p_low = p_clean.lower()

    token_pattern = re.compile(r"[a-zàèéìòùA-ZÀÈÉÌÒÙ]+|\d+(?:[.,]\d+)?%?", re.IGNORECASE)
    matches = list(token_pattern.finditer(c_clean))
    n = len(matches)

    best_strong = None  # phrase with numeric / named
    best_weak = None    # phrase without such (fallback, lower priority)

    for size in range(6, 1, -1):  # try 6, 5, 4, 3, 2
        for i in range(0, n - size + 1):
            sub_tokens_orig = [matches[i + k].group(0) for k in range(size)]
            sub_tokens = [t.lower() for t in sub_tokens_orig]
            cb = sum(1 for t in sub_tokens if is_content_token(t))
            if cb < MIN_PHRASE_TOKENS:
                continue
            if not (is_content_token(sub_tokens[0]) and is_content_token(sub_tokens[-1])):
                continue
            # Last token cannot be a bare number (phrase would read truncated)
            if re.fullmatch(r'\d+(?:[.,]\d+)?%?', sub_tokens[-1]) and '%' not in sub_tokens[-1]:
                continue
            # First token cannot be a bare function-like participle
            if sub_tokens[0] in {'legate', 'legati', 'legato', 'legata', 'dovuto', 'dovuta', 'dovuti', 'dovute', 'vicina', 'vicino', 'vicini', 'vicine'}:
                continue
            start_c = matches[i].start()
            end_c = matches[i + size - 1].end()
            # Reject if phrase is mid-word in content (prev/next char is a letter)
            prev_ch = c_clean[start_c - 1] if start_c > 0 else ' '
            next_ch = c_clean[end_c] if end_c < len(c_clean) else ' '
            if prev_ch.isalpha() or next_ch.isalpha():
                continue
            phrase = c_clean[start_c:end_c].strip('.,;:—()[] ')
            # reject phrases with unbalanced punctuation
            if phrase.count('(') != phrase.count(')'):
                continue
            if phrase.count('[') != phrase.count(']'):
                continue
            # Reject phrases with internal parens (often abbreviations or puns)
            if '(' in phrase or ')' in phrase:
                continue
            # reject phrases whose last token is ambiguous ("si potrebbe", "potrebbe", auxiliary verbs)
            trailing_bad = {'si', 'potrebbe', 'potrebbero', 'vuole', 'vogliono', 'possono', 'puo',
                            'già', 'gia', 'ancora', 'poi', 'quasi', 'forse', 'mai', 'sempre',
                            'sia', 'siano', 'fosse', 'fossero',
                            'vanno', 'va', 'vado', 'vai', 'andava', 'andavano',
                            'viene', 'vengono', 'veniva', 'venivano',
                            'arriva', 'arrivano', 'arrivava', 'arrivavano',
                            'fare', 'fatto', 'fatta', 'fatti', 'fatte',
                            'perche', 'perché',
                            'cioe', 'cioè', 'ossia',
                            'stesso', 'stessa', 'stessi', 'stesse',
                            'tutti', 'tutte', 'tutto', 'tutta',
                            'ovvero', 'ovvero',
                            'insomma', 'infine'}
            if sub_tokens[-1] in trailing_bad:
                continue
            # Reject phrases where last content token is a past participle only (heuristic)
            # (too aggressive — keep simpler)
            # reject if phrase starts with a number < 10 alone (e.g., a list marker "1" or "2")
            if re.fullmatch(r'\d', sub_tokens[0]):
                continue
            # Last token must be alpha (not a bare number/percentage)
            if re.match(r'^\d', sub_tokens[-1]):
                continue
            phrase_low = phrase.lower()
            # Phrase must occur in paragraph with word boundaries on both sides
            pat_search = re.compile(r'(?:^|[^a-zàèéìòù])' + re.escape(phrase_low) + r'(?:[^a-zàèéìòù]|$)')
            if not pat_search.search(p_low):
                continue
            # Also require phrase to start on a word boundary in content itself
            pat_search_c = re.compile(r'(?:^|[^a-zàèéìòù])' + re.escape(phrase_low) + r'(?:[^a-zàèéìòù]|$)')
            if not pat_search_c.search(c_clean.lower()):
                continue
            # Classify strength
            has_digit = any(re.match(r'\d', t) for t in sub_tokens)
            # named: at least 2 capitalized starting tokens (excluding sentence-initial)
            caps = sum(1 for t in sub_tokens_orig if t and t[0].isupper())
            has_named = caps >= 2
            strong = has_digit or has_named
            score = size * 10 + (5 if has_digit else 0) + (3 if has_named else 0)
            if strong:
                if best_strong is None or score > best_strong[0]:
                    best_strong = (score, phrase, f'n{size}-cb{cb}-digit{int(has_digit)}-named{int(has_named)}')
            else:
                if best_weak is None or score > best_weak[0]:
                    best_weak = (score, phrase, f'n{size}-cb{cb}-weak')

    if best_strong is not None:
        return best_strong[1], best_strong[2]
    # We're STRICT now: reject weak-only matches → drop
    return None, None

def extract_paragraph_bounds(txt, pos):
    p_start = txt.rfind('<p', 0, pos)
    p_end = txt.find('</p>', pos)
    if p_start < 0 or p_end < 0:
        return None, None
    return p_start, p_end + 4

def main():
    contents = load_ffxy_contents()
    print(f'Loaded {len(contents)} ff.X.Y entries', file=sys.stderr)

    files = ['book/chapter-01-mobilita.html', 'book/chapter-01-ambiente.html']
    report = []

    for fp in files:
        path = BASE / fp
        txt = path.read_text(encoding='utf-8')

        if 'ambiente' in fp:
            m = re.search(r'Eppure, dentro questo labirinto', txt)
            if m:
                scan_end = txt.rfind('<p', 0, m.start())
            else:
                scan_end = len(txt)
        else:
            scan_end = len(txt)

        # Pattern to capture "cfr." plus span, with surrounding parens/spaces
        pat = re.compile(r'(?P<lead>\s*\(?\s*)cfr\.\s*(?P<span>(?P<semi>&#\d+;|[\U0001F300-\U0001FAFF\u2600-\u27BF\u26A0-\u26FF\u2300-\u23FF]?\s*)?<span class="fc">[^<]*?</span>)(?P<trail>\s*\)?)')
        # Simpler pattern — we'll just handle (cfr. <span>...) and cfr. <span>...
        # Use two-step approach: find cfr. <span> and then check context

        simple_pat = re.compile(r'cfr\.\s*(?:&#\d+;\s*|[\U0001F300-\U0001FAFF\u2600-\u27BF\u26A0-\u26FF\u2300-\u23FF]\s*)?<span class="fc">[^<]*?</span>')
        edits = []
        for m in simple_pat.finditer(txt, 0, scan_end):
            full_start = m.start()
            full_end = m.end()
            original_core = m.group(0)
            # Extract span + code
            span_m = re.search(r'<span class="fc">[^<]*?</span>', original_core)
            span_html = span_m.group(0)
            # match subchapter first, else newsletter-level
            code_m = re.search(r'(ff\.\d+\.\d+)', span_html)
            if not code_m:
                code_m = re.search(r'(ff\.\d+)(?!\.\d)', span_html)
            if not code_m:
                continue
            code = code_m.group(1)

            # Extend outward to include wrapping parentheses + surrounding whitespace
            ext_s = full_start
            ext_e = full_end
            # look left for " ("
            # walk back over whitespace
            while ext_s > 0 and txt[ext_s - 1] in ' \t':
                ext_s -= 1
            if ext_s > 0 and txt[ext_s - 1] == '(':
                ext_s -= 1
                # also consume preceding space before '('
                if ext_s > 0 and txt[ext_s - 1] == ' ':
                    ext_s -= 1
            # look right for ")"
            while ext_e < len(txt) and txt[ext_e] in ' \t':
                ext_e += 1
            if ext_e < len(txt) and txt[ext_e] == ')':
                ext_e += 1
            # If wrapped in parens, we want to replace the full parenthetical
            wrapped = (txt[ext_s:ext_e].lstrip().startswith('(') and txt[ext_s:ext_e].rstrip().endswith(')'))

            p_s, p_e = extract_paragraph_bounds(txt, full_start)
            if p_s is None:
                continue
            para_html = txt[p_s:p_e]
            para_text = strip_html(para_html)

            data = contents.get(code, {'title': '', 'content': ''})
            phrase, dbg = find_shared_phrase(data['content'], para_text)

            if phrase is None:
                # Drop the entire parenthetical (including surrounding paren+spaces if any)
                if wrapped:
                    replacement = ''
                    s_e, ee_e = ext_s, ext_e
                    # if dropping creates double space, normalize after replacement
                else:
                    # original cfr. without parens — drop from first whitespace before to end
                    s_e, ee_e = full_start, full_end
                    replacement = ''
                decision = 'DROP (no shared phrase)'
            else:
                # Upgrade to autorial bridge sentence (short, specific)
                # Pattern: "In <SPAN> il punto era lo stesso: <phrase>."
                bridge = f'In {span_html} il punto era lo stesso: {phrase}.'
                if wrapped:
                    s_e, ee_e = ext_s, ext_e
                    replacement = ' ' + bridge
                else:
                    s_e, ee_e = full_start, full_end
                    replacement = bridge
                decision = f'UPGRADE ({dbg}) phrase="{phrase[:80]}"'

            edits.append({
                'file': fp,
                'code': code,
                'start': s_e,
                'end': ee_e,
                'original': txt[s_e:ee_e],
                'replacement': replacement,
                'decision': decision,
                'para_excerpt': para_text[:300],
                'phrase': phrase or '',
            })

        # Apply edits back to front
        edits_sorted = sorted(edits, key=lambda e: e['start'], reverse=True)
        for e in edits_sorted:
            s, ee = e['start'], e['end']
            rep = e['replacement']
            before = txt[s-1] if s > 0 else ''
            after = txt[ee] if ee < len(txt) else ''
            if rep == '':
                txt = txt[:s] + txt[ee:]
            else:
                # rep starts with " ", dedupe if before is space
                if before in ' \n\t' and rep.startswith(' '):
                    rep = rep[1:]
                # If bridge ends in "." and next char is "." → drop extra period
                if rep.endswith('.') and after == '.':
                    rep = rep[:-1]
                # If bridge starts with space+capital and preceding char is punctuation (no space), add space
                txt = txt[:s] + rep + txt[ee:]
            e['applied'] = True

        # Post-pass cleanups (paragraph-local)
        def normalize_p(m):
            inner = m.group(0)
            inner = re.sub(r'  +', ' ', inner)
            inner = re.sub(r'\s+\.', '.', inner)
            inner = re.sub(r'\s+,', ',', inner)
            inner = re.sub(r'\.{2,}', '.', inner)  # collapse multiple periods
            inner = re.sub(r'\(\s*\)', '', inner)  # empty parens
            inner = re.sub(r'\s+\)', ')', inner)
            inner = re.sub(r'\(\s+', '(', inner)
            return inner
        txt = re.sub(r'<p[^>]*>.*?</p>', normalize_p, txt, flags=re.DOTALL)

        path.write_text(txt, encoding='utf-8')
        report.extend(edits_sorted[::-1])

    out = BASE / 'generated' / 'review_rules_v6_first10k_2026-04-17.md'
    upgrade = sum(1 for r in report if r['decision'].startswith('UPGRADE'))
    drop = sum(1 for r in report if r['decision'].startswith('DROP'))
    lines = [
        '# Rules v6 review — first 10k words (2026-04-17)',
        '',
        f'- Scope: `chapter-01-mobilita.html` (3324 words) + `chapter-01-ambiente.html` first segment (~6.7k words) = ~10k words',
        f'- Total `cfr.` processed: {len(report)}',
        f'- Upgraded to autorial bridge: {upgrade}',
        f'- Dropped (no shared keyphrase): {drop}',
        '',
        '## Decisions',
        ''
    ]
    for r in report:
        lines.append(f"### {r['file']} — {r['code']}")
        lines.append(f"**Decision:** {r['decision']}")
        lines.append('**Before:** `' + r['original'][:200].replace('\n',' ') + '`')
        lines.append('**After:** `' + (r['replacement'][:200].replace('\n',' ') or '(removed)') + '`')
        lines.append(f"**Paragraph:** {r['para_excerpt']}")
        lines.append('')
    (out).write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote report to {out}', file=sys.stderr)
    print(f'Stats: {upgrade} upgraded, {drop} dropped, {len(report)} total', file=sys.stderr)

if __name__ == '__main__':
    main()
