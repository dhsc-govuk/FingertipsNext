import { test } from '../../page-objects/pageFactory';
import {
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
  sortAlphabetically,
  getAllNHSRegionAreas,
  IndicatorMode,
} from '../../testHelpers';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { AreaDocument, IndicatorDocument } from '@/lib/search/searchTypes';

// tests in this file use mock service worker to mock the API response
// so that the tests can be run without the need for a backend
// see frontend/fingertips-frontend/assets/mockIndicatorData.json
// and frontend/fingertips-frontend/assets/mockAreaData.json

const indicatorData = mockIndicators as IndicatorDocument[];
const searchTerm = 'hospital';
const indicatorMode = IndicatorMode.ONE_INDICATOR;
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];
let allNHSRegionAreas: AreaDocument[];

test.beforeAll(
  `get indicatorIDs from the mock data source for searchTerm: ${searchTerm} and get mock area data`,
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

    filteredIndicatorIds = returnIndicatorIDsByIndicatorMode(
      allIndicatorIDs,
      indicatorMode
    );

    allNHSRegionAreas = getAllNHSRegionAreas(mockAreas);
  }
);
test.describe(`Navigation, accessibility and validation tests`, () => {
  test('client validation testing and navigation behaviour', async ({
    homePage,
    resultsPage,
    chartPage,
    axeBuilder,
  }) => {
    await test.step('Search page validation', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
      await homePage.clickSearchButton();
      await homePage.checkSummaryValidation(
        `There is a problemEnter a subject you want to search forEnter an area you want to search for`
      );
      await chartPage.expectNoAccessibilityViolations(axeBuilder);
    });

    await test.step(`Search for indicators using search term ${searchTerm} and check results title contains the search term`, async () => {
      await homePage.typeIndicator(searchTerm);
      await homePage.clickSearchButton();

      await resultsPage.waitForURLToContain(searchTerm);
      await resultsPage.checkSearchResultsTitle(searchTerm);
      await chartPage.expectNoAccessibilityViolations(axeBuilder);
    });

    await test.step('Validate indicator search validation on results page', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkForIndicatorSearchError();
      await chartPage.expectNoAccessibilityViolations(axeBuilder);

      await resultsPage.fillIndicatorSearch(searchTerm);
      await resultsPage.clickIndicatorSearchButtonAndWait(searchTerm);
      await resultsPage.checkSearchResultsTitle(searchTerm);
    });

    await test.step('Select single indicator, let area default to England and check on charts page', async () => {
      await resultsPage.selectIndicatorCheckboxesAndCheckURL(
        filteredIndicatorIds,
        indicatorMode
      );

      await resultsPage.clickViewChartsButton();

      await chartPage.waitForURLToContain('chart');
      await chartPage.expectNoAccessibilityViolations(axeBuilder);
    });

    await test.step('Return to results page and verify selections are preselected', async () => {
      await chartPage.clickBackLink();

      await resultsPage.checkSearchResultsTitle(searchTerm);
      await resultsPage.checkIndicatorCheckboxChecked(filteredIndicatorIds[0]);
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
        `There is a problemEnter a subject you want to search forEnter an area you want to search for`
      );
    });
  });

  test('check area type pills on results page when areas specified in url', async ({
    resultsPage,
  }) => {
    await test.step('Navigate directly to the results page', async () => {
      await resultsPage.navigateToResults(searchTerm, [
        allNHSRegionAreas[0].areaCode,
        allNHSRegionAreas[1].areaCode,
        allNHSRegionAreas[2].areaCode,
      ]);
    });

    await test.step('Check selected area pills matches those specified in url', async () => {
      const expectedPillTexts = [
        allNHSRegionAreas[0].areaName,
        allNHSRegionAreas[1].areaName,
        allNHSRegionAreas[2].areaName,
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
        allNHSRegionAreas[0].areaName,
        allNHSRegionAreas[2].areaName,
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
      await resultsPage.waitForURLToContain(allNHSRegionAreas[0].areaCode);
      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[1].areaCode);
      await resultsPage.waitForURLToContain(allNHSRegionAreas[2].areaCode);
    });

    await test.step('Remove all pills and check url and area type combobox', async () => {
      await resultsPage.closeAreaFilterPill(1);
      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[2].areaCode);

      await resultsPage.closeAreaFilterPill(0);
      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[0].areaCode);
      await test.expect(resultsPage.page).not.toHaveURL(/&as=/);

      await test.expect(resultsPage.areaFilterCombobox()).toBeEnabled();
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
