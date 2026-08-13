import json, io, os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'notes.json')
_d = json.load(io.open(p, encoding='utf-8'))
notes = _d if isinstance(_d, list) else _d.get('notes', [])
print('total notes', len(notes))
hits = []
for n in notes:
    s = json.dumps(n, ensure_ascii=False).lower()
    if 'psiloc' in s or 'alzheimer' in s:
        hits.append(n)
print('hits', len(hits))
out = [json.dumps(n, ensure_ascii=False, indent=1) for n in hits]
io.open(os.path.join(os.path.dirname(p), '_psilo_probe.txt'), 'w', encoding='utf-8').write('\n=====\n'.join(out))
