import json
import re

# Read toursData.ts
with open('data/toursData.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Extract the JSON array from export const TOURS_DATA: TourData[] = [ ... ];
match = re.search(r'export const TOURS_DATA: TourData\[\] = (\[.*?\]);\s*export function', ts_code, re.DOTALL)
if not match:
    print("Could not match TOURS_DATA array regex!")
    exit(1)

ts_tours = json.loads(match.group(1))
print(f"Loaded {len(ts_tours)} tours from toursData.ts")

# Create a map by slug and id
ts_map = {}
for t in ts_tours:
    ts_map[t['slug']] = t
    ts_map[str(t['id'])] = t

# Read tours.json
with open('data/tours.json', 'r', encoding='utf-8') as f:
    tours_json = json.load(f)

merged_count = 0
for tour in tours_json:
    slug = tour.get('slug')
    tour_id = str(tour.get('id'))
    src = ts_map.get(slug) or ts_map.get(tour_id)
    if src:
        # Merge itinerary if not already present or empty
        if 'itinerary' in src and src['itinerary']:
            tour['itinerary'] = src['itinerary']
            merged_count += 1
        if 'included' in src and src['included']:
            tour['included'] = src['included']
        if 'excluded' in src and src['excluded']:
            tour['excluded'] = src['excluded']
        if 'elevationProfile' in src and src['elevationProfile']:
            tour['elevationProfile'] = src['elevationProfile']
        if 'highlights' in src and src['highlights']:
            tour['highlights'] = src['highlights']

print(f"Merged itineraries into {merged_count} of {len(tours_json)} tours in tours.json")

# Write to data/tours.json and src/data/tours.json
with open('data/tours.json', 'w', encoding='utf-8') as f:
    json.dump(tours_json, f, ensure_ascii=False, indent=2)

with open('src/data/tours.json', 'w', encoding='utf-8') as f:
    json.dump(tours_json, f, ensure_ascii=False, indent=2)

print("Saved updated tours.json successfully!")
