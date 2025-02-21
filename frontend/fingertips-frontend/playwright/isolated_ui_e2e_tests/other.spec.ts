import { test } from '../page-objects/pageFactory';
import { AreaMode, IndicatorMode } from '../page-objects/pages/chartPage';
import { sortAlphabetically } from '../testHelpers';

// tests in this file use mock service worker to mock the API response
// so that the tests can be run without the need for a backend
// see frontend/fingertips-frontend/assets/mockIndicatorData.json

const searchTerm = 'mortality';
const allIndicatorIDs = ['40701'];
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

test('client validation testing and navigate back behaviour', async ({
  homePage,
  resultsPage,
  chartPage,
}) => {
  const indicatorMode = IndicatorMode.ONE_INDICATOR;

  await test.step('Search page validation', async () => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.clickSearchButton();
    await homePage.checkSummaryValidation(
      `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
    );
  });

  await test.step(`Search for indicators using search term ${searchTerm} and check results title contains the search term`, async () => {
    await homePage.typeIndicator(searchTerm);
    await homePage.clickSearchButton();

    await resultsPage.waitForURLToContain(searchTerm);
    await resultsPage.checkSearchResultsTitle(searchTerm);
  });

  await test.step('Validate indicator search validation on results page', async () => {
    await resultsPage.clearIndicatorSearchBox();
    await resultsPage.clickIndicatorSearchButton();
    await resultsPage.checkForIndicatorSearchError();

    await resultsPage.fillIndicatorSearch(searchTerm);
    await resultsPage.clickIndicatorSearchButtonAndWait(searchTerm);
    await resultsPage.checkSearchResultsTitle(searchTerm);
  });

  await test.step('Select single indicator, let area default to England and view charts', async () => {
    await resultsPage.selectIndicatorCheckboxesAndCheckURL(
      allIndicatorIDs,
      indicatorMode,
      searchTerm
    );

    await resultsPage.clickViewChartsButton();

    await chartPage.checkChartVisibility(
      IndicatorMode.ONE_INDICATOR,
      AreaMode.ENGLAND_AREA
    );
  });

  await test.step('Return to results page and verify selections are preselected', async () => {
    await chartPage.clickBackLink();

    await resultsPage.checkSearchResultsTitle(searchTerm);
    await resultsPage.checkIndicatorCheckboxChecked(allIndicatorIDs[0]);
  });

  await test.step('Return to search page and verify fields are correctly prepopulated', async () => {
    await resultsPage.clickBackLink();

    await homePage.checkSearchFieldIsPrePopulatedWith(searchTerm);
  });

  await test.step('Verify after clearing search field that search page validation prevents forward navigation', async () => {
    await homePage.clearSearchIndicatorField();
    await homePage.clickSearchButton();

    await homePage.checkSearchFieldIsPrePopulatedWith(); // nothing should be prepopulated after clearing search field
    await homePage.checkSummaryValidation(
      `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
    );
  });
});
test('check area type pills on results page when areas specified in url', async ({
  resultsPage,
}) => {
  await test.step('Search for a test indicator', async () => {
    await resultsPage.navigateToResults('smoking', [
      'E40000012',
      'E40000011',
      'E40000010',
    ]);
  });

  await test.step('Check selected area pills matches those specified in url', async () => {
    const expectedPillTexts = [
      'North East and Yorkshire NHS Region',
      'Midlands NHS Region',
      'North West NHS Region',
    ];
    await test
      .expect(resultsPage.areaFilterPills())
      .toHaveCount(expectedPillTexts.length);

    const filterPillNames = await resultsPage.areaFilterPillsText();
    test
      .expect(sortAlphabetically(filterPillNames))
      .toEqual(sortAlphabetically(expectedPillTexts));

    await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();
  });

  await test.step('Click remove one area pill and re-check area pills', async () => {
    await resultsPage.closeAreaFilterPill(1);

    const expectedPillTexts = [
      'North East and Yorkshire NHS Region',
      'North West NHS Region',
    ];
    await test
      .expect(resultsPage.areaFilterPills())
      .toHaveCount(expectedPillTexts.length);

    const filterPillNames = await resultsPage.areaFilterPillsText();
    test
      .expect(sortAlphabetically(filterPillNames))
      .toEqual(sortAlphabetically(expectedPillTexts));

    await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();
  });

  await test.step('Check url has been updated after area pill removal', async () => {
    await test.expect(resultsPage.page).toHaveURL(/&as=E40000012/);
    await test.expect(resultsPage.page).not.toHaveURL(/&as=E40000011/);
    await test.expect(resultsPage.page).toHaveURL(/&as=E40000010/);
  });

  await test.step('Remove all pills and check url and area type combobox', async () => {
    await resultsPage.closeAreaFilterPill(0);
    await test.expect(resultsPage.page).not.toHaveURL(/&as=E40000012/);

    await resultsPage.closeAreaFilterPill(0);
    await test.expect(resultsPage.page).not.toHaveURL(/&as=/);

    await test.expect(resultsPage.areaFilterCombobox()).toBeEnabled();
  });
});
