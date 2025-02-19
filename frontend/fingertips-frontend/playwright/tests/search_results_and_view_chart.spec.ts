import { SearchParams } from '@/lib/searchStateManager';
import { test } from '../page-objects/pageFactory';
import {
  expectNoAccessibilityViolations,
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
} from '../testHelpers';
import { IndicatorMode, AreaMode } from '../page-objects/pages/chartPage';

const pathToIndicatorsCSV = '../../../../search-setup/assets/indicators.csv';
const searchTerm = 'mortality';
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];

test.beforeAll(
  `return all indicatorIDs from the data source based on the searchTerm: ${searchTerm}`,
  () => {
    // const indicatorData = indicators as IndicatorDocument[];
    // const typedIndicatorData = indicatorData.map((indicator) => {
    //   return {
    //     ...indicator,
    //     lastUpdatedDate: new Date(indicator.lastUpdatedDate),
    //   };
    // });

    allIndicatorIDs = getAllIndicatorIdsForSearchTerm(
      pathToIndicatorsCSV,
      searchTerm
    );
  }
);

interface TestParams {
  indicatorMode: IndicatorMode;
  areaMode: AreaMode;
}

const testCases: TestParams[] = [
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

test.describe.parallel(`Search via search term ${searchTerm}`, () => {
  testCases.forEach(({ indicatorMode, areaMode }) => {
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
        await resultsPage.selectAreasCheckboxes();
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
