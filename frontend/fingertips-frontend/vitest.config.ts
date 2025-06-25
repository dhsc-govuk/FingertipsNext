import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ['**/?(*.)+(test).[jt]s?(x)'],
    environment: 'jsdom',
    globals: true,
    setupFiles: 'vitest.setup.ts',
    css: true,
    snapshotSerializers: [],
    testTimeout: 10000,
    coverage: {
      enabled: true,
      reporter: ['lcov', 'text', 'text-summary'],
      thresholds: {
        statements: 94.4,
        branches: 85.4,
        functions: 93.5,
        lines: 95,
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: [
        'generated-sources/**/*',
        '*.d.ts',
        '.next/**/*',
        'mock/**/*',
        'playwright/**/*',
        'instrumentation.*',
        '*.config.ts',
        '**/*.types.ts',
      ],
    },
  },
});
