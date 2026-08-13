# -*- coding: utf-8 -*-
"""Build FF outreach batch 93 (2026-08-07): CSV + MD + tracker merge."""
import json, csv, sys, io, os, shutil, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
DATE = '2026-08-07'
BATCH = 93
START_ID = 1597

IDX = json.load(open(os.path.join(OUT, '_ffidx_b93.json'), encoding='utf-8'))

LEADS = [
 dict(first='Antonina', last='Sorci',
      role='Sustainability Manager',
      company='Deloitte', city='Milano',
      li='https://it.linkedin.com/in/antonina-sorci-62161155',
      emails=['asorci@deloitte.it', 'antonina.sorci@deloitte.it', 'asorci@deloitte.com'],
      site='https://www.deloitte.com/it/it/',
      theme='progetti di sostenibilità e decarbonizzazione per clienti industriali',
      src='https://it.linkedin.com/in/antonina-sorci-62161155',
      ff='ff.1.4',
      msg="""Ciao Antonina,

sei Sustainability Manager in Deloitte a Milano, con un passaggio a Cambridge alle spalle. Il tuo mestiere è portare la decarbonizzazione dentro piani industriali che devono comunque reggere un business case, e la parte difficile arriva quando il cliente lavora in un settore dove il problema sta nella chimica del processo prima che nell'energia acquistata.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta esattamente lì:

{FF} — nel report di Goldman Sachs sulla decarbonizzazione curato da Michele Della Vigna l'obiettivo dichiarato è portare la cattura della CO2 sotto i 100$ per tonnellata. Piantare alberi, i natural sinks del grafico, copre al massimo il 5% delle emissioni annuali. Resta la cattura industriale nel punto di emissione, perché cemento e acciaio restano indispensabili e hanno una chimica di processo intrinsecamente sporca.

Il pezzo mi interessa per come sposta la domanda: da quanta energia rinnovabile comprare a quali processi non sono elettrificabili e cosa farne. Immagino sia il punto in cui i piani al 2030 si spaccano.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Fabrizio', last='Bacchini',
      role='Partner, responsabile Sustainability Practice Mediterranean Office',
      company='McKinsey & Company', city='Milano',
      li='https://www.linkedin.com/in/fabrizio-bacchini-97314411/',
      emails=['fabrizio_bacchini@mckinsey.com', 'fabrizio.bacchini@mckinsey.com', 'fbacchini@mckinsey.com'],
      site='https://www.mckinsey.com/it/',
      theme='sostenibilità ed ESG per utility, telco e infrastrutture di trasporto',
      src='https://www.mckinsey.com/our-people/fabrizio-bacchini/it-IT',
      ff='ff.16.3',
      msg="""Ciao Fabrizio,

sei Partner McKinsey a Milano e guidi la practice Sustainability per il Mediterraneo, con clienti tra utility, telco e infrastrutture. Sono i tre settori dove il prezzo del carbonio smette di essere un tema di reporting e diventa una voce che sposta il piano di investimenti.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in cui McKinsey compare direttamente:

{FF} — il mercato del carbonio oggi è tutto tranne che uniforme: si va da 7$/tonnellata in Cina a oltre 150$ in Svezia, con l'area europea intorno ai 75$. E poi c'è il capitolo delle emissioni "evitate", dove un'azienda ottiene crediti dicendo quanto avrebbe potuto inquinare. Nel pezzo cito la vostra stima: a 50€ per tonnellata di CO2e si sbloccherebbe un 21% aggiuntivo del capitale necessario alla transizione, sopra al 40% già messo a conto.

Quel numero mi resta in testa perché trasforma una questione morale in una riga di capital allocation. Curioso di sapere se, nei mandati che vedi oggi, quella soglia regge ancora.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Marisa', last='Parmigiani',
      role='Head of Sustainability & Stakeholder Management, Gruppo Unipol; Direttrice Fondazione Unipolis',
      company='Gruppo Unipol', city='Bologna',
      li='https://www.linkedin.com/in/marisa-parmigiani-48876312/',
      emails=['marisa.parmigiani@unipol.it', 'marialuisa.parmigiani@unipol.it', 'm.parmigiani@unipol.it'],
      site='https://www.unipol.it/',
      theme='sostenibilità assicurativa, gestione degli stakeholder e rendicontazione integrata',
      src='https://it.linkedin.com/posts/unipol-gruppo_maria-luisa-parmigiani-responsabile-sostenibilit%C3%A0-activity-7060162809480830976-YYR8',
      ff='ff.61.4',
      msg="""Ciao Marisa,

guidi Sustainability & Stakeholder Management del Gruppo Unipol dal 2010 e dirigi Fondazione Unipolis, oltre a insegnare in Bologna Business School. Lavori quindi sul punto più scivoloso del mestiere: collegare i non financial value drivers ai numeri veri e difendere quel collegamento davanti a chi lo contesta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a mettere un prezzo alla cosa:

{FF} — la decrescita felice non regge in un primo mondo digitale, quindi resta la strada di compensare e continuare a costruire. Nel pezzo faccio il conto sulla mia pelle: un andata e ritorno per Cuba vale 2,7 tonnellate di CO2, che su MyClimate si compensano con 76€ a fronte di un biglietto da 950. Le 10 tonnellate all'anno di un europeo medio costano 280€.

L'idea di trattare l'inquinamento come un abbonamento mensile è volutamente brutale, e proprio per questo utile in una discussione con un consiglio di amministrazione: rende visibile quanto poco costi oggi la parte che di solito finisce in una nota metodologica.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Barbara', last='Terenghi',
      role='Chief Sustainability Officer e responsabile Divisione Sostenibilità',
      company='Edison', city='Milano',
      li='https://www.linkedin.com/in/barbara-terenghi-05bb6bab/',
      emails=['barbara.terenghi@edison.it', 'b.terenghi@edison.it', 'barbara.terenghi@edison.eu'],
      site='https://www.edison.it/it/barbara-terenghi',
      theme='sostenibilità d\'impresa, CSRD e rendicontazione non finanziaria nel settore energetico',
      src='https://www.esg360.it/energy-transformation/terenghi-edison-verso-una-trasformazione-energetica-sostenibile-insieme-a-consumatori-e-imprese/',
      ff='ff.68.2',
      msg="""Ciao Barbara,

sei Chief Sustainability Officer di Edison e in Comitato Esecutivo dal 2022, quindi la CSRD la stai vivendo dal lato di chi deve produrre i numeri, non di chi li commenta. Da fuori sembra un esercizio di trasparenza; da dentro è soprattutto una macchina di misurazione che va costruita e mantenuta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto laterale ma pertinente:

{FF} — nel pezzo parto dall'ossessione personale per le metriche: sonno, calorie, glicemia, HRV, passi, iscritti alla newsletter. E dal paradosso che ne esce: più misuriamo e più fissiamo soglie assolute, più ci facciamo male, perché in assenza di crescita costante arriva la sensazione di fallimento e si abbandonano anche le buone pratiche. Cito anche un paper sull'effetto deleterio delle soglie assolute in medicina.

Lo giro a te perché il rischio strutturale della rendicontazione è lo stesso: un indicatore nato per guidare una decisione che finisce per diventare il fine. Sarei curioso di sapere come tenete separate le due cose.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Simone', last='Nisi',
      role='Direttore Affari Istituzionali, Regolazione e Climate Change',
      company='Edison', city='Roma',
      li='https://www.linkedin.com/in/simonenisi/',
      emails=['simone.nisi@edison.it', 's.nisi@edison.it', 'simone.nisi@edison.eu'],
      site='https://www.edison.it/',
      theme='regolazione energetica, rapporti istituzionali e politiche climatiche',
      src='https://energiaoltre.it/edison-simone-nisi-nuovo-direttore-affari-istituzionali-regolazione-e-climate-change-il-profilo-2/',
      ff='ff.11.2',
      msg="""Ciao Simone,

da febbraio guidi la Direzione Affari Istituzionali, Regolazione e Climate Change di Edison, quindi passi le giornate tra autorità di regolazione nazionali ed europee. È il punto in cui gli obiettivi climatici smettono di essere annunci e diventano vincoli con una data.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che dà la misura del contesto in cui quei vincoli vengono negoziati:

{FF} — nel 2021 la Cina ha installato 227 GW di potenza solare, contro i 140 GW installati globalmente l'anno prima. Nella classifica per capacità fotovoltaica installata la Cina sta a 254.355 MW, gli Stati Uniti a 75.572, la Germania a 53.783 e l'Italia in sesta posizione con 21.600.

Il sesto posto italiano è un dato che di solito sorprende chi non segue il settore, e regge molto peggio quando lo si normalizza per abitante. Mi interessa perché è il tipo di numero che cambia il tono di un tavolo istituzionale: si passa dal "siamo indietro" al "siamo in gara ma con un ritmo diverso".

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesca', last='Venezia',
      role='Head of Environment, Enel Green Power & Thermal Generation',
      company='Enel Green Power', city='Milano',
      li='https://it.linkedin.com/in/francesca-venezia-b831b15',
      emails=['francesca.venezia@enel.com', 'francesca.venezia@enel.it', 'f.venezia@enel.com'],
      site='https://www.enelgreenpower.com/it',
      theme='impatti ambientali della generazione rinnovabile e termica',
      src='https://it.linkedin.com/in/francesca-venezia-b831b15',
      ff='ff.56.3',
      msg="""Ciao Francesca,

sei Head of Environment per Enel Green Power & Thermal Generation, quindi guardi lo stesso problema da due lati opposti: gli impatti ambientali di chi produce da rinnovabile e quelli di chi produce da termico. Poche posizioni costringono a tenere insieme entrambe le contabilità.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che ridimensiona un po' tutte e due:

{FF} — la radiazione solare che arriva sulla Terra vale 170.000 TW, quella riflessa 50.000 TW (il 30%), e la produzione energetica mondiale sta a 15 TW, un decimillesimo del totale. Per dare un'immagine a 170.000 TW: una cascata alta un chilometro che percorre tutto l'equatore.

La conclusione che ne traggo nel pezzo è scomoda: proprio perché il flusso in ingresso è enorme, variazioni minuscole sulla frazione riflessa rendono la geoingegneria tecnicamente facile e l'equilibrio fragile. Il margine su cui lavoriamo è molto più stretto di quanto suggerisca la scala dei numeri.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesca', last='Gostinelli',
      role='Direttore e Amministratore Delegato Enel Italia',
      company='Enel Italia', city='Roma',
      li='https://www.linkedin.com/in/francesca-gostinelli-328ab3/',
      emails=['francesca.gostinelli@enel.com', 'francesca.gostinelli@enel.it', 'f.gostinelli@enel.com'],
      site='https://www.enel.com/company/about-us/chairman-management-team/francesca-gostinelli',
      theme='mercato retail, elettrificazione dei consumi e mobilità elettrica',
      src='https://www.enel.com/company/about-us/chairman-management-team/francesca-gostinelli',
      ff='ff.5.3',
      msg="""Ciao Francesca,

da marzo guidi Enel Italia dopo gli anni in Enel X, dove la mobilità elettrica era parte del perimetro. Hai quindi visto da vicino la distanza tra la curva di adozione che si progetta e quella che si osserva davvero nelle case delle persone.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che su quella distanza è piuttosto istruttivo:

{FF} — durante la pandemia negli Stati Uniti le bici elettriche hanno venduto il doppio delle auto elettriche, 500mila contro 250mila. Un report Deloitte stimava 130 milioni di e-bike vendute nel mondo tra 2020 e 2023. E il dato che trovo più interessante: con una bici elettrica la quota di spostamenti fatti su due ruote sale dal 19% al 50%, un incremento che gli autori dicono slegato dall'effetto novità.

Lo giro a te perché quel 19→50% è un cambiamento di comportamento ottenuto con un intervento tecnologico minimo. Nel dibattito sull'elettrificazione dei consumi finisce quasi sempre fuori inquadratura.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Carla', last='Napolitano',
      role='Head of Innovation',
      company='Terna', city='Roma',
      li='https://it.linkedin.com/in/carlanapolitano',
      emails=['carla.napolitano@terna.it', 'c.napolitano@terna.it', 'carla.napolitano@terna.eu'],
      site='https://www.terna.it/it',
      theme='innovazione tecnologica per la rete di trasmissione elettrica',
      src='https://it.linkedin.com/in/carlanapolitano',
      ff='ff.10.4',
      msg="""Ciao Carla,

sei Head of Innovation in Terna, quindi il tuo lavoro è decidere su cosa vale la pena scommettere quando l'orizzonte di una rete di trasmissione si misura in decenni e quello di una tecnologia in trimestri. È il tipo di scelta dove il rischio di arrivare troppo presto è reale quanto quello di arrivare tardi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su una di quelle scommesse:

{FF} — sul fronte della fusione nucleare i record di finanziamento si sono accavallati nel giro di settimane. Commonwealth Fusion Systems, spin-off legato all'MIT, ha raccolto 1,8 miliardi di dollari: tre volte il precedente record di Helion, stabilito appena un mese prima. Nel pezzo mostro anche la GIF con sessant'anni di tentativi, temperatura di funzionamento contro condizioni di fusione, e le curve oltre le quali il processo diventa "utile".

La cosa che mi ha colpito è quanto lentamente ci si muova lungo quelle curve rispetto alla velocità con cui si muove il capitale. Immagino sia una tensione che riconosci.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Angelo', last='Basile',
      role='Chief Innovation & Information Officer',
      company='Terna', city='Roma',
      li='https://it.linkedin.com/in/angelo-basile-61793a1',
      emails=['angelo.basile@terna.it', 'a.basile@terna.it', 'angelo.basile@terna.eu'],
      site='https://www.terna.it/it',
      theme='sistemi informativi, digitalizzazione e innovazione della rete elettrica nazionale',
      src='https://it.linkedin.com/in/angelo-basile-61793a1',
      ff='ff.82.1',
      msg="""Ciao Angelo,

come Chief Innovation & Information Officer di Terna hai il caso limite: un'infrastruttura che deve restare in equilibrio istante per istante e, sopra, uno stack informatico che cresce di anno in anno. Ogni nuovo carico di calcolo che entra in azienda è anche un carico elettrico che qualcuno deve dispacciare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a smontare la retorica su questo tema:

{FF} — circolano paragoni del tipo "uno scambio con ChatGPT vale un'ora di luce LED" o "un'immagine DALL-E vale una ricarica di smartphone". Nel pezzo faccio notare che il confronto è viziato: da un lato una tecnologia di massa al suo primo anno, dall'altro il risultato di un secolo di miglioramenti sul filamento a tungsteno. E se anche una richiesta all'AI consuma dieci volte una ricerca Google, resta da chiedersi quante ricerche eviti. Il MIT segnala già leve di efficientamento, dai reattori nucleari modulari alla gestione ottimizzata delle risorse di calcolo.

Mi interessa perché è il tipo di dibattito che si vince con la contabilità, non con lo slogan.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Paolo', last='Gallo',
      role='Amministratore Delegato',
      company='Italgas', city='Milano',
      li='https://it.linkedin.com/in/paolo-gallo-italgas',
      emails=['paolo.gallo@italgas.it', 'p.gallo@italgas.it', 'paolo.gallo@italgasreti.it'],
      site='https://www.italgas.it/',
      theme='digitalizzazione delle reti di distribuzione e transizione dei gas',
      src='https://it.linkedin.com/in/paolo-gallo-italgas',
      ff='ff.28.3',
      msg="""Ciao Paolo,

guidi Italgas, l'azienda che in Italia ha fatto della digitalizzazione della rete di distribuzione la propria tesi industriale. È una scommessa poco spettacolare da raccontare, perché il risultato si vede in dispersioni evitate e interventi non fatti, cioè in cose che non accadono.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto con la stessa struttura:

{FF} — Google ha introdotto su Maps un instradamento eco-friendly che evita gli imbottigliamenti, quindi riduce il tempo a motore acceso, e ha aggiunto percorsi per bici, monopattini e stazioni di ricarica lungo il tragitto per attenuare l'ansia da batteria scarica. La stima dell'azienda è di un milione di tonnellate di CO2 evitate ogni anno, l'equivalente delle emissioni di 200.000 automobili.

Il punto che mi resta è che il risparmio arriva da software su infrastruttura esistente, senza posare un metro di asfalto in più. È lo stesso ordine di grandezza logico del lavoro sulle reti, dove il guadagno si estrae da ciò che già c'è.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Alessandro', last='Bottarelli',
      role='Business Sustainability Leader, ABB Electrification Smart Power',
      company='ABB', city='Bergamo',
      li='https://it.linkedin.com/in/bottarellialessandro',
      emails=['alessandro.bottarelli@it.abb.com', 'alessandro.bottarelli@abb.com', 'a.bottarelli@it.abb.com'],
      site='https://new.abb.com/it',
      theme='economia circolare, retrofit e riciclo nei sistemi elettrici',
      src='https://new.abb.com/news/it/detail/84353/upgrade-e-riciclo-degli-interruttori-abb-in-italia',
      ff='ff.130.1',
      msg="""Ciao Alessandro,

sei Business Sustainability Leader in ABB Electrification Smart Power e da anni porti avanti il tema dell'upgrade e del riciclo degli interruttori invece della sostituzione. È un argomento che va spiegato bene, perché chiede al cliente di rinunciare al gesto più semplice: buttare e ricomprare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto con la stessa tensione dentro:

{FF} — il pezzo parte dal rifiuto di demonizzare la plastica, che fa anche molto bene, per esempio nella conservazione del cibo, e che da italiani possiamo pure rivendicare per via del Nobel a Natta nel 1963. Poi arriva il nodo: flessibilità e durabilità chimica, cioè esattamente i vantaggi del materiale, sono anche ciò che ne complica separazione e riciclo. DOW e Google X stanno provando a usare l'AI per categorizzare gli scarti per tipo di polimero.

La struttura dell'argomento mi sembra identica alla tua: la proprietà che rende un componente utile a lungo è la stessa che rende difficile chiudergli il cerchio a fine vita.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Andrea', last='Bizzi',
      role='Direttore Generale, Erion Packaging',
      company='Erion Packaging', city='Milano',
      li='https://it.linkedin.com/in/andrea-bizzi-496b05170',
      emails=['a.bizzi@erion.it', 'andrea.bizzi@erion.it', 'andrea.bizzi@erionpackaging.it'],
      site='https://erionpackaging.it/',
      theme='responsabilità estesa del produttore e gestione dei rifiuti da imballaggio',
      src='https://erion.it/it/comunicati-stampa/andrea-bizzi-nuovo-direttore-generale-del-consorzio-erion-packaging/',
      ff='ff.47.3',
      msg="""Ciao Andrea,

sei Direttore Generale di Erion Packaging e stai accompagnando i produttori dentro il nuovo Regolamento europeo su imballaggi e rifiuti di imballaggio. Il tuo lavoro poggia su un presupposto che sembra ovvio: sappiamo da dove arriva il materiale disperso.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che quel presupposto lo incrina:

{FF} — prima di scrivere il pezzo davo per scontato che le microplastiche venissero dai rifiuti degradati dagli agenti atmosferici. Il 35% arriva invece dai nostri bucati in lavatrice. Al CES, Patagonia ha presentato il Less Microfiber Cycle, un programma di lavaggio che riduce del 54% la plastica rilasciata. E le contromisure più efficaci sono banali: lavare meno, più a freddo, in modalità gentile vale da solo il 70% della riduzione. Nel corpo umano intanto stimiamo 50.000 microparticelle ingerite, 100.000 inalate, 90.000 bevute da bottiglia.

Lo giro a te perché sposta il baricentro dalla raccolta al design del prodotto e all'uso, che è poi la direzione in cui il regolamento sta spingendo.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Alberto', last='Castellanza',
      role='Director Markets & Products Development, Novamont; Managing Director Novamont GmbH',
      company='Novamont', city='Novara',
      li='https://it.linkedin.com/in/albertocastellanza',
      emails=['alberto.castellanza@novamont.com', 'a.castellanza@novamont.com', 'alberto.castellanza@novamont.it'],
      site='https://www.novamont.com/',
      theme='bioplastiche, materiali da fonti rinnovabili e sviluppo prodotto',
      src='https://www.novamont.com/leggi-comunicato-stampa/da-novamont-il-nuovo-mater-bi-per-vaschette-in-cellulosa-termolaminate-e-capsule-per-il-caff-riciclabili-anche-nel-compostaggio-domestico/',
      ff='ff.33.3',
      msg="""Ciao Alberto,

in Novamont segui mercati e sviluppo prodotti, quindi lavori sul punto in cui una molecola di origine vegetale deve reggere il confronto con una petrolchimica su prestazioni e prezzo, non solo su narrativa. Il Mater-Bi per vaschette in cellulosa e capsule compostabili in casa è esattamente quel tipo di compromesso ingegneristico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta a monte della tua filiera:

{FF} — le piante sono meno diligenti di quanto crediamo: anche con molto sole rallentano il metabolismo per non esaurire altri nutrienti come l'acqua, quindi l'efficienza di conversione da CO2 a materiale organico stabilizzato resta bassa. Alcuni gruppi stanno usando CRISPR per alzarla, e l'Innovative Genomics Institute fondato da Jennifer Doudna, finanziato tra gli altri da Chan e Zuckerberg, è diventato il centro di gravità di quella ricerca.

Se la resa a monte si muove, tutta la matematica del bio-based a valle cambia. Curioso di sapere quanto quel fronte pesi già nelle vostre valutazioni di prodotto.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Isabella', last='Manfredi',
      role='Chief Sustainability and Communications Officer, Feralpi Group; Presidente Sustainability Makers',
      company='Feralpi Group', city='Brescia',
      li='https://www.linkedin.com/in/isabella-manfredi-a25483151/',
      emails=['isabella.manfredi@feralpigroup.com', 'i.manfredi@feralpigroup.com', 'isabella.manfredi@feralpi.it'],
      site='https://www.feralpigroup.com/',
      theme='sostenibilità e comunicazione nella siderurgia, rappresentanza dei professionisti ESG',
      src='https://www.imille.com/2026/06/30/isabella-manfredi-eletta-presidente-di-sustainability-makers/',
      ff='ff.58.2',
      msg="""Ciao Isabella,

sei Chief Sustainability and Communications Officer di Feralpi e da giugno presiedi Sustainability Makers. Hai quindi due mestieri che raramente stanno nella stessa testa: produrre i dati di sostenibilità di un gruppo siderurgico e renderli comprensibili a chi non li leggerà mai in un bilancio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che è tutto su quel secondo mestiere:

{FF} — per farsi un'idea concreta di cosa siano dieci tonnellate di CO2, l'impronta annuale media di un europeo, suggerisco di guardare la pianura padana dalle prealpi orobiche. Chi non ha quella vista a disposizione può usare Seeing CO2, un gioco che rende la quantità visibile e manipolabile invece che astratta.

Lo giro a te perché il problema comunicativo della siderurgia è esattamente questo: le grandezze in gioco sono fuori dalla scala dell'esperienza quotidiana, e finché restano numeri su una slide non producono nessuna decisione, né dentro né fuori l'azienda.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Andrea', last='Falleni',
      role='CEO Southern Europe Strategic Business Unit, membro del Group Executive Board',
      company='Capgemini', city='Milano',
      li='https://www.linkedin.com/in/falleniandrea/',
      emails=['andrea.falleni@capgemini.com', 'a.falleni@capgemini.com', 'andrea.falleni@capgemini.it'],
      site='https://www.capgemini.com/it-it/',
      theme='trasformazione digitale, eco-digital economy e servizi IT per il Sud Europa',
      src='https://www.capgemini.com/about-us/management-and-governance/management-team/andrea-falleni/',
      ff='ff.1.5',
      msg="""Ciao Andrea,

guidi la Strategic Business Unit Southern Europe di Capgemini e sei tra i pochi manager del settore che parla apertamente di eco-digital economy, cioè del fatto che la crescita digitale porta con sé un conto energetico che qualcuno paga.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che su quel conto invita alla prudenza:

{FF} — si stima che l'energia necessaria a mantenere operante la blockchain di Bitcoin equivalga al consumo dell'intera Finlandia. Il numero circola ovunque, ma nel pezzo aggiungo il resto: è fuorviante se non si tiene conto dell'ampio uso di rinnovabili nel mining e dei costi ecologici che quella stessa infrastruttura evita, trasferendo valore in forma digitale.

Il motivo per cui te lo mando è metodologico più che tematico. Il consumo lordo di una tecnologia digitale, preso da solo, dice poco: conta il saldo rispetto al processo fisico che sostituisce. È la stessa aritmetica che serve per difendere un business case di trasformazione davanti a un cliente scettico.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Gea', last='Smith',
      role='Telecoms, Media & Technology Director',
      company='Capgemini Italia', city='Roma',
      li='https://it.linkedin.com/in/gea-smith',
      emails=['gea.smith@capgemini.com', 'g.smith@capgemini.com', 'gea.smith@capgemini.it'],
      site='https://www.capgemini.com/it-it/',
      theme='telecomunicazioni, IoT e 5G come nuovo core business dei servizi digitali',
      src='https://www.corrierecomunicazioni.it/digital-economy/capgemini-gea-smith-iot-e-5g-il-nostro-nuovo-core-business/',
      ff='ff.64.4',
      msg="""Ciao Gea,

guidi Telecoms, Media & Technology in Capgemini Italia e hai raccontato IoT e 5G come il nuovo core business della practice. Sono le tecnologie che rendono invisibile lo strato digitale, e proprio per questo cambiano il modo in cui le persone vivono lo spazio fisico intorno a loro.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a leggere quel passaggio in chiave culturale:

{FF} — cloud, Internet of Things, 5G, QR code, realtà aumentata: sono i portali attraverso cui la materia viene sostituita da segni e simboli. Nel pezzo cito Baudrillard, per cui la società ha rimpiazzato la realtà delle cose al punto che l'esperienza umana è diventata simulazione, e Byung-chul Han con Le non cose. E una frase che mi è rimasta: l'urbanizzazione ci ha tolto verde e animali, la digitalizzazione cemento e asfalto.

Te lo giro perché il tuo portafoglio tecnologico è letteralmente l'elenco di quei portali. Mi interesserebbe capire se, dal lato di chi li costruisce, quella lettura sembra fondata o solo suggestiva.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Fabio', last='Momola',
      role='General Manager Business Unit Digital Solutions, membro del CdA',
      company='Engineering Ingegneria Informatica', city='Milano',
      li='https://www.linkedin.com/in/fmomola/',
      emails=['fabio.momola@eng.it', 'f.momola@eng.it', 'fabio.momola@engineering.it'],
      site='https://www.eng.it/',
      theme='soluzioni digitali enterprise, GenAI applicata al business e trasformazione IT',
      src='https://www.italpress.com/engineering-fabio-momola-nominato-general-manager-business-unit-digital-solutions/',
      ff='ff.9.1',
      msg="""Ciao Fabio,

da luglio guidi la nuova Business Unit Digital Solutions di Engineering, con dentro Enterprise, Financial Services, Eng Digital e Industries Excellence. In parallelo insegni, e hai portato avanti in azienda il tema della GenAI applicata, ENGGPT compreso. Sono due punti di osservazione utili: chi costruisce e chi deve spiegare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che invecchia bene:

{FF} — DeepMind ha presentato MIA, un agente multimodale interattivo che coopera e comunica con esseri umani in un ambiente 3D chiamato Playhouse. La parte interessante è il metodo: l'agente impara per imitazione e auto-supervisione a partire da 2,94 anni di esperienza umana registrata. Guardando il video sembra un'animazione fatta male di un appendiabiti; sotto c'è un modello che ha ricostruito la quotidianità osservandola.

Rileggerlo oggi, con gli agenti entrati nei processi aziendali, dice qualcosa su quanto poco sia cambiata la ricetta di fondo e quanto sia cambiata la scala.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Massimo', last='Mancini',
      role='Senior Manager',
      company='NTT DATA Italia', city='Roma',
      li='https://it.linkedin.com/in/massimo-mancini-57510631',
      emails=['massimo.mancini@nttdata.com', 'm.mancini@nttdata.com', 'massimo.mancini@nttdata.it'],
      site='https://it.nttdata.com/',
      theme='compliance ESG, due diligence sui diritti umani e gestione degli impatti ambientali',
      src='https://www.linkedin.com/in/massimo-mancini-57510631/',
      ff='ff.112.2',
      msg="""Ciao Massimo,

come Senior Manager in NTT DATA Italia segui gli obblighi ESG che entrano in vigore dal 2026, dalla due diligence sui diritti umani alla gestione degli impatti ambientali lungo la catena di fornitura. È un lavoro che chiede di descrivere oggi scenari che si verificheranno tra anni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul limite di quell'esercizio:

{FF} — non capiamo bene neanche il presente, figurarsi il futuro: Hollywood teme l'arte generativa che ricrea attori, mentre già oggi metà degli incassi al cinema arriva da personaggi non umani. Ved Sen suggerisce di sostituire i "mai" con i "se", e nel pezzo ne elenco cinque miei: se la popolazione di robot supererà quella umana, se vivrò cinquecento anni, se non prevedo i prossimi cinque anni come penso ai prossimi cento, se uno sciame di droni autonomi comparisse all'orizzonte, se la salute biologica diventasse la nuova ricchezza.

Lo mando a te perché la compliance prospettica funziona meglio quando è costruita su condizioni verificabili invece che su previsioni.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Sara', last='Bayramoglu',
      role='Sustainability Consulting Manager, Schneider Electric Sustainability Business',
      company='Schneider Electric', city='Varese',
      li='https://it.linkedin.com/in/sarabayramoglu',
      emails=['sara.bayramoglu@se.com', 'sara.bayramoglu@schneider-electric.com', 's.bayramoglu@se.com'],
      site='https://www.se.com/it/it/',
      theme='consulenza climatica e decarbonizzazione della catena di fornitura',
      src='https://it.linkedin.com/in/sarabayramoglu',
      ff='ff.21.2',
      msg="""Ciao Sara,

sei Sustainability Consulting Manager nel Sustainability Business di Schneider Electric, con un percorso che passa da Deloitte Sustainability a Parigi, dai fornitori IKEA e da EcoAct. La decarbonizzazione della catena di fornitura la conosci quindi dai due lati: chi la chiede e chi la deve eseguire.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che riguarda il terreno su cui quelle catene poggiano:

{FF} — la quota di PIL globale legata al commercio è in declino dal picco del 2008 ed è tornata nel 2020 sui valori del 2000. Nel pezzo però metto in guardia dalla lettura facile: quell'indicatore misura il commercio fisico, e ci sono stati trend che lo hanno ridotto senza che le connessioni tra economie diminuissero affatto.

Mi sembra rilevante per il tuo lavoro perché lo Scope 3 vive esattamente in quella zona grigia: se il flusso di merci si accorcia mentre quello di servizi e dati si allunga, il perimetro da decarbonizzare cambia forma senza che il totale cali.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Gianluca', last='Bufo',
      role='Amministratore Delegato e Direttore Generale',
      company='Gruppo Iren', city='Reggio Emilia',
      li='https://it.linkedin.com/in/gianluca-bufo-60489059',
      emails=['gianluca.bufo@gruppoiren.it', 'g.bufo@gruppoiren.it', 'gianluca.bufo@ireti.it'],
      site='https://www.gruppoiren.it/',
      theme='multiutility: acqua, rifiuti, energia e servizi urbani',
      src='https://www.gruppoiren.it/it/chi-siamo/management.html',
      ff='ff.34.1',
      msg="""Ciao Gianluca,

sei Amministratore Delegato e Direttore Generale del Gruppo Iren, quindi gestisci acqua, rifiuti, calore ed elettricità per territori molto diversi tra loro. Una multiutility è una delle poche imprese il cui piano industriale dipende direttamente da come si distribuiranno le persone sul territorio nei prossimi vent'anni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che su quella distribuzione dice qualcosa di controintuitivo:

{FF} — usando la definizione statistica corrente, cioè agglomerati di 2.000-10.000 persone, risulta urbanizzato il 70% degli italiani, l'80% degli statunitensi e il 55% della popolazione mondiale. Se però alziamo l'asticella a un milione di abitanti, la percentuale di "cittadini veri" resta sorprendentemente stabile nel tempo, tranne che in Cina: in Europa sotto il 20%, negli Stati Uniti tra il 40 e il 60%.

Il punto è che la crescita urbana italiana avviene quasi tutta in centri medi e piccoli. Che è poi esattamente il tipo di territorio dove una rete idrica o un impianto di trattamento hanno la geometria economica più difficile.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),
]

