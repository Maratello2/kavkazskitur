import type { MetadataRoute } from 'next';
import { TOURS_DATA } from '@/data/toursData';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kavkazskitur.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/expeditions',
    '/tours',
    '/schedule',
    '/safety',
    '/barrels',
    '/acclimatization',
    '/cabinet',
    '/offer',
    '/privacy',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const tourRoutes: MetadataRoute.Sitemap = [];
  for (const tour of TOURS_DATA) {
    tourRoutes.push({
      url: `${siteUrl}/tours/${tour.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    });
    for (const alias of tour.aliases) {
      tourRoutes.push({
        url: `${siteUrl}/tours/${alias}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...tourRoutes];
}
