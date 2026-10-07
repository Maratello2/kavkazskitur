import re
import os

with open(r'd:/Desktop/kavkazskitur/out/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("Preload tags in out/index.html:")
for p in re.findall(r'<link[^>]*rel="preload"[^>]*>', html):
    print(" ", p)

print("\nJSON-LD structured data present:", "application/ld+json" in html)
print("Theme-color present:", "theme-color" in html)
print("fetchpriority='high' present:", 'fetchpriority="high"' in html.lower())
print("out/.htaccess exists:", os.path.exists(r'd:/Desktop/kavkazskitur/out/.htaccess'))
print("out/api/settings.php exists:", os.path.exists(r'd:/Desktop/kavkazskitur/out/api/settings.php'))
print("out/api/leads.php exists:", os.path.exists(r'd:/Desktop/kavkazskitur/out/api/leads.php'))
print("out/tours/index.html exists:", os.path.exists(r'd:/Desktop/kavkazskitur/out/tours/index.html'))
