import re, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

t = open('data.js', encoding='utf-8', errors='ignore').read()
start = t.index('[')
end = t.rindex(']') + 1
data = json.loads(t[start:end])
print('issues:', len(data))

subs = []
for it in data:
    for s in it.get('subchapters', []):
        m = re.search(r'ff\.(\d+)\.(\d+)', s.get('title', ''))
        if not m:
            continue
        subs.append({
            'code': 'ff.%s.%s' % (m.group(1), m.group(2)),
            'title': s.get('title', ''),
            'link': s.get('link', ''),
            'content': s.get('content', ''),
            'issue': it.get('title', ''),
        })
print('subchapters:', len(subs))
json.dump(subs, open('_ffidx_0809.json', 'w', encoding='utf-8'), ensure_ascii=False)

for k in ['affitto', 'mutuo', 'immobiliar', 'abitativ', 'boomer', 'disuguaglianz', 'casa', 'reddito', 'generazione']:
    hits = [s for s in subs if k.lower() in (s['title'] + ' ' + s['content']).lower()]
    print('## %s -> %d' % (k, len(hits)))
    for s in hits[:10]:
        print('   ', s['code'], '|', s['title'][:65])
