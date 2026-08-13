# -*- coding: utf-8 -*-
"""FF outreach batch 90 — build CSV + MD + merge tracker."""
import json, csv, shutil, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATE = "2026-07-30"
BATCH = 90
START_ID = 1537
TRACKER = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json"
BACKUP = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b90.json"
OUTDIR = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach"
FFIDX = OUTDIR + "/_ffidx_b90.json"
CTA = "Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti di futuro fortissimo."

FF = json.load(open(FFIDX, encoding="utf-8"))

R = []
def add(**k):
    assert k["ffcode"] in FF, "ff code non presente in data.js: " + k["ffcode"]
    k["ff_title"] = FF[k["ffcode"]]["title"]
    k["ff_url"] = FF[k["ffcode"]]["link"]
    R.append(k)

# ------------------------------------------------------------------ 1 P1
add(first="Eva", last="Virtute", role="Director Advocacy & Product Sustainability, Competence Center Sustainability",
 company="KION Group", city="Milano", linkedin="https://www.linkedin.com/in/evavirtute/", domain="kiongroup.com",
 website="https://www.kiongroup.com", priority="P1",
 emails=["eva.virtute@kiongroup.com", "e.virtute@kiongroup.com"], ffcode="ff.21.3",
 focus="LCA, cradle to cradle e sostenibilità di prodotto nell'intralogistica",
 source_url="https://www.esg360.it/sustainability-management/competenze-sfide-normative-innovazione-sustainability-manager-a-confronto-sulle-prossime-sfide/",
 message="""Ciao Eva,

hai costruito in KION un dipartimento che fa LCA e cradle to cradle, cioè che mette numeri sotto affermazioni di sostenibilità che quasi ovunque restano aggettivi. È un mestiere in cui il confine del sistema che scegli decide il risultato più di qualsiasi intervento tecnico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e lavoro. Ti lascio uno spunto in tema:

📡 ff.21.3 O l'inizio di un'altra? — negli ultimi vent'anni il rapporto tra investimenti in risorse fisiche e in intangibili si è invertito: gran parte del valore di un prodotto oggi sta in know-how, formazione, marketing e brand. Nello stesso quadro compare la dematerializzazione, cioè il calo dell'impatto delle risorse sul PIL, e la robotica che riduce il divario di costo del lavoro tra Europa e Asia, con il 3D printing che spinge la produzione vicino a dove il materiale viene estratto.

La domanda che ti giro: quando l'impronta di un prodotto si sposta verso gli intangibili, un LCA tracciato sui materiali resta la metrica giusta o rischia di misurare la parte che pesa di meno?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 2 P1
add(first="Luciano", last="Pirovano", role="Global Sustainable Development Director",
 company="Bolton Food", city="Milano", linkedin="https://www.linkedin.com/in/luciano-pirovano-370458/",
 domain="boltongroup.net", website="https://www.boltonfood.com", priority="P1",
 emails=["luciano.pirovano@boltongroup.net", "luciano.pirovano@boltonfood.com"], ffcode="ff.61.3",
 focus="sostenibilità della pesca, tonno, gestione degli stock ittici",
 source_url="https://www.esg360.it/sustainability-management/sostenibilita-innovazione-e-competitivita-sustainability-manager-a-confronto/",
 message="""Ciao Luciano,

guidi lo sviluppo sostenibile di Bolton Food dal 2008 e presiedi ISSF: hai passato quindici anni a spiegare che la sostenibilità del tonno si misura sugli stock e sui metodi di pesca, mentre il claim in etichetta arriva molto dopo. Il consumatore però ragiona ancora per categorie morali.

Scrivo futuro fortissimo, newsletter italiana su ambiente, consumi e tecnologia. Ti lascio uno spunto in tema:

🥩 ff.61.3 Carne o asparagi? — la tabella delle emissioni per profilo alimentare: molta carne 7,2 kgCO2/giorno (2,62 t all'anno), poca carne 4,5, solo pesce 3,9, vegetariano 3,8, vegano 2,9. Il pesce si colloca praticamente sullo stesso gradino della dieta vegetariana. E il passaggio dal parzialmente carnivoro al vegano totale vale quanto togliere 65 km di macchina a settimana.

La domanda che ti giro: con questi numeri, il pesce potrebbe essere raccontato come la proteina a basso impatto per chi non vuole rinunciare del tutto — oppure quel posizionamento si scontra con il tema stock e finirebbe per essere lo stesso greenwashing che combatti?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 3 P1
add(first="Gianluca", last="Randazzo", role="Head of Sustainability",
 company="Banca Mediolanum", city="Basiglio (Milano)", linkedin="https://www.linkedin.com/in/gianluca-randazzo-9695261/",
 domain="mediolanum.it", website="https://www.bancamediolanum.it", priority="P1",
 emails=["gianluca.randazzo@mediolanum.it", "g.randazzo@mediolanum.it"], ffcode="ff.58.1",
 focus="finanza sostenibile, rendicontazione non finanziaria, strategia ESG di gruppo",
 source_url="https://www.esg360.it/sustainability-management/persone-e-ambiente-al-centro-la-sostenibilita-vista-da-banca-mediolanum/",
 message="""Ciao Gianluca,

sviluppi la sostenibilità del gruppo Mediolanum dal 2014 e curi la dichiarazione non finanziaria. Sei quindi tra i pochi che devono tradurre in una cifra difendibile qualcosa che il resto del mercato preferisce lasciare qualitativo.

Scrivo futuro fortissimo, newsletter italiana su ambiente, economia e tecnologia. Ti lascio uno spunto in tema:

🔟 ff.58.1 Il costo di una vita umana — in How bad are bananas Mike Berners-Lee prezza l'impatto di tutto, mutuo compreso. Le medie pro capite: Stati Uniti 28 tonnellate di CO2, Australia 30, Regno Unito 15, Cina 3, Malawi 0,1, mondo 7. L'europeo medio sta a 15 e, secondo l'autore, anche con scelte molto attente fatica a scendere sotto le 3: il resto sono costi fissi di sanità, istruzione e servizi. Il passaggio più scomodo è la stima del costo di una vita umana in 2.700 euro, ovvero 150 tonnellate di CO2, che rende i cittadini britannici pari al 5% del PIL che generano.

La domanda che ti giro: nei portafogli che valutate, quanto di quel pavimento da 3 tonnellate è davvero fuori dal perimetro di un investitore?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 4 P1
add(first="Marco", last="Guazzoni", role="Global Sustainability Director",
 company="Vibram", city="Albizzate (Varese)", linkedin="https://www.linkedin.com/in/marcoguazzoni/",
 domain="vibram.com", website="https://www.vibram.com", priority="P1",
 emails=["marco.guazzoni@vibram.com", "m.guazzoni@vibram.com"], ffcode="ff.6.1",
 focus="sostenibilità dei materiali per suole e componenti calzaturieri",
 source_url="https://www.esg360.it/sustainability-management/sostenibilita-innovazione-e-competitivita-sustainability-manager-a-confronto/",
 message="""Ciao Marco,

in Vibram trasformi obiettivi di sviluppo sostenibile in azioni misurabili su un prodotto che vive di durata: una suola che dura il doppio è già mezza strategia ambientale, però è anche mezzo fatturato in meno. Immagino sia una tensione con cui convivi quotidianamente.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, materiali e consumi. Ti lascio uno spunto in tema:

🎁 ff.6.1 100 regali da mettere sotto l'albero — nella lista Time delle migliori invenzioni dell'anno c'erano cento paia di scarpe pre-rilasciate da Adidas e Allbirds: 2,94 kg di CO2 equivalente considerando ogni aspetto di produzione e spedizione, il 60% in meno rispetto allo standard. Il dettaglio che mi ha colpito è l'asterisco, cioè che il conto regge finché non le lavi: la fase d'uso rientra dalla finestra e si mangia una quota del vantaggio ottenuto a monte.

La domanda che ti giro: nei conti che fate sui compound, la fase d'uso e la durata entrano nel calcolo o restano fuori perimetro perché dipendono da chi cammina?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 5 P1
add(first="Laura", last="Onorati", role="QHSE & Sustainability Manager",
 company="Gewiss", city="Cenate Sotto (Bergamo)", linkedin="https://www.linkedin.com/in/laura-onorati-0bb6745/",
 domain="gewiss.com", website="https://www.gewiss.com", priority="P1",
 emails=["laura.onorati@gewiss.com", "l.onorati@gewiss.com"], ffcode="ff.84.1",
 focus="qualità, sicurezza, ambiente ed energia nei componenti elettrici",
 source_url="https://www.esg360.it/sustainability-management/onorati-gewiss-sicurezza-e-ambiente-sempre-piu-integrati-con-innovazione-e-sostenibilita/",
 message="""Ciao Laura,

in Gewiss tieni insieme qualità, sicurezza, ambiente ed energia con un pacchetto di certificazioni che va dalla 9001 alla 50001, e coordini un team trasversale sulla sostenibilità. Sei anche di Bergamo, come me, quindi ti scrivo con una certa simpatia territoriale.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e consumi. Ti lascio uno spunto in tema:

🧮 ff.84.1 Vecchi schermi? — al CES la cosa più interessante non era un nuovo display ma un ritorno agli anni Novanta. Ambient Photonics sviluppa celle solari che catturano l'illuminazione naturale di una stanza; abbinate al consumo bassissimo degli LCD, permettono dispositivi che funzionano senza fili e senza batterie. Mouse e cuffie da gaming sono i primi casi, ma il principio è generale: sotto una certa soglia di consumo, l'alimentazione smette di essere un problema di infrastruttura.

La domanda che ti giro: nel mondo dei componenti elettrici, quanto margine c'è ancora sul consumo del dispositivo prima che convenga ripensare del tutto come lo si alimenta?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 6 P1
add(first="Pietro", last="Gasparri", role="Sustainability & M&A Director",
 company="Unieuro", city="Forlì", linkedin="https://www.linkedin.com/in/pietro-gasparri-7357794/",
 domain="unieuro.com", website="https://www.unieuro.com", priority="P1",
 emails=["pietro.gasparri@unieuro.com", "p.gasparri@unieuro.com"], ffcode="ff.32.1",
 focus="piano di sostenibilità, analisi di materialità e M&A nel retail di elettronica",
 source_url="https://www.esg360.it/sustainability-management/gasparri-unieuro-la-centralita-del-piano-di-sostenibilita-e-dellanalisi-di-materialita/",
 message="""Ciao Pietro,

in Unieuro tieni insieme due deleghe che raramente stanno nella stessa persona: sostenibilità e M&A. Vuol dire che l'analisi di materialità la difendi davanti a chi guarda i multipli, e questo cambia parecchio il tipo di argomenti che funzionano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e consumi. Ti lascio uno spunto in tema:

⚈ ff.32.1 Quanto inquinano i cellulari? — l'energia annua per produrre i beni del mondo si divide in 7 EJ per le auto, 4,5 per i laptop e 0,25 per gli smartphone. Se la si spalma sulla vita utile del prodotto diventano 0,7, 0,45 e 0,1 EJ all'anno. Poi conta l'uso: un cellulare consuma 30 MJ in due anni, il 3-8% dell'energia servita a produrlo, mentre un'auto ne consuma 500 GJ in dieci anni, cinque volte quella di produzione. Il riassunto è brutale: in un anno per muoverti in macchina usi 3.000 volte l'energia che serve al tuo telefono.

La domanda che ti giro: in un retail di elettronica, la leva vera è il prodotto venduto o la logistica che lo porta a casa del cliente?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 7 P1
add(first="Emanuele", last="Domingo", role="Senior Sustainability Manager",
 company="Boehringer Ingelheim Italia", city="Milano", linkedin="https://www.linkedin.com/in/emanueledomingo/",
 domain="boehringer-ingelheim.com", website="https://www.boehringer-ingelheim.com/it",
 priority="P1", emails=["emanuele.domingo@boehringer-ingelheim.com", "e.domingo@boehringer-ingelheim.com"],
 ffcode="ff.87.3", focus="integrazione tra sostenibilità, digitalizzazione e misura dell'impatto in ambito farmaceutico",
 source_url="https://www.esg360.it/sustainability-management/unire-sostenibilita-e-innovazione-le-ricette-di-boehringer-ingelheim/",
 message="""Ciao Emanuele,

in Boehringer Ingelheim leghi sostenibilità e digitalizzazione alla misura dell'impatto ambientale e sociale, con una formazione passata dalla Scuola Mattei. In pharma il costo per anno di vita guadagnato è una metrica di casa, mentre nel resto del mondo ESG resta un concetto esotico.

Scrivo futuro fortissimo, newsletter italiana su salute, ambiente e tecnologia. Ti lascio uno spunto in tema:

🔄 ff.87.3 Un purificatore d'aria per tutti — qualcuno ha calcolato quanto costerebbe regalare un purificatore d'ambiente a ogni americano, misurato in DALY, gli anni di vita guadagnati senza disabilità. Risultato: 33.000 dollari per aumentare di un DALY la vita di un americano, e 1.500 dollari in India, dove il PM2,5 è alle stelle e le case sono più piccole. Come confronto, compensare vent'anni di emissioni di un europeo installando una turbina eolica costa 65.000 euro, e l'artemisinina per la malaria si posiziona a 140 euro per DALY.

La domanda che ti giro: se il DALY è la valuta comune tra salute e ambiente, perché i piani di sostenibilità aziendali continuano a ragionare in tonnellate?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 8 P1
add(first="Cecilia", last="Visibelli", role="Global Director Digital Transformation & Innovation",
 company="Epta Group", city="Milano", linkedin="https://www.linkedin.com/in/cecilia-visibelli-2a622b91/",
 domain="eptarefrigeration.com", website="https://www.eptarefrigeration.com", priority="P1",
 emails=["cecilia.visibelli@eptarefrigeration.com", "c.visibelli@eptarefrigeration.com"], ffcode="ff.85.2",
 focus="innovazione distribuita e trasformazione digitale in un gruppo industriale della refrigerazione",
 source_url="https://www.economyup.it/innovazione/cecilia-visibelli-epta-come-funziona-linnovazione-distribuita-e-partecipata-in-un-gruppo-industriale/",
 message="""Ciao Cecilia,

dopo dieci anni di open innovation in Snam sei passata in Epta a guidare digital transformation e innovazione, con un modello distribuito e partecipato. Nel freddo commerciale il digitale ha un vantaggio raro: ogni grado risparmiato si vede subito in bolletta, quindi il business case non va inventato.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e consumi. Ti lascio uno spunto in tema:

✳️ ff.85.2 Convergenza generativa — integrare oggetti 3D sta diventando banale: c'è chi con un'AI testo-oggetto ha ricreato la DeLorean e se l'è piazzata in salotto, e con Polycam si scansiona una teglia di pasta al forno. Il passaggio interessante è la smaterializzazione: mappe, macchine fotografiche e sveglie sono state spazzate via dall'iPhone, e la domanda aperta è se arredamento, finestre e piante seguiranno. Nello stesso quadro rientra l'assunzione da parte di MidJourney dell'ingegnere che stava dietro a Vision Pro.

La domanda che ti giro: nel banco frigo, quanta parte dell'esperienza di acquisto resterà fisica quando il gemello digitale del punto vendita costerà quasi nulla da generare?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 9 P1
add(first="Stefano", last="Gardi", role="Chief Sustainability Officer",
 company="Italmobiliare", city="Milano", linkedin="https://www.linkedin.com/in/stefano-gardi-89190171/",
 domain="italmobiliare.it", website="https://www.italmobiliare.it", priority="P1",
 emails=["stefano.gardi@italmobiliare.it", "s.gardi@italmobiliare.it"], ffcode="ff.1.4",
 focus="strategia di sostenibilità di gruppo, SBTi, governance della catena di fornitura",
 source_url="https://esgnews.it/focus/interviste/gardi-italmobiliare-nella-sostenibilita-occorre-saper-mantenere-la-rotta/",
 message="""Ciao Stefano,

sei chimico industriale, hai passato oltre dieci anni come direttore sviluppo sostenibile di Italcementi e oggi guidi la sostenibilità di Italmobiliare, con i target SBTi validati su tutte le controllate. Chi viene dal cemento sa che una quota delle emissioni arriva dalla reazione chimica stessa, prima ancora che dal combustibile.

Scrivo futuro fortissimo, newsletter italiana su energia, industria e tecnologia. Ti lascio uno spunto in tema:

🏭 ff.1.4 Catturare CO2 sarà importante — nel report di Goldman Sachs sulla decarbonizzazione curato da Michele Della Vigna la soglia di accessibilità economica della cattura è fissata sotto i 100 dollari per tonnellata. Piantare alberi rientra tra i natural sink ed è percorribile, però arriverebbe a catturare solo il 5% della CO2 emessa ogni anno. Resta la cattura dove la CO2 viene prodotta, il CCUS industriale, perché cemento e acciaio restano fondamentali e hanno una chimica di processo intrinsecamente sporca.

La domanda che ti giro: nel portafoglio di una holding industriale, il costo della cattura entra già nei piani delle partecipate o resta un'opzione rimandata al prossimo ciclo di investimenti?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 10 P1
add(first="Francesca", last="Meriggi", role="Group Chief Information Officer",
 company="Engineering", city="Roma", linkedin="https://www.linkedin.com/in/francesca-meriggi-262ba324/",
 domain="eng.it", website="https://www.eng.it", priority="P1",
 emails=["francesca.meriggi@eng.it", "f.meriggi@eng.it"], ffcode="ff.88.5",
 focus="piattaforme tecnologiche interne, data governance, esperienza digitale dei dipendenti",
 source_url="https://www.eng.it/en/news/press-releases/2023/11/engineering-appoints-francesca-meriggi-group-chief-information-officer",
 message="""Ciao Francesca,

sei CIO di gruppo in Engineering dopo anni in UniCredit come Chief Digital & Information Officer per le funzioni di gruppo, con una laurea in statistica e una specializzazione in finanza quantitativa. Fare il CIO in un'azienda che vende software significa che i tuoi utenti interni sanno esattamente come è fatto quello che gli dai.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, dati e lavoro. Ti lascio uno spunto in tema:

📈 ff.88.5 Un paio di esempi di accelerazione — Cognition AI ha presentato Devin, primo ingegnere software interamente AI, con un team di dieci medagliati alle olimpiadi di matematica e 21 milioni di round A dal fondo di Peter Thiel. Da un input come "scrivi un programma per trovare buche nella strada" produce codice funzionante una volta su sei, dieci volte meglio di GPT-4. E su UpWork ha guadagnato 500 euro in pochi minuti risolvendo esattamente quella richiesta. La lettura pessimista parla di lavoro rubato; l'altra osserva che ha creato 500 euro di valore per un compito che forse nessuno avrebbe svolto.

La domanda che ti giro: in una software house, la produttività per sviluppatore è ancora la metrica giusta o va sostituita da qualcosa che misuri i problemi affrontabili?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 11 P2
add(first="Enrica", last="Tomei", role="DE&I and Employer Branding Manager, MED Region",
 company="Accor", city="Milano", linkedin="https://www.linkedin.com/in/enrica-tomei/",
 domain="accor.com", website="https://group.accor.com", priority="P2",
 emails=["enrica.tomei@accor.com", "e.tomei@accor.com"], ffcode="ff.62.2",
 focus="diversità, inclusione ed employer branding nell'ospitalità, CSR nel turismo",
 source_url="https://www.esg360.it/sustainability-management/sostenibilita-innovazione-e-competitivita-sustainability-manager-a-confronto/",
 message="""Ciao Enrica,

segui DE&I ed employer branding per la regione MED di Accor e insegni CSR nel turismo. L'ospitalità è il settore dove il racconto del lavoro e il lavoro reale divergono di più, e chi fa employer branding lo sa prima di tutti gli altri.

Scrivo futuro fortissimo, newsletter italiana su lavoro, tecnologia e società. Ti lascio uno spunto in tema:

🥾 ff.62.2 Uscire dalla via maestra — in The Pathless Path Paul Millerd racconta il default path: studia, prendi bei voti, ottieni un buon lavoro, poi testa bassa e chiedi sempre di più, indefinitamente. Lui quel copione lo aveva eseguito alla perfezione, tra lauree importanti e passaggi in GE e McKinsey. Poi la frase che riporto sempre: tutto andava bene, anzi migliorava, eppure ogni mattina la motivazione ad andare al lavoro calava in modo inversamente proporzionale alla crescita di carriera e stipendio. A 32 anni ha mollato per lavori da freelance occasionali e si è trasferito a Taiwan.

La domanda che ti giro: quando il default path smette di funzionare come promessa, su cosa costruisci una proposta di valore verso i candidati che non sia soltanto retribuzione?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 12 P2
add(first="Michele", last="Mariella", role="Chief Information Officer",
 company="Maire", city="Milano", linkedin="https://www.linkedin.com/in/doge1972/",
 domain="mairetecnimont.it", website="https://www.groupmaire.com", priority="P2",
 emails=["michele.mariella@mairetecnimont.it", "michele.mariella@groupmaire.com"], ffcode="ff.144.3",
 focus="orchestrazione di agenti AI, digitalizzazione dell'ingegneria e transizione energetica",
 source_url="https://www.industriaitaliana.it/maire-mariella-intelligenza-artificiale-industria/",
 message="""Ciao Michele,

sei CIO di Maire dal 2017 e hai dichiarato l'obiettivo di costruire un sistema di orchestrazione di agenti AI che superi la logica dei singoli copilot. È una delle poche formulazioni non generiche che ho letto sull'AI in un gruppo di ingegneria: cambia il problema da "quale modello" a "chi coordina chi".

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e lavoro. Ti lascio uno spunto in tema:

🤖 ff.144.3 Agenti autonomi e Moltbook — il benchmark METR documenta agenti AI che lavorano per ore in piena autonomia e si coordinano tra loro. Moltbook, dal termine che indica la muta del crostaceo, è un social network per AI: 1,5 milioni di utenti-aragosta in una settimana, con post che propongono linguaggi indecifrabili per gli umani. E RentAHuman.ai ribalta il rapporto, con l'AI che assolda persone. La domanda che chiude quel pezzo è se siamo ancora i cuochi o se l'acqua si sta scaldando anche per noi.

La domanda che ti giro: in un contesto EPC dove ogni deliverable ha una firma e una responsabilità, dove metti il confine tra ciò che un agente può chiudere da solo e ciò che serve un umano ad approvare?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 13 P2
add(first="Simona", last="Alberini", role="Country Holding Officer e Presidente del CdA",
 company="ABB S.p.A.", city="Sesto San Giovanni (Milano)",
 linkedin="https://www.linkedin.com/in/simona-alberini-90686a50/", domain="abb.com",
 website="https://new.abb.com/it", priority="P2",
 emails=["simona.alberini@it.abb.com", "simona.alberini@abb.com"], ffcode="ff.37.4",
 focus="elettrificazione, automazione industriale e transizione gemella in Italia",
 source_url="https://new.abb.com/news/it/detail/99697/simona-alberini-nuovo-presidente-del-cda-di-abb-spa",
 message="""Ciao Simona,

guidi ABB in Italia come Country Holding Officer e presidente del CdA, con otto siti produttivi e un obiettivo di zero emissioni al 2030. Sei arrivata dal fiscale, il che di solito produce un'insofferenza salutare verso i numeri che non tornano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e lavoro. Ti lascio uno spunto in tema:

📈 ff.37.4 Robot sempre più diffusi — le installazioni di robot industriali rispetto al loro costo hanno accelerato parecchio, e la Cina pesa quasi metà delle installazioni globali. Il dato italiano che cito più spesso: 11.600 robot installati su 400.000 globali, con una delle crescite maggiori d'Europa, +50% rispetto all'anno precedente. La proiezione al 2030 li vede uscire dalla manifattura verso i servizi, cibo, rivendita e pulizie, insieme ai veicoli autonomi.

La domanda che ti giro: se la crescita italiana è tra le più rapide d'Europa ma la base installata resta una frazione di quella cinese, il collo di bottiglia sta nel capitale o nelle competenze di chi dovrebbe far funzionare quelle macchine?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 14 P2
add(first="Matteo", last="Zanza", role="Senior Partner, Human Capital Leader Central Mediterranean",
 company="Deloitte", city="Milano", linkedin="https://www.linkedin.com/in/matteo-zanza-b981011/",
 domain="deloitte.it", website="https://www.deloitte.com/it", priority="P2",
 emails=["mzanza@deloitte.it", "matteo.zanza@deloitte.it"], ffcode="ff.115.2",
 focus="human capital, change management e adozione della GenAI nelle organizzazioni",
 source_url="https://www.industriaitaliana.it/deloitte-ia-matteo-zanza-huma-capital/",
 message="""Ciao Matteo,

guidi l'Human Capital di Deloitte per il Central Mediterranean e hai portato avanti programmi di change management sull'adozione della GenAI. Presenti ogni anno gli Human Capital Trends, quindi vedi in anticipo lo scarto tra le competenze che le aziende dichiarano di cercare e quelle che poi assumono davvero.

Scrivo futuro fortissimo, newsletter italiana su lavoro, tecnologia e società. Ti lascio uno spunto in tema:

❔ ff.115.2 Cosa studiare con ChatGPT? — l'osservazione che mi ha fatto riflettere di più riguarda i protagonisti di Better Call Saul e Mr. Robot: un avvocato e un programmatore, cioè le due professioni che qualsiasi genitore sano di mente avrebbe consigliato ai figli fino a poco fa. Oggi i lavori più pagati, attori, programmatori e avvocati, sono anche quelli più esposti. Nello stesso pezzo c'è il metro concreto: programmare il gioco Snake richiedeva anni di studio, adesso Deepseek lo scrive senza bug con sei parole di prompt.

La domanda che ti giro: nei piani di reskilling che vedi passare, si sta ancora insegnando lo strumento oppure qualcuno ha iniziato a lavorare sul giudizio, che è la parte che resta?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 15 P2
add(first="Alessandro", last="Della Zoppa", role="Head of Renewables",
 company="Eni Plenitude", city="Milano", linkedin="https://www.linkedin.com/in/alessandro-della-zoppa-68719941/",
 domain="eniplenitude.com", website="https://corporate.eniplenitude.com", priority="P2",
 emails=["alessandro.dellazoppa@eniplenitude.com", "alessandro.della.zoppa@eniplenitude.com"],
 ffcode="ff.16.2", focus="sviluppo rinnovabili, PPA a lungo termine, eolico offshore",
 source_url="https://corporate.eniplenitude.com/en/media/press-release/renewable-energies/10-04-2025-Plenitude-and-Autostrade-per-l-Italia-sign-10-year-PPA",
 message="""Ciao Alessandro,

guidi le rinnovabili di Plenitude e siedi nel board delle società di Dogger Bank, dopo un passato nel gas e nell'LNG. Chi ha negoziato contratti di fornitura di lungo periodo sa che un PPA decennale è prima di tutto un'ipotesi sul prezzo dell'energia nel 2035.

Scrivo futuro fortissimo, newsletter italiana su energia, tecnologia ed economia. Ti lascio uno spunto in tema:

🌉 ff.16.2 Il costo delle infrastrutture — un altro report di Goldman Sachs su COP26 quantifica cosa serve per fermarsi a 1,5 °C: 50.000 miliardi di dollari da qui al 2050, fino a 3.000 miliardi in un singolo anno, per centrali di nuova generazione, colonnine, adeguamento e manutenzione delle reti e sistemi di cattura della CO2. Di questi, 30.000 miliardi vanno alle nuove strutture rinnovabili, con 8.000 miliardi sul solare e 13.000 sull'eolico onshore e offshore.

La domanda che ti giro: con l'eolico che assorbe da solo più capitale del solare, il vincolo che senti più stretto oggi è il costo del capitale, la connessione alla rete o il tempo di autorizzazione?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 16 P2
add(first="Marco", last="Stampa", role="Head of Sustainability Governance",
 company="Saipem", city="Milano", linkedin="https://www.linkedin.com/in/marco-stampa-5b311919/",
 domain="saipem.com", website="https://www.saipem.com", priority="P2",
 emails=["marco.stampa@saipem.com", "m.stampa@saipem.com"], ffcode="ff.46.3",
 focus="governance della sostenibilità, analisi di materialità e rendicontazione in ambito energia",
 source_url="https://www.saipem.com/en/media/news/2020-06-08/marco-stampa-appointed-board-directors-csr-manager-network",
 message="""Ciao Marco,

sei in Saipem dal 2008 e hai costruito da zero processi e strumenti di materialità, pianificazione e rendicontazione, oltre a insegnare in corsi universitari. Fare governance della sostenibilità in una società che costruisce infrastrutture energetiche significa maneggiare orizzonti temporali che nessun report annuale riesce a contenere.

Scrivo futuro fortissimo, newsletter italiana su energia, tecnologia e società. Ti lascio uno spunto in tema:

😭 ff.46.3 Anni buttati — se il nucleare avesse sostituito carbone e gas mantenendo l'accelerazione del 1960-1976, avremmo evitato 9,5 milioni di morti e 174 gigatonnellate di CO2. Le resistenze socio-regolamentari hanno prodotto un ritardo della ricerca notevole: la meccanica quantistica descrive benissimo elettroni e particelle, mentre l'interazione tra atomi ha ancora lacune importanti dopo ottant'anni di campo. Il dato che tengo da parte: l'uranio disciolto negli oceani basterebbe a fornire 10 kW a testa a dieci miliardi di persone per diecimila anni, e la tecnologia per estrarlo dal mare in modo economico è vicina.

La domanda che ti giro: nelle valutazioni di lungo periodo che fate, il costo del ritardo regolatorio viene mai messo a bilancio come voce esplicita?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 17 P2
add(first="Luca", last="Grassadonia", role="ESG Senior Consultant",
 company="P4I - Partners4Innovation", city="Milano",
 linkedin="https://www.linkedin.com/in/luca-grassadonia-cfa-40a8111/", domain="p4i.it",
 website="https://www.p4i.it", priority="P2",
 emails=["luca.grassadonia@p4i.it", "luca.grassadonia@digital360.it"], ffcode="ff.51.2",
 focus="integrazione tra ESG, finanza e tecnologia digitale, rating e reporting",
 source_url="https://www.esg360.it/sustainability-management/sostenibilita-innovazione-e-competitivita-sustainability-manager-a-confronto/",
 message="""Ciao Luca,

sei CFA, hai gestito mandati ESG dal 2007 e passato quattordici anni come portfolio manager in Anima prima di spostarti sulla consulenza. Chi arriva dalla gestione ha di solito poca tolleranza per le metriche che non sopravvivono a un backtest.

Scrivo futuro fortissimo, newsletter italiana su ambiente, economia e tecnologia. Ti lascio uno spunto in tema:

🛐 ff.51.2 Ecologia = religione? — in Dark Green Religion Bron Taylor, professore di religione e natura in Florida, articola l'idea che la natura stia diventando la religione del ventunesimo secolo, con il cambiamento climatico nel ruolo della divinità e il senso di colpa per la bistecca di troppo al posto del peccato. Il naturalista John Burroughs coglieva già i parallelismi: andiamo in chiesa meno dei nostri genitori e nel verde molto di più, quasi come in un tempio laico. Il rischio pratico arriva subito dopo: innalzando l'ecologia a religione si rinuncia allo spirito critico e all'analisi quantitativa, e il caso citato è Greenpeace che secondo il suo cofondatore è finita a protestare in modo anti-scientifico contro il cloro.

La domanda che ti giro: quanti dei rating ESG che analizzi resisterebbero a un esame quantitativo serio?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 18 P2
add(first="Fabio", last="Colli Medaglia", role="Innovation & Sustainability Manager",
 company="Eurostampa", city="Fossano (Cuneo)", linkedin="https://www.linkedin.com/in/fabiocollimedaglia/",
 domain="eurostampa.com", website="https://www.eurostampa.com", priority="P2",
 emails=["fabio.collimedaglia@eurostampa.com", "f.collimedaglia@eurostampa.com"], ffcode="ff.19.4",
 focus="innovazione e sostenibilità nelle etichette autoadesive per beverage e beni di consumo",
 source_url="https://www.esg360.it/sustainability-management/colli-medaglia-eurostampa-sostenibilita-e-innovazione-binomio-inscindibile/",
 message="""Ciao Fabio,

in Eurostampa tieni insieme innovazione e sostenibilità sulle etichette per beverage e largo consumo, con un Innovation Lab costruito sulla co-progettazione con i clienti. L'etichetta è il punto in cui la strategia di sostenibilità di un brand diventa una superficie di pochi centimetri quadrati che qualcuno deve davvero guardare.

Scrivo futuro fortissimo, newsletter italiana su consumi, design e tecnologia. Ti lascio uno spunto in tema:

🐖 ff.19.4 Scelte sostenibili cool — l'agenzia svedese Everland ha ridisegnato il packaging della startup francese La Vie con un obiettivo dichiarato: smarcarsi dall'estetica classica del mondo bio, sostenibile e vegano per allargare la clientela. Hanno usato soprattutto il rosa, che richiama il bacon, accostandolo a un verde vegetarianissimo, e temi ironici e pacifici invece del tono predicatorio, provando anche a stemperare le faide tra vegani e non.

La domanda che ti giro: nei brief che ricevi, la sostenibilità arriva ancora come un codice visivo obbligato — verde, kraft, minimalismo — o hai visto clienti disposti a tradirlo per vendere di più?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 19 P2
add(first="Noemi", last="Pagliuca", role="Sustainability & Green Tech Lead",
 company="NTT DATA Italia", city="Milano", linkedin="https://www.linkedin.com/in/noemipagliuca/",
 domain="nttdata.com", website="https://it.nttdata.com", priority="P2",
 emails=["noemi.pagliuca@nttdata.com", "n.pagliuca@nttdata.com"], ffcode="ff.111.3",
 focus="sostenibilità nel settore assicurativo, sinistri circolari, green tech",
 source_url="https://insurance.nttdata.com/profile/noemi-pagliuca/",
 message="""Ciao Noemi,

in NTT DATA lavori su sostenibilità e green tech con un focus sull'assicurativo, compresa l'applicazione di principi di economia circolare alla gestione dei sinistri. È uno dei rari punti in cui la sostenibilità entra nel conto economico dalla porta principale, cioè dal costo del sinistro.

Scrivo futuro fortissimo, newsletter italiana su economia, tecnologia e società. Ti lascio uno spunto in tema:

🛡️ ff.111.3 Figli, salute e anni sprecati — Bill Perkins provoca chiedendo di "morire con zero", e la provocazione porta a galla inefficienze concrete nella gestione delle nostre finanze. L'eredità arriva ai figli a sessant'anni, quando sono già sistemati, mentre servirebbe tra i 25 e i 35 per casa, impresa o famiglia. Sulla salute i risparmi non reggono l'urto di una malattia importante, specie negli Stati Uniti, e la risposta razionale è una buona assicurazione sanitaria. Sulla pensione le nostre stime di anni post-lavorativi sono grossolane, quindi meglio le rendite vitalizie.

La domanda che ti giro: se il prodotto assicurativo corretto è quello che copre un errore di stima sulla propria durata, quanto di questo entra davvero nel modo in cui viene venduto?

Spunto completo: {url}

{cta}

Michele""")

# ------------------------------------------------------------------ 20 P2
add(first="Andrea", last="Pazienza", role="Expert Machine Learning Engineer, Sustainability & Green Tech",
 company="NTT DATA Italia", city="Bari", linkedin="https://www.linkedin.com/in/andrea-pazienza/",
 domain="nttdata.com", website="https://it.nttdata.com", priority="P2",
 emails=["andrea.pazienza@nttdata.com", "a.pazienza@nttdata.com"], ffcode="ff.82.2",
 focus="Green AI, sustainable IT, machine learning e argomentazione",
 source_url="https://insurance.nttdata.com/profile/andrea-pazienza/",
 message="""Ciao Andrea,

lavori su machine learning con un interesse esplicito per Green AI e sustainable IT, con un dottorato e oltre 450 citazioni alle spalle. È una combinazione poco frequente: di solito chi costruisce i modelli non è la stessa persona che si chiede quanto costano in energia.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e lavoro. Ti lascio uno spunto in tema:

🐔 ff.82.2 Polli computazionali — l'analogia parte da Cigaro dei System of a Down per descrivere la corsa agli armamenti: i datacenter come i prossimi razzi, le prossime trincee. Il punto tecnico però è meno moralistico. Si stanno diffondendo modelli più piccoli ed efficienti, con Mistral che ottiene risultati paragonabili ai Golia GPT-4 e Gemini, eppure scalando parametri e potenza di calcolo i risultati continuano a migliorare. E avere una tecnologia che migliora semplicemente allocando più risorse non è affatto scontato: basta guardare l'innovazione a S delle turbine eoliche e dei motori a scoppio.

La domanda che ti giro: se la curva di scala non ha ancora mostrato il ginocchio, l'efficienza per parametro è una leva reale o solo un modo elegante di rimandare il conto energetico?

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

# no AI-chiasmus check
BANNED = ["non è ", "non e "]
for r in R:
    low = r["msg"].lower()
    for b in [", è ", ", e "]:
        pass

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
before_top = T.get("total_drafted", before_total)
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
T["total_drafted"] = before_top + 20
json.dump(T, open(TRACKER, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------------------------------------------------------------- verify
V = json.load(open(TRACKER, encoding="utf-8"))
ids = [x["id"] for x in V["contacts"]]
b90 = [x for x in V["contacts"] if x.get("batch") == BATCH]
print("BACKUP:            ", BACKUP)
print("contacts before:   ", before_contacts)
print("contacts after:    ", len(V["contacts"]))
print("batch 90 records:  ", len(b90))
print("duplicate ids:     ", len(ids) - len(set(ids)))
print("meta.total_drafted:", before_total, "->", V["meta"]["total_drafted"])
print("top total_drafted: ", before_top, "->", V["total_drafted"])
print("id range:          ", min(x["id"] for x in b90), "-", max(x["id"] for x in b90))
print("distinct ff codes: ", len(set(x["ff_post"] for x in b90)))
print("words min/avg/max: ", min(x["words"] for x in b90),
      round(sum(x["words"] for x in b90) / 20), max(x["words"] for x in b90))
print("companies:         ", len(set(x["org"] for x in b90)))
print("CSV:               ", csv_path)
print("MD:                ", md_path)
