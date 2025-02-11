import { SearchParams } from '@/lib/searchStateManager';
import { test } from '../page-objects/pageFactory';
import {
  expectNoAccessibilityViolations,
  getIndicatorIdsByName,
} from '../testHelpers';
import indicatorData from '../../../../search-setup/assets/indicatorData.json';

const searchTerm = 'mortality';
let indicatorIDs: string[];

test.describe('Search via indicator', () => {
  test.beforeAll(() => {
    const typedIndicatorData = indicatorData.map((indicator) => {
      return {
        ...indicator,
        lastUpdated: new Date(indicator.lastUpdated),
      };
    });

    indicatorIDs = getIndicatorIdsByName(typedIndicatorData, searchTerm);
  });

  test('full end to end flow with accessibility checks', async ({
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

    await test.step('Validate indicator search on results page', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkForIndicatorSearchError();

      await expectNoAccessibilityViolations(axeBuilder);

      await resultsPage.fillIndicatorSearch(searchTerm);
      await resultsPage.clickIndicatorSearchButtonAndWait(searchTerm);
      await resultsPage.checkSearchResults(searchTerm);
    });

    await test.step('Select indicators and view charts', async () => {
      await resultsPage.selectIndicatorCheckboxes(indicatorIDs);
      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}&${SearchParams.IndicatorsSelected}=${indicatorIDs[1]}`
      );

      await resultsPage.clickViewChartsButton();
      await chartPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}&${SearchParams.IndicatorsSelected}=${indicatorIDs[1]}`
      );
      await expectNoAccessibilityViolations(axeBuilder);
      await chartPage.checkChartAndChartTable();
    });

    await test.step('Return to results page and verify selections are preselected', async () => {
      await chartPage.clickBackLink();

      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}&${SearchParams.IndicatorsSelected}=${indicatorIDs[1]}`
      );
      await resultsPage.checkSearchResults(searchTerm);
      await resultsPage.checkIndicatorCheckboxChecked(indicatorIDs[0]);
      await resultsPage.checkIndicatorCheckboxChecked(indicatorIDs[1]);
    });

    await test.step('Return to search page and verify fields are correctly prepopulated', async () => {
      await resultsPage.clickBackLink();

      await homePage.waitForURLToContain(
        `${SearchParams.SearchedIndicator}=${searchTerm}`
      );
      await homePage.checkSearchFieldIsPrePopulatedWith(searchTerm);
    });

    await test.step('Verify search page validation prevents forward navigation', async () => {
      await homePage.clearSearchIndicatorField();
      await homePage.clickSearchButton();

      await homePage.waitForURLToContain(
        `${SearchParams.SearchedIndicator}=${searchTerm}`
      );
      await homePage.checkSearchFieldIsPrePopulatedWith();
      await homePage.checkSummaryValidation(
        `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
      );
    });
  });

  test('check available area types when no areas are selected when coming onto the results pages', async ({
    homePage,
    resultsPage,
  }) => {
    await test.step('Search for a test indicator', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
      await homePage.typeIndicator(searchTerm);
      await homePage.clickSearchButton();
      await resultsPage.waitForURLToContain(searchTerm);
    });

    await test.step('Check available area types', async () => {
      const expectedOptions = [
        "England", "NHS Regions", "Regions", "Combined Authorities", "NHS Integrated Care Boards", "Counties and Unitary Authorities", "NHS Sub Integrated Care Boards", "Districts and Unitary Authorities", "NHS Primary Care Networks", "GPs",
      ];
      const options = await resultsPage.areaFilterOptionsText();
      test.expect(options).toHaveLength(expectedOptions.length);
      test
        .expect(sortAlphabetically(options))
        .toEqual(sortAlphabetically(expectedOptions));
    });
  });

  const sortAlphabetically = (array: (string | null)[]) =>
    array.sort((a, b) => a!.localeCompare(b!));
});
