import json

with open('scripts/wp_tours_dump.json', encoding='utf-8') as f:
    d = json.load(f)

# find tour 134
t134 = next(t for t in d['tours'] if t['id'] == 134)
print("Title:", t134['title'])
print("Keys:", list(t134.keys()))
print("Thumb:", t134.get('thumb_url'))
print("Gallery count:", len(t134.get('gallery_urls', [])))
print("Content length:", t134.get('content_len'))
