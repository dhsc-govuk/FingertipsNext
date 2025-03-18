/* eslint-disable react-hooks/rules-of-hooks */
import AxeBuilder from '@axe-core/playwright';
import HomePage from './pages/homePage';
import ResultsPage from './pages/resultsPage';
import ChartPage from './pages/chartPage';
import { test as baseTest } from '@playwright/test';
import IndicatorPage from '@/playwright/page-objects/pages/indicatorPage';

type pages = {
  homePage: HomePage;
  resultsPage: ResultsPage;
  chartPage: ChartPage;
  indicatorPage: IndicatorPage;
};

const testBase = baseTest.extend<{
  axeBuilder: AxeBuilder;
  failOnUnhandledError: boolean;
}>({
  failOnUnhandledError: [true, { option: true }],
  page: async ({ page, failOnUnhandledError }, use) => {
    // Console errors
    page.on('console', (message) => {
      if (failOnUnhandledError && message.type() === 'error') {
        throw new Error(`Console error: ${message.text()}`);
      }
    });

    // Uncaught exceptions
    page.on('pageerror', (error) => {
      if (failOnUnhandledError) {
        throw new Error(`Page error: ${error.message}`);
      }
    });

    // Network request failures
    page.on('requestfailed', (request) => {
      if (failOnUnhandledError) {
        throw new Error(
          `Request failed: ${request.url()} ${request.failure()?.errorText || ''}`
        );
      }
    });

    await use(page);
  },
  axeBuilder: [
    async ({ page }, use, testInfo) => {
      // Initialize an AxeBuilder with the specified accessibility standards
      const axeBuilder = new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
      ]);

      await use(axeBuilder);

      // Execute the scan
      const accessibilityResults = await axeBuilder.analyze();

      if (accessibilityResults.violations.length > 0) {
        console.log(
          `${accessibilityResults.violations.length} accessibility violations found for "${testInfo.title.split('|')[0].trim()}" | testId: ${testInfo.testId}`
        );
      }

      // Expect no accessibility violations
      expect(
        accessibilityResults.violations,
        'Auto-accessibility test failed.'
      ).toEqual([]);
    },

    // auto set to false, so a11y tests only execute when we call expectNoAccessibilityViolations(axeBuilder) which is only in the isolated ui tests
    { scope: 'test', auto: false },
  ],
});

export const test = testBase.extend<pages>({
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
});

export const expect = test.expect;
