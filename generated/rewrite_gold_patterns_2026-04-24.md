# Rewrite Gold Patterns — Matrix e Materia (2026-04-24)

Riferimento estratto dal paragrafo Matrix e materia in `book/chapter-02-metaverso.html` (righe 175-178) + il micro-loop Discord/Metaverso/Siamo gia nel metaverso (170-200).

## 7 tratti strutturali del gold standard

### 1. Opening asciutto e ancorato a oggetti
NON: "In un mondo in cui...", "Immagina un futuro...", "Negli ultimi anni..."
SI: elenco concreto di oggetti/tecnologie ("Cloud, IoT, 5G, QR code, realta aumentata...") oppure una citazione che stacca ("Discord nacque come server vocale per il gaming").

### 2. Bibliografia bidirezionale inline (+ anchor)
Pattern obbligato:
```
<a id="ref-fonte-N"></a><a href="URL" target="_blank" rel="noopener" style="...">TESTO</a><sup><a href="#fonte-N">[N]</a></sup>
```
Con chiusura bibliografia:
```
<li id="fonte-N"><a href="URL">...</a> - ... <a href="#ref-fonte-N">&#8617;</a></li>
```

### 3. Multi-source weaving (3+ voci in un paragrafo)
Il paragrafo Matrix intreccia Byung-Chul Han (libro), Baudrillard (citazione diretta), etimologia (etimo.it), Boccioni (Wikipedia). Quattro fonti in ~200 parole. Le fonti NON sono accumulate: si parlano tra loro (Han diagnostica, Baudrillard ha visto, l'etimologia tradisce, Boccioni dipinge).

### 4. mark.note-highlight come carotaggio del dato
MAI highlight su intere frasi generiche. Sempre su dato o sentenza (es.: "la societa ha sostituito a tal punto la realta delle cose con simboli..."). Minimo 2 per paragrafo oltre le 80 parole. Colore CSS dipende dal chapter (`rgba(X,Y,Z,0.22)`).

### 5. Bridge narrativo orizzontale
Ogni paragrafo apre con un aggancio al precedente o una rottura: "Ma fra l'altro, non siamo gia...", "Eppure il metaverso non e un monolite...", "E c'e chi si chiede...", "E il paradosso e che...". Mai salti secchi.

### 6. Chiusura con cfr ff.X.Y (mai ff.X chapter-only)
Pattern obbligato sempre in fondo al paragrafo:
```
(<span class="fc">EMOJI ff.X.Y Titolo sottocap</span>).
```

### 7. Pull-quote al punto di svolta
`<blockquote class="pull-quote">` posizionato NON a caso ma al pivot dell'argomentazione (quando l'argomento vira, non alla fine). Serve come ritmo visivo + estrazione del dato piu memorabile.

### 8. Figura quantitativa ogni 3-4 paragrafi (preferibile SVG)
Il cap 02-metaverso ha la figura "PREZZO VISORI VR 2014-2024" in SVG inline (righe 223-). Grafico > immagine decorativa. Il dato deve essere nel corpus.

## Voice constraints

- Nervo scoperto in chiusura: MAI concludere con ottimismo. Meglio una tensione irrisolta ("...il prezzo e il controllo", "...l'unico indicatore affidabile resta il tempo speso").
- Michele: secco, provocativo, allergico ai "panorama" e "scenari". Usa verbi fisici ("si e mangiato", "insinua", "affossato").
- Mai citation-block GPT-style. Mai `div.citation`.

## Vincoli PR 6 (merge-safe con PR 5)

- Preserva ALL class names: `brutal-card`, `keypoints`, `ff-eyebrow`, `drop-cap`, `pull-quote`, `note-highlight`, `fc`, `prose`.
- Non toccare CSS in `<style>` (PR 5 domain).
- Solo prose content del sottocapitolo target.
- Highlight color match: accent del chapter (verde natura, blu tech, rosso corpo/societa).
