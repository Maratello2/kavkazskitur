import re
import json

with open('src/data/toursData.ts', encoding='utf-8') as f:
    text = f.read()

tour_ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", text)
tour_titles = re.findall(r"title:\s*['\"]([^'\"]+)['\"]", text)
print(f"toursData.ts has {len(tour_ids)} tours:")
for i, (tid, title) in enumerate(zip(tour_ids, tour_titles)):
    print(f"  {i+1}. [{tid}] {title}")

with open('src/data/navigation.ts', encoding='utf-8') as f:
    nav_text = f.read()

print("\nNavigation header items in src/data/navigation.ts:")
# find header items or categories
for line in nav_text.split('\n'):
    if 'title:' in line or 'label:' in line or 'href:' in line:
        print("  ", line.strip())
