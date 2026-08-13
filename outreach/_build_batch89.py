# -*- coding: utf-8 -*-
"""FF outreach batch 89 — build CSV + MD + merge tracker."""
import json, csv, shutil, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATE = "2026-07-29"
BATCH = 89
START_ID = 1517
TRACKER = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json"
BACKUP = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b89.json"
OUTDIR = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach"
FFIDX = OUTDIR + "/_ffidx_b89.json"
CTA = "Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti di futuro fortissimo."

FF = json.load(open(FFIDX, encoding="utf-8"))

R = []
def add(**k):
    assert k["ffcode"] in FF, "ff code non presente in data.js: " + k["ffcode"]
    k["ff_title"] = FF[k["ffcode"]]["title"]
    k["ff_url"] = FF[k["ffcode"]]["link"]
    R.append(k)

# ------------------------------------------------------------------ 1 P1
add(first="Maria Vittoria", last="Trussoni", role="Head of Sustainability & Green Tech", company="NTT DATA Italia",
 city="Milano", linkedin="https://www.linkedin.com/in/maria-vittoria-trussoni/", domain="nttdata.com",
 website="https://it.nttdata.com", priority="P1",
 emails=["mariavittoria.trussoni@nttdata.com", "maria.trussoni@nttdata.com"], ffcode="ff.73.4",
 focus="impatto ambientale dell'IT, digital twin e misura della CO2 dei datacenter",
 source_url="https://www.agensir.it/quotidiano/2026/5/18/ambiente-trussoni-ntt-data-italia-la-sostenibilita-e-il-modo-in-cui-le-imprese-ripensano-il-loro-futuro/",
 message="""Ciao Maria Vittoria,

costruisci modelli per quantificare in CO2 equivalente l'impatto dell'IT, datacenter compresi, e usi digital twin per prevederlo. È il pezzo di sostenibilità dove i numeri contano davvero, perché è l'unico che si può misurare a valle di ogni riga di codice.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e lavoro. Ti lascio uno spunto in tema:

🥬 ff.73.4 In modo più ecologico — nella tabella dei consumi annui di quella nota YouTube compare a 244 TWh, l'oro a 170, i datacenter globali a 120, mentre Ethereum passa da 78 TWh con il Proof of Work a 0,003 con il Proof of Stake. Un cambio di protocollo, cioè una scelta di architettura software, ha spostato il consumo di quattro ordini di grandezza. Nella stessa nota c'è il rimando al confronto iniziale, Bitcoin che consumava quanto l'intera Finlandia.

La domanda che ti giro: nei tuoi modelli, quanto pesa l'architettura applicativa rispetto all'efficienza dell'hardware quando misuri l'impronta di un sistema?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 2 P1
add(first="Stefano", last="Besana", role="Partner, Organization & Workforce Transformation", company="Deloitte Italia",
 city="Milano", linkedin="https://www.linkedin.com/in/stefanobesana/", domain="deloitte.it",
 website="https://www.deloitte.com/it", priority="P1",
 emails=["sbesana@deloitte.it", "stefano.besana@deloitte.it"], ffcode="ff.62.1",
 focus="futuro del lavoro, interazione uomo-macchina, trasformazione organizzativa",
 source_url="https://www.deloitte.com/it/it/about/people/profiles.sbesana.html",
 message="""Ciao Stefano,

in Deloitte lavori sul ridisegno del lavoro attorno all'interazione uomo-macchina, e scrivi da anni sulle implicazioni organizzative dell'AI. Ho la sensazione che la parte difficile stia meno nei modelli e più nei paradigmi che diamo per scontati.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, lavoro e società. Ti lascio uno spunto in tema:

🔥 ff.62.1 Il lavoro non è mai stato così importante — solo il 40% degli americani, circa 100 milioni di persone, ha un lavoro che occupa più di 35 ore a settimana. Il dipendente "9-to-5" come normalità statistica non regge, e non ha mai retto. Per millenni ha prevalso la visione weberiana del lavoro come mantenimento dello standard di vita raggiunto: copia-incolla dei genitori. La crescita degli ultimi settant'anni ha forgiato una vera religione del lavoro, e per motivi demografici ed economici quel copia-incolla ha smesso di funzionare.

La domanda che ti giro: nelle trasformazioni che segui, quanta della resistenza all'AI è tecnica e quanta è difesa di quel paradigma?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 3 P1
add(first="Paolo", last="Lobetti Bodoni", role="Global Business Consulting Leader", company="EY",
 city="Milano", linkedin="https://www.linkedin.com/in/paololobetti/", domain="it.ey.com",
 website="https://www.ey.com/it_it", priority="P1",
 emails=["paolo.lobettibodoni@it.ey.com", "paolo.lobetti.bodoni@it.ey.com"], ffcode="ff.16.1",
 focus="consulenza globale, trasformazione digitale, economia circolare nell'automotive",
 source_url="https://www.ey.com/it_it/newsroom/2026/07/ey-annuncia-46-nuovi-partner",
 message="""Ciao Paolo,

da luglio guidi il Business Consulting globale di EY, dopo aver lavorato su una piattaforma europea per i veicoli a fine vita. Sono due punti di osservazione rari sullo stesso problema: chi paga il conto della transizione e con quali ritorni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia ed economia. Ti lascio uno spunto in tema:

💰 ff.16.1 Tanti trillioni di dollari — McKinsey stima 9.000 miliardi di dollari all'anno di investimenti per centrare gli obiettivi COP26, circa un decimo del PIL globale e dieci volte i finanziamenti raccolti in quella direzione nel 2021. Poi c'è il green premium, il sovrapprezzo da pagare per compensare le emissioni: al 2030 vale il 50% sul cemento e il 25% sull'acciaio, due materiali che da soli valgono il 10% delle emissioni globali.

La domanda che ti giro: nei mandati che vedi passare, il green premium entra nei business case o resta un costo che si spera venga assorbito dal regolatore?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 4 P1
add(first="Donato", last="Ferri", role="Consulting Leader EY Italia e Europe West", company="EY",
 city="Roma", linkedin="https://www.linkedin.com/in/donato-ferri-30b9085/", domain="it.ey.com",
 website="https://www.ey.com/it_it", priority="P1",
 emails=["donato.ferri@it.ey.com", "d.ferri@it.ey.com"], ffcode="ff.36.4",
 focus="trasformazione organizzativa, change management, neuroscienze applicate al lavoro",
 source_url="https://www.ey.com/it_it/people/donato-ferri",
 message="""Ciao Donato,

hai un dottorato in psicologia e neuroscienze sociali e hai promosso il Neuroscience Lab dentro il wavespace di Roma, mentre guidi il Consulting di EY Italia ed Europe West. Poche persone in consulenza portano quella lente sulle trasformazioni organizzative.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, mente e lavoro. Ti lascio uno spunto in tema:

🤖 ff.36.4 Siamo già mischiati con l'AI? — l'esperimento è banale: metti il telefono nel cassetto della scrivania e in cinque-quindici minuti la mano scatta verso il posto vuoto, con una sensazione di mutilazione. Da poco più di dieci anni il nostro cervello gestisce livelli nuovi di cortisolo, dopamina e serotonina, innescati in continuazione dall'ansia dell'ultima notizia e dal desiderio di approvazione. L'aumento cognitivo è già avvenuto, senza elettrodi impiantati.

La domanda che ti giro: nei programmi di change che disegnate, misurate mai il costo attentivo degli strumenti che introducete, o resta fuori dal perimetro?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 5 P1
add(first="Antimo", last="Musone", role="Partner, Digital Engineering", company="EY Advisory",
 city="Roma", linkedin="https://www.linkedin.com/in/antimo-musone/", domain="it.ey.com",
 website="https://www.ey.com/it_it", priority="P1",
 emails=["antimo.musone@it.ey.com", "a.musone@it.ey.com"], ffcode="ff.115.3",
 focus="digital engineering, AI applicata, cloud e IoT su larga scala",
 source_url="https://www.ey.com/en_gl/people/antimo-musone",
 message="""Ciao Antimo,

guidi Digital Engineering in EY e sei stato nominato Distinguished Technologist quest'anno: vent'anni tra cloud, AI, IoT e realtà estesa ti danno un metro concreto su quali tecnologie escono dalla demo e quali no.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, scienza e lavoro. Ti lascio uno spunto in tema:

🐍 ff.115.3 Veleni esponenziali — l'AI sta strisciando fuori dai chatbot verso applicazioni pratiche. ProteinMPNN, un modello allenato su strutture proteiche invece che su testo, ha permesso di individuare un antidoto al veleno dei serpenti in secondi anziché mesi, con lo studio pubblicato su Nature. Da lì la riflessione sulla nostra miopia per le curve esponenziali, con l'illustrazione di Tim Urban che nel 2015 già raccontava la rivoluzione dell'intelligenza artificiale, e il caso della fusione nucleare con Q maggiore di 1 raggiunta quotidianamente proprio usando l'AI.

La domanda che ti giro: nei progetti che porti in produzione, il collo di bottiglia sta più nel modello o nel dato di dominio che serve per allenarlo?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 6 P1
add(first="Fausto", last="Torri", role="Energy Responsibility Lead EMEA e Italia", company="Accenture",
 city="Milano", linkedin="https://www.linkedin.com/in/fausto-torri-986442/", domain="accenture.com",
 website="https://www.accenture.com/it-it", priority="P1",
 emails=["fausto.torri@accenture.com", "f.torri@accenture.com"], ffcode="ff.16.2",
 focus="energia, transizione energetica e infrastrutture per i clienti EMEA",
 source_url="https://www.linkedin.com/in/fausto-torri-986442/",
 message="""Ciao Fausto,

segui l'Energy Responsibility per Accenture su EMEA e Italia, quindi vedi da vicino il divario tra i piani di decarbonizzazione dichiarati e il capitale che si muove davvero verso le infrastrutture.

Scrivo futuro fortissimo, newsletter italiana su energia, tecnologia ed economia. Ti lascio uno spunto in tema:

🌉 ff.16.2 Il costo delle infrastrutture — un report Goldman Sachs su COP26 quantifica la bolletta per restare entro 1,5 °C: 50.000 miliardi di dollari da qui al 2050, fino a 3.000 miliardi in un singolo anno, per centrali di nuova generazione, colonnine di ricarica, adattamento e manutenzione delle reti e sistemi di cattura della CO2. Di questi, 30.000 miliardi servono a nuovi impianti rinnovabili: 8.000 per il solare e 13.000 per l'eolico onshore e offshore.

La domanda che ti giro: nei clienti che segui, il freno principale è ancora il costo del capitale o sono i tempi autorizzativi e di connessione alla rete?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 7 P1
add(first="Sergio", last="Gambacorta", role="Head of Smart City & B2G Innovation", company="Enel X Global Retail",
 city="Roma", linkedin="https://www.linkedin.com/in/sergiogambacorta/", domain="enel.com",
 website="https://www.enelx.com", priority="P1",
 emails=["sergio.gambacorta@enel.com", "sergio.gambacorta@enelx.com"], ffcode="ff.34.2",
 focus="smart city, CO2 City Index, indice della città in 15 minuti, dati urbani",
 source_url="https://openinnovability.enel.com/stories/articles/2022/12/challenge-winner-smart-cities-solutions-open-data",
 message="""Ciao Sergio,

dal 2017 guidi il Competence Center Smart City Innovation di Enel X, da cui sono usciti il CO2 City Index e l'indice della città in 15 minuti. Sono strumenti che trasformano l'urbanistica in una questione misurabile, che è esattamente il punto dove le decisioni comunali di solito si arenano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, città ed energia. Ti lascio uno spunto in tema:

🚦 ff.34.2 Ripensare le città: mobilità e traffico — sui dati TomTom, Roma dopo il ritorno alla normalità post-COVID è scesa da 24 minuti di attesa mattutina a 17. E c'è la stima della CO2 legata alle sole congestioni: a Parigi, delle 13,8 megatonnellate annue dovute alla mobilità, oltre il 10% si eviterebbe semplicemente togliendo le code, per esempio con orari di lavoro flessibili.

La domanda che ti giro: quando presentate questi indici alle amministrazioni, cosa sposta davvero una delibera — il dato sulle emissioni o quello sui minuti persi?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 8 P1
add(first="Roberto", last="Gianoglio", role="Head of Business Development Renewables", company="Iren Energia",
 city="Torino", linkedin="https://www.linkedin.com/in/robertogianoglio/", domain="gruppoiren.it",
 website="https://www.gruppoiren.it", priority="P1",
 emails=["roberto.gianoglio@gruppoiren.it", "roberto.gianoglio@irenenergia.it"], ffcode="ff.11.1",
 focus="sviluppo impianti rinnovabili, fotovoltaico utility scale, agrivoltaico",
 source_url="https://www.linkedin.com/in/robertogianoglio/",
 message="""Ciao Roberto,

sviluppi il business rinnovabile di Iren Energia, dal parco fotovoltaico di Tuscania in poi. Chi porta a terra i megawatt sa che la parte complicata arriva dopo la firma, quando conta il mix di fonti che regge davvero la rete.

Scrivo futuro fortissimo, newsletter italiana su energia, tecnologia ed economia. Ti lascio uno spunto in tema:

🌬️ ff.11.1 La rivincita delle rinnovabili? — nel 2020 tutta la crescita di generazione elettrica è arrivata da tre fonti: eolico, solare e idroelettrico. L'eolico ha fatto da padrone con +163 TWh, seguito dal solare con 148 e dall'idroelettrico con 78. La contrazione del carbone è stata assorbita interamente da queste tre, mentre il nucleare segnava -94 TWh. Il grafico di Nat Bullard è di quelli che chiudono una discussione.

La domanda che ti giro: nel portafoglio Iren, quanto pesa oggi il vincolo di connessione rispetto alla disponibilità di aree per decidere dove sviluppare?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 9 P1
add(first="Maria", last="Greco", role="Direttore Tecnologie e Sistemi Informativi (CIO)", company="Gruppo Iren",
 city="Torino", linkedin="https://www.linkedin.com/pub/maria-greco/13/b3a/225", domain="gruppoiren.it",
 website="https://www.gruppoiren.it", priority="P1",
 emails=["maria.greco@gruppoiren.it", "m.greco@gruppoiren.it"], ffcode="ff.88.1",
 focus="sistemi informativi di una multiutility, digitalizzazione, investimenti tecnologici",
 source_url="https://www.quotidianoenergia.it/module/news/page/entry/id/517181/iren-maria-greco-direttore-tecnologie-e-sistemi-informativi",
 message="""Ciao Maria,

da aprile 2025 guidi Tecnologie e Sistemi Informativi del Gruppo Iren, dopo dieci anni in Customer Operations. Chi arriva alla direzione IT dal lato commerciale ha di solito un'idea molto meno astratta di cosa valga davvero un investimento tecnologico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia ed energia. Ti lascio uno spunto in tema:

🧩 ff.88.1 Una bolla finanziaria? — quando la finanza diventa argomento da parrucchiere è di solito il momento di vendere. Il prezzo di NVIDIA è partito su un trend esponenziale, sostenuto dall'allenamento degli LLM sulle sue GPU, con la revenue triplicata in un solo anno. Il confronto interessante è con la bolla dot-com: rispetto ad allora il settore tecnologico oggi è scontato del 50%, il che rende la storia meno lineare di quanto raccontino sia gli entusiasti sia gli scettici.

La domanda che ti giro: nel budget IT di una multiutility, come tieni separata la spesa AI che produce efficienza da quella che compra soltanto opzionalità?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 10 P1
add(first="Palmo Antonio", last="Cavallo", role="Head of Digital Transition and Data Analytics", company="Gruppo Hera",
 city="Bologna", linkedin="https://it.linkedin.com/in/palmoantoniocavallo", domain="gruppohera.it",
 website="https://www.gruppohera.it", priority="P1",
 emails=["palmo.cavallo@gruppohera.it", "palmoantonio.cavallo@gruppohera.it"], ffcode="ff.55.2",
 focus="transizione digitale e data analytics in una multiutility, open innovation",
 source_url="https://www.youtube.com/watch?v=tpm6RCK68gY",
 message="""Ciao Palmo Antonio,

guidi Digital Transition e Data Analytics in Hera, con un passato tra Eni e Arthur D. Little. In una multiutility i dati arrivano da contatori, reti idriche, impianti di trattamento: materia prima abbondante e disordinata come poche altre.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, dati ed economia. Ti lascio uno spunto in tema:

🌾 ff.55.2 Campi da arare (e dati da reclamare) — Sam Korus di Ark Invest, citando Carlota Perez, ricorda che ogni rivoluzione tecnologica porta con sé una nuova materia prima: ferro, vapore, acciaio, petrolio, microelettronica. La domanda è se tocchi ora ai dati diventare l'input chiave dell'era AI. La sequenza è netta: agricoltura porta ai possedimenti terrieri, la macchina a vapore ai mezzi di produzione, il web alla potenza di calcolo, gli algoritmi al possesso dei dati. Con Stable Diffusion che impara da contenuti pubblici senza darne credito, la questione della proprietà è diventata scottante.

La domanda che ti giro: in Hera, il valore dei dati operativi lo state estraendo internamente o passa da partner che se ne portano via una parte?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 11 P2
add(first="Anna", last="Lo Iacono", role="Head of Sustainability", company="Fastweb + Vodafone",
 city="Milano", linkedin="https://www.linkedin.com/in/annaloiacono/", domain="fastweb.it",
 website="https://www.fastwebvodafone.it", priority="P2",
 emails=["anna.loiacono@fastweb.it", "annalucia.loiacono@fastweb.it"], ffcode="ff.34.4",
 focus="società benefit, obiettivi climatici, rigenerazione ambientale urbana, competenze digitali",
 source_url="https://www.esg360.it/sustainability-management/fastweb-lo-iacono-sostenibilita-al-centro-del-nostro-impegno-di-societa-benefit/",
 message="""Ciao Anna,

guidi la sostenibilità di Fastweb + Vodafone e dietro i progetti di rigenerazione ambientale, dal Parco Piemonte a Torino al Bosco Verde a Bari, c'è una scelta precisa: intervenire dentro le città invece che comprare compensazioni altrove.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, natura e città. Ti lascio uno spunto in tema:

🥵 ff.34.4 Ripensare le città: caldo — l'Agenzia Spaziale Europea raccoglie immagini nell'infrarosso delle temperature al suolo di alcune città europee, e i divari interni arrivano a dieci gradi. Da una parte le aree verdi come il Parco Sempione, dall'altra stazioni ferroviarie e mercati coperti, come l'Ortofrutticolo di Milano, dove si sommano superfici impermeabili e condizionamento. Sono mappe che rendono difficile trattare una piantumazione urbana come un gesto simbolico.

La domanda che ti giro: quando scegliete le aree da rigenerare, guardate mappe termiche di questo tipo o pesano di più le opportunità di partnership sul territorio?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 12 P2
add(first="Emanuele", last="Cardinale", role="Head of Sustainability", company="INWIT",
 city="Milano", linkedin="https://www.linkedin.com/in/emanuele-cardinale-66514b46/", domain="inwit.it",
 website="https://www.inwit.it", priority="P2",
 emails=["emanuele.cardinale@inwit.it", "e.cardinale@inwit.it"], ffcode="ff.52.2",
 focus="infrastrutture di rete come asset strategico, inclusione digitale, economia circolare",
 source_url="https://www.lacronaca24.it/2023/10/06/sostenibilita-cardinale-inwit-tendere-a-inclusione-sociale-con-quella-digitale/",
 message="""Ciao Emanuele,

in INWIT sostieni che le infrastrutture di telecomunicazione siano asset strategici della digitalizzazione del Paese e che l'inclusione sociale passi da quella digitale. Chi gestisce torri sa meglio di chiunque dove la copertura si concentra e dove si dirada.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, città ed economia. Ti lascio uno spunto in tema:

🏙️ ff.52.2 Centralizzare conviene — McKinsey rileva che metà del PIL mondiale del decennio 2010-2020 è stato generato in 3.600 regioni che coprono l'1% del pianeta. Le città potrebbero anche aiutare a contenere il cambiamento climatico, perché riducono gli spostamenti per accedere ai servizi e spingono verso case più piccole con consumi più bassi. Il rovescio è che anche i servizi si concentrano, e pochi soggetti finiscono per decidere l'accesso di tutti gli altri all'informazione.

La domanda che ti giro: nel piano coperture, il criterio della densità e quello dell'inclusione territoriale come si conciliano quando entrano in conflitto?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 13 P2
add(first="Elisa", last="Dellarosa", role="Head of Sustainability & Corporate Governance", company="Crédit Agricole Italia",
 city="Parma", linkedin="https://www.linkedin.com/in/elisa-dellarosa/", domain="credit-agricole.it",
 website="https://www.credit-agricole.it", priority="P2",
 emails=["elisa.dellarosa@credit-agricole.it", "e.dellarosa@credit-agricole.it"], ffcode="ff.16.3",
 focus="ESG come leva strategica per le imprese clienti, governance e finanza sostenibile",
 source_url="https://www.csreinnovazionesociale.it/relatore/dellarosa-elisa/",
 message="""Ciao Elisa,

guidi sostenibilità e corporate governance in Crédit Agricole Italia e scrivi che l'ESG sta diventando una leva strategica per le imprese, non un adempimento. Da una banca commerciale quel passaggio si vede prima che altrove, perché passa dalle condizioni di credito.

Scrivo futuro fortissimo, newsletter italiana su economia, energia e tecnologia. Ti lascio uno spunto in tema:

⚫ ff.16.3 Il mercato (nero) della CO2 — il prezzo della CO2 va da 7 dollari a tonnellata in Cina a oltre 150 in Svezia, con l'area europea intorno ai 75. McKinsey calcola che una tassazione ad almeno 50 euro a tonnellata sbloccherebbe un ulteriore 21% del capitale necessario alla transizione, sopra il 40% già bancabile; a 100 euro si supererebbe l'80% delle spese in conto capitale con un business case autonomo. Poi c'è il capitolo delle emissioni evitate, dove i crediti nascono da ciò che un'azienda avrebbe potuto emettere e non ha emesso.

La domanda che ti giro: nel pricing del credito alle PMI, il segnale del prezzo europeo della CO2 entra già o resta un tema da grandi corporate?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 14 P2
add(first="Luca", last="Giordano", role="Responsabile Corporate Social Responsibility", company="Gruppo Unipol",
 city="Bologna", linkedin="https://www.linkedin.com/in/luca-giordano-0a965727/", domain="unipol.it",
 website="https://www.unipol.com", priority="P2", email_public="luca.giordano@unipol.it",
 emails=["luca.giordano@unipol.it"], ffcode="ff.20.2",
 focus="CSR assicurativa, città a misura di clima, rischi naturali",
 source_url="https://www.cru-unipol.it/luca-giordano-e-il-nuovo-responsabile-della-corporate-social-responsibility-del-gruppo-unipol/",
 message="""Ciao Luca,

da luglio 2025 guidi la CSR del Gruppo Unipol e negli incontri sul territorio, penso a quello di Matera, hai portato il tema delle città a misura di clima e dei rischi naturali. Con un passato da economista in Consob, immagino tu guardi a quei rischi con occhio da prezzi più che da narrazione.

Scrivo futuro fortissimo, newsletter italiana su città, clima ed economia. Ti lascio uno spunto in tema:

🇮🇩 ff.20.2 L'esempio di Jakarta — nel 2015 Jakarta aveva 3,5 milioni di abitanti, oggi oltre 10, quasi nessuno con l'auto e solo il 10% in bicicletta, eppure deteneva il peggior traffico del mondo. Con una serie di scelte a favore del trasporto pubblico, e con la spinta del COVID, dal 2019 al 2020 l'uso della bici è aumentato di sei volte, in alcune aree fino a dieci; Transjakarta ha raggiunto un milione di passaggi al giorno; in cinque anni la quota di popolazione con una fermata entro 500 metri da casa è raddoppiata, arrivando al 92%.

La domanda che ti giro: interventi di questo tipo li vedete già riflessi nei modelli di rischio, o il ciclo assicurativo è troppo corto per registrarli?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 15 P2
add(first="Giulia", last="Briscese", role="Investor Relations Senior Manager (ESG)", company="Poste Italiane",
 city="Roma", linkedin="https://it.linkedin.com/in/giuliabriscese", domain="posteitaliane.it",
 website="https://www.posteitaliane.it", priority="P2", email_public="giulia.briscese@posteitaliane.it",
 emails=["giulia.briscese@posteitaliane.it"], ffcode="ff.42.2",
 focus="comunicazione integrata al mercato su temi finanziari e di sostenibilità",
 source_url="https://www.csreinnovazionesociale.it/relatore/briscese-giulia/",
 message="""Ciao Giulia,

in Poste Italiane curi la comunicazione integrata al mercato su temi finanziari e di sostenibilità, dopo sei anni tra ECM e M&A a Londra. È il punto in cui le promesse di transizione devono diventare numeri che un analista può contestare.

Scrivo futuro fortissimo, newsletter italiana su economia, energia e tecnologia. Ti lascio uno spunto in tema:

❓ ff.42.2 Inquinano o spingono la transizione? — la Cina resta il maggiore emettitore mondiale, un quarto del totale, con il picco atteso solo nel 2030 e il net-zero al 2060, ed è anche il maggiore costruttore di impianti a carbone, 52% del totale con 91 GW nel 2021. Nello stesso anno ha però investito nella transizione energetica più di ogni altro paese, 266 miliardi di dollari, 2,4 volte gli Stati Uniti. Per arrivare a net-zero le servono 17.000 miliardi complessivi: quei 266 miliardi valgono l'1,5% del totale.

La domanda che ti giro: quando gli investitori ti chiedono conto della traiettoria ESG, guardano più al valore assoluto speso o al rapporto con quanto servirebbe?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 16 P2
add(first="Chiara", last="Longhin", role="Supply Chain ESG Initiatives Manager", company="Saipem",
 city="Milano", linkedin="https://it.linkedin.com/in/chiaralonghin", domain="saipem.com",
 website="https://www.saipem.com", priority="P2",
 emails=["chiara.longhin@saipem.com", "c.longhin@saipem.com"], ffcode="ff.42.1",
 focus="Scope 3, decarbonizzazione della catena di fornitura, fornitori metallurgici",
 source_url="https://www.csreinnovazionesociale.it/relatore/longhin-chiara/",
 message="""Ciao Chiara,

in Saipem coordini le iniziative ESG della supply chain e lavori sui top emitter, cioè i fornitori metallurgici, con incontri annuali dedicati e un supplier day. Chi fa Scope 3 sul serio scopre presto che la leva vera sta nella concentrazione dei fornitori.

Scrivo futuro fortissimo, newsletter italiana su energia, economia e geopolitica. Ti lascio uno spunto in tema:

⛏️ ff.42.1 Minerali preziosi? — la Cina controlla l'80% della produzione di pannelli solari e dell'estrazione e raffinazione del litio. Nelle batterie, CATL vale il 35% del mercato, LG il 14,4%, BYD l'11,8%. Il punto interessante è che quella supremazia non nasce dalla capacità mineraria, come si crede spesso, ma dal quasi monopolio sulla raffinazione chimica, 80% della produzione, e sulla fase finale di costruzione delle celle al litio, 73%.

La domanda che ti giro: quando mappate le emissioni dei fornitori, riuscite a risalire oltre il primo livello o vi fermate dove finisce la tracciabilità contrattuale?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 17 P2
add(first="Carolina", last="Busseni", role="Responsabile Unità Transizione Ecologica ed Energetica", company="Feralpi Group",
 city="Brescia", linkedin="https://www.linkedin.com/in/carolina-busseni-165688145/", domain="feralpigroup.com",
 website="https://www.feralpigroup.com", priority="P2",
 emails=["carolina.busseni@feralpigroup.com", "c.busseni@feralpigroup.com"], ffcode="ff.1.4",
 focus="decarbonizzazione della siderurgia, carbon footprint di filiera, formazione fornitori",
 source_url="https://www.csreinnovazionesociale.it/relatore/busseni-carolina/",
 message="""Ciao Carolina,

guidi la transizione ecologica ed energetica in Feralpi e hai messo in piedi corsi interni per far calcolare ai fornitori la loro carbon footprint. Nell'acciaio la decarbonizzazione si gioca su chimica di processo e forniture, molto più che su dichiarazioni di intenti.

Scrivo futuro fortissimo, newsletter italiana su energia, industria ed economia. Ti lascio uno spunto in tema:

🏭 ff.1.4 Catturare CO2 sarà importante — in un report Goldman Sachs sulla decarbonizzazione curato da Michele Della Vigna, l'obiettivo per la cattura della CO2 è scendere sotto i 100 dollari a tonnellata. Piantare alberi è una strada percorribile ma insufficiente: i sink naturali arriverebbero a catturare solo il 5% della CO2 emessa ogni anno. Catturare la CO2 dove viene prodotta, quindi CCUS industriale, resterebbe l'unica soluzione per cemento e acciaio, materiali che restano fondamentali e hanno una chimica di processo molto inquinante.

La domanda che ti giro: nel forno elettrico la partita si sposta sul mix elettrico e sul rottame; nella vostra roadmap la cattura entra o resta un'opzione di lungo periodo?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 18 P2
add(first="Annalisa", last="Accarino", role="Head of IT Governance & Architecture", company="Fincantieri",
 city="Trieste", linkedin="https://it.linkedin.com/in/annalisa-accarino-08644553", domain="fincantieri.it",
 website="https://www.fincantieri.com", priority="P2",
 emails=["annalisa.accarino@fincantieri.it", "a.accarino@fincantieri.it"], ffcode="ff.42.3",
 focus="governance IT e architetture per la cantieristica, digitalizzazione dei processi produttivi",
 source_url="https://theorg.com/org/fincantieri-spa/org-chart/annalisa-accarino",
 message="""Ciao Annalisa,

in Fincantieri guidi IT Governance e Architecture, con una laurea in ingegneria ambientale e un passato tra Accenture e OverIT. Governare l'architettura in un gruppo cantieristico significa decidere cosa tenere sotto controllo diretto e cosa affidare a fornitori esteri.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, geopolitica ed economia. Ti lascio uno spunto in tema:

🐌 ff.42.3 Bastoni tra le AI-ruote — lo sviluppo tecnologico e militare è legato all'intelligenza artificiale, che a sua volta dipende dalla potenza di calcolo per l'addestramento. Il know-how su schede grafiche e nodi di calcolo resta in mano statunitense, NVIDIA e AMD, e da lì è partito un vero embargo di prodotti americani per rallentare le capacità di calcolo cinesi. L'effetto di lungo periodo somiglia a quello già visto sui microchip: Stati Uniti ed Europa stanno costruendo fabbriche di semiconduttori indipendenti, e la Cina potrebbe muoversi allo stesso modo sull'AI.

La domanda che ti giro: nelle scelte di architettura, la sovranità sul dato e sul calcolo è già un requisito formale o resta una preferenza?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 19 P2
add(first="Maurizio", last="Lancerin", role="Direttore Energy Management e AD Dolomiti Energia Trading", company="Gruppo Dolomiti Energia",
 city="Trento", linkedin="https://it.linkedin.com/in/mauriziolancerin", domain="dolomitienergia.it",
 website="https://www.gruppodolomitienergia.it", priority="P2",
 emails=["maurizio.lancerin@dolomitienergia.it", "maurizio.lancerin@gruppodolomitienergia.it"], ffcode="ff.50.4",
 focus="energy management, trading e ottimizzazione del portafoglio di produzione",
 source_url="https://www.gruppodolomitienergia.it/dam/corporate/documents/curriculum/Curriculum_Lancerin_Maurizio.pdf",
 message="""Ciao Maurizio,

dirigi l'Energy Management del Gruppo Dolomiti Energia e sei amministratore delegato di Dolomiti Energia Trading, quindi ottimizzazione di portafoglio e impianti di produzione. Il prezzo, nel tuo mestiere, è il segnale che decide tutto il resto.

Scrivo futuro fortissimo, newsletter italiana su energia, economia e tecnologia. Ti lascio uno spunto in tema:

🌟 ff.50.4 Consumisti ma non di energia — il consumo di energia pro capite è sostanzialmente fermo, nonostante l'esplosione demografica dell'ultimo secolo e mezzo. Le spiegazioni plausibili sono dematerializzazione e digitalizzazione, maggiori efficienze, remote working e infine il limite imposto dal costo dell'energia. Le prime tre dicono che la usiamo meglio; l'ultima è il collo di bottiglia vero, come si è visto dopo l'Ucraina su benzina e bollette. Rispetto ai giga di connessione o alla potenza di calcolo, l'energia resta la risorsa che non è diventata abbondante.

La domanda che ti giro: sulle curve di domanda che gestisci, l'elasticità al prezzo vista nel 2022 si è riassorbita o è rimasta un cambio strutturale?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 20 P2
add(first="Chiara", last="Faenza", role="Responsabile Sostenibilità", company="Coop Italia",
 city="Casalecchio di Reno (BO)", linkedin="https://www.linkedin.com/in/chiara-faenza-264b095/", domain="coopitalia.coop",
 website="https://www.e-coop.it", priority="P2",
 emails=["chiara.faenza@coopitalia.coop", "c.faenza@coopitalia.coop"], ffcode="ff.47.3",
 focus="sostenibilità dei prodotti a marchio, packaging, Istituto Italiano Imballaggio",
 source_url="https://www.csreinnovazionesociale.it/relatore/faenza-chiara/",
 message="""Ciao Chiara,

segui la sostenibilità di Coop Italia dal 2015 e sei vicepresidente dell'Istituto Italiano Imballaggio e della Fondazione Carta Etica del Packaging. Con una laurea in chimica industriale, immagino tu abbia poca pazienza per le discussioni sul packaging fatte senza numeri.

Scrivo futuro fortissimo, newsletter italiana su ambiente, consumi e tecnologia. Ti lascio uno spunto in tema:

🐧 ff.47.3 Lavatrici contro le microplastiche — le stime sulle microparticelle che entrano nel nostro corpo ogni anno: 50.000 mangiate, 100.000 inalate, 90.000 bevute da bottiglia di plastica e 4.000 dall'acqua del rubinetto. La parte controintuitiva è la fonte: il 35% delle microplastiche arriva dai bucati in lavatrice, non dai rifiuti degradati. Al CES, Patagonia ha presentato un programma di lavaggio che riduce del 54% la plastica rilasciata.

La domanda che ti giro: nella scelta dei materiali per i prodotti a marchio, quanto pesa l'impatto in uso rispetto a quello di fine vita, che è quello su cui si concentra la normativa?

Spunto completo: {url}

{cta}

Michele""")

assert len(R) == 20, len(R)

# ---------------------------------------------------------------- render
for i, r in enumerate(R):
    r["id"] = START_ID + i
    r["name"] = r["first"] + " " + r["last"]
    r["subject"] = "Spunto %s per %s" % (r["ffcode"], r["first"])
    r["msg"] = r["message"].replace("{url}", r["ff_url"]).replace("{cta}", CTA)
    r["words"] = len(r["msg"].split())

codes = [r["ffcode"] for r in R]
assert len(set(codes)) == 20, "ff codes non distinti"
assert len(set(r["name"] for r in R)) == 20

# ---------------------------------------------------------------- CSV
csv_path = "%s/batch%d_%s.csv" % (OUTDIR, BATCH, DATE)
cols = ["first_name", "last_name", "role", "company", "city_or_region", "linkedin_url",
        "email_public", "email_best", "guessed_emails", "website", "focus_theme", "why_match",
        "source_urls", "excerpt_text", "excerpt_id", "template_id", "template_subject",
        "priority", "status", "owner", "next_action"]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(cols)
    for r in R:
        w.writerow([
            r["first"], r["last"], r["role"], r["company"], r["city"], r["linkedin"],
            r.get("email_public", ""), r["emails"][0], " | ".join(r["emails"]), r["website"],
            r["focus"], "%s -> %s" % (r["focus"], r["ff_title"]), r["source_url"],
            r["ff_title"], r["ffcode"], "V3", r["subject"],
            r["priority"], "queued", "micmer.clawdbot", "create_gmail_draft_manual",
        ])

# ---------------------------------------------------------------- MD
md_path = "%s/batch%d_%s.md" % (OUTDIR, BATCH, DATE)
with open(md_path, "w", encoding="utf-8") as f:
    f.write("# FF outreach — batch %d (%s)\n\n" % (BATCH, DATE))
    f.write("20 lead nuovi, id %d-%d. Status: drafted, invio NON autorizzato.\n\n" % (R[0]["id"], R[-1]["id"]))
    for r in R:
        f.write("---\n\n## %d. %s — %s, %s (%s)\n\n" % (r["id"], r["name"], r["role"], r["company"], r["priority"]))
        f.write("- LinkedIn: %s\n- Email guess: %s\n- Fonte ruolo: %s\n- Spunto: `%s` — %s\n- Parole: %d\n\n" % (
            r["linkedin"], " | ".join(r["emails"]), r["source_url"], r["ffcode"], r["ff_url"], r["words"]))
        f.write("**Oggetto:** %s\n\n```\n%s\n```\n\n" % (r["subject"], r["msg"]))

# ---------------------------------------------------------------- tracker
shutil.copyfile(TRACKER, BACKUP)
T = json.load(open(TRACKER, encoding="utf-8"))
before_contacts = len(T["contacts"])
before_total = T["meta"]["total_drafted"]
before_ids = set(x["id"] for x in T["contacts"])
existing_names = set(x.get("name", "").strip().lower() for x in T["contacts"])

for r in R:
    assert r["id"] not in before_ids, "id duplicato: %d" % r["id"]
    assert r["name"].lower() not in existing_names, "nome duplicato: %s" % r["name"]
    T["contacts"].append({
        "id": r["id"], "name": r["name"], "role": r["role"], "org": r["company"],
        "channel": "email", "ff_post": r["ffcode"], "ff_post_title": r["ff_title"],
        "ff_post_url": r["ff_url"], "subject": r["subject"], "message": r["msg"],
        "emails_guessed": r["emails"], "words": r["words"], "status": "drafted",
        "date": DATE, "batch": BATCH, "send_authorized": False,
    })

T["meta"]["last_batch"] = BATCH
T["meta"]["last_batch_date"] = DATE
T["meta"]["updated"] = DATE
T["meta"]["total_drafted"] = before_total + 20
T["total_drafted"] = T.get("total_drafted", before_total) + 20
json.dump(T, open(TRACKER, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------------------------------------------------------------- verify
V = json.load(open(TRACKER, encoding="utf-8"))
ids = [x["id"] for x in V["contacts"]]
b89 = [x for x in V["contacts"] if x.get("batch") == BATCH]
print("BACKUP:            ", BACKUP)
print("contacts before:   ", before_contacts)
print("contacts after:    ", len(V["contacts"]))
print("batch 89 records:  ", len(b89))
print("duplicate ids:     ", len(ids) - len(set(ids)))
print("meta.total_drafted:", before_total, "->", V["meta"]["total_drafted"])
print("top total_drafted: ", V["total_drafted"])
print("id range:          ", min(x["id"] for x in b89), "-", max(x["id"] for x in b89))
print("distinct ff codes: ", len(set(x["ff_post"] for x in b89)))
print("words min/avg/max: ", min(x["words"] for x in b89),
      round(sum(x["words"] for x in b89) / 20), max(x["words"] for x in b89))
print("CSV:               ", csv_path)
print("MD:                ", md_path)
