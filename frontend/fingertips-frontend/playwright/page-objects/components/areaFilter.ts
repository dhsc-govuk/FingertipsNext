import BasePage from '../basePage';
import { expect } from '../pageFactory';
import { AreaMode, SearchMode } from '@/playwright/testHelpers';

export default class AreaFilter extends BasePage {
  readonly areaFilterContainer = 'area-filter-container';
  readonly suggestedAreasPanel = 'area-suggestion-panel';
  readonly areaSearchField = 'area-search-input-field';
  readonly areaTypeSelector = 'area-type-selector-container';
  readonly groupTypeSelector = 'group-type-selector-container';
  readonly selectedAreasContainer = 'selected-areas-panel';
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
    areaTypeFilter: string = 'regions'
  ) {
    // only do the following for SearchMode.ONLY_SUBJECT as SearchMode.ONLY_AREA/BOTH_SUBJECT_AND_AREA already have area filters selected
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await this.waitForURLToContain(searchTerm);

      await this.page
        .getByTestId(this.areaTypeSelector)
        .selectOption(areaTypeFilter);

      await this.waitForURLToContain(areaTypeFilter);

      // For group type filter currently defaults to using England due to picking regions for area type above - this will be refactored in DHSCFT-416

      // Select appropriate number of checkboxes based on area mode
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');
      const checkboxCountMap = {
        [AreaMode.ONE_AREA]: 1,
        [AreaMode.TWO_PLUS_AREAS]: 2,
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
        await this.page
          .getByTestId(this.areaTypeSelector)
          .selectOption('England');
        await this.page
          .getByTestId(this.groupTypeSelector)
          .selectOption('England');
        await this.waitForURLToContain('England');
      }

      await this.waitForURLToContain(searchTerm);
    } else if (
      searchMode === SearchMode.ONLY_AREA &&
      areaMode === AreaMode.TWO_PLUS_AREAS
    ) {
      // Need to select an additional checkbox for this scenario, as one is already selected
      const areaCheckboxList = this.page
        .getByTestId(this.areaFilterContainer)
        .getByRole('checkbox');
      await this.checkAndAwaitLoadingComplete(areaCheckboxList.nth(1)); // as first checkbox is 'All'

      await this.page.waitForLoadState();

      await expect(
        this.page.getByTestId(this.areaFilterContainer)
      ).toContainText('Selected areas (2)');
    }
  }
}
