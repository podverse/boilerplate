import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const managementApiBackend = process.env.MANAGEMENT_API_BACKEND_URL ?? 'http://localhost:4100';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/management/v1/:path*',
        destination: `${managementApiBackend}/v1/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
