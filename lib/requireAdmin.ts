import { cookies } from 'next/headers';
import { verifyAdminSession, ADMIN_SESSION_COOKIE, AdminSessionPayload } from './adminAuth';

export async function requireAdmin(): Promise<AdminSessionPayload | null> {
  if (process.env.NEXT_EXPORT === 'true') {
    return { adminId: 1, username: 'admin', role: 'superadmin' };
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifyAdminSession(token);
}
