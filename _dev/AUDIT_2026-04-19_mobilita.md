# AUDIT — chapter-01-mobilita.html
**Date:** 2026-04-19
**Scope:** ~330 lines, full file read
**Gold Standard:** "Matrix e Materia" (chapter-02-metaverso.html, ~lines 170-173)
**Total findings:** 53

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line | Issue | Fix |
|------|-------|-----|
| 182 | Orphan footnote `<a href="#fonte-18" class="fnote-ref">[18]</a>` without inline anchor before substantive text | Add `<a id="ref-fonte-18"></a>` wrapping a key fact phrase |
| 227 | Mixed `&ndash;`/`&mdash;` usage | Standardise on `&mdash;` |
| 192 | Image figcaption uses raw UTF emoji where other captions use `&#127959;` entity | Use entity for consistency |

---

## 2. TITOLI FF.X.Y

| Line | Ref | Issue | Fix |
|------|-----|-------|-----|
| 167 | ff.34 (no Y) | Parent-only ref, inconsistent vs ff.X.Y pattern | Use ff.34.N if a subchapter exists |
| 182 | ff.34 dup | Same parent-only ref appears twice within 15 lines | Consolidate or specify subchapter |
| 198 | ff.60 (no Y) | Parent-only | Use ff.60.N |
| 202 | ff.60.1 inside `<a href>` wrapping `<span class="fc">` | INVALID HTML nesting — anchor wraps span | Move `<a>` outside span, keep `<span class="fc">EMOJI ff.60.1 Title</span>` clean |
| 205 | ff.5 (no Y) | Parent-only | Verify if ff.5.1 was intended |
| 213 | ff.58 (no Y) | Parent-only | Verify |
| 245 | ff.1 (no Y) | Parent-only | Use ff.1.N |
| 255+263 | ff.20.1 dup | Same ref twice in last 10 lines | Remove one or differentiate |
| 263 | `1️⃣ ff.34.5` with `&#65039;&#8419;` variation selector | Unicode rendering broken on some viewers | Use plain emoji or `📊` |

---

## 3. LINK

| Line | Issue | Fix |
|------|-------|-----|
| 113 | Google Translate top nav link missing `target="_blank"` and `rel="noopener"` | Add both |
| 202 | `<a href="...#s1-3"><span class="fc">…</span></a>` — span inside anchor breaks structure | Move anchor outside, or remove inline link and keep only `(cfr. ff.x.y)` |
| 242, 261, 263 | Three internal refs to `#s1-2` within ~20 lines | Consider consolidation |

---

## 4. STILE PROSA

| Lines | Issue | Fix |
|-------|-------|-----|
| 174-179 | 1.1.2 city-15min reads as enumeration (Paris CO2, Amsterdam, Filippine, Italia, Milano, Paris 100%) without thesis or geographic grouping | Add narrative bridge then group by region/chronology |
| 198-199 | 1.1.3 opens with Cruise robotaxi incident but ends abruptly without `(cfr. ff.60 …)` closure | Add cfr at paragraph end |
| 199-202 | 200+ words mixing China EV adoption + Aurora trucks + mobile charging robots, no topic sentence | Split into 2 paragraphs |
| 212-224 | 1.1.4 jumps from Berners-Lee CO2 calc to "corpo umano impronta carbonica" — non-sequitur | Add bridge: "Ogni mezzo ha un'impronta; ma anche il corpo che lo guida" |
| 204+231 | "piccole utilitarie possono inquinare meno di Tesla Model S" duplicato verbatim | Consolidate into single strong point |
| 254-255 | Zeppelin paragraph good but Crocs anecdote (259-261) feels orphaned | Add bridge "E a proposito di velocità rovesciata: anche la mobilità dei piedi sorprende" |
| 263-265 | Closer paragraph mixes 3 perspectives (atomized people / poetic walking / monocultures) | Stabilise voice — pick metaphor OR data, sustain it |
| Sezioni 1.1.3 + 1.1.4 | Mancano aperture provocative tipo "Ma fra l'altro…" "Eppure…" | Aggiungere agganci narrativi forti in apertura |

---

## 5. HIGHLIGHT (mark.note-highlight) — Rule of 2

| Lines | Count | Status | Action |
|-------|-------|--------|--------|
| 149-150 Kathy Willis | 3 | OVER | Remove "dimensione frattale" highlight, keep "massimizza la felicità" + "euthymìcrona" |
| 198-202 Cruise+Aurora+China | 3+ | OVER | Remove "3 GWh capacità", keep "96% del tempo" + "9 anni a meno di 1" |
| 244-246 Micromobility paradosso | 1 | UNDER | Add 2nd: "l'80% degli spostamenti ha lunghezza inferiore ai 16 km" |
| 254-255 Zeppelin Antartide | 1 | UNDER | Add 2nd: "La velocità è diventata un servizio premium rovesciato" |
| 263-265 Closing manifesto | 3 | OVER | Remove "96% del tempo" (già evidenziato prima), keep "monoculture di asfalto" + "il percorso più felice passa per un parco" |

---

## 6. FOOTNOTE BIDIREZIONALI

| Ref | Issue | Fix |
|-----|-------|-----|
| [2] | Doppio inline-anchor inline (lines 149 + 160) | Verify intentional o consolidate |
| [18] | Orphan struttura: `<a id="ref-fonte-18"></a><a href="#fonte-18">[18]</a>` con sup orfano, manca testo inline davvero ancorato | Riscrivi paragrafo bus stop con frase inline che linka direttamente al paper Findings Press |

---

## 7. UNIFORMITÀ

- Riga 192 figcaption usa raw emoji `🏗` mentre altre figcaption usano entity `&#127959;` → uniformare
- Riga 263 emoji `1️⃣` con variation selector + ZWJ rotto su alcuni renderer → usare emoji plain o `📊`
- Heading levels OK, blockquote OK, drop-cap OK, font-size sui link OK

---

## 8. ALTRO

- Lines 204+231: contenuto duplicato Lightyear/Tesla Model S → consolidare
- Lines 259-261: Crocs anecdote orfana, manca bridge mobility-thread
- Sezioni 1.1.3 e 1.1.4: aperture senza aggancio narrativo provocativo (vs Matrix e Materia "Cloud, Internet of Things, 5G…")
- Mancano `(cfr. ff.x.y)` closures su 2 paragrafi (198-199 Cruise, 212-213 CO2 calc)

---

## PRIORITY FIXES (top 5)

1. **Line 202** — Fix HTML nesting `<a><span class="fc">…</span></a>` (invalid)
2. **Line 181-182** — Riscrivi paragrafo bus stop con anchor inline corretto
3. **Lines 174-179** — Restructure city-15min da enumerazione a narrativa
4. **Lines 204+231** — Dedup contenuto Lightyear/Tesla Model S
5. **Lines 198-202** — Split paragrafo lungo + aggiungi `(cfr. ff.60)`
