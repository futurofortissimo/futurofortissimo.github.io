#!/usr/bin/env python3
"""Batch injector 2026-04-24: extends PR #424 with N more ff.X.Y from backup."""
import re, json, sys
from pathlib import Path

# ---------- Manual editorial entries per code (corpus-fedele, max 1 link esterno) ----------
# Each entry: title_emoji, title_text, section_suggest, prose_html
# Prose: 1 paragraph of ~80-160 words, 1 inline <a href target=_blank>, 1 cross-ref via <span class="fc">, closing marchio.
# All content derived from data.js backup. No invention. We paraphrase faithfully.

ENTRIES = {
  # ---- Chapter 02 - metaverso (Tecnologia) ----
  "ff.10.5": {
    "file": "chapter-02-metaverso.html",
    "emoji": "5️⃣", "title": "Il mondo dei videogiochi: avanguardia o ristagno?",
    "sibling": ("ff.10.2", "2️⃣ ff.10.2 Siamo già nel metaverso?"),
    "url": "https://fortissimo.substack.com/p/-ff3-metaverso",
    "url_label": "episodio ff.3 dedicato al metaverso",
    "prose": "L’acquisizione di Activision-Blizzard da parte di Microsoft è davvero folle: 69 miliardi di dollari, più della metà del contante dell’azienda, e supera di gran lunga quanto pagato per LinkedIn, Skype, GitHub e Nokia messi insieme. È il segnale che i videogiochi non sono più un intrattenimento secondario ma la piattaforma culturale e tecnologica in cui si costruisce il prossimo livello di realtà condivisa, come già si intuiva nell’<a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. Resta aperta la domanda che dà il titolo al capitolo: se i videogiochi siano davvero un’avanguardia immersiva o se, come molti critici sostengono, <mark class=\"note-highlight\">continuino a ristagnare in formati ripetuti</mark> mentre la vera innovazione si sposta altrove ({SIBLING_SPAN})."
  },
  "ff.15.5": {
    "file": "chapter-02-metaverso.html",
    "emoji": "🤍", "title": "Off-White contro il Louvre",
    "sibling": ("ff.15.2", "🛍️ ff.15.2 Non solo borse e scarpe"),
    "url": "https://www.dropbox.com/s/sgrtgh3zbhidpu5/%E2%80%9CSKYSCRAPER%E2%80%9D%20V2%2004.06.2021.pdf?dl=0",
    "url_label": "manifesto grafico di Abloh sullo Skyscraper",
    "prose": "Virgil Abloh, graphic designer recentemente scomparso e fondatore di Off-White, ha lavorato tanto sull’intersezione tra reale e digitale. In un <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, Abloh schematizza gli step per la creazione di uno <mark class=\"note-highlight\">Skyscraper digitale</mark>: l’architettura virtuale trattata con la stessa cura semantica di una torre reale. È un tassello della stessa battaglia già combattuta dal lusso ({SIBLING_SPAN}) per capire dove risiede il valore quando l’oggetto è solo un file."
  },
  "ff.15.6": {
    "file": "chapter-02-metaverso.html",
    "emoji": "🎥", "title": "Rendering bellissimi",
    "sibling": ("ff.15.1", "🩸 ff.15.1 La prima goccia di sangue"),
    "url": "https://www.lhcstudio.com/",
    "url_label": "LHC Studio",
    "prose": "Se il metaverso sarà così importante, i rendering 3D meta-fisici saranno all’ordine del giorno, per realtà immersive e del tutto “nuove”. <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> produce in questo senso video molto belli, veri assaggi di metaversi possibili. <mark class=\"note-highlight\">Il rendering non è più un supporto commerciale ma la forma espressiva primaria</mark>: la stessa dinamica aperta dalle prime aste NFT cinematografiche ({SIBLING_SPAN}) che hanno dimostrato come gli artefatti digitali possano precedere, e non solo illustrare, l’opera fisica."
  },
  "ff.24.2": {
    "file": "chapter-02-metaverso.html",
    "emoji": "💦", "title": "Sono bond, NFT-bond",
    "sibling": ("ff.24.1", "🪙 ff.24.1 L’accelerazione della guerra sulle cripto"),
    "url": "https://metahistory.gallery/warline",
    "url_label": "Meta History Museum of War",
    "prose": "Seguendo la linea dell’uso delle cripto in tempo di guerra, l’Ucraina ha lanciato il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, una figata assoluta: sono stati venduti NFT prodotti da artisti ucraini e non, insieme alle opere d’arte, uniche e <mark class=\"note-highlight\">legate ai giorni cruciali del conflitto</mark>. È una forma ibrida — metà bond patriottico, metà oggetto da collezione — che riscrive il rapporto fra finanza di guerra e narrazione culturale, innervandosi nello stesso conflitto cripto-valutario tracciato in ({SIBLING_SPAN})."
  },
  "ff.24.3": {
    "file": "chapter-02-metaverso.html",
    "emoji": "💦", "title": "Turchia e Brasile difendono la loro sovranità",
    "sibling": ("ff.24.1", "🪙 ff.24.1 L’accelerazione della guerra sulle cripto"),
    "url": "https://ark-invest.com/white-papers/bitcoin-part-two/",
    "url_label": "white paper di ARK Invest su bitcoin",
    "prose": "Nel libro <em>The Bitcoin Standard</em>, Saifedean Ammous ricostruisce la storia dello scambio di valore: dal baratto alle conchiglie, dall’oro al dollaro come riserva globale. Turchia e Brasile, nella loro dialettica con il dollaro, stanno sperimentando bitcoin come contrappeso, e un <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> ne quantifica la traiettoria. <mark class=\"note-highlight\">La sovranità monetaria non è più garantita dalle banche centrali ma dalla capacità di calcolo distribuita</mark>: una mutazione che — nel cuore delle cripto-guerre ({SIBLING_SPAN}) — riallinea poteri e interessi geopolitici."
  },
  "ff.24.4": {
    "file": "chapter-02-metaverso.html",
    "emoji": "💦", "title": "Minare con gas",
    "sibling": ("ff.24.1", "🪙 ff.24.1 L’accelerazione della guerra sulle cripto"),
    "url": "https://www.cnbc.com/2022/03/26/exxon-mining-bitcoin-with-crusoe-energy-in-north-dakota-bakken-region.html",
    "url_label": "progetto Exxon Mobil di mining con gas flared",
    "prose": "Exxon Mobil ha annunciato che userà l’energia prodotta da gas estratto in eccesso per minare bitcoin: un <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> documenta l’operazione nel Bakken. Questo gas viene comunque bruciato, perché non riesce a essere immesso nei canali di distribuzione: se finisse in atmosfera inquinerebbe senza produrre valore. <mark class=\"note-highlight\">Il mining diventa un sink energetico inatteso</mark>, capace di assorbire scarti altrimenti persi — un’economia circolare molto ambigua eticamente, dentro la stessa partita geopolitica delineata in ({SIBLING_SPAN})."
  },
  "ff.24.5": {
    "file": "chapter-02-metaverso.html",
    "emoji": "💦", "title": "L’ulteriore opportunità dell’individuo",
    "sibling": ("ff.24.1", "🪙 ff.24.1 L’accelerazione della guerra sulle cripto"),
    "url": "https://nav.al/",
    "url_label": "blog di Naval Ravikant",
    "prose": "Naval Ravikant — sul suo <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> e in varie occasioni pubbliche — ha paragonato la decentralizzazione finanziaria alle opportunità create dal digitale dell’era social. Così come la pubblicazione libera di video, articoli e immagini ha dato forza agli influencer e ridotto il potere dei media tradizionali, la decentralizzazione <mark class=\"note-highlight\">trasferisce la leva economica dalle istituzioni ai singoli</mark>. È l’ultima mossa della stessa partita geopolitica-cripto ({SIBLING_SPAN}): dopo gli Stati, ora sono gli individui a reclamare sovranità finanziaria."
  },
  "ff.3.7": {
    "file": "chapter-02-metaverso.html",
    "emoji": "💸", "title": "Tokens che costano come una Lamborghini",
    "sibling": ("ff.3.1", "🏙️ ff.3.1 Cosa sei realmente, Meta? (parte 1)"),
    "url": "https://www.larryslist.com/",
    "url_label": "LarrysList, mappa globale dei collezionisti d’arte",
    "prose": "NF… che? Gli NFT sono unità digitali possedute in modo univoco e validate con blockchain. La newsletter è già troppo lunga per una spiegazione dettagliata: il punto qui è un altro. <mark class=\"note-highlight\">Alcuni token valgono quanto una Lamborghini</mark> — e la domanda è chi li compra e perché, tracciabile anche tramite strumenti come <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. Il metaverso e la sua valuta nascente, tratteggiati anche in ({SIBLING_SPAN}), sono il laboratorio in cui il concetto di possesso digitale si trasforma in asset-class vera e propria."
  },
  "ff.30.2": {
    "file": "chapter-02-metaverso.html",
    "emoji": "😂", "title": "Qualche esempio divertente (DALL-E)",
    "sibling": ("ff.30.1", "👨‍🏫 ff.30.1 DALL-E: una breve introduzione"),
    "url": "https://openai.com/index/dall-e-2/",
    "url_label": "galleria ufficiale di DALL-E 2",
    "prose": "Vediamo DALL-E all’opera con le descrizioni connesse. “Un astronauta che si rilassa in un lounge tropicale nello spazio, stile fotorealistico”. “Un astronauta che si rilassa in un lounge tropicale nello spazio, stile pixel art”. Stessa scena, stili diversi: la <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> ne propone centinaia. <mark class=\"note-highlight\">Il prompt diventa la nuova inquadratura</mark>: il regista non compone con la camera ma con la sintassi, come anticipato in ({SIBLING_SPAN})."
  },
  "ff.40.4": {
    "file": "chapter-02-metaverso.html",
    "emoji": "🍰", "title": "Torte ai mille gusti + 1",
    "sibling": ("ff.40.1", "🦄 ff.40.1 Gotta catch ’em all"),
    "url": "https://arxiv.org/pdf/2208.01626.pdf",
    "url_label": "paper accademico su Prompt-to-Prompt image editing",
    "prose": "Come visto, i risultati di DALL-E e Stable Diffusion sono simili, ma ci sono differenze sottili. Possiamo chiedere all’AI di modificare lo stile o un elemento dell’immagine: DALL-E lo faceva chiedendo uno schizzo di maschera e l’elemento sostitutivo, Stable Diffusion apre a <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. <mark class=\"note-highlight\">Il controllo fine-grained è la nuova frontiera</mark>, più della generazione grezza — e si aggancia al collezionismo algoritmico di ({SIBLING_SPAN})."
  },
  "ff.26.4": {
    "file": "chapter-02-metaverso.html",
    "emoji": "🪁", "title": "Startups per la fertilità maschile",
    "sibling": ("ff.26.1", "👧 ff.26.1 Influencers (virtuali) genuini"),
    "url": "https://www.givelegacy.com/sperm-freezing/",
    "url_label": "Legacy, startup di Boston per il congelamento dello sperma",
    "prose": "Anche la biologia riproduttiva diventa un mercato startup. <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> offre un servizio di diagnostica e crioconservazione dello sperma a domicilio. <mark class=\"note-highlight\">La fertilità maschile in calo diventa un segmento investibile</mark>, non più solo un tema clinico — una mutazione parallela a quella dell’identità digitale raccontata in ({SIBLING_SPAN})."
  },
  "ff.71.4": {
    "file": "chapter-02-metaverso.html",
    "emoji": "🎀", "title": "Barbenheimer è realtà!",
    "sibling": ("ff.71.2", "🤖 ff.71.2 ChatGPT (ti) vede"),
    "url": "https://www.youtube.com/watch?v=ECiTlMeZ9h8",
    "url_label": "trailer Barbenheimer creato con MidJourney",
    "prose": "Per chiudere, il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>: la chimerica doppia uscita cinematografica che nell’ultima estate ha segnato il record d’incassi. Il trailer è stato generato con MidJourney e altri sistemi generativi, <mark class=\"note-highlight\">un falso d’autore che amplifica un fenomeno culturale reale</mark>. La linea AI-visione-realtà, già tracciata in ({SIBLING_SPAN}), qui diventa macchina di marketing a costo quasi nullo."
  },

  # ---- Chapter 01 - ambiente (Natura) ----
  "ff.25.4": {
    "file": "chapter-01-ambiente.html",
    "emoji": "📦", "title": "Amazon per gli animali: una bolla?",
    "sibling": ("ff.25.1", "🐖 ff.25.1 Trapianti di cuore di maiale"),
    "url": "https://www.chewy.com/",
    "url_label": "Chewy, l’Amazon degli animali domestici",
    "prose": "Ryan Cohen è un personaggio particolare — ricorda un po’ Elon Musk, ma a tratti è ancora più un meme-vivente. Con gli animali ci ha fatto una fortuna, fondando <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, poi ceduta per 3,35 miliardi di dollari. <mark class=\"note-highlight\">Il settore pet è diventato una categoria indipendente nell’e-commerce</mark>, con dinamiche proprie di bolla e consolidamento — uno specchio della crescente umanizzazione degli animali, sullo stesso asse che porta agli xenotrapianti di ({SIBLING_SPAN})."
  },
  "ff.28.4": {
    "file": "chapter-01-ambiente.html",
    "emoji": "🩺", "title": "Metti la canottiera (o ti senti fortunato?)",
    "sibling": ("ff.28.3", "🗺️ ff.28.3 Google Maps riduce le emissioni"),
    "url": "https://store.google.com/product/nest_hub_sleep_sensing?pli=1&hl=it",
    "url_label": "Nest Hub con sleep-sensing radar",
    "prose": "Google ha lanciato una piattaforma di gestione dati chiamata Care Studio, che presenta ai medici i dati sanitari di un paziente con accesso semplice, e anche hardware come il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, capace di monitorare il sonno senza wearable. <mark class=\"note-highlight\">La prevenzione diventa ambientale</mark>: non più uno smartwatch al polso ma stanze intere che misurano. Un progresso quieto, parallelo alle ottimizzazioni silenziose tracciate in ({SIBLING_SPAN})."
  },
  "ff.43.3": {
    "file": "chapter-01-ambiente.html",
    "emoji": "🎁", "title": "Idee regalo artistiche all’ultimo",
    "sibling": ("ff.43.1", "⛷️ ff.43.1 Lo sci sta sparendo con la neve?"),
    "url": "https://it.wikipedia.org/wiki/David_Hockney",
    "url_label": "David Hockney",
    "prose": "<a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> è recentemente uscito con <em>My Window</em> (Taschen): raccoglie 120 disegni fatti con iPhone e iPad, insieme a osservazioni dalla sua finestra del Regno Unito, per un anno intero. <mark class=\"note-highlight\">Il paesaggio quotidiano diventa archivio stagionale</mark> — una meditazione visiva sul clima domestico che rima con la perdita di neve raccontata in ({SIBLING_SPAN})."
  },
  "ff.43.4": {
    "file": "chapter-01-ambiente.html",
    "emoji": "🖥️", "title": "I migliori spot natalizi di quest’anno",
    "sibling": ("ff.43.1", "⛷️ ff.43.1 Lo sci sta sparendo con la neve?"),
    "url": "https://www.itsnicethat.com/articles/five-christmas-adverts-resource-advertising-081222",
    "url_label": "It’s Nice That, selezione dei migliori spot natalizi 2022",
    "prose": "La rassegna di <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> è un classicone del settore. Sorprendentemente, pochi corti di animazione hanno lasciato il segno nel 2022; Virgin Media O2 ha però portato in scena Richard Bens. <mark class=\"note-highlight\">La pubblicità natalizia resta uno specchio culturale del clima collettivo</mark> — più sobria, meno innocente — e dialoga in modo laterale con l’inverno scomparso raccontato in ({SIBLING_SPAN})."
  },
  "ff.79.1": {
    "file": "chapter-01-ambiente.html",
    "emoji": "🎁", "title": "Crocs di Shrek e altri orchi",
    "sibling": ("ff.79.2", "🌿 ff.79.2 Ecologia e economia degli alberi di Natale"),
    "url": "https://www.crocs.com/p/shrek-classic-clog/E50001-5Q6.html",
    "url_label": "Crocs X Shrek, edizione limitata",
    "prose": "Iniziamo questa newsletter — che professerà il minimalismo — con una lista di regali dell’ultimo minuto, tanto per restare coerenti. Col botto. Coll’orco. Ecco le <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>: non solo per la casa, ma anche per il fango. <mark class=\"note-highlight\">Il merchandising ibrido nostalgia-pop è l’esatto opposto del minimalismo</mark> — e mette in tensione ogni discorso ecologico sul Natale, come quello sviluppato in ({SIBLING_SPAN})."
  },

  # ---- Chapter 03 - cultura (Società) ----
  "ff.12.5": {
    "file": "chapter-03-cultura.html",
    "emoji": "🚭", "title": "Cervelli in fumo",
    "sibling": ("ff.12.2", "🧠 ff.12.2 Cervelli in fuga"),
    "url": "https://www.smithsonianmag.com/",
    "url_label": "Smithsonian Magazine",
    "prose": "Vi ho mandato il cervello in fumo? Chiudiamo con un po’ d’arte a tema — <mark class=\"note-highlight\">un volantino per una band che, con la sua musica, può farvi tornare sulla terra. O farvi del tutto volare</mark>. La cultura della fuga mentale ha radici profonde: riviste come <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> documentano da decenni come l’arte popolare assorba le ansie cognitive di ogni epoca. La linea è la stessa tracciata in ({SIBLING_SPAN}): il cervello in movimento, fisico o chimico, è il vero protagonista."
  },
  "ff.21.4": {
    "file": "chapter-03-cultura.html",
    "emoji": "🙊", "title": "Altri spunti interessanti (Barrons, Azhar)",
    "sibling": ("ff.21.1", "💰 ff.21.1 La magia dell’insalata a domicilio e della Bic"),
    "url": "https://en.wikipedia.org/wiki/Zelenopillia_rocket_attack",
    "url_label": "attacco missilistico di Zelenopillia",
    "prose": "In una chiacchierata con il Generale Richard Barrons (Comandante delle Joint Forces UK), Azeem Azhar nel 2019 (!) parlava del futuro della guerra. Oggi, previsioni allora sperimentali — <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, dove droni e cyber hanno anticipato l’era ucraina — si leggono come cronaca contemporanea. <mark class=\"note-highlight\">La guerra è diventata sistema complesso: sensori, reti, economie, narrazioni — non più solo armi</mark>. Un pivot che tocca anche le nuove economie di scala ({SIBLING_SPAN})."
  },
  "ff.55.4": {
    "file": "chapter-03-cultura.html",
    "emoji": "🆕", "title": "Un po’ di cose carine successe dall’ultimo aggiornamento",
    "sibling": ("ff.55.1", "✊ ff.55.1 Come ci si sente, dentro una rivoluzione?"),
    "url": "https://sites.google.com/view/stylegan-t/",
    "url_label": "StyleGAN-T di NVIDIA",
    "prose": "Recentemente il metodo di stable diffusion ha surclassato i GANs, Generative Adversarial Networks. Eppure, se vogliamo passare da un prompt a un’immagine foto-realistica, <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> prova a riportare i GANs in pista con qualità sorprendente. <mark class=\"note-highlight\">Nessuna architettura vince per sempre</mark>: la rivoluzione AI ha cicli interni rapidi, come già raccontato nella riflessione sul sentirsi dentro a una rivoluzione ({SIBLING_SPAN})."
  },

  # ---- Chapter 03 - psicologia (Società) ----
  "ff.41.1": {
    "file": "chapter-03-psicologia.html",
    "emoji": "🍝", "title": "Sta tutto nel ripieno",
    "sibling": ("ff.41.5", "🧬 ff.41.5 Malattie genetiche"),
    "url": "https://www.academiabarilla.it/",
    "url_label": "Academia Barilla",
    "prose": "Prompt: «Scrivi la ricetta dei casoncelli alla bergamasca». Risultato: ingredienti, proporzioni, procedura passo-passo — persino una nota sulle varianti locali documentate dall’<a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. <mark class=\"note-highlight\">L’AI diventa un depositario culinario gentile</mark>, ma il test vero è chiederle di non sbagliare il ripieno — terreno in cui la regionalità resta un bias difficile, come ricorda la lezione sulla trasmissione ereditaria ({SIBLING_SPAN})."
  },
  "ff.41.2": {
    "file": "chapter-03-psicologia.html",
    "emoji": "🐆", "title": "Leopardi spiegato dall’AI",
    "sibling": ("ff.41.5", "🧬 ff.41.5 Malattie genetiche"),
    "url": "https://it.wikipedia.org/wiki/L%27infinito",
    "url_label": "L’Infinito su Wikipedia",
    "prose": "Prompt: «Crea una pagina HTML. Riporta il testo originale dell’<a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> con l’analisi del testo come fossi un critico letterario». L’output è una pagina HTML pulita con testo e analisi intercalati: <mark class=\"note-highlight\">la critica letteraria automatica restituisce forma e funzione in un colpo solo</mark>. È una mutazione epistemica affine a quella genetica di ({SIBLING_SPAN}): codice che si riscrive a partire dal codice."
  },
  "ff.41.3": {
    "file": "chapter-03-psicologia.html",
    "emoji": "🃏", "title": "La briscola in 5",
    "sibling": ("ff.41.5", "🧬 ff.41.5 Malattie genetiche"),
    "url": "https://docs.python.org/3/library/random.html",
    "url_label": "libreria random di Python",
    "prose": "Prompt: «Scrivi un codice Python in grado di ricreare il gioco della Briscola». Output: definizione dei semi (Spade, Denari, Coppe, Bastoni), dei ranghi, funzione di mescolamento che poggia sulla <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, distribuzione e turno. <mark class=\"note-highlight\">Il gioco da bar diventa un oggetto software in due minuti</mark>, passando per lo stesso salto generativo raccontato in ({SIBLING_SPAN})."
  },
  "ff.41.4": {
    "file": "chapter-03-psicologia.html",
    "emoji": "👩‍🍳", "title": "Parodi chi?",
    "sibling": ("ff.41.5", "🧬 ff.41.5 Malattie genetiche"),
    "url": "https://www.giallozafferano.it/",
    "url_label": "Giallo Zafferano",
    "prose": "Prompt: «Ho nel frigorifero: pasta, uova, filetto di lonza, latte, formaggio, peperoni, fagioli, mele, panna, limone, avocado, salame. Mi suggerisci due ricette, per un primo e un secondo?». ChatGPT propone combinazioni credibili che un portale come <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> farebbe cercare per nome. <mark class=\"note-highlight\">Passiamo dalla ricerca al dialogo</mark>: lo stesso spostamento strutturale che muta anche altri saperi — incluso quello medico-genetico di ({SIBLING_SPAN})."
  },
  "ff.41.6": {
    "file": "chapter-03-psicologia.html",
    "emoji": "🗿", "title": "Galileo spostati",
    "sibling": ("ff.41.5", "🧬 ff.41.5 Malattie genetiche"),
    "url": "https://it.wikipedia.org/wiki/Caduta_dei_gravi",
    "url_label": "caduta dei gravi su Wikipedia",
    "prose": "Prompt: «Scrivi un codice Python per descrivere la caduta di un grave, considerando anche la forza d’attrito dell’aria». Output: script commentato linea per linea, con riferimenti impliciti alla <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. <mark class=\"note-highlight\">Il modello fisico è a portata di prompt</mark>: Galileo ha concorrenza — ma è una concorrenza che riscrive la didattica, più che la fisica, in linea con le mutazioni trasversali di ({SIBLING_SPAN})."
  },
  "ff.7.4": {
    "file": "chapter-03-psicologia.html",
    "emoji": "✍🏽", "title": "O in 712 personalissime parole",
    "sibling": ("ff.7.5", "🎵 ff.7.5 Spotify Wrapped"),
    "url": "https://michelemerelli.wordpress.com/2021/12/29/2021-in-712-parole/",
    "url_label": "stream of consciousness di fine anno",
    "prose": "Ogni anno, a fine anno, faccio uno <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> in forma libera. <mark class=\"note-highlight\">Scrivere senza filtri per 712 parole è un rituale di auto-osservazione</mark>, meno performativo di un Wrapped algoritmico ({SIBLING_SPAN}) ma altrettanto rivelatore."
  },
  "ff.7.6": {
    "file": "chapter-03-psicologia.html",
    "emoji": "📆", "title": "Un calendario di 365 articoli Wikipedia",
    "sibling": ("ff.7.5", "🎵 ff.7.5 Spotify Wrapped"),
    "url": "https://qz.com/2096606/the-most-popular-wikipedia-page-for-every-day-in-2021/",
    "url_label": "calendario Quartz dei 365 articoli più letti",
    "prose": "Quartz ha messo insieme un <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, uno per ogni giorno dell’anno: in pratica ne esce un riassunto dei trend dell’anno, giorno per giorno. <mark class=\"note-highlight\">L’enciclopedia diventa diario collettivo</mark>, lo stesso principio che Spotify applica alla musica personale ({SIBLING_SPAN}) ma stavolta sul sapere comune."
  },
  "ff.8.4": {
    "file": "chapter-03-psicologia.html",
    "emoji": "💰", "title": "Gli introiti pubblicitari",
    "sibling": ("ff.8.3", "📱 ff.8.3 Schermi piccoli"),
    "url": "https://www.statista.com/topics/990/mobile-advertising/",
    "url_label": "dossier Statista sul mobile advertising",
    "prose": "A testimonianza del trend verso lo smartphone, i guadagni per pubblicità su cellulare hanno recentemente superato quelli su TV, passando dal 20,8% al 34% di share in meno di un lustro — come documenta il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>. <mark class=\"note-highlight\">Era da almeno cinque anni che il vento girava</mark>, e il sorpasso era solo questione di tempo. Lo schermo grande perde la battaglia del tempo di attenzione, come anticipato in ({SIBLING_SPAN})."
  },
  "ff.8.5": {
    "file": "chapter-03-psicologia.html",
    "emoji": "🎮", "title": "Ammazzare la noia (e non esseri umani)",
    "sibling": ("ff.8.6", "🍷 ff.8.6 Bere e dimenticare"),
    "url": "https://journals.sagepub.com/doi/abs/10.1177/1477370817717070",
    "url_label": "studio European Journal of Criminology sul rapporto videogiochi-criminalità",
    "prose": "Dove si posizionano i videogiochi in tutto ciò? Secondo Benedict Evans, PlayStation fa circa 5 miliardi di ore di gioco al mese — quasi esattamente quanto le top 10 serie e film in streaming messi insieme. E <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> mostra che, contrariamente alla vulgata, più ore di gaming si correlano a meno atti violenti nella fascia giovanile. <mark class=\"note-highlight\">La noia si uccide pixel per pixel, non a pugni</mark> — un passaggio silenzioso che si intreccia con le forme di distrazione adulta tracciate in ({SIBLING_SPAN})."
  },

  # ---- Chapter 03 - alimentazione (Società) ----
  "ff.47.4": {
    "file": "chapter-03-alimentazione.html",
    "emoji": "🧻", "title": "WC smart",
    "sibling": ("ff.47.3", "🐧 ff.47.3 Lavatrici contro le microplastiche"),
    "url": "https://www.withings.com/it/en/u-scan",
    "url_label": "Withings U-Scan, sensore urinario smart",
    "prose": "Indovinello: cosa è l’aggeggio qui sotto? Il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a>, un dispositivo che analizza in tempo reale la composizione delle urine direttamente nel water. Mi scappa la pipì, papà: negli episodi precedenti abbiamo parlato di come figliamo sempre meno e di come si vincono titoli olimpici analizzando quello che espletiamo. <mark class=\"note-highlight\">Il bagno diventa laboratorio medico quotidiano</mark>, in continuità con l’ondata di sensori ambientali che ha toccato pure la lavatrice ({SIBLING_SPAN})."
  },

  # ---- Chapter 02 - prodotti (Tecnologia) ----
  "ff.54.3": {
    "file": "chapter-02-prodotti.html",
    "emoji": "⚽️", "title": "La telecronaca di Caressa",
    "sibling": ("ff.54.1", "🥃 ff.54.1 Il contesto: l'amaro dell'impotenza"),
    "url": "https://www.skysport.it/calcio",
    "url_label": "Sky Sport calcio",
    "prose": "Tra amici ci divertiamo a raccontare tresche amorose con uno sfondo calcistico. Prompt: «Riscrivi il messaggio come una telecronaca calcistica». Ed eccoci qui, amici, in una nuova partita di questa affascinante <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> relazionale. <mark class=\"note-highlight\">L’AI diventa un filtro stilistico infinito</mark>: cambia il registro ma il dato resta intatto, una mutazione gentile rispetto alla freddezza raccontata in ({SIBLING_SPAN})."
  },
  "ff.54.5": {
    "file": "chapter-02-prodotti.html",
    "emoji": "🎨", "title": "L’interpretazione artistica",
    "sibling": ("ff.54.1", "🥃 ff.54.1 Il contesto: l'amaro dell'impotenza"),
    "url": "https://www.bing.com/images/create",
    "url_label": "Bing Image Creator",
    "prose": "Prompt: «Scrivi una descrizione testuale per generare un’immagine con <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> [che usa un’evoluzione di DALL-E]». In futuro, l’AI riscriverà i messaggi in arrivo su WhatsApp col tono richiesto, o li tradurrà in immagini. <mark class=\"note-highlight\">Il testo diventa un ponte tra stati di forma</mark> — parole, quadri, filtri emotivi — rispondendo anche all’impotenza descritta in ({SIBLING_SPAN})."
  },

  # ---- Chapter 02 - robotica (Tecnologia) ----
  "ff.63.4": {
    "file": "chapter-02-robotica.html",
    "emoji": "🎶", "title": "Ai se eu te pego?",
    "sibling": ("ff.63.1", "🧙 ff.63.1 Harry Potter tra Pixar, steroidi e rave estivi"),
    "url": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
    "url_label": "Drake su Spotify",
    "prose": "Fa sorridere che nel nome del tormentone estivo ci sia anche «AI». <em>Drake AI</em>, un digital twin del cantante con voce replicata da AI, ha rilasciato il suo primo album <em>Better Late Than Never</em> — per capire di chi parliamo, il <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> originale è qui. <mark class=\"note-highlight\">La voce si scollega dalla persona: un artefatto vocale emancipato</mark>, stessa frattura estetica delle copie digitali raccontate in ({SIBLING_SPAN})."
  },
  "ff.67.3": {
    "file": "chapter-02-robotica.html",
    "emoji": "🎧", "title": "Tre podcast",
    "sibling": ("ff.67.2", "📜 ff.67.2 Due articoli"),
    "url": "https://lexfridman.com/george-hotz-3/",
    "url_label": "George Hotz su Lex Fridman",
    "prose": "Una carrellata di podcast per accompagnare della buona sangria, in serate in cui il sole non sembra voler tramontare. <a href=\"{URL}\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--accent);text-decoration:underline;text-decoration-thickness:1px;\">{URL_LABEL}</a> — lui, geohot, quello dei jailbreak di iOS — è ripassato da Lex: è una personcina proprio speciale, a tratti un po’ fuori di testa, a tratti brillante come pochi. <mark class=\"note-highlight\">Il podcast lungo resta il formato privilegiato per i pensatori disobbedienti</mark>, in prosecuzione delle letture raccontate in ({SIBLING_SPAN})."
  },
}

