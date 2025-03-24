import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import {
  AreaMode,
  IndicatorMode,
  returnIndicatorIDsByIndicatorMode,
  SearchMode,
} from '@/playwright/testHelpers';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'Search results for';
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

  areaFilterPills() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.pillContainer);
  }

  async areaFilterPillsText() {
    const pillFilterNames = await this.areaFilterPills()
      .getByTestId(this.filterName)
      .all();

    return Promise.all(pillFilterNames.map(async (l) => await l.textContent()));
  }

  async closeAreaFilterPill(index: number) {
    const pills = await this.areaFilterPills()
      .getByTestId(this.removeIcon)
      .all();

    await pills[index].click();
  }

  areaFilterCombobox() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.areaTypeSelector)
      .locator('select');
  }

  areaFilterOptions() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.areaTypeSelector)
      .getByRole('option');
  }

  async areaFilterOptionsText() {
    const options = await this.areaFilterOptions().all();

    return Promise.all(options.map((l) => l.textContent()));
  }

  async checkSearchResultsTitle(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` ${searchTerm}`)
    ).toBeVisible();
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
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

      await checkbox.check({ force: true, timeout: 2000 });

      await expect(checkbox).toBeChecked();
      await this.waitForURLToContain(indicatorID);
    }
  }

  /**
   * Selects the required area filters based on area mode if the search mode is ONLY_SUBJECT
   *
   * @param areaMode - area mode from the Enum AreaMode - used to decide which area filters to select
   * @param searchTerm - search term to be used in the URL check
   */
  async selectAreasFiltersIfRequired(
    searchMode: SearchMode,
    areaMode: AreaMode,
    searchTerm: string
  ) {
    // For area type filter currently defaulting to using regions (except for England area mode) - this will be refactored in DHSCFT-416
    const defaultAreaTypeFilter = 'regions';

    await this.waitForURLToContain(searchTerm);

    // only do the following for SearchMode.ONLY_SUBJECT as SearchMode.ONLY_AREA/BOTH_SUBJECT_AND_AREA already have area filters selected
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.page
        .getByTestId(this.areaTypeSelector)
        .selectOption(defaultAreaTypeFilter);

      await this.waitForURLToContain(defaultAreaTypeFilter);

      // For group type filter currently defaults to using England due to picking regions for area type above - this will be refactored in DHSCFT-416

      // Select appropriate number of checkboxes based on area mode
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');
      const checkboxCountMap = {
        [AreaMode.ONE_AREA]: 1,
        [AreaMode.TWO_PLUS_AREAS]: 2,
        [AreaMode.ALL_AREAS_IN_A_GROUP]: (await areaCheckboxList.count()) - 1, // as first checkbox is 'All'
        [AreaMode.ENGLAND_AREA]: 0, // for england we do not want to select any checkboxes
      };
      const checkboxCount = checkboxCountMap[areaMode];
      for (let i = 0; i < checkboxCount; i++) {
        await areaCheckboxList.nth(i + 1).check(); // as first checkbox is 'All'
        await this.page.waitForLoadState();
        if (i === 0 && areaMode !== AreaMode.ENGLAND_AREA) {
          await this.waitForURLToContain(defaultAreaTypeFilter);
        }
      }
      await expect(
        this.page.getByTestId(this.areaFilterContainer)
      ).toContainText(`Selected areas (${String(checkboxCount)})`);

      // England area mode
      if (AreaMode.ENGLAND_AREA === areaMode) {
        await this.page
          .getByTestId(this.areaTypeSelector)
          .selectOption('England');
        await this.page
          .getByTestId(this.groupTypeSelector)
          .selectOption('England');
        await this.waitForURLToContain('England');
      }

      await this.waitForURLToContain(searchTerm);
    }
  }

  async checkIndicatorCheckboxChecked(indicatorId: string) {
    await this.page
      .getByTestId(`${this.indicatorCheckboxPrefix}-${indicatorId}`)
      .isChecked();
  }

  async clickViewChartsButton() {
    await this.page.getByTestId(this.viewChartsButton).click();
  }

  async clearIndicatorSearchBox() {
    await this.page.getByTestId(this.indicatorSearchBox).clear();
  }

  async clickIndicatorSearchButton() {
    await this.page.getByTestId(this.indicatorSearchButton).click();
  }

  async clickIndicatorSearchButtonAndWait(searchTerm: string) {
    await this.clickIndicatorSearchButton();

    await this.waitForSearchRequestAndResponse(searchTerm);
  }

  async waitForSearchRequestAndResponse(searchTerm: string) {
    const requestPromise = this.page.waitForRequest(
      (request) =>
        request
          .url()
          .includes(
            `results?${SearchParams.SearchedIndicator}=${searchTerm}`
          ) && request.method() === 'GET'
    );
    const request = await requestPromise;
    expect(
      request
        .url()
        .includes(`results?${SearchParams.SearchedIndicator}=${searchTerm}`)
    );

    const responsePromise = this.page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `results?${SearchParams.SearchedIndicator}=${searchTerm}`
          ) &&
        response.status() === 200 &&
        response.request().method() === 'GET'
    );
    const response = await responsePromise;
    expect(
      response
        .url()
        .includes(`results?${SearchParams.SearchedIndicator}=${searchTerm}`)
    );
  }

  async checkForIndicatorSearchError() {
    await expect(
      this.page.getByText(this.indicatorSearchErrorText)
    ).toBeVisible();
  }

  async fillIndicatorSearch(text: string) {
    await this.page.getByTestId(this.indicatorSearchBox).fill(text);
  }

  async selectSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await selectAllCheckbox.check();
    await expect(selectAllCheckbox).toBeChecked();
  }

  async deselectSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await selectAllCheckbox.uncheck();
    await expect(selectAllCheckbox).not.toBeChecked();
  }

  async verifyAllIndicatorsSelected() {
    const indicatorCheckboxes = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();
    await this.page.waitForLoadState();
    for (const checkbox of indicatorCheckboxes) {
      expect(await checkbox.isChecked());
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
    expect(await selectAllCheckbox.isChecked());
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
    await indicatorCheckbox.check();
    await this.page.waitForLoadState();
    await expect(indicatorCheckbox).toBeChecked();
  }

  async deselectIndicator(indicatorId: string) {
    const indicatorCheckbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorId}`
    );
    await indicatorCheckbox.uncheck();
    await this.page.waitForLoadState();
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
}
