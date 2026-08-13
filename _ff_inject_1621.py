# -*- coding: utf-8 -*-
"""Inject note_id 1621 (Epoch AI - training decentralizzato 20x/anno) into ff.2.1.1."""
import io, re, sys

SUB = "book/chapter-02-1-1.html"
AGG = "book/chapter-02-robotica.html"
URL = "https://epoch.ai/gradient-updates/how-far-can-decentralized-training-over-the-internet-scale"
SRC_TITLE = "Le pi&ugrave; grandi run decentralizzate stanno nell'intervallo 6e22-6e23 FLOP, mille volte meno dei modelli di frontiera"

FIGURE = """    <figure aria-label="Compute di training: frontiera vs run decentralizzate (scala logaritmica)" style="margin:2em auto;max-width:520px;">
      <svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;background:#fafafa;border:2px solid var(--accent);">
        <text x="260" y="20" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="700" fill="#222">Compute di training &mdash; scala log (FLOP)</text>
        <!-- axes -->
        <line x1="58" y1="215" x2="495" y2="215" stroke="#222" stroke-width="1.5"/>
        <line x1="58" y1="34" x2="58" y2="215" stroke="#222" stroke-width="1.5"/>
        <g font-family="'IBM Plex Mono',monospace" font-size="9" fill="#666">
          <text x="52" y="212" text-anchor="end">1e20</text>
          <text x="52" y="167" text-anchor="end">1e22</text>
          <text x="52" y="122" text-anchor="end">1e24</text>
          <text x="52" y="77" text-anchor="end">1e26</text>
          <text x="80" y="230">2020</text>
          <text x="255" y="230">2023</text>
          <text x="430" y="230">2025</text>
        </g>
        <!-- frontier line: 5x/year -->
        <polyline points="80,138 197,117 314,96 430,75" fill="none" stroke="var(--accent)" stroke-width="3"/>
        <circle cx="430" cy="75" r="4" fill="var(--accent)"/>
        <text x="424" y="66" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="700" fill="var(--accent)">frontiera &mdash; 5x/anno</text>
        <!-- decentralized line: 20x/year -->
        <polyline points="80,209 197,180 314,151 430,155" fill="none" stroke="#d0021b" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="430" cy="155" r="4" fill="#d0021b"/>
        <text x="424" y="176" text-anchor="end" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="700" fill="#d0021b">decentralizzato &mdash; 20x/anno</text>
        <!-- gap bracket -->
        <line x1="455" y1="75" x2="455" y2="155" stroke="#222" stroke-width="1" stroke-dasharray="3 3"/>
        <line x1="451" y1="75" x2="459" y2="75" stroke="#222" stroke-width="1"/>
        <line x1="451" y1="155" x2="459" y2="155" stroke="#222" stroke-width="1"/>
        <text x="463" y="119" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="700" fill="#222">1000x</text>
      </svg>
      <figcaption>&#128200; <strong>ff.2.1.1</strong> &mdash; Il training decentralizzato cresce quattro volte pi&ugrave; in fretta di quello di frontiera (20x contro 5x l'anno), ma parte da mille volte pi&ugrave; in basso: le run pi&ugrave; grandi restano nell'intervallo 6e22-6e23 FLOP. Stime Epoch AI, scala logaritmica indicativa.</figcaption>
    </figure>

"""

