import os
import requests
from PIL import Image
from io import BytesIO

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KavkazskiturMigrationBot/1.0'}

# A wide, high-res Elbrus summit shot pulled from the live site's uploads,
# used verbatim in scripts/_home.html <img> discovery earlier.
CANDIDATES = [
    'http://kavkazskitur.com/wp-content/uploads/2022/07/DSC_3491-1-scaled-360x240.jpg',
    'http://kavkazskitur.com/wp-content/uploads/2022/07/DSC00528-scaled-360x240.jpg',
    'http://kavkazskitur.com/wp-content/uploads/2022/09/P1055743-360x240.jpg',
]

# Try to grab the original (un-cropped) version by stripping the WordPress
# "-360x240" size suffix, falling back to the thumb if the original 404s.
def original_url(u):
    for suffix in ['-360x240.jpg', '-720x480.jpg']:
        if u.endswith(suffix):
            return u[: -len(suffix)] + '.jpg'
    return u

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'hero')
os.makedirs(OUT_DIR, exist_ok=True)

session = requests.Session()
session.headers.update(HEADERS)

for i, url in enumerate(CANDIDATES):
    for candidate in [original_url(url), url]:
        try:
            resp = session.get(candidate, timeout=20)
            resp.raise_for_status()
            im = Image.open(BytesIO(resp.content)).convert('RGB')
            if im.width < 600:
                continue
            max_w = 1920
            if im.width > max_w:
                ratio = max_w / float(im.width)
                im = im.resize((max_w, int(im.height * ratio)), Image.Resampling.LANCZOS)
            out_path = os.path.join(OUT_DIR, f'hero-{i+1}.webp')
            im.save(out_path, 'WEBP', quality=82, method=6)
            print('Saved', out_path, im.size, 'from', candidate)
            break
        except Exception as e:
            print('  failed', candidate, e)
