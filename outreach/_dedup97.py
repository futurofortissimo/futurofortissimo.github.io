# -*- coding: utf-8 -*-
import json, sys, io, unicodedata
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))

def norm(s):
    s = unicodedata.normalize('NFKD', (s or '').strip().lower())
    return ''.join(c for c in s if not unicodedata.combining(c))

N = set(norm(x.get('name')) for x in T['contacts'])
# also surname+firstname swapped
SUR = set()
for x in T['contacts']:
    p = norm(x.get('name')).split()
    if len(p) >= 2:
        SUR.add(p[0] + ' ' + p[-1])

for c in sys.argv[1:]:
    n = norm(c)
    p = n.split()
    key = (p[0] + ' ' + p[-1]) if len(p) >= 2 else n
    flag = 'DUP' if (n in N or key in SUR) else 'NEW'
    print(flag, c)
