# -*- coding: utf-8 -*-
"""FF outreach batch 96 — 2026-08-10. Builds CSV + MD and merges the tracker."""
import json, csv, io, os, sys, shutil, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
IDXF = os.path.join(OUT, '_ffidx_b96.json')
DATE = '2026-08-10'
BATCH = 96
START_ID = 1653

IDX = json.load(open(IDXF, encoding='utf-8'))

LEADS = [
 dict(
  first='Paolo', last="D'Aprile",
  role='Amministratore Delegato, Deloitte Climate & Sustainability; Sustainability Leader Central Mediterranean',
  company='Deloitte Italia', city='Roma/Milano',
  linkedin='https://it.linkedin.com/in/paolo-d%E2%80%99aprile-88a1002',
  emails=['pdaprile@deloitte.it', 'paolo.daprile@deloitte.it', 'pdaprile@deloitte.com'],
  website='https://www.deloitte.com/it/it/',
  theme='dimensione del problema climatico e traiettoria verso zero emissioni nette',
  sources=['https://www.deloitte.com/it/it/about/people/profiles.pdaprile+f38cb7d0.html',
           'https://www.businesspeople.it/people/people-moving/paolo-daprile-e-il-nuovo-a-d-di-deloitte-climate-sustainability/',
           'https://veniceclimateweek.org/speakers/paolo-daprile/'],
  ff='ff.1.2',
  msg="""Ciao Paolo,

guidi Deloitte Climate & Sustainability dopo aver coordinato in Commissione Europea il rapporto Draghi sulla competitività e aver diretto il Dipartimento al MASE sugli investimenti PNRR per rinnovabili, idrogeno ed economia circolare. Hai visto la transizione da dentro la policy, dentro McKinsey e adesso dentro la consulenza climatica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che uso spesso come ancoraggio quantitativo quando si parla di target:

📉 ff.1.2 Da 51 miliardi a 0 — Bill Gates in Clima, come evitare un disastro dice che sul cambiamento climatico i numeri da internalizzare sono due. Il primo è 51 miliardi: le tonnellate di CO2 equivalente che emettiamo ogni anno, con oscillazioni tra un anno e l'altro ma sostanzialmente stabili. L'altro è zero, il punto di arrivo. Due cifre, nessuna scala intermedia.

Per chi negozia obiettivi europei e poi li traduce in piani industriali per le imprese, quella coppia di numeri è il modo più onesto di misurare quanto manca.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Giuseppe', last='Milici',
  role='Partner, Sustainability Services', company='Deloitte Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/giuseppe-milici/',
  emails=['gmilici@deloitte.it', 'giuseppe.milici@deloitte.it', 'gmilici@deloitte.com'],
  website='https://www.deloitte.com/it/it/',
  theme='misurazione e rendicontazione delle emissioni, dai KPI alle unità di misura comprensibili',
  sources=['https://www.deloitte.com/it/it/about/people/profiles.gmilici+69ece723.html',
           'https://www.linkedin.com/in/giuseppe-milici/'],
  ff='ff.61.1',
  msg="""Ciao Giuseppe,

sei Partner Sustainability Services in Deloitte con oltre dieci anni su reporting e assurance di sostenibilità, soprattutto nell'energy: analisi di materialità, stakeholder engagement, KPI ambientali e sociali, GRI. Il tuo mestiere è far diventare numeri verificabili cose che di solito restano dichiarazioni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio sulle unità di misura:

⚖️ ff.61.1 Misurare l'inquinamento in ore di vita — partendo dalle 10 tonnellate annue pro capite proposte da Mike Berners-Lee (per un europeo medio significa dimezzare), provo a convertire il budget in qualcosa di maneggiabile: 10 ton/anno diventano 27 kg al giorno, cioè circa 1 kg all'ora, 20 grammi al minuto. Da lì nasce una regola semplice: se un'attività mi occupa più tempo della sua conversione CO2-tempo, è ecologica. Una banana vale quattro minuti di inquinamento, e di solito mi sazia più a lungo.

Per chi costruisce sistemi di rendicontazione, il problema vero resta rendere quei numeri leggibili a chi li deve usare.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Marco', last='Tonegutti',
  role='Managing Director & Senior Partner, leader Climate & Sustainability practice East Med e Caspian',
  company='Boston Consulting Group', city='Milano',
  linkedin='https://www.linkedin.com/in/marco-tonegutti/',
  emails=['tonegutti.marco@bcg.com', 'marco.tonegutti@bcg.com', 'tonegutti.marco@bcg.it'],
  website='https://www.bcg.com/about/people/experts/marco-tonegutti',
  theme='decarbonizzazione dei processi hard-to-abate e ruolo della cattura della CO2',
  sources=['https://www.bcg.com/about/people/experts/marco-tonegutti',
           'https://www.linkedin.com/in/marco-tonegutti/',
           'https://www.clubdeglinvestitori.it/en/people/marco-tonegutti-2/'],
  ff='ff.1.4',
  msg="""Ciao Marco,

guidi la practice Climate & Sustainability di BCG per East Med e Caspian e vieni dall'Energy practice con un focus sull'oil downstream: raffinazione, petrolchimica, programmi di trasformazione e decarbonizzazione. Pochi lavorano contemporaneamente sui settori più difficili da abbattere e sulle strategie climatiche di chi li possiede.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel punto esatto:

🏭 ff.1.4 Catturare CO2 sarà importante — nel report Goldman Sachs sulla decarbonizzazione curato da Michele Della Vigna l'obiettivo è portare la cattura sotto i 100 dollari per tonnellata. Piantare alberi resta una strada percorribile, però i natural sinks arrivano a catturare circa il 5% della CO2 emessa ogni anno. Restano cemento e acciaio, che continueranno a servire e hanno una chimica di processo intrinsecamente sporca: per quelli la CCUS industriale, cattura dove la CO2 viene prodotta, sembra l'unica opzione sul tavolo.

Per chi lavora sul downstream, il costo per tonnellata è la variabile che decide se il piano regge.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Umberto', last='Di Quinzio',
  role='Principal', company='BCG Platinion', city='Milano',
  linkedin='https://www.linkedin.com/in/udiqui/',
  emails=['diquinzio.umberto@bcg.com', 'umberto.diquinzio@bcgplatinion.com', 'diquinzio.umberto@bcgplatinion.com'],
  website='https://www.bcg.com/offices/platinion-milan',
  theme='uso iterativo dei modelli generativi nello sviluppo software e qualità dell output',
  sources=['https://www.linkedin.com/in/udiqui/',
           'https://www.bcg.com/offices/platinion-milan'],
  ff='ff.127.2',
  msg="""Ciao Umberto,

sei Principal in BCG Platinion a Milano, dopo dieci anni abbondanti di consulenza sull'architettura tecnologica. Platinion è il posto dove le strategie diventano stack, e in questo momento la domanda che arriva dai clienti è quasi sempre la stessa: quanto sviluppo possiamo davvero delegare ai modelli.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che affronta la questione dal lato del metodo:

🤘 ff.127.2 Rock 'n' roll e vibe coding — Rick Rubin ha lavorato con Anthropic a The Way of Code, un software-libro interattivo che rimescola il Tao con concetti contemporanei, e paragona ChatGPT alla rivoluzione del jazz. Il punto interessante arriva dopo: per la natura statistica degli LLM la prima risposta è quella comune, banale, poco creativa. Rubin racconta di usarli in modo iterativo, con domande e commenti, allineando progressivamente l'output al proprio gusto — lo stesso metodo dei primi lavori con Johnny Cash.

Applicato al codice, quello descrive la differenza tra un prototipo e qualcosa che va in produzione.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Federico', last='Fumagalli',
  role='Senior Partner, settore pubblico, sanità e sociale; co-leader Risk Management practice',
  company='McKinsey & Company', city='Milano',
  linkedin='https://www.linkedin.com/in/fumagallifederico/',
  emails=['federico_fumagalli@mckinsey.com', 'federico.fumagalli@mckinsey.com', 'ffumagalli@mckinsey.com'],
  website='https://www.mckinsey.com/our-people/federico-fumagalli/it-IT',
  theme='accesso alle competenze mediche e pressione sui sistemi sanitari pubblici',
  sources=['https://www.mckinsey.com/our-people/federico-fumagalli/it-IT',
           'https://www.linkedin.com/in/fumagallifederico/'],
  ff='ff.124.3',
  msg="""Ciao Federico,

sei Senior Partner nell'ufficio di Milano di McKinsey, segui il settore pubblico, sanitario e sociale in Italia e sei tra i leader della Risk Management practice. Prima di McKinsey eri all'Investment Centre della FAO. È una combinazione rara: strategia della sanità pubblica e gestione del rischio nello stesso perimetro.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su cosa si muove sotto quel perimetro:

🩺 ff.124.3 Medico in famiglia (e in tasca) — Reid Hoffman parla di superagency guardando ai casi in cui l'AI risolve problemi di salute concreti. In Italia possiamo ancora contare su una sanità pubblica solida, per quanto sotto pressione crescente. Il quadro cambia se vivi in Nigeria o in Argentina con pochi soldi e nessun accesso a medici esperti, oppure se hai le risorse e non trovi nessuno che capisca cosa ti affligge, come l'imprenditrice di Y Combinator che ha risolto anni di emicrania. Durante una convalescenza ho usato ChatGPT come radiologo personale.

Per chi disegna servizi sanitari pubblici, quella domanda diventa una scelta di progettazione.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Mattia', last='Bernardi',
  role='Partner, EMEA Manufacturing Excellence leader', company='Bain & Company', city='Milano',
  linkedin='https://www.linkedin.com/in/mattia-bernardi-9993717/',
  emails=['mattia.bernardi@bain.com', 'm.bernardi@bain.com', 'bernardi.mattia@bain.com'],
  website='https://www.bain.com/our-team/mattia-bernardi/',
  theme='diffusione della robotica industriale e composizione geografica delle installazioni',
  sources=['https://www.bain.com/our-team/mattia-bernardi/',
           'https://www.industriaitaliana.it/bain-company-italia-partner-inclusione-diversita-promozione/',
           'https://www.linkedin.com/in/mattia-bernardi-9993717/'],
  ff='ff.37.4',
  msg="""Ciao Mattia,

sei Partner in Bain a Milano e guidi il Manufacturing Excellence per l'EMEA, con lavoro su carta e packaging, metalli e macchinari, tra sostenibilità, digitale e performance di manufacturing e supply chain. Vedi da vicino dove l'automazione entra davvero negli stabilimenti e dove resta una slide.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto con qualche numero sul tema:

📈 ff.37.4 Robot sempre più diffusi — le installazioni di robot industriali rapportate al loro costo hanno avuto una bella accelerazione, e la Cina fa da padrone con quasi metà delle installazioni globali. In Italia sono stati installati 11,6k robot su circa 400k globali, con una delle crescite maggiori d'Europa, +50% rispetto all'anno precedente. La direzione successiva riguarda l'uscita dalla manifattura: veicoli autonomi e servizi, dal cibo alla rivendita alle pulizie.

Per chi lavora su eccellenza produttiva in Europa, quel confronto tra parco installato italiano e cinese è il vero termine di paragone.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Luca', last='Paparella',
  role='Principal Director, Accenture Strategy', company='Accenture', city='Milano',
  linkedin='https://www.linkedin.com/in/luca-paparella-3022492a/',
  emails=['luca.paparella@accenture.com', 'l.paparella@accenture.com', 'luca.paparella@accenture.it'],
  website='https://www.accenture.com/it-it',
  theme='consumo energetico pro capite, efficienza e prezzo dell energia come collo di bottiglia',
  sources=['https://theorg.com/org/accenture/org-chart/luca-paparella',
           'https://www.linkedin.com/in/luca-paparella-3022492a/'],
  ff='ff.50.4',
  msg="""Ciao Luca,

sei Principal Director in Accenture Strategy a Milano, in Accenture dal 2010, con quindici anni di consulenza strategica e lavoro su programmi legati alla transizione energetica. Sei quindi nella posizione di vedere sia i piani dichiarati dei clienti sia i vincoli che poi li rallentano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su uno di quei vincoli:

🌟 ff.50.4 Consumisti ma non di energia — il consumo energetico pro capite si è appiattito, e le spiegazioni plausibili sono quattro: dematerializzazione e digitalizzazione, maggiori efficienze, remote working e limiti imposti dal costo dell'energia. Le prime tre raccontano un uso più efficace. La quarta è il collo di bottiglia vero: dopo l'Ucraina, prezzi alla pompa e bollette hanno cambiato le abitudini degli italiani. L'energia non è ancora accessibile come lo sono diventati potenza di calcolo e giga di connessione.

Per chi disegna strategie energetiche, quella asimmetria tra costo dei bit e costo dei kWh spiega parecchie roadmap che slittano.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Francesco', last='Gagliardi',
  role='Partner, Head of Energy', company='KPMG Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/francesco-gagliardi-9011422/',
  emails=['fgagliardi@kpmg.it', 'francesco.gagliardi@kpmg.it', 'fgagliardi@kpmg.com'],
  website='https://kpmg.com/it/it/home.html',
  theme='fine della stagnazione energetica e crescita della capacità di generazione',
  sources=['https://kpmg.com/it/it/home/events/2023/09/italian-energy-summit-2023-.html',
           'https://www.linkedin.com/in/francesco-gagliardi-9011422/'],
  ff='ff.70.4',
  msg="""Ciao Francesco,

sei Partner KPMG e Head of Energy in Italia, e sei una delle voci che all'Italian Energy Summit mette in fila priorità strategiche del settore e transizione. Chi guida una practice energy vede prima di altri quando una curva cambia pendenza.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su una di queste curve:

☎️ ff.70.4 Energia, TVTTTBXS — l'analogia parte dai 100 SMS al giorno diventati giga praticamente illimitati. Se manifattura e trasporti vengono elettrificati, il costo dell'energia può seguire la stessa traiettoria, e ricorderemo le emissioni come le sigle digitate col T9. Il segnale concreto è la fine della stagnazione nella capacità di generazione, ferma da inizio anni Duemila per mancanza di alternative non inquinanti e adesso in crescita sia negli Stati Uniti sia in Cina. Le due maggiori economie mondiali, contemporaneamente, con il solare che sta esplodendo.

Per chi consiglia utility e operatori italiani, il tema è quanto di quella traiettoria arrivi qui e con che ritardo.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Elena', last='Carpani',
  role='Partner, Intellectual Property, EY Tax & Law Italy', company='EY Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/elena-carpani-7033a820/',
  emails=['elena.carpani@it.ey.com', 'elena.carpani@ey.com', 'e.carpani@it.ey.com'],
  website='https://www.ey.com/en_it/people/elena-carpani',
  theme='voci sintetiche, digital twin di artisti e confini del diritto d autore',
  sources=['https://www.ey.com/en_it/people/elena-carpani',
           'https://www.legal500.com/firms/12037-ernst-young-llp/c-italy/lawyers/2000224-elena-carpani',
           'https://www.linkedin.com/in/elena-carpani-7033a820/'],
  ff='ff.63.4',
  msg="""Ciao Elena,

sei Partner di EY Tax & Law Italy e tra i fondatori del team Intellectual Property, con clienti in fashion, luxury, lifestyle e design, e lavoro su marchi, pubblicità, diritto d'autore, NFT e metaverso. La zona grigia tra creatività e proprietà intellettuale è esattamente il tuo terreno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che finisce dritto lì:

🎶 ff.63.4 Ai se eu te pego? — Drake AI, un digital twin del cantante con la voce replicata da un modello, ha pubblicato un album intero, Better Late Than Never, che è rimasto online finché YouTube non l'ha rimosso per violazione di copyright. Esistono anche classifiche dedicate agli artisti sintetici, tipo AI Hits. Fa quasi sorridere che nel nome del vecchio tormentone estivo ci fosse già dentro un "AI".

Per chi difende marchi e diritti d'autore, quel caso è il prototipo dei contenziosi che stanno arrivando su voce, volto e identità.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Anne', last='Munaretto',
  role='Partner, Climate Change and Sustainability Services', company='EY (Ernst & Young LLP)', city='Stati Uniti',
  linkedin='https://www.linkedin.com/in/annemunaretto/',
  emails=['anne.munaretto@ey.com', 'amunaretto@ey.com', 'anne.munaretto@us.ey.com'],
  website='https://www.ey.com/en_us/people/anne-munaretto',
  theme='costo dell adattamento climatico e confronto con le opzioni di intervento diretto',
  sources=['https://www.ey.com/en_us/people/anne-munaretto',
           'https://www.linkedin.com/in/annemunaretto/'],
  ff='ff.56.5',
  msg="""Ciao Anne,

sei Partner Climate Change and Sustainability Services in EY e lavori su strategia, performance e reporting ESG, con un focus recente sul rischio climatico e sull'adeguamento alle regole europee, TCFD compresa. Chi si occupa di rischio fisico prima o poi arriva alla domanda scomoda sui costi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che la pone in modo diretto:

💸 ff.56.5 Altro che il MOSE a Venezia — la cattura diretta della CO2 dall'aria oggi resta complessa e poco efficace: 6,6 GJ, cioè 1,83 MWh, per tonnellata, con stime al 2030 tra 300 e 1.000 dollari a tonnellata, contro una tassazione massima sulle emissioni di 137 dollari nel 2022. Da lì David Keith, in A case for climate engineering, fa un confronto brutale: l'ingegneria climatica su scala planetaria per un decennio potrebbe costare meno dei 6 miliardi di dollari spesi dal governo italiano per proteggere Venezia dall'innalzamento del mare.

Per chi valuta rischi climatici nei bilanci, quel confronto tra adattamento locale e intervento globale merita di stare nella discussione.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Massimiliano', last='Crippa',
  role='Energy & Utilities Key Account Manager', company='Capgemini Engineering', city='Milano',
  linkedin='https://www.linkedin.com/in/massimiliano-crippa-44a77b5/',
  emails=['massimiliano.crippa@capgemini.com', 'massimiliano.crippa@altran.com', 'm.crippa@capgemini.com'],
  website='https://www.capgemini.com/it-it/',
  theme='fabbisogno di investimenti infrastrutturali per la transizione e sua ripartizione',
  sources=['https://www.linkedin.com/in/massimiliano-crippa-44a77b5/',
           'https://www.capgemini.com/it-it/'],
  ff='ff.16.2',
  msg="""Ciao Massimiliano,

segui i key account Energy & Utilities in Capgemini Engineering, quindi stai nel punto in cui i piani di investimento delle utility diventano progetti ingegneristici e commesse. È una posizione da cui si capisce presto quali capitoli di spesa reggono e quali restano annunci.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sulla scala di quei capitoli:

🌉 ff.16.2 Il costo delle infrastrutture — un report Goldman Sachs su COP26 stima 50 trilioni di dollari da qui al 2050, fino a 3 trilioni in un singolo anno, per contenere l'aumento a 1,5 °C. Dentro ci stanno centrali di nuova generazione, stazioni di ricarica, adattamento e manutenzione delle infrastrutture esistenti e sistemi di cattura della CO2. Guardando la ripartizione per tipologia, 30 trilioni vanno a nuove strutture rinnovabili: 8 al solare e 13 all'eolico onshore e offshore.

Per chi vende ingegneria alle utility, quella ripartizione dice abbastanza chiaramente dove si concentrerà la domanda.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Selina', last='Xerra',
  role='Direttore Corporate Social Responsibility e Comitati Territoriali', company='Gruppo Iren', city='Reggio Emilia/Torino',
  linkedin='https://it.linkedin.com/in/selina-xerra-304ba239',
  emails=['selina.xerra@gruppoiren.it', 's.xerra@gruppoiren.it', 'selina.xerra@ireninformazione.it'],
  website='https://www.gruppoiren.it',
  theme='linguaggio della natura e distanza tra racconto urbano e uso concreto del territorio',
  sources=['https://www.csreinnovazionesociale.it/relatore-di-tappa/xerra-selina/',
           'https://it.linkedin.com/in/selina-xerra-304ba239'],
  ff='ff.51.1',
  msg="""Ciao Selina,

dal 2015 sei Direttore CSR e Comitati Territoriali del Gruppo Iren: linee guida di sostenibilità dentro il piano strategico, rendicontazione e soprattutto ascolto degli stakeholder sui territori. Prima ancora vent'anni di comunicazione ambientale. Sai bene quanto conti il vocabolario con cui si parla di ambiente a un comitato locale.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su quel vocabolario:

💚 ff.51.1 L'affabulazione per il verde — mi ha fatto riflettere una frase de Le otto montagne di Paolo Cognetti: "siete voi di città che la chiamate Natura. È così astratta nella vostra testa che è astratto pure il nome. Noi qui diciamo bosco, pascolo, torrente, roccia, cose che uno può indicare con il dito. Cose che si possono usare." Da lì il dubbio: nella frenesia digitale stiamo idealizzando la natura, e con essa il tema climatico, riducendolo a un bianco e nero invece che a numeri e percentuali.

Per chi presiede comitati territoriali, quella distanza tra parola astratta e cosa indicabile col dito è spesso l'origine dei conflitti.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Filippo', last='Bocchi',
  role='Direttore Valore Condiviso e Sostenibilità', company='Gruppo Hera', city='Bologna',
  linkedin='https://www.linkedin.com/in/filippo-bocchi-144b6315/',
  emails=['filippo.bocchi@gruppohera.it', 'f.bocchi@gruppohera.it', 'filippo.bocchi@hera.it'],
  website='https://www.gruppohera.it',
  theme='costi fissi delle emissioni pro capite e limiti strutturali del comportamento individuale',
  sources=['https://www.gruppohera.it/gruppo/chi-siamo/struttura-organizzativa/i-nostri-manager/filippo-bocchi',
           'https://www.linkedin.com/in/filippo-bocchi-144b6315/'],
  ff='ff.58.1',
  msg="""Ciao Filippo,

da marzo 2019 sei Direttore Valore Condiviso e Sostenibilità del Gruppo Hera, con la Balanced Scorecard agganciata al piano industriale e, dal 2025, il ruolo di dirigente preposto alla rendicontazione di sostenibilità. Tradurre valore condiviso in indicatori che stanno dentro un ciclo di pianificazione è un lavoro poco raccontato.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta su quel confine tra scelta individuale e struttura:

🔟 ff.58.1 Il costo di una vita umana — in How Bad Are Bananas Mike Berners-Lee calcola il costo ecologico di quasi tutto: un mutuo, un incidente stradale, il sistema educativo. Le medie pro capite dicono 28 tonnellate negli Stati Uniti, 15 per un europeo, 3 in Cina, 0,1 in Malawi. Il passaggio interessante è che, anche curando molto scelte alimentari e comportamenti, sotto le 3 tonnellate si scende a fatica: troppi costi fissi legati a servizi, istruzione e sanità di uno standard da primo mondo.

Per una multiutility che rendiconta valore condiviso, quei costi fissi sono esattamente la parte su cui può incidere.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Elisa', last='Costamagna',
  role='Responsabile Controllo di Gestione Gruppo Herambiente', company='Herambiente (Gruppo Hera)', city='Rimini/Bologna',
  linkedin='https://it.linkedin.com/in/elisa-costamagna-470835170',
  emails=['elisa.costamagna@gruppohera.it', 'elisa.costamagna@herambiente.it', 'e.costamagna@gruppohera.it'],
  website='https://ha.gruppohera.it',
  theme='origine reale delle microplastiche e leve di riduzione a monte del rifiuto',
  sources=['https://it.linkedin.com/in/elisa-costamagna-470835170',
           'https://www.gruppohera.it/gruppo/chi-siamo/struttura-organizzativa'],
  ff='ff.47.3',
  msg="""Ciao Elisa,

sei responsabile del controllo di gestione di Herambiente, la parte del Gruppo Hera che tratta i rifiuti. Guardi i numeri di un business che esiste perché a monte qualcuno produce scarti, e questo dà una prospettiva particolare su dove convenga davvero intervenire.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sposta il punto di intervento:

🐧 ff.47.3 Lavatrici contro le microplastiche — ogni anno ne ingeriamo circa 50.000 particelle, ne inaliamo 100.000, ne beviamo 90.000 da bottiglia di plastica contro 4.000 dall'acqua del rubinetto. Immaginavo che la fonte fossero i rifiuti degradati dagli agenti atmosferici: in realtà il 35% arriva dai bucati in lavatrice. Al CES Patagonia ha presentato un programma di lavaggio che riduce del 54% la plastica rilasciata, e uno studio quantifica il resto: meno fast fashion, lavare meno, a freddo, in modalità gentile — solo questo vale il 70% della riduzione.

Per chi lavora nel ciclo dei rifiuti, quel 35% racconta quanta parte del problema non passa mai da un cassonetto.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Gabriele', last='Raineri',
  role='Chief ICT & Digital Officer', company='Snam', city='Milano/San Donato Milanese',
  linkedin='https://www.linkedin.com/in/rainerigabriele/',
  emails=['gabriele.raineri@snam.it', 'g.raineri@snam.it', 'gabriele.raineri@snamretegas.it'],
  website='https://www.snam.it',
  theme='AI applicata all ottimizzazione di algoritmi e consumi delle infrastrutture di calcolo',
  sources=['https://www.snam.it/en/we-snam/about-us/management-and-company-structure/gabriele-raineri.html',
           'https://www.linkedin.com/in/rainerigabriele/'],
  ff='ff.126.4',
  msg="""Ciao Gabriele,

da febbraio 2026 sei Chief ICT & Digital Officer di Snam, dopo essere stato Chief Digital & IT Officer della GBU Energy Solutions di ENGIE e prima ancora CIO di ENGIE Italia. Hai fatto tutta la carriera nel punto in cui l'IT incontra un'infrastruttura energetica fisica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su cosa stanno diventando questi sistemi:

🅰️ ff.126.4 AlphaEvolve — dopo AlphaGo e AlphaStar, Google DeepMind ha presentato un sistema che lavora sulla matematica invece che sui videogiochi. Mentre stabilisce un nuovo record di 593 sfere nel problema dei baci in 11 dimensioni, riduce dell'1% il consumo dei data center e migliora l'algoritmo di Strassen, imbattuto dal 1969. Un modello che ottimizza l'infrastruttura su cui gira.

Per chi guida l'ICT di un operatore di rete, quell'1% è la dimostrazione che l'ottimizzazione algoritmica ha smesso di essere solo un tema da paper.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Marco', last='Giulivi',
  role="Head of ESG, CEO's Office & Sustainability", company='Edison', city='Milano',
  linkedin='https://it.linkedin.com/in/marco-giulivi',
  emails=['marco.giulivi@edison.it', 'm.giulivi@edison.it', 'marco.giulivi@edison.com'],
  website='https://www.edison.it',
  theme='prezzo del carbonio, offset e capitale sbloccato per la transizione',
  sources=['https://it.linkedin.com/in/marco-giulivi',
           'https://theorg.com/org/edison-spa/org-chart/marco-giulivi'],
  ff='ff.16.3',
  msg="""Ciao Marco,

sei Head of ESG nel CEO's Office & Sustainability di Edison, dove ti occupi di posizionamento strategico e modelli di business, dopo aver lavorato sull'integrazione ESG e performance per gas e power e sullo sviluppo nelle rinnovabili. Il carbon pricing è una delle variabili che ti passano davanti ogni volta che si valuta un investimento.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su quella variabile:

⚫ ff.16.3 Il mercato (nero) della CO2 — il mercato è tutt'altro che equo, con prezzi da 7 dollari a tonnellata in Cina fino a oltre 150 in Svezia e l'area europea intorno ai 75. C'è poi il capitolo delle emissioni evitate, dove un'azienda ottiene crediti dichiarando di inquinare meno di quanto potrebbe. McKinsey stima che a 50 euro per tonnellata si sblocchi un ulteriore 21% del capitale necessario alla transizione, e che a 100 euro si arrivi a oltre l'80% delle spese in conto capitale con un business case autonomo.

Per chi valuta progetti in una utility, quelle soglie decidono cosa passa in comitato investimenti.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Filippo', last='Casagrande',
  role='Innovation Scouting, Innovation & Market Solutions', company='Terna', city='Milano/Nord Est',
  linkedin='https://www.linkedin.com/in/filippo-casagrande-96b6b514b/',
  emails=['filippo.casagrande@terna.it', 'f.casagrande@terna.it', 'filippo.casagrande@terna.eu'],
  website='https://www.terna.it',
  theme='tecnologie che raggiungono maturità e criteri per riconoscere un trend che decolla',
  sources=['https://www.smau.it/paris/relatori/filippo.casagrande',
           'https://theorg.com/org/terna-rete-elettrica-nazionale-spa/org-chart/filippo-casagrande',
           'https://www.linkedin.com/in/filippo-casagrande-96b6b514b/'],
  ff='ff.45.3',
  msg="""Ciao Filippo,

fai innovation scouting in Terna, nella divisione Innovation & Market Solutions, dopo quattro anni in Snam tra open innovation e project management sugli applicativi di asset industriali. Il tuo lavoro consiste nel distinguere le soluzioni pronte da quelle che sembrano pronte.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel criterio:

🚀 ff.45.3 Quali trend decolleranno? — EmergingTechBrew ha isolato tre tecnologie arrivate a maturità e a un punto di diffusione esponenziale: rimozione della CO2 dall'atmosfera, satelliti per la connessione internet e AI generativa. Gartner, sull'orizzonte 1-3 anni, metteva invece in fila divario retributivo uomo-donna, consumo energetico dell'AI superiore a quello dei lavoratori umani e attacchi DDoS alle aziende come forma di protesta o sciopero digitale.

Per chi fa scouting su una rete elettrica nazionale, la seconda lista è più interessante della prima: sono gli scenari che nessuno mette a budget finché non arrivano.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Francesco', last='Zeggio',
  role='Innovation Project Manager', company='Plenitude (Eni)', city='Milano',
  linkedin='https://www.linkedin.com/in/zeggio/',
  emails=['francesco.zeggio@eniplenitude.com', 'francesco.zeggio@eni.com', 'f.zeggio@eniplenitude.com'],
  website='https://corporate.eniplenitude.com',
  theme='composizione della nuova capacità di generazione e peso relativo delle rinnovabili',
  sources=['https://www.linkedin.com/in/zeggio/',
           'https://corporate.eniplenitude.com/en/about/management'],
  ff='ff.11.1',
  msg="""Ciao Francesco,

sei Innovation Project Manager in Plenitude, dopo tre anni nella direzione strategy di un grande operatore energetico su identificazione di opportunità di crescita. Plenitude mette insieme generazione rinnovabile, vendita di energia e ricarica elettrica, quindi vedi la filiera dall'impianto fino al cliente finale.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che fotografa il punto di partenza di quella filiera:

🌬️ ff.11.1 La rivincita delle rinnovabili? — in un anno l'intera crescita della nuova generazione elettrica è arrivata da tre fonti: eolico, solare e idroelettrico. L'eolico ha fatto da padrone con +163 TWh, contro i 148 del solare e i 78 dell'idroelettrico, e la diminuzione del carbone è stata assorbita interamente da queste tre. Nella stessa fotografia il nucleare segna -94 TWh.

Per chi lavora su innovazione in un operatore integrato, quel sorpasso dell'eolico sul solare è un promemoria che l'ordine delle tecnologie cambia più in fretta dei piani industriali.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Fabio', last='Monachesi',
  role='Global Product Manager, Gridscale X e strumenti di pianificazione di rete', company='Siemens', city='Italia',
  linkedin='https://www.linkedin.com/in/fabiomonachesi/',
  emails=['fabio.monachesi@siemens.com', 'monachesi.fabio@siemens.com', 'fabio.monachesi@siemens-energy.com'],
  website='https://www.siemens.com/it/it.html',
  theme='domanda elettrica generata dal calcolo AI e pianificazione della capacità di rete',
  sources=['https://theorg.com/org/siemens/org-chart/fabio-monachesi',
           'https://www.linkedin.com/in/fabiomonachesi/'],
  ff='ff.135.2',
  msg="""Ciao Fabio,

sei Global Product Manager in Siemens su Gridscale X e sugli strumenti di pianificazione di rete, dopo anni in ABB su microgrid, e-mobility ed energy management e la co-fondazione di EnergyFit. Chi costruisce software di pianificazione deve ipotizzare oggi carichi che si presenteranno tra qualche anno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul carico che sta arrivando:

🌊 ff.135.2 Onda (anomala) energetica — Musk punta a comprare 50 milioni di H100 in cinque anni, circa 35 GW assorbiti, il 2% del consumo elettrico globale di oggi. Altman lo pone come scelta esplicita: con 10 GW di calcolo l'AI può curare il cancro oppure fare da tutor privato a tutti gli studenti del mondo, non entrambe le cose, e la sua risposta è costruire una centrale capace di generare 1 GW di calcolo a settimana. Sul fronte opposto il solare in dieci anni è passato da zero a 2073 TWh, con 500 miliardi di dollari investiti, più di quanto si spese per l'aviazione nella seconda guerra mondiale.

Per chi modella scenari di rete, quei GW sono un carico da collocare geograficamente.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Davide', last='Alemani',
  role='Global Head of Digital Marketing & CRM, Digital Communication Channels', company='Pirelli', city='Milano',
  linkedin='https://it.linkedin.com/in/davidealemani',
  emails=['davide.alemani@pirelli.com', 'd.alemani@pirelli.com', 'davide.alemani@pirelli.it'],
  website='https://www.pirelli.com',
  theme='smaterializzazione dell esperienza e ruolo dei canali digitali come portali sul reale',
  sources=['https://theorg.com/org/pirelli-c-spa/org-chart/davide-alemani',
           'https://www.ecommerceday.it/relatore-davide-alemani/',
           'https://it.linkedin.com/in/davidealemani'],
  ff='ff.64.4',
  msg="""Ciao Davide,

guidi digital marketing, CRM e canali di comunicazione digitale in Pirelli, con il presidio su metaverso e Web3, dopo l'innovazione digitale e la strategia social in Ferrari e una lunga esperienza in Microsoft. Vendi un prodotto fatto di gomma attraverso canali che di materiale non hanno niente.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quella tensione:

👨‍💻 ff.64.4 Matrix e materia — cloud, IoT, 5G, QR code e realtà aumentata integrata in quella vera; schermi, Oculus e Vision Pro come portali. L'urbanizzazione ci ha tolto verde e animali, la digitalizzazione cemento e asfalto. Baudrillard in Simulacri e simulazioni scriveva già nel 1981 che la società ha sostituito la realtà delle cose con simboli e segni al punto da rendere l'esperienza umana una simulazione del reale. L'esempio è un albero che diventa sorgente di frutta, poi legna, poi soggetto per una foto su Instagram.

Per chi progetta l'esperienza digitale di un marchio industriale, quella catena descrive bene cosa succede al prodotto lungo il funnel.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),
]

# ---- enrich + validate -------------------------------------------------------
assert len(LEADS) == 20, len(LEADS)
seen_ff = {}
for l in LEADS:
    v = IDX.get(l['ff'])
    assert v, 'ff code not in data.js index: %s' % l['ff']
    assert re.fullmatch(r'ff\.\d+\.\d+', l['ff']), l['ff']
    l['ff_title'] = v['title']
    l['ff_url'] = v['link']
    l['message'] = l['msg'].replace('{url}', v['link'])
    l['subject'] = 'Spunto %s per %s' % (l['ff'], l['first'])
    l['words'] = len(l['message'].split())
    l['excerpt_text'] = re.sub(r'\s+', ' ', v['content'])[:300]
    seen_ff[l['ff']] = seen_ff.get(l['ff'], 0) + 1
    assert l['ff'] in l['message'], l['ff']
    assert l['ff_url'] in l['message']
    assert 150 <= l['words'] <= 240, (l['first'], l['words'])
assert max(seen_ff.values()) <= 3, seen_ff
print('distinct ff codes:', len(seen_ff))

names = ['%s %s' % (l['first'], l['last']) for l in LEADS]
assert len(set(names)) == 20
DEDUP = set(json.load(open(os.path.join(OUT, '_dedupnames_b96.json'), encoding='utf-8')))
clash = [n for n in names if n.lower() in DEDUP]
assert not clash, clash
print('dedup check passed, 0 collisions')

# ---- CSV ---------------------------------------------------------------------
csv_path = os.path.join(OUT, 'batch%d_%s.csv' % (BATCH, DATE))
cols = ['first_name', 'last_name', 'role', 'company', 'city_or_region', 'linkedin_url',
        'email_public', 'email_best', 'guessed_emails', 'website', 'focus_theme',
        'why_match', 'source_urls', 'excerpt_text', 'excerpt_id', 'template_id',
        'template_subject', 'priority', 'status', 'owner', 'next_action']
with open(csv_path, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    for i, l in enumerate(LEADS):
        w.writerow({
            'first_name': l['first'], 'last_name': l['last'], 'role': l['role'],
            'company': l['company'], 'city_or_region': l['city'],
            'linkedin_url': l['linkedin'], 'email_public': '',
            'email_best': l['emails'][0], 'guessed_emails': '|'.join(l['emails']),
            'website': l['website'], 'focus_theme': l['theme'],
            'why_match': 'Spunto %s (%s) collegato a %s' % (l['ff'], l['ff_title'], l['theme']),
            'source_urls': '|'.join(l['sources']),
            'excerpt_text': l['excerpt_text'], 'excerpt_id': l['ff'],
            'template_id': 'ff-outreach-v3', 'template_subject': l['subject'],
            'priority': 'P1' if i < 10 else 'P2', 'status': 'queued',
            'owner': 'micmer.clawdbot', 'next_action': 'create_gmail_draft_manual'})

# ---- MD ----------------------------------------------------------------------
md_path = os.path.join(OUT, 'batch%d_%s.md' % (BATCH, DATE))
with open(md_path, 'w', encoding='utf-8') as f:
    f.write('# FF Outreach — batch %d (%s)\n\n' % (BATCH, DATE))
    f.write('20 lead nuovi, template `ff-outreach-v3`. Stato: **drafted**, invio NON autorizzato.\n\n')
    for i, l in enumerate(LEADS):
        f.write('---\n\n## %d. %s %s — %s, %s\n\n' % (START_ID + i, l['first'], l['last'], l['role'], l['company']))
        f.write('- LinkedIn: %s\n' % l['linkedin'])
        f.write('- Email (guess): %s\n' % ', '.join(l['emails']))
        f.write('- Spunto: **%s** — %s\n' % (l['ff'], l['ff_title']))
        f.write('- Link: %s\n' % l['ff_url'])
        f.write('- Fonti: %s\n' % ' | '.join(l['sources']))
        f.write('- Priorità: %s — parole: %d\n\n' % ('P1' if i < 10 else 'P2', l['words']))
        f.write('**Oggetto:** %s\n\n' % l['subject'])
        f.write('```\n%s\n```\n\n' % l['message'])

# ---- tracker merge -----------------------------------------------------------
backup = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b%d.json' % BATCH
shutil.copyfile(TRACKER, backup)
T = json.load(open(TRACKER, encoding='utf-8'))
before_contacts = len(T['contacts'])
before_meta_total = T['meta']['total_drafted']
before_top_total = T.get('total_drafted')
existing_ids = {c['id'] for c in T['contacts']}
assert not existing_ids & set(range(START_ID, START_ID + 20)), 'id collision'

for i, l in enumerate(LEADS):
    T['contacts'].append({
        'id': START_ID + i,
        'name': '%s %s' % (l['first'], l['last']),
        'role': l['role'],
        'org': l['company'],
        'channel': 'email',
        'ff_post': l['ff'],
        'ff_post_title': l['ff_title'],
        'ff_post_url': l['ff_url'],
        'subject': l['subject'],
        'message': l['message'],
        'emails_guessed': l['emails'],
        'words': l['words'],
        'status': 'drafted',
        'date': DATE,
        'batch': BATCH,
        'send_authorized': False,
    })

T['meta']['last_batch'] = BATCH
T['meta']['last_batch_date'] = DATE
T['meta']['updated'] = DATE
T['meta']['total_drafted'] = before_meta_total + 20
T['total_drafted'] = (before_top_total or 0) + 20
json.dump(T, open(TRACKER, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---- verify ------------------------------------------------------------------
V = json.load(open(TRACKER, encoding='utf-8'))
ids = [c['id'] for c in V['contacts']]
b = [c for c in V['contacts'] if c.get('batch') == BATCH]
print('backup            :', backup)
print('csv               :', csv_path)
print('md                :', md_path)
print('contacts before   :', before_contacts, '-> after:', len(V['contacts']))
print('meta.total_drafted:', before_meta_total, '->', V['meta']['total_drafted'])
print('top total_drafted :', before_top_total, '->', V['total_drafted'])
print('batch %d records  :' % BATCH, len(b))
print('duplicate ids     :', len(ids) - len(set(ids)))
print('id range          :', min(c['id'] for c in b), '-', max(c['id'] for c in b))
print('distinct ff.x.y   :', len({c['ff_post'] for c in b}))
print('words min/max     :', min(c['words'] for c in b), '/', max(c['words'] for c in b))
print('companies         :', len({c['org'] for c in b}))
bad = [c['id'] for c in b if c['status'] != 'drafted' or c['send_authorized'] is not False]
print('bad status/auth   :', bad)
