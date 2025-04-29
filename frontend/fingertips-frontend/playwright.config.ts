import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

const isCI = !!process.env.CI;
const url = process.env.FINGERTIPS_FRONTEND_URL || 'http://localhost:3000';
console.log(`The target URL for this test execution is ${url}`); // allows to see where tests are executed
const jobUrl = process.env.JOB_URL;
const runCommand =
  process.env.MOCK_SERVER === 'false'
    ? 'npm run build && npm run start'
    : 'npm run build && npm run start-local-mocks';

// Create the base config
const config: PlaywrightTestConfig = {
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: isCI, // fails the build on CI if you accidentally left test.only in the source code
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : '50%', // 50% of the available CPUs
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.075,
      scale: 'device',
      pathTemplate: '.test/spec/snaps/{projectName}/{testFilePath}/{arg}{ext}',
    },
  },

  reporter: isCI
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
    trace: isCI ? 'off' : 'on-first-retry',
    screenshot: 'on-first-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        channel: 'chromium',
        launchOptions: {
          args: [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-skia-runtime-opts',
            '--disable-font-subpixel-positioning',
            '--disable-lcd-text',
          ],
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
  ],
};

// Add to base config to spin up a webServer if FINGERTIPS_FRONTEND_URL is not passed
if (!process.env.FINGERTIPS_FRONTEND_URL) {
  config.webServer = {
    command: runCommand,
    url: url,
    reuseExistingServer: true,
    timeout: 120000,
  };
}

export default defineConfig(config);
