/**
 * fix_data_refs.mjs — Fix misplaced references in ff.140-141 entries
 * and add missing connections to ff.140-144 subchapters.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '..', 'data.js');

let src = readFileSync(DATA_PATH, 'utf-8');

// Parse: data.js starts with "const rawData = " and ends with ";"
const jsonStart = src.indexOf('[');
const jsonEnd = src.lastIndexOf(']') + 1;
const prefix = src.slice(0, jsonStart);
const suffix = src.slice(jsonEnd);
const data = JSON.parse(src.slice(jsonStart, jsonEnd));

// Helper to find an entry by title substring
function findEntry(titleFragment) {
  return data.find(e => e.title && e.title.includes(titleFragment));
}

// Helper to find a subchapter by title substring within an entry
function findSub(entry, titleFragment) {
  return entry?.subchapters?.find(s => s.title.includes(titleFragment));
}

// ── ff.140 ──
const ff140 = findEntry('ff.140');
if (ff140) {
  const s1 = findSub(ff140, '140.1');
  const s2 = findSub(ff140, '140.2');
  const s3 = findSub(ff140, '140.3');

  if (s1 && s2 && s3) {
    // ff.140.2 currently has A16Z/Jenny Odell refs → those belong in ff.140.1
    // ff.140.3 currently has Lovable/levelsio refs → those belong in ff.140.2
    // ff.140.3 needs its own refs about Erdős/Kontorovich

    // Move refs from s2 to s1 (A16Z, AI slop, Jenny Odell)
    s1.references = s2.references;
    // Move connection from s2 to s1 (Web Poetico)
    s1.connections = s2.connections;

    // Move refs from s3 to s2 (Lovable, MangiaFortissimo, levelsio)
    s2.references = s3.references;
    // Move connection from s3 to s2 (BuonGPT)
    s2.connections = s3.connections;

    // Give s3 proper refs for its content (Erdős, deflation)
    s3.references = [
      {
        "text": "Aristotle risolve il problema di Erdős #124",
        "url": "https://harmonicmath.com/aristotle"
      },
      {
        "text": "Aryeh Kontorovich sul futuro della ricerca accademica",
        "url": "https://x.com/kaborov/status/1929614205507838397"
      }
    ];
    s3.connections = [
      {
        "text": "🤘 ff.127.2 Rock 'n' roll e vibe coding",
        "url": "https://fortissimo.substack.com/i/165079348/ff-rock-n-roll-e-vibe-coding"
      }
    ];
  }
  console.log('ff.140: references realigned');
}

// ── ff.141 ──
const ff141 = findEntry('ff.141');
if (ff141) {
  const s1 = findSub(ff141, '141.1');
  const s2 = findSub(ff141, '141.2');
  const s3 = findSub(ff141, '141.3');

  if (s1 && s2 && s3) {
    // s1 (Sentirsi inutili) mentions Bregman, Harvard → move "School for Moral Ambition" from s2
    // s2 (Rallentare) mentions Boyd Varty, Tim Ferriss → move those refs from s3
    // s3 (Done-List) mentions Burkeman, Dan Harris, Jack King → needs its own refs

    // Move ref from s2 to s1
    s1.references = s2.references;

    // Move refs from s3 to s2
    s2.references = s3.references;

    // Give s3 proper refs
    s3.references = [
      {
        "text": "Oliver Burkeman, Four Thousand Weeks",
        "url": "https://amzn.to/3YMKPcR"
      },
      {
        "text": "Dan Harris, Daily-ish podcast",
        "url": "https://www.tenpercent.com/danharris"
      }
    ];

    // Add connections to s1 (currently has ff.44, keep it)
    // Add connection to s3
    if (s3.connections.length === 0) {
      s3.connections = [
        {
          "text": "📝 ff.118 Paprika e massaggi",
          "url": "https://fortissimo.substack.com/p/ff118-paprika-e-massaggi"
        }
      ];
    }
  }
  console.log('ff.141: references realigned');
}

// ── ff.143 — Add missing connections ──
const ff143 = findEntry('ff.143');
if (ff143) {
  const s3 = findSub(ff143, '143.3');
  const s4 = findSub(ff143, '143.4');

  if (s3 && s3.connections.length === 0) {
    s3.connections = [
      {
        "text": "🎼 ff.56 Il condizionatore terrestre",
        "url": "https://fortissimo.substack.com/p/ff56-il-condizionatore-terrestre"
      }
    ];
  }
  if (s4 && s4.connections.length === 0) {
    s4.connections = [
      {
        "text": "🎼 ff.142 Caro Marziano...",
        "url": "https://fortissimo.substack.com/p/ff142-caro-marziano"
      }
    ];
  }
  // Fix s3 broken reference (google search placeholder)
  if (s3) {
    s3.references = s3.references.map(r => {
      if (r.url === 'https://www.google.com/search?q=link') {
        return {
          "text": "🎼 ff.56 Il condizionatore terrestre",
          "url": "https://fortissimo.substack.com/p/ff56-il-condizionatore-terrestre"
        };
      }
      return r;
    });
  }
  console.log('ff.143: connections added, broken ref fixed');
}

// ── ff.144 — Add missing connections ──
const ff144 = findEntry('ff.144');
if (ff144) {
  const s1 = findSub(ff144, '144.1');
  const s2 = findSub(ff144, '144.2');
  const s3 = findSub(ff144, '144.3');

  if (s1 && s1.connections.length === 0) {
    s1.connections = [
      {
        "text": "🛠️ ff.140.2 Vibe coding in un weekend",
        "url": "https://fortissimo.substack.com/p/ff140-tutti-app-fluencers"
      }
    ];
  }
  if (s2 && s2.connections.length === 0) {
    s2.connections = [
      {
        "text": "🐆 ff.127.3 Leopardi e l'equazione di Schrödinger",
        "url": "https://fortissimo.substack.com/i/165079348/ff-leopardi-e-lequazione-di-schrodinger"
      }
    ];
  }
  if (s3 && s3.connections.length === 0) {
    s3.connections = [
      {
        "text": "🎼 ff.140 Tutti App-fluencers?",
        "url": "https://fortissimo.substack.com/p/ff140-tutti-app-fluencers"
      }
    ];
  }
  console.log('ff.144: connections added');
}

// Write back
const output = prefix + JSON.stringify(data, null, 4) + suffix;
writeFileSync(DATA_PATH, output, 'utf-8');
console.log('✅ data.js updated — references and connections fixed for ff.140-144');
