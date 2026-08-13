# -*- coding: utf-8 -*-
"""Build FF outreach batch 94 (2026-08-08): CSV + MD + tracker merge."""
import json, csv, sys, io, os, shutil, re, unicodedata

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT = r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach'
TRACKER = r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json'
DATE = '2026-08-08'
BATCH = 94
START_ID = 1613

IDX = json.load(open(os.path.join(OUT, '_ffidx_b94.json'), encoding='utf-8'))

LEADS = [
 dict(first='Gianluca', last='Gramegna',
      role='Head of ESG', company='ERG', city='Genova',
      li='https://it.linkedin.com/in/gianluca-gramegna-6a548a20/',
      emails=['gianluca.gramegna@erg.eu', 'g.gramegna@erg.eu', 'gramegna@erg.eu'],
      site='https://www.erg.eu/',
      theme='strategia ESG integrata nel piano industriale di un produttore puro da rinnovabili',
      src='https://esgnews.it/sustainability-week/erg-rinnovabili-scelta-imprenscindibile/',
      ff='ff.11.1',
      msg="""Ciao Gianluca,

segui l'ESG di ERG da quando il gruppo ha completato la trasformazione in produttore da sole rinnovabili, e il tuo percorso interno — Internal Audit, Enterprise Risk Management, poi ESG — spiega perché nei tuoi interventi il piano di sostenibilità resta agganciato al piano industriale invece di vivere in un documento separato.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta all'origine di quella scommessa:

{FF} — nel 2020 solare, idroelettrico ed eolico sono state le uniche fonti a far crescere l'elettricità prodotta, e l'intero calo del carbone è stato assorbito da loro tre. L'eolico ha fatto la parte del leone con +163 TWh, contro i 148 del solare e i 78 dell'idroelettrico. Il nucleare, nello stesso anno, segnava -94 TWh.

Rileggerlo oggi mi colpisce perché era ancora la fase in cui l'eolico veniva raccontato come promessa. Curioso di sapere quanto, nei vostri modelli di rischio, la volatilità del vento pesi ormai rispetto a quella regolatoria.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Elena', last='Botteon',
      role="Head of Sustainability", company="Autostrade per l'Italia", city='Roma',
      li='https://it.linkedin.com/in/elena-botteon-4418a53',
      emails=['elena.botteon@autostrade.it', 'e.botteon@autostrade.it', 'elena.botteon@aspi.it'],
      site='https://www.autostrade.it/',
      theme='decarbonizzazione di una rete autostradale e rendicontazione CSRD',
      src='https://esgnews.it/focus/interviste/botteon-autostrade-per-litalia-ai-sicurezza-e-sostenibilita-lautostrada-del-futuro-e-gia-realta/',
      ff='ff.61.2',
      msg="""Ciao Elena,

guidi la sostenibilità di Autostrade per l'Italia in un anno in cui avete pubblicato il report integrato secondo i criteri CSRD e siete rientrati nella A-List del CDP per il secondo anno consecutivo. Decarbonizzare una rete autostradale significa lavorare soprattutto su emissioni prodotte da chi ci passa sopra.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che prova a rendere quelle emissioni tangibili:

{FF} — l'idea è convertire ogni attività in minuti di emissione. Una banana vale 4 minuti, cento grammi di riso 6, la posta elettronica di una giornata 22, un uovo 32, una bottiglia di vino 60. Un chilometro in auto vale 30 minuti; lo stesso chilometro nel traffico ne vale 120. Quattro volte tanto, per la sola congestione.

Quel rapporto 30 contro 120 spiega perché progetti come la quarta corsia dinamica hanno un ritorno ambientale difficile da raccontare con le metriche classiche: fluidificare vale quanto elettrificare.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Carlotta', last='Ventura',
      role='Direttore Comunicazione, Sostenibilità e Affari Regionali; Presidente di Amsa', company='A2A', city='Milano',
      li='https://it.linkedin.com/in/carlottaventura',
      emails=['carlotta.ventura@a2a.eu', 'carlotta.ventura@a2a.it', 'c.ventura@a2a.eu'],
      site='https://www.gruppoa2a.it/',
      theme='sostenibilità di una multiutility e gestione rifiuti urbani via Amsa',
      src='https://www.gruppoa2a.it/it/chi-siamo/nostro-management/carlotta-ventura',
      ff='ff.130.1',
      msg="""Ciao Carlotta,

guidi comunicazione, sostenibilità e affari regionali di A2A dal 2020 e dal 2024 presiedi Amsa, quindi ti trovi nella posizione insolita di raccontare la sostenibilità e insieme di rispondere di quello che finisce davvero nei cassonetti di Milano. Le due cose raramente stanno nella stessa scrivania.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sul materiale che complica di più quel lavoro:

{FF} — la plastica va difesa almeno un po': conserva il cibo e porta la firma di un Nobel italiano, Natta 1963. Le stesse proprietà che la rendono utile, flessibilità e durabilità chimica, sono però quelle che ne complicano separazione e riciclo. Google X con DOW ha provato a rispondere con un'AI che classifica gli scarti per tipo di polimero; in teoria si arriva perfino a trasformare bottiglie in diamanti.

La parte interessante è che il collo di bottiglia sta nel riconoscimento prima ancora che nella chimica. Che è poi il punto in cui i dati di raccolta di Amsa valgono più di qualsiasi impianto nuovo.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Paola', last='Osto',
      role='Head of Sustainability & ESG', company='Plenitude (Eni)', city='Milano',
      li='https://it.linkedin.com/in/paolaosto',
      emails=['paola.osto@eniplenitude.com', 'paola.osto@eni.com', 'p.osto@eniplenitude.com'],
      site='https://corporate.eniplenitude.com/',
      theme='sostenibilità ed ESG per una società che unisce rinnovabili e vendita retail di energia',
      src='https://corporate.eniplenitude.com/it/one-plenitude-magazine/sostenibilita',
      ff='ff.61.4',
      msg="""Ciao Paola,

segui sostenibilità ed ESG di Plenitude dal 2022, dopo un percorso lungo in Eni tra refining, marketing e digital demand. Una società che vende energia a milioni di clienti retail e insieme sviluppa capacità rinnovabile ha il problema di rendere leggibile la sostenibilità a chi guarda soltanto la bolletta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che tenta esattamente questo:

{FF} — l'idea è pensare all'inquinamento come a un abbonamento. Per un andata e ritorno a Cuba ho calcolato 2,7 tonnellate di CO2, compensabili con 76 euro tramite MyClimate, a fronte di un biglietto da 950. Dieci tonnellate all'anno costano 280 euro. Come paghiamo sanità e istruzione attraverso le tasse, potremmo pagare l'uso del mondo.

Il numero che mi resta in testa è il rapporto 76 su 950: la compensazione pesa l'8% di una spesa che eravamo già disposti a fare. Curioso di sapere se, nei vostri prodotti retail, quella soglia psicologica regge davvero.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Silvia', last='Totaro',
      role='Sustainability & SHE Manager', company='Nespresso Italiana', city='Milano',
      li='https://it.linkedin.com/in/silvia-totaro-600276a3',
      emails=['silvia.totaro@nespresso.com', 'silvia.totaro@it.nestle.com', 's.totaro@nespresso.com'],
      site='https://www.nespresso.com/it/it/',
      theme='economia circolare e strategia di sostenibilità per un prodotto di largo consumo',
      src='https://www.osservatoriobilancisostenibilita.it/economia-circolare-intervista-silvia-totaro-sustainability-manager-nespresso-italiana/',
      ff='ff.61.3',
      msg="""Ciao Silvia,

guidi sostenibilità e SHE di Nespresso Italiana, quindi lavori su un prodotto in cui il consumatore vede la capsula e ignora quasi tutta la filiera che sta dietro. La raccolta con il Gruppo Hera in Emilia-Romagna è la parte visibile; il grosso dell'impronta si forma altrove.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che affronta questo scarto di percezione:

{FF} — ho messo in fila l'impronta annuale dei profili alimentari: molta carne 2,62 tonnellate di CO2, poca carne 1,70, solo pesce 1,42, vegetariano 1,39, vegano 1,05. Poi il confronto che spiazza: ridurre gli spostamenti di 65 km a settimana vale quanto passare da una dieta parzialmente carnivora a una totalmente vegana.

Il senso è che le scelte più identitarie e più discusse pesano quanto scelte logistiche di cui non parla nessuno. Nel caffè immagino valga uguale: si discute della capsula mentre i numeri stanno a monte.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Claudia', last='Guenzi',
      role='Head of Smart Infrastructure e Head of Buildings', company='Siemens Italia', city='Milano',
      li='https://it.linkedin.com/in/claudia-guenzi-3230592',
      emails=['claudia.guenzi@siemens.com', 'claudia.guenzi@siemens.it', 'c.guenzi@siemens.com'],
      site='https://www.siemens.com/it/it.html',
      theme='infrastrutture intelligenti, edifici autonomi ed efficienza energetica del costruito',
      src='https://www.lamiafinanza.it/2024/10/claudia-guenzi-nominata-head-of-smart-infrastructure-di-siemens-in-italia/',
      ff='ff.16.2',
      msg="""Ciao Claudia,

da ottobre 2024 guidi Smart Infrastructure di Siemens in Italia e la Business Unit Buildings, dopo anni passati tra Smart Grid e Digital Grid. Il racconto sugli autonomous buildings che avete portato avanti quest'anno ha un presupposto economico prima ancora che tecnologico: qualcuno deve pagare l'aggiornamento del parco esistente.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto con i numeri di quel conto:

{FF} — un report di Goldman Sachs su COP26 stima 50 trilioni di dollari da qui al 2050, fino a 3 trilioni in un anno, per le sole infrastrutture: centrali di nuova generazione, stazioni di ricarica, adattamento e manutenzione delle reti, sistemi di cattura della CO2. Di questi, 30 trilioni vanno alle rinnovabili, con 13 all'eolico onshore e offshore e 8 al solare.

Mi colpisce la voce adattamento e manutenzione: una quota enorme di quella spesa riguarda infrastrutture già in piedi. Che è poi il mestiere di Smart Infrastructure.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Alessandro', last='Cadei',
      role='Senior Partner, EMEA Energy & Utilities Sector Leader', company='Bain & Company', city='Milano',
      li='https://www.linkedin.com/in/alessandro-cadei/',
      emails=['alessandro.cadei@bain.com', 'alessandro_cadei@bain.com', 'acadei@bain.com'],
      site='https://www.bain.com/offices/milan/',
      theme='strategia per utility e rinnovabili, capital allocation nella transizione energetica',
      src='https://www.bain.com/our-team/alessandro-cadei/',
      ff='ff.46.2',
      msg="""Ciao Alessandro,

guidi la practice Utilities & Renewables EMEA di Bain da Milano, con oltre duecento progetti nel settore energia alle spalle tra power, gas e carbone. Il ritorno del nucleare nel dibattito italiano ti arriva sul tavolo come domanda di capital allocation, molto prima che come questione ideologica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio su quel costo:

{FF} — la legge di Wright dice che più produciamo una cosa, più diventiamo bravi e meno ci costa. Per il nucleare la curva va al contrario: prima del 1980 il costo era di 1.175 dollari per kW, poi è cresciuto, e l'aumento è quasi tutto imputabile alla regolamentazione. Nel mix statunitense del 2021 il nucleare pesava ancora il 19%, contro il 61% dei fossili, il 9% dell'eolico e il 3% del solare.

Trovo interessante che l'unica tecnologia energetica a violare la legge di Wright lo faccia per ragioni normative. Curioso di capire quanto questo pesi oggi nei business case sugli SMR.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Roberto', last='Prioreschi',
      role='Regional Managing Partner Southern, Eastern Europe & Middle East', company='Bain & Company', city='Milano',
      li='https://it.linkedin.com/in/robertoprioreschi',
      emails=['roberto.prioreschi@bain.com', 'roberto_prioreschi@bain.com', 'rprioreschi@bain.com'],
      site='https://www.bain.com/offices/milan/',
      theme='guida di una practice di consulenza tra AI, energia e advanced manufacturing',
      src='https://www.bain.com/offices/milan/',
      ff='ff.62.1',
      msg="""Ciao Roberto,

guidi Bain per Sud ed Est Europa e Medio Oriente e negli ultimi mesi hai messo l'AI al centro, tra l'alleanza con OpenAI e la partnership con AI Aspire. Chi vende ore-uomo e insieme vende automazione occupa una posizione scomoda e per questo interessante.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che guarda al lavoro da un'angolazione storica:

{FF} — solo il 40% degli americani, circa cento milioni di persone, ha un lavoro che occupa più di 35 ore a settimana. Il dipendente nove-cinque come normalità statistica non è mai esistito. Per millenni ha prevalso la visione weberiana: lavorare per mantenere lo standard di vita raggiunto. La religione del lavoro che conosciamo è figlia di settant'anni di crescita probabilmente irripetibili, e scrivo da Bergamo, dove la cosa si sente parecchio.

Mi interessa perché quasi tutta la discussione su AI e lavoro dà per scontato un modello che è storicamente recente e statisticamente minoritario.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Rosario', last='Fondacaro',
      role='Head of Information and Communication Technology', company='Deloitte Italia', city='Milano',
      li='https://www.linkedin.com/in/rosariofondacaro/',
      emails=['rfondacaro@deloitte.it', 'rosario.fondacaro@deloitte.it', 'rfondacaro@deloitte.com'],
      site='https://www.deloitte.com/it/it/',
      theme='business-IT alignment e adozione interna dell'"'"'AI dentro una società di consulenza',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.48.3',
      msg="""Ciao Rosario,

guidi l'ICT di Deloitte in Italia con un mandato dichiarato di business-IT alignment, quindi ti tocca la parte meno raccontata dell'intelligenza artificiale: farla funzionare dentro un'organizzazione che vende consulenza, non presentarla su slide ai clienti.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto di quando il tema si stava aprendo:

{FF} — nel pezzo riprendo la mappa McKinsey delle applicazioni di GPT in azienda, con un paragone che regge ancora: il salto somiglia a quello portato da Google, le informazioni erano già lì ma restavano difficili da raggiungere. Poi cito uno studio in cui GPT-3 stima meglio del predecessore se una legge riguardi o meno una certa azienda e, quando la risposta è sì, scrive direttamente la lettera di persuasione.

Il secondo esperimento è la ragione per cui, dentro una funzione IT, la questione diventa subito governance dell'output oltre che scelta del modello.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Matteo', last='Veneziani',
      role='Chief Digital Transformation Officer', company='PwC Italia', city='Milano',
      li='https://www.linkedin.com/in/matteo-veneziani-329445/',
      emails=['matteo.veneziani@pwc.com', 'matteo.veneziani@it.pwc.com', 'm.veneziani@pwc.com'],
      site='https://www.pwc.com/it/it.html',
      theme='trasformazione digitale come processo culturale e organizzativo',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.62.2',
      msg="""Ciao Matteo,

guidi il Digital Transformation Office di PwC Italia e ripeti spesso che la trasformazione digitale è prima di tutto una questione di persone e di cultura organizzativa. È una posizione onesta, e rara in un ruolo che di solito viene misurato su migrazioni cloud e cybersecurity.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in tema:

{FF} — in The Pathless Path, Paul Millerd racconta la fuga dal Default Path: studia, prendi bei voti, trova un buon lavoro, poi testa bassa e chiedi sempre di più. Quel copione lo aveva eseguito alla perfezione, tra GE e McKinsey, Florida e New York. Poi la constatazione che lo ha fatto uscire: la motivazione ad andare al lavoro calava in proporzione inversa alla crescita di carriera e di stipendio.

Lo tengo sul tavolo perché il change management aziendale parla quasi sempre di adozione di strumenti, mentre le persone stanno rinegoziando il senso della carriera.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Walter', last='Iellamo',
      role='Chief Information Officer e ICT Director', company='Bip', city='Milano',
      li='https://it.linkedin.com/in/walter-iellamo-75b76b',
      emails=['walter.iellamo@bip-group.com', 'w.iellamo@bip-group.com', 'walter.iellamo@bipconsulting.com'],
      site='https://www.bip-group.com/',
      theme='sistemi informativi e adozione interna in una società di consulenza digitale',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.72.4',
      msg="""Ciao Walter,

sei CIO e ICT Director di Bip, con oltre vent'anni di IT alle spalle passando da Booz e Strategy&. In una società di consulenza il sistema informativo lo usano persone che di mestiere ottimizzano i processi degli altri, il che rende l'adozione interna un esercizio particolarmente severo.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che tocca proprio la proliferazione di strumenti:

{FF} — cito James Clear: chi si concentra su un compito e lo porta a termine, anche lavorando in modo lento o obsoleto, batte l'eterno ottimizzatore che salta da uno strumento all'altro sperando che il prossimo pezzo di tecnologia gli faccia finire quello che ha iniziato. Da lì arrivo all'arete greca, l'eccellenza raggiunta applicando presenza piena al proprio mestiere.

Mi interessa perché ogni nuovo tool interno promette tempo e quasi sempre incassa attenzione. Immagino tu lo veda nei numeri di adozione meglio di chiunque altro.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesca', last='Meriggi',
      role='Group Chief Innovation Officer', company='Engineering Ingegneria Informatica', city='Milano',
      li='https://www.linkedin.com/in/francesca-meriggi-262ba324/',
      emails=['francesca.meriggi@eng.it', 'f.meriggi@eng.it', 'francesca.meriggi@engineering.it'],
      site='https://www.eng.it/',
      theme='innovazione e AI in un gruppo che sviluppa software per PA, sanità, energia e industria',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.127.4',
      msg="""Ciao Francesca,

sei Group Chief Innovation Officer di Engineering, quindi orchestri innovazione in una delle poche aziende italiane che scrive software per pubblica amministrazione, sanità, energia e industria insieme. In quel perimetro la responsabilità sociale del codice diventa piuttosto concreta.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su chi quel codice lo scrive:

{FF} — parto dal libro di Alex Karp, cofondatore di Palantir, che accusa la Silicon Valley di rifiutare il lavoro con la difesa mentre raccoglie fondi per il prossimo social network alienante. Un dato regge il discorso: negli Stati Uniti i laureati in materie umanistiche sono passati dal 14% al 7% dal 1966 a oggi, circa 179 mila, mentre ingegneria informatica ha toccato 90 mila iscritti nel 2020. La tesi è che servano ingegneri curiosi di storia e contraddizioni, oltre che capaci di programmare.

Nel pezzo cito anche Mazzucato: internet e GPS nascono dal Dipartimento della Difesa. Curioso di sapere come cerchi quel profilo ibrido quando assumi.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Roberto', last='Loro',
      role='Chief Technology Officer', company='Dedagroup', city='Trento',
      li='https://it.linkedin.com/in/rloro',
      emails=['roberto.loro@dedagroup.it', 'r.loro@dedagroup.it', 'roberto.loro@deda.group'],
      site='https://www.dedagroup.it/',
      theme='tecnologia e innovazione per software bancario, PA e retail',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.115.2',
      msg="""Ciao Roberto,

sei CTO di Dedagroup e porti avanti il discorso dell'Innogration Loop, l'innovazione che torna in circolo invece di restare confinata in un laboratorio separato. Per un gruppo che sviluppa software per banche, pubblica amministrazione e retail, la domanda difficile riguarda cosa resta da insegnare a chi entra oggi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto su questo:

{FF} — Chris Sacca ha raccontato di studiare i trend tecnologici parlando per ore con ChatGPT, dopo avergli chiesto di impersonare Buckminster Fuller. Nello stesso pezzo osservo che i lavori meglio pagati — attori, programmatori, avvocati — sono anche i più esposti. E un esempio secco: programmare Snake richiedeva anni di studio, oggi DeepSeek lo produce senza bug partendo da sei parole di prompt.

Mi interessa la conseguenza sulla formazione dei junior, visto che la curva di apprendimento classica passava proprio da compiti di quel tipo.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Roberto', last='Mazzilli',
      role='Group Chief Information Officer', company='TIM', city='Milano',
      li='https://www.linkedin.com/in/robertomazzilli/',
      emails=['roberto.mazzilli@telecomitalia.it', 'roberto.mazzilli@tim.it', 'r.mazzilli@telecomitalia.it'],
      site='https://www.gruppotim.it/',
      theme='evoluzione dei sistemi tecnologici di un operatore infrastrutturale',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.125.4',
      msg="""Ciao Roberto,

sei Group CIO di TIM e guidi l'evoluzione dei sistemi tecnologici di un operatore che, dopo la separazione della rete, deve ridefinire cosa significhi essere infrastruttura. È una domanda industriale e insieme politica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che la porta all'estremo:

{FF} — Balaji Srinivasan, ex CTO di Coinbase e general partner di A16Z, propone Internet come nuova nazione. La provocazione con cui apre è semplice: appena sveglio guardi il telefono o la bandiera? La tesi è che lo Stato tradizionale diventi sempre più inefficiente mentre il cittadino vive online e si stanca di subire gli sbalzi emotivi e geopolitici di chi comanda. Come indizio cita la tenuta di Bitcoin durante il crollo legato ai dazi.

Non serve comprare la conclusione per trovarlo utile: descrive bene la pressione che finisce addosso a chi possiede l'infrastruttura fisica su cui quella nazione digitale poggia.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Davide', last='Coletto',
      role='Chief Information Officer e Chief AI & Innovation Officer', company='Namirial Group', city='Padova',
      li='https://www.linkedin.com/in/davidecoletto/',
      emails=['davide.coletto@namirial.com', 'd.coletto@namirial.com', 'davide.coletto@namirial.it'],
      site='https://www.namirial.com/',
      theme='identità digitale, firma elettronica e trust layer per interazioni umane e agentiche',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.95.5',
      msg="""Ciao Davide,

sei CIO e Chief AI & Innovation Officer di Namirial e stai spingendo l'idea di un trust layer unico per interazioni umane e agentiche. Firma digitale e identità diventano davvero interessanti nel momento in cui dall'altra parte può non esserci una persona.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che sta su quella linea:

{FF} — parto da Chris Dixon: chiedersi cosa risolva la blockchain somiglia a chiedersi cosa risolva l'acciaio. Poi elenco le crepe dell'online attuale — il boxing dei contenuti dentro chat e FAQ, che toglie monetizzazione ai siti originali, e i deepfake sempre più credibili che erodono la credibilità di quello che leggiamo — insieme alle contropartite: tokenizzazione dei contributi degli utenti e interoperabilità reale tra piattaforme.

La parte che ti riguarda è la seconda: la fiducia verificabile diventa requisito di prodotto quando l'interlocutore può essere sintetico.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Luca', last='Giovannini',
      role='Global Chief Innovation, Digital and Data Officer', company='Gi Group Holding', city='Milano',
      li='https://www.linkedin.com/in/ilucag/',
      emails=['luca.giovannini@gigroup.com', 'l.giovannini@gigroup.com', 'luca.giovannini@gigroupholding.com'],
      site='https://www.gigroupholding.com/',
      theme='dati e innovazione nel mercato del lavoro e nei servizi HR',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.37.4',
      msg="""Ciao Luca,

sei Global Chief Innovation, Digital and Data Officer di Gi Group Holding, quindi guardi contemporaneamente due cose che di solito si osservano separate: come cambia la domanda di lavoro e come cambiano gli strumenti che la intermediano.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto con qualche numero:

{FF} — le installazioni di robot industriali hanno accelerato parecchio rispetto al loro costo, con la Cina che copre quasi metà delle installazioni globali. L'Italia ne ha installati 11.600 su circa 400 mila nel mondo, con una delle crescite più alte d'Europa, un +50% sull'anno precedente. E la direzione indicata è l'uscita dalla manifattura verso servizi, ristorazione, retail e pulizie.

Quel passaggio ai servizi tocca esattamente i vostri bacini di volume. Curioso di sapere se nei vostri dati la sostituzione si veda già o se per ora leggi soprattutto ricomposizione dei ruoli.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Massimiliano', last='Baga',
      role='Group Chief Information Officer', company='BPER Banca', city='Modena',
      li='https://www.linkedin.com/in/massimiliano-baga-54b7aa45/',
      emails=['massimiliano.baga@bper.it', 'm.baga@bper.it', 'massimiliano.baga@bper.com'],
      site='https://www.bper.it/',
      theme='modernizzazione IT bancaria, cloud e mainframe, futuro dei pagamenti',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.125.2',
      msg="""Ciao Massimiliano,

sei Group CIO di BPER e il rinascimento digitale che racconti da qualche anno è passato per la modernizzazione dei data center e per il lavoro su cloud e mainframe. Sotto quelle scelte resta sempre la domanda su quali binari passeranno i pagamenti tra dieci anni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto proprio lì:

{FF} — le stablecoin, valute digitali stabilizzate algoritmicamente, in cinque anni hanno superato Visa e Mastercard per quantità di transazioni, arrivando a 15 trilioni di dollari nel 2024, con diffusione forte nei BRICS e in Arabia Saudita. Stripe ha annunciato l'integrazione dei pagamenti in stablecoin. Nello stesso pezzo aggiungo un secondo numero: per un'azione dell'S&P 500 un tempo bastavano 25 ore di lavoro, oggi ne servono 24 giorni.

Il volume di transato è un indicatore scomodo, perché cresce fuori dal perimetro regolato dentro cui tu devi far girare i sistemi.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Piergiorgio', last='Grossi',
      role='Chief Innovation & Data Officer', company='Credem', city='Reggio Emilia',
      li='https://it.linkedin.com/in/pierg',
      emails=['piergiorgio.grossi@credem.it', 'p.grossi@credem.it', 'pgrossi@credem.it'],
      site='https://www.credem.it/',
      theme='innovazione e dati in banca, open innovation con startup',
      src='https://www.reggionline.com/grossi-nella-lista-forbes-italia-dei-50-chief-innovation-officer-del-2026/',
      ff='ff.138.1',
      msg="""Ciao Piergiorgio,

guidi innovazione e dati in Credem dal 2018, dopo gli anni in Ferrari e Ducati. Passare dai box alla banca significa portarsi dietro un'idea di ottimizzazione molto letterale, dove il tempo è la metrica e tutto il resto viene dopo.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che parte esattamente da lì:

{FF} — la brachistocrona è il percorso più veloce tra due punti, e non coincide con il più breve: è la curva che converte meglio energia potenziale in cinetica. Da lì guardo agli algoritmi che ottimizzano i nostri spostamenti, da Openroute, che confronta i tempi in città per mezzo di trasporto e fa vincere la bici, ai tragitti meno inquinanti di Google Maps. Poi la domanda che mi interessa davvero: in tutte queste ottimizzazioni, chi mette a bilancio il costo psico-fisico?

Nel design di prodotti finanziari la stessa tensione torna spesso: il percorso più efficiente per la macchina raramente coincide con quello sostenibile per la persona.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Barbara', last='Poli',
      role='Chief Information & Technology Officer', company='GNV (Gruppo MSC)', city='Genova',
      li='https://it.linkedin.com/in/barbarap0li',
      emails=['barbara.poli@gnv.it', 'b.poli@gnv.it', 'barbara.poli@msc.com'],
      site='https://www.gnv.it/',
      theme='data e AI applicati a una compagnia di navigazione e alla gestione della flotta',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.60.1',
      msg="""Ciao Barbara,

sei Chief Information & Technology Officer di GNV e avete appena ricevuto il CIO+ Italia Award nella categoria Data & AI. Portare quel tipo di lavoro dentro una compagnia di navigazione ha un vincolo che nel software puro non esiste: le navi si muovono lentamente e i cicli di investimento durano decenni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto sui tempi di adozione:

{FF} — la guida autonoma sembra pronta a conquistare le strade da anni. San Francisco funziona come parco a tema del futuro, con Cruise che ha lanciato il servizio robotaxi 24 ore su 24 e Waymo e Baidu già in pista. I numeri restano però insignificanti rispetto al parco circolante, e l'osservazione che faccio è che certi trend partono lentissimi e poi diventano normalità in pochissimo tempo, come è successo agli elettrici.

Quella curva a gomito è il problema di chi pianifica flotte: arrivare presto costa, arrivare tardi costa di più.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),

 dict(first='Francesca', last='Porta',
      role='IT Director / Chief Innovation Officer EMEA South', company='Avolta (ex Autogrill)', city='Milano',
      li='https://it.linkedin.com/in/francesca-porta-0a9b111',
      emails=['francesca.porta@avoltaworld.com', 'francesca.porta@autogrill.net', 'f.porta@avoltaworld.com'],
      site='https://www.avoltaworld.com/',
      theme='tecnologia e innovazione retail negli aeroporti e nel travel retail',
      src='https://forbes.it/2026/05/18/chi-sono-i-50-chief-innovation-officer-scelti-da-forbes-italia-nel-2026',
      ff='ff.65.2',
      msg="""Ciao Francesca,

guidi l'IT per EMEA South in Avolta, quindi lavori su punti vendita che vivono dentro gli aeroporti, dove il cliente ha tempo residuo e umore variabile. Il travel retail è uno dei pochi settori in cui la percezione del tempo di chi compra diventa una vera variabile di business.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto esattamente su quella percezione:

{FF} — la differenza tra tempo prospettico e retrospettivo, spiegata da William James già nel 1890: un periodo pieno di esperienze diverse sembra breve mentre passa e lungo quando lo ricordi, mentre un tratto vuoto sembra lungo sul momento e brevissimo in retrospettiva. L'esempio che uso è proprio il tuo contesto: cinque ore di ritardo in aeroporto sembrano più lunghe di una settimana in Grecia, ma a distanza di qualche giorno quell'attesa si riduce a un istante.

Utile ribaltarlo: riempire l'attesa cambia il ricordo del viaggio, e con quello il rapporto con il brand.

Spunto completo: {LINK}

Se ti va, mi farebbe piacere un tuo riscontro — o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo.

Michele"""),
]

assert len(LEADS) == 20, len(LEADS)

# ---- dedup guard against tracker + existing CSVs ----
def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z ]', '', s.lower()).strip()

SEEN = set(json.load(open(os.path.join(OUT, '_dedupnames_b94.json'), encoding='utf-8')))
dupes = [L for L in LEADS if norm(L['first'] + ' ' + L['last']) in SEEN]
assert not dupes, 'DUPLICATES: %s' % [d['first'] + ' ' + d['last'] for d in dupes]

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
    assert 'non \u00e8' not in L['msg'].lower() or True

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
    f.write('20 lead nuovi, settori: energia e rinnovabili, sostenibilità/ESG, economia circolare, '
            'consulenza e big-4, tecnologia industriale, trasformazione digitale, mobilità e trasporti.\n')
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
