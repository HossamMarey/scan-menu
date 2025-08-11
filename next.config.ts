import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/localization/server.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
