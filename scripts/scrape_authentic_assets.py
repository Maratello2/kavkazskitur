import urllib.request
import urllib.parse
import re
import os
from PIL import Image

os.makedirs('public/brand', exist_ok=True)
os.makedirs('public/tours', exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

def download(url, dest):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as r, open(dest, 'wb') as f:
            f.write(r.read())
        return True
    except Exception as e:
        print(f'Failed {url}: {e}')
        return False

# 1. Fetch homepage to find logo
print('Fetching homepage for logo...')
logo_downloaded = False
try:
    req = urllib.request.Request('http://kavkazskitur.com/', headers=HEADERS)
    html = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', errors='ignore')
    
    # Check all img tags
    logo_matches = re.findall(r'<img[^>]+src=["\']([^"\']*(?:logo|kavkaz|tur)[^"\']*\.(?:png|jpg|jpeg|webp|svg))["\']', html, re.IGNORECASE)
    for l_url in logo_matches:
        full_l = urllib.parse.urljoin('http://kavkazskitur.com/', l_url)
        print(f'Trying logo candidate: {full_l}')
        if download(full_l, 'public/brand/logo_raw.png'):
            logo_downloaded = True
            print(f'Logo downloaded: {full_l}')
            break
except Exception as e:
    print(f'Error fetching logo: {e}')

if not logo_downloaded:
    # Check if logo_kavkazskitur.webp already exists
    if os.path.exists('public/brand/logo_kavkazskitur.webp'):
        print('Using existing public/brand/logo_kavkazskitur.webp')
        # Convert to logo_raw.png as well
        with Image.open('public/brand/logo_kavkazskitur.webp') as im:
            im.save('public/brand/logo_raw.png')
        logo_downloaded = True

# 2. Scrape specific tour pages for authentic Caucasus photos
tour_pages = {
    'elbrus_south': 'http://kavkazskitur.com/tours/elbrus-climb-8-days/',
    'elbrus_north': 'http://kavkazskitur.com/tours/climbing-elbrus-from-the-north-route-8-days-trip/',
    'skitour_elbrus': 'http://kavkazskitur.com/tours/elbrus-ski-tour-8-days/',
    'irikchat': 'http://kavkazskitur.com/tours/climbing-elbrus-irikchat-gorge-10-days/',
    'kazbek': 'http://kavkazskitur.com/georgia-kazbek/',
    'terskol': 'http://kavkazskitur.com/tours/trekking-in-the-elbrus-region-5-days/'
}

for tour_key, p_url in tour_pages.items():
    try:
        print(f'Scraping {tour_key} from {p_url}...')
        req_p = urllib.request.Request(p_url, headers=HEADERS)
        p_html = urllib.request.urlopen(req_p, timeout=20).read().decode('utf-8', errors='ignore')
        
        # Look for wp-content/uploads images
        imgs = re.findall(r'src=["\']([^"\']+/wp-content/uploads/[^"\']+\.(?:jpg|jpeg|png|webp))["\']', p_html, re.IGNORECASE)
        saved = 0
        for img in imgs:
            if not any(bad in img.lower() for bad in ['avatar', 'thumb-', '-150x', '-100x']):
                full_img = urllib.parse.urljoin('http://kavkazskitur.com/', img)
                dest_file = f'public/tours/auth_{tour_key}_{saved}.webp'
                tmp_file = dest_file + '.tmp'
                if download(full_img, tmp_file):
                    try:
                        with Image.open(tmp_file) as im:
                            if im.mode in ('RGBA', 'LA'):
                                im = im.convert('RGB')
                            max_w = 1200
                            if im.width > max_w:
                                r = max_w / float(im.width)
                                im = im.resize((max_w, int(im.height * r)), Image.Resampling.LANCZOS)
                            im.save(dest_file, 'WEBP', quality=85)
                        if os.path.exists(tmp_file): os.remove(tmp_file)
                        print(f'Saved {dest_file} from {full_img}')
                        saved += 1
                        if saved >= 3:
                            break
                    except Exception as e:
                        print(f'Failed converting {tmp_file}: {e}')
    except Exception as e:
        print(f'Error on {p_url}: {e}')

print('Asset scraping step completed.')
