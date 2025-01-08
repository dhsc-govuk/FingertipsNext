import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class SearchPage extends BasePage {
  readonly indicatorField = 'search-form-input-indicator';
  readonly searchButton = 'search-form-button-submit';
  readonly validationSummary = 'search-form-error-summary';
  async typeIndicator(indicator: string) {
    await this.page.getByTestId(this.indicatorField).fill(indicator);
  }

  async clickSearchButton() {
    await this.page.getByTestId(this.searchButton).click();
  }

  async navigateToSearch() {
    await this.navigateTo('search');
  }

  async checkURLIsCorrect(queryParams = '') {
    await this.checkURL('search' + queryParams);
  }

  async checkSearchFieldIsPrePopulatedWith(indicator: string = '') {
    const fieldValue = await this.page
      .getByTestId(this.indicatorField)
      .inputValue();
    if (indicator) {
      expect(fieldValue).toEqual(indicator);
    } else expect(fieldValue).toBe('');
  }

  async clearSearchIndicatorField() {
    await this.page.getByTestId(this.indicatorField).clear();
  }

  async checkSummaryValidation(expectedValidationMessage: string) {
    await expect(this.page.getByTestId(this.validationSummary)).toHaveText(
      expectedValidationMessage
    );
  }
}
