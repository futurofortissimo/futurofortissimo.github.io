# -*- coding: utf-8 -*-
"""Inject note 1640 (letto inclinato 6 gradi -> +4,1% volume ematico) in ff.3.2.4 Respiro e sonno.

Fonte primaria verificata: Mazza OB, Gejl KD, Larsen S, Lundby C,
"Did You Know: Erythropoiesis Is Regulated by Changes in Posture",
Acta Physiologica 2026;242(6):e70248 - PMID 42130381 - doi 10.1111/apha.70248.
"""
import re, pathlib

ROOT = pathlib.Path(__file__).parent
SUB = ROOT / "book" / "chapter-03-2-4.html"
AGG = ROOT / "book" / "chapter-03-alimentazione.html"

DOI = "https://doi.org/10.1111/apha.70248"

NEW_PARA = '''
    <p>Dentro la stessa economia del sonno c&rsquo;&egrave; per&ograve; una leva che al CES non si vende. Un gruppo danese ha fatto <a id="ref-fonte-6"></a><a href="%s" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">dormire i partecipanti per cinque settimane con il letto inclinato di sei gradi, testa in su</a><sup><a href="#fonte-6" style="color:var(--accent);text-decoration:none;">[6]</a></sup> &mdash; un cuneo sotto due gambe, zero elettronica &mdash; e ha misurato <mark class="note-highlight">104 ml di volume eritrocitario in pi&ugrave;, 36 grammi di massa emoglobinica totale, il 4,1&#37; di volume ematico complessivo</mark>. &Egrave; l&rsquo;ordine di grandezza che un fondista va a cercare in un ciclo di allenamento in quota, pagando altitudine, tempo e settimane lontano da casa. Il meccanismo che gli autori chiamano in causa &egrave; posturale: l&rsquo;inclinazione abbassa la pressione venosa centrale, il corpo legge quel segnale e alza l&rsquo;eritropoietina &mdash; pi&ugrave; globuli rossi, cio&egrave; pi&ugrave; ossigeno trasportato a ogni battito, la variabile che l&rsquo;industria dei sensori insegue da anni con maschere, canottiere e stime di VO&#8322;max
    (<span class="fc">&#128207; ff.86.2 Misurare l&rsquo;ossigeno bruciato</span>).
    <mark class="note-highlight">Sei gradi di cuneo producono una risposta emopoietica confrontabile con l&rsquo;ipossia d&rsquo;alta quota</mark>, e la cosa finisce in fondo alla stessa lista di gesti a costo zero &mdash; luce del mattino, caffeina ritardata, finestra alimentare corta &mdash; che ci raccontiamo da anni senza applicarli
    (<span class="fc">&#128164; ff.35.4 Super-dormita e super-focus</span>).
    Resta la domanda scomoda: quanta fisiologia lasciamo sul tavolo ogni notte, e a che punto l&rsquo;ennesima leva ottimizzabile smette di aiutarci e comincia soltanto a farci sentire in difetto
    (<span class="fc">&#128207; ff.68.2 Sempre pi&ugrave; misurati e controllati</span>)?</p>

    <figure aria-label="Adattamento ematico dopo cinque settimane di sonno inclinato" style="margin:2em auto;max-width:560px;">
      <svg viewBox="0 0 560 230" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%%;height:auto;background:#fafafa;border:2px solid var(--accent);">
        <text x="280" y="24" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="700" fill="#222">5 SETTIMANE DI SONNO A 6&deg; TESTA IN SU</text>
        <g font-family="'IBM Plex Mono',monospace" font-size="10" fill="#222">
          <text x="30" y="70">Volume eritrocitario</text>
          <rect x="230" y="58" width="170" height="16" fill="var(--accent)" opacity="0.85"/>
          <text x="410" y="71" font-weight="700">+104 ml</text>
          <text x="30" y="110">Massa emoglobinica</text>
          <rect x="230" y="98" width="140" height="16" fill="var(--accent)" opacity="0.65"/>
          <text x="380" y="111" font-weight="700">+36 g</text>
          <text x="30" y="150">Volume ematico totale</text>
          <rect x="230" y="138" width="110" height="16" fill="var(--accent)" opacity="0.45"/>
          <text x="350" y="151" font-weight="700">+4,1&#37;</text>
        </g>
        <line x1="230" y1="170" x2="530" y2="170" stroke="#ddd" stroke-width="1"/>
        <text x="280" y="192" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" fill="#666">Un cuneo sotto due gambe del letto, per cinque settimane.</text>
        <text x="280" y="212" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">Fonte: Mazza, Gejl, Larsen, Lundby &mdash; Acta Physiologica 2026, e70248.</text>
      </svg>
      <figcaption>L&rsquo;adattamento che si va a cercare in quota, ottenuto dormendo in salita di sei gradi.</figcaption>
    </figure>
''' % DOI

NEW_LI = '''<li id="fonte-6"><a href="%s" target="_blank" rel="noopener" class="text-blue-700 hover:underline">Mazza, Gejl, Larsen, Lundby &mdash; &ldquo;Erythropoiesis Is Regulated by Changes in Posture&rdquo;, Acta Physiologica 2026;242(6):e70248</a> &mdash; <span class="text-zinc-500">doi.org</span> <a href="#ref-fonte-6" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>
''' % DOI


