import { test } from '../../page-objects/pageFactory';
import {
  checkTrendsOnResultsPage,
  getAllIndicators,
  getAllIndicatorsForSearchTerm,
  mergeIndicatorData,
  SearchMode,
  SimpleIndicatorDocument,
  TestTag,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
import { coreTestJourneys } from './core_journey_config';
//@ts-expect-error don't type check this json file
const indicatorData = indicators as RawIndicatorDocument[];
const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'north west region',
};
let allValidIndicators: SimpleIndicatorDocument[] = [];
let selectedIndicatorsData: SimpleIndicatorDocument[] = [];
const checkTrends = checkTrendsOnResultsPage();

/**
 * This tests, in parallel, the indicator + area scenario combinations from
 * https://ukhsa.atlassian.net/wiki/spaces/FTN/pages/171448170/Frontend+Application+-+Displaying+Charts
 * These scenario combinations are know as core journeys and are defined in coreTestJourneys,
 * they were chosen as they are happy paths covering lots of chart components, they also cover the three different search mode scenarios.
 * All 15 journeys are covered in lower level unit testing.
 */
test.describe(
  `Search via`,
  {
    tag: [TestTag.CI, TestTag.CD],
  },
  () => {
    coreTestJourneys.forEach(
      ({
        searchMode,
        indicatorMode,
        areaMode,
        subjectSearchTerm,
        indicatorsToSelect,
      }) => {
        const typedIndicatorData = indicatorData.map(
          (indicator: RawIndicatorDocument) => {
            return {
              ...indicator,
              lastUpdated: new Date(indicator.lastUpdatedDate),
            };
          }
        );

        allValidIndicators =
          searchMode === SearchMode.ONLY_AREA
            ? getAllIndicators(typedIndicatorData)
            : getAllIndicatorsForSearchTerm(
                typedIndicatorData,
                subjectSearchTerm!
              );

        test(`${searchMode} then select ${indicatorMode} and ${areaMode} then check the charts page`, async ({
          homePage,
          resultsPage,
          chartPage,
        }) => {
          await test.step('Navigate to home page and search for indicators', async () => {
            await homePage.navigateToHomePage();
            await homePage.checkOnHomePage();

            await homePage.searchForIndicators(
              searchMode,
              subjectSearchTerm,
              areaSearchTerm.areaName
            );
            await homePage.clickSearchButton();
          });

          await test.step(`check results page based on search mode and then select ${areaMode} and ${indicatorMode}`, async ({}) => {
            await resultsPage.waitForURLToContainBasedOnSearchMode(
              searchMode,
              subjectSearchTerm!,
              areaSearchTerm.areaCode
            );
            await resultsPage.checkSearchResultsTitleBasedOnSearchMode(
              searchMode,
              subjectSearchTerm!
            );

            await resultsPage.selectAreasFiltersIfRequired(
              searchMode, // Only selects area filters if search mode is ONLY_SUBJECT
              areaMode,
              subjectSearchTerm!
            );

            await resultsPage.checkDisplayedIndicators(
              allValidIndicators,
              searchMode
            );

            await resultsPage.selectIndicatorCheckboxes(indicatorsToSelect);

            await resultsPage.checkRecentTrends(
              areaMode,
              indicatorsToSelect,
              checkTrends
            );

            await resultsPage.clickViewChartsButton();
          });

          await test.step(`check the results page and then view the chart page, checking that the displayed charts are correct`, async () => {
            selectedIndicatorsData = mergeIndicatorData(
              indicatorsToSelect,
              typedIndicatorData
            );

            await chartPage.checkSelectedIndicatorPillsText(
              selectedIndicatorsData
            );

            await chartPage.checkOnChartPage();

            await chartPage.checkChartVisibility(
              indicatorMode,
              areaMode,
              test,
              selectedIndicatorsData
            );
          });
        });
      }
    );
  }
);

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
