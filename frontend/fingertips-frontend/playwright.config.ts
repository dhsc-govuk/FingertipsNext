import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

const url = process.env.FINGERTIPS_FRONTEND_URL || 'http://localhost:3000';
const jobUrl = process.env.JOB_URL;
const runCommand =
  process.env.MOCK_SERVER === 'false' ? 'npm run dev-no-mocks' : 'npm run dev';

// Create the base config
const config: PlaywrightTestConfig = {
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fails the build on CI if you accidentally left test.only in the source code.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [
        ['list'],
        ['@estruyf/github-actions-reporter'],
        ['html'],
        [
          'playwright-ctrf-json-reporter',
          {
            buildUrl: jobUrl,
            buildName: 'fingertips next',
            buildNumber: `build ${process.env.npm_package_version}`,
          },
        ],
      ]
    : [['list'], ['html']],
  use: {
    baseURL: url,
    trace: 'on-first-retry',
    screenshot: 'on-first-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

// Add to base config to spin up a webServer if FINGERTIPS_FRONTEND_URL is not passed
if (!process.env.FINGERTIPS_FRONTEND_URL) {
  config.webServer = {
    command: runCommand,
    url: url,
    reuseExistingServer: true,
  };
}

export default defineConfig(config);
