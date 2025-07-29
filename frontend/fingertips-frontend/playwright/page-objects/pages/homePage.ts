import { SearchMode } from '@/playwright/testHelpers/genericTestUtilities';
import AreaFilter from '../components/areaFilter';
import { expect } from '../pageFactory';
import { siteTitle } from '@/lib/constants';

export default class HomePage extends AreaFilter {
  readonly subjectSearchField = 'indicator-search-form-input';
  readonly searchButton = 'search-form-button-submit';
  readonly validationSummary = 'search-form-error-summary';
  readonly indicatorSearchButton = 'indicator-search-form-submit';
  readonly pillContainer = 'pill-container';

  async searchForIndicators(
    searchMode: SearchMode,
    subjectSearchTerm?: string,
    areaSearchTerm?: string
  ) {
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );
    }
    if (searchMode === SearchMode.ONLY_AREA) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
        areaSearchTerm!
      );

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.clickAndAwaitLoadingComplete(
        this.page
          .getByTestId(this.suggestedAreasPanel)
          .getByText(areaSearchTerm!)
      );
    }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.subjectSearchField),
        subjectSearchTerm!
      );

      await this.fillAndAwaitLoadingComplete(
        this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
        areaSearchTerm!
      );

      await expect(
        this.page.getByTestId(this.suggestedAreasPanel)
      ).toContainText(areaSearchTerm!, { ignoreCase: true });

      await this.clickAndAwaitLoadingComplete(
        this.page.getByText(areaSearchTerm!)
      );

      await expect(this.page.getByTestId(this.pillContainer)).toContainText(
        areaSearchTerm!,
        {
          ignoreCase: true,
        }
      );
    }
  }

  async clickHomePageFormSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.searchButton)
    );
  }

  async clickHomePageIndicatorSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchButton)
    );
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
      this.page.getByRole('heading', { name: siteTitle }).first()
    ).toBeVisible();
  }

  async closeAreaFilterPill(index: number) {
    await this.page.waitForLoadState();

    const pills = await this.page.getByTestId(this.removeIcon).all();

    await this.clickAndAwaitLoadingComplete(pills[index]);
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
    await this.clearAndAwaitLoadingComplete(
      this.page.getByTestId(this.subjectSearchField)
    );
  }

  async checkSummaryValidation(expectedValidationMessage: string) {
    await expect(this.page.getByTestId(this.validationSummary)).toHaveText(
      expectedValidationMessage
    );
  }

  async searchForArea(areaSearchTerm: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByTestId(this.areaSearchField).getByRole('textbox'),
      areaSearchTerm
    );
  }

  async checkAreaSuggestionPanelContainsAreas(expectedAreas: string[]) {
    await expect(
      this.page.getByTestId(this.suggestedAreasPanel).getByRole('listitem')
    ).toHaveCount(expectedAreas.length);
    expectedAreas.forEach(async (area, index) => {
      await expect(
        this.page
          .getByTestId(this.suggestedAreasPanel)
          .getByRole('listitem')
          .nth(index)
      ).toContainText(area);
    });
  }

  async clickSubjectSearchField() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.subjectSearchField)
    );
  }
}
