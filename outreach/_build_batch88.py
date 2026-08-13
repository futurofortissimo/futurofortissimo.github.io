# -*- coding: utf-8 -*-
"""FF outreach batch 88 — build CSV + MD + merge tracker."""
import json, csv, shutil, os

DATE = "2026-07-28"
BATCH = 88
START_ID = 1497
TRACKER = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json"
BACKUP  = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b88.json"
OUTDIR  = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach"
FFIDX   = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach/_ffidx_b88.json"
CTA = "Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com"

FF = json.load(open(FFIDX, encoding="utf-8"))

R = []
def add(**k):
    # fidelity guard: ff code must exist in data.js index
    assert k["ffcode"] in FF, "ff code non presente in data.js: " + k["ffcode"]
    k["ff_title"] = FF[k["ffcode"]]["title"]
    k["ff_url"] = FF[k["ffcode"]]["link"]
    R.append(k)

# ---------------------------------------------------------------- 1 P1
add(first="Piero", last="Ercoli", role="Executive Director, Decarbonization Unit", company="Snam", city="Milano/San Donato Milanese",
 linkedin="https://www.linkedin.com/in/pieroercoli/", domain="snam.it", website="https://www.snam.it", priority="P1",
 emails=["piero.ercoli@snam.it"], ffcode="ff.16.3",
 focus="CCS e idrogeno, economia della decarbonizzazione",
 source_url="https://www.snam.it/en/we-snam/about-us/management-and-company-structure/piero-ercoli.html",
 message="""Ciao Piero,

guidi la Decarbonization Unit di Snam, quindi CCS e idrogeno: due tecnologie il cui destino dipende meno dalla fisica e più dal prezzo che il mercato attribuisce a una tonnellata di CO2 evitata.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

⚫ ff.16.3 Il mercato (nero) della CO2 — il prezzo della CO2 oggi va da 7 dollari a tonnellata in Cina a oltre 150 in Svezia, con l'area europea intorno ai 75. McKinsey stima che una tassazione ad almeno 50 euro a tonnellata sbloccherebbe un ulteriore 21% del capitale necessario alla transizione, sopra il 40% già bancabile; a 100 euro si arriverebbe oltre l'80% delle spese in conto capitale con un business case autonomo. C'è poi il capitolo delle emissioni "evitate", dove i crediti nascono da ciò che un'azienda avrebbe potuto emettere e non ha emesso.

La domanda che ti giro: nei progetti di stoccaggio che segui, quanto pesa oggi il segnale di prezzo europeo rispetto agli schemi di sussidio diretto?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 2 P1
add(first="Enrico Maria", last="Carlini", role="Director, Grid Planning, Interconnections and Permitting", company="Terna", city="Roma",
 linkedin="https://www.linkedin.com/in/enrico-maria-carlini-69674167/", domain="terna.it", website="https://www.terna.it", priority="P1",
 emails=["enrico.carlini@terna.it","enricomaria.carlini@terna.it"], ffcode="ff.149.3",
 focus="pianificazione di rete, interconnessioni, permitting",
 source_url="https://cerre.eu/biographies/enrico-carlini/",
 message="""Ciao Enrico,

in Terna hai la responsabilità di pianificazione della rete, interconnessioni e permitting: il punto esatto in cui la crescita delle rinnovabili smette di essere una notizia e diventa un problema di dispacciamento e di autorizzazioni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto in tema:

🃏 ff.149.3 Texas hold 'em — in Texas, simbolo storico del petrolio americano, nel 2025 la produzione solare è cresciuta del 40%, con un picco di 7 TWh ad agosto. A marzo 2026 le rinnovabili coprivano il 70% dell'elettricità texana, con 15 GW che arrivano dal vento a compensare le ore senza sole. E il resto del mondo segue: le principali aziende cinesi hanno contribuito con oltre 125 GW di eolico, di cui circa 25 fuori dalla Cina.

La domanda che ti giro: in uno scenario del genere, il collo di bottiglia italiano dei prossimi anni sta più nei tempi di permitting o nella capacità di accumulo che rende quella quota dispacciabile?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 3 P1
add(first="Gian Fausto", last="Navoni", role="Head of Strategy and Development", company="A2A", city="Milano",
 linkedin="https://www.linkedin.com/in/gfn01/", domain="a2a.eu", website="https://www.gruppoa2a.it", priority="P1",
 emails=["gianfausto.navoni@a2a.eu","gian.navoni@a2a.eu"], ffcode="ff.82.2",
 focus="strategia e sviluppo, data center e domanda elettrica",
 source_url="https://www.netzeromilan.com/en/conference/netzero-verticals-2025/speaker-vertical-conference.html",
 message="""Ciao Gian Fausto,

segui strategia e sviluppo in A2A e sui tuoi post torni spesso sul nodo data center, sostenibilità e transizione digitale: la nuova domanda elettrica che arriva mentre la rete sta già cambiando pelle.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

🐔 ff.82.2 Polli computazionali — i data center stanno diventando la nuova corsa agli armamenti, con la stessa logica di ostentazione delle trincee e dei razzi. Si diffondono modelli più piccoli ed efficienti, tipo Mistral, con risultati paragonabili ai Golia GPT-4 e Gemini; però al crescere dei parametri e della potenza di calcolo i risultati continuano a migliorare. È raro avere una tecnologia che migliora semplicemente allocando più risorse: l'eolico e i motori a scoppio hanno curve di innovazione "a S" che a un certo punto si appiattiscono.

La domanda che ti giro: nella pianificazione A2A la domanda dei data center entra come carico prevedibile o come variabile ancora troppo volatile per dimensionarci sopra gli asset?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 4 P1
add(first="Patricia", last="Gentile", role="Group Head of Finance & Insurance", company="A2A", city="Milano",
 linkedin="https://it.linkedin.com/in/patricia-gentile-mba-a8517a34", domain="a2a.eu", website="https://www.gruppoa2a.it", priority="P1",
 emails=["patricia.gentile@a2a.eu"], ffcode="ff.88.1",
 focus="finanza sostenibile, green bond, copertura del rischio",
 source_url="https://www.luxse.com/blog/Sustainable-Finance/A2A-EUGB",
 message="""Ciao Patricia,

guidi finanza e assicurazioni di gruppo in A2A, che tra le prime al mondo ha emesso sotto lo standard European Green Bond: un mestiere in cui il costo del capitale e la narrativa di mercato si toccano continuamente.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e finanza. Ti lascio uno spunto in tema:

🧩 ff.88.1 Una bolla finanziaria? — quando la finanza diventa argomento da parrucchiere è di solito tempo di vendere. Il prezzo di NVIDIA è partito su un trend esponenziale che assomiglia in modo sospetto a quello delle emissioni di CO2; dietro c'è l'addestramento degli LLM sulle sue GPU. Il dettaglio che complica la lettura: negli ultimi tre anni i ricavi sono cresciuti in modo reale, triplicando solo nell'ultimo anno, e rispetto alla bolla dot-com il settore tecnologico quota con uno sconto di circa il 50%.

La domanda che ti giro: quando finanzi asset con vita utile di trent'anni, quanto pesa nelle tue valutazioni la volatilità delle aspettative tech rispetto a quella regolatoria?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 5 P1
add(first="Marina", last="Foti", role="Head of Advanced Technology Development, R&D e Technology Transfer", company="3SUN (Enel Group)", city="Catania",
 linkedin="https://www.linkedin.com/in/marina-foti-41060b1a/", domain="enel.com", website="https://www.3sun.com", priority="P1",
 emails=["marina.foti@enel.com","marina.foti@3sun.com"], ffcode="ff.42.1",
 focus="celle fotovoltaiche ad alta efficienza, filiera europea del solare",
 source_url="https://www.3sun.com/en/search-news/news/2024/06/3SUN-part-of-the-ETIP-PV-steering-committee-with-Marina-Foti",
 message="""Ciao Marina,

guidi lo sviluppo tecnologico avanzato in 3SUN e siedi nello steering committee di ETIP PV: la Gigafactory di Catania è uno dei pochi tentativi seri di riportare in Europa una filiera fotovoltaica che oggi vive quasi tutta altrove.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto in tema:

⛏️ ff.42.1 Minerali preziosi? — la Cina controlla l'80% della produzione di pannelli solari e dell'estrazione e raffinazione del litio. Il punto interessante è che questa supremazia dipende poco dalla capacità mineraria: pesa molto di più il monopolio sul raffinamento chimico, l'80% della produzione, e sulla fase finale di costruzione delle celle al litio, il 73%. Sul solare installato il confronto resta impietoso: 307 GW cinesi contro 95 GW statunitensi, con un PIL pro capite cinque volte inferiore.

La domanda che ti giro: dal tuo osservatorio, il vantaggio recuperabile in Europa sta più nell'efficienza di cella o nella capacità di industrializzare velocemente ciò che il laboratorio dimostra?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 6 P1
add(first="Marco", last="Frattini", role="Head of B2B Retail Italia", company="Enel", city="Roma",
 linkedin="https://www.linkedin.com/in/marco-frattini/", domain="enel.com", website="https://www.enel.it", priority="P1",
 emails=["marco.frattini@enel.com"], ffcode="ff.70.4",
 focus="elettrificazione delle imprese, autoproduzione, efficienza",
 source_url="https://www.netzeromilan.com/en/conference/netzero-verticals-2025/speaker-vertical-conference.html",
 message="""Ciao Marco,

guidi il B2B retail di Enel in Italia, quindi passi le giornate a spiegare alle imprese perché elettrificare conviene prima ancora che sia obbligatorio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto in tema:

☎️ ff.70.4 Energia, TVTTTBXS — ricordi quando avevamo 100 SMS al giorno e oggi abbiamo giga praticamente illimitati? All'energia potrebbe succedere lo stesso: se catena manifatturiera e trasporti vengono elettrificati, tutto costa molto meno, e ricorderemo le emissioni di CO2 come le sigle digitate col T9. Il segnale c'è già nei numeri: la capacità di generazione, arenata da inizio anni 2000 per mancanza di alternative non inquinanti, è tornata a crescere sia negli Stati Uniti sia in Cina, le due economie più grandi del mondo.

La domanda che ti giro: nelle trattative con i tuoi clienti industriali, la leva che convince davvero è ancora il prezzo a kWh o sta diventando la prevedibilità del costo su orizzonti lunghi?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 7 P1
add(first="Chiara", last="Locati", role="Head of Investor Relations and ESG", company="Industrie De Nora", city="Milano",
 linkedin="https://www.linkedin.com/in/chiara-locati-33919021/", domain="denora.com", website="https://denora.com", priority="P1",
 emails=["chiara.locati@denora.com"], ffcode="ff.16.1",
 focus="investor relations, ESG, elettrochimica per settori hard-to-abate",
 source_url="https://www.businesspeople.it/people/protagonisti/de-nora-sentiero-tracciato-chiara-locati/",
 message="""Ciao Chiara,

segui investor relations ed ESG in De Nora, un'azienda le cui tecnologie elettrochimiche servono esattamente i settori che il mercato considera più difficili da decarbonizzare. Un racconto non semplice da portare agli analisti.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

💰 ff.16.1 Tanti trillioni di dollari — McKinsey stima che per raggiungere gli obiettivi di COP26 servano 9 trilioni di dollari all'anno di investimenti: circa un decimo del PIL globale e dieci volte i finanziamenti raccolti in quella direzione nel 2021. Nel dettaglio dei green premium al 2030 il quadro si fa più concreto: cemento e acciaio viaggiano rispettivamente al 50% e al 25% di sovrapprezzo, e valgono da soli circa il 10% delle emissioni globali; l'etilene costerà praticamente come oggi.

La domanda che ti giro: nelle conversazioni con gli investitori, il green premium dei clienti finali entra ormai come driver di domanda o resta ancora un rischio da spiegare?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 8 P1
add(first="Giacomo", last="Astolfi", role="Head of Tech Solutions & New Business", company="Alperia Green Future (Alperia Group)", city="Ancona",
 linkedin="https://www.linkedin.com/in/giacomo-astolfi-6a580644/", domain="alperia.eu", website="https://www.alperia.eu", priority="P1",
 emails=["giacomo.astolfi@alperia.eu"], ffcode="ff.37.4",
 focus="automazione industriale, piattaforme digitali per l'efficienza energetica",
 source_url="https://www.netzeromilan.com/en/conference/netzero-verticals-2025/speaker-vertical-conference.html",
 message="""Ciao Giacomo,

guidi tech solutions e new business in Alperia Green Future, con un passato in controllo di processo avanzato e diagnostica: la parte del lavoro dove l'efficienza si misura sul campo e non nelle slide.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e industria. Ti lascio uno spunto in tema:

📈 ff.37.4 Robot sempre più diffusi — le installazioni di robot industriali hanno accelerato in modo netto rispetto al loro costo, con la Cina che nel 2020 pesava quasi metà del totale mondiale. L'Italia ne ha installati 11.600 su circa 400.000 globali, con una delle crescite più alte d'Europa, un +50% rispetto all'anno precedente. La direzione delle proiezioni al 2030 è chiara: dalla manifattura verso veicoli autonomi e servizi, dal cibo alla rivendita alle pulizie.

La domanda che ti giro: nei progetti che porti in fabbrica, il freno principale è ancora l'integrazione con l'automazione esistente o la mancanza di competenze interne per governare i dati che ne escono?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 9 P1
add(first="Roberto", last="Giacomelli", role="Partner, Climate Change and Sustainability Services Leader Italy", company="EY", city="Milano",
 linkedin="https://www.linkedin.com/in/robertogiacomelli1/", domain="it.ey.com", website="https://www.ey.com/it_it", priority="P1",
 emails=["roberto.giacomelli@it.ey.com","roberto.giacomelli@ey.com"], ffcode="ff.51.3",
 focus="climate change e sustainability advisory, allocazione delle risorse",
 source_url="https://www.ey.com/it_it/people/roberto-giacomelli",
 message="""Ciao Roberto,

guidi i Climate Change and Sustainability Services di EY in Italia, con più di venticinque anni di progetti su ambiente e sostenibilità: hai visto il tema passare da nicchia tecnica a voce di bilancio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, clima ed economia. Ti lascio uno spunto scomodo, che ho trovato utile proprio perché scomodo:

🔥 ff.51.3 Sono il tuo sogno eretico — in una lunga conversazione con Bjørn Lomborg e Andrew Revkin emergono numeri che spostano la discussione dal cosa al quanto: ogni dollaro speso in educazione renderebbe 45 volte, in lotta a malaria e tubercolosi 42, sul cambiamento climatico 10. E per gli Stati Uniti l'impatto stimato del clima è una riduzione dello 0,7-2,4% annuo da qui al 2100, paragonabile al costo dei contenziosi legali. Il tema resta serissimo; cambia però il modo di allocare le risorse tra mitigazione, adattamento e prevenzione.

La domanda che ti giro: nei mandati che segui, l'adattamento sta finalmente entrando nei piani industriali o resta un capitolo separato dalla decarbonizzazione?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 10 P1
add(first="Sonia Margherita", last="Belloli", role="Managing Associate, ESG e compliance", company="Deloitte Legal", city="Milano",
 linkedin="https://www.linkedin.com/in/soniabelloli/", domain="deloitte.it", website="https://www.deloitte.com/it/it.html", priority="P1",
 emails=["sbelloli@deloitte.it","sonia.belloli@deloitte.it"], ffcode="ff.130.1",
 focus="ESG, compliance, economia circolare",
 source_url="https://www.csreinnovazionesociale.it/relatori-evento-nazionale-2026/",
 message="""Ciao Sonia,

in Deloitte Legal lavori su ESG e cultura dell'integrità, con una formazione specifica sulle strategie di sostenibilità nell'economia circolare: un ambito dove la norma corre spesso più veloce della tecnologia che dovrebbe renderla applicabile.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente ed economia. Ti lascio uno spunto in tema:

🥤 ff.130.1 Plastic is fantastic — la plastica fa anche del bene, a partire dalla conservazione del cibo, e da italiani possiamo rivendicare il Nobel per la Chimica a Natta nel 1963. Il problema arriva dopo: flessibilità e durabilità chimica, cioè i suoi vantaggi, sono le stesse proprietà che complicano separazione e riciclo. Google X ha lavorato con DOW su un sistema di AI per categorizzare gli scarti in base al tipo di polimero, e in laboratorio si è già dimostrato che le bottiglie si possono trasformare in diamanti. La distanza tra il possibile e l'economicamente sensato resta grande.

La domanda che ti giro: nei fascicoli che segui, gli obblighi su riciclato e tracciabilità stanno spingendo investimenti reali in impianti o soprattutto in rendicontazione?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 11 P2
add(first="Luca", last="Rossi", role="Managing Consultant, ESG Lead Italy", company="Ramboll", city="Milano",
 linkedin="https://www.linkedin.com/in/lucarossi4/", domain="ramboll.com", website="https://www.ramboll.com", priority="P2",
 emails=["luca.rossi@ramboll.com"], ffcode="ff.58.5",
 focus="consulenza ESG, strategie di decarbonizzazione industriale",
 source_url="https://www.esgbusiness.it/relatori/",
 message="""Ciao Luca,

guidi la practice ESG di Ramboll in Italia, quindi ti tocca la parte scomoda del lavoro: tradurre ambizioni di sostenibilità in numeri che reggono a un consiglio di amministrazione.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

📉 ff.58.5 Decrescita felice o crescita tech? — ridurre eccessi e sprechi è auspicabile, però non basta: i costi fissi di welfare, educazione e sanità rappresenterebbero da soli la metà delle emissioni globali se tutti i cittadini raggiungessero standard da primo mondo. Serve tecnologia, e un numero lo spiega bene: produrre una turbina eolica genera 30 tonnellate di CO2, ma la stessa turbina in vent'anni ne evita 500, l'equivalente di venti o quarant'anni di emissioni con uno stile di vita americano o inglese.

La domanda che ti giro: nei tuoi progetti, quanto è ancora difficile far accettare a un cliente che l'impronta iniziale di un investimento è alta e si ripaga solo su orizzonti decennali?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 12 P2
add(first="Marco", last="Cantalamessa", role="Chief Strategy and Sustainable Innovation", company="SIMEST", city="Roma",
 linkedin="https://it.linkedin.com/in/marco-cantalamessa-0a379360", domain="simest.it", website="https://www.simest.it", priority="P2",
 emails=["marco.cantalamessa@simest.it","m.cantalamessa@simest.it"], ffcode="ff.149.5",
 focus="strategia, innovazione sostenibile, internazionalizzazione e Africa",
 source_url="https://www.simest.it/en/about-us/corporate-governance/",
 message="""Ciao Marco,

segui strategia e innovazione sostenibile in SIMEST, anche sull'Africa Champion Program: sostenere investimenti in Africa e allo stesso tempo la competitività delle PMI italiane significa lavorare proprio sul punto dove energia e geopolitica si intrecciano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e geopolitica. Ti lascio uno spunto in tema:

🗽 ff.149.5 Libertà (da gas e petrolio) — il solare è anche una leva per ridurre la dipendenza da gas russo e petrolio iraniano, e quando quella dipendenza si rompe il conto arriva in fretta: l'Egitto ha visto raddoppiare il costo dell'energia in due mesi e la via d'uscita più rapida passa dall'eolico cinese. Nel frattempo la stessa Cina, per proteggersi dalle importazioni esterne, sta valutando di limitare l'export del solare. In Africa la corsa è già partita, guidata da Nigeria, Algeria, Congo e Mozambico.

La domanda che ti giro: nei dossier che valuti, l'accesso all'energia sta diventando un criterio di selezione dei mercati o resta un fattore di contorno?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 13 P2
add(first="Fabio", last="Ranghino", role="Partner, Head of Sustainability & Strategy", company="Ambienta SGR", city="Milano",
 linkedin="https://www.linkedin.com/in/fabio-ranghino-89882b5/", domain="ambientasgr.com", website="https://ambientasgr.com", priority="P2",
 emails=["fabio.ranghino@ambientasgr.com"], ffcode="ff.5.2",
 focus="private equity ambientale, efficienza delle risorse",
 source_url="https://ambientasgr.com/team/fabio-ranghino/",
 message="""Ciao Fabio,

in Ambienta hai costruito il dipartimento Sustainability & Strategy e l'approccio con cui il fondo misura l'impatto ambientale delle aziende in portafoglio: uno dei pochi casi in cui la sostenibilità viene trattata come tesi di investimento e non come reportistica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

🔋 ff.5.2 Duracell? No, Tesla — con 3 GWh di capacità Tesla controlla circa un quarto del potenziale mondiale di accumulo elettrico, e punta a 1.500 GWh entro il 2030, cioè cinquecento volte tanto. Per arrivarci servirà moltissimo litio, che poi andrà smaltito: già oggi 17,6 GWh di batterie arrivano a fine vita ogni anno e in quindici anni saranno dieci volte tanto, l'equivalente di circa 200 piscine olimpiche considerando i soli veicoli elettrici.

La domanda che ti giro: nel tuo deal flow il recupero dei materiali da batteria è già una categoria investibile o i volumi restano ancora troppo distanti?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 14 P2
add(first="Sara", last="Lovisolo", role="Head of ESG Development", company="Amundi SGR", city="Milano",
 linkedin="https://it.linkedin.com/in/sara-lovisolo-b5b4731", domain="amundi.com", website="https://www.amundi.it", priority="P2",
 emails=["sara.lovisolo@amundi.com"], ffcode="ff.31.2",
 focus="finanza sostenibile, tassonomia, prodotti ESG",
 source_url="https://esgnews.it/governance/amundi-italia-sara-lovisolo-e-la-nuova-head-of-esg/",
 message="""Ciao Sara,

guidi lo sviluppo ESG di Amundi in Italia, dopo anni di sostenibilità di gruppo tra London Stock Exchange ed Euronext e il lavoro nel Technical Expert Group della Commissione europea: hai visto la finanza sostenibile passare dalla fase dichiarativa a quella normativa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, clima e finanza. Ti lascio uno spunto in tema:

📜 ff.31.2 Due articoli o report — l'IPCC ha prodotto un rapporto sul clima di oltre 3.000 pagine, con una sintesi da 40 che conserva i punti salienti: un buon promemoria di quanto la soglia di accesso all'informazione conti più della sua disponibilità. Nella stessa uscita citavo il fondo ARK, che pubblicava analisi molto ambiziose sul futuro tra blockchain, veicoli elettrici e autonomi, genomica, AI e robotica mentre segnava un -53% da inizio anno.

La domanda che ti giro: nella costruzione dei prodotti ESG, quanto è oggi vincolante il divario tra la qualità dei dati climatici disponibili e quella richiesta dalla normativa?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 15 P2
add(first="Laura", last="Maida", role="Executive Director, Head of ESG Steering", company="Intesa Sanpaolo", city="Torino/Milano",
 linkedin="https://it.linkedin.com/in/laura-maida-682a04", domain="intesasanpaolo.com", website="https://group.intesasanpaolo.com", priority="P2",
 emails=["laura.maida@intesasanpaolo.com"], ffcode="ff.46.1",
 focus="governance ESG, decarbonizzazione del portafoglio crediti",
 source_url="https://askanews.it/2026/06/03/venice-climate-week-intesa-sanpaolo-sostenibilita-scelta-strategica/",
 message="""Ciao Laura,

guidi l'ESG Steering di Intesa Sanpaolo e alla Venice Climate Week hai raccontato il piano 2026-2029 tra impegni di decarbonizzazione e accompagnamento delle imprese nella transizione: significa decidere, di fatto, quali tecnologie sono finanziabili.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e finanza. Ti lascio uno spunto in tema:

🆕 ff.46.1 Nucleare: un rebrand necessario — da settant'anni esiste una tecnologia che produce energia a bassissimo rischio e con emissioni praticamente nulle, la fissione, e alla società è bastato un caso simbolo come Fukushima per bollare un intero campo di ricerca. L'investitore Josh Wolfe propone di chiamarla energia elementale, e i sondaggi suggeriscono che l'opinione pubblica stia facendo un'inversione a U. Per chi alloca capitale la domanda diventa concreta: quali tecnologie restano fuori dai piani per ragioni di percezione più che di merito.

La domanda che ti giro: nella vostra tassonomia interna, la percezione sociale di una tecnologia pesa in modo esplicito o entra solo indirettamente attraverso il rischio reputazionale?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 16 P2
add(first="Isabella", last="Falautano", role="Group Chief Sustainability Officer", company="Angelini Industries", city="Roma",
 linkedin="https://www.linkedin.com/in/isabella-falautano-1a02816/", domain="angeliniindustries.com", website="https://www.angeliniindustries.com", priority="P2",
 emails=["isabella.falautano@angeliniindustries.com"], ffcode="ff.19.4",
 focus="strategia ESG di gruppo, comunicazione della sostenibilità",
 source_url="https://www.angeliniindustries.com/en/about-us/leadership/isabella-falautano/",
 message="""Ciao Isabella,

come Group Chief Sustainability Officer di Angelini Industries hai costruito da zero il dipartimento e il primo piano ESG di gruppo, con un percorso che tiene insieme sostenibilità e relazioni istituzionali: due mestieri che si reggono entrambi sul modo in cui una cosa viene raccontata.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, consumi e società. Ti lascio uno spunto laterale ma in tema:

🐖 ff.19.4 Scelte sostenibili cool — l'agenzia svedese Everland ha ridisegnato il packaging della startup francese La Vie con un obiettivo preciso: smarcarsi dall'estetica classica del mondo bio e vegano per allargare la clientela. Hanno usato il rosa che richiama il bacon accostato a un verde vegetariano, e toni ironici invece che moralisti, provando anche a stemperare le faide tra vegani e non. Un promemoria utile su quanto la sostenibilità venga scelta o rifiutata per ragioni di identità prima che di dati.

La domanda che ti giro: nel vostro piano ESG, quanto spazio riesci a dare al registro con cui i temi vengono comunicati rispetto al perimetro degli indicatori?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 17 P2
add(first="Irene", last="Paruccini", role="Group Sustainability Manager", company="Angelini Holding", city="Roma",
 linkedin="https://it.linkedin.com/in/irene-paruccini-2953aaa9", domain="angeliniholding.com", website="https://www.angeliniholding.com", priority="P2",
 emails=["irene.paruccini@angeliniholding.com","irene.paruccini@angelini.it"], ffcode="ff.47.3",
 focus="impatto ambientale, energy management, prodotti di consumo",
 source_url="https://www.esgbusiness.it/relatori/",
 message="""Ciao Irene,

segui la sostenibilità di gruppo in Angelini, con un percorso lungo su valutazione di impatto ambientale ed energy management: quel tipo di lavoro in cui i risultati arrivano da variabili che nessuno guardava.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e consumi. Ti lascio uno spunto in tema:

🐧 ff.47.3 Lavatrici contro le microplastiche — pensavo che le microplastiche venissero soprattutto dai rifiuti degradati dagli agenti atmosferici. Invece il 35% arriva dai nostri bucati in lavatrice. Al CES, Patagonia ha presentato un programma di lavaggio che riduce del 54% la plastica rilasciata, e uno studio sulle diverse modalità mostra che lavare meno, più a freddo e in modalità gentile vale da solo il 70% della riduzione ottenibile. Nel frattempo, ogni anno ne mangiamo circa 50.000 particelle, ne inaliamo 100.000 e ne beviamo 90.000 da una bottiglia di plastica.

La domanda che ti giro: nei prodotti di consumo che seguite, l'impatto in fase d'uso entra già nelle valutazioni o l'attenzione resta concentrata su produzione e packaging?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 18 P2
add(first="Isabella", last="Manfredi", role="Direttore Comunicazione e Relazioni Esterne, Sustainability Manager", company="Feralpi Group", city="Lonato del Garda (BS)",
 linkedin="https://www.linkedin.com/in/isabella-manfredi-ab5431160/", domain="feralpigroup.com", website="https://www.feralpigroup.com", priority="P2",
 emails=["isabella.manfredi@feralpigroup.com"], ffcode="ff.1.4",
 focus="acciaio, decarbonizzazione dei processi hard-to-abate",
 source_url="https://www.industriaitaliana.it/feralpi-sostenibilita-2026-percorso-esg-gruppo-sole-24-ore-statista/",
 message="""Ciao Isabella,

guidi comunicazione, relazioni esterne e sostenibilità in Feralpi, tra i pochi gruppi siderurgici entrati nei Leader della Sostenibilità 2026 del Sole 24 Ore: raccontare la decarbonizzazione dall'interno di un'acciaieria è un esercizio parecchio più difficile che farlo dai servizi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, industria ed energia. Ti lascio uno spunto in tema:

🏭 ff.1.4 Catturare CO2 sarà importante — in un report molto dettagliato di Goldman Sachs sulla decarbonizzazione, l'obiettivo dichiarato per la cattura della CO2 è scendere sotto i 100 dollari a tonnellata. Piantare alberi resta una strada percorribile, ma i natural sinks catturerebbero solo il 5% della CO2 emessa ogni anno. Resta quindi la cattura là dove la CO2 viene prodotta, la CCUS industriale, proprio perché i processi produttivi di cemento e acciaio, che rimarranno fondamentali per la nostra società, hanno una chimica intrinsecamente inquinante.

La domanda che ti giro: nel forno elettrico la partita si gioca ormai quasi tutta sul mix elettrico a monte, o vedi ancora margini importanti sul processo?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 19 P2
add(first="Riccardo", last="Malabarba", role="Head of Data, AI & Analytics", company="Siram Veolia", city="Milano",
 linkedin="https://it.linkedin.com/in/rmalabarba", domain="veolia.com", website="https://www.siram.veolia.it", priority="P2",
 emails=["riccardo.malabarba@veolia.com","riccardo.malabarba@siram.veolia.it"], ffcode="ff.126.4",
 focus="dati e machine learning per l'ottimizzazione energetica",
 source_url="https://theorg.com/org/siram-veolia/org-chart/riccardo-malabarba",
 message="""Ciao Riccardo,

guidi dati e analytics in Siram Veolia e hai lavorato su Eurekam, ottimizzazione energetica in tempo reale con algoritmi predittivi-adattivi: uno dei casi in cui il machine learning produce risparmi misurabili invece che dashboard.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e AI. Ti lascio uno spunto in tema:

🅰️ ff.126.4 AlphaEvolve — dopo AlphaGo e AlphaStar, Google DeepMind ha presentato un sistema che non gioca ai videogiochi ma lavora sulla matematica: ha stabilito un nuovo record di 593 sfere nel problema dei baci in 11 dimensioni e, nello stesso tempo, ha ridotto dell'1% il consumo dei data center migliorando l'algoritmo di Strassen, imbattuto dal 1969. Un uno percento che, sulla scala di una flotta di data center, vale più di molte iniziative di efficienza dichiarate a mezzo stampa.

La domanda che ti giro: nei tuoi impianti, il margine residuo di ottimizzazione sta più nei modelli o nella qualità dei dati di campo che li alimentano?

Post completo: {url}
""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 20 P2
add(first="Luca", last="Dozio", role="Direttore Osservatorio Innovative Robotics", company="Osservatori Digital Innovation, Politecnico di Milano", city="Milano",
 linkedin="https://www.linkedin.com/in/luca-dozio-b37856131/", domain="polimi.it", website="https://www.osservatori.net", priority="P2",
 emails=["luca.dozio@polimi.it","luca.dozio@osservatori.net"], ffcode="ff.9.2",
 focus="robotica industriale e di servizio, impatto sul lavoro",
 source_url="https://www.netzeromilan.com/en/conference/netzero-verticals-2025/speaker-vertical-conference.html",
 message="""Ciao Luca,

dirigi l'Osservatorio Innovative Robotics del Politecnico di Milano, quindi hai i numeri veri sull'adozione italiana, in un momento in cui la robotica smette di essere solo braccia meccaniche e comincia a incorporare modelli linguistici.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, AI e lavoro. Ti lascio uno spunto in tema:

💱 ff.9.2 I robot ci ruberanno il lavoro? — in The Rise of the Robots, Martin Ford sostiene che dopo il lavoro fisico nel Novecento tocchi ora ai mestieri alti, da medici a ingegneri a traduttori e avvocati, e che il valore si concentri sempre di più: YouTube aveva 65 dipendenti nell'anno in cui è stata venduta per 2 miliardi di dollari. Sui numeri, nel 2021 negli Stati Uniti sono stati ordinati 29.000 robot, +37% sull'anno prima; Amazon impiega 350.000 robot con una forza lavoro umana quattro volte più grande, ma in cinque anni gli umani sono cresciuti di 5,6 volte e i robot di 7,7.

La domanda che ti giro: nei dati del vostro Osservatorio, l'adozione italiana segue ancora la logica di sostituzione o si sta spostando verso l'affiancamento?

Post completo: {url}
""" + CTA + """

Michele""")

assert len(R) == 20, len(R)
codes = [r["ffcode"] for r in R]
assert len(set(codes)) == 20, "ff codes non distinti"

# ---------------------------------------------------------------- render
for r in R:
    r["message"] = r["message"].replace("{url}", r["ff_url"]).strip()
    r["words"] = len(r["message"].split())
    r["name"] = r["first"] + " " + r["last"]
    r["subject"] = "Spunto %s per %s" % (r["ffcode"], r["first"])

# ---------------------------------------------------------------- CSV
csv_path = os.path.join(OUTDIR, "batch%d_%s.csv" % (BATCH, DATE))
cols = ["first_name","last_name","role","company","city_or_region","linkedin_url","email_public",
        "email_best","guessed_emails","website","focus_theme","why_match","source_urls",
        "excerpt_text","excerpt_id","template_id","template_subject","priority","status","owner","next_action"]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(cols)
    for r in R:
        excerpt = r["message"].split("\n\n")[3]
        w.writerow([r["first"], r["last"], r["role"], r["company"], r["city"], r["linkedin"], "",
                    r["emails"][0], "; ".join(r["emails"]), r["website"], r["focus"],
                    "%s -> %s" % (r["focus"], r["ff_title"]), r["source_url"],
                    excerpt, r["ffcode"], "ff-outreach-v3", r["subject"], r["priority"],
                    "queued", "micmer.clawdbot", "create_gmail_draft_manual"])

# ---------------------------------------------------------------- MD
md_path = os.path.join(OUTDIR, "batch%d_%s.md" % (BATCH, DATE))
with open(md_path, "w", encoding="utf-8") as f:
    f.write("# FF Outreach — batch %d (%s)\n\n" % (BATCH, DATE))
    f.write("20 lead nuovi · template V3 · status `drafted` · invio NON autorizzato (serve GO di Michele).\n\n")
    f.write("Settori: energia e utility, consulenza, ESG e finanza sostenibile, industria, tech e digital transformation.\n\n---\n\n")
    for i, r in enumerate(R, 1):
        f.write("## %d. %s — %s, %s\n\n" % (i, r["name"], r["role"], r["company"]))
        f.write("- **ID tracker:** %d · **priorità:** %s · **città:** %s\n" % (START_ID + i - 1, r["priority"], r["city"]))
        f.write("- **LinkedIn:** %s\n" % r["linkedin"])
        f.write("- **Email guessed:** %s\n" % ", ".join("`%s`" % e for e in r["emails"]))
        f.write("- **Fonte ruolo:** %s\n" % r["source_url"])
        f.write("- **Spunto FF:** %s — %s\n" % (r["ff_title"], r["ff_url"]))
        f.write("- **Oggetto:** %s · **parole:** %d\n\n" % (r["subject"], r["words"]))
        f.write("```\n%s\n```\n\n---\n\n" % r["message"])

# ---------------------------------------------------------------- TRACKER MERGE
shutil.copyfile(TRACKER, BACKUP)
t = json.load(open(TRACKER, encoding="utf-8"))
before_contacts = len(t["contacts"])
before_drafted_meta = t["meta"]["total_drafted"]
before_drafted_top = t["total_drafted"]
existing_ids = {c["id"] for c in t["contacts"]}

for i, r in enumerate(R):
    nid = START_ID + i
    assert nid not in existing_ids, "id duplicato: %d" % nid
    t["contacts"].append({
        "id": nid,
        "name": r["name"],
        "role": r["role"],
        "org": r["company"],
        "channel": "email",
        "ff_post": r["ffcode"],
        "ff_post_title": r["ff_title"],
        "ff_post_url": r["ff_url"],
        "subject": r["subject"],
        "message": r["message"],
        "emails_guessed": r["emails"],
        "words": r["words"],
        "status": "drafted",
        "date": DATE,
        "batch": BATCH,
        "send_authorized": False,
    })

t["meta"]["last_batch"] = BATCH
t["meta"]["last_batch_date"] = DATE
t["meta"]["updated"] = DATE
t["meta"]["total_drafted"] = before_drafted_meta + 20
t["total_drafted"] = before_drafted_top + 20
json.dump(t, open(TRACKER, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

print("CSV :", csv_path)
print("MD  :", md_path)
print("BAK :", BACKUP)
print("contacts before/after: %d / %d" % (before_contacts, len(t["contacts"])))
print("meta.total_drafted before/after: %d / %d" % (before_drafted_meta, t["meta"]["total_drafted"]))
print("top total_drafted before/after: %d / %d" % (before_drafted_top, t["total_drafted"]))
print("words min/max:", min(r["words"] for r in R), max(r["words"] for r in R))
