/**
 * seo_strings.mjs — page-level SEO copy (title 50–60 chars, description 140–160 chars)
 * for every static page in it/en/hi. Checked by scripts/validate_seo.py.
 */
export const SOCIAL = {
  substack: 'https://fortissimo.substack.com',
  x: 'https://x.com/michele_merelli',
  xHandle: '@michele_merelli',
  instagram: 'https://www.instagram.com/michele_merelli/',
};

export const PAGE_SEO = {
  home: {
    it: { title: 'Futuro Fortissimo — newsletter su AI, natura e società', desc: 'Futuro Fortissimo, la newsletter di Michele Merelli: tecnologia, intelligenza artificiale, natura, cibo e società in sezioni brevi ff.x.y con le loro fonti.' },
    en: { title: 'Futuro Fortissimo — a newsletter on AI, nature and society', desc: 'Futuro Fortissimo by Michele Merelli in English: technology, artificial intelligence, nature, food and society in short ff.x.y sections, each with sources.' },
    hi: { title: 'Futuro Fortissimo — AI, प्रकृति और समाज पर हिन्दी न्यूज़लेटर', desc: 'मिकेले मेरेल्ली का न्यूज़लेटर Futuro Fortissimo हिन्दी में: तकनीक, कृत्रिम बुद्धिमत्ता, प्रकृति, भोजन और समाज पर छोटे ff.x.y खंड, हर एक अपने स्रोतों के साथ।' },
  },
  archive: {
    it: { title: (n) => `Archivio Futuro Fortissimo: tutti i ${n} numeri e le fonti`, desc: (n) => `Tutti i ${n} numeri di Futuro Fortissimo in un unico archivio: riassunti, sezioni ff.x.y, fonti citate e link agli originali su Substack. Cerca per tema.` },
    en: { title: (n) => `Futuro Fortissimo archive: all ${n} issues in English`, desc: (n) => `All ${n} issues of Futuro Fortissimo, the Italian newsletter on tech, AI, nature and society — summaries, ff.x.y sections and sources in English.` },
    hi: { title: (n) => `Futuro Fortissimo संग्रह: सभी ${n} अंक हिन्दी में पढ़ें`, desc: (n) => `Futuro Fortissimo के सभी ${n} अंक — तकनीक, AI, प्रकृति और समाज पर इतालवी न्यूज़लेटर। हिन्दी में सारांश, ff.x.y खंड, स्रोत और Substack के मूल लेखों के लिंक।` },
  },
  books: {
    it: { title: (n) => `${n} libri citati in Futuro Fortissimo: la lista di lettura`, desc: (n, c) => `${n} libri citati in ${c} sezioni di Futuro Fortissimo: scienza, tecnologia, natura, cibo, società e mente. Ogni libro collegato al numero che lo cita.` },
    en: { title: (n) => `${n} books cited in Futuro Fortissimo: the reading list`, desc: (n, c) => `${n} books cited across ${c} sections of Futuro Fortissimo: science, technology, nature, food, society and mind. Each one linked to the issue that cites it.` },
    hi: { title: (n) => `Futuro Fortissimo में उद्धृत ${n} किताबें: पढ़ने की पूरी सूची`, desc: (n, c) => `Futuro Fortissimo के ${c} खंडों में उद्धृत ${n} किताबें: विज्ञान, तकनीक, प्रकृति, भोजन, समाज और मन। हर किताब उस अंक से जुड़ी है जहाँ उसका ज़िक्र है।` },
  },
  themes: {
    it: { title: 'Temi di Futuro Fortissimo: AI, clima, salute, società', desc: 'I macro-temi di Futuro Fortissimo: AI, attenzione, salute, nutrizione, clima, geopolitica, crypto e cultura, con i numeri e le sezioni ff.x.y di ogni tema.' },
    en: { title: 'Futuro Fortissimo themes: AI, climate, health, society', desc: 'The macro-themes of Futuro Fortissimo: AI, attention, health, nutrition, climate, geopolitics, crypto and culture, with the issues and ff.x.y sections of each.' },
    hi: { title: 'Futuro Fortissimo की थीम: AI, जलवायु, स्वास्थ्य और समाज', desc: 'Futuro Fortissimo की मुख्य थीम: AI, ध्यान, स्वास्थ्य, पोषण, जलवायु, भू-राजनीति, क्रिप्टो और संस्कृति — हर थीम के अंक और ff.x.y खंड, सीधे लिंक के साथ।' },
  },
  connections: {
    it: { title: 'Connessioni Fortissime: la mappa dei rimandi tra i numeri', desc: 'La mappa delle connessioni di Futuro Fortissimo: le sezioni ff.x.y più citate, i rimandi tra numeri lontani e i percorsi di lettura suggeriti tra i temi.' },
    en: { title: 'Futuro Fortissimo connections: a map of cross-references', desc: 'The connection map of Futuro Fortissimo: the most cited ff.x.y sections, cross-references between distant issues and suggested reading paths across themes.' },
    hi: { title: 'Futuro Fortissimo कनेक्शन: अंकों के बीच संदर्भों का नक्शा', desc: 'Futuro Fortissimo के कनेक्शन का नक्शा: सबसे ज़्यादा उद्धृत ff.x.y खंड, दूर-दूर के अंकों के बीच संदर्भ और अलग-अलग थीम के बीच पढ़ने के सुझाए गए रास्ते।' },
  },
  notes: {
    it: { title: 'Note di Futuro Fortissimo: link, letture e spunti raccolti', desc: 'Le note di Michele Merelli per Futuro Fortissimo: link, articoli, video e spunti raccolti ogni giorno su AI, tecnologia, natura e società per la newsletter.' },
    en: { title: 'Futuro Fortissimo notes: links, readings and raw ideas', desc: 'Michele Merelli’s working notes for Futuro Fortissimo: links, articles, videos and ideas collected daily on AI, technology, nature and society for each issue.' },
    hi: { title: 'Futuro Fortissimo नोट्स: लिंक, लेख और कच्चे विचार हिन्दी में', desc: 'Futuro Fortissimo के लिए मिकेले मेरेल्ली के कामकाजी नोट्स: AI, तकनीक, प्रकृति और समाज पर रोज़ जुटाए गए लिंक, लेख, वीडियो और विचार, हर अंक से पहले।' },
  },
  notFound: {
    it: { title: 'Pagina non trovata — Futuro Fortissimo', desc: 'Questa pagina non esiste.' },
  },
};

