# -*- coding: utf-8 -*-
"""FF outreach batch 95 — 2026-08-09. Builds CSV + MD and merges the tracker."""
import json, csv, io, os, sys, shutil, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
IDXF = os.path.join(OUT, '_ffidx_b95.json')
DATE = '2026-08-09'
BATCH = 95
START_ID = 1633

IDX = json.load(open(IDXF, encoding='utf-8'))

LEADS = [
 dict(
  first='Vahe', last='Ter Nikogosyan',
  role='Direttore Digital & Innovation', company='A2A', city='Milano',
  linkedin='https://www.linkedin.com/in/vahe-ter-nikogosyan-9887ab7/',
  emails=['vahe.ternikogosyan@a2a.eu', 'vahe.ter.nikogosyan@a2a.eu', 'v.ternikogosyan@a2a.eu'],
  website='https://www.gruppoa2a.it',
  theme='domanda elettrica generata dal calcolo AI e pianificazione della generazione in una multiutility',
  sources=['https://www.gruppoa2a.it/en/about-us/our-management',
           'https://www.linkedin.com/in/vahe-ter-nikogosyan-9887ab7/'],
  ff='ff.135.2',
  msg="""Ciao Vahe,

guidi Digital & Innovation in A2A dopo essere passato da CIO EMEA di CNH Industrial e Chief Digital Officer di Sidel. Poche persone in Italia hanno visto la trasformazione digitale prima dal lato di chi la compra e poi dal lato di chi deve anche generare l'elettricità che la alimenta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su quel punto di contatto:

🌊 ff.135.2 Onda (anomala) energetica — Musk punta a comprare 50 milioni di H100 in cinque anni, circa 35 GW assorbiti, il 2% del consumo elettrico globale di oggi. Altman la mette come scelta esplicita: con 10 GW di calcolo l'AI può curare il cancro oppure fare da tutor privato a tutti gli studenti del mondo, non entrambe le cose. La sua risposta è costruire una centrale capace di generare 1 GW di calcolo a settimana. Sul fronte opposto il solare è passato da zero a 2073 TWh in dieci anni, con 500 miliardi di dollari investiti, più di quanto si spese per l'aviazione durante la seconda guerra mondiale.

Per chi pianifica generazione e reti, quella domanda diventa un carico da contrattualizzare.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Francesco', last='Gerli',
  role='Responsabile Business Unit Smart Infrastructures; Presidente e AD di Unareti', company='A2A', city='Milano/Brescia',
  linkedin='https://it.linkedin.com/in/francesco-gerli',
  emails=['francesco.gerli@a2a.eu', 'f.gerli@a2a.eu', 'francesco.gerli@unareti.it'],
  website='https://www.gruppoa2a.it',
  theme='elettrificazione dei trasporti e dipendenza del beneficio ambientale dal mix di generazione',
  sources=['https://www.gruppoa2a.it/en/about-us/our-management/francesco-gerli',
           'https://it.linkedin.com/in/francesco-gerli'],
  ff='ff.32.5',
  msg="""Ciao Francesco,

guidi la Business Unit Smart Infrastructures di A2A e presiedi Unareti, che distribuisce elettricità a Milano, Rozzano e nel Bresciano. Dal novembre 2024 siedi anche nel board di E.DSO. Sei quindi in uno dei pochi posti da cui si vedono insieme il carico che arriva sulla rete e la regolazione europea che lo governa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quanto il mix di generazione cambi il senso dell'elettrificazione:

🚗 ff.32.5 Le auto elettriche: ecologiche o no? — la Norvegia produce il 95% dell'elettricità con l'idroelettrico, la Francia il 75% con il nucleare, mentre in Cina, India e Polonia l'auto elettrica resta di fatto un'auto a carbone. A parità di energia prodotta l'Italia inquina dieci volte la Norvegia, e rispetto a un elettrico norvegese un veicolo tradizionale emette 40 volte più CO2. Aggiungo il rovescio della medaglia: produrre un'auto elettrica genera materiali tossici pari a tre volte quelli di una tradizionale, per via dei metalli pesanti.

Il beneficio ambientale dell'elettrificazione si decide a monte della presa.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Ludovico', last='Diaz',
  role='Chief Executive Officer', company='NTT DATA Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/ludovico-diaz/',
  emails=['ludovico.diaz@nttdata.com', 'l.diaz@nttdata.com', 'ludovico.diaz@ntt.com'],
  website='https://it.nttdata.com',
  theme='distanza tra cultura umanistica e scientifica e ruolo dell AI come ponte, in una società di consulenza tecnologica',
  sources=['https://www.corrierecomunicazioni.it/digital-economy/ntt-data-italia-vara-la-nuova-organizzazione-ecco-i-nuovi-manager/',
           'https://www.linkedin.com/in/ludovico-diaz/'],
  ff='ff.127.1',
  msg="""Ciao Ludovico,

hai aperto l'anno fiscale di NTT DATA Italia con una nuova architettura organizzativa e cinque aree di responsabilità, e nelle interviste torni spesso sul valore sociale e culturale accanto a quello economico. Su quel punto ho scritto qualcosa che forse ti interessa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio lo spunto:

🛣️ ff.127.1 La terza vIA? — parto da C. P. Snow e dalle sue due culture del 1959. Snow raccontava di aver chiesto a una sala di letterati chi sapesse descrivere il Secondo Principio della Termodinamica, senza ottenere risposta, pur avendo chiesto l'equivalente scientifico di "hai letto un'opera di Shakespeare?". Da allora la specializzazione ha allargato la distanza. La domanda che mi porto dietro dalla maturità, quando scrissi una tesina sulla sinteticità che va da Soldati di Ungaretti all'equazione di Eulero, è se l'intelligenza artificiale possa abbattere quel muro di Berlino tra le due culture.

Per un'azienda che vende competenze specialistiche, la risposta ha conseguenze molto pratiche sul profilo di chi si assume.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Roberto', last='Del Corno',
  role='Head of Technology Solutions (SVP, General Manager Italy)', company='NTT DATA Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/roberto-del-corno-a083ba1/',
  emails=['roberto.delcorno@nttdata.com', 'roberto.del.corno@nttdata.com', 'r.delcorno@nttdata.com'],
  website='https://it.nttdata.com',
  theme='stagnazione tecnologica percepita a fronte di infrastrutture e managed services sempre più potenti',
  sources=['https://www.corrierecomunicazioni.it/digital-economy/ntt-data-italia-vara-la-nuova-organizzazione-ecco-i-nuovi-manager/',
           'https://www.linkedin.com/in/roberto-del-corno-a083ba1/'],
  ff='ff.50.3',
  msg="""Ciao Roberto,

guidi Technology Solutions in NTT DATA Italia dopo anni sui managed services e sulle piattaforme di rete di nuova generazione. Chi vende infrastruttura convive con un paradosso: la capacità di calcolo cresce, la sensazione di progresso molto meno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel paradosso:

💻 ff.50.3 La stagnazione tecnologica — lo strano caso del dottor Eroom contro mister Moore: il costo di sviluppo di un farmaco raddoppia di anno in anno, per il monopolio delle big pharma o per la regolamentazione chiesta da una società spaventata dalla tecnologia. Siamo saliti sulla Luna nel 1969 e torniamo a sognarla solo ora che Musk ha reso riutilizzabili i razzi. Vaclav Smil in Growth raccoglie curve logistiche sature per moltissimi sistemi meccanici inventati a inizio Novecento. La sintesi di Peter Thiel resta la più citata: ci erano state promesse le macchine volanti, oggi abbiamo invece 140 caratteri. Nel 1960 tecnologia significava viaggi, oggi coincide con information technology.

Utile da tenere a mente quando si vende trasformazione.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Danilo', last='Lissoni',
  role='Head of Alliances (già Head of Marketing & Communication)', company='NTT DATA Italia', city='Milano',
  linkedin='https://it.linkedin.com/in/danilolissoni',
  emails=['danilo.lissoni@nttdata.com', 'd.lissoni@nttdata.com', 'danilo.lissoni@ntt.com'],
  website='https://it.nttdata.com',
  theme='economia dell attenzione come materia prima comune a marketing, alleanze e modelli generativi',
  sources=['https://it.nttdata.com/news-and-events/2024/nomina_danilo_lissoni',
           'https://it.linkedin.com/in/danilolissoni'],
  ff='ff.83.2',
  msg="""Ciao Danilo,

vieni da vent'anni tra Microsoft, dove hai guidato la strategia su dati e AI per l'Europa occidentale, e VMware, e in NTT DATA Italia sei passato dal marketing alle alleanze. In entrambi i ruoli la materia prima resta la stessa: l'attenzione di qualcuno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quella materia prima:

⚠️ ff.83.2 Stai attento! — Alexandra Horowitz definisce l'attenzione un discriminante intenzionale e impenitente, un continuo chiedersi cosa sia importante in questo preciso momento per registrare solo quello. La coincidenza che mi diverte: proprio l'attenzione è uno dei pochi caratteri comuni tra mente umana e AI generativa, visto che ChatGPT è un transformer, architettura proposta nel paper Attention is all you need.

Chi costruisce un ecosistema di partner lavora sullo stesso meccanismo di selezione: decidere cosa vale la pena registrare e cosa lasciar passare. Vale per un cliente davanti a una campagna e per un modello davanti a un contesto.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Luis', last='Ferrucci',
  role='Head of Business Operations', company='NTT DATA Italia', city='Milano',
  linkedin='https://it.linkedin.com/in/luis-ferrucci-054883',
  emails=['luis.ferrucci@nttdata.com', 'l.ferrucci@nttdata.com', 'luis.ferrucci@ntt.com'],
  website='https://it.nttdata.com',
  theme='automazione che entra dove la domanda supera stabilmente l offerta di lavoro umano',
  sources=['https://www.ictbusiness.it/news/ntt-data-si-riorganizza-e-presenta-la-nuova-squadra-di-manager.aspx',
           'https://it.linkedin.com/in/luis-ferrucci-054883'],
  ff='ff.97.4',
  msg="""Ciao Luis,

sei passato da digital services & solutions a Business Operations in NTT DATA Italia, e racconti spesso di produttività ottenuta con strumenti di automazione e di modelli produttivi estesi via nearshore. La domanda che resta aperta è dove l'automazione arrivi davvero prima.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che risponde da un settore inaspettato:

🌐 ff.97.4 Economia e robot del massaggio — carestia di contatto, epidemia di stress, isolamento sociale e invecchiamento della popolazione fanno pensare che i massaggiatori avranno un futuro fortissimo. Delle dieci persone intervistate dall'ATMA, sei hanno ricevuto un massaggio nel 2023 con una media di tre all'anno e nove pensano che il massaggio vada innalzato a terapia clinica. Il collo di bottiglia sono le persone, come per infermieri e cure geriatriche. Da qui Aescape, il robot massaggiatore.

Lo stesso pattern vale nei servizi IT: l'automazione arriva prima dove la domanda supera stabilmente l'offerta di mani, e molto dopo dove il vincolo è di altro tipo.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Raffaele', last='Zinno',
  role='Partner, Head of Advisory', company='KPMG Italia', city='Milano',
  linkedin='https://it.linkedin.com/in/raffaele-zinno-98a72b107',
  emails=['rzinno@kpmg.it', 'raffaele.zinno@kpmg.it', 'rzinno@kpmg.com'],
  website='https://kpmg.com/it',
  theme='percorsi di carriera nelle strutture professionali e gradiente inverso tra seniority e motivazione',
  sources=['https://kpmg.com/it/it/about/leadership.html',
           'https://it.linkedin.com/in/raffaele-zinno-98a72b107'],
  ff='ff.62.2',
  msg="""Ciao Raffaele,

coordini circa 2.500 professionisti dell'Advisory di KPMG in Italia, sei entrato in KPMG nel 2001 e partner dal 2011. Vedi quindi da vicino centinaia di carriere che seguono lo stesso schema, e qualcuna che lo rompe.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su chi lo rompe:

🥾 ff.62.2 Uscire dalla via maestra — in The Pathless Path, Paul Millerd chiama Default Path la sequenza studia, prendi bei voti, ottieni un buon lavoro, poi testa bassa e avanti chiedendo sempre di più. Lui ne era l'esempio perfetto, tra GE, McKinsey, Florida e New York, e scrive che ogni mattina la motivazione di andare al lavoro diminuiva con andamento inverso rispetto alla crescita di carriera e di stipendio. A 32 anni ha mollato tutto per lavori freelance occasionali e si è trasferito a Taiwan.

Per chi gestisce una struttura professionale quel gradiente inverso è un dato di retention prima che una storia personale.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Floriano', last='Masoero',
  role='Presidente e Amministratore Delegato; Head of Digital Industries', company='Siemens Italia', city='Milano',
  linkedin='https://it.linkedin.com/in/florianomasoero',
  emails=['floriano.masoero@siemens.com', 'f.masoero@siemens.com', 'floriano.masoero@siemens.it'],
  website='https://www.siemens.com/it',
  theme='robotica umanoide, costi e scelte di design nell automazione industriale',
  sources=['https://press.siemens.com/it/it/comunicatostampa/floriano-masoero-ceo-di-siemens-italia-assume-la-responsabilita-anche-del-business',
           'https://it.linkedin.com/in/florianomasoero'],
  ff='ff.37.2',
  msg="""Ciao Floriano,

sei presidente e amministratore delegato di Siemens in Italia e dal 2024 guidi anche il business industriale come Digital Industries Head, oltre a sedere nel Board of Advisors della Fondazione Politecnico di Milano. L'automazione umanoide è il punto in cui quei due cappelli si incontrano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel punto:

🤖 ff.37.2 Tesla AI Day — Optimus pesa 73 kg, monta 2,3 kWh di batteria, all'incirca l'energia di 2000 kcal, con attuatori che mimano dita, ginocchia e spalle e un costo dichiarato di 20.000 dollari, contro i circa 150.000 stimati da Christian Hubicki per gli umanoidi. La scelta di Musk è dare istruzioni generali e lasciare i dettagli del movimento all'AI, all'opposto dell'approccio di Boston Dynamics. Il mio dubbio resta doppio: replicare ogni giunzione costa in sviluppo e in energia, e un robot troppo simile a noi rischia di spaventare la popolazione, rallentandone la diffusione.

Nell'automazione industriale la forma antropomorfa resta una scelta di prodotto da discutere caso per caso.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Francesca', last='Pezzoli',
  role='Executive Director Investor Relations & Sustainability', company='Snam', city='Milano',
  linkedin='https://www.linkedin.com/in/francesca-pezzoli-1584485/',
  emails=['francesca.pezzoli@snam.it', 'f.pezzoli@snam.it', 'francesca.pezzoli@snam.com'],
  website='https://www.snam.it',
  theme='gas in eccesso, flaring e confronto quantitativo tra impatti energetici nella comunicazione ESG',
  sources=['https://www.linkedin.com/in/francesca-pezzoli-1584485/',
           'https://www.snam.it/it/sostenibilita/il-nostro-impegno/strategia/sustainability-profile.html'],
  ff='ff.24.4',
  msg="""Ciao Francesca,

guidi Investor Relations & Sustainability in Snam, con oltre vent'anni nel settore energia, e ti trovi spesso a trasformare la rendicontazione di sostenibilità in comunicazione utile al mercato. Ti lascio un caso che mette insieme gas, emissioni e narrativa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente.

💦 ff.24.4 Minare con gas — Exxon Mobil ha annunciato di usare per minare bitcoin l'energia prodotta da gas estratto in eccesso, quello che non riesce a essere immesso nei canali di distribuzione e che viene comunque bruciato. Se finisse in atmosfera inquinerebbe più che nella forma bruciata. Nello stesso spunto confronto l'impatto del network Bitcoin, stimato con una potenza di calcolo 500.000 volte superiore a quella del più grande supercomputer al mondo, con quello dell'industria dell'oro, dei data center e del trasporto marittimo e aereo.

Un caso in cui il numero ribalta il verdetto rispetto al titolo, che è poi il lavoro che chiedi a chi legge i tuoi report.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Cristiano', last='Bertoldi',
  role='Head of Investor Relations Market', company='Terna', city='Roma',
  linkedin='https://www.linkedin.com/in/cristiano-bertoldi-64b58010a/',
  emails=['cristiano.bertoldi@terna.it', 'c.bertoldi@terna.it', 'cristiano.bertoldi@ternaenergysolutions.it'],
  website='https://www.terna.it',
  theme='narrativa verde e verifica quantitativa nel dialogo con gli investitori di un operatore di rete',
  sources=['https://www.linkedin.com/in/cristiano-bertoldi-64b58010a/',
           'https://www.terna.it/en/investors/contacts-ir'],
  ff='ff.51.1',
  msg="""Ciao Cristiano,

segui gli investitori per Terna sul lato mercato, in un'azienda dove la storia da raccontare coincide con il piano di rete e con la transizione. Ti passo uno spunto che uso per rimettere in fila i numeri quando il racconto verde diventa automatico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente.

💚 ff.51.1 L'affabulazione per il verde — parto dalla scienza che dà ragione al verde: camminare nel bosco aiuta contro la depressione perché riduce la ruminazione mentale, e la medicina giapponese annovera lo shinrin-yoku, il bagno nel bosco. Poi cito Le otto montagne di Cognetti, dove Bruno risponde ai cittadini che "siete voi di città che la chiamate Natura, noi qui diciamo bosco, pascolo, torrente, roccia, cose che uno può indicare con il dito". Da lì provo una riflessione fuori dal coro sul clima, fatta di numeri e percentuali invece che di bianco e nero.

È lo stesso esercizio che chiede un investitore quando smette di comprare la narrativa e apre il modello.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Giorgia', last='Russo',
  role='Chief Information Officer', company="L'Oréal Italia", city='Milano',
  linkedin='https://www.linkedin.com/in/giorgia-russo-9a1a076/',
  emails=['giorgia.russo@loreal.com', 'grusso@loreal.com', 'giorgia.russo@it.loreal.com'],
  website='https://www.loreal.com/it-it/italy/',
  theme='spostamento del mercato dalla bellezza al benessere e conseguenze sui dati di un gruppo beauty',
  sources=['https://www.fortuneita.com/2025/09/25/loreal-italia-giorgia-russo-e-la-nuova-cio-del-gruppo/',
           'https://www.linkedin.com/in/giorgia-russo-9a1a076/'],
  ff='ff.35.1',
  msg="""Ciao Giorgia,

guidi la tecnologia di L'Oréal Italia dopo dieci anni nel gruppo, tra il centro servizi contabili condiviso di Madrid, l'integrazione di Azzaro & Mugler e Prada e il back office online e offline per l'Europa. Il mercato che servi si sta spostando dalla bellezza al benessere, e questo cambia anche i dati che devi tenere insieme.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel mercato:

📈 ff.35.1 Le proiezioni del mercato del well-being — negli Stati Uniti il 20% del GDP finisce in spese mediche e la Cina ha superato lo statunitense medio come aspettativa di vita. Un report McKinsey stima il mercato del wellness intorno a 1.500 miliardi di dollari, con la salute al primo posto e poi cura del corpo e del vestiario, fitness, dieta e sonno. Il COVID ha sensibilizzato sul tema soprattutto nei paesi in via di sviluppo.

Per chi disegna i sistemi di un gruppo beauty quella gerarchia di categorie è anche una gerarchia di dati da unificare.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Riccardo', last='Renna',
  role='Chief Operating Officer & Innovation', company='Banca Generali', city='Milano',
  linkedin='https://it.linkedin.com/in/riccardo-renna-5931125',
  emails=['riccardo.renna@bancagenerali.it', 'r.renna@bancagenerali.it', 'riccardo.renna@generali.com'],
  website='https://www.bancagenerali.com',
  theme='rendere visibile il compound patrimoniale e comportamentale nella consulenza finanziaria',
  sources=['https://www.bancagenerali.com/en/governance/management/riccardo-renna',
           'https://it.linkedin.com/in/riccardo-renna-5931125'],
  ff='ff.137.4',
  msg="""Ciao Riccardo,

sei COO & Innovation di Banca Generali dal 2016 e parli spesso di AI che porta più personalizzazione nella consulenza. L'accumulo nel tempo è il cuore del vostro mestiere, quindi ti lascio uno spunto che lo prende da un'angolazione insolita.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente.

📈 ff.137.4 Filosofia dell'accumulo — uso i cristalli come contro-immagine della fluidità moderna: a livello chimico-fisico sono esempio di stabilità al caos entropico, e diventano preziosi crescendo poco per volta o restando stabili nel tempo. Accumulano storia esattamente come il compound, tangibilissimo in finanza nel conto in banca di Warren Buffett. La stessa logica vale fuori dalla finanza: anni di buone abitudini, sport e dieta, vanno percepiti come crescita continua. Per ricordarmelo ho costruito League of Strava, una dashboard che trasforma kcal e anni di sport in qualcosa di tangibile.

Rendere visibile il compound resta un problema di interfaccia prima ancora che di prodotto, e vale identico su un portafoglio.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Emanuele', last='Brunelli',
  role='Chief Digital Innovation Officer', company='BonelliErede', city='Milano',
  linkedin='https://it.linkedin.com/in/ebrunelli',
  emails=['emanuele.brunelli@belex.com', 'e.brunelli@belex.com', 'emanuele.brunelli@bonellierede.com'],
  website='https://www.belex.com',
  theme='esposizione delle professioni legali all AI e ridisegno della formazione degli associati',
  sources=['https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
           'https://it.linkedin.com/in/ebrunelli'],
  ff='ff.115.2',
  msg="""Ciao Emanuele,

sei Chief Digital Innovation Officer di BonelliErede e Forbes Italia ti ha inserito tra i cinquanta chief innovation officer del 2026. Portare innovazione dentro uno studio legale significa lavorare su una professione che l'AI tocca in pieno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su questo:

❔ ff.115.2 Cosa studiare con ChatGPT? — parto da Chris Sacca, che segue i trend tecnologici parlando per ore con ChatGPT dopo avergli chiesto di impersonare Buckminster Fuller. Poi noto una coincidenza: i protagonisti di Better Call Saul e Mr. Robot sono un avvocato e un programmatore, le due professioni che fino a poco fa ogni genitore sano di mente avrebbe suggerito ai figli, e che oggi risultano insieme tra le più pagate e tra le più a rischio. Programmare il gioco Snake richiedeva anni di studio; oggi Deepseek lo scrive senza bug con sei parole.

La domanda pratica che ne esce riguarda cosa insegnare agli associati che entrano adesso.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Giuliano', last='Pozza',
  role='Chief Information Officer', company='Università Cattolica del Sacro Cuore', city='Milano',
  linkedin='https://it.linkedin.com/in/gpozza',
  emails=['giuliano.pozza@unicatt.it', 'g.pozza@unicatt.it', 'giuliano.pozza@policlinicogemelli.it'],
  website='https://www.unicatt.it',
  theme='obsolescenza dei curriculum e parti dell esperienza formativa da digitalizzare o proteggere',
  sources=['https://eunis.org/giuliano-pozza-bio/',
           'https://it.linkedin.com/in/gpozza'],
  ff='ff.78.1',
  msg="""Ciao Giuliano,

sei CIO dell'Università Cattolica dopo San Raffaele, Fondazione Don Gnocchi e Humanitas, e sei stato presidente di AISIS. Poche persone hanno visto la digitalizzazione da dentro sia la sanità sia l'università.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul lato formativo:

👨‍🏫 ff.78.1 Scuola di vita? — sostengo che i curriculum scolastici siano sempre più passato: anni a memorizzare nomi, date e poesie che oggi recuperiamo con Google e AI, mentre gli studenti peggiorano in matematica e lettura e l'AI migliora. Non me ne preoccupo troppo, in fondo nessuno oggi si lamenta di non svolgere con carta e penna la moltiplicazione 4875 x 29. Mi pesa di più che in tredici anni di banchi educazione emotiva e wellbeing restino assenti o trattati in modo superficiale, tanto che a colmare il vuoto arrivano psicologi digitali e contenuti Netflix.

In un ateneo la domanda diventa quale parte dell'esperienza formativa vada digitalizzata e quale vada protetta.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Marco', last='Bernacchi',
  role='Chief Information Officer', company='Fabrick', city='Roma',
  linkedin='https://www.linkedin.com/in/mbernacchi/',
  emails=['marco.bernacchi@fabrick.com', 'm.bernacchi@fabrick.com', 'marco.bernacchi@sella.it'],
  website='https://www.fabrick.com',
  theme='provenienza e unicità del dato digitale come problema infrastrutturale dell open finance',
  sources=['https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
           'https://www.linkedin.com/in/mbernacchi/'],
  ff='ff.85.4',
  msg="""Ciao Marco,

sei CIO di Fabrick, dove l'open finance vive di API e di scambi tra soggetti che devono fidarsi di dati altrui. La provenienza di un dato digitale diventa quindi un problema quotidiano e non teorico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su quel problema:

🍝 ff.85.4 Carbonara e criptovalute — l'idea di fondo è che saremo sempre più nauseati da contenuti digitali, e che per digerire questo guanciale generativo fatto di testi, immagini e oggetti serva validarne la storia, la singolarità nello spazio-tempo digitale. Da qui la Bitcoin Inscription, lanciata nel 2023, che lega ogni satoshi, il centesimo di Bitcoin, a dati digitali in modo univoco e inequivocabile.

Le infrastrutture di pagamento hanno risolto il problema per il denaro. Estendere la stessa garanzia ai documenti e alle identità che viaggiano sulle API è il pezzo ancora aperto, e riguarda direttamente chi costruisce piattaforme come la vostra.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Luigi', last='Pontillo',
  role='Chief Information Officer / ICT Director', company='Unieuro', city='Forlì',
  linkedin='https://it.linkedin.com/in/luigi-pontillo-82537a28',
  emails=['luigi.pontillo@unieuro.com', 'l.pontillo@unieuro.com', 'luigi.pontillo@unieurospa.com'],
  website='https://www.unieuro.it',
  theme='ingaggio digitale nel retail e limiti dei collezionabili non scambiabili',
  sources=['https://unieurospa.com/app/uploads/2025/04/Luigi_Pontillo_ENG.pdf',
           'https://it.linkedin.com/in/luigi-pontillo-82537a28'],
  ff='ff.15.2',
  msg="""Ciao Luigi,

sei ICT Director e CIO di Unieuro dal 2019, con un passato in EY su ecommerce per il retail e integrazioni SAP per le multiutility. Il tuo tema ricorrente è l'omnicanalità, quindi ti lascio uno spunto su cosa il digitale aggiunge davvero a un punto vendita.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente.

🛍️ ff.15.2 Non solo borse e scarpe — Louis Vuitton ha lanciato un gioco per cellulare per i suoi 200 anni: nei panni di una Zelda griffata si raccolgono candele, con 30 NFT collezionabili e non scambiabili nascosti nel gioco, quindi di dubbia utilità, e 200 box digitali interpretati da altrettanti artisti. Nel frattempo Nike e Adidas si attrezzavano per entrare a gamba tesa nel mondo digitale.

A distanza di anni la parte che ha retto è la meccanica di gioco applicata al retail, mentre i collezionabili non scambiabili hanno mostrato il limite. Per chi vende elettronica di consumo la lezione utile resta quella: l'ingaggio digitale funziona quando aggiunge qualcosa che il negozio non può dare.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Gianluca', last='Martinuz',
  role='Chief Information Officer', company='FinecoBank', city='Milano',
  linkedin='https://it.linkedin.com/in/martinuz',
  emails=['gianluca.martinuz@finecobank.com', 'g.martinuz@finecobank.com', 'gianluca.martinuz@fineco.it'],
  website='https://finecobank.com',
  theme='divario tra evoluzione tecnologica e regolamentazione, dalla sicurezza dei dati alla privacy mentale',
  sources=['https://www.theinnovationgroup.it/speakers/gianluca-martinuz/?lang=it',
           'https://it.linkedin.com/in/martinuz'],
  ff='ff.75.4',
  msg="""Ciao Gianluca,

sei CIO di FinecoBank e a quel ruolo sei arrivato passando da Information Security e Fraud Management. La distanza tra ciò che la tecnologia può fare e ciò che la norma riesce a governare è quindi terreno tuo da anni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che porta quella distanza al limite:

👮 ff.75.4 Polizia mentale — Azeem Azhar in Exponential descrive la voragine che si apre tra regolamentazione e tecnologia, alimentata insieme da AI, social, robotica e clima. Nel confronto con Nita Farahany, professoressa alla Duke University, il tema diventa concreto: raccolta di dati cerebrali con un miliardo di dollari di investimenti, possibilità di monitorare e modificare i pensieri, con il rimando quasi obbligato allo psicoreato di 1984, e la necessità di aprire una discussione sulla privacy mentale.

Chi difende dati finanziari conosce già la dinamica: la superficie di attacco si sposta prima che la norma la sappia nominare.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Luca', last='Montagnini',
  role='Chief Information Officer', company='Gruppo BCC Iccrea', city='Roma',
  linkedin='https://www.linkedin.com/in/luca-montagnini-106ba28/',
  emails=['luca.montagnini@iccrea.bcc.it', 'l.montagnini@iccrea.bcc.it', 'luca.montagnini@iccreabanca.it'],
  website='https://www.gruppobcciccrea.it',
  theme='dipendenza dalle piattaforme e vantaggio di un infrastruttura posseduta da chi la usa',
  sources=['https://creditocooperativo.it/news/gruppo-bcc-iccrea-luca-montagnini-e-il-nuovo-chief-information-officer',
           'https://www.linkedin.com/in/luca-montagnini-106ba28/'],
  ff='ff.95.2',
  msg="""Ciao Luca,

dal 2025 sei CIO del Gruppo BCC Iccrea, dopo Crédit Agricole Italia, Veneto Banca e Accenture. Reggere una piattaforma condivisa da una rete di banche locali autonome significa decidere ogni giorno quanto centralizzare e quanto lasciare ai margini.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su cosa costa dipendere da una piattaforma altrui:

🦆 ff.95.2 FarmVille e feudalesimo — nel 2011 Facebook ha di fatto bloccato la crescita di Zynga, la casa produttrice di FarmVille, che oggi lavora a Sugartown, una FarmVille su server decentralizzati. Lo stesso schema si è riproposto con Fortnite: Epic ha aperto un contenzioso contro Apple, che trattiene il 30% degli acquisti fatti nel gioco.

La dipendenza da una piattaforma si paga quando il proprietario cambia le regole. È il motivo per cui un gruppo cooperativo che condivide infrastruttura tra molte banche ha un vantaggio raccontato poco: la piattaforma appartiene a chi la usa.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Maria Giuseppina', last='Cerè',
  role='Chief Information Officer & Head of TDI Italy', company='Deutsche Bank Italia', city='Milano',
  linkedin='https://www.linkedin.com/in/maria-giuseppina-cere-084883104/',
  emails=['maria-giuseppina.cere@db.com', 'mariagiuseppina.cere@db.com', 'm.cere@db.com'],
  website='https://country.db.com/italia/',
  theme='misurare l integrazione globale con la metrica giusta, tra flussi fisici e connessioni digitali',
  sources=['https://country.db.com/news/detail/20210601-deutsche-bank-italia-maria-giuseppina-cere-nuova-chief-information-officer?language_id=3',
           'https://www.linkedin.com/in/maria-giuseppina-cere-084883104/'],
  ff='ff.21.2',
  msg="""Ciao Maria Giuseppina,

sei CIO di Deutsche Bank Italia e Head of TDI Italy, con il compito di far vivere il team italiano dentro una struttura globale integrata. Il pendolo tra integrazione globale e presidio locale è di fatto il tuo mestiere quotidiano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su come quel pendolo viene misurato male:

🚢 ff.21.2 La fine di un'era? — la percentuale di PIL globale legata al commercio ha toccato il picco nel 2008, ha smesso di crescere per dieci anni ed è tornata ai valori del 2000 nel 2020. Nello spunto però metto in dubbio proprio quell'indicatore: altri trend hanno ridotto il commercio fisico senza che le connessioni diminuissero affatto.

Vale anche per l'IT di un gruppo bancario. I flussi visibili si spostano su un piano diverso, e misurare l'integrazione con la metrica sbagliata porta dritti a conclusioni sbagliate su dove servano davvero le persone.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(
  first='Francesco', last='Amendola',
  role='Chief Information Officer', company='Luiss Guido Carli', city='Roma',
  linkedin='https://www.linkedin.com/in/amendola/',
  emails=['famendola@luiss.it', 'francesco.amendola@luiss.it', 'f.amendola@luiss.it'],
  website='https://www.luiss.it',
  theme='burocrazia come schematizzazione del mondo e rischio dei modelli dati in un ateneo',
  sources=['https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
           'https://www.linkedin.com/in/amendola/'],
  ff='ff.106.3',
  msg="""Ciao Francesco,

sei CIO della Luiss dopo vent'anni di ICT tra ATAC, Novomatic Italia e Rome Business School. Un ateneo è anche una macchina burocratica, e proprio lì punta lo spunto che ti lascio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente.

🕊️ ff.106.3 Nexus e Harari — Claude di Anthropic prende il nome da Shannon, che ha inventato la teoria entropica dell'informazione, e da lì arrivo a Nexus di Harari. La tesi è che ChatGPT sia l'ultimo baluardo di un processo iniziato con la scrittura: tecnologie che schematizzano il mondo in tabelle e cassetti, un'abilità completamente non umana. Harari nota che la burocrazia risolve il reperimento delle informazioni dividendo il mondo in contenitori separati perché i documenti non si mescolino, e che così sacrifica la profondità della comprensione in nome dell'efficienza organizzativa, producendo una visione parziale e distorta.

Per chi progetta i sistemi informativi di un'università quella frase descrive con precisione il rischio di ogni modello dati.

Spunto completo: {url}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),
]

