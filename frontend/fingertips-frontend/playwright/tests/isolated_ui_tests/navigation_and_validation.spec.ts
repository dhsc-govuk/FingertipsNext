import { test } from '../../page-objects/pageFactory';
import {
  getAllIndicatorIDsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
  sortAlphabetically,
  getAllAreasByAreaType,
  IndicatorMode,
  SearchMode,
  AreaMode,
  IndicatorInfo,
} from '../../testHelpers';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { AreaDocument, RawIndicatorDocument } from '@/lib/search/searchTypes';
import ChartPage from '@/playwright/page-objects/pages/chartPage';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

/**
 * Note that this test suite uses mock service worker to mock API responses, therefore these are isolated from the backend UI tests
 * See:
 * - frontend/fingertips-frontend/assets/mockIndicatorData.json
 * - frontend/fingertips-frontend/assets/mockAreaData.json
 */

// Test data setup
// @ts-expect-error mock data type casting
const indicatorData = mockIndicators as RawIndicatorDocument[];
const subjectSearchTerm = 'hospital';
const secondSubjectSearchTerm = 'diabetes';
const indicatorMode = IndicatorMode.ONE_INDICATOR;
const searchMode = SearchMode.ONLY_SUBJECT;
let allValidIndicatorIDs: string[];
let validIndicatorIDs: IndicatorInfo[];
let allNHSRegionAreas: AreaDocument[];
let typedIndicatorData: RawIndicatorDocument[];

test.beforeAll('Initialize test data from mock sources', () => {
  typedIndicatorData = indicatorData.map((indicator: RawIndicatorDocument) => ({
    ...indicator,
    lastUpdated: new Date(indicator.lastUpdatedDate),
  }));

  // Get all valid indicators based on subjectSearchTerm search term
  allValidIndicatorIDs = getAllIndicatorIDsForSearchTerm(
    typedIndicatorData,
    subjectSearchTerm
  );

  // Filter down valid indicators based on mode
  validIndicatorIDs = returnIndicatorIDsByIndicatorMode(
    allValidIndicatorIDs,
    indicatorMode
  );

  // Get all NHS region areas
  allNHSRegionAreas = getAllAreasByAreaType(mockAreas, 'nhs-regions');
});

test.describe('Search Page Tests', () => {
  test('should navigate to search page and validate accessibility', async ({
    homePage,
    axeBuilder,
  }) => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('should validate search field form validations', async ({
    homePage,
  }) => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.clearSearchIndicatorField();

    // Try to search with empty field
    await homePage.clickSearchButton();

    // Verify validation messages
    await homePage.checkSummaryValidation(
      `There is a problemEnter a subject you want to search forEnter an area you want to search for`
    );
  });
});

