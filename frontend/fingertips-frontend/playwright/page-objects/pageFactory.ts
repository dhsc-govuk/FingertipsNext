/* eslint-disable react-hooks/rules-of-hooks */
import AxeBuilder from '@axe-core/playwright';
import HomePage from './pages/homePage';
import ResultsPage from './pages/resultsPage';
import ChartPage from './pages/chartPage';
import UploadPage from './pages/uploadPage';
import {
  test as baseTest,
  Page,
  Browser,
  BrowserContext,
} from '@playwright/test';
import IndicatorPage from '@/playwright/page-objects/pages/indicatorPage';
import type { Result } from 'axe-core';
import { ACCESSIBILITY_TAGS } from '../testHelpers/testDefinitions';
import EntraPage from './pages/entraPage';

interface PageObjects {
  homePage: HomePage;
  resultsPage: ResultsPage;
  chartPage: ChartPage;
  indicatorPage: IndicatorPage;
  entraPage: EntraPage;
  uploadPage: UploadPage;
}

interface TestOptions {
  axeBuilder: AxeBuilder;
  failOnUnhandledError: boolean;
  freshContext: BrowserContext;
  freshPage: Page;
}

const setupErrorHandling = (page: Page, failOnUnhandledError: boolean) => {
  page.on('console', (message) => {
    if (failOnUnhandledError && message.type() === 'error') {
      throw new Error(`Console error: ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    throw new Error(
      `Page error: ${error.message}. Stack trace: ${error.stack}`
    );
  });
};

const logAccessibilityViolations = (
  violations: Result[],
  testTitle: string,
  testId: string
) => {
  if (violations.length > 0) {
    console.log(
      `${violations.length} accessibility violations found for "${testTitle.split('|')[0].trim()}" | testId: ${testId}`
    );
  }
};

const testBase = baseTest.extend<TestOptions>({
  failOnUnhandledError: [true, { option: true }],

  freshContext: async ({ browser }, use) => {
    const contextOptions: Parameters<Browser['newContext']>[0] = {};
    contextOptions.storageState = undefined;

    const context = await browser.newContext(contextOptions);

    await use(context);

    // Clean up the context after the test
    await context.close();
  },

  freshPage: async ({ freshContext, failOnUnhandledError }, use) => {
    const page = await freshContext.newPage();
    setupErrorHandling(page, failOnUnhandledError);

    await use(page);
  },

  // Override the default page fixture to use our fresh page
  page: async ({ freshPage }, use) => {
    await use(freshPage);
  },

  axeBuilder: [
    async ({ page }, use, testInfo) => {
      // Initialize an AxeBuilder with the specified accessibility standards
      const axeBuilder = new AxeBuilder({ page }).withTags(
        Array.from(ACCESSIBILITY_TAGS)
      );

      await use(axeBuilder);

      // Execute the accessibility scan
      const accessibilityResults = await axeBuilder.analyze();

      logAccessibilityViolations(
        accessibilityResults.violations,
        testInfo.title,
        testInfo.testId
      );

      expect(
        accessibilityResults.violations,
        'Auto-accessibility test failed.'
      ).toEqual([]);
    },

    // auto set to false, so a11y tests only execute when we call expectNoAccessibilityViolations(axeBuilder)
    { scope: 'test', auto: false },
  ],
});

export const test = testBase.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
  chartPage: async ({ page }, use) => {
    await use(new ChartPage(page));
  },
  indicatorPage: async ({ page }, use) => {
    await use(new IndicatorPage(page));
  },
  entraPage: async ({ page }, use) => {
    await use(new EntraPage(page));
  },
  uploadPage: async ({ page }, use) => {
    await use(new UploadPage(page));
  },
});

export const expect = test.expect;
