'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import CompareBar from './CompareBar';
import QuickOrderModal from './QuickOrderModal';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin || isHome) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Footer />
      <CompareBar />
      <QuickOrderModal />
    </>
  );
}
