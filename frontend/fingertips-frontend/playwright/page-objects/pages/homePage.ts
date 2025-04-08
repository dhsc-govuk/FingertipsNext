import { AreaMode, SearchMode } from '@/playwright/testHelpers';
import AreaFilter from '../components/areaFilter';
import { expect } from '../pageFactory';

export default class HomePage extends AreaFilter {
  readonly subjectSearchField = 'indicator-search-form-input';
  readonly searchButton = 'search-form-button-submit';
  readonly validationSummary = 'search-form-error-summary';

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

      await expect(this.page.getByTestId('pill-container')).toContainText(
        areaSearchTerm!,
        {
          ignoreCase: true,
        }
      );
    }
  }

  async searchForIndicatorsAndAreas(
    searchMode: SearchMode,
    areaMode: AreaMode,
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

      await this.page
        .getByTestId(this.suggestedAreasPanel)
        .getByRole('listitem')
        .first()
        .click();

      await expect(this.areaFilterPills()).toBeVisible();
    }
    if (
      areaMode === AreaMode.TWO_AREAS ||
      areaMode === AreaMode.TWO_PLUS_AREAS
    ) {
      await this.page.getByText('Filter by area').click();

      const areaCheckboxList = this.page
        .getByTestId('select-areas-filter-panel')
        .getByRole('checkbox');

      const checkboxCountMap = {
        [AreaMode.TWO_AREAS]: 1, // as we have already clicked one in the suggested results above
        [AreaMode.TWO_PLUS_AREAS]: (await areaCheckboxList.count()) - 2,
      };
      const checkboxCount = checkboxCountMap[areaMode];
      for (let i = 0; i < checkboxCount; i++) {
        await areaCheckboxList.nth(i + 1).check(); // as first checkbox is 'All'
        await this.page.waitForLoadState();
      }
      await expect(this.page.getByTestId('search-form')).toContainText(
        `Selected areas (${String(checkboxCount)})`
      );

      await this.page.waitForLoadState();
      await this.page.waitForTimeout(500);
    }
  }

  async clickSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.searchButton)
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
      this.page.getByRole('heading', { name: 'Access public health data' })
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
}
