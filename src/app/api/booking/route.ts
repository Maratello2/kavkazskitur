import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/src/lib/validations/booking';
import { prisma } from '@/src/lib/prisma';
import { sendBookingEmails } from '@/src/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // 1. HONEYPOT ANTI-SPAM PROTECTION
    // If hidden bot field is filled, silently return 200 without saving
    if (json.website_hp && String(json.website_hp).trim() !== '') {
      console.log('[Booking API] Bot honeypot triggered:', json.website_hp);
      return NextResponse.json({ success: true, bookingId: 'hp_filtered' }, { status: 200 });
    }

    // 2. VALIDATION VIA ZOD
    const parseResult = bookingSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. EXTRACT CLIENT IP & CHECK RATE LIMIT
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(`booking_${clientIp}`, 10, 10 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before submitting again.` },
        { status: 429 }
      );
    }

    // 4. PERSIST TO DATABASE VIA PRISMA
    let bookingId = '';
    try {
      const created = await prisma.booking.create({
        data: {
          tourSlug: data.tourSlug,
          tourTitle: data.tourTitle,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          participants: data.participants,
          preferredDate: data.preferredDate || null,
          experienceLevel: data.experienceLevel,
          status: 'NEW',
          consent152: Boolean(data.consent152),
          clientIp,
        },
      });
      bookingId = created.id;
    } catch (dbError) {
      console.error('[Booking API] Prisma database persist error (using fallback ID):', dbError);
      bookingId = 'kkt_' + Date.now().toString(36);
    }

    // 5. DISPATCH EMAILS (Operator Notification & Client Auto-reply)
    // Non-blocking fallback if SMTP is unconfigured
    try {
      await sendBookingEmails({
        id: bookingId,
        tourSlug: data.tourSlug,
        tourTitle: data.tourTitle,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        participants: data.participants,
        preferredDate: data.preferredDate,
        experienceLevel: data.experienceLevel,
      });
    } catch (emailError) {
      console.error('[Booking API] Email delivery error (non-fatal):', emailError);
    }

    const whatsappUrl = `https://wa.me/79280828413?text=${encodeURIComponent(`Order ${bookingId}`)}`;

    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,
      message: 'Expedition booking request received successfully',
    });
  } catch (error) {
    console.error('[Booking API] Unexpected server error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing booking request' },
      { status: 500 }
    );
  }
}
