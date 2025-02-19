import { SearchParams } from '@/lib/searchStateManager';
import { test } from '../page-objects/pageFactory';
import {
  expectNoAccessibilityViolations,
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
} from '../testHelpers';
import indicatorData from '../../../../search-setup/assets/indicatorData.json';
import { IndicatorMode, AreaMode } from '../page-objects/pages/chartPage';

const searchTerm = 'mortality';
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];

test.beforeAll(
  `return all indicatorIDs from the data source based on the searchTerm: ${searchTerm}`,
  () => {
    const typedIndicatorData = indicatorData.map((indicator) => {
      return {
        ...indicator,
        lastUpdated: new Date(indicator.lastUpdated),
      };
    });

    allIndicatorIDs = getAllIndicatorIdsForSearchTerm(
      typedIndicatorData,
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
