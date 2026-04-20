# AUDIT — chapter-02-robotica.html
**Date:** 2026-04-19
**Scope:** ~680 lines, ~8.085 parole
**Total findings:** 51

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line | Issue | Fix |
|------|-------|-----|
| 156 | `💲 ff.135.1` emoji nativa vs `&#127851;` entity altrove | Normalizzare a entity |
| 160,165,173,226,230 | Variation selector `&#65039;` orfano (☀️⭐ malformati) | Usare emoji nativa O rimuovere selector |
| 238 | `&#129504;` (😄) in figcaption ff.2 — non semantico | Verificare emoji canonica per ff.2 nel corpus |
| 183,198 | `CO&#8322;` vs `CO<sub>2</sub>` — coerenza | Standardizzare a `CO&#8322;` |

---

## 2. TITOLI FF.X.Y

| Line | Issue | Fix |
|------|-------|-----|
| 165, 226 | ff.135.3 "Siamo nella singolarità?" duplicato in 2.1.2 | Consolidare in unica reference |
| 175, 208, 228 | ff.129.1 "La singolarità gentile di Altman" TRIPLICATO | Tenere 1, rimuovere 2 |
| 179 | `<span class="fc">💻 ff.50.3` non chiuso, titolo mancante | Completare span con titolo |
| 184 | ff.82.1 span non chiuso | Completare |
| 189 | ff.48.1 span non chiuso | Completare |
| 220 | ff.82.4 span non chiuso | Completare |
| 268 | ff.123.2 span non chiuso | Completare |
| 288 | ff.81.1 span non chiuso | Completare |
| 204,209,306,311,316 | Emoji per ff.82.2, ff.148.1, ff.37.1 da verificare in corpus | Cross-check con data.js |

**8 span aperti senza titolo subchapter — CRITICO**

---

## 3. LINK

| Line | Issue | Fix |
|------|-------|-----|
| 147 | Citazione `[88]` orfana, fonte-88 manca in bibliografia | Aggiungere `<li id="fonte-88">` |
| 332 | `chapter-01-ambiente.html#s2-1` cross-chapter — verificare anchor target esista | Controllare |
| 332 | `chapter-02-robotica.html#s1-1` self-ref oddante (siamo in s1-4) | Verificare intento o correggere |
| 152,155,172 | `https://substack.com/redirect/[UUID]` — short link fragili | Usare URL diretto FF substack |
| 183 | `https://it.frwiki.wiki/wiki/Computronium` — mirror francese non Wikipedia ufficiale | Sostituire con `it.wikipedia.org` |
| 213 | `[79]` href `#fonte-79` OK ma manca `<a id="ref-fonte-79"></a>` davanti | Aggiungere anchor |
| 257 | `generalintuition.com` non verificato | Verificare permanenza |

---

## 4. STILE PROSA

| Lines | Issue | Fix |
|-------|-------|-----|
| 150-151 | "Perché tutto questo hype?" senza transizione formale alla risposta | Aggiungere "La risposta è semplice:" |
| 151-152 | Frase incompleta "...l'1% circa del PIL mondiale" senza punto + new para | Aggiungere punto + paragrafo nuovo |
| 193 | Citazione inglese `"the true horror of ChatGPT"` non tradotta | Tradurre in italiano o aggiungere parentetica |
| 165-166 | Salto brusco singolarità → AI buca sistema | Bridge "Ma la singolarità gentile non è solo teoria astratta..." |
| 216-221 | Sezione 2.1.1 chiusa con affermazione tecnica, manca riflessione FF | Aggiungere "Ma la vera sfida non è il costo: è la consapevolezza di cosa stiamo costruendo" |
| 144 | "Jensen Huang sul palco del COMPUTEX 2025" — verificare corpus per ff.139.1 | Cross-check |
| 257 | Metafora "il chatbot scenda dalla finestra del browser" oddante | Riscrivere "...perché il chatbot agisca nel mondo fisico" |

---

