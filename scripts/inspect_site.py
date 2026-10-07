import urllib.request
import re

import sys

url_base = sys.argv[1] if len(sys.argv) > 1 else "http://5.c19596.nichost.ru"
req = urllib.request.Request(url_base, headers={"User-Agent": "Mozilla/5.0", "Accept-Encoding": "gzip, deflate"})
with urllib.request.urlopen(req) as resp:
    html = resp.read()
    # If gzip
    if resp.headers.get("Content-Encoding") == "gzip":
        import gzip
        html = gzip.decompress(html).decode("utf-8")
    else:
        html = html.decode("utf-8")

print(f"HTML size: {len(html)} bytes")

css_files = list(set(re.findall(r'href="(/_next/static/[^"]+\.css)"', html)))
js_files = list(set(re.findall(r'src="(/_next/static/[^"]+\.js)"', html)))
preloads = re.findall(r'<link[^>]*rel="preload"[^>]*>', html)
images = list(set(re.findall(r'src="(/[^"]+\.(?:webp|jpg|png|svg))"', html)))

print(f"Found {len(css_files)} CSS files: {css_files}")
print(f"Found {len(js_files)} JS files: {js_files}")
print(f"Found {len(preloads)} Preload tags: {preloads}")
print(f"Found {len(images)} images in HTML: {images[:10]}")

test_assets = css_files[:2] + js_files[:2] + ["/hero/summit_apex_5642_mobile.webp", "/hero/summit_apex_5642.webp"]

for asset in test_assets:
    url = f"{url_base}{asset}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Encoding": "gzip, deflate"})
        with urllib.request.urlopen(req) as r:
            body = r.read()
            print(f"\n--- Asset: {asset} ---")
            print(f"Status: {r.status}")
            print(f"Cache-Control: {r.headers.get('Cache-Control')}")
            print(f"Content-Type: {r.headers.get('Content-Type')}")
            print(f"Content-Encoding: {r.headers.get('Content-Encoding')}")
            print(f"Raw Size: {len(body)} bytes")
    except Exception as e:
        print(f"Error fetching {asset}: {e}")
