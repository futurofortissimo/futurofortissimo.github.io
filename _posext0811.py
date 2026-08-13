import re, html
t = open('_pos_news0811.html', encoding='utf-8', errors='ignore').read()
t = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', t)
t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
t = re.sub(r'\s+', ' ', t)
i = t.find('million dollar seed round')
print(t[max(0, i - 700): i + 4000])