def para(fonte_n):
    return """    <!-- ===== inject 2026-07-29 &mdash; note_id:1621 &mdash; Epoch AI: training decentralizzato 20x/anno ===== -->
""" + FIGURE + """    <p>Decentralizzare, per&ograve;, ha un tasso di cambio che Epoch AI ha misurato. Il training di frontiera cresce di <mark class="note-highlight">5x l'anno</mark>; le run distribuite su internet crescono di <mark class="note-highlight">20x l'anno</mark>, un ritmo che dal 2020 vale un aumento di 600.000 volte nella scala dei progetti decentralizzati. Il quadruplo della velocit&agrave; sembrerebbe la condanna del super-cluster monolitico, finch&eacute; non si guarda il punto di partenza: <a id="ref-fonte-{n}"></a><a href="{url}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;">le pi&ugrave; grandi run decentralizzate mai completate stanno nell'intervallo 6e22-6e23 FLOP, mille volte meno del compute stimato per i modelli di frontiera</a><sup><a href="#fonte-{n}" style="color:var(--accent);text-decoration:none;">[{n}]</a></sup>. INTELLECT-1 di Prime Intellect ha addestrato 10 miliardi di parametri su mille miliardi di token con DiLoCo, cento passi interni e quantizzazione a 8 bit; INTELLECT-2 ha coordinato oltre 800 nodi per il post-training in RL asincrono di QwQ-32B. Il collo di bottiglia si &egrave; spostato sulla banda in upload: a <mark class="note-highlight">60 Mbps</mark> tipici, tenendo la sincronizzazione sotto i dieci minuti, il modello pi&ugrave; grande allenabile resta un modesto 600M di parametri &mdash; ed &egrave; per questo che DiLoCo, che taglia il fabbisogno di banda di <mark class="note-highlight">500 volte</mark>, &egrave; diventato l'algoritmo di riferimento. L'aritmetica del differenziale darebbe cinque anni e mezzo per colmare il divario, ma Jaime Sevilla conclude che &ldquo;<mark class="note-highlight">al ritmo di crescita attuale non vedremo le run decentralizzate raggiungere la frontiera in questo decennio</mark>&rdquo;. Le classi di riferimento che usa per stimare un'espansione possibile di 30-3.000 volte sono gi&agrave; passate da queste pagine: folding@home al picco di 2,43e18 FLOP/s e i circa 30 miliardi di dollari di infrastruttura Bitcoin, il cui consumo si stimava pari a quello dell'intera Finlandia
    (<span class="fc">&#127467;&#127470; ff.1.5
    Il consumo energetico di Bitcoin</span>),
    dentro quella stessa economia di conversione soldi/tempo-calcolo in cui l'hardware che mina pu&ograve; anche allenare
    (<span class="fc">&#129302; ff.73.2
    La convergenza AI-Bitcoin</span>).
    Per ora centralizzare conviene ancora
    (<span class="fc">&#127961;&#65039; ff.52.2
    Centralizzare conviene</span>),
    e il vantaggio residuo si misura in una manciata di anni.</p>

""".replace("{n}", str(fonte_n)).replace("{url}", URL)


def biblio_li(n):
    return ('<li id="fonte-%d"><a href="%s" target="_blank" rel="noopener" '
            'class="text-blue-700 hover:underline">%s</a> &mdash; '
            '<span class="text-zinc-500">epoch.ai</span> '
            '<a href="#ref-fonte-%d" style="text-decoration:none;" aria-label="Torna al testo">&#8617;</a></li>\n'
            % (n, URL, SRC_TITLE, n))


def inject(path, anchor, fonte_n, count_old, count_new, count_pat, count_repl):
    with io.open(path, encoding='utf-8') as f:
        html = f.read()
    assert html.count(anchor) == 1, "anchor not unique in %s (%d)" % (path, html.count(anchor))
    html = html.replace(anchor, anchor + "\n" + para(fonte_n), 1)

    # bibliography: append after the last <li id="fonte-N">
    last = '<li id="fonte-%d"' % (fonte_n - 1)
    idx = html.index(last)
    end = html.index('</li>\n', idx) + len('</li>\n')
    html = html[:end] + biblio_li(fonte_n) + html[end:]

    assert count_pat in html, "count pattern missing in %s" % path
    html = html.replace(count_pat, count_repl, 1)

    with io.open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    print("OK %s -> fonte-%d" % (path, fonte_n))


# sub-page: insert after the ff.82.4 "Guerra calda" paragraph
ANCHOR_SUB = """    (<span class="fc">&#129397; ff.82.4
    Guerra calda</span>).</p>"""
inject(SUB, ANCHOR_SUB, 30, 29, 30,
       '<p class="text-sm text-zinc-500 mb-4">29 fonti.</p>',
       '<p class="text-sm text-zinc-500 mb-4">30 fonti.</p>')

ANCHOR_AGG = """    (<span class="fc">&#129397; ff.82.4
    Guerra calda</span>).</p>"""
inject(AGG, ANCHOR_AGG, 91, 90, 91,
       '<p class="text-sm text-zinc-500 mb-4">90 fonti in questa sezione.</p>',
       '<p class="text-sm text-zinc-500 mb-4">91 fonti in questa sezione.</p>')
