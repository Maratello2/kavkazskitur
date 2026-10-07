import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { 
  signAdminSession, 
  ADMIN_SESSION_COOKIE 
} from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';

const USERS_FILE = path.join(process.cwd(), 'data', 'adminUsers.json');

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`login_${clientIp}`, 5, 15 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Please wait ${rateLimit.resetInSeconds}s before retrying.` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();

    let authenticatedUser: { id: number; username: string; role: string } | null = null;

    // 1. Check local JSON file storage (adminUsers.json)
    try {
      if (!fs.existsSync(USERS_FILE)) {
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const defaultUsers = [
          {
            id: 1,
            username: 'kavkaz_admin',
            name: 'Expedition Operations Lead',
            email: 'hq@kavkazskitur.com',
            role: 'superadmin',
            password_hash: '$2a$10$cEbUFB3YLp/Aw0cIcRfWjebUMM1WqEvvhcDHYd9yTGUoJ9lOLXkfW',
            is_active: true,
            created_at: new Date().toISOString(),
            last_login: null,
          }
        ];
        fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      }

      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(raw);
      if (Array.isArray(users)) {
        const userRecord = users.find(
          (u: any) => u.username.toLowerCase() === cleanUser.toLowerCase()
        );

        if (userRecord && userRecord.is_active !== false) {
          if (userRecord.password_hash) {
            const passwordMatch = await bcrypt.compare(cleanPass, userRecord.password_hash);
            if (passwordMatch) {
              authenticatedUser = {
                id: userRecord.id,
                username: userRecord.username,
                role: userRecord.role || 'superadmin',
              };

              // Update last login timestamp in file
              try {
                userRecord.last_login = new Date().toISOString();
                fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
                const srcFile = path.join(process.cwd(), 'src', 'data', 'adminUsers.json');
                if (fs.existsSync(srcFile)) {
                  fs.writeFileSync(srcFile, JSON.stringify(users, null, 2), 'utf-8');
                }
              } catch {
                // non-critical
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Admin Login] Failed checking adminUsers.json:', err);
    }

    // 2. Try PostgreSQL database if not yet authenticated
    if (!authenticatedUser) {
      try {
        const result = await pool.query(
          `SELECT id, username, password_hash, role, is_active
           FROM admin_users WHERE username = $1 LIMIT 1`,
          [cleanUser]
        );
        if (result.rows && result.rows.length > 0) {
          const dbAdmin = result.rows[0];
          if (dbAdmin.is_active && dbAdmin.password_hash) {
            const ok = await bcrypt.compare(cleanPass, dbAdmin.password_hash);
            if (ok) {
              authenticatedUser = {
                id: dbAdmin.id,
                username: dbAdmin.username,
                role: dbAdmin.role || 'superadmin',
              };
            }
          }
        }
      } catch {
        // Database connection error
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    // Issue JWT admin session cookie with assigned role
    const sessionToken = signAdminSession({
      adminId: authenticatedUser.id,
      username: authenticatedUser.username,
      role: authenticatedUser.role || 'superadmin',
    });

    const response = NextResponse.json({
      success: true,
      requiresTwoFactor: false,
      redirect: '/admin',
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        role: authenticatedUser.role,
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (err: any) {
    console.error('[Admin Login] error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
