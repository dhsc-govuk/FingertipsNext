import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  readonly backLink = 'search-results-back-link';
  readonly searchResult = 'search-result';

  async checkSearchResults(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` "${searchTerm}"`)
    ).toBeVisible();
    await expect(this.page.getByTestId(this.searchResult)).toHaveCount(2);
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  async checkURLIsCorrect(indicator: string) {
    await this.checkURL(`search/results?indicator=${indicator}`);
  }
}