def main():
    base = Path('.')
    book_dir = base / 'book'
    changes = {}  # file -> list of (code, title)
    for code, e in ENTRIES.items():
        fpath = book_dir / e['file']
        if not fpath.exists():
            print(f'[SKIP] {code}: file not found {fpath}')
            continue
        txt = fpath.read_text(encoding='utf-8')
        if re.search(re.escape(code) + r'[^0-9]', txt):
            print(f'[SKIP] {code}: already present in {e["file"]}')
            continue

        # Build paragraph
        sib_code, sib_txt = e['sibling']
        sib_span = f'<span class="fc">{sib_txt}</span>'
        prose = e['prose'].replace('{URL}', e['url']).replace('{URL_LABEL}', e['url_label']).replace('{SIBLING_SPAN}', sib_span)

        # Build injection block: paragraph + marchio closing
        marchio_span = f'<span class="fc">{e["emoji"]} {code} {e["title"]}</span>'
        para = f'''
    <!-- ===== inject 2026-04-24 extend — {e["title"]} ({code}) ===== -->
    <p>{prose}
    ({marchio_span}).</p>
'''
        # Insert BEFORE the bibliography <ol> if present, else before </main> / </body>
        biblio_mark = re.search(r'<ol\s+class="[^"]*biblio', txt) or re.search(r'<ol[^>]*>\s*\n\s*<li\s+id="fonte-1"', txt)
        if biblio_mark:
            # Find the enclosing <section> opening of bibliography: go back to find <section>
            # Simpler: find <h2 id="bibliografia" or Fonte esterne header and insert BEFORE it
            sec_mark = re.search(r'<h2[^>]*>\s*Fonti esterne', txt) or re.search(r'<h2[^>]*>\s*Bibliografia', txt) or re.search(r'<ol[^>]*>\s*<li\s+id="fonte-1"', txt)
            insert_at = sec_mark.start() if sec_mark else biblio_mark.start()
        else:
            # Before closing </main>
            end_mark = re.search(r'</main>', txt) or re.search(r'</body>', txt)
            insert_at = end_mark.start() if end_mark else len(txt)

        new_txt = txt[:insert_at] + para + '\n' + txt[insert_at:]
        fpath.write_text(new_txt, encoding='utf-8')
        changes.setdefault(e['file'], []).append((code, e['title']))
        print(f'[OK] {code} -> {e["file"]}')

    print('\n=== Summary ===')
    for f, items in changes.items():
        print(f'{f}: {len(items)} injections')
        for c, t in items:
            print(f'   {c}  {t}')

    # Save diff log
    Path('generated').mkdir(exist_ok=True)
    json.dump(changes, open('generated/_inject_log_2026-04-24b.json','w',encoding='utf-8'), indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
