import io, sys, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

d = open('data.js', encoding='utf-8').read()
start = d.index('[')
# data.js is `const data = [...]` style; find the JSON array
txt = d[start:]
# strip trailing semicolon / export
txt = txt.rstrip()
while txt and txt[-1] not in ']':
    txt = txt[:-1]
data = json.loads(txt)

subs = []
def walk(node):
    if isinstance(node, dict):
        if 'subchapters' in node and isinstance(node['subchapters'], list):
            for s in node['subchapters']:
                if isinstance(s, dict) and 'title' in s:
                    subs.append(s)
        for v in node.values():
            walk(v)
    elif isinstance(node, list):
        for v in node:
            walk(v)

walk(data)
print('subchapters:', len(subs))

kw = ['telecamer', 'sorveglian', 'traffico', 'congestion', 'sensor', 'smart city',
      'emission', 'pedagg', 'inquinament', 'citta', 'città', 'dati urban', 'mappa']
for s in subs:
    t = s.get('title', '')
    c = s.get('content', '') or ''
    low = (t + ' ' + c).lower()
    hits = [k for k in kw if k in low]
    if len(hits) >= 3:
        print(t, '||', hits)
