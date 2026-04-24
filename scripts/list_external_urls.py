import json

urls = json.load(open('generated/_full_urls_2026-04-24.json', encoding='utf-8'))
for t, v in urls.items():
    external = []
    for u in v.get('urls', []):
        low = u.lower()
        if 'paypal.com' in low or 'whatsapp.com' in low or 'fortissimo.substack.com' in low:
            continue
        external.append(u.rstrip('\\').rstrip(','))
    print(f'{t}: {external}')
