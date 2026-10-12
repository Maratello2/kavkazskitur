import json
import os

with open('scripts/wp_tours_dump.json', encoding='utf-8') as f:
    wp_data = json.load(f)

print(f"Total WP published tours: {len(wp_data['tours'])}")

print("\n=== WP Product Categories (with count > 0) ===")
for c in wp_data['categories']:
    if c['taxonomy'] == 'product_cat' and c['count'] > 0:
        print(f"  {c['name']} (slug: {c['slug']}, count: {c['count']})")

print("\n=== All WP Tours ===")
for t in wp_data['tours']:
    cats = [c['name'] for c in t['categories']]
    print(f"[{t['id']}] {t['title']} | Price: {t['price']} RUB | Slug: {t['slug']} | Cats: {cats} | Thumb: {'YES' if t['thumb_url'] else 'NO'} | Gal: {len(t['gallery_urls'])}")
