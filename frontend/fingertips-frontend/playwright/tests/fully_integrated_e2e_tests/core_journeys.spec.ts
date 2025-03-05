import { test } from '../../page-objects/pageFactory';
import {
  AreaMode,
  getAllIndicatorIdsForSearchTerm,
  IndicatorMode,
} from '../../testHelpers';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const indicatorData = indicators as IndicatorDocument[];
const searchTerm = 'hospital';
let allIndicatorIDs: string[];
interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
}

const coreTestJourneys: TestParams[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.TWO_AREAS,
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
  },
  // {
  //   indicatorMode: IndicatorMode.TWO_INDICATORS,
  //   areaMode: AreaMode.ENGLAND_AREA,
  // },
];

/**
 * This test currently tests, in parallel, three out of four of the indicator + area
 * scenario combinations from https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?spaceKey=FTN&title=Frontend+Application+-+Displaying+Charts
 * These scenario combinations are know as core journeys and are defined above in coreTestJourneys,
 * they were chosen as they are happy paths covering lots of chart components.
 * All 15 journeys are covered in lower level unit testing.
 */
test.beforeAll(
  `return all matching indicatorIDs from the real data source based on the searchTerm: ${searchTerm}`,
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
      searchTerm
    );
  }
);
test.describe(`Search via search term ${searchTerm}`, () => {
  coreTestJourneys.forEach(({ indicatorMode, areaMode }) => {
    test(`then select ${indicatorMode} and ${areaMode} then check the charts page`, async ({
      homePage,
      resultsPage,
      chartPage,
    }) => {
      await test.step('Navigate to and verify search page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });

      await test.step(`Search for indicators using search term ${searchTerm} and check results title contains the search term`, async () => {
        await homePage.typeIndicator(searchTerm);
        await homePage.clickSearchButton();

        await resultsPage.waitForURLToContain(searchTerm);
        await resultsPage.checkSearchResultsTitle(searchTerm);
      });

      await test.step(`Select ${areaMode} then ${indicatorMode} and assert that the displayed charts are correct`, async () => {
        await resultsPage.selectAreasFiltersAndCheckURL(areaMode, searchTerm);
        await resultsPage.selectIndicatorCheckboxesAndCheckURL(
          allIndicatorIDs,
          indicatorMode
        );

        await resultsPage.clickViewChartsButton();

        await chartPage.checkChartVisibility(indicatorMode, areaMode);
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
