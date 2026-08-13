# -*- coding: utf-8 -*-
import json, sys, io, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
IDX = json.load(open('_ffidx_b92.json', encoding='utf-8'))
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))
CNT = collections.Counter(x.get('ff_post') for x in T['contacts'])
BLOBS = {c: (v['title'] + ' ' + v['content']).lower() for c, v in IDX.items()}
QUERIES = json.load(open(sys.argv[1], encoding='utf-8'))
for label, kws in QUERIES.items():
    kws = [k.lower() for k in kws]
    rows = []
    for code, blob in BLOBS.items():
        score = sum(blob.count(k) for k in kws)
        if score >= 2:
            rows.append((CNT.get(code,0), -score, code, IDX[code]['title']))
    rows.sort()
    print('### ' + label)
    for used, ns, code, title in rows[:6]:
        print(f"  used={used} hits={-ns} {code} :: {title}")
    print()
