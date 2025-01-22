import { defineConfig, devices } from '@playwright/test';

const url =
  process.env.FINGERTIPS_FRONTEND_URL || 'http://localhost:3000/search';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fails the build on CI if you accidentally left test.only in the source code.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: url,
    trace: 'on-first-retry',
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
    command: 'npm run dev',
    url: url,
    reuseExistingServer: !!process.env.CI,
  },
});
