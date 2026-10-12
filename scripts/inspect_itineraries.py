import json
import re

with open('data/toursData.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

count = ts_code.count('"itinerary": [')
print(f"Itineraries in toursData.ts: {count}")

with open('data/tours.json', 'r', encoding='utf-8') as f:
    tours_json = json.load(f)

print(f"Tours in tours.json: {len(tours_json)}")
if tours_json:
    print("Keys in tours.json[0]:", list(tours_json[0].keys()))
