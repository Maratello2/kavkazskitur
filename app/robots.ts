import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kavkazskitur.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api', '/api/', '/maratello', '/maratello/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
