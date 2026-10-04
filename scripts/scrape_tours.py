# One-off scraper: pulls real tour titles, prices, descriptions and hero
# images from the live kavkazskitur.com WordPress site so the new English
# homepage/expeditions dataset uses authentic content instead of Unsplash
# stock photography.
#
# Run manually: python scripts/scrape_tours.py
# Downloads images into public/tours/<slug>.webp and writes
# scripts/_scraped_tours.json for lib/toursData.ts to be authored from.

import json
import os
import re
import time
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

BASE = 'http://kavkazskitur.com'
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KavkazskiturMigrationBot/1.0'}

TOUR_SLUGS = [
    ('elbrus-climb-8-days', 'climbing'),
    ('climbing-elbrus-irikchat-gorge-10-days', 'climbing'),
    ('elbrus-ski-tour-8-days', 'ski-tour'),
    ('climbing-elbrus-from-the-north-route-8-days-trip', 'climbing'),
    ('mount-kazbek-climb-5033-m-south-route-9-days-trip', 'climbing'),
    ('mount-kazbek-ski-tour-8-days', 'ski-tour'),
    ('valley-adyr-su-climbing-camps-ullu-tau-and-djailyk', 'trekking'),
    ('two-day-trekking-in-north-elbrus-tract-djily-su-and-summit-camps-3800-m', 'trekking'),
    ('mountainous-kabardino-balkaria', '4x4-expedition'),
]

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'tours')
os.makedirs(OUT_DIR, exist_ok=True)

session = requests.Session()
session.headers.update(HEADERS)


def clean_text(s):
    return re.sub(r'\s+', ' ', s or '').strip()


def download_and_convert(img_url, slug):
    try:
        resp = session.get(img_url, timeout=20)
        resp.raise_for_status()
        im = Image.open(BytesIO(resp.content)).convert('RGB')
        max_w = 1600
        if im.width > max_w:
            ratio = max_w / float(im.width)
            im = im.resize((max_w, int(im.height * ratio)), Image.Resampling.LANCZOS)
        out_path = os.path.join(OUT_DIR, f'{slug}.webp')
        im.save(out_path, 'WEBP', quality=82, method=6)
        return f'/tours/{slug}.webp'
    except Exception as e:
        print(f'  ! image download failed for {slug}: {e}')
        return None


def scrape_tour(slug, category):
    url = f'{BASE}/tours/{slug}/'
    print('Fetching', url)
    try:
        resp = session.get(url, timeout=20)
        resp.raise_for_status()
    except Exception as e:
        print('  ! failed:', e)
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    title_tag = soup.find('h1')
    title = clean_text(title_tag.get_text()) if title_tag else slug

    # WooCommerce price
    price = None
    price_tag = soup.select_one('.price, .woocommerce-Price-amount')
    if price_tag:
        price = clean_text(price_tag.get_text())

    # Main gallery image (WordPress theme uses .attachment-thumb_gallery)
    img_url = None
    img_tag = soup.select_one('img.attachment-thumb_gallery, img.size-thumb_gallery')
    if img_tag and img_tag.get('src'):
        img_url = img_tag['src']

    # Description: first substantial <p> in the main content area
    content = soup.select_one('#content') or soup.select_one('.site-content') or soup.body
    description = ''
    if content:
        for p in content.find_all('p'):
            text = clean_text(p.get_text(' '))
            if len(text) > 80:
                description = text[:500]
                break

    local_image = None
    if img_url:
        if img_url.startswith('//'):
            img_url = 'http:' + img_url
        local_image = download_and_convert(img_url, slug)

    return {
        'slug': slug,
        'category': category,
        'title': title,
        'price': price,
        'description': description,
        'sourceImage': img_url,
        'localImage': local_image,
    }


results = []
for slug, category in TOUR_SLUGS:
    data = scrape_tour(slug, category)
    if data:
        results.append(data)
    time.sleep(1)

out_json = os.path.join(os.path.dirname(__file__), '_scraped_tours.json')
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f'\nDone. Scraped {len(results)} tours -> {out_json}')
