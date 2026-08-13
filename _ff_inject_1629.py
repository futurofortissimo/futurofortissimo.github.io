# -*- coding: utf-8 -*-
import io

ACC = 'style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;"'


def link(fid, url, text):
    return ('<a id="ref-fonte-%d"></a><a href="%s" target="_blank" rel="noopener" %s>%s</a>'
            '<sup><a href="#fonte-%d" style="color:var(--accent);text-decoration:none;">[%d]</a></sup>'
            % (fid, url, ACC, text, fid, fid))


def bib(fid, url, text, dom):
    return ('<li id="fonte-%d"><a href="%s" target="_blank" rel="noopener" class="text-blue-700 hover:underline">%s</a> '
            '&mdash; <span class="text-zinc-500">%s</span> '
            '<a href="#ref-fonte-%d" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>'
            % (fid, url, text, dom, fid))


ASCO_URL = "https://www.asco.org/abstracts-presentations/259325"
JCO_URL = "https://ascopubs.org/doi/10.1200/JCO.24.00581"

FIG = '''    <figure aria-label="Sopravvivenza libera da progressione a 5 anni: lorlatinib vs crizotinib (studio CROWN)" style="margin:2em auto;max-width:520px;">
      <svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;background:#fafafa;border:2px solid var(--accent);">
        <text x="260" y="22" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="700" fill="#222">LIBERI DA PROGRESSIONE A 5 ANNI &#8212; STUDIO CROWN</text>
        <line x1="70" y1="45" x2="70" y2="165" stroke="#666" stroke-width="1"/>
        <line x1="70" y1="165" x2="490" y2="165" stroke="#666" stroke-width="1"/>
        <line x1="70" y1="50" x2="490" y2="50" stroke="#ddd" stroke-dasharray="2 3"/>
        <text x="64" y="53" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">100%</text>
        <line x1="70" y1="107" x2="490" y2="107" stroke="#ddd" stroke-dasharray="2 3"/>
        <text x="64" y="110" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">50%</text>
        <text x="64" y="168" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">0</text>
        <rect x="130" y="96" width="90" height="69" fill="var(--accent)"/>
        <text x="175" y="90" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="13" font-weight="700" fill="#222">60%</text>
        <text x="175" y="181" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" fill="#444">lorlatinib</text>
        <rect x="330" y="156" width="90" height="9" fill="#999"/>
        <text x="375" y="150" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="13" font-weight="700" fill="#222">8%</text>
        <text x="375" y="181" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" fill="#444">crizotinib</text>
        <text x="260" y="201" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8.5" fill="#888">prima linea, NSCLC avanzato ALK-positivo &#8212; dati a 5 anni, JCO 2024</text>
      </svg>
      <figcaption style="font-family:'IBM Plex Mono',monospace;font-size:0.72rem;color:#666;text-align:center;margin-top:0.5em;">Il 60% dei pazienti trattati in prima linea con lorlatinib &egrave; ancora libero da progressione a cinque anni, contro l&rsquo;8% del confronto.</figcaption>
    </figure>'''


def block(f_asco, f_jco):
    p1 = ('    <p>Sul versante dei farmaci a bersaglio, %s, il sottotipo comune tra i non fumatori. '
          'I numeri dello studio CROWN danno la misura: a cinque anni %s, contro l&rsquo;8%% di chi ha ricevuto crizotinib, '
          'con mediana di sopravvivenza libera da progressione non ancora raggiunta nel braccio lorlatinib e ferma a 9,1 mesi nel confronto. '
          '&Egrave; il PFS pi&ugrave; lungo mai riportato per un singolo farmaco a bersaglio in un tumore solido metastatico.</p>'
          % (link(f_asco, ASCO_URL,
                  "lorlatinib mostra una curva di sopravvivenza raramente vista nel tumore polmonare metastatico ALK-positivo"),
             link(f_jco, JCO_URL,
                  "il 60% dei pazienti in prima linea &egrave; ancora libero da progressione")))
    p2 = ('    <p>Una curva che si appiattisce cos&igrave; in alto cambia il peso clinico della parola &ldquo;metastatico&rdquo; per quel sottotipo genetico, '
          'e sposta la medicina di precisione dal registro della sopravvivenza a quello della cronicit&agrave; gestita '
          '(<span class="fc">&#129310; ff.53.1 Meno morti per il cancro</span>). Il prezzo del salto &egrave; la selezione: il beneficio vale per chi porta quella specifica alterazione, '
          'quindi la sequenza diagnosi&ndash;profilazione molecolare&ndash;terapia diventa il vero collo di bottiglia clinico. '
          'Alla farmacologia si affianca la fisiologia: <span class="fc">&#9876;&#65039; ff.120.5 Tumore vs battiti cardiaci?</span> ricorda che i battiti elevati dello sport '
          'possono spaccare alcune cellule tumorali metastatiche e che l&rsquo;esercizio normalizza l&rsquo;irrorazione dei tumori, migliorando le terapie in atto. '
          'Molecola e battito lavorano sullo stesso bersaglio da due porte diverse.</p>')
    return p1 + "\n" + FIG + "\n" + p2


