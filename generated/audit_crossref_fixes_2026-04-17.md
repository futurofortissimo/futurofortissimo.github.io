# Audit Cross-ref Fixes — 2026-04-17

Branch: `ff-book/audit-fixes-plus-10x10`

Audit segnalò 7 ff.X.Y come "weak cross-ref" (shared tokens 0–2, ratio ≤0.04). Analisi caso-per-caso contro il `content` in `data.js`.

## Esito

| # | ff.X.Y | File | Line | Decisione | Motivazione |
|---|--------|------|------|-----------|-------------|
| 1 | `ff.135.3` | chapter-02-robotica.html | 161 | **KEEP** | Il paragrafo cita Alex Wissner-Gross e "asintoto verticale" / singolarità — match diretto col `content` del subchapter originale ♾️ ff.135.3 "Siamo nella singolarità?". Il false-positive dell'audit nasce dalla collisione di chiavi in `data.js`: esistono due sottocapitoli distinti con codice `ff.135.3` (issue 135a "Le onde anomale del progresso" e issue 135b "Casino Royale"). L'audit ha indicizzato solo il secondo ("🎲 Scommesse da Nobel"), perdendo il riferimento editorialmente corretto. |
| 2 | `ff.135.3` | chapter-02-robotica.html | 222 | **KEEP** | Stesso caso sopra. Paragrafo su GPT-5 Pro, FrontierMath Livello 4, Gemini Deep Think, Wissner-Gross e singolarità — match diretto col `content` "Siamo nella singolarità?" del primo ff.135.3. |
| 3 | `ff.135.4` | chapter-02-robotica.html | 169 | **KEEP** | Paragrafo su Wang Yu, "watt-to-bit", ARC Prize, AI Conference Shanghai, caffè/GPU cinesi — match perfetto col `content` ☕ ff.135.4 "L'AGI avanza: il caffè cinese". False-positive da collisione con la seconda ff.135.4 "America, Nigeria e criptovalute". |
| 4 | `ff.135.4` | chapter-02-metaverso.html | 286 | **KEEP** | Paragrafo sul debito USA al 6% cinese/nipponico, Nigeria/Argentina compratori di USDT, stablecoin — match perfetto con la SECONDA ff.135.4 💳 "America, Nigeria e criptovalute". |
| 5 | `ff.95.3` | chapter-02-metaverso.html | 209 | **KEEP** | Paragrafo su NFT LV, Nike/Adidas e "problema dell'interoperabilità" — match col `content` 🔑 ff.95.3 "La proprietà privata digitale" (Chris Dixon, web3, proprietà digitale decentralizzata). |
| 6 | `ff.2.2` | chapter-02-robotica.html | 167 | **KEEP** | Paragrafo su M6 Alibaba, 10 trilioni di parametri, 1% consumo energetico di GPT-3, 512 GPU — match testuale diretto col `content` 🇨🇳 ff.2.2 "Alibaba e l'alternativa efficiente". |
| 7 | `ff.88.2` | chapter-02-robotica.html | 290 | **KEEP** | Paragrafo su "robot controllati da LLM… braccio robotico guidato da un modello linguistico" — match tematico col `content` 🤖 ff.88.2 "ChatGPT controlla un robot" (FigureAI, robot autonomo guidato da GPT). Esempio specifico diverso (MIT vs FigureAI) ma tesi identica. |
| 8 | `ff.44.2` | chapter-03-psicologia.html | 497 | **KEEP** | Paragrafo su "flusso di infinite alternative, side-hustle e relazioni che il mondo digitale propone, veloci come swipe su Tinder" — match perfetto col `content` ♾️ ff.44.2 "L'infinitudine là fuori" (TikTok/feed infinite/Burkeman/Heidegger). |
| 9 | `ff.48.1` | chapter-03-psicologia.html | 365 | **REMOVE** | Paragrafo su Packy McCormick (Not Boring), Balaji Srinivasan, tecnologia positiva, Imran Chaudhri. Il `content` di 🗣️ ff.48.1 "Tutti parlano di ChatGPT" (1M utenti in 5 giorni, OpenAI, Ferrari, playground) è tangenziale. Rimosso — il cross-ref companion ff.59.3 "L'importanza di raccontare storie positive" copre già perfettamente la tesi del paragrafo. |

## Riepilogo

- **Sostituiti:** 0
- **Rimossi:** 1 (`ff.48.1` @ chapter-03-psicologia.html:365)
- **Mantenuti:** 8

## Note tecnica

6 degli 8 "mantenuti" erano false-positive dovuti a una **collisione di chiavi nel corpus**: `data.js` contiene 2 sottocapitoli distinti per ognuno dei codici `ff.135.3` e `ff.135.4` (pubblicati in newsletter diverse della stessa numerazione). Lo script di audit (`generated/_audit_script.cjs`) indicizza solo l'ultima occorrenza, perdendo il contesto editoriale reale. Raccomandazione futura: upgrade dello script audit per gestire chiavi multiple (es. disambiguazione per issue URL o emoji) prima di flaggare come "weak cross-ref".

## Artefatti

- `book/chapter-03-psicologia.html` — rimosso 1 cross-ref a `ff.48.1`
- Nessun'altra modifica applicata ai capitoli.
