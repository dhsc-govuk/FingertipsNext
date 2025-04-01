import { test } from '../../page-objects/pageFactory';
import {
  AreaMode,
  getAllIndicatorIdsForSearchTerm,
  IndicatorMode,
  SearchMode,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { AreaDocument, IndicatorDocument } from '@/lib/search/searchTypes';
//@ts-expect-error don't care about type checking this json file
const indicatorData = indicators as IndicatorDocument[];
const subjectSearchTerm = 'hospital';
const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'north west region',
};
let allIndicatorIDs: string[];

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
}

const coreTestJourneys: TestParams[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.BOTH_SUBJECT_AND_AREA,
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.TWO_PLUS_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
  },
  {
    indicatorMode: IndicatorMode.TWO_PLUS_INDICATORS,
    areaMode: AreaMode.TWO_PLUS_AREAS,
    searchMode: SearchMode.ONLY_AREA,
  },
  // {
  // enable once DHSCFT-237 and DHSCFT-225 are done
  //   indicatorMode: IndicatorMode.TWO_PLUS_INDICATORS,
  //   areaMode: AreaMode.ENGLAND_AREA,
  //   searchMode: SearchMode.ONLY_AREA,
  // },
];

/**
 * This tests, in parallel, the indicator + area scenario combinations from
 * https://ukhsa.atlassian.net/wiki/spaces/FTN/pages/171448170/Frontend+Application+-+Displaying+Charts
 * These scenario combinations are know as core journeys and are defined above in coreTestJourneys,
 * they were chosen as they are happy paths covering lots of chart components, they also cover the three different search mode scenarios.
 * All 15 journeys are covered in lower level unit testing.
 */
test.beforeAll(
  `return all matching indicatorIDs from the real data source based on the subjectSearchTerm: ${subjectSearchTerm}`,
  () => {
    const typedIndicatorData = indicatorData.map(
      (indicator: IndicatorDocument) => {
        return {
          ...indicator,
          lastUpdated: new Date(indicator.lastUpdatedDate),
        };
      }
    );

    allIndicatorIDs = getAllIndicatorIdsForSearchTerm(
      typedIndicatorData,
      subjectSearchTerm
    );
  }
);
test.describe(`Search via`, () => {
  coreTestJourneys.forEach(({ searchMode, indicatorMode, areaMode }) => {
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

      await test.step(`check results page based off search Mode and select ${areaMode} then ${indicatorMode}`, async () => {
        await resultsPage.waitForURLToContainBasedOnSearchMode(
          searchMode,
          subjectSearchTerm,
          areaSearchTerm.areaCode
        );
        await resultsPage.checkSearchResultsTitleBasedOnSearchMode(
          searchMode,
          subjectSearchTerm
        );

        await resultsPage.selectAreasFiltersIfRequired(
          searchMode, // Only selects area filters if search mode is ONLY_SUBJECT
          areaMode,
          subjectSearchTerm
        );
        await resultsPage.selectIndicatorCheckboxes(
          allIndicatorIDs,
          indicatorMode
        );

        await resultsPage.clickViewChartsButton();
      });

      await test.step(`check chart page and assert that the displayed charts are correct`, async () => {
        await chartPage.checkOnChartPage();

        await chartPage.checkChartVisibility(indicatorMode, areaMode, test);
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
