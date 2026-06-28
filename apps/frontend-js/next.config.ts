import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const geoUrl     = process.env.BACKEND_GEO_URL  || 'http://localhost:4100';
    const backendUrl = process.env.BACKEND_URL       || 'http://localhost:4000';
    return [
      {
        source: '/geo/:path*',
        destination: `${geoUrl}/:path*`,
      },
      {
        // Strip /api prefix before forwarding to the backend
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
