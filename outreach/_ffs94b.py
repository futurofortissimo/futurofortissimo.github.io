# -*- coding: utf-8 -*-
import json, sys, io, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
IDX = json.load(open('_ffidx_b94.json', encoding='utf-8'))
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))
CNT = collections.Counter(x.get('ff_post') for x in T['contacts'])
kws = [k.lower() for k in sys.argv[1:]]
rows = []
for code, v in IDX.items():
    blob = (v['title'] + ' ' + v['content']).lower()
    score = sum(blob.count(k) for k in kws)
    if score:
        rows.append((score, CNT.get(code, 0), code, v['title']))
rows.sort(key=lambda r: -r[0])
for score, used, code, title in rows[:8]:
    print(f"hits={score} used={used} {code} :: {title[:70]}")
