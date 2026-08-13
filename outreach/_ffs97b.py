# -*- coding: utf-8 -*-
import json, sys, io, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
IDX = json.load(open(r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach/_ffidx_b97.json', encoding='utf-8'))
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))
CNT = collections.Counter(x.get('ff_post') for x in T['contacts'])
kws = [k.lower() for k in sys.argv[1:]]
rows = []
for code, v in IDX.items():
    blob = (v['title'] + ' ' + v['content']).lower()
    hits = {k: blob.count(k) for k in kws}
    matched = sum(1 for k in kws if hits[k] > 0)
    score = sum(hits.values())
    if matched == 0:
        continue
    rows.append((matched, score, CNT.get(code, 0), code, v['title'], len(v['content'])))
rows.sort(key=lambda r: (-r[0], -r[1], r[2]))
for matched, score, used, code, title, ln in rows[:12]:
    print(f"m={matched} hits={score} used={used} len={ln} {code} :: {title}")
