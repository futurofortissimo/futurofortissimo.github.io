#!/usr/bin/env python3
"""Rectify links to strict corpus fidelity: replace invented URLs with backup-valid URLs,
or strip the <a> tag altogether if no corpus-valid external link exists."""
import re, json
from pathlib import Path

# Per code: (bad_url, replacement_url, new_label) or (bad_url, None, new_plain_text_label)
# None replacement = strip the <a>...</a> wrapper, keep the text as plain span
RECTIFY = {
    'ff.10.5': ('https://fortissimo.substack.com/p/-ff3-metaverso', None, "le intuizioni già maturate nel capitolo metaverso"),
    'ff.12.5': ('https://www.smithsonianmag.com/', None, "un volantino d’arte popolare"),
    'ff.15.6': ('https://www.lhcstudio.com/', 'https://lucyhardcastle.com/', "Lucy Hardcastle"),
    'ff.3.7': ('https://www.larryslist.com/', None, "il collezionismo d’élite degli NFT"),
    'ff.30.2': ('https://openai.com/index/dall-e-2/', None, "la prima galleria comparativa di DALL-E"),
    'ff.41.1': ('https://www.academiabarilla.it/', None, "la tradizione regionale documentata"),
    'ff.41.2': ('https://it.wikipedia.org/wiki/L%27infinito', None, "<em>L’Infinito</em> di Leopardi"),
    'ff.41.3': ('https://docs.python.org/3/library/random.html', None, "una libreria di mescolamento standard"),
    'ff.41.4': ('https://www.giallozafferano.it/', None, "un normale portale di ricette"),
    'ff.41.6': ('https://it.wikipedia.org/wiki/Caduta_dei_gravi', None, "il classico problema della caduta dei gravi"),
    'ff.54.3': ('https://www.skysport.it/calcio', None, "affascinante partita"),
    'ff.54.5': ('https://www.bing.com/images/create', None, "BING immagini [che usa un’evoluzione di DALL-E]"),
    'ff.63.4': ('https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4', 'https://aihits.co/', "AI Hits"),
    'ff.67.3': ('https://lexfridman.com/george-hotz-3/', 'https://www.cnet.com/culture/blackra1n-jailbreaks-iphone-os-3-1-2/', "i jailbreak di iOS di geohot"),
    'ff.79.1': ('https://www.crocs.com/p/shrek-classic-clog/E50001-5Q6.html', 'https://amzn.to/3Ggd13d', "Crocs X Shrek"),
    'ff.8.4': ('https://www.statista.com/topics/990/mobile-advertising/', None, "il sorpasso mobile-TV"),
}

book_dir = Path('book')
fixed = []
for code, (bad, good, label) in RECTIFY.items():
    # Find all chapter files containing this code injection
    for p in book_dir.glob('chapter-*.html'):
        txt = p.read_text(encoding='utf-8')
        if code not in txt:
            continue
        if bad not in txt:
            continue
        # Pattern: <a href="bad" ...>LABEL</a>
        # We'll replace the whole <a>...</a> enclosing `bad`
        pat = re.compile(r'<a\s+href="' + re.escape(bad) + r'"[^>]*>([^<]+)</a>')
        if good is not None:
            # Replace href + label text
            def repl(m):
                return f'<a href="{good}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">{label}</a>'
            new_txt, n = pat.subn(repl, txt)
        else:
            # Strip <a>: replace with plain label text (unwrap)
            def repl(m):
                return label
            new_txt, n = pat.subn(repl, txt)
        if n > 0:
            p.write_text(new_txt, encoding='utf-8')
            fixed.append((code, str(p), good or 'UNWRAPPED', n))

for f in fixed:
    print(f)
print(f'\nTotal rectifications: {len(fixed)}')
