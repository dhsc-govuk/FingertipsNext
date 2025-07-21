import { test } from '../../page-objects/pageFactory';
import {
  SearchMode,
  SimpleIndicatorDocument,
  TestTag,
} from '../../testHelpers/genericTestUtilities';
import {
  getAllIndicators,
  getAllIndicatorsForSearchTerm,
  mergeIndicatorData,
} from '../../testHelpers/indicatorDataUtilities';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { RawIndicatorDocument } from '@/lib/search/searchTypes';
import { areaSearchTerm, coreTestJourneys } from './core_journey_config';

//@ts-expect-error don't type check this json file
const indicatorData = indicators as RawIndicatorDocument[];

const typedIndicatorData = indicatorData.map(
  (indicator: RawIndicatorDocument) => ({
    ...indicator,
    lastUpdated: new Date(indicator.lastUpdatedDate),
  })
);

const checkTrends = process.env.CHECK_TRENDS_ON_RESULTS_PAGE === 'true';

/**
 * This tests, in parallel, the 15 indicator + area scenario combinations defined in coreTestJourneys from core_journey_config.ts
 * These scenario combinations are known as core journeys, they are happy path journeys testing all chart components as well as
 * the three different search mode scenarios.
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
        areaFiltersToSelect,
        checkExports,
        typeOfInequalityToSelect,
        signInAsUserToCheckUnpublishedData,
      }) => {
        test(`${searchMode} then select ${indicatorMode} and ${areaMode} then check the charts page`, async ({
          homePage,
          resultsPage,
          chartPage,
        }) => {
          const allValidIndicators: SimpleIndicatorDocument[] =
            searchMode === SearchMode.ONLY_AREA
              ? getAllIndicators(typedIndicatorData)
              : getAllIndicatorsForSearchTerm(
                  typedIndicatorData,
                  subjectSearchTerm!
                );

          await test.step('Navigate to home page, sign in if required and then search for indicators', async () => {
            await homePage.navigateToHomePage();
            await homePage.checkOnHomePage();

            await homePage.signInIfRequired(
              signInAsUserToCheckUnpublishedData!
            );

            await homePage.searchForIndicators(
              searchMode,
              subjectSearchTerm,
              areaSearchTerm.areaName
            );
            await homePage.clickHomePageFormSearchButton();
          });

          await test.step(`check results page based on search mode and then select ${areaMode} and ${indicatorMode}`, async () => {
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
              areaFiltersToSelect!
            );

            await resultsPage.checkDisplayedIndicators(
              allValidIndicators,
              searchMode
            );

            await resultsPage.selectIndicatorCheckboxesAndVerifyURLUpdated(
              indicatorsToSelect
            );

            await resultsPage.checkRecentTrends(
              areaMode,
              indicatorsToSelect,
              checkTrends
            );

            await resultsPage.clickViewChartsButton();
          });

          await test.step(`check the results page and then view the chart page, checking that the displayed charts are correct`, async () => {
            const selectedIndicatorsData = mergeIndicatorData(
              indicatorsToSelect,
              typedIndicatorData
            );

            await chartPage.checkSelectedIndicatorPillsText(
              selectedIndicatorsData
            );

            await chartPage.checkOnChartPage();

            await chartPage.checkCharts(
              indicatorMode,
              areaMode,
              selectedIndicatorsData,
              areaFiltersToSelect!,
              checkExports!,
              typeOfInequalityToSelect!,
              signInAsUserToCheckUnpublishedData!
            );
          });
        });
      }
    );
  }
);

// Capture and write out the URL on test failure
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
