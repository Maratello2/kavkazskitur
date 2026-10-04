import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, ADMIN_PENDING_COOKIE } from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(ADMIN_PENDING_COOKIE);
  return response;
}
