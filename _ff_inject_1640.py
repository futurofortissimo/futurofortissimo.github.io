# -*- coding: utf-8 -*-
"""Inject note 1640 (letto inclinato 6 gradi -> +4,1% volume ematico) in ff.3.2.4 Respiro e sonno."""
import re, io, sys, pathlib

ROOT = pathlib.Path(__file__).parent
SUB = ROOT / "book" / "chapter-03-2-4.html"
AGG = ROOT / "book" / "chapter-03-alimentazione.html"

NEW_PARA = '''
    <p>Dentro la stessa economia del sonno c&rsquo;&egrave; per&ograve; una leva che al CES non si compra. <a id="ref-fonte-6"></a><a href="https://x.com/i/status/2060833281398997128" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">Dormire con il letto inclinato di sei gradi, testa in su</a><sup><a href="#fonte-6" style="color:var(--accent);text-decoration:none;">[6]</a></sup> &mdash; un cuneo sotto due gambe, zero elettronica &mdash; per cinque settimane <mark class="note-highlight">alza il volume ematico del 4,1%</mark>: la stessa risposta emopoietica che un atleta va a cercare in un ciclo di allenamento in altitudine, pagando quota, tempo e settimane lontano da casa. Il corpo legge l&rsquo;inclinazione come uno stimolo continuo e produce pi&ugrave; globuli rossi, cio&egrave; pi&ugrave; ossigeno trasportato a ogni battito &mdash; la variabile che l&rsquo;industria dei sensori insegue da anni con maschere, canottiere e stime di VO&#8322;max
    (<span class="fc">&#128207; ff.86.2 Misurare l&rsquo;ossigeno bruciato</span>).
    Se bastano sei gradi per innescare una risposta simile a quella dell&rsquo;ipossia d&rsquo;alta quota, <mark class="note-highlight">l&rsquo;ottimizzazione del sonno diventa un vettore di performance, non solo di recupero</mark>: sta in fondo alla stessa lista di gesti a costo zero &mdash; luce del mattino, caffeina ritardata, allenamento entro tre ore dalla sveglia &mdash; che ci raccontiamo da anni
    (<span class="fc">&#128164; ff.35.4 Super-dormita e super-focus</span>).
    Resta la domanda scomoda: quanta fisiologia lasciamo sul tavolo ogni notte, e a che punto l&rsquo;ennesima leva ottimizzabile smette di aiutarci e comincia solo a farci sentire in difetto
    (<span class="fc">&#128207; ff.68.2 Sempre pi&ugrave; misurati e controllati</span>)?</p>

    <figure aria-label="Volume ematico dopo cinque settimane di sonno inclinato" style="margin:2em auto;max-width:560px;">
      <svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;background:#fafafa;border:2px solid var(--accent);">
        <text x="280" y="22" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="700" fill="#222">VOLUME EMATICO &mdash; 5 settimane di sonno</text>
        <g font-family="'IBM Plex Mono',monospace" font-size="10" fill="#222">
          <text x="40" y="70">Letto orizzontale</text>
          <rect x="230" y="58" width="6" height="18" fill="#aaa"/>
          <text x="248" y="72" font-weight="700">invariato</text>
          <text x="40" y="115">Letto inclinato 6&deg; (testa in su)</text>
          <rect x="230" y="103" width="164" height="18" fill="var(--accent)" opacity="0.85"/>
          <text x="404" y="117" font-weight="700">+4,1%</text>
        </g>
        <text x="280" y="168" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" fill="#666">Sei gradi di inclinazione &asymp; un ciclo di allenamento in altitudine.</text>
        <text x="280" y="190" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">Fonte: nota ff. 2026 &mdash; risposta emopoietica al sonno head-up.</text>
      </svg>
      <figcaption>Un cuneo sotto due gambe del letto produce, in cinque settimane, l&rsquo;adattamento che si va a cercare in quota.</figcaption>
    </figure>
'''

NEW_LI = '''<li id="fonte-6"><a href="https://x.com/i/status/2060833281398997128" target="_blank" rel="noopener" class="text-blue-700 hover:underline">Sonno con letto inclinato 6&deg; testa in su &mdash; +4,1% di volume ematico in 5 settimane</a> &mdash; <span class="text-zinc-500">x.com</span> <a href="#ref-fonte-6" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>
'''