# ---------- 1. SUBPAGE ----------
p = 'book/chapter-03-2-3.html'
s = io.open(p, encoding='utf-8').read()
old = [l for l in s.split("\n") if l.startswith('    <p>Sul versante dei farmaci a bersaglio,')]
assert len(old) == 1, len(old)
s = s.replace(old[0], block(18, 19))
s = s.replace('<p class="text-sm text-zinc-500 mb-4">18 fonti.</p>',
              '<p class="text-sm text-zinc-500 mb-4">19 fonti.</p>')
f18 = [l for l in s.split("\n") if l.startswith('<li id="fonte-18"')]
assert len(f18) == 1
s = s.replace(f18[0], f18[0] + "\n" + bib(
    19, JCO_URL, "CROWN a 5 anni: 60% vs 8% liberi da progressione, mediana PFS non raggiunta", "ascopubs.org"))
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print("subpage OK")

# ---------- 2. AGGREGATED ----------
p = 'book/chapter-03-alimentazione.html'
s = io.open(p, encoding='utf-8').read()
marker = '    <h3 id="s2-4"'
assert s.count(marker) == 1
mirror = ('    <!-- ===== inject 2026-07-27 (mirror) &mdash; note_id:1629 &mdash; ff.53.1 lorlatinib ===== -->\n'
          + block(40, 41) + "\n\n")
s = s.replace(marker, mirror + marker)
s = s.replace('<p class="text-sm text-zinc-500 mb-4">39 fonti in questa sezione.</p>',
              '<p class="text-sm text-zinc-500 mb-4">41 fonti in questa sezione.</p>')
f39 = [l for l in s.split("\n") if l.startswith('<li id="fonte-39"')]
assert len(f39) == 1
s = s.replace(f39[0], f39[0] + "\n"
              + bib(40, ASCO_URL, "Lorlatinib, curva di sopravvivenza raramente vista nel NSCLC metastatico ALK-positivo", "asco.org") + "\n"
              + bib(41, JCO_URL, "CROWN a 5 anni: 60% vs 8% liberi da progressione, mediana PFS non raggiunta", "ascopubs.org"))
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print("aggregated OK")

# ---------- 3. INDEX ----------
p = 'book/index.html'
s = io.open(p, encoding='utf-8').read()
BADGE = (' <span style="background:#f5a623;color:#0a0a0a;font-size:0.7em;padding:1px 5px;'
         'border-radius:3px;margin-left:4px;font-weight:700;">NEW</span>')
for slug in ['chapter-01-3-3.html', 'chapter-02-3-3.html', 'chapter-03-1-4.html']:
    lines = [l for l in s.split("\n") if slug in l and 'NEW' in l]
    assert len(lines) == 1, (slug, len(lines))
    fixed = (lines[0].replace(BADGE, '')
             .replace('style="color:#222;font-weight:600;text-decoration:none;"',
                      'style="color:#555;text-decoration:none;"'))
    s = s.replace(lines[0], fixed)
    print("stale badge removed:", slug)
old323 = ('<li><a href="/book/chapter-03-2-3.html" style="color:#555;text-decoration:none;">'
          '3.2.3 — Chimica del corpo</a></li>')
assert s.count(old323) == 1
new323 = ('<li><a href="/book/chapter-03-2-3.html" style="color:#222;font-weight:600;text-decoration:none;">'
          '3.2.3 — Chimica del corpo' + BADGE + '</a></li>')
s = s.replace(old323, new323)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print("index OK")
