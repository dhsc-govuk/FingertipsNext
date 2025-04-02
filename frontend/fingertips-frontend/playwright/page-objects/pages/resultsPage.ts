import { SearchParams } from '@/lib/searchStateManager';
import { expect } from '../pageFactory';
import {
  AreaMode,
  IndicatorMode,
  returnIndicatorIDsByIndicatorMode,
  SearchMode,
} from '@/playwright/testHelpers';
import AreaFilter from '../components/areaFilter';
import { RawIndicatorDocument } from '@/lib/search/searchTypes';

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

  async navigateToResults(
    searchIndicator: string,
    selectedAreaCodes: string[]
  ) {
    const asQuery = selectedAreaCodes.reduce(
      (accumulator, currentValue) =>
        accumulator + `&${SearchParams.AreasSelected}=${currentValue}`,
      ''
    );

    await this.page.goto(
      `results?${SearchParams.SearchedIndicator}=${searchIndicator}${asQuery}`
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

  async checkRecentTrends(areaMode: AreaMode) {
    const trendsShouldBeVisible = areaMode !== AreaMode.TWO_PLUS_AREAS;
    await expect(
      this.page.getByText('Recent trend for selected area')
    ).toBeVisible({ visible: trendsShouldBeVisible });
  }

  async clickBackLink() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }

  /**
   * Selects the required number of indicators based on the indicator mode and checks the URL has been updated after each selection.
   * Note that we trust, and therefore test, the fingertips UI to only show us valid indicators based on the areas selected by the
   * test function selectAreasFilters. If the UI allows us to select invalid area + indicator combinations, then the chart page will error.
   *
   * @param allIndicatorIDs - a list of all possible indicator IDs which the function can filter down to the correct number of indicators to select
   * @param indicatorMode - indicator mode from the Enum IndicatorMode - used to decide how many indicators to select
   */
  async selectIndicatorCheckboxes(
    allIndicatorIDs: string[],
    indicatorMode: IndicatorMode
  ) {
    const filteredByDisplayIndicatorIds: string[] = [];

    expect(
      await this.page
        .getByTestId(this.indicatorCheckboxContainer)
        .getByRole('checkbox')
        .count()
    ).toBeGreaterThan(1);

    // filter down the full list of indicators passed to this method to just the ones displayed on the page
    const displayedIndicatorCheckboxList = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();

    for (const checkbox of displayedIndicatorCheckboxList) {
      const indicatorDataTestID = await checkbox.getAttribute('value');

      if (
        indicatorDataTestID &&
        JSON.stringify(allIndicatorIDs).includes(indicatorDataTestID)
      ) {
        filteredByDisplayIndicatorIds.push(indicatorDataTestID);
      }
    }
    // then filter down the list of displayed indicators to the correct number for the passed indicator mode
    const filteredByIndicatorModeIndicatorIds: string[] =
      returnIndicatorIDsByIndicatorMode(
        filteredByDisplayIndicatorIds,
        indicatorMode
      );

    for (const indicatorID of filteredByIndicatorModeIndicatorIds) {
      const checkbox = this.page.getByTestId(
        `${this.indicatorCheckboxPrefix}-${indicatorID}`
      );

      await expect(checkbox).toBeAttached();
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeEnabled();
      await expect(checkbox).toBeEditable();
      await expect(checkbox).toBeChecked({ checked: false });

      await this.checkAndAwaitLoadingComplete(checkbox);

      await expect(checkbox).toBeChecked();
      await this.waitForURLToContain(indicatorID);
    }
  }

  async checkIndicatorCheckboxChecked(indicatorId: string) {
    await this.page
      .getByTestId(`${this.indicatorCheckboxPrefix}-${indicatorId}`)
      .isChecked();
  }

  async clickViewChartsButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.viewChartsButton)
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

  async clickViewBackgroundInformationLinkForIndicator(
    indicator: RawIndicatorDocument
  ) {
    if (!indicator) {
      throw new Error(`Indicator not found`);
    }

    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(this.pillContainer)
        .getByText(indicator.indicatorName)
        .getByRole('link', { name: 'View background information' })
    );
  }
}
