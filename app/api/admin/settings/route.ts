import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'siteSettings.json');

export interface SiteSettingsData {
  // Hero & Branding
  heroTitle: string;
  heroSubtitle: string;
  promoBadgeText: string;
  seasonStatus: string;
  announcementText: string;
  announcementActive: boolean;

  // Commercial & Financial Policies
  usdExchangeRate: number;
  prepaymentPercent: number;
  freeCancellationDays: number;
  paymentDetailsNote: string;

  // Section Visibility Toggles
  showReviews: boolean;
  showGearRental: boolean;
  showMap: boolean;
  showAcclimatization: boolean;
  showCompare: boolean;

  // Communication & Emergency Channels
  phone: string;
  whatsapp: string;
  whatsappLink: string;
  telegramChannel: string;
  email: string;
  address: string;
  workingHours: string;
  rescuePhone: string;
  emergencyContact: string;

  // SEO & Analytics
  yandexMetrikaId: string;
  googleAnalyticsId: string;
  metaTitle: string;
  metaDescription: string;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  heroTitle: 'Raw Caucasus. Untamed Peaks.',
  heroSubtitle: 'Backcountry ski touring, high-altitude summits, and wild expeditions led by certified local mountaineering masters. Base camp at Mt. Elbrus, 3,800 m.',
  promoBadgeText: 'CENTRAL CAUCASUS • 20 YEARS OF EXPEDITIONS',
  seasonStatus: 'Active — Booking Summer & Autumn 2026 Expeditions',
  announcementText: 'Early registration for 2026 Mount Elbrus & Kazbek summer expeditions is open with 10% discount.',
  announcementActive: true,

  usdExchangeRate: 92.5,
  prepaymentPercent: 30,
  freeCancellationDays: 14,
  paymentDetailsNote: 'Direct official tour operator contract, bank transfer or online card settlement with instant receipt.',

  showReviews: true,
  showGearRental: true,
  showMap: true,
  showAcclimatization: true,
  showCompare: true,

  phone: '+7 (928) 082-84-13',
  whatsapp: '+7 (928) 082-84-13',
  whatsappLink: 'https://wa.me/79280828413',
  telegramChannel: 'https://t.me/kavkazskitur',
  email: 'info@kavkazskitur.com',
  address: 'Gorkogo St. 74, Nalchik, Kabardino-Balkaria',
  workingHours: '08:00 — 21:00 MSK Daily',
  rescuePhone: '+7 (928) 082-84-13',
  emergencyContact: 'Elbrus Alpine Rescue Post (EMERCOM): +7 (866) 387-14-89',

  yandexMetrikaId: '98451230',
  googleAnalyticsId: 'G-KVZSKT2026',
  metaTitle: 'KavKazSkiTur | Mountain Expeditions & Ski Touring in the Caucasus',
  metaDescription: 'Official tour operator for Mount Elbrus summits, ski touring, and high-altitude adventures in Kabardino-Balkaria.',
};

function readSettingsFromFile(): SiteSettingsData {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
    }
  } catch (err) {
    console.warn('[Settings API] Read file error:', err);
  }
  return DEFAULT_SETTINGS;
}

function writeSettingsToFile(settings: any) {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');

    // Also mirror to src/data if exists
    const srcFile = path.join(process.cwd(), 'src', 'data', 'siteSettings.json');
    const srcDir = path.dirname(srcFile);
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(srcFile, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Settings API] Write file error:', err);
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Attempt database first
    const res = await pool.query('SELECT value FROM site_settings WHERE key = $1 LIMIT 1', ['global']);
    if (res.rows.length > 0) {
      return NextResponse.json({ success: true, settings: { ...DEFAULT_SETTINGS, ...res.rows[0].value } });
    }
  } catch {
    // fallback to file
  }

  const settings = readSettingsFromFile();
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (admin.role === 'editor') {
    return NextResponse.json(
      { success: false, error: 'Permission denied. Editors cannot alter global site parameters.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const current = readSettingsFromFile();
    const updated: SiteSettingsData = { ...current, ...body };

    // Try save to database
    try {
      await pool.query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        ['global', updated]
      );
    } catch {
      // ignore DB failure in local dev
    }

    // Persist to JSON files
    writeSettingsToFile(updated);

    return NextResponse.json({
      success: true,
      message: 'Global site settings updated successfully',
      settings: updated,
    });
  } catch (err: any) {
    console.error('[Settings API] POST error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
