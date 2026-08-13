# -*- coding: utf-8 -*-
import json, csv, shutil, os

DATE = "2026-07-23"
BATCH = 87
START_ID = 1477
TRACKER = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json"
BACKUP  = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b87.json"
OUTDIR  = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach"
CTA = "Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com"

# Each record: first,last,role,company,city,linkedin,domain,website,priority,
# emails(list, first=best), ffcode, ff_title(with emoji), ff_url, focus, source_url, message
R = []
def add(**k): R.append(k)

add(first="Michela", last="Mossini", role="Head of CEO Office, Strategy and Sustainability", company="Enel", city="Roma",
 linkedin="https://www.linkedin.com/in/michela-mossini-01b28081/", domain="enel.com", website="https://www.enel.com", priority="P1",
 emails=["michela.mossini@enel.com"], ffcode="ff.11.1", ff_title="\U0001f32c️ ff.11.1 La rivincita delle rinnovabili?",
 ff_url="https://fortissimo.substack.com/i/44894125/ff111-la-rivincita-delle-rinnovabili",
 focus="strategia e sostenibilità di gruppo, mix energetico", source_url="https://www.enel.com/company/about-us/chairman-management-team/michela-mossini",
 message="""Ciao Michela,

guidi strategia e sostenibilità di gruppo in Enel, nel punto in cui il mix elettrico europeo si sta ridisegnando.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e società. Ti lascio uno spunto in tema:

\U0001f32c️ ff.11.1 La rivincita delle rinnovabili? — già nel 2020 l'intera crescita di generazione elettrica mondiale è arrivata da eolico, solare e idroelettrico: +163 TWh di solo eolico, mentre il nucleare arretrava di 94 TWh. Un sorpasso che ha i tratti dello strutturale, non del congiunturale.

La domanda che ti giro: nella pianificazione Enel, quanto è ormai vincolo di rete e quanto vincolo di capacità la vera frontiera dei prossimi cinque anni?

Post completo: https://fortissimo.substack.com/i/44894125/ff111-la-rivincita-delle-rinnovabili
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Claudio", last="Spadacini", role="Founder & CEO", company="Energy Dome", city="Milano",
 linkedin="https://www.linkedin.com/in/claudio-spadacini-13a78146/", domain="energydome.com", website="https://energydome.com", priority="P1",
 emails=["claudio.spadacini@energydome.com"], ffcode="ff.149.2", ff_title="\U0001f9ee ff.149.2 Una questione di ore…",
 ff_url="https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-una-questione-di-ore",
 focus="accumulo di lunga durata, CO2 Battery", source_url="https://energydome.com/energy-dome-inks-a-strategic-commercial-agreement-with-google/",
 message="""Ciao Claudio,

seguo Energy Dome e la CO2 Battery, ora anche nell'accordo con Google: lo storage di lunga durata come tassello mancante del solare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto:

\U0001f9ee ff.149.2 Una questione di ore… — nel 2025 il mondo ha aggiunto 510 GW di potenza (quanto l'intera produzione elettrica di India e Brasile) e il solare vale ormai circa il 10% dell'elettricità globale. Ma l'elettricità pesa solo il 20% dell'energia, e resta il nodo delle ore: produrre non basta, serve spostare l'energia nel tempo.

Ti chiedo, da chi il problema lo risolve ogni giorno: il collo di bottiglia dei prossimi anni è più la densità dello storage o l'economia delle ore di scarica?

Post completo: https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-una-questione-di-ore
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Giacomo", last="Chiavari", role="Partner, EY-Parthenon Italy Strategy Leader", company="EY", city="Milano",
 linkedin="https://www.linkedin.com/in/giacomo-chiavari-931b7a", domain="it.ey.com", website="https://www.ey.com/it_it", priority="P1",
 emails=["giacomo.chiavari@it.ey.com","giacomo.chiavari@ey.com"], ffcode="ff.42.2", ff_title="❓ ff.42.2 Inquinano o spingono la transizione?",
 ff_url="https://fortissimo.substack.com/i/79523597/ff-inquinano-o-spingono-la-transizione",
 focus="transizione energetica, strategia corporate", source_url="https://www.ey.com/en_it/people/giacomo-chiavari",
 message="""Ciao Giacomo,

guidi la strategia di EY-Parthenon in Italia, spesso sul crinale tra transizione energetica e conti che devono tornare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia ed energia. Ti lascio uno spunto:

❓ ff.42.2 Inquinano o spingono la transizione? — la Cina resta il primo emettitore mondiale (un quarto del totale) e il primo costruttore di impianti a carbone, ma è anche il Paese che ha investito di più nella transizione: 266 miliardi di dollari in un anno, 2,4 volte gli Stati Uniti. Due letture opposte dello stesso dato.

La domanda che ti giro: nei mandati che segui, questa ambivalenza cinese entra più come rischio di filiera o come benchmark di capitale allocato?

Post completo: https://fortissimo.substack.com/i/79523597/ff-inquinano-o-spingono-la-transizione
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Marco", last="Stangalino", role="Executive Vice President, Head of Power Asset Division", company="Edison", city="Milano",
 linkedin="https://it.linkedin.com/in/marco-stangalino-b304301b7", domain="edison.it", website="https://www.edison.it", priority="P1",
 emails=["marco.stangalino@edison.it"], ffcode="ff.70.3", ff_title="\U0001f4a3 ff.70.3 Che bomba i pannelli solari!",
 ff_url="https://fortissimo.substack.com/i/136685190/ff-che-bomba-i-pannelli-solari",
 focus="sviluppo asset rinnovabili, strategia energetica", source_url="https://www.edison.it/marco-stangalino",
 message="""Ciao Marco,

guidi la divisione Power Asset di Edison, con circa 200 MW di rinnovabili completati quest'anno.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto in tema:

\U0001f4a3 ff.70.3 Che bomba i pannelli solari! — spostati gli investimenti dalle fossili al fotovoltaico, il costo dell'elettricità che se ne ricava è diventato in certi contesti negativo: a installarli, ci si guadagna. L'IEA li cita tra le sole 3 tecnologie (su 50) davvero in linea con gli obiettivi 2030.

Ti chiedo: con prezzi così, il vincolo del tuo portafoglio è ormai più autorizzativo e di connessione alla rete che tecnologico?

Post completo: https://fortissimo.substack.com/i/136685190/ff-che-bomba-i-pannelli-solari
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Alessandra", last="Cerruti", role="Partner, Sustainability & ESG reporting lead", company="Deloitte", city="Milano",
 linkedin="https://it.linkedin.com/in/alessandra-cerruti-b5a2351b", domain="deloitte.it", website="https://www.deloitte.com/it/it.html", priority="P1",
 emails=["acerruti@deloitte.it","alessandra.cerruti@deloitte.it"], ffcode="ff.16.3", ff_title="⚫ ff.16.3 Il mercato (nero) della CO2",
 ff_url="https://fortissimo.substack.com/i/45402434/ff163-il-mercato-nero-della-co2",
 focus="ESG advisory, rendicontazione di sostenibilità, CSRD", source_url="https://www.deloitte.com/it/it/about/people/profiles.acerruti%2B2d414633.html",
 message="""Ciao Alessandra,

guidi in Deloitte il presidio tecnico su rendicontazione ed ESG, nel pieno del cantiere CSRD.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto:

⚫ ff.16.3 Il mercato (nero) della CO2 — il prezzo della tonnellata di CO2 va da 7$ in Cina a oltre 150$ in Svezia, con l'Europa intorno ai 75$; McKinsey stima servano almeno 50€/t per finanziare la transizione. Finché il prezzo del carbonio resta così frammentato, ogni report rischia di misurare grandezze non davvero comparabili.

La domanda che ti giro: nel lavoro con i clienti, la difficoltà maggiore è il dato di perimetro o la sua confrontabilità tra giurisdizioni?

Post completo: https://fortissimo.substack.com/i/45402434/ff163-il-mercato-nero-della-co2
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Luca", last="Travaglini", role="Co-Founder & Co-CEO", company="Planet Farms", city="Milano",
 linkedin="https://www.linkedin.com/in/luca-travaglini-8440872/", domain="planetfarms.ag", website="https://www.planetfarms.ag", priority="P1",
 emails=["luca.travaglini@planetfarms.ag"], ffcode="ff.26.3", ff_title="\U0001f33e ff.26.3 I super-cibi per salvare il pianeta",
 ff_url="https://fortissimo.substack.com/i/51373528/ff263-i-super-cibi-per-salvare-il-pianeta",
 focus="foodtech, vertical farming, sostenibilità", source_url="https://www.hotpot-italia.com/interviste/luca-travaglini-co-ceo-co-founder-planet-farms",
 message="""Ciao Luca,

con Planet Farms hai portato il vertical farming a scala industriale, dall'impianto di Cirimido in poi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, cibo e ambiente. Ti lascio uno spunto:

\U0001f33e ff.26.3 I super-cibi per salvare il pianeta — il grano, che produce una volta l'anno e va continuamente ripiantato, ha un costo ecologico più alto di alternative perenni come la kernza, che dà semi in modo ciclico. La partita agricola si gioca sempre più sulla resa per risorsa impiegata.

Ti chiedo, da chi coltiva in verticale: nel confronto con il campo aperto, qual è oggi la metrica in cui vincete davvero — acqua, resa per metro quadro o prossimità al consumo?

Post completo: https://fortissimo.substack.com/i/51373528/ff263-i-super-cibi-per-salvare-il-pianeta
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Giuseppe", last="Falco", role="Managing Director & Senior Partner, Chairman BCG Italy", company="BCG", city="Milano",
 linkedin="https://www.linkedin.com/in/giuseppe-falco-82450626", domain="bcg.com", website="https://www.bcg.com", priority="P1",
 emails=["falco.giuseppe@bcg.com","giuseppe.falco@bcg.com"], ffcode="ff.45.3", ff_title="\U0001f680 ff.45.3 Quali trend decolleranno?",
 ff_url="https://fortissimo.substack.com/i/90888342/ff-quali-trend-decolleranno",
 focus="energia, industrial goods, digital transformation", source_url="https://www.bcg.com/about/people/experts/giuseppe-falco",
 message="""Ciao Giuseppe,

presiedi BCG in Italia, con un piede nell'energia e uno nell'industrial.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed economia. Ti lascio uno spunto:

\U0001f680 ff.45.3 Quali trend decolleranno? — un'analisi segnalava tre tecnologie arrivate a maturità e a diffusione esponenziale nello stesso momento: rimozione di CO2 dall'atmosfera, satelliti per la connettività e AI generativa. Convergenze simultanee che spostano interi settori insieme, non a turno.

La domanda che ti giro: nei tavoli con i tuoi clienti industriali, quale di queste tre sta entrando prima nei piani di capex reali?

Post completo: https://fortissimo.substack.com/i/90888342/ff-quali-trend-decolleranno
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Francesco", last="Del Pizzo", role="Director, Grid Development Strategies & Dispatching", company="Terna", city="Roma",
 linkedin="https://it.linkedin.com/in/francesco-del-pizzo", domain="terna.it", website="https://www.terna.it", priority="P1",
 emails=["francesco.delpizzo@terna.it","francesco.del.pizzo@terna.it"], ffcode="ff.5.2", ff_title="\U0001f50b ff.5.2 Duracell? No, Tesla",
 ff_url="https://fortissimo.substack.com/i/44017566/ff52-duracell-no-tesla",
 focus="sviluppo rete elettrica, storage, dispacciamento", source_url="https://www.terna.it/it/chi-siamo/manager/francesco-del-pizzo",
 message="""Ciao Francesco,

in Terna guidi le strategie di sviluppo rete e dispacciamento, dove ogni GW rinnovabile aggiunto è anche un problema di bilanciamento.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto:

\U0001f50b ff.5.2 Duracell? No, Tesla — la sola Tesla controlla circa il 25% dello storage elettrico mondiale (3 GWh) e punta a 1.500 GWh entro il 2030, un fattore 500. Numeri che raccontano quanto lo stoccaggio stia diventando infrastruttura di rete a tutti gli effetti.

La domanda che ti giro: per la rete italiana, il vero abilitante dei prossimi anni è lo storage in batteria o la flessibilità della domanda?

Post completo: https://fortissimo.substack.com/i/44017566/ff52-duracell-no-tesla
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Paola", last="Angeletti", role="Chief Sustainability Officer", company="Intesa Sanpaolo", city="Milano",
 linkedin="https://it.linkedin.com/in/paola-angeletti-", domain="intesasanpaolo.com", website="https://group.intesasanpaolo.com", priority="P1",
 emails=["paola.angeletti@intesasanpaolo.com"], ffcode="ff.16.1", ff_title="\U0001f4b0 ff.16.1 Tanti trillioni di dollari",
 ff_url="https://fortissimo.substack.com/i/45402434/ff161-tanti-trillioni-di-dollari",
 focus="finanza sostenibile, ESG di banca", source_url="https://group.intesasanpaolo.com/en/newsroom/all-news/news/2025/eu-climate-action-paola-angeletti",
 message="""Ciao Paola,

come prima Chief Sustainability Officer di Intesa Sanpaolo, siedi nel punto in cui la finanza decide quali transizioni finanziare.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto:

\U0001f4b0 ff.16.1 Tanti trillioni di dollari — McKinsey stima servano 9.000 miliardi di dollari l'anno per gli obiettivi di COP26: circa un decimo del PIL globale, dieci volte i finanziamenti raccolti nel 2021. E il green premium pesa ancora il 50% sul cemento e il 25% sull'acciaio.

La domanda che ti giro: dal tuo osservatorio, il gap ormai non è tanto di capitale disponibile quanto di progetti bancabili?

Post completo: https://fortissimo.substack.com/i/45402434/ff161-tanti-trillioni-di-dollari
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Niccolò", last="Calandri", role="Founder & CEO", company="3Bee", city="Milano",
 linkedin="https://www.linkedin.com/in/niccol%C3%B2-calandri-b00bb75a", domain="3bee.com", website="https://www.3bee.com", priority="P1",
 emails=["niccolo.calandri@3bee.com"], ffcode="ff.84.4", ff_title="\U0001f9aa ff.84.4 Molluschi e altri sensori",
 ff_url="https://fortissimo.substack.com/i/140973704/ff-molluschi-e-altri-sensori",
 focus="nature-tech, monitoraggio biodiversità e rischio climatico", source_url="https://www.renewablematter.eu/en/3bee-nature-tech-company-surveys-biodiversity",
 message="""Ciao Niccolò,

con 3Bee hai costruito una nature-tech company che misura biodiversità e rischio climatico dove di solito c'è solo un buco di dati.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, natura e dati. Ti lascio uno spunto:

\U0001f9aa ff.84.4 Molluschi e altri sensori — entro il 2030 l'Internet of Things conterà 30 miliardi di connessioni, il triplo di oggi; c'è chi ha collegato le ostriche al cloud (MolluSCAN) trasformandole in sensori per prevedere ondate di calore e monitorare il clima. La natura stessa che diventa strumento di misura.

Ti chiedo, da chi la misura la fa sul campo: il salto di qualità arriva più dai sensori o dai modelli che interpretano segnali sporchi?

Post completo: https://fortissimo.substack.com/i/140973704/ff-molluschi-e-altri-sensori
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Marina", last="Catino", role="Partner, Strategic Operations lead Italy", company="Kearney", city="Milano",
 linkedin="https://www.linkedin.com/in/marina-catino-49149b/", domain="kearney.com", website="https://www.kearney.com", priority="P2",
 emails=["marina.catino@kearney.com"], ffcode="ff.37.4", ff_title="\U0001f4c8 ff.37.4 Robot sempre più diffusi",
 ff_url="https://fortissimo.substack.com/i/76236400/ff-robot-sempre-piu-diffusi",
 focus="strategic operations, strategia tecnologica", source_url="https://www.kearney.com/marina-catino",
 message="""Ciao Marina,

in Kearney guidi la practice Strategic Operations in Italia, dove l'automazione si misura in margine, non in slide.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed economia. Ti lascio uno spunto:

\U0001f4c8 ff.37.4 Robot sempre più diffusi — l'Italia ha installato 11.600 dei circa 400.000 robot industriali globali, con una delle crescite più alte d'Europa (+50% sull'anno prima). E la robotica sta uscendo dalla manifattura verso servizi, logistica e retail.

La domanda che ti giro: nei tuoi progetti di operations, il freno all'automazione è più tecnologico o organizzativo?

Post completo: https://fortissimo.substack.com/i/76236400/ff-robot-sempre-piu-diffusi
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Giampiero", last="Frisio", role="President, Electrification Business Area", company="ABB", city="Milano",
 linkedin="https://www.linkedin.com/in/giampiero-frisio-915a602/", domain="abb.com", website="https://global.abb", priority="P2",
 emails=["giampiero.frisio@abb.com","giampiero.frisio@it.abb.com"], ffcode="ff.42.1", ff_title="⛏️ ff.42.1 Minerali preziosi?",
 ff_url="https://fortissimo.substack.com/i/79523597/ff-minerali-preziosi",
 focus="elettrificazione, resilienza di rete, storage", source_url="https://global.abb/group/en/about/corporate-governance/executive-committee/giampiero-frisio",
 message="""Ciao Giampiero,

guidi l'Electrification Business Area di ABB, dove elettrificare significa anche dipendere da una filiera di minerali critici.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto:

⛏️ ff.42.1 Minerali preziosi? — la Cina controlla circa l'80% della produzione di pannelli solari e del raffinamento del litio, e il primato non nasce dalle miniere ma dalla chimica del raffinamento (80%) e dall'assemblaggio finale delle celle (73%). Il collo di bottiglia dell'elettrificazione sta a valle.

La domanda che ti giro: per ABB il rischio più concreto è l'accesso alla materia prima o la concentrazione della fase di raffinazione?

Post completo: https://fortissimo.substack.com/i/79523597/ff-minerali-preziosi
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Sara", last="Anselmi", role="Specialist Team Unit Lead (cloud, AI, business apps)", company="Microsoft Italia", city="Milano",
 linkedin="https://www.linkedin.com/in/sara-anselmi/", domain="microsoft.com", website="https://www.microsoft.com/it-it", priority="P2",
 emails=["sara.anselmi@microsoft.com"], ffcode="ff.126.4", ff_title="\U0001f170️ ff.126.4 AlphaEvolve",
 ff_url="https://fortissimo.substack.com/i/164288050/ff-alphaevolve",
 focus="cloud transformation, AI, business apps", source_url="https://news.microsoft.com/it-it/2025/09/15/microsoft-italia-nuove-nomine-nel-leadership-team/",
 message="""Ciao Sara,

guidi in Microsoft Italia il team su cloud, AI e business apps, nel momento in cui l'AI passa dal generare testo al generare scoperte.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e scienza. Ti lascio uno spunto:

\U0001f170️ ff.126.4 AlphaEvolve — il sistema di Google/DeepMind ha stabilito un nuovo record nel problema dei baci in 11 dimensioni e, applicato ai data center, ne ha ridotto dell'1% i consumi migliorando un algoritmo di Strassen imbattuto dal 1969. L'AI che ottimizza l'infrastruttura su cui gira.

La domanda che ti giro: nei deployment reali che segui, i clienti chiedono più produttività applicativa o già ottimizzazione dei costi di calcolo?

Post completo: https://fortissimo.substack.com/i/164288050/ff-alphaevolve
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Stefano", last="Cappello", role="Founder & CEO", company="Limenet", city="Lecco",
 linkedin="https://www.linkedin.com/in/stefano-cappello/", domain="limenet.com", website="https://www.limenet.com", priority="P2",
 emails=["stefano.cappello@limenet.com"], ffcode="ff.1.4", ff_title="\U0001f3ed ff.1.4 Catturare CO2 sarà importante",
 ff_url="https://fortissimo.substack.com/i/43851632/ff14-catturare-co2-sara-importante",
 focus="carbon removal, alcalinizzazione oceanica", source_url="https://carbonherald.com/podcast-ocean-alkalinity-enhancement-improves-marine-life-stefano-cappello-limenet-ceo/",
 message="""Ciao Stefano,

con Limenet lavori sulla rimozione di CO2 via alcalinizzazione oceanica, una delle poche vie che scala oltre gli alberi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, scienza e ambiente. Ti lascio uno spunto:

\U0001f3ed ff.1.4 Catturare CO2 sarà importante — un report di Goldman Sachs fissa la soglia di accessibilità sotto i 100$ a tonnellata; piantare alberi cattura al massimo il 5% delle emissioni annue, quindi la cattura industriale diventa quasi obbligata per cemento e acciaio, che hanno una chimica intrinsecamente sporca.

La domanda che ti giro: per te la vera leva competitiva del carbon removal è il costo per tonnellata o la certificabilità del credito?

Post completo: https://fortissimo.substack.com/i/43851632/ff14-catturare-co2-sara-importante
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Andrea", last="Bassanino", role="Senior Partner, Milan office", company="Roland Berger", city="Milano",
 linkedin="https://www.linkedin.com/in/andrea-bassanino-87077721/", domain="rolandberger.com", website="https://www.rolandberger.com", priority="P2",
 emails=["andrea.bassanino@rolandberger.com"], ffcode="ff.16.2", ff_title="\U0001f309 ff.16.2 Il costo delle infrastrutture",
 ff_url="https://fortissimo.substack.com/i/45402434/ff162-il-costo-delle-infrastrutture",
 focus="trasporti/infrastrutture, TMT, transizione energetica", source_url="https://www.rolandberger.com/en/Persons/Andrea.Bassanino.html",
 message="""Ciao Andrea,

come Senior Partner a Milano segui trasporti, infrastrutture e transizione energetica, dove i numeri hanno molti zeri.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia ed energia. Ti lascio uno spunto:

\U0001f309 ff.16.2 Il costo delle infrastrutture — per restare entro 1,5°C servono circa 50.000 miliardi di dollari di infrastrutture da qui al 2050 (fino a 3.000 miliardi in un solo anno); 30.000 vanno alle rinnovabili, di cui 13.000 al solo eolico onshore e offshore. La transizione, prima che un tema di policy, è un problema di cantieri.

La domanda che ti giro: nei mandati infrastrutturali che segui, il collo di bottiglia è il capitale o la capacità realizzativa della filiera?

Post completo: https://fortissimo.substack.com/i/45402434/ff162-il-costo-delle-infrastrutture
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Ksenia", last="Balanda", role="Head of Offshore Wind Italy", company="Nadara", city="Roma",
 linkedin="https://it.linkedin.com/in/ksenia-balanda-5581211b9", domain="nadara.com", website="https://www.nadara.com", priority="P2",
 emails=["ksenia.balanda@nadara.com"], ffcode="ff.149.4", ff_title="\U0001f916 ff.149.4 Andare al Maximo",
 ff_url="https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-andare-al-maximo",
 focus="eolico offshore galleggiante Italia", source_url="https://windeurope.org/annual2026/conference/people/269/",
 message="""Ciao Ksenia,

guidi l'eolico offshore di Nadara in Italia, con una pipeline di progetti galleggianti da far partire.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto:

\U0001f916 ff.149.4 Andare al Maximo — ormai produrre elettricità rinnovabile è tecnologicamente vantaggioso; il collo di bottiglia è l'installazione. Il robot Maximo (di AES, sostenuta da NVIDIA) ha completato 100 MW di solare in California installando un pannello al minuto. Lo stesso principio — la velocità di messa in opera — deciderà i tempi dell'offshore.

La domanda che ti giro: per l'eolico galleggiante italiano, il vincolo dominante oggi è l'autorizzazione, la catena di fornitura o l'installazione in mare?

Post completo: https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-andare-al-maximo
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Luisella", last="Giani", role="VP Agentforce EMEA South & Emerging Markets", company="Salesforce", city="Milano",
 linkedin="https://www.linkedin.com/in/luisellagiani/", domain="salesforce.com", website="https://www.salesforce.com", priority="P2",
 emails=["lgiani@salesforce.com","luisella.giani@salesforce.com"], ffcode="ff.119.3", ff_title="✍️ ff.119.3 Longa “Manus” con gli agenti AI?",
 ff_url="https://fortissimo.substack.com/i/158977422/ff-longa-manus-con-gli-agenti-ai",
 focus="automazione enterprise, AI agentica", source_url="https://theorg.com/org/salesforce/org-chart/luisella-giani",
 message="""Ciao Luisella,

guidi Agentforce per l'area EMEA South, proprio mentre gli agenti AI passano dalla demo al lavoro vero.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e AI. Ti lascio uno spunto:

✍️ ff.119.3 Longa “Manus” con gli agenti AI? — Manus AI, arrivato dalla Cina, è un pianificatore multi-step che “controlla il PC”, non un semplice generatore di testo. Il fronte si sta spostando: dai modelli che rispondono agli agenti che eseguono azioni concrete.

La domanda che ti giro: nei deployment enterprise che vedi, il salto di fiducia verso gli agenti è più questione di affidabilità o di governance delle azioni?

Post completo: https://fortissimo.substack.com/i/158977422/ff-longa-manus-con-gli-agenti-ai
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Alexander", last="Liberov", role="CEO", company="SolydEra", city="Mezzolombardo",
 linkedin="https://www.linkedin.com/in/liberov/", domain="solydera.com", website="https://www.solydera.com", priority="P2",
 emails=["alexander.liberov@solydera.com"], ffcode="ff.149.5", ff_title="\U0001f5fd ff.149.5 Libertà (da gas e petrolio)",
 ff_url="https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-liberta-da-gas-e-petrolio",
 focus="idrogeno verde, celle a combustibile a ossidi solidi", source_url="https://www.solydera.com/en/hydrogen-europe-features-solydera-ceo-dr-alexander-liberov-and-names-the-company-sme-of-the-month/",
 message="""Ciao Alexander,

con SolydEra lavori su idrogeno verde e celle a combustibile a ossidi solidi, tecnologie che parlano soprattutto di indipendenza.

Scrivo futuro fortissimo, newsletter italiana su tecnologia ed energia. Ti lascio uno spunto:

\U0001f5fd ff.149.5 Libertà (da gas e petrolio) — la spinta sul solare (e sull'idrogeno) è anche geopolitica: ridurre la dipendenza da gas russo e petrolio. L'Egitto ha visto raddoppiare il costo dell'energia in due mesi, mentre la stessa Cina valuta di bloccare l'export di solare per non dipendere a sua volta.

La domanda che ti giro: per l'idrogeno europeo, l'ostacolo numero uno resta il costo dell'elettrolisi o la mancanza di una domanda garantita?

Post completo: https://fortissimo.substack.com/i/ff149-come-essere-solari/ff-liberta-da-gas-e-petrolio
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Igor", last="Bailo", role="Executive Director, Data & Analytics Technology Business Line", company="Engineering Ingegneria Informatica", city="Roma",
 linkedin="https://www.linkedin.com/in/igorbailo/", domain="eng.it", website="https://www.eng.it", priority="P2",
 emails=["igor.bailo@eng.it"], ffcode="ff.55.2", ff_title="\U0001f33e ff.55.2 Campi da arare (e dati da reclamare)",
 ff_url="https://fortissimo.substack.com/i/106257226/ff-campi-da-arare-e-dati-da-reclamare",
 focus="data & analytics, trasformazione digitale", source_url="https://www.eng.it/en/insights/cinque-domande-a/igor-bailo",
 message="""Ciao Igor,

in Engineering guidi la Business Line Data & Analytics, dove il dato è la materia prima di ogni progetto.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e dati. Ti lascio uno spunto:

\U0001f33e ff.55.2 Campi da arare (e dati da reclamare) — ogni rivoluzione tecnologica ha avuto il suo input dominante: ferro, vapore, acciaio, petrolio, microelettronica. Per l'era dell'AI l'input chiave è il dato, con tutte le domande aperte sulla sua proprietà che gli scandali degli ultimi anni hanno solo anticipato.

La domanda che ti giro: nei progetti dei tuoi clienti, il valore si sposta più sul possesso del dato o sulla capacità di attivarlo in tempo reale?

Post completo: https://fortissimo.substack.com/i/106257226/ff-campi-da-arare-e-dati-da-reclamare
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

add(first="Luca", last="Gianazza", role="Managing Director, Data & AI Strategy Lead Italy/CEG", company="Accenture", city="Milano",
 linkedin="https://www.linkedin.com/in/luca-gianazza-3a26062/", domain="accenture.com", website="https://www.accenture.com/it-it", priority="P2",
 emails=["luca.gianazza@accenture.com"], ffcode="ff.129.1", ff_title="\U0001f573️ ff.129.1 La singolarità “gentile” di Altman",
 ff_url="https://fortissimo.substack.com/i/162404080/ff-la-singolarita-gentile-di-altman",
 focus="data & AI strategy enterprise", source_url="https://theorg.com/org/accenture/org-chart/luca-gianazza",
 message="""Ciao Luca,

guidi in Accenture la strategia Data & AI per Italia e Central Europe, dove ogni cliente chiede quanto in fretta cambierà tutto.

Scrivo futuro fortissimo, newsletter italiana su tecnologia e AI. Ti lascio uno spunto:

\U0001f573️ ff.129.1 La singolarità “gentile” di Altman — nel suo saggio Altman sostiene che abbiamo già superato l'orizzonte degli eventi dell'AI, ma così gradualmente da non accorgercene: ci siamo abituati in fretta, e ChatGPT è diventato circa 150 volte più economico in un anno. Il prossimo salto, dice, sarà nel mondo fisico.

La domanda che ti giro: nei tuoi mandati, l'accelerazione dei costi sta già cambiando quali casi d'uso diventano sostenibili?

Post completo: https://fortissimo.substack.com/i/162404080/ff-la-singolarita-gentile-di-altman
Se ti va, mi farebbe piacere un tuo riscontro — o vederti tra gli iscritti: https://fortissimo.substack.com

Michele""")

assert len(R) == 20, "expected 20 records, got %d" % len(R)

# ---- Build CSV ----
csv_path = os.path.join(OUTDIR, "batch%d_%s.csv" % (BATCH, DATE))
cols = ["first_name","last_name","role","company","city_or_region","linkedin_url","email_public","email_best","guessed_emails","website","focus_theme","why_match","source_urls","excerpt_text","excerpt_id","template_id","template_subject","priority","status","owner","next_action"]
with open(csv_path,"w",encoding="utf-8",newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    for r in R:
        why = "%s %s — connessione diretta a: %s" % (r["ffcode"], r["ff_title"], r["focus"])
        subject = "Spunto %s per %s" % (r["ffcode"], r["first"])
        w.writerow([
            r["first"], r["last"], r["role"], r["company"], r["city"], r["linkedin"], "",
            r["emails"][0], "|".join(r["emails"]), r["website"], r["focus"], why,
            "%s|%s|%s" % (r["linkedin"], r["website"], r["source_url"]),
            subject, r["ffcode"], "outreach_v3", subject, r["priority"], "queued", "micmer.clawdbot", "create_gmail_draft_manual"
        ])

# ---- Build MD ----
md_path = os.path.join(OUTDIR, "batch%d_%s.md" % (BATCH, DATE))
lines = []
lines.append("# FF Outreach — Batch %d (%s)\n" % (BATCH, DATE))
lines.append("20 messaggi personalizzati (~150-200 parole). Stato: drafted, send_authorized=false. ID %d-%d.\n" % (START_ID, START_ID+19))
for i, r in enumerate(R):
    rid = START_ID + i
    words = len(r["message"].split())
    subject = "Spunto %s per %s" % (r["ffcode"], r["first"])
    lines.append("## %d — %s %s · %s · %s [%s]" % (rid, r["first"], r["last"], r["role"], r["company"], r["priority"]))
    lines.append("- LinkedIn: %s" % r["linkedin"])
    lines.append("- Email best: %s (guess: %s)" % (r["emails"][0], " | ".join(r["emails"])))
    lines.append("- FF: %s — %s" % (r["ff_title"], r["ff_url"]))
    lines.append("- Subject: %s  (%d parole)\n" % (subject, words))
    lines.append(r["message"])
    lines.append("\n---\n")
with open(md_path,"w",encoding="utf-8") as f:
    f.write("\n".join(lines))

# ---- Merge tracker ----
with open(TRACKER, encoding="utf-8") as f:
    d = json.load(f)
before = len(d["contacts"])
shutil.copyfile(TRACKER, BACKUP)

existing_ids = set(c["id"] for c in d["contacts"])
new_recs = []
for i, r in enumerate(R):
    rid = START_ID + i
    assert rid not in existing_ids, "id collision %d" % rid
    subject = "Spunto %s per %s" % (r["ffcode"], r["first"])
    new_recs.append({
        "id": rid,
        "name": "%s %s" % (r["first"], r["last"]),
        "role": r["role"],
        "org": r["company"],
        "channel": "email",
        "ff_post": r["ffcode"],
        "ff_post_title": r["ff_title"],
        "ff_post_url": r["ff_url"],
        "subject": subject,
        "message": r["message"],
        "emails_guessed": r["emails"],
        "words": len(r["message"].split()),
        "status": "drafted",
        "date": DATE,
        "batch": BATCH,
        "send_authorized": False,
    })
d["contacts"].extend(new_recs)
d["meta"]["last_batch"] = BATCH
d["meta"]["last_batch_date"] = DATE
d["meta"]["updated"] = DATE
d["meta"]["total_drafted"] = d["meta"].get("total_drafted",0) + 20
d["total_drafted"] = d.get("total_drafted",0) + 20
with open(TRACKER,"w",encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=1)

after = len(d["contacts"])
print("CSV:", csv_path)
print("MD:", md_path)
print("BACKUP:", BACKUP)
print("contacts before:", before, "after:", after, "added:", after-before)
print("meta.total_drafted:", d["meta"]["total_drafted"], "top total_drafted:", d["total_drafted"])
print("new id range:", new_recs[0]["id"], "-", new_recs[-1]["id"])
