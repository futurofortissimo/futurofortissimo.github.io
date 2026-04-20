# MASTER AUDIT — FF Book deep editorial review
**Date:** 2026-04-19
**Team:** 10 subagent paralleli (1 per file + 1 cross-chapter)
**Reference gold:** Matrix e Materia paragraph (chapter-02-metaverso.html ~lines 170-173)

## File index

| # | File | Findings | Priority issues |
|---|------|----------|-----------------|
| 1 | [AUDIT_…_mobilita.md](AUDIT_2026-04-19_mobilita.md) | 53 | HTML nesting riga 202, orphan footnote 182, duplicato Lightyear 204+231 |
| 2 | [AUDIT_…_ambiente.md](AUDIT_2026-04-19_ambiente.md) | 52 | Duplicato Ore Energy 503-505 vs 173-174, orphan citazioni [82] [81], emoji misalignment |
| 3 | [AUDIT_…_cibo.md](AUDIT_2026-04-19_cibo.md) | 25-30 | Nested `<mark>` riga 419, malformed emoji 410, ref-fonte-9 duplicato 202+224 |
| 4 | [AUDIT_…_robotica.md](AUDIT_2026-04-19_robotica.md) | 51 | **8 span ff.X.Y aperti senza titolo** (179, 184, 189, 220, 268, 279, 288), fonte-88 mancante, ff.135.3+ff.129.1 duplicati |
| 5 | [AUDIT_…_metaverso.md](AUDIT_2026-04-19_metaverso.md) | 35 | **fonte-1 → 17 + 21 → 26 (19 entries) UNIDIREZIONALI**, ff.3 emoji incoerente 4x, share.google links ephemeral |
| 6 | [AUDIT_…_prodotti.md](AUDIT_2026-04-19_prodotti.md) | 32 | 3 footnote orfane (fonte-11/12/13), zero figure (Cap 2.3 da 4.1k parole), duplicato Wabi.ai vs metaverso |
| 7 | [AUDIT_…_psicologia.md](AUDIT_2026-04-19_psicologia.md) | 35+ | Nested `<mark>` 215/268/447, paths `../libri/` rotti 224/233/528/537, ff.130.4/130.5 senza substackMap |
| 8 | [AUDIT_…_alimentazione.md](AUDIT_2026-04-19_alimentazione.md) | 41 (cfr. flag scartato) | Citazioni ARK [37][38] mancanti, fonte-36 Omega-3 orfana, ff.86.1+ff.133 duplicati |
| 9 | [AUDIT_…_cultura.md](AUDIT_2026-04-19_cultura.md) | 47 | **57% footnote senza ↩ back-ref** (24/42), highlights excess +35%, chapter closure incompleto |
| 10 | [AUDIT_…_cross-chapter.md](AUDIT_2026-04-19_cross-chapter.md) | 56 | Numeric drift 629 vs 484 fonti, accent CSS color triplo intenzionale ma non documentato, EPUB safety (script tags + WebP) |

**TOTAL FINDINGS: ~430**

---

## TIER 0 — BLOCKER (fix prima di nuovo deploy)

1. **Robotica: 8 span ff.X.Y aperti senza titolo** (chapter-02-robotica.html righe 179, 184, 189, 220, 268, 279, 288). Genera HTML rotto / cfr senza titolo.
2. **Mobilita: HTML nesting invalido** `<a><span class="fc">…</span></a>` (chapter-01-mobilita.html riga 202).
3. **Cibo: nested `<mark>` tags** (chapter-01-cibo.html riga 419) + **psicologia: nested `<mark>` 215/268/447**.
4. **Metaverso: 19 footnote unidirezionali** (fonte-1→17 + 21→26) — script run o batch fix per aggiungere `<a id="ref-fonte-N"></a>` + ↩ in bibliografia.
5. **Robotica: fonte-88 citata orfana** in testo, manca `<li id="fonte-88">` in biblio.

---

