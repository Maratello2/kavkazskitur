import nodemailer from 'nodemailer';

export interface BookingNotificationData {
  id: string;
  tourSlug: string;
  tourTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  participants: number;
  preferredDate?: string;
  experienceLevel: string;
}

export async function sendBookingEmails(booking: BookingNotificationData) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || user || 'info@kavkazskitur.com';

  if (!host || !user || !pass) {
    console.log('[Email Service] SMTP is not configured in environment. Booking logged successfully:', {
      bookingId: booking.id,
      tour: booking.tourTitle,
      client: booking.clientName,
      email: booking.clientEmail,
      phone: booking.clientPhone,
    });
    return { success: false, reason: 'SMTP not configured (logged to console)' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const cleanPhone = booking.clientPhone.replace(/\D/g, '');
  const operatorWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${booking.clientName}! This is KavKazSkiTur regarding your booking #${booking.id} for "${booking.tourTitle}".`
  )}`;
  const clientWaUrl = `https://wa.me/79280828413?text=${encodeURIComponent(
    `Order ${booking.id} - ${booking.tourTitle}`
  )}`;

  // 1. Operator Email
  const operatorHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060B12; color: #E2E8F0; margin: 0; padding: 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #091422; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 24px; background-color: #0E1F33; border-bottom: 2px solid #FF6A00;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #FF6A00; font-weight: bold;">KavKazSkiTur Expeditions</span>
              <h2 style="margin: 6px 0 0; color: #FFFFFF; font-size: 22px;">New Climber Reservation</h2>
              <span style="font-size: 12px; color: #94A3B8;">Booking ID: #${booking.id}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td style="color: #94A3B8; width: 140px;">Tour:</td>
                  <td style="color: #FFFFFF; font-weight: bold;">${booking.tourTitle}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Climber Name:</td>
                  <td style="color: #FFFFFF;">${booking.clientName}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Email:</td>
                  <td><a href="mailto:${booking.clientEmail}" style="color: #38BDF8;">${booking.clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Phone:</td>
                  <td style="color: #FFFFFF;">${booking.clientPhone}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Participants:</td>
                  <td style="color: #FFFFFF;">${booking.participants} climber(s)</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Preferred Date:</td>
                  <td style="color: #FFFFFF;">${booking.preferredDate || 'Flexible / Open'}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">Experience:</td>
                  <td style="color: #38BDF8; font-weight: bold;">${booking.experienceLevel}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${operatorWaUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px;">
                  Open WhatsApp Chat with Climber
                </a>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // 2. Client Auto-Reply
  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060B12; color: #E2E8F0; margin: 0; padding: 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #091422; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 28px 24px; background-color: #0E1F33; border-bottom: 2px solid #FF6A00; text-align: center;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #FF6A00; font-weight: bold;">KavKazSkiTur • Greater Caucasus</span>
              <h2 style="margin: 8px 0 0; color: #FFFFFF; font-size: 22px;">Expedition Request Received</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #94A3B8;">Booking Reference: #${booking.id}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; line-height: 1.6; font-size: 14px; color: #CBD5E1;">
              <p>Dear ${booking.clientName},</p>
              <p>Thank you for choosing KavKazSkiTur for your high-altitude alpine journey. We have safely logged your reservation inquiry for:</p>
              <div style="background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin: 18px 0;">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #FFFFFF;">${booking.tourTitle}</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">
                  Team Size: <span style="color: #FFFFFF;">${booking.participants}</span> • Target Date: <span style="color: #FFFFFF;">${booking.preferredDate || 'Flexible'}</span> • Level: <span style="color: #38BDF8;">${booking.experienceLevel}</span>
                </p>
              </div>
              <p>Our senior expedition coordinator and certified lead guide are currently checking route conditions, mountain permits, and high-camp availability. We will contact you via WhatsApp / email within 15–30 minutes.</p>
              <p>For instant priority dispatch, you may open direct communication with our base camp control room:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${clientWaUrl}" target="_blank" style="display: inline-block; background-color: #FF6A00; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
                  Direct WhatsApp Priority Line
                </a>
              </div>
              <p style="font-size: 12px; color: #64748B; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
                KavKazSkiTur Base Camp • Barrels-Garabashi 3,800m • Terskol, Elbrus Region<br/>
                Official UIAGM/RMGA Certified Lead Guides
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    await Promise.allSettled([
      transporter.sendMail({
        from: `"KavKazSkiTur Expeditions" <${user}>`,
        to: adminEmail,
        subject: `New Expedition Booking: ${booking.tourTitle} — ${booking.clientName}`,
        html: operatorHtml,
      }),
      transporter.sendMail({
        from: `"KavKazSkiTur Expeditions" <${user}>`,
        to: booking.clientEmail,
        subject: 'Expedition Request Received — KavKazSkiTur',
        html: clientHtml,
      }),
    ]);
    return { success: true };
  } catch (err) {
    console.error('[Email Service] Failed to dispatch emails:', err);
    return { success: false, error: err };
  }
}