test.describe('Results Page Tests', () => {
  test('should search for indicators and display results', async ({
    homePage,
    resultsPage,
    axeBuilder,
  }) => {
    // Navigate to home page
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();

    // Search by subject for indicators
    await homePage.searchForIndicators(searchMode, subjectSearchTerm);
    await homePage.clickSearchButton();

    // Verify results page
    await resultsPage.waitForURLToContain(subjectSearchTerm);
    await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
    await resultsPage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('should validate indicator search on results page', async ({
    resultsPage,
    axeBuilder,
  }) => {
    // Navigate directly to results page
    await resultsPage.navigateToResults(subjectSearchTerm, []);

    // Clear search and verify validation
    await resultsPage.clearIndicatorSearchBox();
    await resultsPage.clickIndicatorSearchButton();
    await resultsPage.checkForIndicatorSearchError();
    await resultsPage.expectNoAccessibilityViolations(axeBuilder);

    // Enter a different valid search and verify results page
    await resultsPage.fillIndicatorSearch(secondSubjectSearchTerm);
    await resultsPage.clickIndicatorSearchButton();
    await resultsPage.checkSearchResultsTitle(secondSubjectSearchTerm);
  });

  test('should handle "select all" indicators functionality correctly', async ({
    resultsPage,
  }) => {
    // Navigate directly to results page
    await resultsPage.navigateToResults(subjectSearchTerm, []);
    await resultsPage.checkSearchResultsTitleBasedOnSearchMode(
      searchMode,
      subjectSearchTerm
    );

    // Verify select all checkbox
    await resultsPage.selectIndicatorSelectAllCheckbox();
    await resultsPage.verifyAllIndicatorsSelected();
    await resultsPage.verifyUrlContainsAllIndicators(allValidIndicatorIDs);

    // Verify deselect all checkbox
    await resultsPage.deselectIndicatorSelectAllCheckbox();
    await resultsPage.verifyNoIndicatorsSelected();
    await resultsPage.verifyUrlExcludesAllIndicators();

    // Verify individual selections to select all
    await resultsPage.selectEveryIndicator(allValidIndicatorIDs);
    await resultsPage.verifySelectAllCheckboxTicked();
    await resultsPage.verifyUrlContainsAllIndicators(allValidIndicatorIDs);

    // Verify deselecting one indicator
    await resultsPage.deselectIndicator(allValidIndicatorIDs[0]);
    await resultsPage.verifySelectAllCheckboxUnticked();
    await resultsPage.verifyUrlUpdatedAfterDeselection(allValidIndicatorIDs[0]);
  });

  test('should clear indicators from URL when search changes', async ({
    resultsPage,
  }) => {
    // Navigate to results page with areas
    await resultsPage.navigateToResults(
      subjectSearchTerm,
      [
        allNHSRegionAreas[0].areaCode,
        allNHSRegionAreas[1].areaCode,
        allNHSRegionAreas[2].areaCode,
      ],
      'nhs-regions'
    );

    // Select indicator and verify URL update
    await resultsPage.selectIndicatorCheckboxes(validIndicatorIDs);
    await test.expect(resultsPage.page).toHaveURL(/&is=/);

    // Clear search and verify indicators removed from URL
    await resultsPage.clearIndicatorSearchBox();
    await resultsPage.clickIndicatorSearchButton();
    await test.expect(resultsPage.page).not.toHaveURL(/&is=/);
  });
});

test.describe('Area Filter Tests', () => {
  test('should manage area pills on results page', async ({ resultsPage }) => {
    // Navigate directly to results with preselected areas
    await resultsPage.navigateToResults(
      subjectSearchTerm,
      [
        allNHSRegionAreas[0].areaCode,
        allNHSRegionAreas[1].areaCode,
        allNHSRegionAreas[2].areaCode,
      ],
      'nhs-regions'
    );

    await resultsPage.checkSearchResultsTitleBasedOnSearchMode(
      searchMode,
      subjectSearchTerm
    );

    // Verify area pills display correctly
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

    // Verify area filter combobox is disabled when areas are selected
    await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();

    // Remove one pill and verify remaining pills
    await resultsPage.closeAreaFilterPill(1);

    const expectedRemainingPills = [
      `${allNHSRegionAreas[0].areaName} ${allNHSRegionAreas[0].areaType}`,
      `${allNHSRegionAreas[2].areaName} ${allNHSRegionAreas[2].areaType}`,
    ];

    await test
      .expect(resultsPage.areaFilterPills())
      .toHaveCount(expectedRemainingPills.length);

    const remainingPillNames = await resultsPage.areaFilterPillsText();
    sortAlphabetically(remainingPillNames);
    sortAlphabetically(expectedRemainingPills);
    test.expect(remainingPillNames).toEqual(expectedRemainingPills);

    // Verify URL updated after removing area pill
    await resultsPage.waitForURLToContain(allNHSRegionAreas[0].areaCode);
    await test
      .expect(resultsPage.page)
      .not.toHaveURL(allNHSRegionAreas[1].areaCode);
    await resultsPage.waitForURLToContain(allNHSRegionAreas[2].areaCode);

    // Remove all pills and verify filter state
    await resultsPage.closeAreaFilterPill(1);
    await test
      .expect(resultsPage.page)
      .not.toHaveURL(allNHSRegionAreas[2].areaCode);

    await resultsPage.closeAreaFilterPill(0);
    await test
      .expect(resultsPage.page)
      .not.toHaveURL(allNHSRegionAreas[0].areaCode);
    await test.expect(resultsPage.page).not.toHaveURL(/&as=/);

    // Verify area filter combobox is enabled when no areas are selected
    await test.expect(resultsPage.areaFilterCombobox()).toBeEnabled();
  });

  test('should support filtering results by different area types', async ({
    resultsPage,
  }) => {
    await resultsPage.navigateToResults(subjectSearchTerm, []);

    // Test filtering by GP area type
    await test.step('filter by GP area', async () => {
      const gpAreaType = 'gps';
      const groupType = 'nhs-primary-care-networks';
      const group = 'East Basildon PCN';
      const area = 'aryan medical centre';
      const areaCode = 'F81640';

      await resultsPage.selectAreaTypeAndAssertURLUpdated(gpAreaType);
      await resultsPage.selectGroupTypeAndAssertURLUpdated(groupType);
      await resultsPage.selectGroupAndAssertURLUpdated(group);
      await resultsPage.selectAreaAndAssertURLUpdated(area, areaCode);
      await resultsPage.assertFiltersDisabled();
    });

    // Test changing to different GP area
    await test.step('change to different GP area', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const newGroup = 'North 2 Islington PCN';
      const newArea = 'Archway Medical Centre';
      const newAreaCode = 'F83004';

      await resultsPage.selectGroupAndAssertURLUpdated(newGroup);
      await resultsPage.selectAreaAndAssertURLUpdated(newArea, newAreaCode);
      await resultsPage.assertFiltersDisabled();
    });

    // Test filtering by England
    await test.step('filter by England', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const englandAreaType = 'England';

      await resultsPage.selectAreaTypeAndAssertURLUpdated(englandAreaType);
      await resultsPage.assertGroupTypeFilterContainsOnly(englandAreaType);
      await resultsPage.assertGroupFilterContainsOnly(englandAreaType);
      await resultsPage.selectAreaAndAssertURLUpdated(
        englandAreaType,
        areaCodeForEngland
      );
      await resultsPage.assertFiltersDisabled();
    });

    // Test filtering by NHS regions
    await test.step('filter by NHS regions', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const nhsRegionAreaType = 'nhs-regions';
      const northWestNhsRegion = 'North West NHS Region';
      const northWestNhsRegionCode = 'E40000010';

      await resultsPage.selectAreaTypeAndAssertURLUpdated(nhsRegionAreaType);
      await resultsPage.assertGroupTypeFilterContainsOnly('England');
      await resultsPage.assertGroupFilterContainsOnly('England');
      await resultsPage.selectAreaAndAssertURLUpdated(
        northWestNhsRegion,
        northWestNhsRegionCode
      );
      await resultsPage.assertFiltersDisabled();
    });

    // Test filtering by counties and unitary authorities
    await test.step('filter by counties and unitary authorities', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const countiesAndUnitaryAuthoritiesAreaType =
        'counties-and-unitary-authorities';
      const groupType = 'combined-authorities';
      const area = 'County Durham';
      const areaCode = 'E06000047';

      await resultsPage.selectAreaTypeAndAssertURLUpdated(
        countiesAndUnitaryAuthoritiesAreaType
      );
      await resultsPage.assertGroupTypeFilterContainsOnly(
        'England,Combined Authorities,Regions'
      );
      await resultsPage.assertGroupFilterContainsOnly('England');
      await resultsPage.selectGroupTypeAndAssertURLUpdated(groupType);
      await resultsPage.assertGroupFilterContainsOnly('');
      await resultsPage.selectAreaAndAssertURLUpdated(area, areaCode);
      await resultsPage.assertFiltersDisabled();
    });
  });
});

