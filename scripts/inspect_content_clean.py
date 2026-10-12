import json
import re

with open('scripts/wp_tours_full_dump.json', encoding='utf-8') as f:
    d = json.load(f)

for t in d['tours'][:5]:
    print("="*60)
    print("TITLE:", t['title'])
    print("SLUG:", t['slug'])
    print("PRICE:", t['price'])
    print("THUMB:", t['thumb_url'])
    print("GALLERY COUNT:", len(t['gallery_urls']))
    print("SAMPLE CONTENT (first 500 chars):")
    # clean basic visual composer shortcodes
    clean = re.sub(r'\[/?vc_[^\]]*\]', '', t['content'])
    clean = re.sub(r'\[/?tour_[^\]]*\]', '', clean)
    print(clean[:500].strip())
