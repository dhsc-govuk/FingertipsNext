import BasePage from '../basePage';

export default class SearchPage extends BasePage {
  readonly indicatorField = 'search-form-input-indicator';
  readonly searchButton = 'search-form-button-submit';

  async typeIndicator(indicator: string) {
    await this.page.getByTestId(this.indicatorField).fill(indicator);
  }

  async clickSearchButton() {
    await this.page.getByTestId(this.searchButton).click();
  }

  async navigateToSearch() {
    await this.navigateTo('search');
  }

  async checkURLIsCorrect() {
    await this.checkURL(`search`);
  }
}
