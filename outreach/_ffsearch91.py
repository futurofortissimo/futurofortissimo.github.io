# -*- coding: utf-8 -*-
"""Search ff index (batch90) by keyword; rank by hits, show snippet + tracker usage."""
import json, sys, io, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

IDX = json.load(open(r'C:/Users/micme/Desktop/micmer/futuro fortissimo/outreach/_ffidx_b91.json', encoding='utf-8'))
T = json.load(open(r'C:/Users/micme/Desktop/openclaw/ff_outreach_tracker.json', encoding='utf-8'))
CNT = collections.Counter(x.get('ff_post') for x in T['contacts'])

kws = [k.lower() for k in sys.argv[1:]]
rows = []
for code, v in IDX.items():
    blob = (v['title'] + ' ' + v['content']).lower()
    score = sum(blob.count(k) for k in kws)
    if score:
        pos = min((blob.find(k) for k in kws if blob.find(k) >= 0), default=0)
        snip = v['content'][max(0, pos - 120):pos + 320].replace('\n', ' ')
        rows.append((score, CNT.get(code, 0), code, v['title'], snip))
rows.sort(key=lambda r: (-r[0], r[1]))
for score, used, code, title, snip in rows[:8]:
    print(f"used={used} hits={score} {code} :: {title}")
    print("   " + snip)
