import { test } from '../../page-objects/pageFactory';
import {
  getAllIndicatorIdsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
  sortAlphabetically,
  getAllAreasByAreaType,
  IndicatorMode,
  SearchMode,
  AreaMode,
} from '../../testHelpers';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
import ChartPage from '@/playwright/page-objects/pages/chartPage';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

// tests in this file use mock service worker to mock the API response
// so that the tests can be run without the need for a backend
// see frontend/fingertips-frontend/assets/mockIndicatorData.json
// and frontend/fingertips-frontend/assets/mockAreaData.json
//@ts-expect-error don't care about type checking this json file
const indicatorData = mockIndicators as RawIndicatorDocument[];
const subjectSearchTerm = 'hospital';
const indicatorMode = IndicatorMode.ONE_INDICATOR;
const searchMode = SearchMode.ONLY_SUBJECT;
let allIndicatorIDs: string[];
let filteredIndicatorIds: string[];
let allNHSRegionAreas: AreaDocument[];
let typedIndicatorData: RawIndicatorDocument[];

test.beforeAll(
  `get indicatorIDs from the mock data source for searchTerm: ${subjectSearchTerm} and get mock area data`,
  () => {
    typedIndicatorData = indicatorData.map(
      (indicator: RawIndicatorDocument) => {
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

    allNHSRegionAreas = getAllAreasByAreaType(mockAreas, 'nhs-regions');
  }
);
test.describe(`Navigation, accessibility and validation tests`, () => {
  test('client validation testing and navigation behaviour', async ({
    homePage,
    resultsPage,
    chartPage,
    indicatorPage,
    axeBuilder,
  }) => {
    test.setTimeout(90000); // TODO - split this test up and remove this extension

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

    await test.step('Select single indicator and let default to England, and check on charts page', async () => {
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

    await test.step('Select "View background information" link, verify indicator page title and Return to charts page', async () => {
      const indicator = typedIndicatorData.find(
        (ind) => ind.indicatorID === filteredIndicatorIds[0]
      );

      if (!indicator) {
        throw new Error(
          `Indicator with ID ${filteredIndicatorIds[0]} not found`
        );
      }

      await resultsPage.clickViewBackgroundInformationLinkForIndicator(
        indicator
      );

      await indicatorPage.waitForURLToContain('indicator');

      await indicatorPage.checkIndicatorNameTitle(indicator);

      await indicatorPage.expectNoAccessibilityViolations(axeBuilder);

      await indicatorPage.clickBackLink();
    });

    await test.step('Select area filters on charts page', async () => {
      await chartPage.selectAreasFiltersIfRequired(
        searchMode,
        AreaMode.THREE_PLUS_AREAS, // change to 3 areas to see different view with barChartEmbeddedTable-component
        subjectSearchTerm,
        'gps'
      );

      await chartPage.checkSpecificChartComponent(
        ChartPage.barChartEmbeddedTableComponent
      );

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
      await homePage.closeAreaFilterPill(0);
      await homePage.closeAreaFilterPill(0);
      await homePage.closeAreaFilterPill(0);

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
      await resultsPage.navigateToResults(
        subjectSearchTerm,
        [
          allNHSRegionAreas[0].areaCode,
          allNHSRegionAreas[1].areaCode,
          allNHSRegionAreas[2].areaCode,
        ],
        'nhs-regions'
      );
    });

    await test.step('Check selected area pills matches those specified in url', async () => {
      const expectedPillTexts = [
        `${allNHSRegionAreas[0].areaName} ${allNHSRegionAreas[0].areaType}`,
        `${allNHSRegionAreas[1].areaName} ${allNHSRegionAreas[1].areaType}`,
        `${allNHSRegionAreas[2].areaName} ${allNHSRegionAreas[2].areaType}`,
      ];

      await test
        .expect(resultsPage.areaFilterPills())
        .toHaveCount(expectedPillTexts.length);

      const filterPillNames = await resultsPage.areaFilterPillsText();

      sortAlphabetically(filterPillNames);
      sortAlphabetically(expectedPillTexts);
      test.expect(filterPillNames).toEqual(expectedPillTexts);

      await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();
    });

    await test.step('Click remove one area pill and re-check area pills', async () => {
      await resultsPage.closeAreaFilterPill(1);

      const expectedPillTexts = [
        `${allNHSRegionAreas[0].areaName} ${allNHSRegionAreas[0].areaType}`,
        `${allNHSRegionAreas[2].areaName} ${allNHSRegionAreas[2].areaType}`,
      ];
      await test
        .expect(resultsPage.areaFilterPills())
        .toHaveCount(expectedPillTexts.length);

      const filterPillNames = await resultsPage.areaFilterPillsText();

      sortAlphabetically(filterPillNames);
      sortAlphabetically(expectedPillTexts);
      test.expect(filterPillNames).toEqual(expectedPillTexts);

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
      await resultsPage.navigateToResults(
        subjectSearchTerm,
        [
          allNHSRegionAreas[0].areaCode,
          allNHSRegionAreas[1].areaCode,
          allNHSRegionAreas[2].areaCode,
        ],
        'nhs-regions'
      );
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

  test('check "select all" checkbox updates selected indicators and URL', async ({
    resultsPage,
  }) => {
    await test.step('Navigate directly to the results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);
    });

    await test.step('Tick "Select all" checkbox and verify all indicators are selected and URL is updated', async () => {
      await resultsPage.selectIndicatorSelectAllCheckbox();
      await resultsPage.verifyAllIndicatorsSelected();
      await resultsPage.verifyUrlContainsAllIndicators(allIndicatorIDs);
    });

    await test.step('Untick "Select all" checkbox and verify no indicators are selected and URL is updated', async () => {
      await resultsPage.deselectIndicatorSelectAllCheckbox();
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

  test('check area filtering on results page', async ({ resultsPage }) => {
    await test.step('first filter by GPs', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);

      const gpAreaType = 'gps';
      const groupType = 'nhs-primary-care-networks';
      const group = 'East Basildon PCN';
      const area = 'aryan medical centre';
      const areaCode = 'F81640';

      await resultsPage.selectAreaType(gpAreaType);

      await resultsPage.selectGroupType(groupType);

      await resultsPage.selectGroup(group);

      await resultsPage.selectArea(area, areaCode);

      await resultsPage.assertFiltersDisabled();

      // change group and pick another area
      await resultsPage.closeAreaFilterPill(0);

      const newGroup = 'North 2 Islington PCN';
      const newArea = 'Archway Medical Centre';
      const newAreaCode = 'F83004';

      await resultsPage.selectGroup(newGroup);

      await resultsPage.selectArea(newArea, newAreaCode);

      await resultsPage.assertFiltersDisabled();
    });

    await test.step('then deselect gps and change to filter by England (default)', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const englandAreaType = 'England';

      await resultsPage.selectAreaType(englandAreaType);

      await resultsPage.assertGroupTypeFilterContainsOnly(englandAreaType);
      await resultsPage.assertGroupFilterContainsOnly(englandAreaType);

      await resultsPage.selectArea(englandAreaType, areaCodeForEngland);

      await resultsPage.assertFiltersDisabled();
    });

    await test.step('then deselect England and begin filtering by NHS Regions', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const nhsRegionAreaType = 'nhs-regions';
      const northWestNhsRegion = 'North West NHS Region';
      const northWestNhsRegionCode = 'E40000010';

      await resultsPage.selectAreaType(nhsRegionAreaType);

      await resultsPage.assertGroupTypeFilterContainsOnly('England');
      await resultsPage.assertGroupFilterContainsOnly('England');

      await resultsPage.selectArea(northWestNhsRegion, northWestNhsRegionCode);

      await resultsPage.assertFiltersDisabled();
    });

    await test.step('then deselect north west region and begin filtering by counties and unitary authorities', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const countiesAndUnitaryAuthoritiesAreaType =
        'counties-and-unitary-authorities';
      const groupType = 'combined-authorities';
      const area = 'County Durham';
      const areaCode = 'E06000047';

      await resultsPage.selectAreaType(countiesAndUnitaryAuthoritiesAreaType);

      await resultsPage.assertGroupTypeFilterContainsOnly(
        'England,Combined Authorities,Regions'
      );
      await resultsPage.assertGroupFilterContainsOnly('England');

      await resultsPage.selectGroupType(groupType);

      await resultsPage.assertGroupFilterContainsOnly('');

      await resultsPage.selectArea(area, areaCode);

      await resultsPage.assertFiltersDisabled();
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