## TIER 1 — HIGH (qualità editoriale)

### Duplicazioni di contenuto (priorità 1)
- chapter-01-ambiente.html righe 503-505 ≈ 173-174 (Ore Energy battery paragrafo duplicato verbatim)
- chapter-01-mobilita.html righe 204+231 (Lightyear/Tesla Model S duplicato)
- chapter-02-prodotti.html duplicato Wabi.ai copiato da chapter-02-metaverso.html
- chapter-02-robotica.html ff.135.3 duplicato (165, 226), ff.129.1 triplicato (175, 208, 228)

### Citazioni e fonti
- chapter-03-alimentazione.html: aggiungere [37][38] inline + entries per ARK Invest links (riga 293-294)
- chapter-03-alimentazione.html: fonte-36 Omega-3 orfana (citare o rimuovere)
- chapter-02-metaverso.html: sostituire `share.google/...` ephemeri con URL permanenti

### Path/asset rotti
- chapter-03-psicologia.html: `../libri/...` rotto su 224/233/528/537 → cambiare a assoluto `/libri/...`

### Highlight rule of 2
- Cultura: 24+ paragrafi con highlights eccesso (oltre 2) — script per riportare a 2
- Metaverso: 6 paragrafi sotto-bar (Discord, smartphone, X, Angie, case NFT) → +4 highlights
- Alimentazione: 209-213 e 257-266 a 3 → ridurre a 2
- Robotica: linee 155, 178, 340 a 1 o 0 → +3 highlights

---

## TIER 2 — MEDIUM (uniformità + filo narrativo)

### Stile prosa (bridges narrativi)
- chapter-01-mobilita.html sezioni 1.1.3 e 1.1.4: aperture senza aggancio "Ma…/Eppure…"
- chapter-01-mobilita.html righe 174-179: enumerazione vs narrativa (city-15min)
- chapter-02-metaverso.html righe 159, 195-198, 233-235: bridge da tightening
- chapter-02-robotica.html righe 165-166: salto brusco singolarità → AI bug
- chapter-03-cultura.html: chapter closure incompleto, manca recap 4 sezioni prima del Leopardi

### Emoji consistency
- ff.34: 3 emoji diverse in mobilita (167/175/177) → canonical
- ff.3: 4 emoji diverse in metaverso (142/145/165/202) → canonical
- ff.95.2 🦆 → 👑 o 🏰 (FarmVille e feudalesimo)
- ff.73.5 ❌ → 📱 (X: la rivincita di Elon)

### Bibliography format
- Standardizzare back-arrow: tutti `&#8617;` (no mix con raw `↩` o `&#8629;` o `&crarr;`)
- chapter-02-prodotti.html: footnote numbering non sequenziale ([29] → [34] → [43]) — re-sequenziare
- chapter-02-prodotti.html: manca `class="pull-quote"` su blockquote Naval (riga 290)

### Figure
- chapter-02-prodotti.html: zero figure in 4.1k parole → aggiungere 4 (1 per subchapter)
- chapter-02-robotica.html: solo 1 figura → aggiungere 2-3 in 2.1.2-2.1.4
- chapter-02-metaverso.html: spostare Bitcoin Standard figure → riga 297, Chip War figure → riga 330

---

## TIER 3 — LOW (polish)

### Refusi
- chapter-01-mobilita.html riga 263: emoji `1️⃣` con variation selector + ZWJ rotto su alcuni renderer
- chapter-02-metaverso.html riga 185: `&#39;` apostrophe vs `&rsquo;` altrove
- chapter-03-alimentazione.html riga 269: `Poga&#269;ar` HTML entity → Unicode "Pogačar"
- VO₂ encoding standardizzare ovunque
- CO₂ encoding standardizzare ovunque (`&#8322;` o `<sub>2</sub>`)

