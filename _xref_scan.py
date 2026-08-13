# -*- coding: utf-8 -*-
"""Scan data.js for cross-ref candidates about decentralized/distributed compute."""
import re, io, json

src = io.open('data.js', encoding='utf-8').read()
start = src.index('[')
end = src.rindex(']') + 1
data = json.loads(src[start:end])

used = set("139.1 148.2 139.2 36.2 135.1 135.2 70.3 2.1 2.2 135.4 50.3 82.1 48.1 48.3 88.1 82.2 129.1 148.1 82.4".split())
kw = ['decentraliz', 'distribuit', 'federat', 'banda ', 'bandwidth', 'mining',
      'blockchain', 'peer', 'folding', 'supercomputer', 'gpu', 'cloud',
      'nodi', 'calcolo', 'open source', 'open-source']

out = io.open('_xref_cands.txt', 'w', encoding='utf-8')
n = 0
for issue in data:
    for s in issue.get('subchapters', []):
        t = s.get('title', '')
        c = s.get('content', '') or ''
        m = re.search(r'ff\.(\d+)\.(\d+)', t)
        if not m:
            continue
        code = '%s.%s' % (m.group(1), m.group(2))
        if code in used:
            continue
        hits = [k for k in kw if k in c.lower()]
        if len(hits) >= 2:
            n += 1
            out.write('### %s | HITS=%s\n%s\n\n' % (t, hits, c[:400].replace('\n', ' ')))
out.close()
print('candidates:', n)