assert len(LEADS) == 20, len(LEADS)

# ---- render messages with exact ff title + link from data.js index ----
for L in LEADS:
    code = L['ff']
    assert code in IDX, 'ff code not in data.js: ' + code
    L['ff_title'] = IDX[code]['title']
    L['ff_link'] = IDX[code]['link']
    L['msg'] = L['msg'].replace('{FF}', L['ff_title']).replace('{LINK}', L['ff_link'])
    L['words'] = len(L['msg'].split())
    L['subject'] = 'Spunto %s per %s' % (code, L['first'])
    L['excerpt'] = re.sub(r'\s+', ' ', IDX[code]['content'])[:300]

codes = [L['ff'] for L in LEADS]
assert len(set(codes)) == 20, 'duplicate ff codes: %s' % codes

# ---- CSV ----
csv_path = os.path.join(OUT, 'batch%d_%s.csv' % (BATCH, DATE))
COLS = ['first_name','last_name','role','company','city_or_region','linkedin_url','email_public',
        'email_best','guessed_emails','website','focus_theme','why_match','source_urls',
        'excerpt_text','excerpt_id','template_id','template_subject','priority','status','owner','next_action']
with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(COLS)
    for i, L in enumerate(LEADS):
        w.writerow([
            L['first'], L['last'], L['role'], L['company'], L['city'], L['li'], '',
            L['emails'][0], '|'.join(L['emails']), L['site'], L['theme'],
            'Spunto %s (%s) collegato a %s' % (L['ff'], L['ff_title'], L['theme']),
            '%s|%s' % (L['src'], L['li']),
            L['excerpt'], L['ff'], 'ff-outreach-v3', L['subject'],
            'P1' if i < 10 else 'P2', 'queued', 'micmer.clawdbot', 'create_gmail_draft_manual',
        ])
