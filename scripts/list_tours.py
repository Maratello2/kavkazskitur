import re

with open('src/data/toursData.ts', encoding='utf-8') as f:
    text = f.read()

# Match each tour definition
chunks = text.split('id: \'')
for chunk in chunks[1:]:
    tour_id = chunk.split("'")[0]
    title_match = re.search(r"title:\s*'([^']+)'", chunk)
    title = title_match.group(1) if title_match else 'No title'
    image_match = re.search(r"image:\s*'([^']+)'", chunk)
    img = image_match.group(1) if image_match else 'No image'
    cover_match = re.search(r"coverImage:\s*'([^']+)'", chunk)
    cover = cover_match.group(1) if cover_match else 'No cover'
    gallery_match = re.search(r"gallery:\s*\[(.*?)\]", chunk, re.DOTALL)
    gallery_str = gallery_match.group(1) if gallery_match else ''
    gallery_items = [g.strip().strip("'\"") for g in gallery_str.split(',') if g.strip()]
    print(f"ID: {tour_id}")
    print(f"  Title: {title}")
    print(f"  Image: {img}")
    print(f"  Cover: {cover}")
    print(f"  Gallery ({len(gallery_items)}): {gallery_items}")
    print("-" * 50)
