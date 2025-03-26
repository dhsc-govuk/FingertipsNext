import { test } from '../../page-objects/pageFactory';
import {
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
  sortAlphabetically,
  getAllNHSRegionAreas,
  IndicatorMode,
  SearchMode,
} from '../../testHelpers';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { AreaDocument, IndicatorDocument } from '@/lib/search/searchTypes';

// tests in this file use mock service worker to mock the API response
// so that the tests can be run without the need for a backend
// see frontend/fingertips-frontend/assets/mockIndicatorData.json
// and frontend/fingertips-frontend/assets/mockAreaData.json
//@ts-expect-error don't care about type checking this json file
const indicatorData = mockIndicators as IndicatorDocument[];
const subjectSearchTerm = 'hospital';
const indicatorMode = IndicatorMode.ONE_INDICATOR;
const searchMode = SearchMode.ONLY_SUBJECT;
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];
let allNHSRegionAreas: AreaDocument[];

test.beforeAll(
  `get indicatorIDs from the mock data source for searchTerm: ${subjectSearchTerm} and get mock area data`,
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
      subjectSearchTerm
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
    await test.step('Navigate to search page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
      await chartPage.expectNoAccessibilityViolations(axeBuilder);
    });

    await test.step(`Search for indicators using search term ${subjectSearchTerm} and check results title contains the search term`, async () => {
      await homePage.searchForIndicators(searchMode, subjectSearchTerm);
      await homePage.clickSearchButton();

      await resultsPage.waitForURLToContain(subjectSearchTerm);
      await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
      await chartPage.expectNoAccessibilityViolations(axeBuilder);
    });

    await test.step('Validate indicator search validation on results page', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkForIndicatorSearchError();
      await chartPage.expectNoAccessibilityViolations(axeBuilder);

      await resultsPage.fillIndicatorSearch(subjectSearchTerm);
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
    });

    await test.step('Select single indicator, let area default to England and check on charts page', async () => {
      await resultsPage.selectIndicatorCheckboxes(
        filteredIndicatorIds,
        indicatorMode
      );

      await resultsPage.clickViewChartsButton();

      await chartPage.waitForURLToContain('chart');

      await chartPage.expectNoAccessibilityViolations(axeBuilder, [
        'color-contrast',
      ]);
    });

    await test.step('Return to results page and verify selections are preselected', async () => {
      await chartPage.clickBackLink();

      await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
      await resultsPage.checkIndicatorCheckboxChecked(filteredIndicatorIds[0]);
    });

    await test.step('Return to search page and verify fields are correctly prepopulated', async () => {
      await resultsPage.clickBackLink();

      await homePage.checkSearchFieldIsPrePopulatedWith(subjectSearchTerm);
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
      await resultsPage.navigateToResults(subjectSearchTerm, [
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

  test('check indicators are removed from url when search changes', async ({
    resultsPage,
  }) => {
    await test.step('Navigate directly to the results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, [
        allNHSRegionAreas[0].areaCode,
        allNHSRegionAreas[1].areaCode,
        allNHSRegionAreas[2].areaCode,
      ]);
    });

    await test.step('Select single indicator, and verify url is updated to include indicator', async () => {
      await resultsPage.selectIndicatorCheckboxes(
        filteredIndicatorIds,
        indicatorMode
      );

      await test.expect(resultsPage.page).toHaveURL(/&is=/);
    });

    await test.step('Clear search bar and search, verify url is updated to remove indicator', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await test.expect(resultsPage.page).not.toHaveURL(/&is=/);
    });
  });
});

test('check "select all" checkbox updates selected indicators and URL', async ({
  resultsPage,
}) => {
  await test.step('Navigate directly to the results page', async () => {
    await resultsPage.navigateToResults(subjectSearchTerm, []);
  });

  await test.step('Tick "Select all" checkbox and verify all indicators are selected and URL is updated', async () => {
    await resultsPage.selectSelectAllCheckbox();
    await resultsPage.verifyAllIndicatorsSelected();
    await resultsPage.verifyUrlContainsAllIndicators(allIndicatorIDs);
  });

  await test.step('Untick "Select all" checkbox and verify no indicators are selected and URL is updated', async () => {
    await resultsPage.deselectSelectAllCheckbox();
    await resultsPage.verifyNoIndicatorsSelected();
    await resultsPage.verifyUrlExcludesAllIndicators();
  });

  await test.step('Select indicators one by one and verify "Select all" checkbox becomes ticked and URL updates', async () => {
    await resultsPage.selectEveryIndicator(allIndicatorIDs);
    await resultsPage.verifySelectAllCheckboxTicked();
    await resultsPage.verifyUrlContainsAllIndicators(allIndicatorIDs);
  });

  await test.step('Deselect one indicator and verify "Select all" checkbox becomes unticked and URL updates', async () => {
    await resultsPage.deselectIndicator(allIndicatorIDs[0]);
    await resultsPage.verifySelectAllCheckboxUnticked();
    await resultsPage.verifyUrlUpdatedAfterDeselection(allIndicatorIDs[0]);
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
