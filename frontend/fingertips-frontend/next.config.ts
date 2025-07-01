import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  serverExternalPackages: [
    '@azure/monitor-opentelemetry',
    '@opentelemetry/api',
    '@opentelemetry/resources',
    '@opentelemetry/sdk-metrics',
    '@opentelemetry/sdk-node',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/semantic-conventions',
    '@opentelemetry/exporter-jaeger',
  ],
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js'
  ),
  async rewrites() {
    // useful for dev as it reverse proxies the api from wherever it is
    // onto /api/ avoiding CORS issues and is more representative of prod
    return [
      {
        source: '/api/:path*', // your local path
        destination: 'http://localhost:5144/:path*', // external API
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // TODO: What should this be set to?
    },
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
