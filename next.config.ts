import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    // Linting is run separately via `npm run lint`; some inherited
    // components use patterns that the newer eslint-plugin-react-hooks flags as errors.
    ignoreDuringBuilds: true,
  },
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : 'standalone',
  ...(process.env.NEXT_EXPORT === 'true' ? {} : {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