/** generic tail used to stretch short issue descriptions into the 140–160 range */
export const DESC_TAIL = {
  it: 'Un numero di Futuro Fortissimo, la newsletter di Michele Merelli su tecnologia, AI, natura e società.',
  en: 'An issue of Futuro Fortissimo, Michele Merelli’s newsletter on technology, AI, nature and society.',
  hi: 'Futuro Fortissimo का एक अंक — तकनीक, AI, प्रकृति और समाज पर मिकेले मेरेल्ली का न्यूज़लेटर।',
};
/** title suffixes tried in order until the title lands in 50–60 chars */
export const TITLE_SUFFIXES = {
  it: [' — Futuro Fortissimo', ' | Futuro Fortissimo newsletter', ' | la newsletter Futuro Fortissimo', ' | Futuro Fortissimo · newsletter su AI', ' | Futuro Fortissimo · newsletter di Merelli', ' | Futuro Fortissimo, newsletter di M. Merelli', ' | newsletter Futuro Fortissimo di Michele Merelli'],
  en: [' — Futuro Fortissimo', ' | Futuro Fortissimo in English', ' | Futuro Fortissimo newsletter (EN)', ' | Futuro Fortissimo newsletter in English', ' | Futuro Fortissimo, a newsletter in English', ' | Futuro Fortissimo · Michele Merelli’s newsletter'],
  hi: [' — Futuro Fortissimo', ' | Futuro Fortissimo हिन्दी में', ' | Futuro Fortissimo न्यूज़लेटर हिन्दी में', ' | Futuro Fortissimo — न्यूज़लेटर, हिन्दी में', ' | Futuro Fortissimo · मिकेले मेरेल्ली का न्यूज़लेटर'],
};

