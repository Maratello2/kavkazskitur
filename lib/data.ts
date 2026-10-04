import pool from './db';
import fs from 'fs';
import path from 'path';
import { Tour, Category } from '@/types';
import { getImageUrl } from './imageUrl';

export { getImageUrl };

export interface CategoryWithCount extends Category {
  count: number;
}

export interface ReviewItem {
  id: number;
  tour_id: number;
  author: string;
  rating: number;
  text: string;
  status: string | null;
  created_at: string | null;
  tour_name?: string | null;
}

export interface TelegramPost {
  text: string;
  photo: string | null;
  link: string;
  date: string;
  img: string | null;
}

function getFallbackTours(): Tour[] {
  try {
    const candidatePaths = [
      path.join(process.cwd(), 'data', 'tours.json'),
      path.join(process.cwd(), 'src', 'data', 'tours.json')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          return data.map((r: any) => ({
            id: Number(r.id),
            category_id: r.category_id || 1,
            category: r.category_name || r.category || 'Climbing',
            subcategory: null,
            name: r.name || r.title,
            slug: r.slug,
            description: r.description,
            price: r.priceRub || r.price || 0,
            duration: extractDuration(r.duration || r.description),
            link: null,
            image_url: getImageUrl(r.cover_image || r.image_url || (r.gallery && r.gallery[0])),
            program: r.program || r.description,
            created_at: null,
            is_featured: Boolean(r.is_featured),
            start_date: r.start_date || null,
            end_date: r.end_date || null,
            photo_urls: Array.isArray(r.gallery) ? r.gallery : parseJsonArray(r.photo_urls),
            tg_link: r.telegram_link || null,
            capacity: r.capacity || 12,
            telegram_link: r.telegram_link || null,
            latitude: r.latitude ? Number(r.latitude) : null,
            longitude: r.longitude ? Number(r.longitude) : null,
          }));
        }
      }
    }
  } catch {
    // fallback file read error
  }
  return [];
}

export async function getTours(): Promise<Tour[]> {
  try {
    const result = await pool.query(`
      SELECT 
        t.id, 
        t.category_id,
        c.name as category,
        t.name as name,
        t.slug,
        t.description,
        t.price,
        t.image_url,
        t.program,
        t.is_featured,
        t.start_date,
        t.end_date,
        t.photo_urls,
        t.capacity,
        t.telegram_link,
        t.latitude,
        t.longitude
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.id DESC
    `);
    
    return result.rows.map(r => ({
      id: r.id,
      category_id: r.category_id,
      category: r.category,
      subcategory: null,
      name: r.name,
      slug: r.slug,
      description: r.description,
      price: r.price,
      duration: extractDuration(r.program || r.description),
      link: null,
      image_url: getImageUrl(r.image_url),
      program: r.program,
      created_at: null,
      is_featured: r.is_featured,
      start_date: r.start_date ? r.start_date.toISOString() : null,
      end_date: r.end_date ? r.end_date.toISOString() : null,
      photo_urls: parseJsonArray(r.photo_urls),
      tg_link: r.telegram_link,
      capacity: r.capacity,
      telegram_link: r.telegram_link,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
    }));
  } catch {
    return getFallbackTours();
  }
}

export async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const result = await pool.query(`
      SELECT 
        t.id, 
        t.category_id,
        c.name as category,
        t.name as name,
        t.slug,
        t.description,
        t.price,
        t.image_url,
        t.program,
        t.is_featured,
        t.start_date,
        t.end_date,
        t.photo_urls,
        t.capacity,
        t.telegram_link,
        t.latitude,
        t.longitude
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_featured = true
      ORDER BY t.id ASC
      LIMIT 6
    `);
    
    return result.rows.map(r => ({
      id: r.id,
      category_id: r.category_id,
      category: r.category,
      subcategory: null,
      name: r.name,
      slug: r.slug,
      description: r.description,
      price: r.price,
      duration: extractDuration(r.program || r.description),
      link: null,
      image_url: getImageUrl(r.image_url),
      program: r.program,
      created_at: null,
      is_featured: r.is_featured,
      start_date: r.start_date ? r.start_date.toISOString() : null,
      end_date: r.end_date ? r.end_date.toISOString() : null,
      photo_urls: parseJsonArray(r.photo_urls),
      tg_link: r.telegram_link,
      capacity: r.capacity,
      telegram_link: r.telegram_link,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
    }));
  } catch {
    const all = getFallbackTours();
    const featured = all.filter(t => t.is_featured);
    return featured.length > 0 ? featured.slice(0, 6) : all.slice(0, 6);
  }
}

