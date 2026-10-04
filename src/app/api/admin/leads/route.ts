import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

function getLeadsFromFile(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('[Admin Leads] Error reading leads.json:', err);
  }
  return [];
}

function saveLeadsToFile(leads: any[]) {
  try {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Admin Leads] Error writing leads.json:', err);
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const fileLeads = getLeadsFromFile().map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email || null,
    tour_name: l.tourName || l.tour_name,
    departure_date: l.dates || l.departure_date,
    people_count: l.people_count || l.peopleCount || 1,
    comment: l.comment || null,
    gear_requests: l.gear_requests || l.gearRequests || null,
    transfer: l.transfer || null,
    manager_notes: l.manager_notes || l.managerNotes || null,
    status: l.status || 'new',
    created_at: l.createdAt || l.created_at || new Date().toISOString(),
  }));

  try {
    const [leadsRes, bookingsRes] = await Promise.all([
      pool.query(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`),
      pool.query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`),
    ]);

    // Merge file leads with database rows (preferring unique IDs)
    const dbBookings = bookingsRes.rows || [];
    const combinedBookings = [...fileLeads];
    for (const row of dbBookings) {
      if (!combinedBookings.some((b) => String(b.id) === String(row.id))) {
        combinedBookings.push(row);
      }
    }

    return NextResponse.json({ 
      success: true, 
      leads: leadsRes.rows || [], 
      bookings: combinedBookings 
    });
  } catch (err) {
    // If DB is offline, return the safely persisted file leads
    return NextResponse.json({ 
      success: true, 
      leads: [], 
      bookings: fileLeads 
    });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { type, id, status, manager_notes } = await request.json();
    const table = type === 'booking' ? 'bookings' : 'leads';
    const allowedStatuses = [
      'new', 
      'whatsapp_sent', 
      'contacted', 
      'deposit_paid', 
      'confirmed', 
      'paid', 
      'cancelled', 
      'completed',
      'qualified',
      'rejected'
    ];

    if (!id) {
      return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
    }

    // Update in local file storage
    const fileLeads = getLeadsFromFile();
    let updatedFile = false;
    for (const lead of fileLeads) {
      if (String(lead.id) === String(id)) {
        if (status && allowedStatuses.includes(status)) {
          lead.status = status;
        }
        if (manager_notes !== undefined) {
          lead.manager_notes = manager_notes;
        }
        updatedFile = true;
      }
    }
    if (updatedFile) {
      saveLeadsToFile(fileLeads);
    }

    // Also attempt DB update if connected
    try {
      if (status) {
        await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [status, id]);
      }
    } catch {
      // Graceful fallback
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Leads] PATCH error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
