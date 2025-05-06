import { test } from '../../page-objects/pageFactory';
import {
  AreaMode,
  getAllIndicatorIds,
  getAllIndicatorIdsForSearchTerm,
  IndicatorMode,
  SearchMode,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
//@ts-expect-error don't care about type checking this json file
const indicatorData = indicators as RawIndicatorDocument[];
const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'north west region',
};
export type SimpleIndicatorDocument = {
  indicatorID: string;
  indicatorName: string;
  associatedAreaCodes: string[];
  dataSource: string;
};
let allIndicators: SimpleIndicatorDocument[] = [];

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
  searchMode: SearchMode;
  subjectSearchTerm?: string;
}

const coreTestJourneys: TestParams[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: '22401',
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.BOTH_SUBJECT_AND_AREA,
    subjectSearchTerm: 'emergency',
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_AREA, // therefore no subject search term required
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
  },
];

/**
 * This tests, in parallel, the indicator + area scenario combinations from
 * https://ukhsa.atlassian.net/wiki/spaces/FTN/pages/171448170/Frontend+Application+-+Displaying+Charts
 * These scenario combinations are know as core journeys and are defined above in coreTestJourneys,
 * they were chosen as they are happy paths covering lots of chart components, they also cover the three different search mode scenarios.
 * All 15 journeys are covered in lower level unit testing.
 */
test.describe(`Search via`, () => {
  coreTestJourneys.forEach(
    ({ searchMode, indicatorMode, areaMode, subjectSearchTerm }) => {
      const typedIndicatorData = indicatorData.map(
        (indicator: RawIndicatorDocument) => {
          return {
            ...indicator,
            lastUpdated: new Date(indicator.lastUpdatedDate),
          };
        }
      );

      allIndicators =
        searchMode === SearchMode.ONLY_AREA
          ? getAllIndicatorIds(typedIndicatorData)
          : getAllIndicatorIdsForSearchTerm(
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

        await test.step(`check results page based on search mode and select ${areaMode} then ${indicatorMode}`, async () => {
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
          await resultsPage.selectIndicatorCheckboxes(
            allIndicators,
            indicatorMode
          );
          await resultsPage.checkRecentTrends(areaMode);

          await resultsPage.clickViewChartsButton();
        });

        await test.step(`check chart page and assert that the displayed charts are correct`, async () => {
          await chartPage.checkOnChartPage();

          await chartPage.checkChartVisibility(indicatorMode, areaMode, test);
        });
      });
    }
  );
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
