# -*- coding: utf-8 -*-
"""Inject note 1609 (fiumi come campo di battaglia, acqua tibetana) in ff.1.2.4 Alberi, acqua e biodiversita."""
import re, pathlib

ROOT = pathlib.Path(__file__).parent
SUB = ROOT / "book" / "chapter-01-2-4.html"
AGG = ROOT / "book" / "chapter-01-ambiente.html"
URL = "https://worksinprogress.co/issue/rivers-are-now-battlefields/"

ANCHOR = '''Il cambiamento climatico non minaccia il 2050: <mark class="note-highlight">&egrave; gi&agrave; qui con 44 giorni di anticipo</mark>.</p>
'''

FIG = '''
    <figure aria-label="Acqua in uscita dall&rsquo;altopiano tibetano e scala delle dighe cinesi" style="margin:2em auto;max-width:560px;">
      <svg viewBox="0 0 560 250" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;background:#fafafa;border:2px solid var(--accent);">
        <text x="280" y="24" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="700" fill="#222">ALTOPIANO TIBETANO &mdash; 718 MLD m&sup3; D&rsquo;ACQUA L&rsquo;ANNO</text>
        <g font-family="'IBM Plex Mono',monospace" font-size="10" fill="#222">
          <text x="30" y="58">Resta in Cina</text>
          <rect x="180" y="46" width="112" height="16" fill="#aaa"/>
          <text x="300" y="59" font-weight="700">35%</text>
          <text x="30" y="86">Esce dai confini cinesi</text>
          <rect x="180" y="74" width="208" height="16" fill="var(--accent)" opacity="0.85"/>
          <text x="396" y="87" font-weight="700">65%</text>
        </g>
        <line x1="30" y1="108" x2="530" y2="108" stroke="#ddd" stroke-width="1"/>
        <text x="30" y="130" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="700" fill="#222">SCALA DELL&rsquo;OPERA (potenza installata)</text>
        <g font-family="'IBM Plex Mono',monospace" font-size="10" fill="#222">
          <text x="30" y="160">Diga delle Tre Gole</text>
          <rect x="230" y="148" width="80" height="16" fill="#aaa"/>
          <text x="318" y="161" font-weight="700">1&times;</text>
          <text x="30" y="188">Yarlung Zangbo (Brahmaputra)</text>
          <rect x="230" y="176" width="240" height="16" fill="var(--accent)" opacity="0.85"/>
          <text x="478" y="189" font-weight="700">3&times;</text>
        </g>
        <text x="280" y="220" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" fill="#666">Un solo impianto vale circa il 25% di tutta l&rsquo;idroelettrica cinese esistente.</text>
        <text x="280" y="238" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#888">Fonte: Works in Progress, &ldquo;Rivers are now battlefields&rdquo; &mdash; vedi fonte [@@N@@].</text>
      </svg>
      <figcaption>Due terzi dell&rsquo;acqua tibetana escono dalla Cina: chi sta a monte scrive il calendario idrico di met&agrave; Asia.</figcaption>
    </figure>
'''

SUB_PARA = '''
    <!-- ===== inject 2026-07-28 &mdash; note_id:1609 &mdash; fiumi come campo di battaglia ===== -->
    <p>Se l&rsquo;aria &egrave; diventata infrastruttura da difendere, l&rsquo;acqua lo era gi&agrave; da un pezzo &mdash; solo che nessuno la contava come tale. <a id="ref-fonte-9"></a><a href="%(url)s" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">I fiumi sono il nuovo campo di battaglia</a><sup><a href="#fonte-9" style="color:var(--accent);text-decoration:none;">[9]</a></sup>: dall&rsquo;altopiano tibetano scendono ogni anno <mark class="note-highlight">718 miliardi di metri cubi d&rsquo;acqua, di cui solo il 35%% resta entro i confini cinesi</mark>. Il resto alimenta Brahmaputra, Gange, Indo, Mekong, Salween &mdash; e con essi <mark class="note-highlight">quasi due miliardi di persone che bevono, irrigano e producono elettricit&agrave; a valle di un rubinetto che non controllano</mark>. In un archivio che ha guardato l&rsquo;acqua come la cosa pi&ugrave; docile del mondo, quella che segue una legge sola, la gravit&agrave;
    (<span class="fc">&#128167; ff.112.5 Acqua da tutte le parti</span>),
    la novit&agrave; &egrave; che adesso segue anche una seconda legge: il calcestruzzo.</p>

    <p>La scala delle opere lo rende letterale. Sul Brahmaputra la Cina sta costruendo l&rsquo;impianto di Yarlung Zangbo, <mark class="note-highlight">tre volte la diga delle Tre Gole, da solo circa un quarto di tutta l&rsquo;idroelettrica cinese esistente</mark>; sul Mekong le grandi dighe gi&agrave; costruite sono undici, con almeno altre otto tra cantiere e progetto, e i piani di diversione arrivano a 200,6 miliardi di metri cubi l&rsquo;anno. &Egrave; la stessa traiettoria di potenza industriale che abbiamo visto altrove &mdash; consumo elettrico quadruplicato in vent&rsquo;anni, primato negli impianti nucleari pianificati
    (<span class="fc">&#127982; ff.125.3 Cina: il prossimo impero mondiale?</span>) &mdash;
    applicata alla risorsa che nessuna filiera pu&ograve; sostituire. La leva non &egrave; teorica: la Grand Ethiopian Renaissance Dam pu&ograve; ridurre del 39%% la portata del Nilo per diciotto mesi, la diga di Daryan devia verso l&rsquo;Iran il 60%% del fiume Sirvan che scorreva in Iraq, e nel 2025 l&rsquo;India ha sospeso il Trattato delle acque dell&rsquo;Indo.</p>
%(fig)s
    <p>Per anni abbiamo discusso di clima come se il pezzo controverso fosse deviare la pioggia con l&rsquo;ingegneria
    (<span class="fc">&#127783;&#65039; ff.56.4 Controllare la pioggia</span>),
    mentre il controllo idrico su scala continentale si costruiva in cemento armato, con procedure di appalto ordinarie e nessun dibattito etico. Chip e terre rare si possono rimpiazzare in dieci anni di politica industriale. Un bacino imbrifero no: <mark class="note-highlight">chi sta a monte detta i tempi a chi sta a valle, e non esiste un secondo fornitore</mark>. Quanto a lungo met&agrave; dell&rsquo;Asia accetter&agrave; che la propria stagione agricola dipenda dalla manutenzione programmata di una turbina in territorio altrui?</p>
'''

