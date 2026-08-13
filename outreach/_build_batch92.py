# -*- coding: utf-8 -*-
"""Build FF outreach batch 92 (2026-08-06): CSV + MD + tracker merge."""
import json, csv, sys, io, os, shutil, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
DATE = '2026-08-06'
BATCH = 92
START_ID = 1577

IDX = json.load(open(os.path.join(OUT, '_ffidx_b92.json'), encoding='utf-8'))

LEADS = [
 dict(first='Stefano', last='Pareglio',
      role='Presidente, Deloitte Climate & Sustainability',
      company='Deloitte Italia', city='Milano',
      li='https://it.linkedin.com/in/stefano-pareglio-3a2b2020a',
      emails=['spareglio@deloitte.it', 'stefano.pareglio@deloitte.it', 'spareglio@deloitte.com'],
      site='https://www.deloitte.com/it/it/',
      theme='decarbonizzazione, transizione energetica ed economia circolare per le imprese italiane',
      src='https://www.deloitte.com/it/it/about/people/profiles.spareglio+1521f0bf.html',
      ff='ff.1.2',
      msg="""Ciao Stefano,

presiedi Deloitte Climate & Sustainability, quindi passi le giornate a tradurre la crisi climatica in numeri che un consiglio di amministrazione possa usare per decidere. È il passaggio più difficile del mestiere: la fisica del problema resta la stessa, ma il linguaggio deve cambiare a ogni riunione.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta esattamente su quel crinale:

📉 ff.1.2 Da 51 miliardi a 0 — Bill Gates in Clima, come evitare un disastro riduce tutto a due numeri da interiorizzare. Il primo è 51 miliardi: le tonnellate di CO2-equivalente che emettiamo ogni anno, con oscillazioni ma senza variazioni di ordine di grandezza. Il secondo è zero, che è dove dobbiamo arrivare.

Mi interessa la brutalità del framing. Tolti gli scenari, i target intermedi e le tassonomie, resta un rapporto tra due cifre che chiunque può tenere a mente. Nel tuo lavoro, immagino, il problema è tenere insieme quella semplicità e la complessità dei piani di transizione reali, dove ogni settore ha una curva di costo diversa.

Spunto completo: https://fortissimo.substack.com/i/43851632/ff12-da-51-miliardi-a-0

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Fabio', last='Pompei',
      role='CEO Deloitte Italia e Central Mediterranean',
      company='Deloitte Italia', city='Roma',
      li='https://www.linkedin.com/in/fabio-pompei-96b5005/',
      emails=['fpompei@deloitte.it', 'fabio.pompei@deloitte.it', 'fpompei@deloitte.com'],
      site='https://www.deloitte.com/it/it/',
      theme='crescita economica, flussi di capitale e trasformazione delle imprese nel Mediterraneo centrale',
      src='https://www.deloitte.com/it/it/issues/climate/c-suite-sustainability-report.html',
      ff='ff.13.1',
      msg="""Ciao Fabio,

guidi Deloitte in Italia e nel Central Mediterranean, quindi la domanda sulla crescita ti arriva addosso in due versioni ogni settimana: quella dei clienti che devono pianificare i prossimi tre anni e quella macro, dove il paese cresce molto meno di quanto servirebbe.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che ribalta un po' la prospettiva:

📈 ff.13.1 Una crescita infinita? — la curva demografica dell'ultimo secolo è difficile da digerire, e dentro c'è una statistica che mi ha fermato: del totale degli esseri umani esistiti negli ultimi 200.000 anni, circa il 7% è vivo oggi. Il tasso di crescita annuo ha toccato il picco negli anni di Woodstock e da lì rallenta, perché quando una società raggiunge benessere, istruzione e avanzamento tecnologico intervengono altri fattori a frenare la demografia.

Lo tengo lì come promemoria: buona parte di quello che chiamiamo mercato è stata, per decenni, semplicemente più gente. Quando quel motore si spegne, la crescita deve venire da produttività e capitale, e il lavoro di consulenza diventa un'altra cosa.

Spunto completo: https://fortissimo.substack.com/i/46806059/ff131-una-crescita-infinita

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Lorenzo', last='Solimene',
      role='Partner, Sustainability & Climate Change Services',
      company='KPMG Advisory', city='Milano',
      li='https://www.linkedin.com/in/lorenzosolimene/',
      emails=['lsolimene@kpmg.it', 'lorenzo.solimene@kpmg.it', 'lsolimene@kpmg.com'],
      site='https://kpmg.com/it/it/',
      theme='rendicontazione ESG, CSRD, prevenzione del greenwashing e piani di transizione',
      src='https://kpmg.com/it/it/events/2026/04/greenwashing-come-prevenire-e-gestire-i-rischi.html',
      ff='ff.51.1',
      msg="""Ciao Lorenzo,

lavori sul greenwashing dal lato meno comodo: prevenirlo dentro le aziende, non denunciarlo dopo. Il che vuol dire discutere ogni claim con chi lo ha scritto e chiedersi se quella parola regga davanti a un'autorità.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che tocca la radice linguistica del problema:

💚 ff.51.1 L'affabulazione per il verde — il verde funziona come simbolo perché è vago. La scienza gli dà ragione (camminare nel verde riduce la ruminazione mentale, la medicina giapponese ha lo shinrin-yoku, il bagno nel bosco), ma nel pezzo cito una frase da Le otto montagne che mi torna spesso in mente: "siete voi di città che la chiamate Natura. È così astratta nella vostra testa che è astratto pure il nome. Noi qui diciamo bosco, pascolo, torrente, roccia, cose che uno può indicare con il dito".

È la stessa dinamica del greenwashing regolatorio: più il termine è astratto, meno è verificabile, più diventa utile a chi comunica. La CSRD prova a costringere tutti a indicare le cose con il dito.

Spunto completo: https://fortissimo.substack.com/i/88408587/ff-laffabulazione-per-il-verde

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Mario', last='Corti',
      role='Senior Partner, KPMG in Italia',
      company='KPMG Italia', city='Milano',
      li='https://www.linkedin.com/in/mario-corti-6b6523121/',
      emails=['mcorti@kpmg.it', 'mario.corti@kpmg.it', 'mcorti@kpmg.com'],
      site='https://kpmg.com/it/it/',
      theme='revisione di grandi gruppi bancari, M&A finanziario e governance del network KPMG in Italia',
      src='https://kpmg.com/it/it/about/leadership.html',
      ff='ff.50.2',
      msg="""Ciao Mario,

guidi KPMG in Italia dopo una carriera passata a certificare i bilanci dei grandi gruppi bancari. Chi fa quel mestiere ha una sensibilità particolare per una cosa che spesso passa inosservata: il valore della moneta con cui sono scritti i numeri che si firmano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in tema:

🪙 ff.50.2 Oro, argento, mirra, birra e Bitcoin — Saifedean Ammous in The Bitcoin Standard fa notare che il progresso tecnologico del Novecento coincide con il gold standard, e i grafici mostrano un plateau del valore delle monete rispetto all'oro tra il 1920 e il 1970, seguito da una svalutazione netta. I dati OECD indicano dal 1990 al 2015 un aumento globale annuo di valuta del 7,2%. La catena che ne deriva è secca: svalutazione, meno fiducia nel futuro, meno investimenti, meno crescita.

La tesi è discutibile e in parte ideologica, però pone una domanda seria a chi certifica valore: quanto di ciò che misuriamo come crescita è unità di conto che si muove.

Spunto completo: https://fortissimo.substack.com/i/90181693/ff-oro-argento-mirra-birra-e-bitcoin

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Piero', last='Zanchi',
      role='Digital Core Lead Italia e Grecia',
      company='Accenture', city='Roma',
      li='https://www.linkedin.com/in/piero-zanchi-9669423/',
      emails=['piero.zanchi@accenture.com', 'p.zanchi@accenture.com'],
      site='https://www.accenture.com/it-it',
      theme='cloud, piattaforme enterprise e infrastruttura digitale dei grandi clienti italiani',
      src='https://www.datamanager.it/2026/05/piero-zanchi-nominato-responsabile-dellarea-digital-core-di-accenture/',
      ff='ff.1.5',
      msg="""Ciao Piero,

da maggio guidi il Digital Core di Accenture per Italia e Grecia, quindi hai in mano la parte dello stack che i clienti vedono meno e pagano di più: piattaforme, cloud, il motore che deve reggere tutto quello che ci viene montato sopra.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che riguarda il conto energetico di quel motore:

🇫🇮 ff.1.5 Il consumo energetico di Bitcoin — si stima che mantenere operante la blockchain costi quanto il consumo elettrico dell'intera Finlandia. Nel pezzo aggiungo però il contesto che di solito manca: il dato è fuorviante senza tenere conto della quota di rinnovabile usata nel mining e dei costi ecologici che il trasferimento digitale di valore evita altrove.

Lo trovo utile come esercizio mentale applicato al tuo perimetro. La domanda "quanta energia consuma questa infrastruttura" da sola non dice niente, serve sempre il confronto con ciò che sostituisce. Vale per il mining e vale, oggi molto di più, per i data center che stiamo riempiendo di GPU.

Spunto completo: https://fortissimo.substack.com/i/43851632/ff15-il-consumo-energetico-di-bitcoin

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Massimiliano', last='Facchini',
      role='Health & Public Service Lead Italia, Europa Centrale e Grecia',
      company='Accenture', city='Roma',
      li='https://it.linkedin.com/in/massimiliano-facchini-9477227',
      emails=['massimiliano.facchini@accenture.com', 'm.facchini@accenture.com'],
      site='https://www.accenture.com/it-it',
      theme='trasformazione digitale della sanità e della pubblica amministrazione, adozione di AI nei servizi pubblici',
      src='https://www.industriaitaliana.it/accenture-italia-massimiliano-facchini-sanita-pubblica-amministrazione/',
      ff='ff.35.3',
      msg="""Ciao Massimiliano,

guidi Sanità e Pubblica Amministrazione per Accenture su Italia, Europa Centrale e Grecia. È il perimetro dove la sanità digitale smette di essere una demo e deve fare i conti con budget pubblici, tempi di gara e personale che va formato.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul lato finanziario del settore:

💸 ff.35.3 Tanti soldi nella medicina digitale — nel 2021 le startup salute hanno raccolto cifre straordinarie, poi crollate nel 2022 con i tassi. Un'analisi di CBInsights mostra che le cinque aziende più finanziate negli Stati Uniti valevano 3 miliardi sui 38 investiti: Devoted Health per le assicurazioni sanitarie, Medlinker, Magic Leap con applicazioni medicali dei visori, Neumora Therapeutics per farmaci più mirati sul cervello, Hinge Health per fasce digitali su problemi posturali.

Guardando quella lista a distanza di qualche anno colpisce quanto poco riguardi ciò che tu affronti davvero: interoperabilità, dati, percorsi di cura. Il capitale privato ha finanziato prodotti, mentre il collo di bottiglia pubblico è quasi sempre l'integrazione.

Spunto completo: https://fortissimo.substack.com/i/50745954/ff353-tanti-soldi-nella-medicina-digitale

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Fabio', last='Bonfanti',
      role='Growth & Strategy Lead EMEA',
      company='Accenture', city='Milano',
      li='https://www.linkedin.com/in/fabio-bonfanti-899459/',
      emails=['fabio.bonfanti@accenture.com', 'f.bonfanti@accenture.com'],
      site='https://www.accenture.com/it-it',
      theme='strategie di crescita EMEA, adozione aziendale dell AI e trasformazione digitale',
      src='https://www.industriaitaliana.it/accenture-fabio-bonfanti-assumera-ruolo-growth-and-strategy-lead-emea/',
      ff='ff.48.3',
      msg="""Ciao Fabio,

come Growth & Strategy Lead EMEA vedi la stessa domanda arrivare da mercati molto diversi: dove mettere i soldi sull'AI nei prossimi diciotto mesi. E vedi anche quanto spesso la risposta assomigli a una lista di casi d'uso senza un ordine di priorità.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto scritto quando il tema era appena esploso:

🤹 ff.48.3 AI tutto fare — nel pezzo riprendo la mappa McKinsey delle applicazioni aziendali dei modelli generativi e uso un paragone che mi convince ancora: il salto è paragonabile a quello di Google sulla ricerca. Le informazioni erano già lì, la differenza l'ha fatta l'accesso. Nello stesso pezzo c'è la parte scomoda, con Kantrowitz che chiede al modello di immaginare la propria distopia e si sente rispondere che il vero orrore sta nelle azioni, non nell'aspetto.

Rileggerlo oggi è un buon test: quasi tutte quelle applicazioni sono diventate prodotti, e la parte difficile si è spostata su governance e qualità decisionale, che è esattamente il terreno della consulenza.

Spunto completo: https://fortissimo.substack.com/i/95768574/ff-ai-tutto-fare

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Giovanni', last='Speranza',
      role='Managing Director Banking Sector',
      company='NTT DATA Italia', city='Milano',
      li='https://www.linkedin.com/in/giovanni-speranza-95210629/',
      emails=['giovanni.speranza@nttdata.com', 'g.speranza@nttdata.com'],
      site='https://it.nttdata.com',
      theme='innovazione AI-driven, pagamenti digitali e nuovi modelli di servizio per il settore bancario',
      src='https://www.datamanager.it/2026/06/ntt-data-italia-nomina-giovanni-speranza-nuovo-managing-director-banking-sector/',
      ff='ff.125.2',
      msg="""Ciao Giovanni,

da giugno guidi il banking di NTT DATA Italia, con una storia alle spalle che passa da American Express e dai pagamenti digitali. È il punto di osservazione giusto per capire quanto in fretta si stia muovendo l'infrastruttura sotto le banche, mentre in superficie il discorso resta tutto sull'AI.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su quel sottosuolo:

💵 ff.125.2 Stabilizzare il dollaro — nel pezzo parto dal money-printing e da un dato che rende concreta l'inflazione: per un'azione dell'S&P500 negli anni Sessanta bastavano 25 ore di lavoro, oggi ne servono 24 giorni. Poi arrivo alle stablecoin, che in cinque anni hanno superato VISA e Mastercard per volume di transazioni, 15 trilioni di dollari nel 2024, con diffusione forte nei BRICS e in Arabia Saudita. Non a caso Stripe ha annunciato l'integrazione dei pagamenti in stablecoin.

Il numero che mi interessa è il sorpasso sui circuiti tradizionali. Riguarda direttamente i tuoi clienti, e non nella casella "cripto" ma in quella dei binari su cui girano i soldi.

Spunto completo: https://fortissimo.substack.com/i/163689154/ff-stabilizzare-il-dollaro

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Enzo', last='Quarenghi',
      role='Head of Client Success',
      company='NTT DATA Italia', city='Milano',
      li='https://www.linkedin.com/in/enzo-quarenghi-631650/',
      emails=['enzo.quarenghi@nttdata.com', 'e.quarenghi@nttdata.com'],
      site='https://it.nttdata.com',
      theme='banking & insurance, energy & utilities, settore pubblico e telco: relazione con i grandi mercati',
      src='https://www.primaonline.it/2026/05/26/474354/ntt-data/',
      ff='ff.52.1',
      msg="""Ciao Enzo,

da maggio sei Head of Client Success in NTT DATA Italia, con banking, insurance, energy & utilities, pubblico e telco sotto lo stesso cappello. Sono i settori dove l'infrastruttura digitale ha smesso da tempo di essere un tema IT ed è diventata una questione di sovranità.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che va in quella direzione:

🔒 ff.52.1 Un mondo criptico — il pezzo parte da una constatazione dura: il terremoto in Turchia ha mostrato stati incapaci perfino di contare le persone, valutare lo stato edilizio o assegnare i possedimenti. Nel frattempo i cittadini attraversano i confini con il digitale, lavorano da remoto e spostano denaro superando i blocchi, come è successo con la guerra in Ucraina. Durante la pandemia Google tracciava la mobilità meglio di qualunque amministrazione.

È il rovescio del tuo lavoro. Le funzioni che consideriamo pubbliche stanno migrando su infrastrutture private, e chi le costruisce si prende una responsabilità che nessun contratto di servizio descrive davvero.

Spunto completo: https://fortissimo.substack.com/i/83498036/ff-un-mondo-criptico

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Fabio', last='Tedesco',
      role='Head of Client Value',
      company='NTT DATA Italia', city='Milano',
      li='https://www.linkedin.com/in/fabio-tedesco-86443733/',
      emails=['fabio.tedesco@nttdata.com', 'f.tedesco@nttdata.com'],
      site='https://it.nttdata.com',
      theme='cloud, enterprise platform, cybersecurity e data & intelligence',
      src='https://www.ictbusiness.it/news/ntt-data-si-riorganizza-e-presenta-la-nuova-squadra-di-manager.aspx',
      ff='ff.30.5',
      msg="""Ciao Fabio,

guidi il Client Value di NTT DATA Italia, quindi cloud, piattaforme enterprise, cybersecurity e data & intelligence stanno tutti nella stessa casella. È una struttura che ha senso solo se si accetta che la velocità di una di queste aree cambia i piani delle altre.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto di qualche anno fa che regge sorprendentemente bene:

📈 ff.30.5 I miglioramenti in solo un anno — da anni si prevede che i limiti fisici e quantistici alla Legge di Moore blocchino il progresso sulla potenza di calcolo, e da anni si trovano modi per aggirarli. Nel pezzo lo misuro su DALL-E: in dodici mesi, dalla prima alla seconda versione, la risoluzione è quadruplicata. Chiudevo scommettendo sul passo successivo, il video.

Il punto per chi pianifica architetture come te è la durata dell'ipotesi. Un'assunzione sulla capacità di calcolo scritta in un business case oggi ha una vita utile misurabile in mesi, mentre i contratti che ci si costruiscono sopra durano anni.

Spunto completo: https://fortissimo.substack.com/i/60166534/ff305-i-miglioramenti-in-solo-un-anno

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Luca', last='Bonaccorsi',
      role='Partner Sustainability, Sustainability Reporting',
      company='PwC Italia', city='Milano',
      li='https://www.linkedin.com/in/luca-bonaccorsi-a15917109/',
      emails=['luca.bonaccorsi@pwc.com', 'l.bonaccorsi@pwc.com'],
      site='https://www.pwc.com/it/it.html',
      theme='sustainability reporting, CSRD ed EFRAG, metriche ESG per le imprese',
      src='https://www.meetpwc.it/event/ESGAcademyGenova',
      ff='ff.68.2',
      msg="""Ciao Luca,

lavori sul sustainability reporting in PwC e siedi nei tavoli EFRAG, quindi ti tocca la parte del mestiere dove si decide non cosa fare, ma cosa contare. È lì che si gioca quasi tutto: una metrica scelta male orienta anni di investimenti.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta sul lato oscuro della misurazione:

📏 ff.68.2 Sempre più misurati e controllati — il pezzo parte da me: sonno, calorie, glicemia, HRV, passi, iscritti alla newsletter. E arriva a una tesi scomoda, cioè che più misuriamo e più definiamo soglie assolute, più ci facciamo male. Sul piano mentale, perché in mancanza di crescita costante arriva la sensazione di fallimento; e su quello fisico, con un paper che discute l'effetto deleterio delle soglie assolute in medicina quando decidono l'assegnazione delle terapie.

Applicato alla rendicontazione ESG mi sembra pertinente: le soglie servono, ma trasformano un fenomeno continuo in un pass/fail, e a quel punto l'incentivo dell'azienda si sposta sulla soglia invece che sul fenomeno.

Spunto completo: https://fortissimo.substack.com/i/134579785/ff-sempre-piu-misurati-e-controllati

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesco', last='Ronco',
      role='Partner, Responsabile Technical & Methodology',
      company='PwC Italia', city='Milano',
      li='https://it.linkedin.com/in/francesco-ronco-a32ab61',
      emails=['francesco.ronco@pwc.com', 'f.ronco@pwc.com'],
      site='https://www.pwc.com/it/it.html',
      theme='technical accounting, metodologia di revisione, standard di reporting e qualità del dato',
      src='https://www.meetpwc.it/speaker/francesco-ronco?lang=it',
      ff='ff.145.5',
      msg="""Ciao Francesco,

in PwC Italia sei responsabile di Technical & Methodology, quindi il tuo lavoro è decidere come si rappresenta correttamente una cosa complicata: quali unità operative, quali standard, quale forma rende il dato leggibile senza tradirlo.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che tratta lo stesso problema con un oggetto molto meno serio:

🍰 ff.145.5 Grafici a torta geniali — Martí Guixé, padre del food design, sostiene che il cibo debba comunicare la propria funzione o il proprio pericolo. In I-Cakes ha sostituito le decorazioni floreali sulle torte con un grafico a torta delle percentuali degli ingredienti: un diagramma da metabolizzare prima dell'ingestione. Vent'anni prima dei sensori di glucosio, aveva già capito che per affrontare la pandemia metabolica bisogna tornare ai dati. Sui pacchetti di patatine, però, non vedremo mai l'etichetta che sta sulle Marlboro.

Il parallelo con il reporting mi sembra diretto: la rappresentazione è già una decisione, e l'estetica del documento spesso vince sulla leggibilità del numero.

Spunto completo: https://fortissimo.substack.com/i/187751091/ff-grafici-a-torta-geniali

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Giuseppe', last='Savoca',
      role='CBS Leader e Chief Operating Officer',
      company='EY Italia', city='Milano',
      li='https://it.linkedin.com/in/giuseppesavoca',
      emails=['giuseppe.savoca@it.ey.com', 'giuseppe.savoca@ey.com'],
      site='https://www.ey.com/it_it',
      theme='operations interne, digital audit ed efficienza dei processi di una firm da migliaia di persone',
      src='https://www.ey.com/it_it/people/giuseppe-savoca',
      ff='ff.8.7',
      msg="""Ciao Giuseppe,

da gennaio sei CBS Leader e COO di EY Italia, dopo aver costruito il Digital Audit per l'Italia e la regione MED. È un percorso coerente: prima automatizzi il lavoro tecnico, poi ti trovi a rispondere di come viene speso il tempo di tutta la struttura.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sul tempo la prende alla lontana:

⌛ ff.8.7 Ammazzare il tempo — Ryan Holiday nel Daily Stoic propone un conto banale e fastidioso: prendi gli anni che hai, moltiplicali per 365 e per 24, e chiediti cosa hai da mostrare per tutte quelle ore. Per molti la risposta è partite di golf, anni trascorsi in ufficio, film mediocri, una pila di libri a malapena ricordati. Il riferimento è al personaggio di Raymond Chandler nel Lungo addio: "soprattutto ammazzo il tempo, ed è duro a morire".

Lo trovo un contrappeso utile a qualunque progetto di efficienza. Un'organizzazione può recuperare ore in modo impeccabile e restare del tutto indifferente a cosa quelle ore diventano.

Spunto completo: https://fortissimo.substack.com/i/43943640/ff87-ammazzare-il-tempo

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesco', last='Lecis',
      role='Client & Industries and Business Development Leader',
      company='EY Italia', city='Milano',
      li='https://it.linkedin.com/in/francesco-lecis-5b9794',
      emails=['francesco.lecis@it.ey.com', 'francesco.lecis@ey.com'],
      site='https://www.ey.com/it_it',
      theme='supply chain autonoma, AI e big data per la manifattura, sviluppo dei mercati industriali',
      src='https://www.industriaitaliana.it/ey-supply-chain-intelligenza-artificiale-francesco-lecis/',
      ff='ff.129.2',
      msg="""Ciao Francesco,

in EY Italia segui i mercati e hai lavorato molto sulla supply chain resa più autonoma da AI e big data. È un tema dove la distanza tra la slide e il magazzino resta enorme, e chi parla con i clienti industriali la misura ogni settimana.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su come quella distanza si stia accorciando:

🥧 ff.129.2 Pi-greco, FigureAI e 1 ora "logistica"? — gli LLM stanno diventando l'interfaccia più semplice mai avuta per parlare ai robot, e questo rende la programmazione più economica e più generalizzabile. Da qui i robot foundation models: π0 di Physical Intelligence gestisce otto architetture e azioni diverse, dal preparare il caffè all'aprire i pop-corn; Helix di FigureAI combina un sistema lento e semantico che comprende scene nuove con uno rapido e motorio che agisce; SAS Prompt di Google traduce coordinate x, y, z in movimenti descritti a parole.

Il passaggio interessante per i tuoi clienti è la generalizzazione: fino a ieri ogni cella andava programmata da zero, e quel costo era la vera barriera all'automazione flessibile.

Spunto completo: https://fortissimo.substack.com/i/162404080/ff-pi-greco-figureai-e-ora-logistica

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Marco', last='Daviddi',
      role='Managing Partner EY-Parthenon Italia e Global Real Estate Leader',
      company='EY-Parthenon', city='Roma',
      li='https://www.linkedin.com/in/daviddi/',
      emails=['marco.daviddi@it.ey.com', 'marco.daviddi@parthenon.ey.com'],
      site='https://www.ey.com/it_it/services/strategy/ey-parthenon',
      theme='strategia e transazioni immobiliari, rigenerazione urbana e valore degli asset nelle città',
      src='https://www.primaonline.it/2026/07/08/478100/ey-nomina-46-nuovi-partner-e-rinnova-la-leadership-in-italia/',
      ff='ff.34.3',
      msg="""Ciao Marco,

guidi EY-Parthenon in Italia e il real estate a livello globale, quindi ti passano davanti operazioni in cui il valore di un asset dipende da cosa succede fuori dall'edificio: mobilità, spazio pubblico, qualità del quartiere nei prossimi vent'anni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che parla proprio di quel fuori:

🚦 ff.34.3 Ripensare le città: spazi vivibili — negli anni Settanta gli olandesi erano convinti sostenitori dell'automobile, al punto da trasformare in strade canali vecchi di 900 anni. Poi l'inversione a U, con una serie di progetti che hanno disincentivato l'auto e restituito spazio a verde e canali. Nel pezzo metto anche i confronti prima-dopo e gli esperimenti di chi chiede a un'AI di rifare lo stesso lavoro su immagini di Google Street View, per uscire dall'abitudine cementificata che ci impedisce di immaginare alternative.

Il punto che mi interessa è la reversibilità. Amsterdam dimostra che una scelta urbanistica sbagliata su scala cittadina si può disfare, e questo cambia il modo di valutare il rischio di lungo periodo su un portafoglio immobiliare.

Spunto completo: https://fortissimo.substack.com/i/67910559/ff-ripensare-le-citta-spazi-vivibili

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Patrizia', last='Celia',
      role='Head of Large Caps, Investment Vehicles & Sustainable Finance Partnership',
      company='Borsa Italiana - Gruppo Euronext', city='Milano',
      li='https://www.linkedin.com/in/patrizia-celia-07a94a17/',
      emails=['patrizia.celia@borsaitaliana.it', 'patrizia.celia@euronext.com', 'pcelia@euronext.com'],
      site='https://www.borsaitaliana.it',
      theme='finanza sostenibile, quotazioni large cap e dialogo tra emittenti e investitori ESG',
      src='https://esgnews.it/focus/interviste/celia-euronext-resilienza-e-competitivita-guideranno-la-finanza-sostenibile-dei-prossimi-anni/',
      ff='ff.16.4',
      msg="""Ciao Patrizia,

in Borsa Italiana segui le large cap e le partnership sulla finanza sostenibile, quindi stai nel punto di contatto tra chi cerca capitale e chi lo alloca con criteri che negli ultimi tre anni sono cambiati parecchio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che è una fotografia utile da rileggere oggi:

🆕 ff.16.4 Quali startup monitorare? — nel 2021, su circa 700 miliardi complessivi, 40 sono andati a startup e aziende in forte crescita nel clima, con incrementi del 20% ogni quadrimestre e un triplo rispetto al 2020. Tre settori si prendevano il 90% dei finanziamenti: mobilità, energia, cibo e acqua. I nomi più pesanti erano Northvolt e Rivian sulla mobilità, Helion e Commonwealth sulla fusione. Le categorie minori, tra cui la cattura delle emissioni, raccoglievano meno ma crescevano dieci volte più in fretta.

Riletto adesso è un buon promemoria su quanto la concentrazione settoriale del capitale sia un pessimo predittore. Northvolt ha fatto la fine che sappiamo, la fusione è ancora in piedi, e la selezione l'hanno fatta i fondamentali industriali.

Spunto completo: https://fortissimo.substack.com/i/45402434/ff164-quali-startup-monitorare

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Stefano', last='Gardi',
      role='Chief Sustainability Officer',
      company='Italmobiliare', city='Milano',
      li='https://it.linkedin.com/in/stefano-gardi-89190171',
      emails=['stefano.gardi@italmobiliare.it', 's.gardi@italmobiliare.it'],
      site='https://www.italmobiliare.it',
      theme='sostenibilità di portafoglio industriale, materiali e transizione delle PMI partecipate',
      src='https://esgnews.it/focus/interviste/gardi-italmobiliare-la-sostenibilita-e-per-le-persone-nei-momenti-di-incertezza-e-il-momento-di-accelerare/',
      ff='ff.64.4',
      msg="""Ciao Stefano,

sei Chief Sustainability Officer di Italmobiliare dopo dieci anni sullo sviluppo sostenibile in Italcementi. Pochi in Italia hanno guardato la materia da così vicino — cave, forni, calcestruzzo — e poi si sono trovati a ragionare su un portafoglio di aziende molto diverse tra loro.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sulla materia fa un ragionamento laterale:

👨‍💻 ff.64.4 Matrix e materia — cloud, IoT, 5G, QR code e realtà aumentata sono i portali attraverso cui la materia viene progressivamente sostituita da simboli. Cito Le non cose di Byung-Chul Han e Baudrillard, per cui la società ha rimpiazzato la realtà delle cose con segni al punto da rendere l'esperienza umana una simulazione. L'esempio che uso è secco: un albero diventa sorgente di frutta, poi raccolta di legna, poi soggetto per una foto su Instagram. Materia e madre, tra l'altro, sono legate etimologicamente.

Chi viene dal cemento ha un vantaggio in questa discussione: sa che sotto ogni infrastruttura digitale c'è ancora clinker, rame e terra movimentata, e che quella parte non si smaterializza.

Spunto completo: https://fortissimo.substack.com/i/119334503/ff-matrix-e-materia

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Simona', last='Fontana',
      role='Direttrice Generale',
      company='CONAI', city='Milano',
      li='https://it.linkedin.com/in/simona-fontana-a9abb043',
      emails=['simona.fontana@conai.org', 's.fontana@conai.org'],
      site='https://www.conai.org',
      theme='economia circolare degli imballaggi, eco-design e riciclo su scala nazionale',
      src='https://www.conai.org/notizie/cambio-al-vertice-in-conai/',
      ff='ff.19.4',
      msg="""Ciao Simona,

dirigi CONAI dopo aver guidato il Centro Studi sull'economia circolare, quindi hai visto il packaging da entrambi i lati: quello dei numeri di filiera e quello dell'oggetto che il consumatore prende dallo scaffale e poi butta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul secondo lato:

🐖 ff.19.4 Scelte sostenibili cool — l'agenzia svedese Everland ha ridisegnato il packaging della startup francese La Vie con un obiettivo esplicito: smarcarsi dall'estetica classica del mondo bio, sostenibile e vegano per allargare la clientela. Hanno usato soprattutto il rosa, che richiama il bacon, accostato al verde, con toni ironici invece che militanti, provando a stemperare le faide tra vegani e non.

Mi interessa perché è un caso in cui il design fa un lavoro che la comunicazione ambientale di solito non fa: rinuncia a segnalare virtù. Applicato al vostro perimetro, la domanda diventa quanto le etichette ambientali servano davvero a orientare il conferimento e quanto invece servano a rassicurare chi compra.

Spunto completo: https://fortissimo.substack.com/i/47216311/ff194-scelte-sostenibili-cool

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Gabriele', last='Di Cintio',
      role='Amministratore Delegato e Direttore Generale',
      company='Acea Ambiente', city='Roma',
      li='https://it.linkedin.com/in/gabriele-di-cintio-1103601',
      emails=['gabriele.dicintio@aceaspa.it', 'gabriele.dicintio@acea.it', 'g.dicintio@aceaspa.it'],
      site='https://www.gruppo.acea.it',
      theme='ciclo integrato dei rifiuti, valorizzazione energetica e riciclo delle plastiche',
      src='https://24oreventi.ilsole24ore.com/italian-waste-economy-2026/',
      ff='ff.143.4',
      msg="""Ciao Gabriele,

guidi Acea Ambiente, quindi gestisci il pezzo del ciclo dei rifiuti di cui nessuno vuole parlare finché non serve: cosa succede al residuo dopo che la raccolta differenziata ha fatto il suo lavoro, e quanta energia si riesce a tirarne fuori.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che affronta la combustione da un angolo diverso:

🔥 ff.143.4 Fuoco (3 facce) — nel pezzo metto in fila tre usi del fuoco che convivono nel mondo di oggi. La sopravvivenza, con falò di plastica e rifiuti accesi per scaldarsi. La sussistenza, con la "terra del fuoco" azera e le Flame Towers di Baku. La trascendenza, con le pire funerarie di Varanasi. La chiusura è la parte che mi resta addosso: quando il fuoco diventa plastica e l'aria un muro grigio, crollano i presupposti biologici.

Il contrasto con il tuo mestiere è netto. La stessa reazione chimica, fatta senza controllo dell'aria, produce l'immagine peggiore dell'incenerimento; fatta con i filtri e il recupero di calore, produce energia contabilizzata. La differenza è tutta impiantistica, e comunicarla resta un problema aperto.

Spunto completo: https://fortissimo.substack.com/p/ff143-scimmie-col-rolex

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Daniele', last='De Leonardis',
      role='Marketing Director Italy e Digital Marketing Director Europe',
      company='BYD', city='Milano',
      li='https://it.linkedin.com/in/daniele-de-leonardis-1023a82',
      emails=['daniele.deleonardis@byd.com', 'd.deleonardis@byd.com', 'daniele.de.leonardis@byd.com'],
      site='https://www.byd.com/it',
      theme='marketing della mobilità elettrica, posizionamento del brand EV e comunicazione ambientale',
      src='https://www.insidemarketing.it/nomina-byd-italia-daniele-de-leonardis-marketing-director-digital-marketing-director/',
      ff='ff.5.1',
      msg="""Ciao Daniele,

sei Marketing Director Italy di BYD dopo Abarth e Stellantis, quindi hai venduto motori termici e adesso vendi elettrico allo stesso pubblico. La campagna "mentre il pianeta si scalda" fa capire che non intendi girare intorno all'argomento ambientale.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sull'argomento è volutamente scomodo:

❓ ff.5.1 Non è tutto verde quello che luccica — la startup olandese Lightyear One faceva notare che, considerando l'intero ciclo di vita, una piccola utilitaria a benzina può inquinare meno di una Tesla Model S. Nel pezzo però riporto anche il seguito: prendendo la media delle efficienze, percorrenze e costi, ARK stimava comunque Tesla tre anni avanti ai concorrenti sulla mobilità elettrica, con l'EV mediano del 2021 allineato alla Model 3 del 2018.

Il motivo per cui te lo mando è la struttura dell'argomento. Il dato scomodo sul ciclo di vita è vero e va detto, e proprio per questo funziona meglio di uno slogan: chi compra oggi un'elettrica sa che il confronto si gioca su batteria, chilometraggio reale e mix energetico, non sul tubo di scarico.

Spunto completo: https://fortissimo.substack.com/i/44017566/ff51-non-e-tutto-verde-quello-che-luccica

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),
]

