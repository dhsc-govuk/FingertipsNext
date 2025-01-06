/* eslint-disable react-hooks/rules-of-hooks */
import AxeBuilder from '@axe-core/playwright';
import SearchPage from './pages/searchPage';
import ResultsPage from './pages/resultsPage';
import ChartPage from './pages/chartPage';
import BarPage from '@/playwright/page-objects/pages/barPage';
import { test as baseTest } from '@playwright/test';

type pages = {
  searchPage: SearchPage;
  resultsPage: ResultsPage;
  chartPage: ChartPage;
  barPage: BarPage;
};

const testBase = baseTest.extend<{ axeBuilder: AxeBuilder }>({
  axeBuilder: [
    async ({ page }, use, testInfo) => {
      //Initialize an AxeBuilder with the specified accessibility standards
      const axeBuilder = new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
      ]);

      await use(axeBuilder);

      //Execute the scan
      const accessibilityResults = await axeBuilder.analyze();

      if (accessibilityResults.violations.length > 0) {
        console.log(
          `${accessibilityResults.violations.length} accessibility violations found for "${testInfo.title.split('|')[0].trim()}" | testId: ${testInfo.testId}`
        );
      }

      //Expect no accessibility violations
      expect(
        accessibilityResults.violations,
        'Auto-accessibility test failed.'
      ).toEqual([]);
    },
    //Auto is set to true, so the fixture will be automatically used in all tests, scope is set to 'test' to create a new AxeScanner per test
    { scope: 'test', auto: true },
  ],
});

export const test = testBase.extend<pages>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
  chartPage: async ({ page }, use) => {
    await use(new ChartPage(page));
  },
  barPage: async ({ page }, use) => {
    await use(new BarPage(page));
  },
});

export const expect = test.expect;