test.describe('Navigation Tests', () => {
  test('should handle navigation flow between pages', async ({
    homePage,
    resultsPage,
    chartPage,
    indicatorPage,
    axeBuilder,
  }) => {
    // Navigate to home page and search
    await homePage.navigateToHomePage();
    await homePage.searchForIndicators(searchMode, subjectSearchTerm);
    await homePage.clickSearchButton();

    // Select indicator and view charts
    await resultsPage.selectIndicatorCheckboxes(validIndicatorIDs);
    await resultsPage.clickViewChartsButton();
    await chartPage.waitForURLToContain('chart');

    // Check accessibility (with color-contrast exception for charts)
    await chartPage.expectNoAccessibilityViolations(axeBuilder, [
      'color-contrast',
    ]);

    // Navigate to indicator information page and back
    const indicator = typedIndicatorData.find(
      (ind) => ind.indicatorID === validIndicatorIDs[0].indicatorID
    );

    if (!indicator) {
      throw new Error(`Indicator with ID ${validIndicatorIDs[0]} not found`);
    }

    await resultsPage.clickViewBackgroundInformationLinkForIndicator(indicator);
    await indicatorPage.waitForURLToContain('indicator');
    await indicatorPage.checkIndicatorNameTitle(indicator);
    await indicatorPage.expectNoAccessibilityViolations(axeBuilder);
    await indicatorPage.clickBackLink();

    // Apply area filters on chart page
    await chartPage.selectAreasFiltersIfRequired(
      searchMode,
      AreaMode.THREE_PLUS_AREAS,
      subjectSearchTerm,
      'gps'
    );

    // Verify chart component and accessibility (with color-contrast exception for charts)
    await chartPage.checkSpecificChartComponent(
      ChartPage.barChartEmbeddedTableComponent
    );
    await chartPage.expectNoAccessibilityViolations(axeBuilder, [
      'color-contrast',
    ]);

    // Navigate back to results page and verify state
    await chartPage.clickBackLink();
    await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
    await resultsPage.checkIndicatorCheckboxChecked(
      validIndicatorIDs[0].indicatorID
    );

    // Navigate back to home page and verify state
    await resultsPage.clickBackLink();
    await homePage.checkSearchFieldIsPrePopulatedWith(subjectSearchTerm);

    // Clear search field and close area pills
    await homePage.clearSearchIndicatorField();
    await homePage.closeAreaFilterPill(0);
    await homePage.closeAreaFilterPill(0);
    await homePage.closeAreaFilterPill(0);

    // verify validation prevents forward navigation
    await homePage.clickSearchButton();
    await homePage.checkSearchFieldIsPrePopulatedWith(); // nothing should be prepopulated after clearing search field
    await homePage.checkSummaryValidation(
      `There is a problemEnter a subject you want to search forEnter an area you want to search for`
    );
  });
});

// Capture URL on test failure for easier debugging
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const url = page.url();
    console.log(`Test failed! Current URL: ${url}`);

    await testInfo.attach('failed-url', {
      body: url,
      contentType: 'text/plain',
    });
  }
});