assert len(LEADS) == 20, len(LEADS)
codes = [l['ff'] for l in LEADS]
assert len(set(codes)) == 20, 'ff codes not distinct'
for c in codes:
    assert c in IDX, 'ff code not in data.js index: ' + c

# ---------- enrich ----------
for i, l in enumerate(LEADS):
    v = IDX[l['ff']]
    l['id'] = START_ID + i
    l['ff_title'] = v['title']
    l['ff_url'] = v['link']
    l['excerpt'] = re.sub(r'\s+', ' ', v['content'])[:300]
    l['subject'] = 'Spunto %s per %s' % (l['ff'], l['first'])
    l['msg'] = l['msg'].strip()
    l['words'] = len(l['msg'].split())
    l['priority'] = 'P1' if i < 10 else 'P2'

# ---------- CSV ----------
csv_path = os.path.join(OUT, 'batch%d_%s.csv' % (BATCH, DATE))
cols = ['first_name', 'last_name', 'role', 'company', 'city_or_region', 'linkedin_url',
        'email_public', 'email_best', 'guessed_emails', 'website', 'focus_theme', 'why_match',
        'source_urls', 'excerpt_text', 'excerpt_id', 'template_id', 'template_subject',
        'priority', 'status', 'owner', 'next_action']
with open(csv_path, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    for l in LEADS:
        w.writerow({
            'first_name': l['first'], 'last_name': l['last'], 'role': l['role'],
            'company': l['company'], 'city_or_region': l['city'], 'linkedin_url': l['li'],
            'email_public': '', 'email_best': l['emails'][0],
            'guessed_emails': ' | '.join(l['emails']), 'website': l['site'],
            'focus_theme': l['theme'],
            'why_match': 'spunto %s (%s) collegato a %s' % (l['ff'], l['ff_title'], l['theme']),
            'source_urls': l['src'], 'excerpt_text': l['excerpt'], 'excerpt_id': l['ff'],
            'template_id': 'V3', 'template_subject': l['subject'], 'priority': l['priority'],
            'status': 'queued', 'owner': 'micmer.clawdbot',
            'next_action': 'create_gmail_draft_manual',
        })
print('CSV  ->', csv_path)

# ---------- MD ----------
md_path = os.path.join(OUT, 'batch%d_%s.md' % (BATCH, DATE))
with open(md_path, 'w', encoding='utf-8') as f:
    f.write('# FF outreach — batch %d (%s)\n\n' % (BATCH, DATE))
    f.write('20 lead nuovi — consulenza, big-4, tech e digital transformation, energia e utility, '
            'ESG e finanza sostenibile, economia circolare, mobilità elettrica.\n')
    f.write('Template V3. Stato: **drafted**, invio NON autorizzato (serve GO di Michele).\n\n---\n\n')
    for l in LEADS:
        f.write('## %d. %s %s — %s, %s [%s]\n\n' % (l['id'], l['first'], l['last'], l['role'], l['company'], l['priority']))
        f.write('- LinkedIn: %s\n' % l['li'])
        f.write('- Email (guess): %s\n' % ', '.join(l['emails']))
        f.write('- Spunto: **%s** — %s\n' % (l['ff'], l['ff_url']))
        f.write('- Fonte ruolo: %s\n' % l['src'])
        f.write('- Subject: **%s** (%d parole)\n\n' % (l['subject'], l['words']))
        f.write('```\n%s\n```\n\n---\n\n' % l['msg'])
print('MD   ->', md_path)

# ---------- TRACKER MERGE ----------
backup = os.path.join(os.path.dirname(TRACKER), 'ff_outreach_tracker.backup_b%d.json' % BATCH)
shutil.copyfile(TRACKER, backup)
print('BACKUP ->', backup)

T = json.load(open(TRACKER, encoding='utf-8'))
before_contacts = len(T['contacts'])
before_drafted = T['meta']['total_drafted']
before_top = T['total_drafted']
existing_ids = set(c['id'] for c in T['contacts'])

for l in LEADS:
    assert l['id'] not in existing_ids, 'id collision %s' % l['id']
    T['contacts'].append({
        'id': l['id'],
        'name': '%s %s' % (l['first'], l['last']),
        'role': l['role'],
        'org': l['company'],
        'channel': 'email',
        'ff_post': l['ff'],
        'ff_post_title': l['ff_title'],
        'ff_post_url': l['ff_url'],
        'subject': l['subject'],
        'message': l['msg'],
        'emails_guessed': l['emails'],
        'words': l['words'],
        'status': 'drafted',
        'date': DATE,
        'batch': BATCH,
        'send_authorized': False,
        'source': l['src'],
    })

T['meta']['last_batch'] = BATCH
T['meta']['last_batch_date'] = DATE
T['meta']['updated'] = DATE
T['meta']['total_drafted'] = before_drafted + 20
T['total_drafted'] = before_top + 20
json.dump(T, open(TRACKER, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print('TRACKER contacts %d -> %d' % (before_contacts, len(T['contacts'])))
print('TRACKER meta.total_drafted %d -> %d' % (before_drafted, T['meta']['total_drafted']))
print('TRACKER total_drafted %d -> %d' % (before_top, T['total_drafted']))
