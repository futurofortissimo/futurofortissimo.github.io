import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'futuro_fortissimo_full_data.txt');
const OUT_DIR = path.join(ROOT, 'generated');
fs.mkdirSync(OUT_DIR, { recursive: true });

const raw = fs.readFileSync(DATA_PATH, 'utf8');
const issues = JSON.parse(raw);

function norm(s) {
  return (s || '').toString().toLowerCase();
}

function extractIdFromTitle(title) {
  // Matches: ff.139.2 (sometimes with emoji before)
  const m = /ff\.(\d+)\.(\d+)/i.exec(title || '');
  if (!m) return null;
  return `ff.${m[1]}.${m[2]}`;
}

const TOPICS = [
  { key: 'ai', name: 'AI / agenti / modelli', kw: ['ai', 'gemini', 'llm', 'agente', 'agent', 'modello', 'benchmark', 'nvidia', 'prompt', 'tool', 'multimodal', 'compute', 'datacenter', 'chip'] },
  { key: 'attenzione', name: 'Attenzione / schermi / abitudini', kw: ['attenzione', 'dopamina', 'scroll', 'schermo', 'social', 'notific', 'focus', 'distraz', 'ansia'] },
  { key: 'salute', name: 'Salute / sport / corpo', kw: ['salute', 'fitness', 'allen', 'corsa', 'bici', 'cardio', 'cuore', 'sonno', 'stress', 'lattato'] },
  { key: 'nutrizione', name: 'Nutrizione / microbioma', kw: ['dieta', 'microbioma', 'prote', 'nutriz', 'longev', 'cibo', 'zuccher', 'carbo', 'grassi'] },
  { key: 'clima', name: 'Natura / clima / energia', kw: ['clima', 'energia', 'co2', 'inquin', 'biofil', 'natura', 'oceano', 'meteo', 'rinnov', 'nucleare'] },
  { key: 'geo', name: 'Geopolitica / economia / società', kw: ['dollaro', 'cina', 'impero', 'geopolit', 'guerra', 'inflaz', 'mercato', 'stato', 'politic', 'societ'] },
  { key: 'crypto', name: 'Crypto / metaverso', kw: ['crypto', 'bitcoin', 'blockchain', 'metavers', 'web3', 'token', 'nft'] },
  { key: 'cultura', name: 'Cultura / libri / arte', kw: ['libro', 'romanzo', 'cinema', 'arte', 'musica', 'dune', 'interstellar', 'squid game', 'ghibli'] },
];

function scoreTopics(text) {
  const t = norm(text);
  const scores = new Map();
  for (const topic of TOPICS) {
    let s = 0;
    for (const k of topic.kw) {
      if (t.includes(k)) s += 1;
    }
    if (s > 0) scores.set(topic.key, s);
  }
  return scores;
}

// Build flat subchapter list
const subs = [];
for (const issue of issues) {
  for (const sub of issue.subchapters || []) {
    const id = extractIdFromTitle(sub.title);
    const body = [issue.title, issue.subtitle, sub.title, sub.content].filter(Boolean).join('\n');
    subs.push({
      issueTitle: issue.title,
      issueUrl: issue.url,
      id,
      title: sub.title,
      link: sub.link,
      content: sub.content || '',
      body,
      connections: (sub.connections || []).map(c => ({ text: c.text, url: c.url })),
    });
  }
}

// Themes: count by topic + keep samples
const themes = TOPICS.map(t => ({ key: t.key, name: t.name, count: 0, samples: [] }));
const themeByKey = new Map(themes.map(t => [t.key, t]));

for (const s of subs) {
  const scores = scoreTopics(s.body);
  // choose best topic (or multiple if tied)
  let best = 0;
  for (const v of scores.values()) best = Math.max(best, v);
  if (best === 0) continue;
  const winners = [...scores.entries()].filter(([,v]) => v === best).map(([k]) => k);
  for (const k of winners.slice(0,2)) {
    const t = themeByKey.get(k);
    t.count += 1;
    if (t.samples.length < 6) {
      t.samples.push({ id: s.id, title: s.title, url: s.link || s.issueUrl });
    }
  }
}

// Connections graph: edges from subchapter id -> connected ff ids
const nodes = new Map();
const edges = new Map(); // key a->b

function addNode(id, label, url) {
  if (!id) return;
  if (!nodes.has(id)) nodes.set(id, { id, label: label || id, url: url || null });
}

function addEdge(a, b) {
  if (!a || !b) return;
  const key = `${a}=>${b}`;
  edges.set(key, (edges.get(key) || 0) + 1);
}

for (const s of subs) {
  addNode(s.id, s.title, s.link);
  // also add referenced ids if present
  for (const c of s.connections || []) {
    const cid = extractIdFromTitle(c.text);
    if (cid) {
      addNode(cid, c.text, c.url);
      addEdge(s.id, cid);
    }
  }
}

// Compute hub scores (in-degree)
const indeg = new Map([...nodes.keys()].map(k => [k, 0]));
for (const [k, w] of edges.entries()) {
  const b = k.split('=>')[1];
  indeg.set(b, (indeg.get(b) || 0) + w);
}

const topHubs = [...indeg.entries()]
  .sort((a,b) => b[1] - a[1])
  .slice(0, 25)
  .map(([id, score]) => ({ id, score, url: nodes.get(id)?.url || null, label: nodes.get(id)?.label || id }));

const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    issues: issues.length,
    subchapters: subs.length,
    nodes: nodes.size,
    edges: edges.size,
  },
  themes,
  connections: {
    topHubs,
    edges: [...edges.entries()].slice(0, 5000).map(([k, weight]) => {
      const [from, to] = k.split('=>');
      return { from, to, weight };
    }),
  },
};

fs.writeFileSync(path.join(OUT_DIR, 'themes.json'), JSON.stringify({ generatedAt: out.generatedAt, totals: out.totals, themes: out.themes }, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'connections.json'), JSON.stringify({ generatedAt: out.generatedAt, totals: out.totals, ...out.connections }, null, 2));

console.log('Wrote:', path.join('generated','themes.json'), path.join('generated','connections.json'));