### Metadata
- chapter-02-metaverso.html: `wordCount:3053` errato → `~3800`, `~15 min` → `~18 min`
- Tutti i sottocapitoli: `article:modified_time` sempre 2026-04-17 → date reali
- Schema.org Chapter `position` ambiguo (per-book vs per-chapter)
- index.html "629+ riferimenti" vs "484 fonti" → riconciliare con count reale (somma footnote da tutti 9 file)
- index.html "147 numeri" vs "148 numeri" — off-by-one

### Accessibility
- chapter-02-robotica.html riga 236: `<img>` senza alt text → aggiungere
- Skip link `#content` → test WCAG 2.1 AA focus visible
- Aria-label uniforme su tutti i back-arrow

### EPUB safety (cross-chapter)
- Strip `<script>` tags da EPUB build (analytics non eseguibile in reader)
- Convertire WebP → PNG/JPG (non universal in reader EPUB)
- Self-closing tags void elements `<meta />` `<img />` → uniformare HTML5 (no slash)
- Tailwind classes inline tramite PurgeCSS pre-build

### CSS drift (intenzionale ma documentare)
- Cap 1 green / Cap 2 blue / Cap 3 red accent → documentare in STYLE_MEMO §4
- note-highlight RGBA verificare opacity 0.22 + match hex
- pull-quote font-size variance → canonical PULL_QUOTE_SPEC.md

---

## PIANO PROSSIMI GIORNI (suggested)

### Giorno 1 (Tier 0 + critical fixes)
- 8 span aperti robotica (1h)
- HTML nesting mobilita riga 202 (15min)
- Nested `<mark>` cibo + psicologia (30min)
- 19 footnote bidir metaverso (2h con script)
- Fonte-88 robotica (15min)

### Giorno 2 (Tier 1 — duplicati + citazioni)
- Risolvere 4 duplicazioni contenuto (1.5h)
- Citazioni ARK alimentazione + fonte-36 orfana (45min)
- Sostituire share.google links metaverso (30min)
- Path `../libri/` psicologia (30min)

### Giorno 3 (Tier 1 — highlights)
- Cultura: ridurre highlights eccesso a 2 per 24 paragrafi (2h)
- Metaverso: +4 highlights mancanti (45min)
- Alimentazione + robotica: bilanciamento highlights (1h)

### Giorno 4 (Tier 2 — narrative bridges + emoji)
- Bridges mobilita, metaverso, robotica (2h)
- Closure cultura (chiusura libro) (1h)
- Canonical emoji per ff.34, ff.3, ff.95.2, ff.73.5 (45min)

### Giorno 5 (Tier 2 — figure + bibliografia)
- Aggiungere figure prodotti (4) e robotica (2-3) (1.5h)
- Spostare figure metaverso (30min)
- Standardizzare back-arrow (script idempotente) (30min)
- Re-sequenziare footnote prodotti (1h)

### Giorno 6 (Tier 3 — polish)
- Refusi sparsi (1h)
- Metadata standardization (45min)
- Accessibility (alt + skip + aria) (45min)
- index.html stats riconciliate (30min)

### Giorno 7 (EPUB + CSS docs)
- Script EPUB build + PurgeCSS + WebP convert (2h)
- Document CSS drift in STYLE_MEMO (30min)
- Final rebuild EPUB + Nu HTML Checker su tutti 9 file (1h)

**Effort totale: ~22-28 ore** distribuite su 7 giorni.

---

## NOTE METODOLOGICHE

- Audit eseguito da 10 subagent paralleli (Explore type, ~15-20 min ciascuno)
- 1 finding scartato a posteriori: agent alimentazione ha mis-letto rules e flaggato `(cfr. ...)` come violazione fittizia §0.nonies — RESPINTO
- Tutti i fix proposti sono CORPUS FIDELITY-compliant (no invenzione testo)
- Matrix e Materia (chapter-02-metaverso.html ~170-173) preservato verbatim come gold reference

## OUTPUT FILES
9 audit per-file + 1 cross-chapter + questo MASTER → `book/_dev/AUDIT_2026-04-19_*.md`
