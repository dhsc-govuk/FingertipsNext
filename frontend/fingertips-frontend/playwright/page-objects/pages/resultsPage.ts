import { SearchParams } from '@/lib/searchStateManager';
import { expect } from '../pageFactory';
import {
  AreaMode,
  IndicatorInfo,
  SearchMode,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers/genericTestUtilities';
import AreaFilter from '../components/areaFilter';
import {
  AreaTypeKeys,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';

export default class ResultsPage extends AreaFilter {
  readonly resultsText = 'Search results';
  readonly backLink = 'search-results-back-link';
  readonly searchResult = 'search-result';
  readonly indicatorCheckboxPrefix = 'search-results-indicator';
  readonly viewChartsButton = `search-results-button-submit`;
  readonly indicatorSearchErrorText =
    'Please enter an indicator ID or select at least one area';
  readonly indicatorSearchBox = `indicator-search-form-input`;
  readonly indicatorSearchError = `indicator-search-form-error`;
  readonly indicatorSearchButton = `indicator-search-form-submit`;
  readonly indicatorCheckboxContainer = 'indicator-selection-form';
  readonly selectAllIndicatorsCheckbox = 'select-all-checkbox';
  readonly areaFilterContainer = 'area-filter-container';
  readonly areaTypeSelector = 'area-type-selector-container';
  readonly groupTypeSelector = 'group-type-selector-container';
  readonly selectedAreasContainer = 'selected-areas-panel';
  readonly selectAreasContainer = 'select-areas-filter-panel';
  readonly pillContainer = 'pill-container';
  readonly filterName = 'filter-name';
  readonly removeIcon = 'x-icon';
  readonly viewBackgroundInfoLink = 'view-background-info-link';
  readonly searchResultsPagination = 'search-results-pagination';
  readonly trendTitle = 'Recent trend for selected area';
  readonly trendComponent = 'trend-tag-component';

  async navigateToResults(
    searchIndicator: string,
    selectedAreaCodes: string[],
    selectedAreaType?: AreaTypeKeys
  ) {
    const asQuery = selectedAreaCodes.reduce(
      (accumulator, currentValue) =>
        accumulator + `&${SearchParams.AreasSelected}=${currentValue}`,
      ''
    );

    const determineAreaTypeSelected = selectedAreaType ?? englandAreaType.key;

    await this.page.goto(
      `results?${SearchParams.SearchedIndicator}=${searchIndicator}&${SearchParams.AreaTypeSelected}=${determineAreaTypeSelected}${asQuery}`
    );
  }

  async checkSearchResultsTitle(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` for ${searchTerm}`)
    ).toBeVisible();
  }

  async checkSearchResultsTitleBasedOnSearchMode(
    searchMode: SearchMode,
    searchTerm: string
  ) {
    const heading = this.page.getByRole('heading', { level: 1 });
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await expect(heading).toContainText(
        this.resultsText + ` for ${searchTerm}`
      );
    }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await expect(heading).toContainText(
        this.resultsText + ` for ${searchTerm}`
      );
    }
    if (searchMode === SearchMode.ONLY_AREA) {
      await expect(heading).toContainText(this.resultsText);
    }
  }

  async checkRecentTrends(
    areaMode: AreaMode,
    expectedIndicatorsToSelect: IndicatorInfo[],
    checkTrends: boolean
  ) {
    const trendsShouldBeVisible =
      areaMode === AreaMode.ONE_AREA ||
      areaMode === AreaMode.ALL_AREAS_IN_A_GROUP ||
      areaMode === AreaMode.ENGLAND_AREA;

    await expect(this.page.getByText(this.trendTitle)).toBeVisible({
      visible: trendsShouldBeVisible,
    });

    // currently, the trend text on each indicator is only visible on the results page in the deployed CD environment so checkTrends will be set to false in local and CI environments via the npm script
    if (trendsShouldBeVisible && checkTrends) {
      for (const expectedIndicatorToSelect of expectedIndicatorsToSelect) {
        if (!expectedIndicatorToSelect.knownTrend) {
          throw new Error(
            `Selected indicator ${expectedIndicatorToSelect.indicatorID} should have a known trend stored in core_journey_config.ts.`
          );
        }
        const searchResultItem = this.page.getByTestId('search-result').filter({
          has: this.page.getByTestId(
            `${this.indicatorCheckboxPrefix}-${expectedIndicatorToSelect.indicatorID}`
          ),
        });

        const trendText = searchResultItem
          .getByTestId(this.trendComponent)
          .allInnerTexts();

        // Trim each text value before comparison
        const trimmedTrendText = (await trendText).map((text) => text.trim());

        expect(trimmedTrendText).toContain(
          expectedIndicatorToSelect.knownTrend
        );
      }
    }
  }

  async clickBackLink() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }

  /**
   * Checks that the displayed indicators are correct based on what was searched for
   * @param allValidIndicators - a list of all valid indicators for the searched for criteria
   */
  async checkDisplayedIndicators(
    allValidIndicators: SimpleIndicatorDocument[],
    searchMode: SearchMode
  ) {
    // wait for indicator checkboxes to be visible
    expect(
      await this.page
        .getByTestId(this.indicatorCheckboxContainer)
        .getByRole('checkbox')
        .count()
    ).toBeGreaterThan(1);

    if (searchMode != SearchMode.ONLY_AREA) {
      // get a list of all the displayed indicator checkboxes
      const displayedIndicatorCheckboxList = await this.page
        .getByTestId(this.indicatorCheckboxContainer)
        .getByRole('list')
        .getByRole('checkbox')
        .all();

      // check that the displayed indicator IDs are valid for the searched for criteria
      for (const checkbox of displayedIndicatorCheckboxList) {
        const indicatorDataTestID = await checkbox.getAttribute('value');
        const stringifiedAllValidIndicators =
          JSON.stringify(allValidIndicators);
        if (
          !stringifiedAllValidIndicators.includes(
            `"indicatorID":${indicatorDataTestID}`
          )
        ) {
          throw new Error(
            `The indicator ID: ${indicatorDataTestID} displayed is not valid for the searched for criteria.`
          );
        }
      }
    }
  }

  /**
   * Selects the specified indicator checkboxes and verifies URL updates
   * @param expectedIndicatorsToSelect - List of indicators to be selected
   */
  async selectIndicatorCheckboxesAndVerifyURLUpdated(
    expectedIndicatorsToSelect: IndicatorInfo[]
  ): Promise<void> {
    for (const indicator of expectedIndicatorsToSelect) {
      const indicatorIDString = String(indicator.indicatorID);

      try {
        await this.selectIndicatorCheckbox(indicatorIDString);
      } catch {
        await this.searchAllPagesForIndicator(indicatorIDString);
      }
    }
  }

  /**
   * Selects an indicator checkbox and verifies the selection
   */
  private async selectIndicatorCheckbox(
    indicatorIDString: string
  ): Promise<void> {
    const checkbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorIDString}`
    );

    // Check if indicator checkbox exists on the page - this will throw a caught error if not found - the try catch in the calling method will then try the next page
    const isVisible = await checkbox.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error(
        `Checkbox for indicator ${indicatorIDString} not found on current page`
      );
    }

    // Verify initial state
    await expect(checkbox).toBeAttached();
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();
    await expect(checkbox).toBeEditable();
    await expect(checkbox).toBeChecked({ checked: false });

    // Select the checkbox
    await this.checkAndAwaitLoadingComplete(checkbox);

    // Verify checked state
    await this.checkIndicatorCheckboxChecked(indicatorIDString);
    await this.waitForURLToContain(indicatorIDString);
  }

  /**
   * Searches all results pages for the desired indicator checkbox and selects it when found
   */
  private async searchAllPagesForIndicator(
    indicatorIDString: string
  ): Promise<void> {
    const pagination = this.page.getByTestId(this.searchResultsPagination);

    if (!pagination) {
      throw new Error(
        `Indicator ${indicatorIDString} not found and no pagination available`
      );
    }

    // Go to first page to start search
    const firstPageButton = pagination.getByRole('button').first();
    if (await firstPageButton.isVisible()) {
      await this.clickAndAwaitLoadingComplete(firstPageButton);
    }

    // THIS NEEDS TO BE REVISITED WHEN ALL INDICATORS ARE LOADED
    // IDEALLY WE CALL THE API TO CHECK RESULT RESPONSES AND DONT DO ANY OF THE FOLLOWING IF INDICATOR NOT IN RESPONSE
    // Search through all pages up to a max of 3
    let pageCount = 0;
    const maxPages = 3;

    while (pageCount < maxPages) {
      try {
        await this.selectIndicatorCheckbox(indicatorIDString);
        return;
      } catch {
        // Get next page selector
        const nextButton = pagination.getByRole('button', {
          name: 'Next page',
        });

        // Safely check if next page selector is visible or not - if not the error is caught and we break out of the loop as no more pages to check
        const isNextButtonVisible = await nextButton
          .isVisible()
          .catch(() => false);
        if (!isNextButtonVisible) {
          break; // No more pages as Next button not displayed
        }

        await this.clickAndAwaitLoadingComplete(nextButton);
        pageCount++;
      }
    }

    throw new Error(
      `Indicator ${indicatorIDString} not found after searching the first ${String(maxPages)} pages.`
    );
  }

  async checkIndicatorCheckboxChecked(indicatorId: string) {
    await this.page
      .getByTestId(`${this.indicatorCheckboxPrefix}-${indicatorId}`)
      .isChecked();
  }

  async clickViewChartsButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.viewChartsButton),
      20_000 // Increased timeout to 20 seconds to allow for charts to load
    );
  }

  async clearIndicatorSearchBox() {
    await this.clearAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchBox)
    );
  }

  async clickIndicatorSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchButton)
    );
  }

  async checkForIndicatorSearchError() {
    await expect(
      this.page.getByText(this.indicatorSearchErrorText)
    ).toBeVisible();
  }

  async fillIndicatorSearch(text: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchBox),
      text
    );
  }

  async selectIndicatorSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.checkAndAwaitLoadingComplete(selectAllCheckbox);
    await expect(selectAllCheckbox).toBeChecked();
  }

  async deselectIndicatorSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.uncheckAndAwaitLoadingComplete(selectAllCheckbox);
    await expect(selectAllCheckbox).not.toBeChecked();
  }

  async selectEveryIndicator(allIndicatorIDs: string[]) {
    await this.page.waitForLoadState();
    for (const indicatorId of allIndicatorIDs) {
      const checkbox = this.page.getByTestId(
        `${this.indicatorCheckboxPrefix}-${indicatorId}`
      );
      const indicatorChecked = await checkbox.isChecked();
      if (!indicatorChecked) {
        await this.selectIndicator(indicatorId);
      }
    }
  }

  async verifyAllIndicatorsSelected() {
    const indicatorCheckboxes = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();
    await this.page.waitForLoadState();
    for (const checkbox of indicatorCheckboxes) {
      await expect(checkbox).toBeChecked();
    }
  }

  async verifyNoIndicatorsSelected() {
    const indicatorCheckboxes = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();
    await this.page.waitForLoadState();
    for (const checkbox of indicatorCheckboxes) {
      await expect(checkbox).not.toBeChecked();
    }
  }

  async verifySelectAllCheckboxTicked() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.page.waitForLoadState();
    await expect(selectAllCheckbox).toBeChecked();
  }

  async verifySelectAllCheckboxUnticked() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.page.waitForLoadState();
    await expect(selectAllCheckbox).not.toBeChecked();
  }

  async verifyCheckboxIsInFocus(locator: string) {
    const checkboxElement = this.page.locator(locator);
    await expect(checkboxElement).toBeFocused();
  }

  async selectIndicator(indicatorId: string) {
    const indicatorCheckbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorId}`
    );
    await this.checkAndAwaitLoadingComplete(indicatorCheckbox);
    await expect(indicatorCheckbox).toBeChecked();
  }

  async deselectIndicator(indicatorId: string) {
    const indicatorCheckbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorId}`
    );
    await this.uncheckAndAwaitLoadingComplete(indicatorCheckbox);
    await expect(indicatorCheckbox).not.toBeChecked();
  }

  async verifyUrlContainsAllIndicators(indicatorIds: string[]) {
    for (const indicatorId of indicatorIds) {
      await expect(this.page).toHaveURL(new RegExp(`&is=${indicatorId}`));
    }
  }

  async verifyUrlExcludesAllIndicators() {
    await expect(this.page).not.toHaveURL(/&is=/);
  }

  async verifyUrlUpdatedAfterDeselection(deselectedIndicator: string) {
    await expect(this.page).not.toHaveURL(
      new RegExp(`&is=${deselectedIndicator}`)
    );
  }

  async checkNumberOfResults(expectedResultCount: number) {
    expect(this.page.getByTestId(this.searchResult)).toHaveCount(
      expectedResultCount
    );
  }

  async checkFirstResultHasName(expectedResultName: string) {
    expect(
      await this.page.getByTestId(this.searchResult).count()
    ).toBeGreaterThan(0);
    expect(
      this.page.getByTestId(this.searchResult).first().getByRole('heading')
    ).toHaveText(expectedResultName);
  }

  async checkAnyResultNameContainsText(expectedResultName: string) {
    expect(
      await this.page.getByTestId(this.searchResult).count()
    ).toBeGreaterThan(0);
    expect(
      this.page
        .getByTestId(this.searchResult)
        .getByRole('heading')
        .getByText(expectedResultName)
    ).toBeVisible();
  }
}
