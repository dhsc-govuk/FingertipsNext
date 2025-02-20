import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import { AreaMode } from './chartPage';

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

  async areaFilterOptionsText() {
    const options = await this.page
      .getByTestId(this.areaFilterContainer)
      .getByRole('option')
      .all();

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

  async selectAreasCheckboxes(areaMode: AreaMode) {
    console.log(areaMode);
    // For now defaulting to using NHS Integrated Care Boards area type but this will be expanded on in future
    await this.page
      .getByTestId(this.areaTypeSelector)
      .selectOption('NHS Integrated Care Boards');

    const groupTypeDropdown = this.page.getByTestId(this.groupTypeSelector);
    await groupTypeDropdown.click();
    await expect(groupTypeDropdown).toHaveValue('england');

    await groupTypeDropdown.selectOption('NHS Regions');
    const checkboxList = this.page
      .getByTestId(this.areaFilterContainer)
      .getByRole('checkbox');

    // Covering the different group types across the different area modes
    switch (areaMode) {
      case AreaMode.ONE_AREA:
        await checkboxList.first().check();
        break;
      case AreaMode.TWO_AREAS:
        for (let i = 0; i < 2; i++) {
          await checkboxList.nth(i).check();
        }
        break;
      case AreaMode.THREE_PLUS_AREAS:
        for (let i = 0; i < 3; i++) {
          await checkboxList.nth(i).check();
        }
        break;
      case AreaMode.ALL_AREAS_IN_A_GROUP:
        for (let i = 0; i < (await checkboxList.count()); i++) {
          await checkboxList.nth(i).check();
        }
        break;
      case AreaMode.ENGLAND_AREA:
        await groupTypeDropdown.selectOption('England');
        break;
      default:
        throw new Error('Invalid area mode');
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