## 5. HIGHLIGHT

| Lines | Count | Status | Fix |
|-------|-------|--------|-----|
| 155 | 1 (CARENTE) | ~150 parole | Aggiungere highlight su "0,19 dollari per kWh" |
| 178-180 | 0 (NULL) | ~200 parole con dati forti | Aggiungere "costo dello sviluppo di farmaci raddoppia ogni anno" + "Ci erano state promesse le macchine volanti, oggi 140 caratteri" |
| 340 | 1 (CARENTE) | ~180 parole | Aggiungere "le regole cellulari che lo generano" |

---

## 6. FOOTNOTE BIDIREZIONALI

| Issue | Fix |
|-------|-----|
| Citazione [88] orfana (riga 147), fonte-88 manca in biblio | Aggiungere fonte ARC-AGI-3 |
| Mix `↩` (raw) e `&#8617;` (entity) nei back-arrow (565-652) | Standardizzare a `&#8617;` |
| Fonti orfane [60, 65] (righe 624, 630) — in biblio ma non citate | Citare nel testo o rimuovere |
| URL Substack fragili (566, 567, 572) | URL diretto FF |
| [79] manca anchor `<a id="ref-fonte-79"></a>` davanti (riga 213) | Aggiungere |

---

## 7. UNIFORMITÀ

| Line | Issue | Fix |
|------|-------|-----|
| 138 | `<h2 id="s1">` per 2.1 — verificare coerenza con metaverso che potrebbe usare `id="s2"` | Standardizzare con chapter-02 main index |
| 138-140 | Heading con `style=` inline invece di classe | Usare `class="accent-bar"` |
| 165 | Citazione diretta senza `<blockquote>` | Wrappare |
| 238 | Figcaption con `&#129504;` non standard, no formato `ff.2 — Title: bridge` | Riscrivere `ff.2 — Mente artificiale: l'AI come nuova unità di misura` |
| 228 | `🕳️` emoji nativa mista ad entity altrove | Normalizzare |
| 236 | `<img>` SENZA alt text — ACCESSIBILITY violation | Aggiungere alt descrittivo |

---

## 8. ALTRO

| Issue | Fix |
|-------|-----|
| L.7 vs L.563: "70 fonti" vs "86 fonti" — conteggio errato | Aggiornare a `86 refs · ~38 min` |
| L.144: COMPUTEX 2025 evento concluso — verificare past tense | "ha presentato" anziché "non ha presentato" |
| L.151: "ff.139.2 Combini e paperclips" — "Combini" troncato? | Cross-check corpus |
| L.140: "L'economia del compute" anglicismo | Verificare se nel corpus FF, altrimenti "calcolo" |
| L.236-240: solo 1 figura in capitolo con 4 sottosezioni | Aggiungere 2-3 figure per 2.1.2/3/4 (candidati ff2.webp, ff81.png, ff85.png) |
| L.257: Westworld pop culture — verificare se nel corpus notes.json | Se non, RULE ZERO violation; rimuovere |
| L.77: link senza title attribute | Aggiungere `title="..."` |
| L.208: mix passive/active voice ("segnala" vs "ha scovato") | Active per coerenza FF |

---

## PRIORITY FIXES

**URGENTE:**
1. **8 span ff.X.Y aperti senza titolo** (linee 179, 184, 189, 220, 268, 279, 288) — CRITICAL
2. Aggiungere fonte [88] mancante in bibliografia
3. Risolvere duplicati ff.135.3 (165, 226) e ff.129.1 (175, 208, 228)

**ALTA:**
4. +3 highlights mancanti (linee 155, 178, 340)
5. Anchor `<a id="ref-fonte-79"></a>` davanti citazione 213
6. Normalizzare emoji entity vs nativa

**MEDIA:**
7. +2-3 figure in 2.1.2-2.1.4
8. Aggiornare metadati: 86 refs invece di 70
9. Cross-check corpus per Westworld, Jensen Huang, COMPUTEX, Combini