/** small UI strings used by the SEO blocks (related issues, themes, footer) */
export const UI_SEO = {
  it: { related: 'Numeri correlati', themesOf: 'Temi', published: 'Pubblicato il', explore: 'Esplora', follow: 'Segui', about: 'Futuro Fortissimo è la newsletter di Michele Merelli su tecnologia, AI, natura e società: sezioni brevi ff.x.y, ognuna con le sue fonti.', allIssues: 'Tutti i numeri', issuesOfTheme: (n) => `${n} numeri`, latest: 'Ultimi numeri', seeAll: 'Vedi tutti', popularBooks: 'Libri più citati', themes: 'Temi', citations: (n) => `${n} citazioni` },
  en: { related: 'Related issues', themesOf: 'Themes', published: 'Published', explore: 'Explore', follow: 'Follow', about: 'Futuro Fortissimo is Michele Merelli’s newsletter on technology, AI, nature and society: short ff.x.y sections, each with its sources.', allIssues: 'All issues', issuesOfTheme: (n) => `${n} issues`, latest: 'Latest issues', seeAll: 'See all', popularBooks: 'Most cited books', themes: 'Themes', citations: (n) => `${n} citations` },
  hi: { related: 'संबंधित अंक', themesOf: 'थीम', published: 'प्रकाशित', explore: 'देखें', follow: 'फ़ॉलो करें', about: 'Futuro Fortissimo तकनीक, AI, प्रकृति और समाज पर मिकेले मेरेल्ली का न्यूज़लेटर है: छोटे ff.x.y खंड, हर एक अपने स्रोतों के साथ।', allIssues: 'सभी अंक', issuesOfTheme: (n) => `${n} अंक`, latest: 'नए अंक', seeAll: 'सभी देखें', popularBooks: 'सबसे ज़्यादा उद्धृत किताबें', themes: 'थीम', citations: (n) => `${n} उद्धरण` },
};

/** app-shell strings (top bar, tab bar, search, reading tools) */
export const UI_APP = {
  it: { skip: 'Vai al contenuto', search: 'Cerca', searchPh: 'Cerca numeri, sezioni, temi…', searchAll: 'Tutti i risultati nell’archivio →', searchEmpty: 'Nessun risultato. Prova un’altra parola.', close: 'Chiudi', more: 'Altro', menu: 'Menu', tabHome: 'Home', tabArchive: 'Archivio', tabThemes: 'Temi', tabBooks: 'Libri', tabSearch: 'Cerca', share: 'Condividi', copy: 'Copia link', copied: 'Link copiato', toc: 'Indice del numero', prev: 'Numero precedente', next: 'Numero successivo', stickySub: 'Ti piace? Ricevi il prossimo numero via email.', dismiss: 'Chiudi invito', support: 'Offrimi un caffè ☕', projects: 'Altri progetti di Michele', hint: 'Premi / per cercare ovunque' },
  en: { skip: 'Skip to content', search: 'Search', searchPh: 'Search issues, sections, themes…', searchAll: 'All results in the archive →', searchEmpty: 'No results. Try another word.', close: 'Close', more: 'More', menu: 'Menu', tabHome: 'Home', tabArchive: 'Archive', tabThemes: 'Themes', tabBooks: 'Books', tabSearch: 'Search', share: 'Share', copy: 'Copy link', copied: 'Link copied', toc: 'Sections of this issue', prev: 'Previous issue', next: 'Next issue', stickySub: 'Enjoying it? Get the next issue by email.', dismiss: 'Dismiss', support: 'Buy me a coffee ☕', projects: 'Michele’s other projects', hint: 'Press / to search anywhere' },
  hi: { skip: 'सामग्री पर जाएँ', search: 'खोजें', searchPh: 'अंक, खंड, थीम खोजें…', searchAll: 'संग्रह में सभी परिणाम →', searchEmpty: 'कोई परिणाम नहीं। कोई और शब्द आज़माएँ।', close: 'बंद करें', more: 'और', menu: 'मेनू', tabHome: 'होम', tabArchive: 'संग्रह', tabThemes: 'थीम', tabBooks: 'किताबें', tabSearch: 'खोजें', share: 'शेयर करें', copy: 'लिंक कॉपी करें', copied: 'लिंक कॉपी हो गया', toc: 'इस अंक के खंड', prev: 'पिछला अंक', next: 'अगला अंक', stickySub: 'पसंद आया? अगला अंक ईमेल पर पाएँ।', dismiss: 'बंद करें', support: 'मुझे एक कॉफ़ी पिलाएँ ☕', projects: 'मिकेले के अन्य प्रोजेक्ट', hint: 'कहीं भी खोजने के लिए / दबाएँ' },
};
