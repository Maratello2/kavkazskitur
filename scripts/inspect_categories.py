import json

with open('scripts/wp_tours_full_dump.json', encoding='utf-8') as f:
    d = json.load(f)

cats_map = {}
for t in d['tours']:
    for c in t['categories']:
        cid = c['term_id']
        if cid not in cats_map:
            cats_map[cid] = {'id': cid, 'name': c['name'], 'slug': c['slug'], 'count': 0}
        cats_map[cid]['count'] += 1

print(f"Total categories used: {len(cats_map)}")
for c in sorted(cats_map.values(), key=lambda x: -x['count']):
    print(f"  [{c['id']}] {c['name']} (slug: {c['slug']}, tours: {c['count']})")
