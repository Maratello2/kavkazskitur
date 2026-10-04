import os
import re
import urllib.request
import urllib.parse
from PIL import Image

os.makedirs('public/brand', exist_ok=True)
os.makedirs('public/tours', exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()

print('Connecting to kavkazskitur.com...')
html_pages = []
for target in ['http://kavkazskitur.com/', 'https://kavkazskitur.com/', 'http://kavkazskitur.com/tours/']:
    try:
        data = fetch_url(target).decode('utf-8', errors='ignore')
        html_pages.append(data)
        print(f'Fetched {target} (length: {len(data)})')
    except Exception as e:
        print(f'Could not fetch {target}: {e}')

combined_html = "\n".join(html_pages)

img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', combined_html, re.IGNORECASE)
bg_urls = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', combined_html, re.IGNORECASE)
all_urls = list(set(img_urls + bg_urls))
print(f'Found {len(all_urls)} candidate image URLs')

saved_count = 0
for idx, u in enumerate(all_urls):
    u_clean = u.strip().split('?')[0]
    if any(u_clean.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']):
        full_url = urllib.parse.urljoin('https://kavkazskitur.com/', u)
        filename = os.path.basename(urllib.parse.urlparse(full_url).path)
        if not filename:
            continue

        is_logo = 'logo' in filename.lower() or 'logo' in u.lower()
        target_dir = 'public/brand' if is_logo else 'public/tours'
        name_no_ext = os.path.splitext(filename)[0]
        webp_name = f'real_{name_no_ext}.webp' if not is_logo else 'logo_kavkazskitur.webp'
        dest_path = os.path.join(target_dir, webp_name)

        try:
            raw = fetch_url(full_url)
            tmp = dest_path + '.tmp'
            with open(tmp, 'wb') as f:
                f.write(raw)
            with Image.open(tmp) as im:
                max_w = 1200 if not is_logo else 600
                if im.width > max_w:
                    ratio = max_w / float(im.width)
                    im = im.resize((max_w, int(im.height * ratio)), Image.Resampling.LANCZOS)
                if im.mode in ('RGBA', 'LA') and not is_logo:
                    im = im.convert('RGB')
                elif im.mode != 'RGB' and not is_logo:
                    im = im.convert('RGB')
                im.save(dest_path, 'WEBP', quality=85)
            if os.path.exists(tmp):
                os.remove(tmp)
            print(f'Downloaded and optimized: {dest_path}')
            saved_count += 1
        except Exception as e:
            # print(f'Skipped {full_url}: {e}')
            pass

print(f'Asset download complete! Saved {saved_count} real assets.')
