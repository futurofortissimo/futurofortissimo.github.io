#!/usr/bin/env node
/**
 * Build the canonical ff.N -> Substack URL map from sitemap data.
 * Outputs canonical_substack_map.json
 */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// All URLs from sitemap.xml (fetched 2026-04-02)
const sitemapUrls = [
  "https://fortissimo.substack.com/p/ff147-grazie-per-tutto-il-pesce",
  "https://fortissimo.substack.com/p/ff146-cicatrici-silenziose",
  "https://fortissimo.substack.com/p/ff145-zucchero-ossa-e-creme-brulee",
  "https://fortissimo.substack.com/p/ff144-il-fischio-dellaragosta",
  "https://fortissimo.substack.com/p/ff143-scimmie-col-rolex",
  "https://fortissimo.substack.com/p/ff142-caro-marziano",
  "https://fortissimo.substack.com/p/ff141-il-2025-su-un-floppy-disk",
  "https://fortissimo.substack.com/p/ff140-tutti-app-fluencers",
  "https://fortissimo.substack.com/p/ff139-e-stato-lai",
  "https://fortissimo.substack.com/p/ff138-biofilia-portami-via",
  "https://fortissimo.substack.com/p/ff137-decrescita-felice",
  "https://fortissimo.substack.com/p/ff136-on-da-e-ner-ge-ti-caaa",
  "https://fortissimo.substack.com/p/ff135-casino-royale",
  "https://fortissimo.substack.com/p/ff134-nomi-alle-cose",
  "https://fortissimo.substack.com/p/ff133-sono-un-ironman",
  "https://fortissimo.substack.com/p/ff132-inno-ai-videogiochi",
  "https://fortissimo.substack.com/p/ff131-lestate-sta-iniziando",
  "https://fortissimo.substack.com/p/ff130-microplastiche",
  "https://fortissimo.substack.com/p/ff129-il-valzer-di-tesla",
  "https://fortissimo.substack.com/p/ff126-e-tutta-questione-di-testa",
  "https://fortissimo.substack.com/p/ff127-jazz-con-chatgpt",
  "https://fortissimo.substack.com/p/ff126-google-fine-o-rinascita",
  "https://fortissimo.substack.com/p/ff125-usa-crollo-di-un-impero",
  "https://fortissimo.substack.com/p/ff124-ah-ia",
  "https://fortissimo.substack.com/p/ff123-a-caccia-di-diamanti",
  "https://fortissimo.substack.com/p/ff122-naturale-e-meglio",
  "https://fortissimo.substack.com/p/ff121-il-flow-ti-mette-le-ali",
  "https://fortissimo.substack.com/p/ff120-sport-e-longevita",
  "https://fortissimo.substack.com/p/ff119-mani-ovunque",
  "https://fortissimo.substack.com/p/ff118-paprika-e-massaggi",
  "https://fortissimo.substack.com/p/ff117-viviamo-in-una-simulazione",
  "https://fortissimo.substack.com/p/ff116-lanno-del-serpente-2",
  "https://fortissimo.substack.com/p/ff115-lanno-del-serpente-1",
  "https://fortissimo.substack.com/p/ff114-mater-ia",
  "https://fortissimo.substack.com/p/ff113-fame-chimica",
  "https://fortissimo.substack.com/p/ff112-acqua-imprevedibile",
  "https://fortissimo.substack.com/p/ff111-morire-con-zero",
  "https://fortissimo.substack.com/p/ff110-uno-stato-da-mantenere",
  "https://fortissimo.substack.com/p/ff109-medico-in-famigl-ia",
  "https://fortissimo.substack.com/p/ff108-inno-alla-routine",
  "https://fortissimo.substack.com/p/ff107-glp-1-la-cura-allobesita",
  "https://fortissimo.substack.com/p/ff106-ai-lloween",
  "https://fortissimo.substack.com/p/ff105-elettricita-e-vita",
  "https://fortissimo.substack.com/p/ff104-hackerare-il-corpo",
  "https://fortissimo.substack.com/p/ff103-fuoco-ferro-intelligenza",
  "https://fortissimo.substack.com/p/ff102-il-futuro-in-una-conchiglia",
  "https://fortissimo.substack.com/p/ff101-cosa-ci-rende-umani",
  "https://fortissimo.substack.com/p/ff99-cibi-per-non-invecchiare",
  "https://fortissimo.substack.com/p/ff98-giochi-e-simulazioni",
  "https://fortissimo.substack.com/p/ff97-tocchiamoci-di-piu",
  "https://fortissimo.substack.com/p/ff96-2024-al-giro-di-boa",
  "https://fortissimo.substack.com/p/ff95-farmville-e-web3",
  "https://fortissimo.substack.com/p/ff94-il-grasso-fa-male",
  "https://fortissimo.substack.com/p/ff93-tesla-la-fine-o-linizio",
  "https://fortissimo.substack.com/p/ff92-la-dieta-dei-centenari",
  "https://fortissimo.substack.com/p/ff90-il-sale-della-terra",
  "https://fortissimo.substack.com/p/ff91-lepidemia-di-stress",
  "https://fortissimo.substack.com/p/ff89-meno-tinder-piu-relazioni",
  "https://fortissimo.substack.com/p/ff88-singolarita-nel-2029",
  "https://fortissimo.substack.com/p/ff87-siamo-quello-che-respiriamo",
  "https://fortissimo.substack.com/p/ff85-bruciare-ossigeno-e-vita",
  "https://fortissimo.substack.com/p/ff85-mangiare-carbonara-nel-metaverso",
  "https://fortissimo.substack.com/p/ff84-ces-fiera-dellartigianato-tech",
  "https://fortissimo.substack.com/p/ff83-imparare-da-chatgpt",
  "https://fortissimo.substack.com/p/ff81-guerra-a-colpi-di-chip",
  "https://fortissimo.substack.com/p/ff81-il-2024-nei-libri-di-storia",
  "https://fortissimo.substack.com/p/ff80-il-meglio-di-ff2023",
  "https://fortissimo.substack.com/p/ff79-natale-spacchettato",
  "https://fortissimo.substack.com/p/ff78-psicologo-digitale",
  "https://fortissimo.substack.com/p/ff77-famiglia-cercasi",
  "https://fortissimo.substack.com/p/ff76-quello-che-resta-del-lockdown",
  "https://fortissimo.substack.com/p/ff75-massaggi-al-cervello",
  "https://fortissimo.substack.com/p/ff74-made-in-japan",
  "https://fortissimo.substack.com/p/ff72-criptico",
  "https://fortissimo.substack.com/p/ff71-giochiamo-a-uno",
  "https://fortissimo.substack.com/p/ff71-chatgpt-ti-vede",
  "https://fortissimo.substack.com/p/ff70-il-sole-soluzione-o-morte",
  "https://fortissimo.substack.com/p/ff69-quantico",
  "https://fortissimo.substack.com/p/ff68-che-ansia-pt-2",
  "https://fortissimo.substack.com/p/ff67-lestate-sta-iniziando",
  "https://fortissimo.substack.com/p/ff66-una-cura-a-tutto",
  "https://fortissimo.substack.com/p/ff65-come-fermare-il-tempo",
  "https://fortissimo.substack.com/p/ff64-metafisica-del-metaverso",
  "https://fortissimo.substack.com/p/ff63-che-cinema",
  "https://fortissimo.substack.com/p/ff61-come-evitare-il-burnout",
  "https://fortissimo.substack.com/p/ff61-la-decrescita-felice-e-impossibile",
  "https://fortissimo.substack.com/p/ff60-la-guida-autonoma-e-qui",
  "https://fortissimo.substack.com/p/ff59-lottimismo-vola",
  "https://fortissimo.substack.com/p/ff58-le-banane-inquinano-troppo",
  "https://fortissimo.substack.com/p/ff56-il-medico-mi-ha-prescritto-una",
  "https://fortissimo.substack.com/p/ff54-il-condizionatore-terrestre",
  "https://fortissimo.substack.com/p/ff54-come-capire-una-rivoluzione",
  "https://fortissimo.substack.com/p/ff54-sono-stato-lasciato-da-gpt-4",
  "https://fortissimo.substack.com/p/ff53-la-cura-ai-tumori",
  "https://fortissimo.substack.com/p/ff52-fondare-una-nazione-in-garage",
  "https://fortissimo.substack.com/p/ff51-la-religione-del-21esimo-secolo",
  "https://fortissimo.substack.com/p/ff50-cosa-c-e-successo-nel-1971",
  "https://fortissimo.substack.com/p/ff49-la-pandemia-del-21esimo-secolo",
  "https://fortissimo.substack.com/p/ff48-resuscitare-aristotele",
  "https://fortissimo.substack.com/p/ff47-la-fiera-dellartigianato-del",
  "https://fortissimo.substack.com/p/ff46-elementale-watson",
  "https://fortissimo.substack.com/p/ff42-che-ansia-pt-1",
  "https://fortissimo.substack.com/p/ff43-settimana-bianca-e-natale",
  "https://fortissimo.substack.com/p/ff41-made-in-china-pt1",
  "https://fortissimo.substack.com/p/ff41-non-ho-parole",
  "https://fortissimo.substack.com/p/ff40-5-applicazioni-dellai",
  "https://fortissimo.substack.com/p/ff39-come-ti-vesti",
  "https://fortissimo.substack.com/p/ff38-soldi-spartiti-male",
  "https://fortissimo.substack.com/p/ff37-i-robot-sono-qui",
  "https://fortissimo.substack.com/p/ff36-la-singolarita-e-vicina",
  "https://fortissimo.substack.com/p/ff35-siamo-supersapiens",
  "https://fortissimo.substack.com/p/ff34-ripensare-le-citta",
  "https://fortissimo.substack.com/p/-ff33-le-piante-ci-salveranno",
  "https://fortissimo.substack.com/p/-ff32-i-numeri-non-mentono",
  "https://fortissimo.substack.com/p/-ff31-lestate-sta-iniziando",
  "https://fortissimo.substack.com/p/-ff30-dall-e-genera-arte",
  "https://fortissimo.substack.com/p/-ff28-viva-la-mamma",
  "https://fortissimo.substack.com/p/-ff24-google-ricerca-il-nostro-benessere",
  "https://fortissimo.substack.com/p/-ff27-un-milione-di-morti-covid-us",
  "https://fortissimo.substack.com/p/-ff26-2022-trend-e-promesse",
  "https://fortissimo.substack.com/p/-ff25-la-fattoria-degli-animali",
  "https://fortissimo.substack.com/p/-ff26-guerra-criptica",
  "https://fortissimo.substack.com/p/-ff21-matrimoni-privatizzati",
  "https://fortissimo.substack.com/p/-ff22-mangiamo-troppo",
  "https://fortissimo.substack.com/p/-ff23-la-magia-dellinsalata-a-domicilio",
  "https://fortissimo.substack.com/p/-ff20-greta-in-bici",
  "https://fortissimo.substack.com/p/ff17-lhambuger-di-hemingway",
  "https://fortissimo.substack.com/p/-ff17-tra-arte-digitale-e-ai",
  "https://fortissimo.substack.com/p/-ff16-sport-e-chi-ne-fa-le-feci",
  "https://fortissimo.substack.com/p/-ff15-sossoldi-la-transizione-ecologica",
  "https://fortissimo.substack.com/p/-ff11-assaggi-di-metaverso",
  "https://fortissimo.substack.com/p/-ff14-la-guerra-non-e-futuro",
  "https://fortissimo.substack.com/p/-ff13-popolazioni-e-polluzioni",
  "https://fortissimo.substack.com/p/-ff10-sole-cuore-e-amore",
  "https://fortissimo.substack.com/p/-ff10-sparare-nel-metaverso",
  "https://fortissimo.substack.com/p/-ff12-misurare-lintelligenza",
  "https://fortissimo.substack.com/p/-ff9-automazione",
  "https://fortissimo.substack.com/p/-ff8-combattere-la-noia",
  "https://fortissimo.substack.com/p/-ff7-lanno-che-e-stato",
  "https://fortissimo.substack.com/p/-ff6-caro-babbo-natale",
  "https://fortissimo.substack.com/p/-ff5-elettrizzante",
  "https://fortissimo.substack.com/p/-ff4-mammut-e-torneo-tremaghi",
  "https://fortissimo.substack.com/p/-ff3-metaverso",
  "https://fortissimo.substack.com/p/-ff2-mente-artificiale-e-psichedelica",
  "https://fortissimo.substack.com/p/-ff1-clima"
];

// Build canonical map: ff number -> proven URL
// For early issues (<=33), URLs have dash prefix - that's their real slug on Substack
// For ff.104, sitemap shows /p/ff104-hackerare-il-corpo (no dash!)
const canonical = {};
for (const url of sitemapUrls) {
  const m = url.match(/\/p\/-?ff(\d+)/);
  if (!m) continue;
  const num = m[1];
  // If we already have a non-dashed version, keep it; otherwise take what we have
  if (!canonical[num]) {
    canonical[num] = url;
  } else if (!url.includes('/p/-ff') && canonical[num].includes('/p/-ff')) {
    // Prefer non-dashed
    canonical[num] = url;
  }
}

// Sort and output
const sorted = {};
Object.keys(canonical).sort((a, b) => +a - +b).forEach(k => { sorted[k] = canonical[k]; });

writeFileSync(join(ROOT, 'canonical_substack_map.json'), JSON.stringify(sorted, null, 2));
console.log('Written canonical_substack_map.json with', Object.keys(sorted).length, 'entries');

// Show entries
for (const [k, v] of Object.entries(sorted)) {
  console.log(`  ff.${k} -> ${v}`);
}
