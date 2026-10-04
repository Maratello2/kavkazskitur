import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';

const USERS_FILE = path.join(process.cwd(), 'data', 'adminUsers.json');

export interface AdminUserRecord {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'editor';
  password_hash: string;
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
}

const DEFAULT_USERS: AdminUserRecord[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Expedition Operations Lead',
    email: 'hq@kavkazskitur.com',
    role: 'superadmin',
    password_hash: '$2a$10$QYT3l0VpdqLYPIZFeSiJ7ONY70427pq5qibZlUG.0ZX5aQos48QyC',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    last_login: '2026-09-17T21:41:20.000Z',
  },
];

function readUsersFromFile(): AdminUserRecord[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AdminUsers API] Error reading users file:', err);
  }
  return DEFAULT_USERS;
}

function writeUsersToFile(users: AdminUserRecord[]) {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

    const srcFile = path.join(process.cwd(), 'src', 'data', 'adminUsers.json');
    const srcDir = path.dirname(srcFile);
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(srcFile, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AdminUsers API] Error writing users file:', err);
  }
}

function sanitizeUser(u: AdminUserRecord) {
  const { password_hash, ...safe } = u;
  return safe;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const users = readUsersFromFile();
  return NextResponse.json({
    success: true,
    users: users.map(sanitizeUser),
    currentUser: {
      id: admin.adminId,
      username: admin.username,
      role: admin.role,
    },
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (admin.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'Permission denied. Only Superadmins can provision new operator accounts.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { username, password, name, email, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and initial password are required.' },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim().toLowerCase();
    if (cleanUser.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    const users = readUsersFromFile();
    if (users.some((u) => u.username.toLowerCase() === cleanUser)) {
      return NextResponse.json(
        { success: false, error: `An administrator with username "${cleanUser}" already exists.` },
        { status: 400 }
      );
    }

    const validRoles = ['superadmin', 'manager', 'editor'];
    const assignedRole = validRoles.includes(role) ? (role as 'superadmin' | 'manager' | 'editor') : 'manager';

    const hash = await bcrypt.hash(String(password).trim(), 10);

    const newUser: AdminUserRecord = {
      id: Date.now(),
      username: cleanUser,
      name: (name && String(name).trim()) || cleanUser,
      email: (email && String(email).trim()) || '',
      role: assignedRole,
      password_hash: hash,
      is_active: true,
      created_at: new Date().toISOString(),
      last_login: null,
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Try DB sync if available
    try {
      await pool.query(
        `INSERT INTO admin_users (username, password_hash, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (username) DO NOTHING`,
        [newUser.username, newUser.password_hash, newUser.role, newUser.is_active]
      );
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(newUser),
      message: `Administrator "${cleanUser}" created successfully.`,
    });
  } catch (err: any) {
    console.error('[AdminUsers API] POST error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (admin.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'Permission denied. Only Superadmins can modify operator credentials.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, name, email, role, is_active, password } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const users = readUsersFromFile();
    const idx = users.findIndex((u) => u.id === Number(id));
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    const targetUser = users[idx];

    // Safeguard: Do not deactivate or demote the last superadmin
    if (targetUser.role === 'superadmin' && (is_active === false || (role && role !== 'superadmin'))) {
      const activeSuperadmins = users.filter((u) => u.role === 'superadmin' && u.is_active && u.id !== targetUser.id);
      if (activeSuperadmins.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot deactivate or demote the only remaining active Superadmin.' },
          { status: 400 }
        );
      }
    }

    if (name !== undefined) targetUser.name = String(name).trim();
    if (email !== undefined) targetUser.email = String(email).trim();
    if (role && ['superadmin', 'manager', 'editor'].includes(role)) {
      targetUser.role = role as any;
    }
    if (is_active !== undefined) {
      targetUser.is_active = Boolean(is_active);
    }
    if (password && String(password).trim().length > 0) {
      targetUser.password_hash = await bcrypt.hash(String(password).trim(), 10);
    }

    users[idx] = targetUser;
    writeUsersToFile(users);

    return NextResponse.json({
      success: true,
      user: sanitizeUser(targetUser),
      message: `Administrator "${targetUser.username}" updated successfully.`,
    });
  } catch (err: any) {
    console.error('[AdminUsers API] PATCH error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (admin.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'Permission denied. Only Superadmins can remove operator accounts.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const targetId = Number(idParam);
    const users = readUsersFromFile();
    const targetUser = users.find((u) => u.id === targetId);

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    // Safeguard 1: Cannot delete yourself
    if (targetUser.username.toLowerCase() === admin.username.toLowerCase() || targetUser.id === admin.adminId) {
      return NextResponse.json(
        { success: false, error: 'You cannot delete your own active administrative account.' },
        { status: 400 }
      );
    }

    // Safeguard 2: Cannot delete the last superadmin
    if (targetUser.role === 'superadmin') {
      const otherSuperadmins = users.filter((u) => u.role === 'superadmin' && u.id !== targetId);
      if (otherSuperadmins.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete the only remaining Superadmin account.' },
          { status: 400 }
        );
      }
    }

    const filtered = users.filter((u) => u.id !== targetId);
    writeUsersToFile(filtered);

    // Try DB delete if available
    try {
      await pool.query('DELETE FROM admin_users WHERE username = $1', [targetUser.username]);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Administrator "${targetUser.username}" removed.`,
    });
  } catch (err: any) {
    console.error('[AdminUsers API] DELETE error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
