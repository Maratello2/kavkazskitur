import json

with open('scripts/wp_tours_dump.json', encoding='utf-8') as f:
    d = json.load(f)

print(f"Total tours: {len(d['tours'])}")

# Check category distribution
cat_counts = {}
for t in d['tours']:
    for c in t['categories']:
        cat_counts[c['name']] = cat_counts.get(c['name'], 0) + 1

print("\nTour counts per category in WP:")
for cat, cnt in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {cnt} tours")

# Check sample images
print("\nSample image URLs from WP tours:")
for t in d['tours'][:10]:
    thumb = t.get('thumb_url')
    gal = t.get('gallery_urls', [])
    print(f"[{t['id']}] {t['title']}")
    print(f"   Thumb: {thumb}")
    print(f"   Gallery: {len(gal)} images (sample: {gal[0] if gal else 'None'})")
