# AUDIT — chapter-03-alimentazione.html
**Date:** 2026-04-19
**Total findings:** 41

> **NOTE:** L'agent ha flaggato come "CRITICAL" la presenza di `(cfr. <span class="fc">…</span>)` come violazione di un fantomatico §0.nonies. **Questo finding è SCARTATO**: il pattern `(cfr. …)` è esattamente il formato gold standard di Matrix e Materia (chapter-02-metaverso.html righe 170-173) e di OPERATIVE_SUPER_RULE §3. Tenere solo i findings reali sotto.

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line | Issue | Fix |
|------|-------|-----|
| 269 | `Poga&#269;ar` HTML entity | Usare Unicode/ASCII direttamente "Pogačar" |
| varie | VO₂ encoding inconsistente | Standardizzare a `VO<sub>2</sub>` o `VO&#8322;` |

---

## 2. TITOLI FF.X.Y

| Line | Issue | Fix |
|------|-------|-----|
| 143, 219 | ff.86.1 duplicato | Consolidare o differenziare contesto |
| 220, 277 | ff.133 duplicato | Consolidare |
| 283 | `ff.57` incompleto, manca subchapter | Verificare ff.57.X corretto |
| tutti 30 ff.X.Y | Verificare esistenza in data.js | Cross-check |

---

## 3. LINK

| Line | Issue | Fix |
|------|-------|-----|
| 293-294 | 2 link ARK Invest embedded SENZA superscript [37][38] + bibliography entry | Aggiungere `<a id="ref-fonte-37/38"></a><sup>[37/38]</sup>` + voci `<li id="fonte-37/38">` |
| 294 | Path relativo rischioso | Usare assoluto |

---

## 4. STILE PROSA

| Lines | Issue | Fix |
|-------|-------|-----|
| 154-155 | Inject Omega-3 senza bridge al testo precedente | Aggiungere apertura narrativa |
| 158-159 | Sezione 4000-steps disconnessa dal contesto | Bridge "E se l'esercizio veloce è scarsità, anche pochi passi al giorno…" |
| 162-168 | Sezione pizza/GLP-1 senza tesi unificata | Topic sentence o split in 2 paragrafi |
| 283-286 | Pull-quote eccede 1-2 frasi (limite STYLE_MEMO) | Ridurre |

---

## 5. HIGHLIGHT

| Lines | Count | Action |
|-------|-------|--------|
| 209-213 | 3 (ECCESSO) | Rimuovere "circonferenza polpaccio". Tenere "chi non si muove trae benefici limitati" + "muscoli agiscono da spugna metabolica" |
| 257-266 | 3 (ECCESSO) | Rimuovere "La Norvegia è maniacale" (stilistico). Tenere "50 anni" + "7 ore e 21 minuti" |
| 219 | 1 (CARENTE) | Aggiungere "quando i bisogni primari sono soddisfatti, la ricerca di stimoli accelera" |

---

## 6. FOOTNOTE BIDIREZIONALI

| Issue | Fix |
|-------|-----|
| Fonte-36 (Omega-3) ORFANA in bibliografia, non citata | Aggiungere [36] alle linee 154-155 o rimuovere entry |
| Fonti [37][38] mancano (ARK Invest) | Aggiungere voci |

---

## 7. UNIFORMITÀ

- Heading structure: PASS (mostly compliant)
- Backlinks: standardizzare format
- Unicode normalization: vedi §1
- Figure styling: minor inconsistencies

---

## 8. ALTRO — ATTRIBUTIONS

| Line | Issue | Fix |
|------|-------|-----|
| 142 | Verificare Lieberman paraphrase matchi tesi *Exercised* | Cross-check libro |
| 197-198 | Couzens quote paraphrasata come "salute" ma originale è "forma" — semantic shift | Restore original o citare paraphrase esplicitamente |
| 167 | GLP-1 "$88B a rischio" non sourced — fonte-29 menziona solo 6-9% decline | Sostituire con dato citato o aggiungere fonte |
| 202 | Kristen Fortney quote attribuita ma NON in bibliografia | Aggiungere [N] citation |

---

## PRIORITY FIXES

**HIGH:**
1. Aggiungere [37][38] citations + entries per ARK Invest links
2. Fonte-36 Omega-3 orfana → citare o rimuovere
3. Risolvere duplicati ff.86.1 (143+219), ff.133 (220+277)

**MEDIUM:**
4. Highlight excess (209-213, 257-266) → portare a 2
5. Highlight carente (219) → +1
6. Bridge narrativi sezioni Omega-3 e 4000-steps
7. Verifica attribution Couzens, Fortney, GLP-1 source
8. Tesi unificata pizza/GLP-1 paragrafo

**LOW:**
9. Pogačar Unicode invece di entity
10. VO₂ encoding standardizzato
11. Pull-quote 283-286 ridurre lunghezza