def renumber(text, lo, hi, delta):
    """Shift fonte-N and [N] markers for lo<=N<=hi by delta (descending to avoid collisions)."""
    for n in range(hi, lo - 1, -1):
        text = re.sub(r'\bfonte-%d\b' % n, 'fonte-%d' % (n + delta), text)
        text = text.replace('>[%d]</a>' % n, '>[%d]</a>' % (n + delta))
    return text


# ---------- sottopagina ----------
s = SUB.read_text(encoding='utf-8')
assert 'ff.86.2' not in s and '4,1' not in s and 'apha.70248' not in s, 'gia iniettato'

s = renumber(s, 6, 10, 1)

anchor = '''    (<span class="fc">&#128564; ff.47.1 Russa? No problem!</span>).</p>
'''
assert s.count(anchor) == 1, 'anchor paragrafo ff.47.1 non trovato'
s = s.replace(anchor, anchor + NEW_PARA)

bib_anchor = '        <li id="fonte-7">'
assert s.count(bib_anchor) == 1, 'ancora bibliografia non trovata'
s = s.replace(bib_anchor, '        ' + NEW_LI.strip() + '\n' + bib_anchor)

assert s.count('<p class="text-sm text-zinc-500 mb-4">10 fonti.</p>') == 1
s = s.replace('<p class="text-sm text-zinc-500 mb-4">10 fonti.</p>',
              '<p class="text-sm text-zinc-500 mb-4">11 fonti.</p>')
assert s.count('<div class="reading-time mt-2">10 fonti citate') == 1
s = s.replace('<div class="reading-time mt-2">10 fonti citate',
              '<div class="reading-time mt-2">11 fonti citate')
s = s.replace('"dateModified": "2026-04-21"', '"dateModified": "2026-07-29"')
s = s.replace('<meta property="article:modified_time" content="2026-04-21"/>',
              '<meta property="article:modified_time" content="2026-07-29"/>')
SUB.write_text(s, encoding='utf-8')
print('sottopagina OK -> 11 fonti')

# ---------- vista aggregata ----------
a = AGG.read_text(encoding='utf-8')
assert '4,1' not in a and 'apha.70248' not in a, 'aggregata gia iniettata'
n_sources = max(int(m) for m in re.findall(r'id="fonte-(\d+)"', a))
new_n = n_sources + 1
AGG_PARA = ('''
    <p>Dentro la stessa economia del sonno c&rsquo;&egrave; per&ograve; una leva che al CES non si vende. Un gruppo danese ha fatto <a id="ref-fonte-%d"></a><a href="%s" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">dormire i partecipanti per cinque settimane con il letto inclinato di sei gradi, testa in su</a><sup><a href="#fonte-%d" style="color:var(--accent);text-decoration:none;">[%d]</a></sup>, misurando <mark class="note-highlight">104 ml di volume eritrocitario in pi&ugrave;, 36 grammi di massa emoglobinica, il 4,1&#37; di volume ematico complessivo</mark>: l&rsquo;ordine di grandezza di un ciclo di allenamento in quota, senza altitudine e senza settimane lontano da casa. L&rsquo;inclinazione abbassa la pressione venosa centrale e alza l&rsquo;eritropoietina &mdash; pi&ugrave; globuli rossi, cio&egrave; pi&ugrave; ossigeno a ogni battito, la variabile che l&rsquo;industria dei sensori insegue con maschere e stime di VO&#8322;max
    (<span class="fc">&#128207; ff.86.2
    Misurare l&rsquo;ossigeno bruciato</span>).
    <mark class="note-highlight">Sei gradi di cuneo bastano a innescare una risposta emopoietica confrontabile con l&rsquo;ipossia d&rsquo;alta quota</mark>, in fondo alla stessa lista di gesti a costo zero che ci raccontiamo da anni senza applicarli
    (<span class="fc">&#128164; ff.35.4
    Super-dormita e super-focus</span>)
    (<span class="fc">&#128207; ff.68.2
    Sempre pi&ugrave; misurati e controllati</span>).</p>
''' % (new_n, DOI, new_n, new_n))

agg_anchor = '''    (<span class="fc">&#128336; ff.22.1
    Dieta circadiana?</span>).</p>
'''
assert a.count(agg_anchor) == 1, 'anchor aggregata non trovato'
a = a.replace(agg_anchor, agg_anchor + AGG_PARA)

AGG_LI = ('<li id="fonte-%d"><a href="%s" target="_blank" rel="noopener" class="text-blue-700 hover:underline">Mazza, Gejl, Larsen, Lundby &mdash; &ldquo;Erythropoiesis Is Regulated by Changes in Posture&rdquo;, Acta Physiologica 2026;242(6):e70248</a> &mdash; <span class="text-zinc-500">doi.org</span> <a href="#ref-fonte-%d" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>\n' % (new_n, DOI, new_n))
last_li = re.search(r'<li id="fonte-%d">.*?</li>\n' % n_sources, a, re.S)
assert last_li, 'ultima voce bibliografia non trovata'
a = a[:last_li.end()] + AGG_LI + a[last_li.end():]
AGG.write_text(a, encoding='utf-8')
print('aggregata OK -> fonte-%d' % new_n)
