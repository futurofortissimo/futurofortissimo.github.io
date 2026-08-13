# -*- coding: utf-8 -*-
"""FF outreach batch 91 - build CSV + MD + merge tracker."""
import json, csv, shutil, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATE = "2026-07-31"
BATCH = 91
START_ID = 1557
TRACKER = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json"
BACKUP = r"C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.backup_b91.json"
OUTDIR = r"C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach"
FFIDX = OUTDIR + "/_ffidx_b91.json"
CTA = "Se ti va, mi farebbe piacere un tuo riscontro \u2014 o una call breve, o semplicemente vederti tra gli iscritti di futuro fortissimo."

FF = json.load(open(FFIDX, encoding="utf-8"))

R = []
def add(**k):
    assert k["ffcode"] in FF, "ff code non presente in data.js: " + k["ffcode"]
    k["ff_title"] = FF[k["ffcode"]]["title"]
    k["ff_url"] = FF[k["ffcode"]]["link"]
    R.append(k)

# ---------------------------------------------------------------- 1 P1
add(first="Luciano", last="Pirovano", role="Global Sustainable Development Director",
 company="Bolton Food (Bolton Group)", city="Milano",
 linkedin="https://www.linkedin.com/in/luciano-pirovano-370458/", domain="boltonfood.com",
 website="https://www.boltonfood.com", priority="P1",
 emails=["luciano.pirovano@boltonfood.com", "l.pirovano@boltonfood.com", "luciano.pirovano@boltongroup.net"],
 ffcode="ff.94.3",
 focus="sostenibilit\u00e0 della pesca, tonno certificato MSC e integrazione verticale della filiera ittica",
 source_url="https://www.esg360.it/sustainability-management/pirovano-bolton-food-best-fish-healthy-oceans-better-lives-per-una-sostenibilita-a-360/",
 message="""Ciao Luciano,

da Bolton Food guardi la filiera del tonno dal peschereccio allo scaffale, e sei tra i pochi in Italia a portare il tema della sostenibilit\u00e0 ittica dentro la strategia industriale invece che nel capitolo finale del bilancio. La presidenza ISSF dice quanto quel lavoro sia diventato di sistema.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e salute. Ti lascio uno spunto che tocca il vostro prodotto da un lato meno battuto:

\ud83d\udeac ff.94.3 Omega-3 come sigarette? \u2014 assumere 1g al giorno di omega-3 (circa 50g di salmone) pu\u00f2 avere effetti paragonabili a smettere di fumare. Il beneficio arriva dagli omega-3 lunghi, EPA e DPA, che stanno nelle fonti animali; la variante breve ALA di semi e diete vegetali, anche se in parte allungata dalla digestione, non basta a coprire il fabbisogno.

Mi ha colpito perch\u00e9 sposta il pesce dal terreno della sostenibilit\u00e0 a quello della salute pubblica, e chi lavora sulla filiera come te ha in mano entrambe le leve.

La domanda che ti giro: nella vostra comunicazione al consumatore pesa di pi\u00f9 l'argomento nutrizionale o quello ambientale?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 2 P1
add(first="Pietro", last="Gasparri", role="Sustainability & M&A Director",
 company="Unieuro", city="Forl\u00ec",
 linkedin="https://it.linkedin.com/in/pietro-gasparri-7357794/", domain="unieuro.com",
 website="https://www.unieuro.com", priority="P1",
 emails=["pietro.gasparri@unieuro.com", "p.gasparri@unieuro.com", "pietro.gasparri@unieurospa.com"],
 ffcode="ff.32.1",
 focus="sostenibilit\u00e0 nel retail di elettronica di consumo, ciclo di vita dei device e piano ESG Unieuro",
 source_url="https://www.esg360.it/sustainability-management/competenze-sfide-normative-innovazione-sustainability-manager-a-confronto-sulle-prossime-sfide/",
 message="""Ciao Pietro,

tieni insieme sostenibilit\u00e0 e M&A in Unieuro, quindi vedi da vicino una cosa che il retail di elettronica racconta poco: l'impatto di un prodotto si decide molto prima dello scaffale, e si gioca quasi tutto su quanti anni resta acceso.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e consumi. Ti lascio uno spunto in tema:

\u2688 ff.32.1 Quanto inquinano i cellulari? \u2014 l'energia annua per produrre auto, laptop e smartphone nel mondo vale rispettivamente 7, 4,5 e 0,25 exa-Joule. Se per\u00f2 la si spalma sulla vita utile reale, il divario si assottiglia: 0,7 contro 0,45 contro 0,1 EJ/anno. E nell'uso il salto \u00e8 netto: un cellulare consuma 30 MJ in due anni, un'auto 500 GJ in dieci. In un anno per muoverti in macchina bruci 3000 volte l'energia che serve al telefono.

Il numero interessante per un retailer \u00e8 quel rapporto tra produzione e uso: allungare di un anno la vita media di un device sposta pi\u00f9 CO2 di molte campagne green.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 3 P1
add(first="Marco", last="Guazzoni", role="Global Sustainability Director",
 company="Vibram", city="Albizzate (VA)",
 linkedin="https://www.linkedin.com/in/marcoguazzoni/", domain="vibram.com",
 website="https://www.vibram.com", priority="P1",
 emails=["marco.guazzoni@vibram.com", "m.guazzoni@vibram.com"],
 ffcode="ff.47.3",
 focus="materiali, gomma tecnica, certificazione della sostenibilit\u00e0 nella calzatura e chimica di prodotto",
 source_url="https://www.esg360.it/sustainability-management/sostenibilita-come-gestione-strategica-dellinnovazione-dello-sviluppo-e-dei-rischi/",
 message="""Ciao Marco,

in Vibram hai spinto verso un metodo rigoroso per certificare quanto una calzatura sia davvero sostenibile, e la partnership con bluesign sulla gestione chimica va nella stessa direzione. \u00c8 un terreno dove i numeri arrivano molto dopo le dichiarazioni.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e salute. Ti lascio uno spunto che tocca proprio il rilascio di materiale in uso:

\ud83d\udc27 ff.47.3 Lavatrici contro le microplastiche \u2014 ogni anno ne ingeriamo circa 50.000 particelle, ne inaliamo 100.000 e ne beviamo 90.000 solo dalle bottiglie di plastica. La sorpresa \u00e8 la fonte: il 35% delle microplastiche arriva dai bucati in lavatrice, non dai rifiuti degradati all'aperto. Patagonia ha presentato al CES il Less Microfiber Cycle, che taglia del 54% il rilascio, e uno studio mostra che lavare meno, a freddo e in modalit\u00e0 gentile vale da solo il 70% della riduzione.

La cosa che mi resta \u00e8 che l'impatto pi\u00f9 grosso di un materiale tecnico spesso si manifesta nella fase d'uso, dove il produttore ha meno controllo e pi\u00f9 responsabilit\u00e0 informativa.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 4 P1
add(first="Gianluca", last="Randazzo", role="Head of Sustainability",
 company="Banca Mediolanum", city="Basiglio (MI)",
 linkedin="https://www.linkedin.com/in/gianluca-randazzo-9695261/", domain="mediolanum.it",
 website="https://www.bancamediolanum.it", priority="P1",
 emails=["gianluca.randazzo@mediolanum.it", "g.randazzo@mediolanum.it", "gianluca.randazzo@bancamediolanum.it"],
 ffcode="ff.125.2",
 focus="finanza sostenibile, portafogli ESG e due diligence ambientale nel risparmio gestito",
 source_url="https://www.esg360.it/sustainability-management/competenze-sfide-normative-innovazione-sustainability-manager-a-confronto-sulle-prossime-sfide/",
 message="""Ciao Gianluca,

guidi la sostenibilit\u00e0 in Banca Mediolanum, quindi lavori nel punto in cui i criteri ESG smettono di essere una dichiarazione e diventano selezione di titoli, due diligence e rendicontazione verso il risparmiatore.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto che tocca l'infrastruttura del denaro pi\u00f9 che il portafoglio:

\ud83d\udcb5 ff.125.2 Stabilizzare il dollaro \u2014 per comprare un'azione dell'S&P500 negli anni Settanta bastavano 25 ore di lavoro, oggi ne servono 24 giorni. Una delle risposte emerse sono le stablecoin, valute digitali stabilizzate algoritmicamente: in cinque anni hanno superato VISA e Mastercard per volume di transazioni, arrivando a 15.000 miliardi di dollari nel 2024, con diffusione forte nei BRICS e in Arabia Saudita. Stripe ha gi\u00e0 integrato i pagamenti in stablecoin.

Mi interessa il punto di vista di chi fa educazione finanziaria su rete: quando un canale di pagamento cresce cos\u00ec in fretta fuori dal perimetro bancario, la risposta corretta \u00e8 presidiarlo o spiegarlo?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 5 P1
add(first="Federica", last="Manzoni", role="Direttrice Sustainability & Quality Certification",
 company="WINDTRE", city="Rho (MI)",
 linkedin="https://www.linkedin.com/in/fmanzoni/", domain="windtre.it",
 website="https://www.windtre.it", priority="P1",
 emails=["federica.manzoni@windtre.it", "f.manzoni@windtre.it", "federica.manzoni@wind.it"],
 ffcode="ff.26.2",
 focus="sostenibilit\u00e0 telco, divario digitale, progetti NeoConnessi e BorghiConnessi, rating EcoVadis",
 source_url="https://www.esg360.it/sustainability-management/wind-tre-manzoni-sostenibilita-leva-strategica-per-comunita-piu-inclusive-e-digitali/",
 message="""Ciao Federica,

con NeoConnessi e BorghiConnessi avete legato la sostenibilit\u00e0 di WINDTRE al divario digitale invece che alla sola impronta di rete, e il riconoscimento ASviS lo certifica dall'esterno. Resta il lato meno raccontato: ogni servizio digitale che rendiamo accessibile ha comunque un costo energetico.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e societ\u00e0. Ti lascio uno spunto in tema:

0\ufe0f\u20e3 ff.26.2 Siti web a impatto zero (quasi) \u2014 uno studio di design di Amsterdam ha riprogettato il sito Volkswagen togliendo colori, immagini in alta definizione e animazioni, arrivando a 0,02 grammi di CO2 per pagina vista, circa 100 volte sotto la media. Per dare una scala: 100 pagine di YouTube pesano quanto due piatti di riso.

Il numero serve a ricordare che lo scroll ci sembra gratuito perch\u00e9 il costo \u00e8 spalmato su rete e data center, cio\u00e8 su chi la rete la gestisce.

La domanda che ti giro: nei vostri progetti di inclusione digitale il consumo energetico dei servizi entra come vincolo di progetto o come voce di rendicontazione a posteriori?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 6 P1
add(first="Laura", last="Onorati", role="QHSE & Sustainability Manager",
 company="Gewiss", city="Cenate Sotto (BG)",
 linkedin="https://it.linkedin.com/in/laura-onorati-0bb6745", domain="gewiss.com",
 website="https://www.gewiss.com", priority="P1",
 emails=["laura.onorati@gewiss.com", "l.onorati@gewiss.com"],
 ffcode="ff.19.3",
 focus="sicurezza, ambiente ed elettrificazione degli edifici nella componentistica elettrica",
 source_url="https://www.esg360.it/sustainability-management/ruolo-e-sfide-dei-sustainability-manager-in-italia/",
 message="""Ciao Laura,

in Gewiss tieni insieme qualit\u00e0, sicurezza, ambiente e sostenibilit\u00e0 su prodotti che finiscono dentro milioni di edifici. Da bergamasco seguo il gruppo da anni, e mi colpisce che l'elettrificazione domestica venga discussa quasi sempre in termini di bolletta e quasi mai di aria che si respira in casa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e salute. Ti lascio uno spunto in tema:

\u2668\ufe0f ff.19.3 Fornelli assassini \u2014 uno studio di Stanford ha misurato che i fornelli a gas rilasciano metano anche da spenti, circa l'1% di quello che bruciano. Sul totale delle emissioni il peso \u00e8 contenuto, l'equivalente di mezzo milione di auto su 276 milioni circolanti negli Stati Uniti, cio\u00e8 lo 0,2%. Restano per\u00f2 molecole che escono dentro casa, non in autostrada.

\u00c8 un caso in cui il dato macro rassicura e il dato locale no, e sono due conversazioni diverse per chi progetta impianti.

La domanda che ti giro: nel dialogo con installatori e progettisti, l'argomento qualit\u00e0 dell'aria indoor sta iniziando a spostare le scelte, o pesa ancora solo il costo dell'impianto?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 7 P1
add(first="Valeria", last="Brambilla", role="EMEA Audit & Assurance Leader, AD Deloitte & Touche S.p.A.",
 company="Deloitte", city="Milano",
 linkedin="https://www.linkedin.com/in/valeria-brambilla-15a67017/", domain="deloitte.it",
 website="https://www.deloitte.com/it/it.html", priority="P1",
 emails=["vbrambilla@deloitte.it", "valeria.brambilla@deloitte.it", "vbrambilla@deloitte.com"],
 ffcode="ff.16.3",
 focus="audit e assurance, attendibilit\u00e0 della rendicontazione di sostenibilit\u00e0 e contabilit\u00e0 delle emissioni",
 source_url="https://www.impresacity.it/amp/38386/deloitte-emea-al-via-tra-le-nuove-nomine-14-partner-italiani.html",
 message="""Ciao Valeria,

dal primo giugno guidi Audit & Assurance per l'area EMEA di Deloitte, quindi ti trovi a certificare non solo bilanci ma anche numeri di sostenibilit\u00e0, che hanno la brutta abitudine di essere meno verificabili di un flusso di cassa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in tema:

\u26ab ff.16.3 Il mercato (nero) della CO2 \u2014 il prezzo di una tonnellata di CO2 va da 7 dollari in Cina a oltre 150 in Svezia, con l'area europea intorno ai 75. Il problema pi\u00f9 spinoso resta quello delle emissioni evitate: un'azienda pu\u00f2 dichiarare di inquinare meno di quanto potenzialmente potrebbe e ottenere crediti che compensano le emissioni reali. \u00c8 come mangiare un hamburger al giorno sostenendo di aver rinunciato a un volo mensile per New York. McKinsey stima che serva una tassazione di almeno 50 euro a tonnellata per finanziare la transizione.

Il punto vero \u00e8 metodologico: uno scenario controfattuale non si audita come un costo.

La domanda che ti giro: su questo fronte l'assurance sta stringendo davvero, o siamo ancora in fase di negoziazione degli standard?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 8 P1
add(first="Enrica", last="Tomei", role="DE&I e Employer Branding Manager MED Region, esperta di CSR nel turismo",
 company="Accor", city="Milano",
 linkedin="https://www.linkedin.com/in/enrica-tomei/", domain="accor.com",
 website="https://group.accor.com", priority="P1",
 emails=["enrica.tomei@accor.com", "e.tomei@accor.com"],
 ffcode="ff.142.2",
 focus="CSR e responsabilit\u00e0 sociale nell'ospitalit\u00e0, formazione e impatto del turismo sui territori",
 source_url="https://www.esg360.it/sustainability-management/competenze-sfide-normative-innovazione-sustainability-manager-a-confronto-sulle-prossime-sfide/",
 message="""Ciao Enrica,

lavori su persone e responsabilit\u00e0 sociale in Accor per l'area MED, e insegni CSR nel turismo: due mestieri che si incontrano nel punto in cui un soggiorno smette di essere una transazione e diventa un rapporto con un territorio.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, ambiente e cultura. Ti lascio uno spunto che ha a che fare con il senso stesso del viaggiare:

\ud83e\udded ff.142.2 Il viaggio come ricalibrazione \u2014 il viaggio funziona come ricalibrazione cognitiva. Quando l'infrastruttura scompare emergono i presupposti biologici che il comfort occidentale rende invisibili: aria, acqua, sole. Il confronto con l'India ridimensiona la nostra ansia per il Wi-Fi davanti a chi combatte per l'acqua potabile.

L'ho scritto tornando da un viaggio, e mi \u00e8 rimasto attaccato al ruolo che ha l'ospitalit\u00e0: pu\u00f2 azzerare quel confronto oppure renderlo sopportabile senza cancellarlo.

La domanda che ti giro: nella formazione che porti in aula, il tema dell'impatto sulle comunit\u00e0 ospitanti arriva prima o dopo quello ambientale?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 9 P1
add(first="Daniela", last="Leotta", role="Chief Strategy, Sustainability & Communication Director",
 company="E.ON Italia", city="Milano",
 linkedin="https://it.linkedin.com/in/danielaleotta", domain="eon-energia.com",
 website="https://www.eon-energia.com", priority="P1",
 emails=["daniela.leotta@eon-energia.com", "d.leotta@eon-energia.com", "daniela.leotta@eon.com"],
 ffcode="ff.50.4",
 focus="strategia e sostenibilit\u00e0 di un operatore energetico retail, accessibilit\u00e0 dell'energia",
 source_url="https://it.linkedin.com/in/danielaleotta",
 message="""Ciao Daniela,

in E.ON Italia tieni insieme strategia, sostenibilit\u00e0 e comunicazione, quindi ti tocca la parte pi\u00f9 scomoda della transizione: spiegare a milioni di clienti perch\u00e9 l'energia pulita costa quello che costa.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e ambiente. Ti lascio uno spunto in tema:

\ud83c\udf1f ff.50.4 Consumisti ma non di energia \u2014 il consumo pro capite di energia \u00e8 sostanzialmente fermo, e le spiegazioni plausibili sono quattro: dematerializzazione e digitalizzazione, maggiori efficienze, remote working e il prezzo. Le prime tre raccontano un uso pi\u00f9 intelligente, la quarta \u00e8 un collo di bottiglia vero. Dopo le vicende ucraine, benzina e bollette hanno cambiato le abitudini degli italiani pi\u00f9 di qualsiasi campagna di sensibilizzazione. L'energia non \u00e8 ancora accessibile come lo sono diventati potenza di calcolo e gigabyte di connessione.

Quel paragone mi sembra il punto: nel digitale il prezzo \u00e8 crollato e i comportamenti sono esplosi, nell'energia il prezzo comanda ancora la domanda.

La domanda che ti giro: nel vostro rapporto con i clienti la leva che sposta davvero i consumi \u00e8 tariffaria o informativa?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 10 P1
add(first="Alice", last="Guerini", role="Head of AI Factory",
 company="A2A Life Ventures", city="Milano",
 linkedin="https://it.linkedin.com/in/alice-guerini-97991371", domain="a2a.eu",
 website="https://www.a2a.eu", priority="P1",
 emails=["alice.guerini@a2a.eu", "a.guerini@a2a.eu"],
 ffcode="ff.2.1",
 focus="AI applicata a utility, R&D e innovazione come centro di ricavo in un gruppo energetico",
 source_url="https://www.esg360.it/case-history-esg/innovazione-sostenibile-la-strategia-per-trasformare-il-business-tra-economia-circolare-e-digitale/",
 message="""Ciao Alice,

guidi l'AI Factory dentro A2A Life Ventures, cio\u00e8 metti modelli al servizio di un gruppo che produce e distribuisce l'energia con cui quei modelli girano. Pochi ruoli in Italia hanno entrambe le facce del problema sulla stessa scrivania.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e ambiente. Ti lascio uno spunto in tema:

\ud83c\udfd9\ufe0f ff.2.1 Un modello grande come New York \u2014 addestrare l'intelligenza artificiale richiede sempre pi\u00f9 energia, per la crescita esponenziale del numero di parametri. Sul benchmark di riconoscimento oggetti ImageNet, nel 2020 il miglior sistema stava sotto il 10% di errore; per scendere sotto il 5% si stimava che il training avrebbe inquinato quanto New York in un mese.

Il dato \u00e8 di qualche anno fa e i modelli sono cresciuti di ordini di grandezza, il che rende la curva ancora pi\u00f9 interessante: ogni punto di accuratezza in pi\u00f9 costa moltissimo in energia, e voi quell'energia la vendete.

La domanda che ti giro: nei vostri casi d'uso il vincolo che decide se un modello va in produzione \u00e8 la qualit\u00e0 del dato o il costo di inferenza?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 11 P2
add(first="Concetta", last="Testa", role="Head of Sustainability",
 company="CDP - Cassa Depositi e Prestiti", city="Roma",
 linkedin="https://www.linkedin.com/in/concetta-testa/", domain="cdp.it",
 website="https://www.cdp.it", priority="P2",
 emails=["concetta.testa@cdp.it", "c.testa@cdp.it"],
 ffcode="ff.16.1",
 focus="finanza sostenibile pubblica, misurazione dell'impatto e supporto a imprese e PA nella transizione",
 source_url="https://agenparl.eu/2026/05/06/festival-dello-sviluppo-sostenibile-testa-cdp-orienta-la-propria-azione-allimpatto-facendo-della-finanza-sostenibile-una-leva-chiave-per-supportare-imprese-e-pa/",
 message="""Ciao Concetta,

al Festival dello Sviluppo Sostenibile hai detto che CDP orienta la propria azione all'impatto, sia in raccolta sia in impiego. \u00c8 una posizione che obbliga a mettere un numero accanto a ogni euro, e quel numero \u00e8 la parte difficile.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in tema:

\ud83d\udcb0 ff.16.1 Tanti trilioni di dollari \u2014 McKinsey stima che per centrare gli obiettivi di COP26 servano 9.000 miliardi di dollari all'anno di investimenti, circa un decimo del PIL globale e dieci volte quanto raccolto nel 2021. Il green premium, cio\u00e8 il costo aggiuntivo per compensare la CO2 prodotta, resta concentrato dove pesa di pi\u00f9: al 2030 vale il 50% per il cemento e il 25% per l'acciaio, due materiali che da soli valgono il 10% delle emissioni globali.

Il dettaglio interessante per un investitore istituzionale \u00e8 che il premio non si distribuisce in modo uniforme: si concentra su pochi settori hard to abate, dove il capitale paziente conta pi\u00f9 dell'incentivo.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 12 P2
add(first="Elena", last="Dimichino", role="Chief Corporate Sustainability Officer",
 company="EssilorLuxottica", city="Milano",
 linkedin="https://it.linkedin.com/in/elena-dimichino-3b13b35", domain="essilorluxottica.com",
 website="https://www.essilorluxottica.com", priority="P2",
 emails=["elena.dimichino@essilorluxottica.com", "edimichino@essilorluxottica.com", "elena.dimichino@luxottica.com"],
 ffcode="ff.22.1",
 focus="sostenibilit\u00e0 corporate, riconversione di siti industriali e salute visiva come missione di prodotto",
 source_url="https://www.esg360.it/case-history-esg/innovazione-sostenibile-la-strategia-per-trasformare-il-business-tra-economia-circolare-e-digitale/",
 message="""Ciao Elena,

in EssilorLuxottica la sostenibilit\u00e0 passa da progetti molto concreti, come la riconversione dei 40 ettari industriali a Castel Sant'Angelo con il parco fotovoltaico che alimenta la produzione di lenti. Nel frattempo il vostro prodotto governa una variabile che quasi nessuno considera ambientale: quanta luce, e di che tipo, arriva ai nostri occhi.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, salute e ambiente. Ti lascio uno spunto in tema:

\ud83d\udd50 ff.22.1 Dieta circadiana? \u2014 il corpo fa partire la giornata dall'esposizione a luce intensa esterna, e passando gran parte del tempo in edifici quella esposizione mattutina spesso manca del tutto. All'estremo opposto, luce e schermi in ambienti chiusi fino a tarda sera ritardano la fine metabolica della giornata. Satchin Panda suggerisce di comprimere entro 10-12 ore la finestra in cui si mangia, perch\u00e9 anche una birra riattiva l'intero processo digestivo.

Il ragionamento mi interessa perch\u00e9 mette la luce tra i determinanti della salute, e quindi mette le lenti tra gli strumenti di salute pubblica.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 13 P2
add(first="Nico", last="Losito", role="General Manager",
 company="IBM Italia", city="Roma",
 linkedin="https://it.linkedin.com/in/nicolosito", domain="ibm.com",
 website="https://www.ibm.com/it-it", priority="P2",
 emails=["nico.losito@ibm.com", "nlosito@it.ibm.com", "nico.losito@it.ibm.com"],
 ffcode="ff.98.4",
 focus="hybrid cloud, intelligenza artificiale e quantum computing sul mercato italiano",
 source_url="https://www.01net.it/ibm-italia-cambio-vertici-nico-losito-alessandro-la-volpe/",
 message="""Ciao Nico,

da aprile guidi IBM Italia, e ti ritrovi in mano due scommesse che il mercato tende a confondere: il cloud ibrido, che genera fatturato oggi, e il quantum, che genera aspettative. La seconda ha appena preso una piega interessante.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, scienza e ambiente. Ti lascio uno spunto in tema:

\u269b\ufe0f ff.98.4 Sistemi quantistici \u2014 i computer quantistici restano fondamentali per simulare superconduttori, farmaci e nanotecnologie, ma la tecnologia soffre ancora troppi errori di calcolo per fenomeni come il decoupling quantistico. Nel frattempo AlphaFold3 di Google DeepMind ha imparato la fisica quantistica dall'esperienza: partendo da un file di testo con la lista degli atomi, simula struttura 3D e interazioni chimiche tra DNA, RNA e piccole molecole, dove prima gestiva soltanto proteine.

La domanda che ne esce vale parecchio per chi vende infrastruttura: quanta parte dei problemi che aspettavamo dal quantum verr\u00e0 rosicchiata prima da modelli statistici addestrati bene?

Curioso di sapere come la vedi dalla tua posizione.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 14 P2
add(first="Raffaella", last="Santoro", role="Managing Director Capgemini Invent Italia",
 company="Capgemini Invent", city="Milano",
 linkedin="https://it.linkedin.com/in/raffaellasantoro", domain="capgemini.com",
 website="https://www.capgemini.com/it-it/", priority="P2",
 emails=["raffaella.santoro@capgemini.com", "r.santoro@capgemini.com"],
 ffcode="ff.55.2",
 focus="digital transformation end-to-end, strategia, data e design per grandi clienti italiani",
 source_url="https://www.capgemini.com/news/press-releases/capgemini-strengthens-its-strategy-innovation-and-transformation-capabilities-in-italy-with-the-launch-of-capgemini-invent/",
 message="""Ciao Raffaella,

guidi Capgemini Invent in Italia con team che mettono insieme strategia, data science e design, cio\u00e8 esattamente il mestiere di decidere quale materia prima di un'azienda vale la pena estrarre.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e societ\u00e0. Ti lascio uno spunto in tema:

\ud83c\udf3e ff.55.2 Campi da arare (e dati da reclamare) \u2014 Sam Korus di Ark Invest, citando Carlota Perez e il suo Technological Revolutions and Financial Capital, ricorda che ogni rivoluzione tecnologica valorizza un input nuovo: ferro, vapore, acciaio, petrolio, microelettronica. La sequenza continua in modo abbastanza brutale: agricoltura porta a possedimenti terrieri e propriet\u00e0 privata, macchina a vapore a mezzi di produzione e industrie, web e programmazione a potenza di calcolo, algoritmi neuromorfici a possesso dei dati. La questione della propriet\u00e0 si \u00e8 riaperta con la generative AI, tanto che sono nati servizi come StableAttribution per risalire alle immagini che hanno ispirato un output.

Mi interessa il passaggio da input a diritto di propriet\u00e0: \u00e8 l\u00ec che le trasformazioni digitali diventano questioni di governance.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 15 P2
add(first="Antonella", last="Aureli", role="Senior Managing Director, Strategy & Consulting Lead Italia, Europa Centrale e Grecia",
 company="Accenture", city="Milano",
 linkedin="https://www.linkedin.com/in/antonellaaureli/", domain="accenture.com",
 website="https://www.accenture.com/it-it", priority="P2",
 emails=["antonella.aureli@accenture.com", "a.aureli@accenture.com"],
 ffcode="ff.9.2",
 focus="strategia e consulenza, impatto dell'automazione sui modelli operativi e sulle competenze",
 source_url="https://www.industriaitaliana.it/accenture-italia-antonella-aureli-andrea-ruzzi-anna-bianchi-nominati-manager/",
 message="""Ciao Antonella,

guidi Strategy & Consulting per Italia, Europa Centrale e Grecia, quindi vendi ai clienti la trasformazione che nel frattempo attraversa anche il tuo mestiere. \u00c8 una posizione scomoda e interessante allo stesso tempo.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, lavoro ed economia. Ti lascio uno spunto in tema:

\ud83d\udcb1 ff.9.2 I robot ci ruberanno il lavoro? \u2014 in The Rise of the Robots Martin Ford sosteneva gi\u00e0 nel 2015 che dopo il lavoro fisico sarebbero toccati i lavori alti: medici, ingegneri, traduttori, avvocati. Il corollario \u00e8 la concentrazione del valore, con aziende che fanno leva su strumenti digitali pi\u00f9 che su persone. YouTube aveva 65 dipendenti l'anno in cui \u00e8 stata venduta per 2 miliardi. Amazon impiega 350.000 robot; negli ultimi cinque anni i dipendenti umani sono cresciuti di 5,6 volte, i robot di 7,7.

Quel differenziale tra 5,6 e 7,7 mi sembra la metrica giusta: racconta una sostituzione parziale che si vede solo sui tassi di crescita, non sui livelli.

La domanda che ti giro: nei progetti che segui, la produttivit\u00e0 guadagnata con l'AI si traduce in pi\u00f9 lavoro venduto o in meno ore fatturate?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 16 P2
add(first="Enrico Maria", last="Curti", role="Partner, Head of Power & Utilities",
 company="DWF Italy", city="Milano",
 linkedin="https://it.linkedin.com/in/enrico-maria-curti-9b116847", domain="dwf.law",
 website="https://dwfgroup.com/it-it", priority="P2",
 emails=["enrico.curti@dwf.law", "enricomaria.curti@dwf.law", "e.curti@dwf.law"],
 ffcode="ff.46.3",
 focus="regolazione e operazioni straordinarie nel settore energia, permitting e Golden Power",
 source_url="https://forbes.it/2026/06/11/forbes-energy-day-innovazione-e-transizione-energetica",
 message="""Ciao Enrico,

guidi Power & Utilities in DWF e lavori sugli aspetti regolatori, amministrativi e Golden Power delle operazioni energetiche. Sei quindi tra i pochi che vedono, pratica dopo pratica, quanto tempo di transizione si perde nei procedimenti invece che nella tecnologia.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e ambiente. Ti lascio uno spunto in tema:

\ud83d\ude2d ff.46.3 Anni buttati \u2014 se il nucleare avesse sostituito carbone e gas mantenendo l'accelerazione del 1960-1976, avremmo evitato 9,5 milioni di morti e 174 gigatonnellate di CO2. Le resistenze socio-regolamentari hanno prodotto un ritardo che pesa ancora sulla ricerca. Storrs Hall, in Where is my flying car?, aggiunge un dato che d\u00e0 la misura del potenziale non sfruttato: l'uranio disciolto negli oceani basterebbe a fornire 10 kW a testa a 10 miliardi di persone per 10.000 anni, e la tecnologia \u00e8 vicina a estrarlo in modo economico.

Il punto \u00e8 che il fattore limitante \u00e8 stato per decenni normativo e reputazionale, cio\u00e8 il tuo campo.

La domanda che ti giro: sul nuovo nucleare italiano vedi un quadro autorizzativo credibile o un altro ciclo di annunci?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 17 P2
add(first="Matteo", last="Tanteri", role="Director Sustainability & Social Impact",
 company="Snam", city="San Donato Milanese (MI)",
 linkedin="https://www.linkedin.com/in/matteo-tanteri-ab56263/", domain="snam.it",
 website="https://www.snam.it", priority="P2",
 emails=["matteo.tanteri@snam.it", "m.tanteri@snam.it"],
 ffcode="ff.24.4",
 focus="strategia ESG di un operatore infrastrutturale del gas, biodiversit\u00e0 e coinvolgimento della filiera",
 source_url="https://esgnews.it/focus/interviste/tanteri-snam-obiettivo-net-zero-al-2050-massima-attenzione-a-natura-e-biodiversita/",
 message="""Ciao Matteo,

guidi sostenibilit\u00e0 e impatto sociale in Snam con un obiettivo net zero al 2050 e molta attenzione a cantieri e biodiversit\u00e0. Arrivando da sviluppo e strategia, immagino tu guardi anche a un tema poco elegante ma molto concreto: che fine fa il gas che non entra in rete.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e ambiente. Ti lascio uno spunto in tema:

\ud83d\udca6 ff.24.4 Minare con gas \u2014 Exxon Mobil ha annunciato di usare per minare bitcoin l'energia prodotta da gas estratto in eccesso, quello che oggi viene comunque bruciato in torcia perch\u00e9 non riesce a entrare nei canali di distribuzione. Rilasciato in atmosfera inquinerebbe pi\u00f9 che nella forma bruciata, quindi il calcolo cambia segno. Nello stesso pezzo mettevo a confronto le emissioni del network Bitcoin, stimato con una potenza di calcolo 500.000 volte superiore al pi\u00f9 grande supercomputer al mondo, con quelle dell'industria dell'oro, dei data center e del trasporto marittimo e aereo.

Il ragionamento generale mi sembra riusabile: valorizzare energia altrimenti persa \u00e8 spesso pi\u00f9 efficace che ottimizzare quella gi\u00e0 in rete.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 18 P2
add(first="Luigi", last="Sampaolo", role="Head of Sustainability Positioning and Stakeholder Engagement",
 company="Eni", city="Roma",
 linkedin="https://www.linkedin.com/in/luigi-sampaolo-4235751b/", domain="eni.com",
 website="https://www.eni.com", priority="P2",
 emails=["luigi.sampaolo@eni.com", "l.sampaolo@eni.com"],
 ffcode="ff.42.1",
 focus="posizionamento sulla sostenibilit\u00e0, just transition e dialogo con gli stakeholder",
 source_url="https://www.recnews.it/2026/06/09/energia-sampaolo-eni-sostenibilita-integrata-nel-business/",
 message="""Ciao Luigi,

a giugno, durante Eni for a Just Transition, hai insistito sulla sostenibilit\u00e0 integrata nel business. Il punto pi\u00f9 duro di quella posizione \u00e8 tenere insieme sostenibilit\u00e0 ambientale, sicurezza degli approvvigionamenti e accessibilit\u00e0, cio\u00e8 tre obiettivi che raramente si muovono nella stessa direzione.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, energia e geopolitica. Ti lascio uno spunto in tema:

\u26cf\ufe0f ff.42.1 Minerali preziosi? \u2014 la Cina controlla circa l'80% della produzione di pannelli solari e dell'estrazione e raffinazione del litio. Il dettaglio meno noto \u00e8 che quel primato dipende poco dalla capacit\u00e0 mineraria e molto dai passaggi a valle: l'80% della raffinazione chimica e il 73% della costruzione finale delle celle al litio. Nelle batterie il mercato lo dicono CATL al 35%, LG al 14,4% e BYD all'11,8%.

Tradotto: la dipendenza si annida nella trasformazione, non nel giacimento. \u00c8 una lezione che il settore oil & gas conosce bene, applicata a materiali nuovi.

La domanda che ti giro: nel dialogo con gli stakeholder questo argomento aiuta o viene letto come giustificazione del fossile?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 19 P2
add(first="Emanuele", last="Domingo", role="Senior Sustainability Manager",
 company="Boehringer Ingelheim Italia", city="Milano",
 linkedin="https://www.linkedin.com/in/emanueledomingo/", domain="boehringer-ingelheim.com",
 website="https://www.boehringer-ingelheim.com/it", priority="P2",
 emails=["emanuele.domingo@boehringer-ingelheim.com", "e.domingo@boehringer-ingelheim.com"],
 ffcode="ff.115.3",
 focus="ESG nel farmaceutico, integrazione tra sostenibilit\u00e0 e innovazione di ricerca",
 source_url="https://www.esg360.it/sustainability-management/ruolo-e-sfide-dei-sustainability-manager-in-italia/",
 message="""Ciao Emanuele,

in Boehringer Ingelheim Italia lavori su ESG dentro un'azienda di ricerca, e vieni da un percorso industriale che passa da Saipem e dal decommissioning. \u00c8 una combinazione rara: sai quanto costa smontare le cose, oltre che costruirle.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, salute e ambiente. Ti lascio uno spunto in tema:

\ud83d\udc0d ff.115.3 Veleni esponenziali \u2014 ProteinMNPP \u00e8 una specie di ChatGPT addestrato su strutture proteiche invece che su testo, e uno studio su Nature mostra come trovi un antidoto per il veleno dei serpenti in secondi anzich\u00e9 mesi. Da l\u00ec parte una riflessione sulla nostra miopia davanti agli esponenziali, con l'illustrazione di Tim Urban che gi\u00e0 nel 2015 raccontava la rivoluzione dell'intelligenza artificiale.

Quello che mi colpisce, guardandolo dal lato pharma, \u00e8 il cambio di scala temporale: quando una fase di ricerca passa da mesi a secondi, a spostarsi non \u00e8 solo il costo, ma il modo in cui si decide quali progetti valga la pena aprire.

La domanda che ti giro: nella vostra rendicontazione ESG l'accelerazione della ricerca entra come impatto sociale misurabile?

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- 20 P2
add(first="Veronica", last="Bovo", role="Chief Sustainability Officer",
 company="HIND - Holding Industriale", city="Torino",
 linkedin="https://it.linkedin.com/in/veronica-bovo-4115005", domain="hind.it",
 website="https://www.hind.it", priority="P2",
 emails=["veronica.bovo@hind.it", "v.bovo@hind.it"],
 ffcode="ff.11.5",
 focus="sostenibilit\u00e0 di gruppo su un portafoglio di PMI industriali in crescita e internazionalizzazione",
 source_url="https://www.esg360.it/sustainability-management/competenze-sfide-normative-innovazione-sustainability-manager-a-confronto-sulle-prossime-sfide/",
 message="""Ciao Veronica,

fai la Chief Sustainability Officer di una holding che investe in PMI industriali, quindi il tuo problema quotidiano \u00e8 rendere confrontabili aziende con materie prime, mercati e maturit\u00e0 completamente diversi. \u00c8 un lavoro molto pi\u00f9 duro che gestire il perimetro di una singola fabbrica.

Scrivo futuro fortissimo, newsletter italiana su tecnologia, economia e ambiente. Ti lascio uno spunto in tema:

\ud83d\udd1a ff.11.5 Finire le risorse \u2014 Naval Ravikant ribalta il tema della finitudine delle risorse con un argomento semplice: per un cavernicolo il carbone e il ferro non erano risorse. Le risorse esistono nel momento in cui sappiamo sfruttarle. Oggi non sappiamo usare l'elio per la fusione nucleare, ma ce n'\u00e8 in abbondanza. Nella citazione originale mette anche in discussione il confine stesso del ragionamento: perch\u00e9 disegnarlo intorno alla Terra e non intorno alla propria citt\u00e0, o al sistema solare?

Non lo prendo come invito all'ottimismo facile. Lo leggo come una domanda utile in sede di investimento: quale vincolo \u00e8 fisico e quale dipende solo dalla tecnologia che oggi non abbiamo.

Spunto completo: {url}

""" + CTA + """

Michele""")

# ---------------------------------------------------------------- build
assert len(R) == 20, len(R)
codes = [r["ffcode"] for r in R]
assert len(set(codes)) == 20, "ff codes non distinti"
names = [r["first"] + " " + r["last"] for r in R]
assert len(set(names)) == 20

def fixsur(s):
    """Ricompone le coppie surrogate scritte come \\uD83D\\uDE00 in emoji valide."""
    return s.encode("utf-16", "surrogatepass").decode("utf-16")

for i, r in enumerate(R):
    r["id"] = START_ID + i
    r["message"] = fixsur(r["message"].replace("{url}", r["ff_url"]))
    r["subject"] = "Spunto %s per %s" % (r["ffcode"], r["first"])
    r["words"] = len(r["message"].split())

print("word counts:", [r["words"] for r in R])
print("min/max:", min(r["words"] for r in R), max(r["words"] for r in R))

# ---- CSV
csv_path = "%s/batch%d_%s.csv" % (OUTDIR, BATCH, DATE)
cols = ["first_name", "last_name", "role", "company", "city_or_region", "linkedin_url",
        "email_public", "email_best", "guessed_emails", "website", "focus_theme", "why_match",
        "source_urls", "excerpt_text", "excerpt_id", "template_id", "template_subject",
        "priority", "status", "owner", "next_action"]
with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(cols)
    for r in R:
        w.writerow([r["first"], r["last"], r["role"], r["company"], r["city"], r["linkedin"],
                    "", r["emails"][0], " | ".join(r["emails"]), r["website"], r["focus"],
                    "spunto %s (%s) collegato a %s" % (r["ffcode"], r["ff_title"].split(" ", 1)[-1], r["focus"]),
                    r["source_url"], FF[r["ffcode"]]["content"][:260].replace("\n", " "),
                    r["ffcode"], "V3", r["subject"], r["priority"], "queued",
                    "micmer.clawdbot", "create_gmail_draft_manual"])
print("CSV:", csv_path)

# ---- MD
md_path = "%s/batch%d_%s.md" % (OUTDIR, BATCH, DATE)
with open(md_path, "w", encoding="utf-8") as f:
    f.write("# FF outreach \u2014 batch %d (%s)\n\n" % (BATCH, DATE))
    f.write("20 lead nuovi \u2014 tech, consulenza, energia, sostenibilit\u00e0, ESG, digital transformation.\n")
    f.write("Template V3. Stato: **drafted**, invio NON autorizzato (serve GO di Michele).\n\n---\n\n")
    for r in R:
        f.write("## %d. %s %s \u2014 %s, %s [%s]\n\n" % (r["id"], r["first"], r["last"], r["role"], r["company"], r["priority"]))
        f.write("- LinkedIn: %s\n- Email (guess): %s\n- Spunto: **%s** \u2014 %s\n- Fonte ruolo: %s\n- Subject: **%s** (%d parole)\n\n" % (
            r["linkedin"], ", ".join(r["emails"]), r["ffcode"], r["ff_url"], r["source_url"], r["subject"], r["words"]))
        f.write("```\n" + r["message"] + "\n```\n\n---\n\n")
print("MD:", md_path)

# ---- TRACKER MERGE
shutil.copyfile(TRACKER, BACKUP)
T = json.load(open(TRACKER, encoding="utf-8"))
before_contacts = len(T["contacts"])
before_meta = dict(T["meta"])
before_top = T.get("total_drafted")
existing_ids = set(x["id"] for x in T["contacts"])

for r in R:
    assert r["id"] not in existing_ids, "id gi\u00e0 presente: %d" % r["id"]
    T["contacts"].append({
        "id": r["id"], "name": r["first"] + " " + r["last"], "role": r["role"], "org": r["company"],
        "channel": "email", "ff_post": r["ffcode"], "ff_post_title": r["ff_title"], "ff_post_url": r["ff_url"],
        "subject": r["subject"], "message": r["message"], "emails_guessed": r["emails"],
        "words": r["words"], "status": "drafted", "date": DATE, "batch": BATCH,
        "send_authorized": False, "source": r["source_url"],
    })

T["meta"]["last_batch"] = BATCH
T["meta"]["last_batch_date"] = DATE
T["meta"]["updated"] = DATE
T["meta"]["total_drafted"] = before_meta["total_drafted"] + 20
T["total_drafted"] = (before_top or 0) + 20
json.dump(T, open(TRACKER, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

print("TRACKER contacts before/after: %d -> %d" % (before_contacts, len(T["contacts"])))
print("meta.total_drafted before/after: %d -> %d" % (before_meta["total_drafted"], T["meta"]["total_drafted"]))
print("top-level total_drafted before/after: %s -> %s" % (before_top, T["total_drafted"]))
print("BACKUP:", BACKUP)
