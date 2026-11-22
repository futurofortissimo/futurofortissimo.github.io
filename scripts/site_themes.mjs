/**
 * site_themes.mjs — keyword theme classification of every ff.x.y section (from data.js),
 * shared by the static themes pages and the "related issues" blocks on issue pages.
 * Same 8 macro-themes as scripts/build_themes_connections.mjs, but word-boundary matching
 * for short keywords (so "ai" doesn't match "mai"/"hai").
 */
export const THEMES = [
  { key: 'ai', emoji: '🤖', name: { it: 'AI, agenti e modelli', en: 'AI, agents and models', hi: 'AI, एजेंट और मॉडल' },
    blurb: { it: 'Intelligenza artificiale, LLM, agenti, chip e il loro impatto su lavoro e pensiero.', en: 'Artificial intelligence, LLMs, agents, chips and how they change work and thinking.', hi: 'कृत्रिम बुद्धिमत्ता, LLM, एजेंट, चिप और काम व सोच पर उनका असर।' },
    kw: ['\\bai\\b', '\\bia\\b', 'gemini', '\\bllm', 'agent[ie]', '\\bagent', 'chatgpt', 'openai', 'anthropic', 'claude', 'benchmark', 'nvidia', 'prompt', 'multimodal', 'datacenter', 'intelligenza artificiale', '\\bchip'] },
  { key: 'attenzione', emoji: '📱', name: { it: 'Attenzione, schermi e abitudini', en: 'Attention, screens and habits', hi: 'ध्यान, स्क्रीन और आदतें' },
    blurb: { it: 'Dopamina, social, notifiche, focus: come la tecnologia plasma la nostra attenzione.', en: 'Dopamine, social media, notifications, focus: how technology shapes our attention.', hi: 'डोपामिन, सोशल मीडिया, नोटिफ़िकेशन, फ़ोकस: तकनीक हमारे ध्यान को कैसे गढ़ती है।' },
    kw: ['attenzione', 'dopamina', 'scroll', 'schermo', 'smartphone', '\\bsocial', 'notific', '\\bfocus', 'distraz', 'ansia', 'tiktok', 'instagram'] },
  { key: 'salute', emoji: '🏃', name: { it: 'Salute, sport e corpo', en: 'Health, sport and body', hi: 'स्वास्थ्य, खेल और शरीर' },
    blurb: { it: 'Allenamento, sonno, stress, longevità e medicina tra scienza e quotidianità.', en: 'Training, sleep, stress, longevity and medicine, between science and everyday life.', hi: 'व्यायाम, नींद, तनाव, दीर्घायु और चिकित्सा — विज्ञान और रोज़मर्रा के बीच।' },
    kw: ['salute', 'fitness', '\\ballen', '\\bcorsa', '\\bbici', 'cardio', 'cuore', 'sonno', 'stress', 'lattato', 'cancro', 'tumor', 'vaccin', 'farmac'] },
  { key: 'nutrizione', emoji: '🥗', name: { it: 'Nutrizione e microbioma', en: 'Nutrition and microbiome', hi: 'पोषण और माइक्रोबायोम' },
    blurb: { it: 'Cibo, diete, proteine, zuccheri e microbioma: cosa mangiamo e perché conta.', en: 'Food, diets, protein, sugar and the microbiome: what we eat and why it matters.', hi: 'भोजन, आहार, प्रोटीन, चीनी और माइक्रोबायोम: हम क्या खाते हैं और यह क्यों मायने रखता है।' },
    kw: ['dieta', 'microbioma', 'protein', 'nutriz', 'longev', '\\bcibo', 'zuccher', 'carboidrat', 'grassi', 'alimentaz', 'cucina'] },
  { key: 'clima', emoji: '🌍', name: { it: 'Natura, clima ed energia', en: 'Nature, climate and energy', hi: 'प्रकृति, जलवायु और ऊर्जा' },
    blurb: { it: 'Clima, energia, oceani, biodiversità e transizione: il pianeta che cambia.', en: 'Climate, energy, oceans, biodiversity and the transition: a changing planet.', hi: 'जलवायु, ऊर्जा, महासागर, जैव विविधता और बदलाव: बदलता हुआ ग्रह।' },
    kw: ['clima', 'energia', '\\bco2', 'inquin', 'biofil', 'natura', 'oceano', '\\bmeteo', 'rinnov', 'nucleare', 'solare', 'foresta', 'biodivers'] },
  { key: 'geo', emoji: '🏛', name: { it: 'Geopolitica, economia e società', en: 'Geopolitics, economy and society', hi: 'भू-राजनीति, अर्थव्यवस्था और समाज' },
    blurb: { it: 'Mercati, Cina, imperi, inflazione e politica: le forze che muovono la società.', en: 'Markets, China, empires, inflation and politics: the forces moving society.', hi: 'बाज़ार, चीन, साम्राज्य, महँगाई और राजनीति: समाज को चलाने वाली ताक़तें।' },
    kw: ['dollaro', '\\bcina\\b', 'impero', 'geopolit', 'guerra', 'inflaz', 'mercat', 'politic', 'societ', 'economi', '\\bpil\\b'] },
  { key: 'crypto', emoji: '🪙', name: { it: 'Crypto e metaverso', en: 'Crypto and metaverse', hi: 'क्रिप्टो और मेटावर्स' },
    blurb: { it: 'Bitcoin, blockchain, NFT e mondi virtuali: promesse e realtà del web3.', en: 'Bitcoin, blockchain, NFTs and virtual worlds: the promises and reality of web3.', hi: 'बिटकॉइन, ब्लॉकचेन, NFT और आभासी दुनिया: web3 के वादे और हक़ीक़त।' },
    kw: ['crypto', 'bitcoin', 'blockchain', 'metavers', '\\bweb3', '\\bnft'] },
  { key: 'cultura', emoji: '🎨', name: { it: 'Cultura, libri e arte', en: 'Culture, books and art', hi: 'संस्कृति, किताबें और कला' },
    blurb: { it: 'Libri, film, musica e arte come lenti per leggere il futuro.', en: 'Books, films, music and art as lenses to read the future.', hi: 'भविष्य को पढ़ने के लिए किताबें, फ़िल्में, संगीत और कला।' },
    kw: ['\\blibr[oi]\\b', 'romanzo', 'cinema', '\\bfilm\\b', '\\barte\\b', 'musica', '\\bdune\\b', 'interstellar', 'squid game', 'ghibli', 'poesia'] },
];
const RX = THEMES.map((t) => ({ key: t.key, rx: t.kw.map((k) => new RegExp(k, 'gi')) }));

/** themes of one section: best-scoring 1–2 theme keys */
export function sectionThemes(issue, sub) {
  const text = [issue.title, issue.subtitle, sub.title, sub.title, sub.content].filter(Boolean).join('\n');
  const scores = RX.map(({ key, rx }) => [key, rx.reduce((s, r) => s + (text.match(r) || []).length, 0)]).filter(([, s]) => s > 0);
  if (!scores.length) return [];
  scores.sort((a, b) => b[1] - a[1]);
  const best = scores[0][1];
  return scores.filter(([, s]) => s >= Math.max(2, best * 0.6)).slice(0, 2).map(([k]) => k).concat(best < 2 ? [scores[0][0]] : []).slice(0, 2);
}

/** per-issue theme weights: { slug: { key: count } } */
export function issueThemeMap(issues) {
  const out = {};
  for (const ch of issues) {
    const w = {};
    (ch.subchapters || []).forEach((sub) => sectionThemes(ch, sub).forEach((k) => { w[k] = (w[k] || 0) + 1; }));
    out[ch.slug] = w;
  }
  return out;
}