AGG_PARA = '''
    <!-- ===== inject 2026-07-28 &mdash; note_id:1609 &mdash; fiumi come campo di battaglia ===== -->
    <p>Se l&rsquo;aria &egrave; diventata infrastruttura da difendere, l&rsquo;acqua lo era gi&agrave; da un pezzo. <a id="ref-fonte-%(n)d"></a><a href="%(url)s" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">I fiumi sono il nuovo campo di battaglia</a><sup><a href="#fonte-%(n)d" style="color:var(--accent);text-decoration:none;">[%(n)d]</a></sup>: dall&rsquo;altopiano tibetano scendono ogni anno <mark class="note-highlight">718 miliardi di metri cubi d&rsquo;acqua, di cui solo il 35%% resta entro i confini cinesi</mark>, e il resto alimenta Brahmaputra, Gange, Indo, Mekong e Salween &mdash; <mark class="note-highlight">quasi due miliardi di persone a valle di un rubinetto che non controllano</mark>. L&rsquo;acqua che seguiva una legge sola, la gravit&agrave;
    (<span class="fc">&#128167; ff.112.5
    Acqua da tutte le parti</span>),
    adesso ne segue una seconda: il calcestruzzo. Sul Brahmaputra l&rsquo;impianto di Yarlung Zangbo vale <mark class="note-highlight">tre volte la diga delle Tre Gole</mark>, circa un quarto dell&rsquo;idroelettrica cinese esistente; sul Mekong le grandi dighe sono undici, con almeno altre otto in arrivo. La stessa traiettoria di potenza industriale gi&agrave; vista altrove
    (<span class="fc">&#127982; ff.125.3
    Cina: il prossimo impero mondiale?</span>),
    applicata alla risorsa che nessuna filiera sa sostituire: mentre discutevamo di deviare la pioggia con l&rsquo;ingegneria
    (<span class="fc">&#127783;&#65039; ff.56.4
    Controllare la pioggia</span>),
    il controllo idrico continentale si costruiva in cemento armato. Chip e terre rare si rimpiazzano in dieci anni di politica industriale; un bacino imbrifero no.</p>
'''

LI = ('<li id="fonte-%d"><a href="' + URL + '" target="_blank" rel="noopener" '
      'class="text-blue-700 hover:underline">Rivers are now battlefields &mdash; 718 mld m&sup3;/anno '
      'dall&rsquo;altopiano tibetano, solo il 35%% resta in Cina</a> &mdash; '
      '<span class="text-zinc-500">worksinprogress.co</span> '
      '<a href="#ref-fonte-%d" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>')

# ---------------- sottopagina ----------------
s = SUB.read_text(encoding='utf-8')
assert 'worksinprogress.co' not in s and 'tibetano' not in s, 'gia iniettato'
assert s.count(ANCHOR) == 1, 'anchor non univoco in sottopagina'
n_sub = max(int(m) for m in re.findall(r'id="fonte-(\d+)"', s)) + 1
assert n_sub == 9, 'numerazione fonti sottopagina inattesa: %d' % n_sub
s = s.replace(ANCHOR, ANCHOR + (SUB_PARA % {'url': URL, 'fig': FIG.replace('@@N@@', str(n_sub))}))
s = s.replace('      </ol>\n    </section>', '        ' + (LI % (n_sub, n_sub)) + '\n      </ol>\n    </section>', 1)
s = s.replace('<p class="text-sm text-zinc-500 mb-4">8 fonti.</p>',
              '<p class="text-sm text-zinc-500 mb-4">9 fonti.</p>')
s = s.replace('<div class="reading-time mt-2">2 fonti citate',
              '<div class="reading-time mt-2">9 fonti citate')
s = s.replace('"dateModified": "2026-04-21"', '"dateModified": "2026-07-28"')
s = s.replace('<meta property="article:modified_time" content="2026-04-21"/>',
              '<meta property="article:modified_time" content="2026-07-28"/>')
SUB.write_text(s, encoding='utf-8')
print('sottopagina OK, fonte', n_sub)

# ---------------- vista aggregata ----------------
a = AGG.read_text(encoding='utf-8')
assert 'worksinprogress.co' not in a and 'tibetano' not in a, 'aggregata gia iniettata'
assert a.count(ANCHOR) == 1, 'anchor non univoco in aggregata'
n_agg = max(int(m) for m in re.findall(r'id="fonte-(\d+)"', a)) + 1
a = a.replace(ANCHOR, ANCHOR + (AGG_PARA % {'url': URL, 'n': n_agg}))
a = a.replace('      </ol>\n    </section>', (LI % (n_agg, n_agg)) + '\n      </ol>\n    </section>', 1)
a = a.replace('<p class="text-sm text-zinc-500 mb-4">88 fonti in questa sezione.</p>',
              '<p class="text-sm text-zinc-500 mb-4">89 fonti in questa sezione.</p>')
AGG.write_text(a, encoding='utf-8')
print('aggregata OK, fonte', n_agg)
