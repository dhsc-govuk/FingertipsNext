import 'dotenv/config';

export default {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['<rootDir>/**/*.test.ts'],
  transformIgnorePatterns: ['^.+\\.js$'],
};
