import { test } from '../../page-objects/pageFactory';
import {
  sortAlphabetically,
  IndicatorMode,
  SearchMode,
  AreaMode,
  AreaFilters,
} from '../../testHelpers/genericTestUtilities';
import {
  getAllIndicatorIDsForSearchTerm,
  returnIndicatorIDsByIndicatorMode,
  getAllAreasByAreaType,
} from '../../testHelpers/indicatorDataUtilities';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { RawIndicatorDocument } from '@/lib/search/searchTypes';
import ChartPage from '@/playwright/page-objects/pages/chartPage';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

/**
 * Note that this test suite uses mock service worker to mock API responses, therefore these playwright tests are isolated from the backend
 * See:
 * - frontend/fingertips-frontend/assets/mockIndicatorData.json
 * - frontend/fingertips-frontend/assets/mockAreaData.json
 */

// Test data setup
// @ts-expect-error mock data type casting
const indicatorData = mockIndicators as RawIndicatorDocument[];
const subjectSearchTerm = 'Alzheimer';
const secondSubjectSearchTerm = 'diabetes';
const indicatorMode = IndicatorMode.ONE_INDICATOR;
const searchMode = SearchMode.ONLY_SUBJECT;
const areaFiltersToSelect: AreaFilters = {
  areaType: 'gps',
  groupType: 'nhs-sub-integrated-care-boards',
  group: '',
};
const password = 'password';
// Initialize test data from mock sources
const typedIndicatorData = indicatorData.map(
  (indicator: RawIndicatorDocument) => ({
    ...indicator,
    lastUpdated: new Date(indicator.lastUpdatedDate),
  })
);
const allValidIndicatorIDs = getAllIndicatorIDsForSearchTerm(
  typedIndicatorData,
  subjectSearchTerm
);
// Filter down valid indicators based on mode
const validIndicatorIDs = returnIndicatorIDsByIndicatorMode(
  allValidIndicatorIDs,
  indicatorMode
);
// Get all NHS region areas
const allNHSRegionAreas = getAllAreasByAreaType(mockAreas, 'nhs-regions');

test.describe('Home Page Tests', () => {
  // we are intentionally setting failOnUnhandledError to handle a spurious 404
  test.use({ failOnUnhandledError: false });

  test('should navigate to home page and validate accessibility', async ({
    homePage,
    axeBuilder,
  }) => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('should validate search field form validations when no search term or area is searched when form search button is clicked', async ({
    homePage,
  }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
      await homePage.checkSearchFieldIsPrePopulatedWith(); // nothing - as nothing should be prepopulated when first navigating to the home page
    });

    await test.step('Try to search with empty field', async () => {
      await homePage.clickHomePageFormSearchButton();
    });

    await test.step('Verify validation messages', async () => {
      await homePage.checkSummaryValidation(
        `There is a problemEnter a subject you want to search forEnter an area you want to search for`
      );
    });
  });

  test('should trigger search field form validations when no search term or area is searched when Enter key is pressed', async ({
    homePage,
  }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
      await homePage.checkSearchFieldIsPrePopulatedWith(); // nothing - as nothing should be prepopulated when first navigating to the home page
    });

    await test.step('Try to search with empty field via Enter key', async () => {
      await homePage.clickSubjectSearchField();
      await homePage.pressKey('Enter');
    });

    await test.step('Verify validation messages', async () => {
      await homePage.checkSummaryValidation(
        `There is a problemEnter a subject you want to search forEnter an area you want to search for`
      );
    });
  });

  test('clear all areas from home page should correctly clear selected areas', async ({
    homePage,
    resultsPage,
  }) => {
    await test.step('Navigate to results page with areas', async () => {
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
    });

    await test.step('click back and assert on homepage with areas', async () => {
      await resultsPage.clickBackLink();

      await homePage.checkOnHomePage();
    });

    await test.step('click clear all and assert behaviour', async () => {
      await homePage.clearAllSelectedAreasHomePage();

      await test
        .expect(homePage.page)
        .not.toHaveURL(allNHSRegionAreas[0].areaCode);
      await homePage.checkSearchFieldIsPrePopulatedWith();
    });
  });

  // fails due to loading screen notyet implemented on auth flow
  test.fixme(
    'should display Sign out after successful mock sign in',
    async ({ homePage }) => {
      await test.step('Navigate to home page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });

      await test.step('Click Sign in button', async () => {
        await homePage.clickSignIn();
      });

      await test.step('Enter correct email but incorrect password and verify correct message is displayed', async () => {
        await homePage.signInToMock(password);

        await homePage.checkSignOutDisplayed();
      });
    }
  );

  test('header nav link should return user to home page', async ({
    homePage,
    resultsPage,
  }) => {
    await test.step('Navigate directly to results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);
    });

    await test.step('Navigate to home page', async () => {
      await resultsPage.clickHeaderHomeNavigation();
      await homePage.checkOnHomePage();
    });
  });
});

