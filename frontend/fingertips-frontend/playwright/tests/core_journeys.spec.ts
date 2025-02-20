import { SearchParams } from '@/lib/searchStateManager';
import { test } from '../page-objects/pageFactory';
import {
  expectNoAccessibilityViolations,
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
} from '../testHelpers';
import { IndicatorMode, AreaMode } from '../page-objects/pages/chartPage';
import indicators from '../../../../search-setup/assets/indicators.json';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const indicatorData = indicators as IndicatorDocument[];
const searchTerm = 'mortality';
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
}

const testScenarios: TestParams[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
  },
  // {
  //   indicatorMode: IndicatorMode.TWO_INDICATORS,
  //   areaMode: AreaMode.TWO_AREAS,
  // },
  // {
  //   indicatorMode: IndicatorMode.MULTIPLE_INDICATORS,
  //   areaMode: AreaMode.ENGLAND_AREA,
  // },
];

/**
 * This test currently tests three of the fifteen indicator + area
 * scenario combinations from https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
 * These three scenario combinations are defined above in testScenarios and were chosen as they are happy paths covering lots of chart components.
 * Note all 15 scenarios are covered in lower level unit testing.
 */
test.beforeAll(
  `return all indicatorIDs from the data source based on the searchTerm: ${searchTerm}`,
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
test.describe.parallel(`Search via search term ${searchTerm}`, () => {
  testScenarios.forEach(({ indicatorMode, areaMode }) => {
    test.beforeEach(
      `filter down the indicators based on indicator mode: ${indicatorMode}`,
      async () => {
        filteredIndicatorIds = returnIndicatorIDsByIndicatorMode(
          allIndicatorIDs,
          indicatorMode
        );
      }
    );
    test(`then select ${indicatorMode} and ${areaMode}, check the charts page`, async ({
      homePage,
      resultsPage,
      chartPage,
      axeBuilder,
    }) => {
      await test.step('Navigate to and verify search page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
        await expectNoAccessibilityViolations(axeBuilder);
      });

      await test.step('Search for indicators and check results', async () => {
        await homePage.typeIndicator(searchTerm);
        await homePage.clickSearchButton();

        await resultsPage.waitForURLToContain(searchTerm);
        await expectNoAccessibilityViolations(axeBuilder);
        await resultsPage.checkSearchResults(searchTerm);
      });

      await test.step(`Select ${indicatorMode} and ${areaMode} and view charts`, async () => {
        await resultsPage.selectIndicatorCheckboxes(filteredIndicatorIds);
        await resultsPage.selectAreasCheckboxes(areaMode);
        await resultsPage.waitForURLToContain(
          `${searchTerm}&${SearchParams.IndicatorsSelected}=${filteredIndicatorIds[0]}`
        );

        await resultsPage.clickViewChartsButton();
        await chartPage.waitForURLToContain(
          `${searchTerm}&${SearchParams.IndicatorsSelected}=${filteredIndicatorIds[0]}`
        );
        await expectNoAccessibilityViolations(axeBuilder);
        await chartPage.checkChartVisibility(indicatorMode, areaMode);
      });
    });
  });
});
