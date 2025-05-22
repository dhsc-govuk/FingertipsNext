import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import {
  AreaMode,
  SearchMode,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers';

export default class AreaFilter extends BasePage {
  readonly areaFilterContainer = 'area-filter-container';
  readonly suggestedAreasPanel = 'area-suggestion-panel';
  readonly areaSearchField = 'area-search-input-field';
  readonly areaTypeSelector = 'area-type-selector-container';
  readonly groupTypeSelector = 'group-type-selector-container';
  readonly groupSelector = 'group-selector-container';
  readonly selectedAreasContainer = 'selected-areas-panel';
  readonly selectedIndicatorContainer = 'selected-indicators-panel';
  readonly selectAreasContainer = 'select-areas-filter-panel';
  readonly pillContainer = 'pill-container';
  readonly filterName = 'filter-name';
  readonly removeIcon = 'x-icon';

  areaFilterPills() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.pillContainer);
  }

  async areaFilterPillsText() {
    const pillFilterNames = await this.areaFilterPills()
      .getByTestId(this.filterName)
      .all();

    return Promise.all(pillFilterNames.map(async (l) => await l.textContent()));
  }

  indicatorPills() {
    return this.page
      .getByTestId(this.selectedIndicatorContainer)
      .getByTestId(this.pillContainer)
      .getByTestId(this.filterName)
      .all();
  }

  async checkSelectedIndicatorPillsText(
    expectedPillText: SimpleIndicatorDocument[]
  ) {
    const pillElements = await this.indicatorPills();
    expect(pillElements.length).toBe(expectedPillText.length);

    const pillTexts = await Promise.all(
      pillElements.map((pill) => pill.textContent())
    );

    const cleanedPillTexts = pillTexts.map((text) =>
      text!.replace(/View background information$/, '').trim()
    );

    for (const pillText of expectedPillText) {
      expect(cleanedPillTexts).toContain(pillText.indicatorName);
    }
  }

  async closeAreaFilterPill(index: number) {
    await this.page.waitForLoadState();

    const pills = await this.areaFilterPills()
      .getByTestId(this.removeIcon)
      .all();

    await this.clickAndAwaitLoadingComplete(pills[index]);

    await this.page.waitForLoadState();
  }

  areaFilterCombobox() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.areaTypeSelector)
      .locator('select');
  }

  areaFilterOptions() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.areaTypeSelector)
      .getByRole('option');
  }

  async areaFilterOptionsText() {
    const options = await this.areaFilterOptions().all();

    return Promise.all(options.map((l) => l.textContent()));
  }

  async assertFiltersDisabled() {
    const areaType = this.page.getByTestId(this.areaTypeSelector);
    const groupType = this.page.getByTestId(this.groupTypeSelector);
    const group = this.page.getByTestId(this.groupSelector);

    expect(areaType).toBeDisabled();
    expect(groupType).toBeDisabled();
    expect(group).toBeDisabled();
  }

  async assertGroupTypeFilterContainsOnly(contain: string) {
    const groupType = this.page.getByTestId(this.groupTypeSelector);

    const groupTypeOptions = await groupType
      .locator('option')
      .allTextContents();
    expect(String(groupTypeOptions)).toContain(contain);
  }

  async assertGroupFilterContainsOnly(contain: string) {
    const group = this.page.getByTestId(this.groupSelector);

    const groupOptions = await group.locator('option').allTextContents();
    expect(String(groupOptions)).toContain(contain);
  }

  async selectAreaTypeAndAssertURLUpdated(areaType: string) {
    await this.selectOptionAndAwaitLoadingComplete(
      this.page.getByTestId(this.areaTypeSelector),
      areaType
    );

    await this.waitForURLToContain(areaType);
  }

  async selectGroupTypeAndAssertURLUpdated(groupType: string) {
    await this.selectOptionAndAwaitLoadingComplete(
      this.page.getByTestId(this.groupTypeSelector),
      groupType
    );

    await this.waitForURLToContain(groupType);
  }

  async selectGroupAndAssertURLUpdated(group: string) {
    await this.selectOptionAndAwaitLoadingComplete(
      this.page.getByTestId(this.groupSelector),
      group
    );

    await this.waitForURLToContain(SearchParams.GroupSelected);
  }

  async selectAreaAndAssertURLUpdated(areaName: string, areaCode: string) {
    await this.checkAndAwaitLoadingComplete(
      this.page.getByRole('checkbox', { name: areaName })
    );

    await this.waitForURLToContain(areaCode);
  }

  /**
   * Selects the required area filters based on area mode if the search mode is ONLY_SUBJECT
   *
   * @param areaMode - area mode from the Enum AreaMode - used to decide which area filters to select
   * @param searchTerm - search term to be used in the URL check
   */
  async selectAreasFiltersIfRequired(
    searchMode: SearchMode,
    areaMode: AreaMode,
    searchTerm: string,
    areaTypeFilter: string
  ) {
    // only do the following for SearchMode.ONLY_SUBJECT as SearchMode.ONLY_AREA/BOTH_SUBJECT_AND_AREA already have area filters selected
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.waitForURLToContain(searchTerm);

      await this.selectAreaTypeAndAssertURLUpdated(areaTypeFilter);

      // Select appropriate number of checkboxes based on area mode
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');
      const checkboxCountMap = {
        [AreaMode.ONE_AREA]: 1,
        [AreaMode.TWO_AREAS]: 2,
        [AreaMode.THREE_PLUS_AREAS]: 3,
        [AreaMode.ALL_AREAS_IN_A_GROUP]: (await areaCheckboxList.count()) - 1, // as first checkbox is 'All'
        [AreaMode.ENGLAND_AREA]: 0, // for england we do not want to select any checkboxes
      };
      const checkboxCount = checkboxCountMap[areaMode];
      for (let i = 0; i < checkboxCount; i++) {
        await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(i + 1)); // as first checkbox is 'All'
        await this.page.waitForLoadState();
        if (i === 0 && areaMode !== AreaMode.ENGLAND_AREA) {
          await this.waitForURLToContain(areaTypeFilter);
        }
      }
      await expect(
        this.page.getByTestId(this.areaFilterContainer)
      ).toContainText(`Selected areas (${String(checkboxCount)})`);

      // England area mode
      if (AreaMode.ENGLAND_AREA === areaMode) {
        await this.selectAreaTypeAndAssertURLUpdated('england');
        await this.waitForURLToContain(SearchParams.AreaTypeSelected);

        await this.selectGroupTypeAndAssertURLUpdated('england');
        await this.waitForURLToContain(SearchParams.GroupTypeSelected);

        await this.selectAreaAndAssertURLUpdated('england', 'england');
        await this.waitForURLToContain(SearchParams.AreasSelected);

        await this.waitForURLToContain('england');
      }
    } else if (
      searchMode === SearchMode.ONLY_AREA &&
      areaMode === AreaMode.THREE_PLUS_AREAS
    ) {
      // Need to select an additional 2 checkboxes for this scenario, as one is already selected
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');
      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(1)); // as first checkbox is 'All'
      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(2)); // as first checkbox is 'All'

      await expect(
        this.page.getByTestId(this.areaFilterContainer)
      ).toContainText('Selected areas (3)');
    }
  }
}
