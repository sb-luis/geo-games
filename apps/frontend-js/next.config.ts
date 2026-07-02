import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // dev-only: in prod, Caddy intercepts /api/*
  async rewrites() {
    return [
      {
        // strip /api prefix before forwarding
        source: '/api/:path*',
        destination: `http://localhost:4000/:path*`,
      },
    ];
  },
};

export default nextConfig;
