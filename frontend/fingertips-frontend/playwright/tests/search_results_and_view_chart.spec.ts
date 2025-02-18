import { SearchParams } from '@/lib/searchStateManager';
import { test } from '../page-objects/pageFactory';
import {
  expectNoAccessibilityViolations,
  getIndicatorIdsByName,
} from '../testHelpers';
import indicators from '../../../../search-setup/assets/indicators.json';
import { IndicatorMode, AreaMode } from '../page-objects/pages/chartPage';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const searchTerm = 'mortality';
const indicatorsToSelect = ["108", "113"];
let indicatorIDs: string[];

test.describe('Search via indicator', () => {
  test.beforeAll(() => {
    const indicatorData = indicators as IndicatorDocument[];
    const typedIndicatorData = indicatorData.map((indicator) => {
      return {
        ...indicator,
        lastUpdatedDate: new Date(indicator.lastUpdatedDate),
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

    await test.step('Select two indicators and view charts', async () => {
      await resultsPage.selectIndicatorCheckboxes(indicatorsToSelect);
      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[1]}`
      );

      await resultsPage.clickViewChartsButton();
      await chartPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[1]}`
      );
      await expectNoAccessibilityViolations(axeBuilder);
      await chartPage.checkChartVisibility(
        IndicatorMode.TWO_INDICATORS,
        AreaMode.ENGLAND_AREA // defaults to this if no selection made
      );
    });

    await test.step('Return to results page and verify selections are preselected', async () => {
      await chartPage.clickBackLink();

      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[1]}`
      );
      await resultsPage.checkSearchResults(searchTerm);
      await resultsPage.checkIndicatorCheckboxChecked(indicatorsToSelect[0]);
      await resultsPage.checkIndicatorCheckboxChecked(indicatorsToSelect[1]);
    });

    await test.step('Return to search page and verify fields are correctly prepopulated', async () => {
      await resultsPage.clickBackLink();

      await homePage.waitForURLToContain(
        `${SearchParams.SearchedIndicator}=${searchTerm}`
      );
      await homePage.checkSearchFieldIsPrePopulatedWith(searchTerm);
    });

    await test.step('Select single indicator and view charts', async () => {
      await homePage.clearSearchIndicatorField();
      await homePage.typeIndicator(searchTerm);
      await homePage.clickSearchButton();

      await resultsPage.waitForURLToContain(
        `${SearchParams.SearchedIndicator}=${searchTerm}`
      );

      await resultsPage.selectIndicatorCheckboxes([indicatorsToSelect[0]]);
      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}`
      );

      await resultsPage.clickViewChartsButton();
      await chartPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}`
      );
      await expectNoAccessibilityViolations(axeBuilder);
      await chartPage.checkChartVisibility(
        IndicatorMode.ONE_INDICATOR,
        AreaMode.ENGLAND_AREA // defaults to this if no selection made
      );

      await chartPage.clickBackLink();
      await resultsPage.waitForURLToContain(
        `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorsToSelect[0]}`
      );

      await resultsPage.clickBackLink();

      await homePage.checkOnHomePage();
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
        'England',
        'NHS Regions',
        'Regions',
        'Combined Authorities',
        'NHS Integrated Care Boards',
        'Counties and Unitary Authorities',
        'NHS Sub Integrated Care Boards',
        'Districts and Unitary Authorities',
        'NHS Primary Care Networks',
        'GPs',
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
