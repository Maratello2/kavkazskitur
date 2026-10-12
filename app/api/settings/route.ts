import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'siteSettings.json');

export async function GET() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const all = JSON.parse(content);
      
      // Expose all public homepage and site settings
      return NextResponse.json({ success: true, settings: all, ...all });
    }
  } catch (err) {
    console.warn('[Public Settings API] Read error:', err);
  }

  return NextResponse.json({
    success: true,
    settings: {
      announcementText: 'Early registration for 2026 Mount Elbrus summer expeditions is open.',
      announcementActive: true,
      seasonStatus: 'Active — Season 2026',
      promoBadgeText: 'CENTRAL CAUCASUS • 20 YEARS OF EXPEDITIONS',
    },
  });
}
