/**
 * voxel_map.mjs — assigns every issue its own representative 3D voxel object (rendered by /assets/ff-voxel.js).
 * Order: hand-picked latest issues → keyword rules on title/subtitle/section titles → theme pool → deterministic hash.
 * Model keys must exist in MODELS of assets/ff-voxel.js.
 */
export const MODEL_KEYS = ['microscope', 'walnut', 'lamp', 'virus', 'bicycle', 'token', 'pawn', 'bulb', 'brain', 'sunglasses', 'temple', 'fish',
  'ghost', 'bone', 'lobster', 'watch', 'ufo', 'floppy', 'phone', 'chip', 'tree', 'mountain', 'wave', 'dice', 'robot', 'sun', 'globe', 'heart',
  'apple', 'banana', 'coffee', 'book', 'clef', 'rocket', 'atom', 'dna', 'coin', 'eye', 'car', 'house', 'mushroom', 'plane', 'cloud', 'flame',
  'gamepad', 'shell', 'pill', 'lungs'];

/** hand-assigned: the latest issues get a model chosen from their actual story */
const HAND = {
  'ff-158': 'microscope', 'ff-157': 'walnut', 'ff-156': 'lamp', 'ff-155': 'virus', 'ff-154': 'bicycle', 'ff-153': 'token',
  'ff-152': 'pawn', 'ff-151': 'bulb', 'ff-150': 'brain', 'ff-149': 'sunglasses', 'ff-148': 'temple', 'ff-147': 'fish',
  'ff-146': 'ghost', 'ff-145': 'bone', 'ff-144': 'lobster', 'ff-143': 'watch', 'ff-142': 'ufo', 'ff-141': 'floppy',
  'ff-140': 'phone', 'ff-139': 'chip', 'ff-138': 'tree', 'ff-137': 'mountain', 'ff-136': 'wave', 'ff-135': 'dice',
  'ff-132': 'gamepad', 'ff-130': 'pill', 'ff-129': 'car', 'ff-102': 'shell', 'ff-87': 'lungs', 'ff-86': 'lungs',
  'ff-134': 'book', 'ff-131': 'sun', 'ff-127': 'clef', 'ff-125': 'temple', 'ff-124': 'bicycle', 'ff-123': 'shell',
  'ff-121': 'plane', 'ff-119': 'robot', 'ff-112': 'wave', 'ff-111': 'watch', 'ff-110': 'house', 'ff-108': 'watch',
  'ff-106': 'ghost', 'ff-105': 'cloud', 'ff-103': 'flame', 'ff-101': 'clef', 'ff-97': 'heart', 'ff-82': 'chip', 'ff-69': 'atom',
  'ff-70': 'sun', 'ff-58': 'banana', 'ff-46': 'atom', 'ff-33': 'tree', 'ff-4': 'dna', 'ff-1': 'globe',
  'due-anni-fortissimi': 'clef', 'e-passato-1-anno-di-futuro': 'clef', 'ff-futuro-fortissimo': 'clef', 'ff-sogno-di-mezzestate': 'sun',
};

/** keyword → model (first match wins), tested on lower-cased title + subtitle + section titles */
const RULES = [
  [/microscop|riemann|primi\b/, 'microscope'], [/videogioc|gamer|minecraft|call of duty|pok[eé]mon|farmville/, 'gamepad'],
  [/tesla|guida autonoma|robo-?taxi|macchin/, 'car'], [/bici|van moof|cicl/, 'bicycle'], [/maratona|triathlon|ironman|sport|longevit/, 'heart'],
  [/chip|gpu|nvidia|quantist/, 'chip'], [/robot|roomba|automazione|asimov|manus/, 'robot'], [/singolarit|agi\b|superintellig/, 'rocket'],
  [/chatgpt|gpt-4|openai|\bai\b|intelligenza artificiale|claude|gemini/, ['robot', 'bulb', 'brain', 'chip', 'rocket']], [/metavers|vision pro|web3|matrix|simulazione/, 'eye'],
  [/bitcoin|cripto|cripta|soldi|inflazione|economia|1971/, 'coin'], [/banan/, 'banana'], [/caff[eè]|fagioli/, 'coffee'],
  [/patate|spezie|paprika/, 'flame'], [/cibo|dieta|superfood|grasso|carbonara|hamburger|insalata|pasta|fame|mangia|ozempic|obesit/, ['apple', 'banana', 'mushroom']], [/respir|ossigeno|aria/, 'lungs'],
  [/tumor|cancro|medic|cura|terapi|covid|psicolog|stress|ansia/, 'pill'], [/dna|gen(e|i)tic|mammut|trapiant|maial|centenar/, 'dna'],
  [/cervell|mente|intelligen|coscien|neuron|psichedel/, 'brain'], [/sole\b|solar|estate|agosto/, 'sun'], [/clima|cop2|co2|net-zero|geoingegner|condizionatore/, 'globe'],
  [/piant|bosco|biofil|natura/, 'tree'], [/nuclear|elementale|atom/, 'atom'], [/elettric|energia|batteri|duracell/, 'cloud'],
  [/acqua|onda|mare/, 'wave'], [/fuoco|ferro|brucia/, 'flame'], [/citt[aà]|stato|nazione|famiglia|matrimon|casa/, 'house'],
  [/guerra|cina|usa|impero|giappon|seta|popolaz/, 'globe'], [/arte|dall-e|cinema|jazz|libri|storia|parole|nomi|uno\?/, 'book'],
  [/natale|babbo|regali|lloween|dolcetto/, 'mushroom'], [/tinder|relazion|amore|cuore|mamma|tocchiamoci/, 'heart'],
  [/viagg|vacanz|aereo|volo|vola|ali\?|settimana bianca/, 'plane'], [/tempo|routine|zero\b|noia/, 'watch'], [/google|ricerca|previsioni|nostradamus/, 'eye'],
  [/microplastic|plastica|diamant/, 'shell'], [/fiera|ces\b|artigian/, 'phone'], [/stagnazione|anno|2022|2023|2024|trend|meglio/, 'floppy'],
];

const POOL = { ai: ['robot', 'chip', 'brain', 'bulb'], attenzione: ['phone', 'eye', 'watch'], salute: ['heart', 'lungs', 'pill'],
  nutrizione: ['apple', 'banana', 'coffee', 'mushroom'], clima: ['tree', 'sun', 'globe', 'wave'], geo: ['temple', 'globe', 'house'],
  crypto: ['coin', 'token', 'eye'], cultura: ['book', 'clef', 'shell'] };

const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

/** @param {{s:string,t:string,st?:string,th?:string[],sec?:{t:string}[]}} r a row of assets/site-index-it.json */
export function voxelFor(r) {
  if (HAND[r.s]) return HAND[r.s];
  // headline first (title + subtitle), then the section titles
  for (const txt of [`${r.t} ${r.st || ''}`, (r.sec || []).map((x) => x.t).join(' ')]) {
    const low = txt.toLowerCase();
    for (const [rx, k] of RULES) if (rx.test(low)) return Array.isArray(k) ? k[hash(r.s) % k.length] : k;
  }
  const pool = POOL[(r.th || [])[0]];
  if (pool) return pool[hash(r.s) % pool.length];
  return MODEL_KEYS[hash(r.s) % MODEL_KEYS.length];
}

/** slug → model for the whole archive (stable across languages: always computed on the Italian index) */
export function voxelTable(indexIt) { return Object.fromEntries(indexIt.map((r) => [r.s, voxelFor(r)])); }