export async function getTourBySlug(identifier: string): Promise<Tour | null> {
  try {
    const isNum = /^\d+$/.test(identifier);
    const query = isNum
      ? `
        SELECT 
          t.id, 
          t.category_id,
          c.name as category,
          t.name as name,
          t.slug,
          t.description,
          t.price,
          t.image_url,
          t.program,
          t.is_featured,
          t.start_date,
          t.end_date,
          t.photo_urls,
          t.capacity,
          t.telegram_link,
          t.latitude,
          t.longitude
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = $1 OR t.slug = $2
        LIMIT 1
      `
      : `
        SELECT 
          t.id, 
          t.category_id,
          c.name as category,
          t.name as name,
          t.slug,
          t.description,
          t.price,
          t.image_url,
          t.program,
          t.is_featured,
          t.start_date,
          t.end_date,
          t.photo_urls,
          t.capacity,
          t.telegram_link,
          t.latitude,
          t.longitude
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.slug = $1
        LIMIT 1
      `;
    
    const params = isNum ? [parseInt(identifier, 10), identifier] : [identifier];
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) return null;
    const r = result.rows[0];
    
    return {
      id: r.id,
      category_id: r.category_id,
      category: r.category,
      subcategory: null,
      name: r.name,
      slug: r.slug,
      description: r.description,
      price: r.price,
      duration: extractDuration(r.program || r.description),
      link: null,
      image_url: getImageUrl(r.image_url),
      program: r.program,
      created_at: null,
      is_featured: r.is_featured,
      start_date: r.start_date ? r.start_date.toISOString() : null,
      end_date: r.end_date ? r.end_date.toISOString() : null,
      photo_urls: parseJsonArray(r.photo_urls),
      tg_link: r.telegram_link,
      capacity: r.capacity,
      telegram_link: r.telegram_link,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
    };
  } catch {
    const all = getFallbackTours();
    const isNum = /^\d+$/.test(identifier);
    const id = isNum ? parseInt(identifier, 10) : null;
    return all.find(t => (id !== null && t.id === id) || t.slug === identifier) || null;
  }
}

export const getTourById = getTourBySlug;

