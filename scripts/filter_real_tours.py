import json

with open('scripts/wp_tours_dump.json', encoding='utf-8') as f:
    d = json.load(f)

dummy_cats = {'Lights', 'Knives and Tools', 'Backpacks', 'Sleeping Bags'}

real_tours = []
for t in d['tours']:
    cat_names = {c['name'] for c in t['categories']}
    if cat_names.intersection(dummy_cats):
        continue
    if not t['thumb_url'] and len(t['gallery_urls']) == 0:
        continue
    real_tours.append(t)

print(f"Real tours with content & images: {len(real_tours)}")
for t in real_tours:
    cats = [c['name'] for c in t['categories']]
    print(f"[{t['id']}] {t['title']} | {t['price']} RUB | {cats[:2]}")
