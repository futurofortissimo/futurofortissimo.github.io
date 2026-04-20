# AUDIT — chapter-02-metaverso.html
**Date:** 2026-04-19
**Scope:** 451 lines, ~3.500 parole, 36 fonti, 38 mark.note-highlight
**NOTE:** Matrix e Materia paragraph (lines 174-176) intentionally NOT audited — è il gold reference

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line | Issue | Fix |
|------|-------|-----|
| 185 | `&#39;` apostrophe in "un'altra realtà?" inconsistent vs `&rsquo;` altrove | Use native `'` o `&rsquo;` |
| 281 | "X Æ A-12" — encoding ambiguo (Roman numerali?) | Clarify intent |
| 326 | "l'Albania ha proposto un ministro AI" abrupt dopo Nepal Discord ref | Add bridge "...un ministro via Discord; l'Albania, invece, ha proposto..." |

---

## 2. TITOLI FF.X.Y

| Line | Ref | Issue | Fix |
|------|-----|-------|-----|
| 180,185,192,235 | Variation selectors `&#65039;&#8419;` mixed con emoji literal `3️⃣` | Standardizzare su literal |
| 259 | 🦆 ff.95.2 FarmVille e feudalesimo | Duck emoji incongruente con feudalesimo | Sostituire con 👑 o 🏰 |
| 282 | ❌ ff.73.5 X: la rivincita di Elon? | ❌ in conflitto con tema "X" | Cambiare a 📱 o emoji X-themed |
| 142,145,165,202 | ff.3 con emoji DIVERSI ogni volta (🌐, 🎮, 👻, 🍽️) | Inconsistenza | Assegnare 1 emoji per ff.3, usare subchapter emoji per ff.3.1/3.2/3.4 |
| 196 | ff.148.3 titolo con `l&agrave;` invece di `là` | Usare native `là` |

---

## 3. LINK

| Line | Issue | Fix |
|------|-------|-----|
| 322, 295 | `https://share.google/...` link Google Drive ephemeri | Sostituire con URL permanenti (Pew, ARK Invest, blog Coinbase originali) |
| 155+212 | ff.85.3 "Nuova vita al nostro passato" citato 2x in stessa sezione | Consolidare |
| 261+357 | ff.95.1 "La sovranità dei network" citato 2x | Consolidare |
| 371 | Internal link substack ff.64 — verificare substackMap entry | Aggiungere mapping o rimuovere |
| 320-321 | Periodo dentro `<span>` invece di fuori | Move period outside |

---

## 4. STILE PROSA — vs Matrix e Materia

| Lines | Issue | Fix |
|-------|-------|-----|
| 141-142 | Opening senza tesi esplicita prima dei dati 13.7B + 70% | Add "Meta non è un'azienda che ha ripensato se stessa: è un'industria che ha ripensato il concetto di realtà" |
| 159 | Bridge "E mentre i salotti entrano in VR" usa "mentre" senza causalità | Cambiare a "Dunque, se il salotto diventa VR, cosa diventa il web? Non più uno spazio per umani..." |
| 179-181 | "Ma fra l'altro, non siamo già nel metaverso?" — domanda circolare, risposta solo a fine | Anticipare risposta: "La risposta è sì, ma non come Zuckerberg l'immagina" |
| 195-198 | Due cfr nello stesso periodo (ff.148.3 + ff.85.2 nested) | Split in due frasi |
| 233-235 | cfr finale parentetico ricucito male | Integrare nel flow: "...si sdoppierà in fisico e digitale (cfr. ff.10.3)" |

---

## 5. HIGHLIGHT — Rule of 2

| Lines | Count | Status | Action |
|-------|-------|--------|--------|
| 168-171 (Discord/Roblox) | 0 | MISSING | Add 2: "comunità digitali selettive" + "Roblox virtual store can outpace physical traffic" |
| 179-181 (smartphone time) | 1 | INSUFFICIENT | Add "il 70% di quel tempo assorbito da app social e video" |
| 184-188 (VR hardware) | 3 | TOO MANY | Remove "diecimila dollari" (duplicato con riga 217), keep McKinsey + ASML |
| 205-208 (X vs Discord) | 1 | INSUFFICIENT | Add "il tempo speso è il solo indicatore affidabile" |
| 210-214 (Hyperscapes/olfatto) | 3 | TOO MANY | Consolidare con riga 154, keep 2 |
| 228-231 (Angie virtual influencer) | 1 | INSUFFICIENT | Add "inietta deliberatamente l'imperfezione per sembrare più umana" |
| 233-235 (case digitali NFT) | 1 | INSUFFICIENT | Add "il pubblico di un wallet Ethereum è l'intera rete" |

NET: +4 highlights needed.

---

## 6. FOOTNOTE BIDIREZIONALI

- fonte-18, 19, 20 (Matrix e Materia gold): BIDIREZIONALI ✓
- fonte-27 → 34: BIDIREZIONALI ✓ (lavoro 18-19 aprile)
- **fonte-1 → 17, 21 → 26 (19 totali): UNIDIREZIONALI** — citate inline ma manca `<a id="ref-fonte-N"></a>` + ↩ in biblio
- Header bibliografia "32 fonti" ma list ha 34 entry (fonte-1 → 34) → aggiornare counter

---

## 7. UNIFORMITÀ

| Line | Issue | Fix |
|------|-------|-----|
| 290 | `<blockquote>` Naval Ravikant SENZA `class="pull-quote"` | Aggiungere class |
| 221, 354, 365 | Altri blockquote hanno `class="pull-quote"` — disuniforme | Standardizzare tutti |
| 310 | Bitcoin Standard figure caption come `<a>` puro, non `ff.N — Title: bridge` | Riscrivere caption nel formato standard |
| 340-346 | Chip War figure positioned ~10 lines dopo paragrafo rilevante | Spostare a riga 330 (dopo "Chris Miller lo ha raccontato...") |
| 306-313 | Bitcoin Standard figure orphaned | Spostare a riga 297 (dopo intro Ammous) |

---

## 8. ALTRO

- L.103 metadata `"wordCount":3053` ma prosa effettiva ~3.800 → aggiornare
- L.131 "~15 min" reading time troppo conservativo per 3.5k parole dense → aggiornare a "~18 min"
- L.375-376 paragrafo AI brain-decoding senza footnote → aggiungere fonte
- L.371 hyperlink dentro `<mark class="note-highlight">televisione trasparente</mark>` rompe pattern ff.X.Y
- L.350 link Garante Privacy parentetico disrupting flow → ristrutturare
- L.281 self-reference "argomentato in ff.73.1" — chiarire se same-doc o cross-chapter

---

## PRIORITY FIXES

**CRITICAL:**
1. fonte-1 → 17, 21 → 26: aggiungere `<a id="ref-fonte-N"></a>` + ↩ (19 items)
2. Standardizzare emoji encoding (literal vs entity) per ff.3 (4 occorrenze divergenti)
3. Sostituire `share.google/...` con URL permanenti

**HIGH:**
4. +4 highlights (Discord, smartphone, X, Angie, case NFT) / -2 (VR hardware, Hyperscapes)
5. Tighten narrative bridges (159, 195-198, 233-235)
6. Consolidate ff.85.3 (155+212) e ff.95.1 (261+357)
7. Spostare figure Bitcoin Standard (→ 297) e Chip War (→ 330)

**MEDIUM:**
8. Update metadata wordCount + readTime
9. Fix blockquote Naval (add `class="pull-quote"`)
10. Clarify "X Æ A-12"