def renumber(text, lo, hi, delta):
    """Shift fonte-N and [N] markers for lo<=N<=hi by delta (descending to avoid collisions)."""
    for n in range(hi, lo - 1, -1):
        text = re.sub(r'\bfonte-%d\b' % n, 'fonte-%d' % (n + delta), text)
        text = text.replace('>[%d]</a>' % n, '>[%d]</a>' % (n + delta))
    return text


# ---------- sottopagina ----------
s = SUB.read_text(encoding='utf-8')
assert 'ff.86.2' not in s and '4,1%' not in s, 'gia iniettato'

s = renumber(s, 6, 10, 1)

anchor = '''    (<span class="fc">&#128564; ff.47.1 Russa? No problem!</span>).</p>
'''
assert s.count(anchor) == 1, 'anchor paragrafo ff.47.1 non trovato'
s = s.replace(anchor, anchor + NEW_PARA)

# bibliografia: inserisci nuova voce prima di fonte-7 (ex fonte-6)
bib_anchor = '        <li id="fonte-7">'
assert s.count(bib_anchor) == 1
s = s.replace(bib_anchor, '        ' + NEW_LI.strip() + '\n' + bib_anchor)

s = s.replace('<p class="text-sm text-zinc-500 mb-4">10 fonti.</p>',
              '<p class="text-sm text-zinc-500 mb-4">11 fonti.</p>')
s = s.replace('<div class="reading-time mt-2">10 fonti citate',
              '<div class="reading-time mt-2">11 fonti citate')
s = s.replace('"dateModified": "2026-04-21"', '"dateModified": "2026-07-28"')
s = s.replace('<meta property="article:modified_time" content="2026-04-21"/>',
              '<meta property="article:modified_time" content="2026-07-28"/>')
SUB.write_text(s, encoding='utf-8')
print('sottopagina OK')

# ---------- vista aggregata ----------
a = AGG.read_text(encoding='utf-8')
assert '4,1%' not in a, 'aggregata gia iniettata'
n_sources = max(int(m) for m in re.findall(r'id="fonte-(\d+)"', a))
new_n = n_sources + 1
AGG_PARA = ('''
    <p>Dentro la stessa economia del sonno c&rsquo;&egrave; per&ograve; una leva che al CES non si compra. <a id="ref-fonte-%d"></a><a href="https://x.com/i/status/2060833281398997128" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">Dormire con il letto inclinato di sei gradi, testa in su</a><sup><a href="#fonte-%d" style="color:var(--accent);text-decoration:none;">[%d]</a></sup>, per cinque settimane <mark class="note-highlight">alza il volume ematico del 4,1%%</mark>: la stessa risposta emopoietica di un ciclo di allenamento in altitudine, senza quota e senza settimane lontano da casa. Pi&ugrave; globuli rossi significa pi&ugrave; ossigeno trasportato a ogni battito, la variabile che l&rsquo;industria dei sensori insegue con maschere e stime di VO&#8322;max
    (<span class="fc">&#128207; ff.86.2
    Misurare l&rsquo;ossigeno bruciato</span>).
    <mark class="note-highlight">L&rsquo;ottimizzazione del sonno diventa un vettore di performance, non solo di recupero</mark>, in fondo alla stessa lista di gesti a costo zero che ci raccontiamo da anni
    (<span class="fc">&#128164; ff.35.4
    Super-dormita e super-focus</span>)
    (<span class="fc">&#128207; ff.68.2
    Sempre pi&ugrave; misurati e controllati</span>).</p>
''' % (new_n, new_n, new_n))

agg_anchor = '''    (<span class="fc">&#128336; ff.22.1
    Dieta circadiana?</span>).</p>
'''
assert a.count(agg_anchor) == 1, 'anchor aggregata non trovato'
a = a.replace(agg_anchor, agg_anchor + AGG_PARA)

AGG_LI = ('<li id="fonte-%d"><a href="https://x.com/i/status/2060833281398997128" target="_blank" rel="noopener" class="text-blue-700 hover:underline">Sonno con letto inclinato 6&deg; testa in su &mdash; +4,1%% di volume ematico in 5 settimane</a> &mdash; <span class="text-zinc-500">x.com</span> <a href="#ref-fonte-%d" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>\n' % (new_n, new_n))
last_li = re.search(r'<li id="fonte-%d">.*?</li>\n' % n_sources, a, re.S)
assert last_li, 'ultima voce bibliografia non trovata'
a = a[:last_li.end()] + AGG_LI + a[last_li.end():]
AGG.write_text(a, encoding='utf-8')
print('aggregata OK -> fonte-%d' % new_n)
