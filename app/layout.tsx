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
        <meta name="theme-color" content="#091422" />
        {/* Responsive LCP Preloads: Instant hardware painting on both Mobile and Desktop */}
        <link
          rel="preload"
          as="image"
          href="/hero/summit_apex_5642_480.webp"
          type="image/webp"
          media="(max-width: 480px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/hero/summit_apex_5642_mobile.webp"
          type="image/webp"
          media="(min-width: 481px) and (max-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/hero/summit_apex_5642.webp"
          type="image/webp"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
        {/* Schema.org Organization & TravelAgency Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'KavKazSkiTur',
              alternateName: 'КавказСкиТур',
              url: 'https://kavkazskitur.com',
              logo: 'https://kavkazskitur.com/brand/logo_kst.svg',
              image: 'https://kavkazskitur.com/hero/summit_apex_5642.webp',
              description:
                'High-altitude mountaineering ascents on Mt. Elbrus (5,642 m), backcountry ski touring, and wild Caucasus expeditions with private base camp at Barrels-Garabashi 3,800 m.',
              telephone: '+79280828413',
              email: 'info@kavkazskitur.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Gorkogo St. 74',
                addressLocality: 'Nalchik',
                addressRegion: 'Kabardino-Balkaria',
                postalCode: '360000',
                addressCountry: 'RU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 43.4853,
                longitude: 43.6071,
              },
              priceRange: '₽₽₽',
            }),
          }}
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
