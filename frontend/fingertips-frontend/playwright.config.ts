import { defineConfig, devices } from '@playwright/test';

const url = process.env.FINGERTIPS_FRONTEND_URL || 'http://localhost:3000';
const jobUrl = process.env.JOB_URL;
const runCommand =
  process.env.START_DOCKER_WEBSERVER === 'true'
    ? 'npm run dev-docker'
    : 'npm run dev';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fails the build on CI if you accidentally left test.only in the source code.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  expect: process.env.CI ? { timeout: 10_000 } : { timeout: 5_000 },
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

  // Run your local dev server before starting the tests
  webServer: {
    command: runCommand,
    url: url,
    reuseExistingServer: true,
  },
});
