# -*- coding: utf-8 -*-
"""FF outreach — build batch 97 (2026-08-13).
Genera batch97_2026-08-13.csv + .md e fa il merge nel tracker canonico.
"""
import json, csv, io, sys, os, shutil, collections

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
IDXP = os.path.join(OUT, '_ffidx_b97.json')
DATE = '2026-08-13'
BATCH = 97
START_ID = 1673

IDX = json.load(open(IDXP, encoding='utf-8'))

CTA = ("Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, "
       "o semplicemente vederti tra gli iscritti di futuro fortissimo.")

L = []


def lead(first, last, role, company, city, li, best, guesses, site, theme, why, srcs, ff, body):
    L.append(dict(first=first, last=last, role=role, company=company, city=city,
                  li=li, best=best, guesses=guesses, site=site, theme=theme,
                  why=why, srcs=srcs, ff=ff, body=body.strip()))


# ---------------------------------------------------------------- 1
lead(
    'Astrid', 'Palmieri',
    'Chief Sustainability Officer', 'Esselunga', 'Milano',
    'https://www.linkedin.com/in/astridpalmieri/',
    'astrid.palmieri@esselunga.it',
    ['astrid.palmieri@esselunga.it', 'a.palmieri@esselunga.it', 'astrid.palmieri@esselunga.com'],
    'https://www.esselunga.it/',
    'emissioni del cibo e decarbonizzazione della filiera nella grande distribuzione',
    'guida la sostenibilità di un retailer alimentare e ha legato il piano climatico alla decarbonizzazione dei fornitori',
    ['https://www.linkedin.com/in/astridpalmieri/',
     'https://www.theconsumergoodsforum.com/news_updates/esselunga-joins-the-climate-transition-coalition-of-action/'],
    'ff.19.1',
    """
Ciao Astrid,

sei Chief Sustainability Officer in Esselunga, arrivata alla grande distribuzione dopo vent'anni tra chimica ed energia. Quando Esselunga è entrata nella Climate Transition Coalition hai detto una cosa che mi è rimasta: il piano climatico di un retailer dipende dalla decarbonizzazione dei suoi fornitori.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta esattamente sul confine tra scaffale e filiera:

💦 ff.19.1 Flatulenze inquinanti — i bovini, con il metano dello stomaco ruminante, pesano in CO2 equivalente più degli Stati Uniti, e quelle emissioni sono paragonabili a quelle di tutti i trasporti mondiali messi insieme. Our World in Data scompone poi l'inquinamento del cibo separando uso della terra, mangimi, processing e trasporto del prodotto finito: i cibi vegetali stanno in media dieci volte sotto le controparti animali, il latte inquina tre volte il suo peso mentre quello di soia un terzo, e le nocciole arrivano a compensare grazie al basso impatto sull'uso del suolo.

È il livello di granularità a cui un assortimento si decide davvero, categoria per categoria.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 2
lead(
    'Giovanna', 'Zacchi',
    'Head of ESG Strategy', 'BPER Banca', 'Modena',
    'https://it.linkedin.com/in/giovanna-zacchi-38982763',
    'giovanna.zacchi@bper.it',
    ['giovanna.zacchi@bper.it', 'g.zacchi@bper.it', 'giovanna.zacchi@bpergroup.it'],
    'https://www.bper.it/',
    'intensità di carbonio della spesa e dell\'allocazione di capitale',
    'costruisce la strategia ESG di una banca e siede nella CSO Roundtable della European Banking Federation',
    ['https://it.linkedin.com/in/giovanna-zacchi-38982763',
     'https://esgnews.it/governance/isabella-manfredi-feralpi-nuova-presidente-dellassociazione-dei-sustainability-manager/',
     'https://finanzasostenibile.it/relatori/giovanna-zacchi/'],
    'ff.58.4',
    """
Ciao Giovanna,

guidi la strategia ESG di BPER Banca da dieci anni, siedi nella CSO Roundtable della European Banking Federation e sei vicepresidente del Forum per la Finanza Sostenibile. Il tuo mestiere è tradurre la sostenibilità in decisioni di allocazione, non solo in rendicontazione.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a mettere le emissioni sulla stessa unità di misura del credito:

💲 ff.58.4 Spendere un dollaro — in media un dollaro speso vale tra 100 grammi e 1 kg di CO2, con punte fino a 10. La tabella per destinazione è la parte interessante: consulenza finanziaria o legale 0,1 kg per dollaro, acquisto di un'auto 0,5, cibo 0,6, bollette elettriche 4, benzina 6,5, viaggio aereo 10. In negativo, pannelli solari a -2 e progetti di riforestazione a -220.

Un conto economico letto in kg di CO2 per euro impiegato dice cose che il rating ESG di controparte non dice.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 3
lead(
    'Peter', 'Durante',
    'Chief People, Innovation & Transformation Officer', 'Italgas', 'Milano',
    'https://it.linkedin.com/in/peter-durante-a4a436b7',
    'peter.durante@italgas.it',
    ['peter.durante@italgas.it', 'p.durante@italgas.it', 'peter.durante@italgas.com'],
    'https://www.italgas.it/',
    'produttività per addetto e organizzazioni assistite dall\'AI',
    'tiene insieme persone, innovazione e trasformazione in una utility che si definisce network tech company',
    ['https://www.italgas.it/en/team/management/peter-durante/',
     'https://it.linkedin.com/in/peter-durante-a4a436b7',
     'https://theorg.com/org/italgas-spa/org-chart/peter-durante'],
    'ff.55.3',
    """
Ciao Peter,

in Italgas tieni insieme persone, innovazione e trasformazione dal 2020, dopo la direzione HR di Atlantia. È una combinazione di deleghe rara: di solito chi porta l'AI in azienda e chi risponde dell'organizzazione sono due persone che si parlano poco.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che vive proprio su quella sovrapposizione:

👑 ff.55.3 Altro che Giulio Cesare: i nuovi imperatori — il dato che mi ha colpito è il crollo del numero di dipendenti necessari per generare un milione di dollari di ricavi nelle aziende dell'S&P 500. Portato al limite, apre a società da mille miliardi con un solo dipendente assistito da centinaia di robot e sistemi automatici. Nel frattempo la stessa dinamica produce brand personali costruiti su network effect e AI, quella che Li Jin chiama passion economy.

La domanda che ne esce riguarda il tuo perimetro: cosa succede alle carriere quando la curva ricavi-per-testa si stacca dall'organico.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 4
lead(
    'Alessandro', 'Della Zoppa',
    'Head of Renewables', 'Plenitude (Eni)', 'Milano',
    'https://www.linkedin.com/in/alessandro-della-zoppa-68719941/',
    'alessandro.dellazoppa@eniplenitude.com',
    ['alessandro.dellazoppa@eniplenitude.com', 'alessandro.dellazoppa@eni.com',
     'alessandro.della.zoppa@eniplenitude.com'],
    'https://eniplenitude.com/',
    'capitale necessario alla transizione e peso relativo di eolico e solare',
    'guida le rinnovabili di Plenitude e siede nel board delle società di Dogger Bank',
    ['https://www.linkedin.com/in/alessandro-della-zoppa-68719941/',
     'https://theorg.com/org/eni-plenitude/org-chart/alessandro-della-zoppa',
     'https://www.industriaitaliana.it/plenitude-eni-fotovoltaico-rinnovabili/'],
    'ff.16.2',
    """
Ciao Alessandro,

guidi le rinnovabili in Plenitude e siedi nel consiglio delle società di Dogger Bank, dopo anni passati sul GNL e sulle negoziazioni gas tra Eni, Union Fenosa Gas e Qalhat. Hai visto la stessa transizione da entrambi i lati del bilancio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul capitale che serve per arrivarci:

🌉 ff.16.2 Il costo delle infrastrutture — un report Goldman Sachs su COP26 stima 50 mila miliardi di dollari da qui al 2050 per contenere l'aumento a 1,5 °C, fino a 3 mila miliardi in un singolo anno: centrali di nuova generazione, stazioni di ricarica, adattamento e manutenzione delle reti, sistemi di cattura della CO2. Di quei 50, circa 30 mila miliardi vanno a nuove strutture rinnovabili, con 13 mila miliardi sull'eolico onshore e offshore e 8 mila sul solare.

Il rapporto tra le due voci è quello che rende leggibile una pipeline come la vostra.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 5
lead(
    'Gian Luca', 'Sacco',
    'Senior Director Marketing EMEA & Germany', 'Siemens Digital Industries Software', 'Segrate (MI)',
    'https://www.linkedin.com/in/giellesse/',
    'gianluca.sacco@siemens.com',
    ['gianluca.sacco@siemens.com', 'gian-luca.sacco@siemens.com', 'gianluca.sacco@siemens.it'],
    'https://www.sw.siemens.com/',
    'gemelli digitali e simulazione come infrastruttura industriale',
    'fa marketing per la divisione software industriale che vende proprio simulazione e digital twin',
    ['https://www.linkedin.com/in/giellesse/',
     'https://www.siemens.com/en-us/company/leadership/management-italy/'],
    'ff.37.3',
    """
Ciao Gian Luca,

guidi il marketing EMEA di Siemens Digital Industries Software da Segrate, dopo essere passato per vendite e country management nel mondo PLM. Racconti da anni una categoria che il mercato ha impiegato parecchio a capire.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in cui quella categoria arriva da una direzione inattesa:

🎮 ff.37.3 Non provi NVIDIA? — alla sua conferenza annuale NVIDIA ha mostrato come sviluppare robot di nuova generazione richieda studiarne i movimenti in un ambiente totalmente virtuale, un digital twin: l'esperienza accumulata sulle GPU da videogioco torna utile alla robotica. Sul lato hardware chip come il Jetson Orin Nano diventano una specie di Lego per l'intelligenza artificiale, un'interfaccia comune per navigazione e gestione dei sensori. Il punto di arrivo è Omniverse, dove il confine tra digitale e fisico sfuma.

Un pezzo di mercato che nasce dal gaming e finisce nella tua stessa arena industriale.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 6
lead(
    'Renato', 'Mazzoncini',
    'Amministratore Delegato e Direttore Generale', 'A2A', 'Milano',
    'https://www.linkedin.com/in/renatomazzoncini/',
    'renato.mazzoncini@a2a.eu',
    ['renato.mazzoncini@a2a.eu', 'renato.mazzoncini@a2a.it', 'r.mazzoncini@a2a.eu'],
    'https://www.gruppoa2a.it/',
    'rifiuti, combustione e limiti biologici dell\'economia circolare',
    'guida una life company che tratta rifiuti, acqua ed energia e ha una business unit dedicata all\'economia circolare',
    ['https://www.gruppoa2a.it/en/about-us/our-management',
     'https://www.linkedin.com/in/renatomazzoncini/'],
    'ff.143.4',
    """
Ciao Renato,

guidi A2A da amministratore delegato dopo Ferrovie dello Stato, e il gruppo è una delle poche realtà italiane in cui rifiuti, acqua ed energia stanno sotto lo stesso tetto, con una business unit interamente dedicata all'economia circolare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che guarda la combustione da tre angolazioni diverse:

🔥 ff.143.4 Fuoco (3 facce) — sopravvivenza, con i falò di plastica e rifiuti accesi per scaldarsi; sussistenza, con la terra del fuoco azera e le Flame Towers costruite sul gas; trascendenza, con le pire funerarie di Varanasi. Tre usi dello stesso elemento, letti in sequenza. La riflessione che ne segue è secca: quando il fuoco diventa plastica e l'aria diventa un muro grigio, crollano i presupposti biologici su cui quei tre usi si reggevano.

Per chi gestisce termovalorizzatori e filiere del recupero, quel salto dalla sopravvivenza alla trascendenza è anche una questione industriale.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 7
lead(
    'Mauro', 'Macchi',
    'CEO Europe, Middle East and Africa; Chairman Accenture Italia', 'Accenture', 'Milano',
    'https://it.linkedin.com/in/mauro-macchi',
    'mauro.macchi@accenture.com',
    ['mauro.macchi@accenture.com', 'm.macchi@accenture.com', 'mauro.macchi@accenture.it'],
    'https://www.accenture.com/it-it',
    'AI che esce dai chatbot ed entra nelle applicazioni industriali',
    'guida EMEA per Accenture e spinge sull\'accelerazione dell\'adozione AI nelle imprese europee',
    ['https://www.accenture.com/us-en/about/leadership/mauro-macchi',
     'https://it.linkedin.com/in/mauro-macchi'],
    'ff.115.3',
    """
Ciao Mauro,

guidi Accenture per Europa, Medio Oriente e Africa e sei presidente della practice italiana, dopo aver diretto la region ICEG. In più di un intervento hai spinto le imprese europee ad accelerare sull'adozione dell'AI invece di restare in fase pilota.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su cosa succede quando quell'accelerazione tocca terra:

🐍 ff.115.3 Veleni esponenziali — l'intelligenza artificiale sta uscendo dai chatbot per entrare in applicazioni pratiche. ProteinMPNN è un modello allenato su strutture proteiche invece che su testo, e uno studio su Nature mostra come trovi un antidoto al veleno dei serpenti in secondi anziché in mesi. Da lì la riflessione sulla miopia umana davanti agli esponenziali, con l'illustrazione di Tim Urban che già nel 2015 raccontava la rivoluzione dell'AI.

Da mesi a secondi: è la stessa compressione che i tuoi clienti stanno provando a mettere nei propri processi, con risultati molto diseguali.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 8
lead(
    'Carlo', 'Gagliardi',
    'Managing Director & Senior Strategy Executive', 'Accenture Strategy', 'Londra',
    'https://uk.linkedin.com/in/carlogagliardi',
    'carlo.gagliardi@accenture.com',
    ['carlo.gagliardi@accenture.com', 'c.gagliardi@accenture.com', 'carlo.gagliardi@accenture.it'],
    'https://www.accenture.com/',
    'algoritmi, attenzione e disruption dei media',
    'quasi trent\'anni su strategia digitale e disruption tra telco, media e utilities, con docenze su digital transformation',
    ['https://uk.linkedin.com/in/carlogagliardi',
     'https://www.consultancy.uk/news/22841/carlo-gagliardi-returns-to-accenture-strategy'],
    'ff.117.4',
    """
Ciao Carlo,

sei Managing Director in Accenture Strategy dopo essere passato da PA Consulting e da Strategy&, con quasi trent'anni su telco, media, utilities ed energia, e insegni disruption digitale alla Cass Business School. Di mestiere spieghi alle organizzazioni cosa le sta cambiando sotto i piedi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a fare la stessa cosa su chi guarda:

👨‍💻 ff.117.4 Liberarci dalla simulazione degli algoritmi? — la cura all'ipermodernismo, quello virtuale dei social e quello fisico di una città come Hong Kong, sta nel prestare attenzione a ciò che accade. Cercando la fonte di quella frase sono finito su un libro del 1967, The Medium is the Massage di McLuhan, che diceva già allora che il mezzo plasma il messaggio più del contenuto.

Sessant'anni dopo, la parte che vale è quella diagnostica: il canale che scegli riscrive quello che riesci a dire, e questo vale per le aziende quanto per le persone.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 9
lead(
    'Marco', 'Iusi',
    'Head of Google Cloud Competence Center, Executive Manager Digital Architecture', 'NTT DATA Italia', 'Cosenza',
    'https://www.linkedin.com/in/marcoiusi/',
    'marco.iusi@nttdata.com',
    ['marco.iusi@nttdata.com', 'marco.iusi@it.nttdata.com', 'm.iusi@nttdata.com'],
    'https://it.nttdata.com/',
    'consumo energetico del calcolo e infrastrutture cloud',
    'guida un competence center cloud con esperienza su progetti enterprise nel settore energia',
    ['https://www.linkedin.com/in/marcoiusi/',
     'https://it.linkedin.com/posts/marcoiusi_al-via-calabria-forest-project-ntt-data-activity-6961213337812516864-plK4'],
    'ff.24.4',
    """
Ciao Marco,

guidi il competence center Google Cloud di NTT DATA Italia e l'area di digital architecture, con dieci anni di progetti enterprise tra energia e telematica alle spalle. Progetti architetture in cui la voce energia non è quasi mai un dettaglio di secondo piano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che mette il calcolo e il combustibile nella stessa frase:

💦 ff.24.4 Minare con gas — Exxon Mobil ha annunciato che avrebbe usato per minare bitcoin il gas estratto in eccesso, quello che non riesce a entrare nei canali di distribuzione e che comunque viene bruciato in torcia. Rilasciato in atmosfera inquinerebbe più che nella forma bruciata, quindi la potenza di calcolo diventa la destinazione di uno scarto. Nello stesso pezzo c'è il confronto tra il network Bitcoin, stimato con una potenza di calcolo 500.000 volte superiore al più grande supercomputer al mondo, l'industria dell'oro, i data center e il trasporto marittimo e aereo.

Quattro anni dopo la domanda si è solo spostata dal mining all'inferenza.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 10
lead(
    'Valerio', 'Vinci',
    'Manager, Environment Climate Change & Sustainability', 'EY Tax & Law Italy', 'Milano',
    'https://www.linkedin.com/in/valerio-vinci-0880b1106/',
    'valerio.vinci@it.ey.com',
    ['valerio.vinci@it.ey.com', 'valerio.vinci@ey.com', 'vvinci@it.ey.com'],
    'https://www.ey.com/it_it',
    'microplastiche e limiti della bonifica individuale',
    'fa diritto ambientale su economia circolare, rifiuti, bonifiche e inquinamento di aria e acqua',
    ['https://www.linkedin.com/in/valerio-vinci-0880b1106/',
     'https://www.legal500.com/firms/12037-ernst-young-llp/global/lawyers/5731678-valerio-vinci'],
    'ff.130.4',
    """
Ciao Valerio,

fai parte del team Environment, Climate Change & Sustainability di EY Tax & Law, arrivato da Legance, e ti occupi di economia circolare, gestione rifiuti, procedimenti di bonifica, inquinamento di aria e acqua, autorizzazioni ambientali e rischi di incidente rilevante. Vedi la contaminazione nella sua forma più concreta, quella che finisce in un procedimento.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul lato in cui la bonifica non basta:

💀 ff.130.4 La danza macabra — le microplastiche sono così diffuse che neanche Bryan Johnson, il biohacker del programma DON'T DIE, riesce a sfuggirne. Tra sauna, trasfusioni di plasma e rimozione degli oggetti di plastica dalla propria vita ha ridotto del 90% le particelle nel sangue, e ciononostante il suo sperma resta contaminato.

Chi ha il budget e il tempo per una decontaminazione personale totale arriva al 90% e si ferma lì: il residuo è un problema di sistema, e si risolve a monte, dove lavori tu.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 11
lead(
    'Gabriele', 'Langella',
    'Executive Manager, Energy & Utilities', 'NTT DATA Italia', 'Roma',
    'https://www.linkedin.com/in/gabriele-langella-964a9888/',
    'gabriele.langella@nttdata.com',
    ['gabriele.langella@nttdata.com', 'gabriele.langella@it.nttdata.com', 'g.langella@nttdata.com'],
    'https://it.nttdata.com/',
    'storia dell\'elettricità e origine italiana della batteria',
    'porta trasformazione digitale a TSO e retailer gas e power, cioè a chi fa muovere gli elettroni',
    ['https://www.linkedin.com/in/gabriele-langella-964a9888/',
     'https://rocketreach.co/ntt-data-italia-management_b5c492b4f42e0dc9'],
    'ff.105.1',
    """
Ciao Gabriele,

in NTT DATA Italia porti trasformazione digitale a organizzazioni complesse del mondo Energy & Utilities: TSO, retail gas e power. Lavori sulla parte informativa di un sistema che alla fine muove elettroni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che torna all'origine di quel mestiere:

🤴 ff.105.1 Trasformare una rana in principe azzurro? — nel tardo Settecento l'Italia era il centro del mondo elettrico. Galvani sosteneva che l'elettricità fosse un fenomeno naturale e si lanciò in esperimenti con così tante rane che in certe zone quasi sparirono; Volta puntò invece sui metalli, arrivando alla prima batteria e oscurando per un pezzo le scoperte del collega. Un premio da 60.000 franchi per costruire una batteria animale spinse poi Humboldt all'autosperimentazione, con fili infilati nel proprio retto. È l'incipit di We are electric di Sally Adee.

Due secoli e mezzo dopo, l'accumulo resta il pezzo che decide se una rete regge.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 12
lead(
    'Vincenzo', 'Criscuolo',
    'Managing Director, Strategy & Consulting Lead Retail (Italia, Central Europe, Grecia)', 'Accenture', 'Milano',
    'https://www.linkedin.com/in/vincenzo79cri/',
    'vincenzo.criscuolo@accenture.com',
    ['vincenzo.criscuolo@accenture.com', 'v.criscuolo@accenture.com', 'vincenzo.criscuolo@accenture.it'],
    'https://www.accenture.com/it-it',
    'concentrazione degli acquisti nelle ricorrenze commerciali',
    'guida strategia e consulenza retail per Italia, Central Europe e Grecia',
    ['https://www.linkedin.com/in/vincenzo79cri/',
     'https://rocketreach.co/vincenzo-criscuolo-email_32686134'],
    'ff.6.3',
    """
Ciao Vincenzo,

guidi Strategy & Consulting per il retail su Italia, Central Europe e Grecia in Accenture, con quindici anni passati dentro organizzazioni grandi tra ERP, integrazione e strategia IT. I picchi di domanda per te sono un problema di sistemi prima ancora che di marketing.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su come quei picchi si distribuiscono:

🛒 ff.6.3 L'avvento delle spese, nel mondo — ogni festività ha le sue spese, e quando le festività non bastano se ne creano di nuove: Black Friday, Cyber Monday, saldi di inizio anno, il giorno dei single inventato da Alibaba l'11 novembre. Il Natale resta primo con circa mille miliardi di dollari; il Cyber Monday, che cade vicino al blue monday, con i suoi 9,4 miliardi vale appena l'1% della spesa natalizia. In Asia il singles day è passato da 38 miliardi nel 2019 a 139 nel 2021.

Il divario tra un evento inventato e una ricorrenza ereditata dice parecchio su quanto sia elastica la domanda che pianifichi.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 13
lead(
    'Stella', 'Gubelli',
    'Amministratore Delegato', 'ALTIS Advisory', 'Milano',
    'https://www.linkedin.com/in/stella-gubelli-0583007/',
    'stella.gubelli@altisadvisory.com',
    ['stella.gubelli@altisadvisory.com', 's.gubelli@altisadvisory.com', 'stella.gubelli@unicatt.it'],
    'https://www.altisadvisory.com/',
    'conversione delle emissioni in un\'unità di misura maneggiabile',
    'guida una società che misura impatti economici, sociali e ambientali per le imprese',
    ['https://www.linkedin.com/in/stella-gubelli-0583007/',
     'https://altis.unicatt.it/faculty/gubelli-stella.html',
     'https://esgnews.it/governance/isabella-manfredi-feralpi-nuova-presidente-dellassociazione-dei-sustainability-manager/'],
    'ff.61.2',
    """
Ciao Stella,

sei amministratore delegato di ALTIS Advisory, spin-off della Cattolica, e da vent'anni accompagni le imprese dalla definizione della strategia di sostenibilità fino alla misurazione degli impatti economici, sociali e ambientali. Sei anche nel consiglio direttivo di Sustainability Makers.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio sull'unità di misura:

🕗 ff.61.2 Emissioni convertite in tempo — partendo dalla tabella delle emissioni di Mike Berners-Lee ho convertito il budget di carbonio in minuti e ore: 4 minuti una banana, 6 cento grammi di riso, 18 una pinta di birra, 22 le email di una giornata, 30 un chilometro in auto, 60 una bottiglia di vino, 2 ore un hamburger, 2 ore anche un chilometro in auto nel traffico. Moltiplicando per quantità e frequenza esce l'analisi cumulativa annuale, e a quel punto è chiaro che lo spazio per la sola frugalità è stretto.

Convertire in tempo funziona bene con chi non legge tonnellate: è la traduzione che serve quando l'interlocutore è una PMI.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 14
lead(
    'Simona', 'Ceccarelli',
    'Responsabile Area Sostenibilità', 'SCS Consulting', 'Bologna',
    'https://www.linkedin.com/in/simona-ceccarelli-108b5b24/',
    'simona.ceccarelli@scsconsulting.it',
    ['simona.ceccarelli@scsconsulting.it', 's.ceccarelli@scsconsulting.it',
     'simona.ceccarelli@scsazioninnova.it'],
    'https://www.scsconsulting.it/',
    'emissioni del digitale e sobrietà nel design dei servizi online',
    'guida l\'area sostenibilità di una società di consulenza direzionale e siede nel direttivo di Sustainability Makers',
    ['https://www.linkedin.com/in/simona-ceccarelli-108b5b24/',
     'https://esgnews.it/governance/isabella-manfredi-feralpi-nuova-presidente-dellassociazione-dei-sustainability-manager/',
     'https://www.pages.scsconsulting.it/contatta-simona-ceccarelli'],
    'ff.26.2',
    """
Ciao Simona,

guidi l'Area Sostenibilità di SCS Consulting da Bologna e sei entrata nel consiglio direttivo di Sustainability Makers. Il tuo lavoro sta nel punto in cui la strategia di sostenibilità deve diventare un numero che qualcuno firma.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su una voce che quasi nessun perimetro di rendicontazione tocca:

0️⃣ ff.26.2 Siti web a impatto zero (quasi) — uno studio di design di Amsterdam ha riprogettato il sito Volkswagen per renderlo sostenibile: togliendo colori, immagini in alta definizione e animazioni si arriva a 0,02 grammi di CO2 per pagina visualizzata, circa cento volte meno della media. Nello stesso pezzo, le emissioni di YouTube per pagina calcolate da websitecarbon.com valgono un centesimo di quelle necessarie a produrre 150 grammi di riso.

Il confronto è utile in due direzioni: dà una scala al digitale e ricorda che la sobrietà nel design è una leva vera, anche se piccola.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 15
lead(
    'Massimo', 'Giudici',
    'Associate Partner', 'McKinsey & Company', 'Milano',
    'https://www.linkedin.com/in/massimogiudici/',
    'Massimo_Giudici@mckinsey.com',
    ['Massimo_Giudici@mckinsey.com', 'massimo_giudici@mckinsey.com', 'massimo.giudici@mckinsey.com'],
    'https://www.mckinsey.com/it',
    'nucleare modulare e ricomposizione del rischio percepito',
    'lavora sulla visione dei Paesi in tema di transizione energetica dall\'ufficio di Milano',
    ['https://www.linkedin.com/in/massimogiudici/',
     'https://www.mckinsey.com/it/our-people'],
    'ff.70.2',
    """
Ciao Massimo,

sei Associate Partner in McKinsey a Milano e scrivi di voler contribuire alla visione dei Paesi sulla transizione energetica. È una formulazione precisa: sposta il problema dal piano industriale della singola utility a quello del mix nazionale.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su una tecnologia che in quel mix continua a rientrare dalla finestra:

☢️ ff.70.2 Oppenheimer: fissione o fusione? — il film ha riaperto la discussione sul nucleare, e la novità più concreta sono gli Small Modular Reactors, mini-reattori che producono da un decimo a un centesimo dell'energia dei fratelli maggiori. Costano meno e spalmano il rischio percepito su un numero maggiore di siti, quindi meno centralizzati.

Quella parola, percepito, è il punto: gli SMR agiscono sull'accettabilità sociale prima che sul costo del kilowattora, e per chi lavora sulla visione di un Paese quella è spesso la variabile che decide.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 16
lead(
    'Luca', 'Pancaldi',
    'Senior Partner', 'McKinsey & Company', 'Milano',
    'https://it.linkedin.com/in/luca-pancaldi-7144524',
    'Luca_Pancaldi@mckinsey.com',
    ['Luca_Pancaldi@mckinsey.com', 'luca_pancaldi@mckinsey.com', 'luca.pancaldi@mckinsey.com'],
    'https://www.mckinsey.com/it',
    'concentrazione geografica del PIL e centralizzazione dei servizi',
    'guida le trasformazioni in area mediterranea e co-guida innovazione nella Risk & Resilience Practice',
    ['https://it.linkedin.com/in/luca-pancaldi-7144524',
     'https://www.mckinsey.com/our-people/luca-pancaldi'],
    'ff.52.2',
    """
Ciao Luca,

sei Senior Partner in McKinsey a Milano, guidi il lavoro sulle trasformazioni in area mediterranea e co-guidi innovazione e client capabilities nella Risk & Resilience Practice. Vedi la stessa organizzazione sia mentre cambia sia mentre prova a non rompersi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che parte da una vostra ricerca:

🏙️ ff.52.2 Centralizzare conviene — metà del PIL mondiale del decennio 2010-2020 è stato generato in 3.600 regioni, che coprono l'1% del pianeta. Le città sembrano anche inquinare meno, perché riducono gli spostamenti per accedere ai servizi e spingono verso case più piccole e consumi più bassi. La stessa concentrazione però vale per i servizi digitali: aziende che fanno capo a poche persone possono detronizzare un presidente da un social o regolare l'accesso all'informazione.

Efficienza e fragilità che crescono sulla stessa curva: mi sembra esattamente il terreno della resilienza di cui ti occupi.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 17
lead(
    'Alessandra', 'Ponzio',
    'Partner Audit, responsabile Professional Practice ESG', 'KPMG', 'Milano',
    'https://www.linkedin.com/in/alessandra-ponzio-382a21126/',
    'aponzio@kpmg.it',
    ['aponzio@kpmg.it', 'alessandra.ponzio@kpmg.it', 'aponzio@kpmg.com'],
    'https://kpmg.com/it/it/home.html',
    'prezzo esplicito della compensazione e limiti della decrescita',
    'firma assurance di sostenibilità e siede nel gruppo di lavoro OIC sui principi di rendicontazione',
    ['https://www.linkedin.com/in/alessandra-ponzio-382a21126/',
     'https://it.linkedin.com/posts/alessandra-ponzio-382a21126_sostenibilit%C3%A0-aziendale-2023-activity-7128127414890606592-SSXy'],
    'ff.61.4',
    """
Ciao Alessandra,

sei Partner Audit in KPMG con diciotto anni di revisione alle spalle, dal 2021 responsabile della Professional Practice ESG, e siedi nella commissione ANFI di Assirevi e nel gruppo di lavoro OIC sui principi di rendicontazione di sostenibilità. Tocchi il punto in cui una dichiarazione diventa un numero attestabile.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a dare un prezzo esplicito a quel numero:

🎶 ff.61.4 Un abbonamento stile Spotify per il mondo — la decrescita felice affascina ma non regge nel primo mondo digitale, quindi la strada resta compensare e continuare a investire in progresso, con solare ed eolico sempre più economici. MyClimate quantifica: per un andata e ritorno a Cuba emetto 2,7 tonnellate, che valgono 76 euro a fronte di un biglietto da 950. Portato a sistema, un budget da 10 tonnellate l'anno costa circa 280 euro.

Un ordine di grandezza così basso spiega bene perché la compensazione, da sola, sia il pezzo più facile da contestare in fase di assurance.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 18
lead(
    'Andrea', 'Sai',
    'Digital Business Development Manager', 'ABB', 'Bergamo',
    'https://www.linkedin.com/in/andreasai/',
    'andrea.sai@it.abb.com',
    ['andrea.sai@it.abb.com', 'andrea.sai@abb.com', 'a.sai@it.abb.com'],
    'https://new.abb.com/it',
    'complessità nascosta dietro consegne istantanee e interruttori',
    'costruisce canali digitali e e-commerce per un gruppo che vende elettrificazione',
    ['https://www.linkedin.com/in/andreasai/',
     'https://rocketreach.co/andrea-sai-email_3071898'],
    'ff.21.1',
    """
Ciao Andrea,

fai digital business development in ABB da Bergamo, con un percorso tra e-commerce B2B e B2C, digital marketing e gestione di store online, chiuso da un passaggio al MIP su digital disruption. Vendi elettrificazione attraverso canali che devono sembrare istantanei.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su cosa si nasconde dietro quell'istantaneità (e scrivo anch'io da Bergamo):

💰 ff.21.1 La magia dell'insalata a domicilio e della bic — Tim Urban di Wait But Why, ospite da Lex Fridman, fa notare che nessun essere umano sa costruire una penna a sfera: servono estrazione dei materiali, forgiatura, chimica della plastica e dell'inchiostro, progettazione. Per estrarre serve una pala, che va costruita; per la chimica serve vetro, e fuoco. Musk stima almeno un milione di persone per tenere in piedi una civiltà stabile. Poi Urban chiede di pensare a cosa succede quando premi l'interruttore della luce, o quando ordini un'insalata e dopo dieci minuti suona il campanello.

Chi progetta l'esperienza d'acquisto lavora proprio a nascondere quella catena.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 19
lead(
    'Antonina', 'Sorci',
    'Sustainability Manager', 'Deloitte', 'Milano',
    'https://it.linkedin.com/in/antonina-sorci-62161155',
    'asorci@deloitte.it',
    ['asorci@deloitte.it', 'antonina.sorci@deloitte.it', 'asorci@deloitte.com'],
    'https://www.deloitte.com/it/it/',
    'emissioni indirette e invisibili nel calcolo di un footprint',
    'fa consulenza di sostenibilità in Deloitte, dove il perimetro del calcolo è il problema quotidiano',
    ['https://it.linkedin.com/in/antonina-sorci-62161155',
     'https://www.linkedin.com/showcase/deloitte-sustainability/'],
    'ff.58.3',
    """
Ciao Antonina,

sei Sustainability Manager in Deloitte a Milano, con un passaggio formativo a Cambridge, e segui da vicino l'evoluzione di standard e regole. Nel tuo lavoro la parte scivolosa è quasi sempre il perimetro: cosa entra nel calcolo e cosa resta fuori.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto costruito proprio su quel bordo:

⛲ ff.58.3 Andare alle Cascate del Niagara (da New York) — stesso tragitto, sei modi di percorrerlo: bici alimentata a banane 53 kg CO2eq, carrozza 120, bici alimentata a cheeseburger 250, treno 330, piccola auto efficiente 500, aereo 1.100. Il dettaglio che ribalta la classifica arriva dopo: un'auto piena può battere il treno, ma un incidente stradale arriva a emettere 50 tonnellate tra danni e traffico generato, cioè cinque anni di emissioni di una persona. E le emissioni in alta quota pesano 1,5-2 volte tanto.

L'alimentazione del ciclista che cambia il risultato di cinque volte è il miglior argomento che conosca sui confini di sistema.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ---------------------------------------------------------------- 20
lead(
    'Gianluca', 'Zaniboni',
    'Partner, Consumer & Industrial Markets', 'KPMG', 'Verona',
    'https://it.linkedin.com/in/gianluca-zaniboni-24859264',
    'gzaniboni@kpmg.it',
    ['gzaniboni@kpmg.it', 'gianluca.zaniboni@kpmg.it', 'gzaniboni@kpmg.com'],
    'https://kpmg.com/it/it/home.html',
    'stagnazione del consumo energetico pro capite e prezzo dell\'energia',
    'segue imprese consumer e industriali, per cui il costo dell\'energia è la variabile di margine',
    ['https://it.linkedin.com/in/gianluca-zaniboni-24859264',
     'https://kpmg.com/it/it/contacts/z/gianluca-zaniboni.html'],
    'ff.50.4',
    """
Ciao Gianluca,

sei Partner KPMG nella divisione Consumer & Industrial Markets, da Verona, con un percorso su bilanci, due diligence e IFRS. I tuoi clienti hanno passato gli ultimi anni a spiegare ai consigli come mai il costo dell'energia si mangiasse il margine.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che guarda quella voce su una scala lunga:

🌟 ff.50.4 Consumisti ma non di energia — il consumo di energia pro capite è sostanzialmente fermo, malgrado un secolo e mezzo di esplosione demografica. Le spiegazioni plausibili sono quattro: dematerializzazione e digitalizzazione, maggiori efficienze, lavoro da remoto, e il limite imposto dal costo dell'energia. Le prime tre dicono che la stiamo usando meglio; la quarta è il collo di bottiglia vero, e dopo l'Ucraina lo si è visto sulle bollette e alla pompa. L'energia non è ancora accessibile come lo sono diventati la potenza di calcolo o i giga di connessione.

Quell'ultimo confronto è il modo più diretto che ho trovato per spiegare a un CFO perché l'efficienza da sola non chiude il conto.

Spunto completo: %LINK%

%CTA%

Michele
""")

# ================================================================= build
assert len(L) == 20, len(L)
codes = [x['ff'] for x in L]
assert len(set(codes)) == 20, 'ff duplicati'
for c in codes:
    assert c in IDX, 'ff mancante in data.js: ' + c

for i, x in enumerate(L):
    v = IDX[x['ff']]
    x['ff_title'] = v['title']
    x['ff_link'] = v['link']
    x['excerpt'] = v['content'][:300].replace('\n', ' ')
    x['msg'] = x['body'].replace('%LINK%', v['link']).replace('%CTA%', CTA)
    x['words'] = len(x['msg'].split())
    x['id'] = START_ID + i
    x['subject'] = 'Spunto %s per %s' % (x['ff'], x['first'])
    x['prio'] = 'P1' if i < 10 else 'P2'

# ---- CSV
csvp = os.path.join(OUT, 'batch%d_%s.csv' % (BATCH, DATE))
cols = ['first_name', 'last_name', 'role', 'company', 'city_or_region', 'linkedin_url',
        'email_public', 'email_best', 'guessed_emails', 'website', 'focus_theme', 'why_match',
        'source_urls', 'excerpt_text', 'excerpt_id', 'template_id', 'template_subject',
        'priority', 'status', 'owner', 'next_action']
with open(csvp, 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(cols)
    for x in L:
        w.writerow([x['first'], x['last'], x['role'], x['company'], x['city'], x['li'], '',
                    x['best'], '|'.join(x['guesses']), x['site'], x['theme'],
                    'Spunto %s (%s) collegato a %s' % (x['ff'], x['ff_title'], x['theme']),
                    '|'.join(x['srcs']), x['excerpt'], x['ff'], 'ff-outreach-v3', x['subject'],
                    x['prio'], 'queued', 'micmer.clawdbot', 'create_gmail_draft_manual'])

# ---- MD
mdp = os.path.join(OUT, 'batch%d_%s.md' % (BATCH, DATE))
with open(mdp, 'w', encoding='utf-8') as f:
    f.write('# FF Outreach — batch %d (%s)\n\n' % (BATCH, DATE))
    f.write('20 lead nuovi, template `ff-outreach-v3`. Stato: **drafted**, invio NON autorizzato.\n\n---\n\n')
    for x in L:
        f.write('## %d. %s %s — %s, %s\n\n' % (x['id'], x['first'], x['last'], x['role'], x['company']))
        f.write('- LinkedIn: %s\n' % x['li'])
        f.write('- Email (guess): %s\n' % ', '.join(x['guesses']))
        f.write('- Spunto: **%s** — %s\n' % (x['ff'], x['ff_title']))
        f.write('- Link: %s\n' % x['ff_link'])
        f.write('- Fonti: %s\n' % ' | '.join(x['srcs']))
        f.write('- Priorità: %s — parole: %d\n\n' % (x['prio'], x['words']))
        f.write('**Oggetto:** %s\n\n```\n%s\n```\n\n---\n\n' % (x['subject'], x['msg']))

# ---- TRACKER merge
bak = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b%d.json' % BATCH
shutil.copyfile(TRACKER, bak)
T = json.load(open(TRACKER, encoding='utf-8'))
before = len(T['contacts'])
before_ids = set(c['id'] for c in T['contacts'])
assert not (before_ids & set(x['id'] for x in L)), 'collisione id'

for x in L:
    T['contacts'].append({
        'id': x['id'], 'name': '%s %s' % (x['first'], x['last']),
        'role': x['role'], 'org': x['company'], 'channel': 'email',
        'ff_post': x['ff'], 'ff_post_title': x['ff_title'], 'ff_post_url': x['ff_link'],
        'subject': x['subject'], 'message': x['msg'],
        'emails_guessed': x['guesses'], 'words': x['words'],
        'status': 'drafted', 'date': DATE, 'batch': BATCH, 'send_authorized': False,
    })

T['meta']['last_batch'] = BATCH
T['meta']['last_batch_date'] = DATE
T['meta']['updated'] = DATE
T['meta']['total_drafted'] = T['meta'].get('total_drafted', 0) + 20
T['total_drafted'] = T.get('total_drafted', 0) + 20
json.dump(T, open(TRACKER, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print('CSV :', csvp)
print('MD  :', mdp)
print('BAK :', bak)
print('contacts before/after: %d -> %d' % (before, len(T['contacts'])))
print('id range: %d-%d' % (L[0]['id'], L[-1]['id']))
print('words min/max:', min(x['words'] for x in L), max(x['words'] for x in L))
