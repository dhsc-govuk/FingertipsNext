import { SearchMode } from '@/playwright/testHelpers';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class HomePage extends BasePage {
  readonly subjectSearchField = 'indicator-search-form-input';
  readonly areaSearchField = 'area-search-input-field';
  readonly suggestedAreasPanel = 'area-suggestion-panel';
  readonly searchButton = 'search-form-button-submit';
  readonly validationSummary = 'search-form-error-summary';
  readonly areaFilterContainer = 'selected-areas-panel';
  readonly pillContainer = 'pill-container';
  readonly removeIcon = 'x-icon';

  async searchForIndicators(
    searchMode: SearchMode,
    subjectSearchTerm?: string,
    areaSearchTerm?: string
  ) {
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.page
        .getByTestId(this.subjectSearchField)
        .fill(subjectSearchTerm!);
    }
    //   cannot enable only area until DHSCFT-458 is actioned
    // if (searchMode === SearchMode.ONLY_AREA) {
    //   await this.page.getByTestId(this.areaSearchField).fill(areaSearchTerm!);
    // }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await this.page
        .getByTestId(this.subjectSearchField)
        .fill(subjectSearchTerm!);

      await this.page
        .getByTestId(this.areaSearchField)
        .getByRole('textbox')
        .fill(areaSearchTerm!);

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.page.getByText(areaSearchTerm!).click();

      await expect(this.areaFilterPills()).toContainText(areaSearchTerm!, {
        ignoreCase: true,
      });
    }
  }

  async clickSearchButton() {
    await this.page.getByTestId(this.searchButton).click();
  }

  async navigateToHomePage() {
    await this.navigateTo('/');
  }

  async checkOnHomePage() {
    await expect(
      this.page.getByText('Access public health data')
    ).toBeVisible();
  }

  areaFilterPills() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.pillContainer);
  }

  async closeAreaFilterPill(index: number) {
    await this.page.waitForLoadState();

    const pills = await this.areaFilterPills()
      .getByTestId(this.removeIcon)
      .all();

    await pills[index].click();
  }

  async checkSearchFieldIsPrePopulatedWith(indicator: string = '') {
    const fieldValue = await this.page
      .getByTestId(this.subjectSearchField)
      .inputValue();
    if (indicator) {
      expect(fieldValue).toEqual(indicator);
    } else expect(fieldValue).toBe('');
  }

  async clearSearchIndicatorField() {
    await this.page.getByTestId(this.subjectSearchField).clear();
  }

  async checkSummaryValidation(expectedValidationMessage: string) {
    await expect(this.page.getByTestId(this.validationSummary)).toHaveText(
      expectedValidationMessage
    );
  }
}
