import re

with open(r'C:\Users\maratello\.gemini\antigravity\brain\9a1559c0-f17a-497f-9a0e-f46526b7dfaf\.system_generated\steps\11975\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))
keywords = ["performance", "largest_contentful_paint", "cumulative_layout_shift", "First Contentful Paint", "Speed Index", "Total Blocking Time"]
for kw in keywords:
    count = text.lower().count(kw.lower())
    print(f"{kw}: {count} occurrences")

# Find any JSON blocks or data objects
pos = text.find("WIZ_global_data")
if pos != -1:
    print("Found WIZ_global_data snippet:")
    print(text[pos:pos+500])
