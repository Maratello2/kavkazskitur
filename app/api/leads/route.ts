import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

interface LeadItem {
  id: number | string;
  name: string;
  phone: string;
  tourName: string;
  dates: string;
  comment?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
}

function getLeadsFromFile(): LeadItem[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('[Leads API] Failed to read leads.json:', err);
  }
  return [];
}

function saveLeadsToFile(leads: LeadItem[]) {
  try {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Leads API] Failed to write leads.json:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      tourName, 
      tour_name, 
      dates, 
      date, 
      comment, 
      message, 
      website_hp, 
      consent, 
      consent_152fz 
    } = body;

    // 1. HONEYPOT ANTI-SPAM PROTECTION
    // If hidden bot field is filled, silently return 200 without saving
    if (website_hp && String(website_hp).trim() !== '') {
      console.log('[Leads API] Bot trap triggered via website_hp:', website_hp);
      return NextResponse.json({ success: true, redirectUrl: '' }, { status: 200 });
    }

    // 2. MANDATORY CONSENT CHECK (152-FZ / TERMS)
    const hasConsent = consent === true || consent === 'true' || consent_152fz === true || consent_152fz === 'true';
    if (!hasConsent) {
      return NextResponse.json(
        { success: false, error: 'Consent with terms of service and privacy policy is required.' },
        { status: 400 }
      );
    }

    const finalName = (name || 'Guest Climber').toString().trim();
    const finalPhone = (phone || '').toString().trim();
    const finalTour = (tourName || tour_name || 'Mount Elbrus Expedition').toString().trim();
    const finalDates = (dates || date || 'Summer Season 2026').toString().trim();
    const finalComment = (comment || message || '').toString().trim();

    if (!finalPhone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const leadId = Date.now();
    const createdAt = new Date().toISOString();

    const newLead: LeadItem = {
      id: leadId,
      name: finalName,
      phone: finalPhone,
      tourName: finalTour,
      dates: finalDates,
      comment: finalComment,
      createdAt,
      status: 'new',
    };

    // 3. PERSIST TO LOCAL STORAGE (/data/leads.json)
    const existingLeads = getLeadsFromFile();
    existingLeads.unshift(newLead);
    saveLeadsToFile(existingLeads);

    // 4. ATTEMPT DATABASE PERSISTENCE IF AVAILABLE
    try {
      await pool.query(
        `INSERT INTO bookings (name, phone, tour_name, departure_date, comment, created_at, status)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'new')`,
        [finalName, finalPhone, finalTour, finalDates, finalComment]
      );
    } catch {
      // Database is optional/graceful fallback; data is safely preserved in leads.json
    }

    // 4.1. DISPATCH TO TELEGRAM DISPATCHER CHAT IF CONFIGURED
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      try {
        const tgMsg = `🏔 *Новая заявка на тур!*\n\n*Тур:* ${finalTour}\n*Даты:* ${finalDates}\n*Клиент:* ${finalName}\n*Телефон:* ${finalPhone}\n${finalComment ? `*Заметка:* ${finalComment}` : ''}`;
        fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMsg,
            parse_mode: 'Markdown',
          }),
        }).catch(() => {});
      } catch {}
    }

    // 5. GENERATE INSTANT WHATSAPP REDIRECT URL
    // https://wa.me/79280828413?text=Expedition%20Booking%20Request%0A%0ATour:%20{tourName}%0ADates:%20{dates}%0AName:%20{name}%0APhone:%20{phone}
    const waText = `Expedition Booking Request\n\nTour: ${finalTour}\nDates: ${finalDates}\nName: ${finalName}\nPhone: ${finalPhone}`;
    const redirectUrl = `https://wa.me/79280828413?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      redirectUrl,
      leadId,
    });
  } catch (err: any) {
    console.error('[Leads API] Processing error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error processing booking request' },
      { status: 500 }
    );
  }
}
