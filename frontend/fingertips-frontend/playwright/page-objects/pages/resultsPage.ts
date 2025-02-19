import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

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
  readonly selectedAreasContainer = 'selected-areas-container';
  readonly pillContainer = 'pill-container';
  readonly filterName = 'filter-name';
  readonly removeIcon = 'remove-icon-div';

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
      .getByRole('option')
  }

  async areaFilterOptionsText() {
    const options = await this.areaFilterOptions().all();
    return Promise.all(options.map((l) => l.textContent()));
  }

  async checkSearchResults(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` ${searchTerm}`)
    ).toBeVisible();
    await expect(this.page.getByTestId(this.searchResult)).toHaveCount(20);
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  async checkURLIsCorrect(queryParams = '') {
    await this.checkURLMatches(
      `results?${SearchParams.SearchedIndicator}=${queryParams}`
    );
  }

  async selectIndicatorCheckboxes(indicatorIDs: string[]) {
    for (const indicatorID of indicatorIDs) {
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
