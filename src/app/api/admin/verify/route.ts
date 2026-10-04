import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import {
  verifyPendingSession,
  signAdminSession,
  ADMIN_PENDING_COOKIE,
  ADMIN_SESSION_COOKIE,
} from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get(ADMIN_PENDING_COOKIE)?.value;

    if (!pendingToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Pending authentication session required' },
        { status: 401 }
      );
    }

    const pending = verifyPendingSession(pendingToken);
    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired pending session' },
        { status: 401 }
      );
    }

    const { adminId, username } = pending;
    let role = 'manager';

    // Verify user role from adminUsers.json
    try {
      const USERS_FILE = path.join(process.cwd(), 'data', 'adminUsers.json');
      if (fs.existsSync(USERS_FILE)) {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const found = users.find(
          (u: any) => u.id === adminId || u.username.toLowerCase() === username.toLowerCase()
        );
        if (found) {
          role = found.role || 'manager';
        }
      }
    } catch {
      // non-critical
    }

    const cleanCode = String(code || '').trim();
    if (!cleanCode) {
      return NextResponse.json(
        { success: false, error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Try database verification if connected
    let codeValid = false;
    try {
      const result = await pool.query(
        `SELECT id, code, expires_at, used FROM admin_2fa_codes
         WHERE admin_id = $1 AND used = false AND expires_at > NOW() ORDER BY id DESC LIMIT 1`,
        [adminId]
      );
      const record = result.rows[0];
      if (record && String(record.code) === cleanCode) {
        await pool.query(`UPDATE admin_2fa_codes SET used = true WHERE id = $1`, [record.id]);
        codeValid = true;
      }
    } catch {
      // Database offline fallback: in non-production, accept standard 6-digit code
      if (process.env.NODE_ENV !== 'production' && cleanCode.length === 6) {
        codeValid = true;
      }
    }

    if (!codeValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    const sessionToken = signAdminSession({ adminId, username, role });

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60,
    });
    response.cookies.delete(ADMIN_PENDING_COOKIE);
    return response;
  } catch (err) {
    console.error('[Admin Verify] error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
