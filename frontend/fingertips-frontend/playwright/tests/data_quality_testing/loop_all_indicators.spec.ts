import { test } from '../../page-objects/pageFactory';
import {
  AreaMode,
  getAllPOCIndicators,
  IndicatorMode,
  SearchMode,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { IndicatorDocument } from '@/lib/search/searchTypes';
//@ts-expect-error don't care about type checking this json file
const indicatorData = indicators as IndicatorDocument[];

export type SimpleIndicatorDocument = {
  indicatorID: string;
  indicatorName: string;
  associatedAreaCodes: string[];
};
let allIndicators: SimpleIndicatorDocument[] = [];

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
}

const coreTestJourneys: TestParams[] = [
  // {
  //   indicatorMode: IndicatorMode.ONE_INDICATOR,
  //   areaMode: AreaMode.ENGLAND_AREA,
  //   searchMode: SearchMode.ONLY_SUBJECT,
  // }, // see comments in test helpers
  // {
  //   indicatorMode: IndicatorMode.ONE_INDICATOR,
  //   areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
  //   searchMode: SearchMode.ONLY_SUBJECT,
  // }, // 4 filters needed to be added to filterIndicatorsOnlyPOC- ticket 1
  // {
  //   indicatorMode: IndicatorMode.ONE_INDICATOR,
  //   areaMode: AreaMode.TWO_PLUS_AREAS, // seems to be a bug with filtering by select all - ticket 2
  //   searchMode: SearchMode.ONLY_SUBJECT,
  // },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
  },
  // {
  //   indicatorMode: IndicatorMode.ONE_INDICATOR,
  //   areaMode: AreaMode.ONE_AREA,
  //   searchMode: SearchMode.BOTH_SUBJECT_AND_AREA, // seems to be a bug with pass through from homepage area filtering - ticket 3
  // },
  // {
  //   indicatorMode: IndicatorMode.ONE_INDICATOR,
  //   areaMode: AreaMode.TWO_AREAS,
  //   searchMode: SearchMode.BOTH_SUBJECT_AND_AREA, // seems to be a bug with pass through from homepage area filtering - ticket 3
  // },
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

  allIndicators = getAllPOCIndicators(typedIndicatorData);

  // Loop through each indicator name and test journey
  for (const indicator of allIndicators) {
    for (const { searchMode, indicatorMode, areaMode } of coreTestJourneys) {
      await test.step(`Testing ${indicator.indicatorName} with ${searchMode}`, async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();

        await homePage.searchForIndicatorsAndAreas(
          searchMode,
          areaMode,
          indicator.indicatorName,
          indicator.associatedAreaCodes[1]
        );
        await homePage.clickSearchButton();

        await resultsPage.checkSearchResultsTitle(indicator.indicatorName);

        if (searchMode === SearchMode.ONLY_SUBJECT) {
          await resultsPage.selectAreaCheckboxes(areaMode);
        }
        await resultsPage.selectFirstIndicatorCheckbox();

        await resultsPage.clickViewChartsButton();
        await chartPage.checkOnChartPage();
        await chartPage.checkChartVisibility(
          indicatorMode,
          areaMode,
          test,
          indicator.indicatorID
        );
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
