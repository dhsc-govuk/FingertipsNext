import { test } from '../../page-objects/pageFactory';
import { getAllIndicatorIdsForSearchTerm } from '../../testHelpers';
import { IndicatorMode, AreaMode } from '../../page-objects/pages/chartPage';
import indicators from '../../../../../search-setup/assets/indicators.json';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const indicatorData = indicators as IndicatorDocument[];
const searchTerm = 'mortality';
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
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
  },
  {
    indicatorMode: IndicatorMode.MULTIPLE_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
  },
];

/**
 * This test currently tests, in parallel, three of the fifteen indicator + area
 * scenario combinations from https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
 * These three scenario combinations are know as core journeys and are defined above in coreTestJourneys,
 * they were chosen as they are happy paths covering lots of chart components.
 * Note all 15 journeys are covered in lower level unit testing.
 */
test.beforeAll(
  `return all matching indicatorIDs from the data source based on the searchTerm: ${searchTerm}`,
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
      axeBuilder,
    }) => {
      await test.step('Navigate to and verify search page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
        await homePage.expectNoAccessibilityViolations(axeBuilder);
      });

      await test.step(`Search for indicators using search term ${searchTerm} and check results title contains the search term`, async () => {
        await homePage.typeIndicator(searchTerm);
        await homePage.clickSearchButton();

        await resultsPage.waitForURLToContain(searchTerm);
        await resultsPage.expectNoAccessibilityViolations(axeBuilder);
        await resultsPage.checkSearchResultsTitle(searchTerm);
      });

      await test.step(`Select ${indicatorMode} and ${areaMode} and assert that the displayed charts are correct`, async () => {
        await resultsPage.selectIndicatorCheckboxesAndCheckURL(
          allIndicatorIDs,
          indicatorMode,
          searchTerm
        );
        await resultsPage.selectAreasCheckboxesAndCheckURL(
          areaMode,
          searchTerm
        );
        await resultsPage.clickViewChartsButton();

        await chartPage.expectNoAccessibilityViolations(axeBuilder);
        await chartPage.checkChartVisibility(indicatorMode, areaMode);
      });
    });
  });
});
