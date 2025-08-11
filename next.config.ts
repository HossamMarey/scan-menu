import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/localization/server.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  },
};

export default withNextIntl(nextConfig);
