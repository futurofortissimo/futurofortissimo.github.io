"""Review cfr. <span class="fc">ff.X.Y...</span> cross-refs against data.js content.

For each cfr occurrence in target files, extract:
 - cited ff.X.Y + title + content (from data.js)
 - hosting paragraph (<p>...</p>)
 - candidate keyphrases (content tokens) and whether any match in the paragraph

Outputs JSON for manual review.
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

def load_ffxy_contents():
    ds = (BASE / 'data.js').read_text(encoding='utf-8')
    # Very permissive: find subchapter blocks with "title" and "content"
    # Use robust regex for quoted JSON-like strings within export arrays
    contents = {}
    # Match: "title": "..." ... "content": "..." within a subchapter
    # To avoid issues with escaped quotes, iterate by code ff.X.Y in title
    pattern = re.compile(r'"title":\s*"([^"]*?ff\.(\d+\.\d+)[^"]*)"[^{]*?"link":[^{]*?"content":\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)
    for m in pattern.finditer(ds):
        title = m.group(1)
        code = 'ff.' + m.group(2)
        content = m.group(3)
        # unescape basic
        content = content.replace('\\n', '\n').replace('\\"', '"')
        contents[code] = {'title': title, 'content': content}
    return contents

def extract_paragraph(txt, pos):
    """Given position of <span class="fc">, find enclosing <p>...</p>."""
    # find last <p before pos
    p_start = txt.rfind('<p', 0, pos)
    if p_start < 0:
        return None, None, None
    # find matching </p>
    p_end = txt.find('</p>', pos)
    if p_end < 0:
        return None, None, None
    return p_start, p_end + 4, txt[p_start:p_end + 4]

def strip_html(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = re.sub(r'&[a-z#0-9]+;', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def keyphrases_from_content(content):
    # Split on sentences, then extract capitalized tokens + domain-word candidates
    text = content.lower()
    # Extract n-grams with distinctive content: numbers, proper nouns, named entities
    # Get all words of length >= 5
    words = re.findall(r'[a-zàèéìòù]{5,}', text)
    # strip stop-ish frequent words
    stop = set('questo questa quello quella quelle sono stata stati statto stato anche dopo davanti dentro molte molti tutti tutte quale fatto cosa perché perche ancora ormai grazie forse anche quando mentre sempre ogni senza tutto tutta nulla niente mostra mostrato secondo prima allora abbiamo avevamo dobbiamo possono posso potrebbe potrebbero avrebbe avrebbero presente recente presentato presenta molti molte molto mostra mostrato anno anni mesi giorni giorno'.split())
    words = [w for w in words if w not in stop]
    # Also extract multi-word phrases: "XX YY" where at least one has digit or is 6+ chars
    # Just return frequent tokens
    from collections import Counter
    c = Counter(words)
    return [w for w, _ in c.most_common(40)]

def main():
    contents = load_ffxy_contents()
    print(f'Loaded {len(contents)} ff.X.Y content entries', file=sys.stderr)

    files = ['book/chapter-01-mobilita.html', 'book/chapter-01-ambiente.html']

    results = []
    for fp in files:
        txt = (BASE / fp).read_text(encoding='utf-8')

        # Apply a cutoff for ambiente at "Eppure, dentro questo labirinto"
        if 'ambiente' in fp:
            m = re.search(r'Eppure, dentro questo labirinto', txt)
            if m:
                # last <p before m.start()
                cutoff = txt.rfind('<p', 0, m.start())
                scan_txt = txt[:cutoff]
            else:
                scan_txt = txt
        else:
            scan_txt = txt

        # Find cfr. patterns
        pat = re.compile(r'cfr\.\s*<span class="fc">[^<]*?(ff\.\d+\.\d+)[^<]*?</span>')
        for m in pat.finditer(scan_txt):
            code = m.group(1)
            p_s, p_e, para = extract_paragraph(scan_txt, m.start())
            if para is None:
                continue
            para_text = strip_html(para)
            data = contents.get(code, {})
            c = data.get('content', '')
            kps = keyphrases_from_content(c) if c else []
            # Test which kps appear in paragraph
            para_lower = para_text.lower()
            matches = [k for k in kps if k in para_lower]
            results.append({
                'file': fp,
                'code': code,
                'title': data.get('title', '(not found)'),
                'para_excerpt': para_text[:400],
                'content_excerpt': (c[:500] if c else ''),
                'top_keyphrases': kps[:15],
                'matches_in_para': matches[:10],
            })

    # Print summary
    print(f'Found {len(results)} cfr. cross-refs in scope', file=sys.stderr)
    out = json.dumps(results, ensure_ascii=False, indent=2)
    sys.stdout.buffer.write(out.encode('utf-8'))

if __name__ == '__main__':
    main()
