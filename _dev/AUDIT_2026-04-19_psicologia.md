# AUDIT — chapter-03-psicologia.html
**Date:** 2026-04-19
**Scope:** ~678 lines, ~5.617 parole, 57-58 fonti
**Total findings:** 35+

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line(s) | Issue | Fix |
|---------|-------|-----|
| 215, 268, 447 | Nested `<mark class="note-highlight"><mark class="note-highlight">…</mark></mark>` | Rimuovere wrapper interno |
| 216 | `<span class="fc">📊 note 1279 YouGov: gli anni migliori</span>` — formato `note N` invece di `ff.X.Y` | Convertire al pattern FF standard o documentare come nota.json |
| 300, 569 | Doppio link `https://amzn.to/3HmBA20` (fonte-17) | Verificare se intenzionale; consolidare se duplicato |

---

## 2. TITOLI FF.X.Y

| Lines | Ref | Issue | Fix |
|-------|-----|-------|-----|
| 451-453 | ff.130.4, ff.130.5 | Link interni a `chapter-03-psicologia.html` ma manca substackMap entry | Aggiungere mapping JS o convertire a nota |

Tutti gli altri ff.X.Y: emoji coerente, formato corretto, no duplicati.

---

## 3. LINK

| Line | Issue | Fix |
|------|-------|-----|
| 224, 233, 528, 537 | `src="../libri/four-thousand-weeks.jpg"` etc. — percorsi relativi rotti dal `book/` | Cambiare a `/libri/...` (assoluto) |
| 373 | Paragrafo referenzia fonte-33 ma manca `<a id="ref-fonte-33"></a>` davanti al link | Aggiungere anchor inline |
| 147 | Testo "circonferenza polpaccio < 35cm" (fonte-58) — verificare anchor-ref | Aggiungere se mancante |

target/rel su esterno: tutti OK su sample 15 link.

---

## 4. STILE PROSA

PASS in generale: opener forti, tesi entro 2-3 frasi, chiusura `cfr. ff.X.Y`, lunghezza 80-160 parole, FF voice (paradossi, dati come fondazione, metafore fisiche).

---

## 5. HIGHLIGHT (mark.note-highlight)

| Lines | Highlights | Action |
|-------|-----------|--------|
| 186-197 | 4 (ECCESSO) | Ridurre a 2: mantenere "4.000 settimane" + "scegliere consapevolmente" |
| 151-153 | 1 (CARENTE) | Aggiungere "Pokédex per le emozioni" |
| 220-222 | 1 (CARENTE) | Aggiungere "tre ore di fissazione" |

Quality OK: tutti highlight su numeri/coniature/sorprese, no titoli libri o nomi persone.

---

## 6. FOOTNOTE BIDIREZIONALI

- Backlink mix `&#8617;` con testo `↩` raw → standardizzare TUTTI a entity `&#8617;`
- Verificare anchor-refs su fonte 51-57 (sample non controllato per intero)
- Fonte 58 da confermare

---

## 7. UNIFORMITÀ

- Heading hierarchy: PASS (h2 3.1 → h3 3.1.1-3.1.4, IDs s1, s1-1..s1-4)
- Border bottom rosso (FF red, coerente con cap 03)
- Blockquote: PASS (`<blockquote>` brevi, `class="pull-quote"` per estratti lunghi)
- Figure: PARTIAL (paths relativi rotti, vedi §3)
- Span.fc: PASS

---

## 8. ALTRO

- Coerenza Matrix e Materia (cap 02): "smaterializzazione" come tema riapre in cap 03 da prospettiva psicologica — tematicamente OK, no overlap di ff.x.y refs
- Aria-label sui backlinks da uniformare
- SEO metadata + skip-link + accessibility: PASS

---

## PRIORITY FIXES

**CRITICAL:**
1. L.215, 268, 447 — Nested `<mark>` tags
2. L.224, 233, 528, 537 — Percorsi `../libri/` rotti → assoluti
3. L.451-453 — ff.130.4/130.5 senza substackMap
4. L.216 — `note 1279` formato anomalo

**IMPORTANT:**
5. L.186-197 — 4 highlights → 2
6. L.151-153, 220-222 — carenti, +1 highlight ciascuno
7. Backlink arrows uniformare a `&#8617;`
8. Anchor-ref fonte-33 (riga 373) + fonte-58 (riga 147)

**MINOR:**
9. Verifica anchor-refs fontes 51-57
10. Aria-label uniforme su backlinks
