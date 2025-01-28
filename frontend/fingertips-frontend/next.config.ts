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
    '@opentelemetry/sdk-metrics',
    '@opentelemetry/sdk-node',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/semantic-conventions',
    '@opentelemetry/exporter-jaeger',
  ],
  nextDontCompile: 'frontend/fingertips-frontend/playwright/testHelpers.ts',
  extends: 'frontend/fingertips-frontend/tsconfig.json',
};

export default nextConfig;
