import { test } from '../../page-objects/pageFactory';
import {
  AreaMode,
  getAllPOCIndicatorNames,
  IndicatorMode,
  SearchMode,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
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
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
  },
];

/**
 * This test is a data quality testing tool - designed to loop through all indicators to check for any issues.
 */
test(`Run tests for all indicators`, async ({
  homePage,
  resultsPage,
  chartPage,
}) => {
  // return all matching indicator names flagged as POC
  const typedIndicatorData = indicatorData.map(
    (indicator: IndicatorDocument) => {
      return {
        ...indicator,
        lastUpdated: new Date(indicator.lastUpdatedDate),
      };
    }
  );

  allIndicatorNames = getAllPOCIndicatorNames(typedIndicatorData);

  // Loop through each indicator name and test journey
  for (const indicatorName of allIndicatorNames) {
    for (const { searchMode, indicatorMode, areaMode } of coreTestJourneys) {
      await test.step(`Testing ${indicatorName} with ${searchMode}`, async () => {
        // Your existing test steps
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();

        await homePage.searchForIndicators(searchMode, indicatorName);
        await homePage.clickSearchButton();

        await resultsPage.checkSearchResultsTitle(indicatorName);

        await resultsPage.selectFirstAreaCheckbox();
        await resultsPage.selectFirstIndicatorCheckbox();

        await resultsPage.clickViewChartsButton();

        await chartPage.checkOnChartPage();
        await chartPage.checkChartVisibility(indicatorMode, areaMode, test);
      });
    }
  }
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
