import re, json
from pathlib import Path

urls_backup = json.load(open('generated/_full_urls_2026-04-24.json', encoding='utf-8'))
all_backup_urls = set()
for t, v in urls_backup.items():
    for u in v.get('urls', []):
        cleaned = u.rstrip('\\').rstrip(',').rstrip('.')
        all_backup_urls.add(cleaned)

# Whitelist helpers already in other backup blocks
# For completeness, grep the full backup files for ALL urls
for src in ['futuro_fortissimo_full_data.txt', 'futuro_fortissimo_full_data_139_89.txt']:
    txt = Path(src).read_text(encoding='utf-8', errors='ignore')
    for u in re.findall(r'https?://[^\s"\'<>\\]+', txt):
        all_backup_urls.add(u.rstrip('\\').rstrip(',').rstrip('.'))

bad = []
for p in Path('book').glob('chapter-*.html'):
    txt = p.read_text(encoding='utf-8')
    for m in re.finditer(r'<!-- ===== inject 2026-04-24 extend.*?</p>', txt, re.DOTALL):
        block = m.group(0)
        code_m = re.search(r'\((ff\.[\d\.]+)\)', block)
        code = code_m.group(1) if code_m else '?'
        for href_m in re.finditer(r'href="(https?://[^"]+)"', block):
            u = href_m.group(1)
            matched = False
            if u in all_backup_urls:
                matched = True
            else:
                for b in all_backup_urls:
                    if u.rstrip('/') == b.rstrip('/'):
                        matched = True
                        break
            if not matched:
                bad.append((code, u, p.name))

print(f'Out-of-corpus URLs remaining: {len(bad)}')
for code, u, f in bad:
    print(f'  {code} [{f}]: {u}')
