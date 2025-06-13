import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  preset: 'ts-jest',
  testTimeout: 10000,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 94.4,
      branches: 85.4,
      functions: 93.6,
      lines: 95,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '<rootDir>/**/*.tsx',
    '!<rootDir>/generated-sources/**/*',
    '!<rootDir>/*.d.ts',
    '!<rootDir>/.next/**/*',
    '!<rootDir>/mock/**/*',
    '!<rootDir>/playwright/**/*',
    '!<rootDir>/instrumentation.*',
    '!<rootDir>/*.config.ts',
    '!<rootDir>/**/*.types.ts',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
    '^@azure/(.*)$': '<rootDir>/node_modules/@azure/$1',
  },
  transformIgnorePatterns: ['node-modules/next-auth'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
