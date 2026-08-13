# -*- coding: utf-8 -*-
import json, csv, glob, sys, io, unicodedata, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
def norm(s):
    s = unicodedata.normalize('NFKD', (s or '')).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z ]',' ', s).split()
NAMES=set(); ORGS={}
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))
for c in T['contacts']:
    NAMES.add(' '.join(norm(c.get('name'))))
    ORGS[c.get('org','')] = ORGS.get(c.get('org',''),0)+1
for f in glob.glob(r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach/*.csv'):
    try:
        for r in csv.DictReader(open(f, encoding='utf-8')):
            fn = r.get('first_name') or r.get('first') or ''
            ln = r.get('last_name') or r.get('last') or ''
            if fn or ln: NAMES.add(' '.join(norm(fn+' '+ln)))
            full = r.get('name') or r.get('full_name')
            if full: NAMES.add(' '.join(norm(full)))
    except Exception as e: print('skip', f, e)
NAMES.discard('')
json.dump(sorted(NAMES), open(r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach/_names_b92.json','w',encoding='utf-8'), ensure_ascii=False)
print('known names:', len(NAMES))
q = [' '.join(norm(a)) for a in sys.argv[1:]]
for name in q:
    print(('DUP  ' if name in NAMES else 'NEW  ') + name)