test.describe('Results Page Tests', () => {
  test('should search for indicators and display results', async ({
    homePage,
    resultsPage,
    axeBuilder,
  }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
    });

    await test.step('Search by subject for indicators', async () => {
      await homePage.searchForIndicators(searchMode, subjectSearchTerm);
      await homePage.clickHomePageIndicatorSearchButton();
    });

    await test.step('Verify results page', async () => {
      await resultsPage.waitForURLToContain(subjectSearchTerm);
      await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
      await resultsPage.expectNoAccessibilityViolations(axeBuilder, [
        'color-contrast',
      ]);
    });
  });

  test('should validate indicator search on results page', async ({
    resultsPage,
    axeBuilder,
  }) => {
    await test.step('Navigate directly to results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);
    });

    await test.step('Clear indicator search and verify validation messages', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkForIndicatorSearchError();
      await resultsPage.expectNoAccessibilityViolations(axeBuilder, [
        'color-contrast',
      ]);
    });

    await test.step('Enter a different valid search and verify results page', async () => {
      await resultsPage.fillIndicatorSearch(secondSubjectSearchTerm);
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.checkSearchResultsTitle(secondSubjectSearchTerm);
    });
  });

  test('should handle "select all" indicators functionality correctly', async ({
    resultsPage,
  }) => {
    await test.step('Navigate directly to results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);
      await resultsPage.checkSearchResultsTitleBasedOnSearchMode(
        searchMode,
        subjectSearchTerm
      );
    });

    await test.step('Verify select all checkbox', async () => {
      await resultsPage.selectIndicatorSelectAllCheckbox();
      await resultsPage.verifyAllIndicatorsSelected();
      await resultsPage.verifyUrlContainsAllIndicators(allValidIndicatorIDs);
    });

    await test.step('Verify deselect all checkbox', async () => {
      await resultsPage.deselectIndicatorSelectAllCheckbox();
      await resultsPage.verifyNoIndicatorsSelected();
      await resultsPage.verifyUrlExcludesAllIndicators();
    });

    await test.step('Verify select all checkbox is still in focus', async () => {
      await resultsPage.verifyCheckboxIsInFocus(
        '#search-results-indicator-all'
      );
    });

    await test.step('Verify individual selections to select all', async () => {
      await resultsPage.selectEveryIndicator(allValidIndicatorIDs);
      await resultsPage.verifySelectAllCheckboxTicked();
      await resultsPage.verifyUrlContainsAllIndicators(allValidIndicatorIDs);
    });

    await test.step('Verify deselecting one indicator', async () => {
      await resultsPage.deselectIndicator(allValidIndicatorIDs[0]);
      await resultsPage.verifySelectAllCheckboxUnticked();
      await resultsPage.verifyUrlUpdatedAfterDeselection(
        allValidIndicatorIDs[0]
      );
    });

    await test.step('Verify that the previously deselected checkbox is still in focus', async () => {
      await resultsPage.verifyCheckboxIsInFocus(
        `#search-results-indicator-${allValidIndicatorIDs[0]}`
      );
    });
  });

  test('should clear indicators from URL when search changes', async ({
    resultsPage,
  }) => {
    await test.step('Navigate to results page with areas', async () => {
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

    await test.step('Select indicator and verify URL updated', async () => {
      await resultsPage.selectIndicatorCheckboxesAndVerifyURLUpdated(
        validIndicatorIDs
      );
    });

    await test.step('Clear search and verify indicators removed from URL', async () => {
      await resultsPage.clearIndicatorSearchBox();
      await resultsPage.clickIndicatorSearchButton();
      await resultsPage.verifyUrlExcludesAllIndicators();
    });
  });
});

