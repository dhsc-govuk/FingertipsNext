import { SearchParams } from '@/lib/searchStateManager';
import { expect } from '../pageFactory';
import {
  IndicatorMode,
  returnIndicatorIDsByIndicatorMode,
} from '@/playwright/testHelpers';
import AreaFilter from '../components/areaFilter';

export default class ResultsPage extends AreaFilter {
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