print('CSV  ->', csv_path)

# ---- MD ----
md_path = os.path.join(OUT, 'batch%d_%s.md' % (BATCH, DATE))
with open(md_path, 'w', encoding='utf-8') as f:
    f.write('# FF outreach — batch %d (%s)\n\n' % (BATCH, DATE))
    f.write('20 lead nuovi, settori: energia/utility, consulenza & big-4, tecnologia industriale, '
            'economia circolare, trasformazione digitale.\n')
    f.write('Stato: **drafted** — nessun invio. Invio subordinato a GO esplicito di Michele.\n\n---\n\n')
    for i, L in enumerate(LEADS):
        f.write('## %d. %s %s — %s\n\n' % (START_ID + i, L['first'], L['last'], L['company']))
        f.write('- **Ruolo:** %s\n' % L['role'])
        f.write('- **Sede:** %s\n' % L['city'])
        f.write('- **LinkedIn:** %s\n' % L['li'])
        f.write('- **Email (guess):** %s\n' % ', '.join(L['emails']))
        f.write('- **Fonte verifica:** %s\n' % L['src'])
        f.write('- **Spunto FF:** %s — %s\n' % (L['ff'], L['ff_link']))
        f.write('- **Oggetto:** %s\n' % L['subject'])
        f.write('- **Parole:** %d\n\n' % L['words'])
        f.write('```\n%s\n```\n\n---\n\n' % L['msg'])
