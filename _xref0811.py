import re, glob, json

s = open('data.js', encoding='utf-8').read()
payload = s[s.index('['):s.rindex(']') + 1]
data = json.loads(payload)

book = ''
for f in glob.glob('book/*.html'):
    book += open(f, encoding='utf-8', errors='ignore').read()
used = set(re.findall(r'ff\.\d+\.\d+', book))

kw = ['cargo', 'container', 'ekranoplan', 'effetto suolo', 'nave', 'navi', 'marittim',
      'drone', 'droni', 'isole', 'isola', 'logistic', 'porti', 'porto', 'sottomarin',
      'anfibi', 'idrovolante', 'stealth', 'radar', 'ucraina', 'pilota', 'pista',
      'merci', 'spedizioni', 'elicottero', 'aereo', 'aerei', 'volo', 'guerra', 'militar']

hits = []
for issue in data:
    for sub in issue.get('subchapters', []):
        t = sub.get('title', '')
        m = re.search(r'ff\.(\d+)\.(\d+)', t)
        if not m:
            continue
        code = 'ff.%s.%s' % (m.group(1), m.group(2))
        if code in used:
            continue
        low = (sub.get('content') or '').lower()
        sc = sum(low.count(k) for k in kw)
        if sc:
            hits.append((sc, int(m.group(1)), code, t, sub.get('link', '')))

for h in sorted(hits, reverse=True)[:35]:
    print(h[0], '|', h[2], '|', h[3])
