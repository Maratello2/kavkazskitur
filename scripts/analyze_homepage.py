import re
import os

with open(r'd:\Desktop\kavkazskitur\out\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'src="/_next/static/chunks/([^"]+)"', html)
print(f"Homepage loads {len(scripts)} scripts:")
total_bytes = 0
for s in scripts:
    p = os.path.join(r'd:\Desktop\kavkazskitur\out\_next\static\chunks', s)
    sz = os.path.getsize(p) if os.path.exists(p) else 0
    total_bytes += sz
    print(f"  - {sz // 1024} KB: {s}")

print(f"Total homepage JS: {total_bytes // 1024} KB")

# CSS
css_files = re.findall(r'href="/_next/static/css/([^"]+)"', html)
print(f"\nHomepage loads {len(css_files)} CSS files:")
for c in css_files:
    p = os.path.join(r'd:\Desktop\kavkazskitur\out\_next\static\css', c)
    sz = os.path.getsize(p) if os.path.exists(p) else 0
    print(f"  - {sz // 1024} KB: {c}")
