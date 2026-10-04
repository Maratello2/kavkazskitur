import jwt from 'jsonwebtoken';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_PENDING_COOKIE = 'admin_pending';

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: ADMIN_JWT_SECRET environment variable is not configured in production!');
    }
    return 'dev-only-secret-kavkazskitur-2026-fallback';
  }
  return secret;
}

export interface AdminSessionPayload {
  adminId: number;
  username: string;
  role: string;
}

export interface PendingSessionPayload {
  adminId: number;
  username: string;
}

export function signAdminSession(payload: AdminSessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '12h' });
}

export function verifyAdminSession(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function signPendingSession(payload: PendingSessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '10m' });
}

export function verifyPendingSession(token: string): PendingSessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as PendingSessionPayload;
  } catch {
    return null;
  }
}

export function generateTwoFactorCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
