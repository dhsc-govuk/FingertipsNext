import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  serverExternalPackages: [
    '@azure/monitor-opentelemetry',
    '@opentelemetry/api',
    '@opentelemetry/resources',
    '@opentelemetry/semantic-conventions',
    '@opentelemetry/sdk-metrics',
    '@opentelemetry/sdk-trace-base',
  ],
};

export default nextConfig;
