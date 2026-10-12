import json
import re
import os

with open('scripts/wp_tours_full_dump.json', encoding='utf-8') as f:
    dump = json.load(f)

# 1. Define Canonical Categories
CATEGORIES = [
    {
        "id": "climbing",
        "name": "Climbing & Summits",
        "slug": "climbing",
        "headerGroup": "ELBRUS 5642M",
        "description": "High-altitude ascents of Mount Elbrus and Kazbek",
        "badge": "5,642m",
        "icon": "Mountain",
        "showInHeader": True,
        "order": 1
    },
    {
        "id": "skitour",
        "name": "Ski-Tour & Freeride",
        "slug": "skitour",
        "headerGroup": "ELBRUS 5642M",
        "description": "Spring backcountry and off-piste ski mountaineering",
        "badge": "Freeride",
        "icon": "Compass",
        "showInHeader": True,
        "order": 2
    },
    {
        "id": "trekking",
        "name": "Alpine Trekking & Hikes",
        "slug": "trekking",
        "headerGroup": "PEAKS & TREKKING",
        "description": "Multi-day mountain passes, glaciers, and alpine lake traverses",
        "badge": "High Trails",
        "icon": "Compass",
        "showInHeader": True,
        "order": 3
    },
    {
        "id": "jeep-tours",
        "name": "Off-Road 4x4 Jeep Tours",
        "slug": "jeep-tours",
        "headerGroup": "ACTIVITIES",
        "description": "Wild highland plateau safaris to Bermamyt, Kanzhol & Digoria",
        "badge": "4x4 Fleet",
        "icon": "Compass",
        "showInHeader": True,
        "order": 4
    },
    {
        "id": "excursions",
        "name": "Excursions & Canyons",
        "slug": "excursions",
        "headerGroup": "ACTIVITIES",
        "description": "Sulak Canyon, Grozny, Blue Lakes, and ancient towers",
        "badge": "Cultural",
        "icon": "Sparkles",
        "showInHeader": True,
        "order": 5
    },
    {
        "id": "snowshoeing",
        "name": "Winter Snowshoeing Treks",
        "slug": "snowshoeing",
        "headerGroup": "ACTIVITIES",
        "description": "Winter expeditions in Elbrus, Adyl-Su and Adyr-Su valleys",
        "badge": "Winter",
        "icon": "Mountain",
        "showInHeader": True,
        "order": 6
    },
    {
        "id": "georgia",
        "name": "Georgia & Transcaucasia",
        "slug": "georgia",
        "headerGroup": "EXPEDITIONS & REGIONS",
        "description": "Mount Kazbek summits, Stepantsminda, Tbilisi & Kakheti",
        "badge": "5,033m",
        "icon": "Globe",
        "showInHeader": True,
        "order": 7
    }
]

def clean_html(text):
    if not text:
        return ""
    # remove Visual Composer shortcodes [vc_...] [/vc_...]
    text = re.sub(r'\[/?vc_[^\]]*\]', '', text)
    text = re.sub(r'\[/?tour_[^\]]*\]', '', text)
    text = re.sub(r'\[/?title[^\]]*\]', '', text)
    # clean table tags, div tags, html formatting to clean text
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    # convert <br>, <p>, <tr> to newlines
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'</tr>', '\n', text)
    text = re.sub(r'</td>', ' | ', text)
    # remove other html tags
    text = re.sub(r'<[^>]+>', '', text)
    # clean extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def determine_category(wp_tour):
    cats = [c['name'].lower() for c in wp_tour.get('categories', [])]
    slugs = [c['slug'].lower() for c in wp_tour.get('categories', [])]
    title = wp_tour.get('title', '').lower()
    
    # 1. Ski-Tour
    if any('ski-tour' in c or 'skitour' in c for c in cats + slugs) or 'ski-tour' in title or 'ski tour' in title:
        return ('skitour', 'Ski-Tour & Freeride')
    
    # 2. Snowshoeing
    if any('snowshoe' in c for c in cats + slugs) or 'snowshoe' in title:
        return ('snowshoeing', 'Winter Snowshoeing Treks')

    # 3. Climbing / Summit
    if any('climb' in c or 'summit' in c for c in cats + slugs) or 'climb' in title or 'summit' in title:
        if 'kazbek' in title or any('georgia' in c for c in cats + slugs):
            return ('georgia', 'Georgia & Transcaucasia')
        return ('climbing', 'Climbing & Summits')

    # 4. Georgia / Armenia / Azerbaijan
    if any('georgia' in c or 'armenia' in c or 'azerbaijan' in c for c in cats + slugs) or 'kazbek' in title or 'tbilisi' in title:
        return ('georgia', 'Georgia & Transcaucasia')

    # 5. Jeep Tours
    if any('jeep' in c for c in cats + slugs) or 'jeep' in title:
        return ('jeep-tours', 'Off-Road 4x4 Jeep Tours')

    # 6. Trekking / Hikes
    if any('trek' in c or 'hike' in c for c in cats + slugs) or 'trek' in title or 'hike' in title or 'lake' in title or 'valley' in title or 'waterfall' in title:
        return ('trekking', 'Alpine Trekking & Hikes')

    # 7. Excursions
    if any('excursion' in c for c in cats + slugs) or 'canyon' in title or 'city' in title or 'resort' in title:
        return ('excursions', 'Excursions & Canyons')

    return ('trekking', 'Alpine Trekking & Hikes')

