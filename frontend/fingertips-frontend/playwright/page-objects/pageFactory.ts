/* eslint-disable react-hooks/rules-of-hooks */
import AxeBuilder from '@axe-core/playwright';
import HomePage from './pages/homePage';
import ResultsPage from './pages/resultsPage';
import ChartPage from './pages/chartPage';
import UploadPage from './pages/uploadPage';
import { test as baseTest, Page } from '@playwright/test';
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
  allowMessages: string[];
}

const setupErrorHandling = (
  page: Page,
  failOnUnhandledError: boolean,
  allowMessages: string[]
) => {
  page.on('console', (message) => {
    if (
      failOnUnhandledError &&
      message.type() === 'error' &&
      !allowMessages.some((allowedMsg) => message.text().includes(allowedMsg))
    ) {
      throw new Error(`Console error: ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    if (
      failOnUnhandledError &&
      !allowMessages.some((allowedMsg) => error.message.includes(allowedMsg))
    )
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
  allowMessages: [[''], { option: true }],

  page: async ({ page, failOnUnhandledError, allowMessages }, use) => {
    setupErrorHandling(page, failOnUnhandledError, allowMessages);
    await use(page);
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

    // auto set to false, so a11y tests only execute when we call expectNoAccessibilityViolations(axeBuilder) which is only in the isolated ui tests
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
