# AUDIT EDITORIALE — chapter-02-prodotti.html

**Data audit**: 2026-04-19  
**Fonte**: chapter-02-prodotti.html (~498 linee, 4.1k parole, 43 fonti)  
**Confronto**: OPERATIVE_SUPER_RULE.md + STYLE_MEMO.md

---

## 1. REFUSI / ERRORI ORTOGRAFICI

Nessun errore rilevante di ortografia. Controllo: HTML entity corretto (è, à, etc.). ✓

---

## 2. TITOLI FF.X.Y — emoji, format, numeri

| Issue | Linea | Dettaglio |
|---|---|---|
| Emoji duplicato | 234, 229 | ff.81.5 e ff.84.3 entrambi &#129470; — ff.81.5 dovrebbe avere emoji diversa |
| Titolo malformato | 162 | ff.119.3 "Longa 'Manus'" dovrebbe essere "Longa manus" (apostrofi ricurve, non doppie apici) |
| Emoji assente inline | 330, 341, 353 | ff.28, ff.42, ff.123/ff.129 non hanno emoji embedded nella span |
| Subchapter duplicato | 332, 377 | ff.4.1 citato due volte — intenzionale? |
| Verifica numeri | All | Nessun ff.X inventato — tutti coerenti con FF pattern |

---

## 3. LINK — target/rel, broken anchors

| Issue | Count | Linea |
|---|---|---|
| Footnotes orfane | 3 | fonte-11 (Tesla sales), fonte-12 (Tesla P/E 180x), fonte-13 (AI digital +300%) — definite ma NON citate nel testo |
| rel="noopener" mancante | 1 | Riga 311 (fortissimo.substack.com) |
| Backlink style inconsistente | 5+ | Mix di &#8617;, ↩, &#8629;, &crarr; nella sezione Bibliografia — dovrebbe essere unificato |
| Anchor bidirezionali | OK | Tutti i ref-fonte-X hanno backlink corretti |

---

## 4. STILE PROSA — bridges, thesis, FF voice

| Issue | Paragrafi | Severità |
|---|---|---|
| Bridge mancante | 151-152, 336-340, 357-360 | Transizioni fra paragrafi assenti (es. da Alabama Booksmith a Hyperion) |
| Tesi duplicate | 302-304, 343-350 | Accumulano 2+ tesi per paragrafo |
| Prosa lunghissima | 164-168 (~400 parole), 357-360 (~300 parole) | Dovrebbe essere spezzata in 2 paragrafi per respiro narrativo |
| Duplicazione contenuto | 183 vs metaverso.html | Testo Wabi.ai identico — dovrebbe differenziare |

---

## 5. NOTE-HIGHLIGHT — esattamente 2 per long para

| Issue | Paragrafi | Count |
|---|---|---|
| Deficit (< 2) | 155-160, 164-168, 206-209, 211-212, 217-220, 227-230, 237-240, 305-308, 339, 362-365, 372-374 | 11 paragrafi con 0-1 highlight su paragrafi >150 parole |
| Duplicato | 195 | "allucinazione del capire i concetti" ripete linea 189 |
| Excess giustificato | 347-350, 357-360, 376-378 | 3 highlights per paragrafi >350 parole — OK |

---

## 6. FOOTNOTE BIDIREZIONALI — orphans, gaps

| Stato | Fonte | Issue |
|---|---|---|
| Orfane | 11, 12, 13 | CRITICAL — Definite nella bibliography ma non citate in testo |
| Intenzionali | 26, 27 | OK — Commentate "rimossi: Orwell, Koestler non nel corpus" |
| Backlink style | Multiple | ⚠️ Inconsistenza: &#8617; (early), ↩, &#8629;, &crarr;, &#8629; |

---

## 7. UNIFORMITÀ — headings, blockquotes, figures

| Elemento | Verifica | Issue |
|---|---|---|
| h2, h3 | ✓ Uniform (IBM Plex Mono, uppercase, border-b-4) | OK |
| Pull-quotes | ✓ 2 blockquote, centered, border-left blue | OK |
| Span.fc | ✓ 69 span uniforms (0.92rem, 600, var(--accent)) | OK |
| **Figura** | ✗ ZERO | CRITICAL — Dovrebbe avere 4 figure (1 per subchapter) per OPERATIVE_SUPER_RULE.md § 5 |
| Link styling | ⚠️ 1 mancante rel="noopener" | Minor |

---

## 8. ALTRO — Cross-ref, voice, narrative

| Issue | Severità |
|---|---|
| Wabi.ai duplicato tra capitoli (metaverso vs prodotti) | Minore — suggeri di differenziare |
| Nessun riferimento a ff.64.4 "Matrix e materia" | Minore — intenzionale per focus diverso |
| Pronoun/voice shift | Minore — coerente con FF style |

---

## SUMMARY

**Total findings: 32 issues**
- CRITICAL: 4 (3 footnotes orfane, 0 figure)
- MODERATO: 8 (emoji duplicati, bridges assenti, tesi duplicate)
- MINORE: 20 (highlight deficit, backlink style, link rel)

**File salvato**: `/tmp/audit.md`
