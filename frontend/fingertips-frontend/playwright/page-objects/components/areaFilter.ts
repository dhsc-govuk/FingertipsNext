import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import {
  AreaFilters,
  AreaMode,
  capitaliseFirstCharacter,
  SearchMode,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers/genericTestUtilities';

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
  readonly hideAreaFilterPane = 'area-filter-pane-hidefilters';
  readonly showAreaFilterPane = 'show-filter-cta';

  async areaFilterPills() {
    return this.page
      .getByTestId(this.areaFilterContainer)
      .getByTestId(this.pillContainer);
  }

  async areaFilterPillsText() {
    const pillFilterNames = await (await this.areaFilterPills())
      .getByTestId(this.filterName)
      .all();

    return Promise.all(pillFilterNames.map(async (l) => await l.textContent()));
  }

  async indicatorPills() {
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
      expect(cleanedPillTexts).toContain(pillText.indicatorName.trim());
    }
  }

  async closeAreaFilterPill(index: number) {
    await this.page.waitForLoadState();

    const pills = await (await this.areaFilterPills())
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

  async getSelectedAreaFilters(): Promise<AreaFilters> {
    const areaType = await this.getSelectedAreaType();
    const groupType = await this.getSelectedGroupType();
    const group = await this.getSelectedGroup();
    return {
      areaType,
      groupType,
      group,
    };
  }

  async getSelectedAreaType(): Promise<string> {
    const areaType = this.page.getByTestId(this.areaTypeSelector);
    const selectedOption = await areaType
      .locator('option:checked')
      .textContent();
    return selectedOption ? selectedOption.trim() : '';
  }

  async getSelectedGroupType(): Promise<string> {
    const areaType = this.page.getByTestId(this.groupTypeSelector);
    const selectedOption = await areaType
      .locator('option:checked')
      .textContent();
    return selectedOption ? selectedOption.trim() : '';
  }

  async getSelectedGroup(): Promise<string> {
    const areaType = this.page.getByTestId(this.groupSelector);
    const selectedOption = await areaType
      .locator('option:checked')
      .textContent();
    return selectedOption ? selectedOption.trim() : '';
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
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);

    await this.page
      .getByTestId(this.groupSelector)
      .selectOption({ label: capitaliseFirstCharacter(group) });

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
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
   * @param searchMode - search mode from the Enum SearchMode
   * @param areaMode - area mode from the Enum AreaMode - used to decide which area filters to select
   * @param searchTerm - search term to be used in the URL check
   * @param areaFiltersToSelect - area filters configuration object
   */
  async selectAreasFiltersIfRequired(
    searchMode: SearchMode,
    areaMode: AreaMode,
    searchTerm: string,
    areaFiltersToSelect: AreaFilters
  ): Promise<void> {
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      let trimmedSearchText = searchTerm.trim();

      // Check if searched for text is a space-separated list of numbers
      const spaceSeparatedPattern = /^\d+(\s+\d+)+$/;
      if (spaceSeparatedPattern.test(trimmedSearchText)) {
        // replace whitespace with +
        trimmedSearchText = trimmedSearchText.replaceAll(' ', '+');
      }
      await this.waitForURLToContain(trimmedSearchText);
      await this.selectAreaFilters(areaMode, areaFiltersToSelect);
      await this.selectAreaCheckboxes(areaMode, areaFiltersToSelect.areaType);
    } else if (
      (searchMode === SearchMode.ONLY_AREA ||
        searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) &&
      areaMode === AreaMode.THREE_PLUS_AREAS
    ) {
      // Need to select an additional 2 checkboxes for these scenarios, as one is already selected
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');

      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(1));
      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(2));

      await expect(
        this.page.getByTestId(this.areaFilterContainer)
      ).toContainText('Selected areas (3)');
    }
  }

  /**
   * Selects area type, group type, and group filters based on area mode
   */
  private async selectAreaFilters(
    areaMode: AreaMode,
    areaFiltersToSelect: AreaFilters
  ): Promise<void> {
    if (areaMode === AreaMode.ENGLAND_AREA) {
      // Handle England area mode with hardcoded 'england' values
      await this.selectAreaTypeAndAssertURLUpdated('england');
      await this.waitForURLToContain(SearchParams.AreaTypeSelected);

      await this.selectGroupTypeAndAssertURLUpdated('england');
      await this.waitForURLToContain(SearchParams.GroupTypeSelected);

      await this.selectAreaAndAssertURLUpdated('england', 'england');
      await this.waitForURLToContain(SearchParams.AreasSelected);
      await this.waitForURLToContain('england');
    } else {
      // Handle standard area filter selection
      await this.selectAreaTypeAndAssertURLUpdated(
        areaFiltersToSelect.areaType
      );
      await this.waitForURLToContain(SearchParams.AreaTypeSelected);

      await this.selectGroupTypeAndAssertURLUpdated(
        areaFiltersToSelect.groupType
      );
      await this.waitForURLToContain(SearchParams.GroupTypeSelected);

      if (areaFiltersToSelect.group) {
        await this.selectGroupAndAssertURLUpdated(areaFiltersToSelect.group);
        await this.waitForURLToContain(SearchParams.GroupSelected);
      }
    }
  }

  /**
   * Selects the appropriate number of area checkboxes based on area mode
   */
  private async selectAreaCheckboxes(
    areaMode: AreaMode,
    areaType: string
  ): Promise<void> {
    // England area mode doesn't require checkbox selection (handled in selectAreaFilters)
    if (areaMode === AreaMode.ENGLAND_AREA) {
      return;
    }

    const areaCheckboxList = this.page
      .getByTestId(this.areaFilterContainer)
      .getByRole('checkbox');

    // Determine number of checkboxes to select based on area mode
    const totalCheckboxes = await areaCheckboxList.count();
    const checkboxCountMap: Record<AreaMode, number> = {
      [AreaMode.ONE_AREA]: 1,
      [AreaMode.TWO_AREAS]: 2,
      [AreaMode.THREE_PLUS_AREAS]: 3,
      [AreaMode.ALL_AREAS_IN_A_GROUP]: totalCheckboxes - 1, // exclude 'All' checkbox
      [AreaMode.ENGLAND_AREA]: 0,
    };

    const checkboxCount = checkboxCountMap[areaMode];

    // Select the required number of checkboxes (skip index 0 which is 'All')
    for (let i = 0; i < checkboxCount; i++) {
      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(i + 1));
      await this.page.waitForLoadState();

      // Wait for URL to contain area type after first checkbox selection
      if (i === 0) {
        await this.waitForURLToContain(areaType);
      }
    }

    // Assert the correct number of areas are selected
    await expect(this.page.getByTestId(this.areaFilterContainer)).toContainText(
      `Selected areas (${checkboxCount})`
    );
  }

  async hideFiltersPane() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.hideAreaFilterPane)
    );
    await expect(this.page.getByTestId(this.showAreaFilterPane)).toHaveText(
      'Show filter'
    );
  }
}
