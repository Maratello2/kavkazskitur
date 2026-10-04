import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import { TOURS_DATA } from '@/data/toursData';

const TOURS_FILE = path.join(process.cwd(), 'data', 'tours.json');

function getDefaultTours() {
  return TOURS_DATA.map((t, idx) => ({
    id: idx + 1,
    slug: t.slug,
    name: t.title,
    title: t.title,
    category_name: t.categoryLabel || 'Expedition',
    category: t.category,
    difficulty: t.difficulty || 'Demanding',
    altitude: t.altitude || '5,642 m',
    duration: t.duration || `${t.durationDays} days`,
    price: t.priceRub || 55000,
    priceRub: t.priceRub || 55000,
    priceUsd: t.priceUsd || Math.round((t.priceRub || 55000) / 92.5),
    capacity: 12,
    is_published: true,
    is_featured: idx < 3,
    status: (idx === 3 ? 'Sold Out' : 'Active') as 'Active' | 'Sold Out' | 'Draft',
    start_date: '2026-06-15',
    end_date: '2026-09-25',
    cover_image: t.coverImage || t.image,
    gallery: t.gallery || [],
    description: t.description || '',
    schedule2026: t.schedule2026?.map((s, sIdx) => ({
      dates: s.dates,
      spotsLeft: sIdx === 0 ? 3 : sIdx === 1 ? 0 : 8,
      capacity: 12,
      status: (sIdx === 1 ? 'sold_out' : sIdx === 0 ? 'few_spots' : 'available') as any,
    })) || [
      { dates: '12 Jul — 19 Jul 2026', spotsLeft: 3, capacity: 12, status: 'few_spots' },
      { dates: '02 Aug — 09 Aug 2026', spotsLeft: 0, capacity: 12, status: 'sold_out' },
      { dates: '16 Aug — 23 Aug 2026', spotsLeft: 8, capacity: 12, status: 'available' },
    ],
  }));
}

function getToursFromFile(): any[] {
  try {
    if (fs.existsSync(TOURS_FILE)) {
      const data = fs.readFileSync(TOURS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('[Admin Tours] Error reading tours.json:', err);
  }
  const defaults = getDefaultTours();
  saveToursToFile(defaults);
  return defaults;
}

function saveToursToFile(tours: any[]) {
  try {
    const dir = path.dirname(TOURS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TOURS_FILE, JSON.stringify(tours, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Admin Tours] Error writing tours.json:', err);
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  // 1. Try DB first
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as category_name
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.id ASC
    `);
    if (result.rows && result.rows.length > 0) {
      const fileTours = getToursFromFile();
      // Enrich DB rows with schedule2026 and images from file if needed
      const merged = result.rows.map((row) => {
        const matching = fileTours.find((f) => String(f.id) === String(row.id) || f.slug === row.slug);
        return {
          id: row.id,
          slug: row.slug || (matching ? matching.slug : `tour-${row.id}`),
          name: row.name || row.title,
          category_name: row.category_name || (matching ? matching.category_name : 'Expedition'),
          price: Number(row.price),
          priceRub: Number(row.price),
          priceUsd: Math.round(Number(row.price) / 92.5),
          capacity: row.capacity || 12,
          is_published: !!row.is_published,
          is_featured: !!row.is_featured,
          status: matching?.status || (row.is_published ? 'Active' : 'Draft'),
          start_date: row.start_date,
          end_date: row.end_date,
          cover_image: row.image_url || matching?.cover_image,
          gallery: Array.isArray(row.photo_urls) ? row.photo_urls : (matching?.gallery || []),
          schedule2026: matching?.schedule2026 || [
            { dates: '12 Jul — 19 Jul 2026', spotsLeft: 3, capacity: 12, status: 'few_spots' },
            { dates: '02 Aug — 09 Aug 2026', spotsLeft: 8, capacity: 12, status: 'available' },
          ],
        };
      });
      return NextResponse.json({ success: true, tours: merged });
    }
  } catch (err) {
    // Database offline or query failed
  }

  // 2. Return local persisted tours
  const tours = getToursFromFile();
  return NextResponse.json({ success: true, tours });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const tours = getToursFromFile();

    const newId = Date.now();
    const newTour = {
      id: newId,
      slug: body.slug || `expedition-${newId}`,
      name: body.name || body.title || 'New Caucasus Expedition',
      title: body.name || body.title || 'New Caucasus Expedition',
      category_name: body.category_name || 'Mountaineering',
      category: body.category || 'climbing',
      difficulty: body.difficulty || 'Demanding',
      altitude: body.altitude || '5,000 m',
      duration: body.duration || '8 days',
      price: Number(body.price) || 60000,
      priceRub: Number(body.price) || 60000,
      priceUsd: Math.round((Number(body.price) || 60000) / 92.5),
      capacity: Number(body.capacity) || 12,
      is_published: body.is_published !== undefined ? body.is_published : true,
      is_featured: !!body.is_featured,
      status: body.status || 'Active',
      start_date: body.start_date || '2026-07-01',
      end_date: body.end_date || '2026-09-01',
      cover_image: body.cover_image || body.coverImage || '/tours/elbrus-south.webp',
      gallery: body.gallery || [],
      description: body.description || '',
      schedule2026: body.schedule2026 || [
        { dates: '15 Jul — 22 Jul 2026', spotsLeft: 10, capacity: 12, status: 'available' },
      ],
    };

    tours.unshift(newTour);
    saveToursToFile(tours);

    return NextResponse.json({ success: true, tour: newTour });
  } catch (err) {
    console.error('[Admin Tours] POST error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const updateData = await request.json();
    const { id } = updateData;
    if (!id) return NextResponse.json({ success: false, error: 'Tour ID is required' }, { status: 400 });

    const tours = getToursFromFile();
    let found = false;
    const updatedTours = tours.map((t) => {
      if (String(t.id) === String(id)) {
        found = true;
        const newPrice = updateData.price !== undefined ? Number(updateData.price) : t.price;
        return {
          ...t,
          ...updateData,
          price: newPrice,
          priceRub: newPrice,
          priceUsd: Math.round(newPrice / 92.5),
          cover_image: updateData.cover_image || updateData.coverImage || t.cover_image,
          gallery: updateData.gallery || t.gallery || [],
        };
      }
      return t;
    });

    if (found) {
      saveToursToFile(updatedTours);
    }

    // Attempt DB update if table exists
    try {
      await pool.query(
        `UPDATE tours SET 
          price = COALESCE($1, price),
          is_published = COALESCE($2, is_published),
          is_featured = COALESCE($3, is_featured),
          capacity = COALESCE($4, capacity),
          image_url = COALESCE($5, image_url),
          updated_at = NOW()
        WHERE id = $6`,
        [
          updateData.price,
          updateData.is_published,
          updateData.is_featured,
          updateData.capacity,
          updateData.cover_image || updateData.coverImage,
          id,
        ]
      );
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Tours] PATCH error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
