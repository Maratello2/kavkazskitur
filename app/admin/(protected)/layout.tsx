import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/requireAdmin';
import AdminShell from './AdminShell';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <AdminShell username={admin.username} role={admin.role || 'superadmin'}>
      {children}
    </AdminShell>
  );
}
