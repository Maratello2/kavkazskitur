import urllib.request
import re
import urllib.parse
import os

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KavkazskiturMigrationBot/1.0'}

urls_to_crawl = [
    'http://kavkazskitur.com/',
    'http://kavkazskitur.com/tours/elbrus-climb-8-days/',
    'http://kavkazskitur.com/tours/climbing-elbrus-from-the-north-route-8-days-trip/',
    'http://kavkazskitur.com/tours/elbrus-ski-tour-8-days/',
    'http://kavkazskitur.com/tours/climbing-elbrus-irikchat-gorge-10-days/',
    'http://kavkazskitur.com/georgia-kazbek/',
    'http://kavkazskitur.com/tours/trekking-in-the-elbrus-region-5-days/',
    'http://kavkazskitur.com/tours/two-day-trekking-in-north-elbrus-tract-djily-su-and-summit-camps-3800-m/',
    'http://kavkazskitur.com/tours/valley-adyr-su-climbing-camps-ullu-tau-and-djailyk/',
    'http://kavkazskitur.com/tours/mountainous-kabardino-balkaria/',
    'http://kavkazskitur.com/tours/mount-kazbek-ski-tour-8-days/',
    'http://kavkazskitur.com/gallery/',
    'http://kavkazskitur.com/about-us/',
    'http://kavkazskitur.com/contacts/'
]

all_images = set()

for u in urls_to_crawl:
    try:
        req = urllib.request.Request(u, headers=HEADERS)
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https?://(?:www\.)?kavkazskitur\.com/wp-content/uploads/[^\s"\'><]+?\.(?:jpg|jpeg|png|webp)', html, re.IGNORECASE)
        # Also relative matches
        rel_matches = re.findall(r'["\'](/wp-content/uploads/[^\s"\'><]+?\.(?:jpg|jpeg|png|webp))["\']', html, re.IGNORECASE)
        for r in rel_matches:
            matches.append('http://kavkazskitur.com' + r)
        
        for m in matches:
            all_images.add(m)
        print(f'{u}: found {len(matches)} matches')
    except Exception as e:
        print(f'Error crawling {u}: {e}')

print(f'\nTotal unique images from live site: {len(all_images)}')

os.makedirs('scripts', exist_ok=True)
with open('scripts/all_live_images.txt', 'w', encoding='utf-8') as f:
    for img in sorted(all_images):
        f.write(img + '\n')
