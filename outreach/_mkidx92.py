# -*- coding: utf-8 -*-
import json, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
src = open(r'C:/Users/micme/Desktop/micmer/futuro fortissimo/data.js', encoding='utf-8').read()
src = src[src.index('['):]
src = src.rstrip().rstrip(';')
data = json.loads(src)
idx = {}
pat = re.compile(r'ff\.(\d+)\.(\d+)')
for post in data:
    for sc in post.get('subchapters', []):
        m = pat.search(sc.get('title',''))
        if not m: continue
        code = 'ff.%s.%s' % (m.group(1), m.group(2))
        if code in idx: continue
        idx[code] = {'title': sc['title'], 'link': sc.get('link',''), 'content': sc.get('content',''),
                     'post_title': post.get('title',''), 'post_url': post.get('url','')}
json.dump(idx, open('_ffidx_b92.json','w',encoding='utf-8'), ensure_ascii=False)
print('subchapters indexed:', len(idx))
print('posts:', len(data))