print('MD   ->', md_path)

# ---- TRACKER MERGE ----
backup = os.path.join(os.path.dirname(TRACKER), 'ff_outreach_tracker.backup_b%d.json' % BATCH)
shutil.copy2(TRACKER, backup)
print('BACKUP ->', backup)

T = json.load(open(TRACKER, encoding='utf-8'))
before_contacts = len(T['contacts'])
before_drafted = T['meta']['total_drafted']
before_top = T.get('total_drafted')
existing_ids = {c['id'] for c in T['contacts']}
assert not (existing_ids & set(range(START_ID, START_ID + 20))), 'id collision'

for i, L in enumerate(LEADS):
    T['contacts'].append({
        'id': START_ID + i,
        'name': '%s %s' % (L['first'], L['last']),
        'role': L['role'],
        'org': L['company'],
        'channel': 'email',
        'ff_post': L['ff'],
        'ff_post_title': L['ff_title'],
        'ff_post_url': L['ff_link'],
        'subject': L['subject'],
        'message': L['msg'],
        'emails_guessed': L['emails'],
        'words': L['words'],
        'status': 'drafted',
        'date': DATE,
        'batch': BATCH,
        'send_authorized': False,
    })

T['meta']['last_batch'] = BATCH
T['meta']['last_batch_date'] = DATE
T['meta']['updated'] = DATE
T['meta']['total_drafted'] = before_drafted + 20
T['total_drafted'] = (before_top or 0) + 20
json.dump(T, open(TRACKER, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('TRACKER written. contacts %d -> %d | meta.total_drafted %d -> %d | total_drafted %s -> %s'
      % (before_contacts, len(T['contacts']), before_drafted, T['meta']['total_drafted'],
         before_top, T['total_drafted']))
print('WORDS:', [L['words'] for L in LEADS])
