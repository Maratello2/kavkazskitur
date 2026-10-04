import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import { ADMIN_SESSION_COOKIE, ADMIN_PENDING_COOKIE } from '@/lib/adminAuth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, admin });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(ADMIN_PENDING_COOKIE);
  return response;
}
