import re
import os

with open('src/data/toursData.ts', encoding='utf-8') as f:
    text = f.read()

all_imgs = re.findall(r'[\'"](/tours/[^\'"]+)[\'"]', text)
print(f'Unique tour image paths in toursData.ts: {len(set(all_imgs))}')
for img in sorted(set(all_imgs)):
    local_p = os.path.join('public', img.lstrip('/'))
    exists = os.path.exists(local_p)
    size = os.path.getsize(local_p) if exists else 0
    print(f'{img:55} exists={str(exists):5} size={size}')
