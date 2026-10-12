import MySQLdb
import json
import re

db = MySQLdb.connect(host='localhost', user='c19596_u8', passwd='rc5HRhoZ20', db='c19596_db2', charset='utf8mb4')
cur = db.cursor(MySQLdb.cursors.DictCursor)

# 1. Categories
cur.execute('''
SELECT t.term_id, t.name, t.slug, tt.taxonomy, tt.count, tt.parent
FROM cms_wp_terms t
JOIN cms_wp_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy IN ('product_cat', 'tour_category')
ORDER BY tt.count DESC
''')
categories = cur.fetchall()

# 2. Published Products (Tours)
cur.execute('''
SELECT p.ID, p.post_title, p.post_name, p.post_status, p.post_date, p.post_content, p.post_excerpt
FROM cms_wp_posts p
WHERE p.post_type = 'product' AND p.post_status = 'publish'
ORDER BY p.ID ASC
''')
products = cur.fetchall()

all_tours = []
dummy_cats = {'Lights', 'Knives and Tools', 'Backpacks', 'Sleeping Bags'}

for p in products:
    pid = p['ID']

    # Categories
    cur.execute('''
    SELECT t.term_id, t.name, t.slug FROM cms_wp_terms t
    JOIN cms_wp_term_taxonomy tt ON t.term_id = tt.term_id
    JOIN cms_wp_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
    WHERE tr.object_id = %s AND tt.taxonomy = 'product_cat'
    ''', (pid,))
    cats = cur.fetchall()
    cat_names = {c['name'] for c in cats}
    if cat_names.intersection(dummy_cats):
        continue

    # Price
    cur.execute('SELECT meta_value FROM cms_wp_postmeta WHERE post_id = %s AND meta_key = "_price"', (pid,))
    price_row = cur.fetchone()
    price = price_row['meta_value'] if price_row else None

    # Regular price
    cur.execute('SELECT meta_value FROM cms_wp_postmeta WHERE post_id = %s AND meta_key = "_regular_price"', (pid,))
    reg_price_row = cur.fetchone()
    reg_price = reg_price_row['meta_value'] if reg_price_row else None

    # Thumbnail
    cur.execute('SELECT meta_value FROM cms_wp_postmeta WHERE post_id = %s AND meta_key = "_thumbnail_id"', (pid,))
    thumb_row = cur.fetchone()
    thumb_id = thumb_row['meta_value'] if thumb_row else None
    thumb_url = None
    if thumb_id:
        cur.execute('SELECT guid FROM cms_wp_posts WHERE ID = %s', (thumb_id,))
        guid_row = cur.fetchone()
        thumb_url = guid_row['guid'] if guid_row else None

    # Gallery images
    cur.execute('SELECT meta_value FROM cms_wp_postmeta WHERE post_id = %s AND meta_key = "_product_image_gallery"', (pid,))
    gal_row = cur.fetchone()
    gallery_ids = gal_row['meta_value'].split(',') if gal_row and gal_row['meta_value'] else []
    gallery_urls = []
    for gid in gallery_ids:
        if gid.strip():
            cur.execute('SELECT guid FROM cms_wp_posts WHERE ID = %s', (gid.strip(),))
            grow = cur.fetchone()
            if grow and grow['guid']:
                gallery_urls.append(grow['guid'])

    if not thumb_url and len(gallery_urls) == 0:
        continue

    # Adventure Tours custom fields (duration, difficulty, altitude, etc.)
    cur.execute('SELECT meta_key, meta_value FROM cms_wp_postmeta WHERE post_id = %s', (pid,))
    all_meta = {row['meta_key']: row['meta_value'] for row in cur.fetchall()}

    tour_info = {
        'id': pid,
        'title': p['post_title'],
        'slug': p['post_name'],
        'price': price,
        'regular_price': reg_price,
        'categories': cats,
        'thumb_url': thumb_url,
        'gallery_urls': gallery_urls,
        'content': p['post_content'] or '',
        'excerpt': p['post_excerpt'] or '',
        'tour_duration': all_meta.get('tour_duration') or all_meta.get('duration') or '',
        'tour_badge': all_meta.get('tour_badge') or '',
    }
    all_tours.append(tour_info)

with open('/tmp/wp_tours_full_dump.json', 'w', encoding='utf-8') as f:
    json.dump({'categories': categories, 'tours': all_tours}, f, ensure_ascii=False, indent=2)

print(f"Dumped {len(all_tours)} real tours with full content & images to /tmp/wp_tours_full_dump.json")
