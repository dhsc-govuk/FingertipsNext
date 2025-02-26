import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import {
  AreaMode,
  IndicatorMode,
  returnIndicatorIDsByIndicatorMode,
} from '@/playwright/testHelpers';

let filteredIndicatorIds: string[];

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
  readonly areaFilterContainer = 'area-filter-container';
  readonly areaTypeSelector = 'area-type-selector-container';
  readonly groupTypeSelector = 'group-type-selector-container';
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
    await expect(this.page.getByTestId(this.searchResult)).toHaveCount(20);
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  /**
   * Selects the required number of indicators based on the indicator mode and checks the URL has been updated after each selection.
   * Note that we trust, and therefore test, the fingertips UI to only show us valid indicators based on the areas selected by the
   * test function selectAreasFiltersAndCheckURL. If the UI allows us to select invalid area + indicator combinations, then the chart page will error.
   *
   * @param allIndicatorIDs - a list of all possible indicator IDs which the function can filter down to the correct number of indicators to select
   * @param indicatorMode - indicator mode from the Enum IndicatorMode - used to decide how many indicators to select
   * @param searchTerm - search term to be used in the URL check
   */
  async selectIndicatorCheckboxesAndCheckURL(
    allIndicatorIDs: string[],
    indicatorMode: IndicatorMode,
    searchTerm: string
  ) {
    await this.waitForURLToContain(searchTerm);
    filteredIndicatorIds = returnIndicatorIDsByIndicatorMode(
      allIndicatorIDs,
      indicatorMode
    );
    for (const indicatorID of filteredIndicatorIds) {
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
   * Selects the required area filters
   *
   * @param areaMode - area mode from the Enum AreaMode - used to decide which area filters to select
   * @param searchTerm - search term to be used in the URL check
   */
  async selectAreasFiltersAndCheckURL(areaMode: AreaMode, searchTerm: string) {
    // For area type filter currently defaulting to using NHS Integrated Care Boards (except for England area mode) - this will be refactored in the future
    const defaultAreaTypeFilter = 'nhs-integrated-care-boards';
    await this.page
      .getByTestId(this.areaTypeSelector)
      .selectOption(defaultAreaTypeFilter);

    // For group type filter currently defaulting to using NHS Regions (except for England area mode) - this will be refactored in the future
    const groupTypeDropdown = this.page.getByTestId(this.groupTypeSelector);
    await groupTypeDropdown.selectOption('NHS Regions');

    // Select appropriate number of checkboxes based on area mode
    const checkboxList = this.page
      .getByTestId(this.areaFilterContainer)
      .getByRole('checkbox');
    const checkboxCountMap = {
      [AreaMode.ONE_AREA]: 1,
      [AreaMode.TWO_AREAS]: 2,
      [AreaMode.THREE_PLUS_AREAS]: 3,
      [AreaMode.ALL_AREAS_IN_A_GROUP]: await checkboxList.count(),
      [AreaMode.ENGLAND_AREA]: 0, // for england we do not want to select any checkboxes
    };
    const checkboxCount = checkboxCountMap[areaMode];
    for (let i = 0; i < checkboxCount; i++) {
      await checkboxList.nth(i).check();

      if (i === 0 && areaMode !== AreaMode.ENGLAND_AREA) {
        await this.waitForURLToContain(defaultAreaTypeFilter);
      }
    }

    // England area mode
    if (AreaMode.ENGLAND_AREA === areaMode) {
      await this.page
        .getByTestId(this.areaTypeSelector)
        .selectOption('England');
      await groupTypeDropdown.selectOption('England');
      await this.waitForURLToContain(`england`);
    }

    await this.waitForURLToContain(
      `${searchTerm}&${SearchParams.IndicatorsSelected}=${filteredIndicatorIds[0]}`
    );
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
}
