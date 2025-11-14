import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore'],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