test.describe('Area Filter Tests', () => {
  test('should manage area pills on results page', async ({ resultsPage }) => {
    await test.step('Navigate directly to results with preselected areas', async () => {
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
    });

    await test.step('Verify area pills display correctly', async () => {
      const expectedPillTexts = [
        `${allNHSRegionAreas[0].areaName} ${allNHSRegionAreas[0].areaType}`,
        `${allNHSRegionAreas[1].areaName} ${allNHSRegionAreas[1].areaType}`,
        `${allNHSRegionAreas[2].areaName} ${allNHSRegionAreas[2].areaType}`,
      ];

      await test
        .expect(await resultsPage.areaFilterPills())
        .toHaveCount(expectedPillTexts.length);

      const filterPillNames = await resultsPage.areaFilterPillsText();
      sortAlphabetically(filterPillNames);
      sortAlphabetically(expectedPillTexts);
      test.expect(filterPillNames).toEqual(expectedPillTexts);

      await resultsPage.assertAreaFiltersDisabled();
    });

    await test.step('Remove one pill and verify remaining pills', async () => {
      await resultsPage.closeAreaFilterPill(1);

      const expectedRemainingPills = [
        `${allNHSRegionAreas[0].areaName} ${allNHSRegionAreas[0].areaType}`,
        `${allNHSRegionAreas[2].areaName} ${allNHSRegionAreas[2].areaType}`,
      ];

      await test
        .expect(await resultsPage.areaFilterPills())
        .toHaveCount(expectedRemainingPills.length);

      const remainingPillNames = await resultsPage.areaFilterPillsText();
      sortAlphabetically(remainingPillNames);
      sortAlphabetically(expectedRemainingPills);
      test.expect(remainingPillNames).toEqual(expectedRemainingPills);
    });

    await test.step('Verify URL updated after removing area pill', async () => {
      await resultsPage.waitForURLToContain(allNHSRegionAreas[0].areaCode);
      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[1].areaCode);
      await resultsPage.waitForURLToContain(allNHSRegionAreas[2].areaCode);
    });

    await test.step('Remove all pills and verify filter state', async () => {
      await resultsPage.closeAreaFilterPill(1);
      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[2].areaCode);

      await resultsPage.closeAreaFilterPill(0);

      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[0].areaCode);
      await resultsPage.verifyUrlExcludesAllIndicators();
      await resultsPage.assertAreaFiltersEnabled();
    });
  });

  test('should support filtering results by different area types', async ({
    resultsPage,
  }) => {
    await test.step('Navigate to results page', async () => {
      await resultsPage.navigateToResults(subjectSearchTerm, []);
    });

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
      await resultsPage.assertAreaFiltersDisabled();
    });

    await test.step('change to different GP area', async () => {
      await resultsPage.closeAreaFilterPill(0);

      const newGroup = 'North 2 Islington PCN';
      const newArea = 'Archway Medical Centre';
      const newAreaCode = 'F83004';

      await resultsPage.selectGroupAndAssertURLUpdated(newGroup);
      await resultsPage.selectAreaAndAssertURLUpdated(newArea, newAreaCode);
      await resultsPage.assertAreaFiltersDisabled();
    });

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
      await resultsPage.assertAreaFiltersDisabled();
    });

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
      await resultsPage.assertAreaFiltersDisabled();
    });

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
      await resultsPage.assertAreaFiltersDisabled();
    });

    await test.step('click clear all and assert behaviour', async () => {
      await resultsPage.clearAllSelectedAreasResultsPage();

      await test
        .expect(resultsPage.page)
        .not.toHaveURL(allNHSRegionAreas[0].areaCode);
      await resultsPage.assertAreaFiltersEnabled();
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
    await test.step('Navigate to home page and search', async () => {
      await homePage.navigateToHomePage();
      await homePage.searchForIndicators(searchMode, subjectSearchTerm);
      await homePage.clickHomePageFormSearchButton();
    });

    await test.step('Select indicator and check charts accessibility', async () => {
      await resultsPage.selectIndicatorCheckboxesAndVerifyURLUpdated(
        validIndicatorIDs
      );
      await resultsPage.clickViewChartsButton();

      await chartPage.waitForURLToContain('chart');
      await chartPage.expectNoAccessibilityViolations(axeBuilder, [
        'color-contrast',
      ]);
    });

    await test.step('Navigate to indicator information page and back', async () => {
      // get the indicator data for the selected indicatorID
      const indicator = typedIndicatorData.find(
        (ind) => ind.indicatorID === validIndicatorIDs[0].indicatorID
      );

      if (!indicator) {
        throw new Error(`Indicator with ID ${validIndicatorIDs[0]} not found`);
      }

      await chartPage.clickViewBackgroundInformationLinkForIndicator(indicator);

      await indicatorPage.waitForURLToContain('indicator');
      await indicatorPage.checkIndicatorNameTitle(indicator);
      await indicatorPage.expectNoAccessibilityViolations(axeBuilder);
      await indicatorPage.clickBackLink();
    });

    await test.step('Apply area filters on chart page', async () => {
      await chartPage.selectAreasFiltersIfRequired(
        searchMode,
        AreaMode.THREE_PLUS_AREAS,
        areaFiltersToSelect
      );
    });

    await test.step('Verify chart component and accessibility', async () => {
      await chartPage.checkSpecificChartComponent(
        ChartPage.barChartEmbeddedTableComponent
      );
      await chartPage.expectNoAccessibilityViolations(axeBuilder, [
        'color-contrast',
      ]);
    });

    await test.step('Navigate back to results page and verify state', async () => {
      await chartPage.clickBackLink();
      await resultsPage.checkSearchResultsTitle(subjectSearchTerm);
      await resultsPage.checkIndicatorCheckboxChecked(
        validIndicatorIDs[0].indicatorID
      );
    });

    await test.step('Navigate back to home page and verify state', async () => {
      await resultsPage.clickBackLink();
      await homePage.checkSearchFieldIsPrePopulatedWith(subjectSearchTerm);
    });

    await test.step('Clear search field and close area pills', async () => {
      await homePage.clearSearchIndicatorField();
      await homePage.closeAreaFilterPill(0);
      await homePage.closeAreaFilterPill(0);
      await homePage.closeAreaFilterPill(0);
    });

    await test.step('Verify validation prevents forward navigation', async () => {
      await homePage.clickHomePageFormSearchButton();
      await homePage.checkSearchFieldIsPrePopulatedWith(); // nothing - as nothing should be prepopulated after clearing search field above
      await homePage.checkSummaryValidation(
        `There is a problemEnter a subject you want to search forEnter an area you want to search for`
      );
    });
  });
});

// Capture and log out URL on test failure
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
