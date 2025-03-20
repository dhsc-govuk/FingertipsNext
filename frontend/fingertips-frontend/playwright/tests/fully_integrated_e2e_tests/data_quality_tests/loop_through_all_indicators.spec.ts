import { test } from '../../../page-objects/pageFactory';
import {
  AreaMode,
  getAllPOCIndicatorNames,
  IndicatorMode,
  SearchMode,
} from '../../../testHelpers';
import indicators from '../../../../../../search-setup/assets/indicators.json';
import { IndicatorDocument } from '@/lib/search/searchTypes';
//@ts-expect-error don't care about type checking this json file
const indicatorData = indicators as IndicatorDocument[];
let allIndicatorNames: string[] = [];

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
}

const coreTestJourneys: TestParams[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
  },
];

/**
 * This test is a data quality testing tool - designed to loop through all indicators to check for any issues.
 */
test.beforeAll(
  `return all matching indicator names flagged as POC`,
  async () => {
    const typedIndicatorData = indicatorData.map(
      (indicator: IndicatorDocument) => {
        return {
          ...indicator,
          lastUpdated: new Date(indicator.lastUpdatedDate),
        };
      }
    );

    allIndicatorNames = getAllPOCIndicatorNames(typedIndicatorData);
  }
);
test.describe(`Search using indicator name`, () => {
  allIndicatorNames.forEach((indicatorName) => {
    coreTestJourneys.forEach(({ searchMode, indicatorMode, areaMode }) => {
      test(`${searchMode} then select ${indicatorMode} and ${areaMode} then check the charts page`, async ({
        homePage,
        resultsPage,
        chartPage,
      }) => {
        await test.step('Navigate to home page and search for indicators', async () => {
          await homePage.navigateToHomePage();
          await homePage.checkOnHomePage();

          await homePage.searchForIndicators(searchMode, indicatorName);
          await homePage.clickSearchButton();
        });

        await test.step(`check results page and select ${areaMode} then ${indicatorMode}`, async () => {
          await resultsPage.waitForURLToContain(indicatorName);
          await resultsPage.checkSearchResultsTitle(indicatorName);

          await resultsPage.selectIndicatorCheckboxByName(indicatorName);

          await resultsPage.clickViewChartsButton();
        });

        await test.step(`check chart page and assert that the displayed charts are correct`, async () => {
          await chartPage.checkOnChartPage();

          await chartPage.checkChartVisibility(indicatorMode, areaMode, test);
        });
      });
    });
  });
});

// log out current url when a test fails
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Test failed - capture the URL
    const url = page.url();
    console.log(`Test failed! Current URL: ${url}`);

    // You can also attach it to the test report
    await testInfo.attach('failed-url', {
      body: url,
      contentType: 'text/plain',
    });
  }
});
