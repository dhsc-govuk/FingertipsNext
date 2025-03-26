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
      await this.fillAndWait(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );
    }
    //   cannot enable only area until DHSCFT-458 is actioned
    // if (searchMode === SearchMode.ONLY_AREA) {
    //   await this.page.getByTestId(this.areaSearchField).fill(areaSearchTerm!);
    // }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await this.fillAndWait(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );

      await this.fillAndWait(
        this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
        areaSearchTerm!
      );

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.clickAndWait(this.page.getByText(areaSearchTerm!));

      await expect(this.areaFilterPills()).toContainText(areaSearchTerm!, {
        ignoreCase: true,
      });
    }
  }

  async clickSearchButton() {
    await this.clickAndWait(this.page.getByTestId(this.searchButton));
  }

  async navigateToHomePage(queryString?: string) {
    if (queryString) {
      await this.navigateTo(`/${queryString}`);
    } else {
      await this.navigateTo('/');
    }
  }

  async checkOnHomePage() {
    await expect(
      this.page.getByRole('heading', { name: 'Access public health data' })
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

    await this.clickAndWait(pills[index]);
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
    await this.clearAndWait(this.page.getByTestId(this.subjectSearchField));
  }

  async checkSummaryValidation(expectedValidationMessage: string) {
    await expect(this.page.getByTestId(this.validationSummary)).toHaveText(
      expectedValidationMessage
    );
  }
}
