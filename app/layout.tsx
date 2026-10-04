import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import FloatingActions from '@/components/FloatingActions';
import SiteChrome from '@/components/SiteChrome';
import CookieBanner from '@/components/CookieBanner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kavkazskitur.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KavKazSkiTur — Authentic Alpine Expeditions & Elbrus Climbs',
    template: '%s | KavKazSkiTur',
  },
  description: 'High-altitude mountaineering ascents on Mt. Elbrus (5,642 m), backcountry ski touring, and wild Caucasus expeditions. Private base camp at Barrels-Garabashi 3,800 m.',
  openGraph: {
    title: 'KavKazSkiTur — Authentic Alpine Expeditions & Elbrus Climbs',
    description: 'High-altitude mountaineering ascents on Mt. Elbrus (5,642 m), backcountry ski touring, and wild Caucasus expeditions. Private base camp at Barrels-Garabashi 3,800 m.',
    url: siteUrl,
    siteName: 'KavKazSkiTur',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/hero/mountain_orig.jpg',
        width: 1920,
        height: 1080,
        alt: 'Central Caucasus Alpine Range — KavKazSkiTur',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="preload"
          as="image"
          href="/hero/hero-1.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="w-full max-w-full overflow-x-hidden bg-[#091422] text-slate-100 min-h-[100dvh] antialiased selection:bg-[#FF6A00]/30 selection:text-white flex flex-col">
        <Header />
        <div className="flex-1">
          <SiteChrome>{children}</SiteChrome>
        </div>
        <FloatingActions />
        <CookieBanner />
      </body>
    </html>
  );
}
