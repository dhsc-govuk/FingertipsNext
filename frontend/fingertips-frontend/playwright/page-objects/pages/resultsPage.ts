import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  readonly backLink = 'search-results-back-link';

  async checkSearchResults(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` "${searchTerm}"`)
    ).toBeVisible();
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink);
  }

  async checkURLIsCorrect(indicator: string) {
    await this.checkURL(`search/results?indicator=${indicator}`);
  }
}