assert len(LEADS) == 20, len(LEADS)
assert len({l['ff'] for l in LEADS}) == 20, 'ff.x.y non distinti'

# ---- resolve corpus metadata + render messages -------------------------------
for l in LEADS:
    v = IDX[l['ff']]                      # KeyError if the code is not in data.js
    l['ff_title'] = v['title'].strip()
    l['ff_url'] = (v['link'] or v['post_url']).strip()
    l['excerpt_text'] = re.sub(r'\s+', ' ', v['content'])[:300].strip()
    l['message'] = l['msg'].replace('{url}', l['ff_url'])
    l['subject'] = 'Spunto %s per %s' % (l['ff'], l['first'])
    l['words'] = len(l['message'].split())
    assert l['ff'] in l['message'], l['ff']
    assert l['ff_url'] in l['message']

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
b95 = [c for c in V['contacts'] if c.get('batch') == BATCH]
print('backup            :', backup)
print('csv               :', csv_path)
print('md                :', md_path)
print('contacts before   :', before_contacts, '-> after:', len(V['contacts']))
print('meta.total_drafted:', before_meta_total, '->', V['meta']['total_drafted'])
print('top total_drafted :', before_top_total, '->', V['total_drafted'])
print('batch 95 records  :', len(b95))
print('duplicate ids     :', len(ids) - len(set(ids)))
print('id range          :', min(c['id'] for c in b95), '-', max(c['id'] for c in b95))
print('distinct ff.x.y   :', len({c['ff_post'] for c in b95}))
print('words min/max     :', min(c['words'] for c in b95), '/', max(c['words'] for c in b95))
print('companies         :', len({c['org'] for c in b95}))
bad = [c['id'] for c in b95 if c['status'] != 'drafted' or c['send_authorized'] is not False]
print('bad status/auth   :', bad)
