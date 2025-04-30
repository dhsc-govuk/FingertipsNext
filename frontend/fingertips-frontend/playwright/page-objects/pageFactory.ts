/* eslint-disable react-hooks/rules-of-hooks */
import AxeBuilder from '@axe-core/playwright';
import HomePage from './pages/homePage';
import ResultsPage from './pages/resultsPage';
import ChartPage from './pages/chartPage';
import { test as baseTest } from '@playwright/test';
import IndicatorPage from '@/playwright/page-objects/pages/indicatorPage';
import { addLooksSameMatcher } from '../looksSameMatcher';

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

    // See DHSCFT-536 - for more details on exception
    const knownHighchartsExc =
      "Cannot read properties of undefined (reading 'stacks')";
    // Uncaught exceptions
    page.on('pageerror', (error) => {
      if (failOnUnhandledError && error.message != knownHighchartsExc) {
        throw new Error(
          `Page error: ${error.message}. Stack trace: ${error.stack}`
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

// Add the custom matcher to our expect instance
addLooksSameMatcher(expect);

// Add type definition for TypeScript

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      toMatchScreenshotWithLooksSame(
        screenshotName: string,
        options?: {
          tolerance?: number;
          ignoreCaret?: boolean;
          ignoreAntialiasing?: boolean;
          createDiffImage?: boolean;
          diffDir?: string;
          baselineDir?: string;
          screenshotsDir?: string;
        }
      ): Promise<R>;
    }
  }
}
