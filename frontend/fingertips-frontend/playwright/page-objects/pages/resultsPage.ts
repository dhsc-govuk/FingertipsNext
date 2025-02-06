import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'Search results for';
  readonly backLink = 'search-results-back-link';
  readonly searchResult = 'search-result';
  readonly indicatorCheckboxPrefix = 'search-results-indicator';
  readonly viewChartsButton = 'search-results-button-submit';
  readonly areaFilterContainer = 'area-filter-container';

  async areaFilterOptionsText() {
    const options = await this.page
      .getByTestId(this.areaFilterContainer)
      .getByRole('option')
        .all();

    return Promise.all(options.map(l => l.getAttribute('value')));
  }

  readonly indicatorSearchErrorText = 'Please enter a subject';
  readonly indicatorSearchBox = `indicator-search-form-input`;
  readonly indicatorSearchError = `indicator-search-form-error`;
  readonly indicatorSearchButton = `indicator-search-form-submit`;

  async checkSearchResults(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` ${searchTerm}`)
    ).toBeVisible();
    await expect(this.page.getByTestId(this.searchResult)).toHaveCount(2);
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  async checkURLIsCorrect(indicator: string) {
    await this.checkURL(
      `results?${SearchParams.SearchedIndicator}=${indicator}`
    );
  }

  async clickIndicatorCheckboxes(indicatorIds: string[]) {
    for (const indicatorId of indicatorIds) {
      await this.page
        .getByTestId(`${this.indicatorCheckboxPrefix}-${indicatorId}`)
        .click();
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

  async checkForIndicatorSearchError() {
    await expect(
      this.page.getByText(this.indicatorSearchErrorText)
    ).toBeVisible();
  }

  async fillIndicatorSearch(text: string) {
    await this.page.getByTestId(this.indicatorSearchBox).fill(text);
  }
}
