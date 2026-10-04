/**
 * Normalizes image paths from database/inputs to valid static URLs
 * and automatically substitutes .webp versions for high performance.
 */
export function getImageUrl(pathStr: string | null | undefined): string {
  if (!pathStr || typeof pathStr !== 'string' || pathStr.trim() === '') {
    return '/static/optimized/hero-day-elbrus.svg';
  }

  let clean = pathStr.trim();

  // Normalize fallback elbrus references to the daytime hero image
  if (
    clean === '/static/elbrus.jpg' ||
    clean === 'elbrus.jpg' ||
    clean === '/elbrus.jpg' ||
    clean.includes('hero_elbrus.webp') ||
    clean.includes('hero-day-elbrus')
  ) {
    return '/static/optimized/hero-day-elbrus.svg';
  }

  // External URLs (e.g. Telegram CDN / Cloudinary) remain as-is
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // Standardize relative paths to root-relative /static/
  if (clean.startsWith('static/')) {
    clean = '/' + clean;
  } else if (!clean.startsWith('/static/')) {
    if (clean.startsWith('/images/')) {
      clean = '/static' + clean;
    } else if (clean.startsWith('/')) {
      clean = clean;
    } else {
      clean = '/static/images/' + clean;
    }
  }

  // Automatically substitute .jpg, .jpeg, .png with .webp
  // All images in /static/images/ are pre-compressed to .webp via bulk_compress.py
  clean = clean.replace(/\.(jpe?g|png)$/i, '.webp');

  return clean;
}
