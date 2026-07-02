import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // dev-only: in prod, Caddy intercepts /geo/* and /api/*
  async rewrites() {
    // fallback only needs to be a syntactically valid URL for Next's build-time
    // rewrite validation — it's never actually requested in prod (see above),
    // and .env.local (gitignored) isn't present during the Docker build.
    const geoUrl = process.env.NATURAL_EARTH_CDN || 'http://localhost:8787';
    return [
      {
        // strip /geo/natural_earth prefix before forwarding
        source: '/geo/natural_earth/:path*',
        destination: `${geoUrl}/:path*`,
      },
      {
        // strip /api prefix before forwarding 
        source: '/api/:path*',
        destination: `http://localhost:4000/:path*`,
      },
    ];
  },
};

export default nextConfig;