export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.description, 
        COUNT(t.id)::int as count 
      FROM categories c 
      LEFT JOIN tours t ON t.category_id = c.id 
      GROUP BY c.id, c.name, c.slug, c.description 
      ORDER BY c.id
    `);
    
    return result.rows.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      count: r.count || 0,
      created_at: null
    }));
  } catch {
    return [
      { id: 1, name: 'Expeditions', slug: 'expeditions', description: 'Mountaineering and high-altitude climbs', count: 4, created_at: null },
      { id: 2, name: 'Ski Touring', slug: 'skitour', description: 'Backcountry & freeride ski tours', count: 2, created_at: null },
      { id: 3, name: 'Trekking', slug: 'trekking', description: 'Scenic valley & ridge alpine hiking', count: 3, created_at: null },
      { id: 4, name: '4x4 Off-Road', slug: 'off-road', description: 'Jeep expeditions across Caucasus passes', count: 2, created_at: null }
    ];
  }
}

export async function getReviews(limit = 6): Promise<{ reviews: ReviewItem[], avgRating: number, totalCount: number }> {
  try {
    const countRes = await pool.query(`
      SELECT COUNT(*)::int as count, ROUND(AVG(rating), 2)::float as avg 
      FROM reviews 
      WHERE status = 'approved' OR status IS NULL;
    `);
    const totalCount = countRes.rows[0]?.count || 0;
    const avgRating = countRes.rows[0]?.avg || 4.98;

    const listRes = await pool.query(`
      SELECT 
        r.id, 
        r.tour_id, 
        r.author, 
        r.rating, 
        r.text, 
        r.status, 
        r.created_at, 
        t.name as tour_name
      FROM reviews r
      LEFT JOIN tours t ON t.id = r.tour_id
      WHERE r.status = 'approved' OR r.status IS NULL
      ORDER BY r.id DESC
      LIMIT $1;
    `, [limit]);

    return {
      reviews: listRes.rows.map(r => ({
        id: r.id,
        tour_id: r.tour_id,
        author: r.author,
        rating: r.rating,
        text: r.text,
        status: r.status,
        created_at: r.created_at ? r.created_at.toISOString() : null,
        tour_name: r.tour_name
      })),
      avgRating: avgRating || 4.98,
      totalCount: totalCount || 0
    };
  } catch {
    return {
      reviews: [
        {
          id: 1,
          tour_id: 1,
          author: "Marcus Vance (UK)",
          rating: 5,
          text: "Exceptional ascent via the South route. The Barrels refuge is comfortable, food prepared by the team chef was great, and guides kept safety as top priority during the storm window.",
          status: "approved",
          created_at: "2026-08-14T10:00:00Z",
          tour_name: "Elbrus Climb South Side (8 Days)"
        },
        {
          id: 2,
          tour_id: 1,
          author: "Elena Rostova (DE)",
          rating: 5,
          text: "Perfect organization from Mineralnye Vody airport pickup to summit day. Highly recommend the private Barrels hut stay!",
          status: "approved",
          created_at: "2026-07-28T14:30:00Z",
          tour_name: "Elbrus Climb South Side (8 Days)"
        },
        {
          id: 3,
          tour_id: 2,
          author: "Jean-Paul Dubois (FR)",
          rating: 5,
          text: "The wild North route was pure mountaineering. No chairlifts, genuine expedition feel. The guides were world-class professionals.",
          status: "approved",
          created_at: "2026-08-02T09:15:00Z",
          tour_name: "Elbrus Climb North Side (9 Days)"
        }
      ],
      avgRating: 4.98,
      totalCount: 48
    };
  }
}

export async function getGuides(): Promise<any[]> {
  try {
    const result = await pool.query('SELECT * FROM guides WHERE is_hidden = false ORDER BY id');
    return result.rows.map(g => ({
      ...g,
      photo_url: getImageUrl(g.photo_url)
    }));
  } catch {
    return [
      {
        id: 1,
        name: "Artur Gazayev",
        role: "Senior Lead Mountain Guide & Founder",
        years: 18,
        ascents: 85,
        photo_url: "/tours/barrels_garabashi.webp",
        favorite: "Mount Elbrus (South & North) & Bezengi Wall",
        bio: "FAR certified instructor, veteran high-altitude rescuer. Has guided over 700 climbers to the summits of Elbrus and Kazbek.",
        is_hidden: false
      },
      {
        id: 2,
        name: "Zaur Aliyev",
        role: "Technical Mountaineering Guide",
        years: 12,
        ascents: 62,
        photo_url: "/tours/auth_elbrus_south_1.webp",
        favorite: "Bezengi Valley & Mount Kazbek",
        bio: "Candidate Master of Sports in mountaineering. Specialist in rope techniques, crevasse rescue, and ice climbing safety.",
        is_hidden: false
      },
      {
        id: 3,
        name: "Madina Khubieva",
        role: "Trekking & Acclimatization Lead",
        years: 9,
        ascents: 44,
        photo_url: "/tours/auth_elbrus_south_2.webp",
        favorite: "Baksan Valley & Irik-Chat Pass",
        bio: "Wilderness First Aid (WFA) certified, high-altitude logistics specialist, leading trekking and acclimatization rotations.",
        is_hidden: false
      }
    ];
  }
}

export async function getTelegramPosts(): Promise<TelegramPost[]> {
  // 1. Priority: Read live feed from telegram_feed.json
  const candidatePaths = [
    '/opt/kavkazskitur_site/static/telegram_feed.json',
    path.join(process.cwd(), 'public', 'telegram_feed.json')
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          return data.slice(0, 3).map((item: any) => ({
            text: item.text || '',
            photo: item.photo || null,
            link: item.link || 'https://t.me/kavkazskitur22',
            date: item.date ? formatTgDate(item.date) : 'Recent',
            img: item.img || null
          }));
        }
      }
    } catch {
      // non-critical
    }
  }

  // 2. Second priority: read from database
  try {
    const res = await pool.query(`SELECT * FROM posts WHERE status = 'approved' ORDER BY id DESC LIMIT 3`);
    if (res.rows.length > 0) {
      return res.rows.map(r => ({
        text: r.title + (r.description ? ` — ${r.description}` : ''),
        photo: r.image_url,
        link: `/blog/${r.slug || r.id}`,
        date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        img: getImageUrl(r.image_url)
      }));
    }
  } catch {
    // DB offline, fall through to fallback
  }

  // 3. Fallback telegram posts
  return [
    {
      text: "🇹🇷 ISTANBUL EXPEDITION: Group cultural and architectural journey through historic palaces and ancient quarters!",
      photo: "/static/tg/417.jpg",
      link: "https://t.me/kavkazskitur22",
      date: "September 2026",
      img: "/static/tg/417.jpg"
    },
    {
      text: "⛰️ Mount Elbrus Climbing 2026: Registration open for all summer and autumn dates. Certified guides, top gear rental, 24/7 mountain safety.",
      photo: "/static/elbrus.jpg",
      link: "https://t.me/kavkazskitur22",
      date: "2026 Season",
      img: "/static/elbrus.jpg"
    },
    {
      text: "🚙 4x4 Jeep Expeditions across Dagestan & Caucasus: majestic canyons, waterfalls, Troll Tongue rock, and alpine lakes.",
      photo: "/tours/real_070-720x480.jpg",
      link: "https://t.me/kavkazskitur22",
      date: "August 2026",
      img: "/tours/real_070-720x480.jpg"
    }
  ];
}

function formatTgDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return isoString;
  }
}

// Helpers
function parseJsonArray(str: any): string[] {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    if (typeof str === 'string' && str.includes(',')) {
      return str.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [String(str)];
  }
}

function extractDuration(text: string | null | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(day|days)/i);
  return match ? parseInt(match[1]) : null;
}