def determine_difficulty(title, category):
    t = title.lower()
    if 'summit' in t or 'climb' in t or category == 'climbing' or 'traverse' in t:
        return 'Demanding' if 'north' not in t and 'kazbek' not in t else 'Extreme'
    if 'ski-tour' in t:
        return 'Demanding'
    if 'jeep' in t or 'excursion' in t or 'resort' in t or 'city' in t:
        return 'Moderate'
    if 'two-day' in t or 'pass' in t or 'glacier' in t:
        return 'Demanding'
    return 'Moderate'

def determine_duration(title, tour_info):
    if tour_info.get('tour_duration'):
        return tour_info['tour_duration']
    m = re.search(r'(\d+)\s*(days?|nights?|hours?)', title, re.IGNORECASE)
    if m:
        return f"{m.group(1)} {m.group(2)}"
    if 'jeep' in title.lower() or 'excursion' in title.lower() or 'waterfall' in title.lower():
        return "1 day"
    return "1-2 days"

def determine_altitude(title, category):
    t = title.lower()
    if 'elbrus' in t and ('climb' in t or 'summit' in t or 'traverse' in t or 'ski' in t):
        return '5,642 m'
    if 'kazbek' in t:
        return '5,033 m'
    if 'bezengi' in t:
        return '4,200 m'
    if 'bermamyt' in t:
        return '2,592 m'
    if 'kanzhol' in t:
        return '2,950 m'
    if 'cheget' in t:
        return '3,700 m'
    if 'terskol' in t or 'azau' in t:
        return '3,100 m'
    if 'djily-su' in t or 'dzhily-su' in t:
        return '2,400 m'
    if 'syltran' in t:
        return '3,180 m'
    return '2,200 m'

def clean_image_url(url):
    if not url:
        return ""
    # strip http://kavkazskitur.com or https://kavkazskitur.com
    url = re.sub(r'^https?://[^/]+', '', url)
    return url

processed_tours = []
seen_slugs = set()

for idx, t in enumerate(dump['tours']):
    title = t['title'].strip()
    slug = t['slug'].strip()
    if not slug:
        slug = f"tour-{t['id']}"
    if slug in seen_slugs:
        slug = f"{slug}-{t['id']}"
    seen_slugs.add(slug)

    price_val = 0
    try:
        price_val = int(float(t['price'])) if t.get('price') else 0
    except:
        price_val = 0

    if price_val == 0:
        price_val = 3500

    cat_slug, cat_name = determine_category(t)
    difficulty = determine_difficulty(title, cat_slug)
    duration = determine_duration(title, t)
    altitude = determine_altitude(title, cat_slug)

    thumb = clean_image_url(t.get('thumb_url') or '')
    gallery = [clean_image_url(u) for u in t.get('gallery_urls', []) if u]

    if not thumb and gallery:
        thumb = gallery[0]

    raw_content = t.get('content', '')
    cleaned_desc = clean_html(raw_content)
    if not cleaned_desc or len(cleaned_desc) < 40:
        cleaned_desc = f"Guided expedition '{title}' organized by KavKazSkiTur certified high-altitude mountain masters. Complete transport logistics, mountain safety, and base camp accommodation in the Central Caucasus."

    duration_days = 1
    m_days = re.search(r'(\d+)\s*day', duration, re.IGNORECASE)
    if m_days:
        duration_days = int(m_days.group(1))

    schedule = [
        {"dates": "14 Jun — 21 Jun 2026", "spotsLeft": 4, "capacity": 12, "status": "available"},
        {"dates": "05 Jul — 12 Jul 2026", "spotsLeft": 2, "capacity": 12, "status": "few_spots"},
        {"dates": "02 Aug — 09 Aug 2026", "spotsLeft": 6, "capacity": 12, "status": "available"},
        {"dates": "23 Aug — 30 Aug 2026", "spotsLeft": 8, "capacity": 12, "status": "available"}
    ] if duration_days > 3 else [
        {"dates": "Daily Departure (Summer/Autumn 2026)", "spotsLeft": 6, "capacity": 8, "status": "available"}
    ]

    processed = {
        "id": t['id'],
        "slug": slug,
        "name": title,
        "title": title,
        "category": cat_slug,
        "category_name": cat_name,
        "categories": [c['slug'] for c in t.get('categories', [])],
        "price": price_val,
        "priceRub": price_val,
        "priceUsd": round(price_val / 92.5),
        "difficulty": difficulty,
        "altitude": altitude,
        "duration": duration,
        "durationDays": duration_days,
        "cover_image": thumb,
        "image": thumb,
        "gallery": gallery[:12], # select top 12 gallery photos for fast performance
        "description": cleaned_desc[:2500], # clean description
        "full_content": cleaned_desc,
        "is_published": True,
        "is_featured": idx < 6,
        "status": "Active",
        "capacity": 12 if duration_days > 3 else 8,
        "schedule2026": schedule
    }
    processed_tours.append(processed)

print(f"Processed {len(processed_tours)} complete tours!")

# 1. Save data/categories.json
os.makedirs('data', exist_ok=True)
with open('data/categories.json', 'w', encoding='utf-8') as f:
    json.dump(CATEGORIES, f, ensure_ascii=False, indent=2)
print("Saved data/categories.json")

# 2. Save data/tours.json
with open('data/tours.json', 'w', encoding='utf-8') as f:
    json.dump(processed_tours, f, ensure_ascii=False, indent=2)
print("Saved data/tours.json")

