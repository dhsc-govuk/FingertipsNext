import { SearchParams } from '@/lib/searchStateManager';
import { expect } from '../pageFactory';
import {
  AreaMode,
  IndicatorInfo,
  SearchMode,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers';
import AreaFilter from '../components/areaFilter';
import { RawIndicatorDocument } from '@/lib/search/searchTypes';
import {
  AreaTypeKeys,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';

export default class ResultsPage extends AreaFilter {
  readonly resultsText = 'Search results';
  readonly backLink = 'search-results-back-link';
  readonly searchResult = 'search-result';
  readonly indicatorCheckboxPrefix = 'search-results-indicator';
  readonly viewChartsButton = `search-results-button-submit`;
  readonly indicatorSearchErrorText =
    'Please enter an indicator ID or select at least one area';
  readonly indicatorSearchBox = `indicator-search-form-input`;
  readonly indicatorSearchError = `indicator-search-form-error`;
  readonly indicatorSearchButton = `indicator-search-form-submit`;
  readonly indicatorCheckboxContainer = 'indicator-selection-form';
  readonly selectAllIndicatorsCheckbox = 'select-all-checkbox';
  readonly areaFilterContainer = 'area-filter-container';
  readonly areaTypeSelector = 'area-type-selector-container';
  readonly groupTypeSelector = 'group-type-selector-container';
  readonly selectedAreasContainer = 'selected-areas-panel';
  readonly selectAreasContainer = 'select-areas-filter-panel';
  readonly pillContainer = 'pill-container';
  readonly filterName = 'filter-name';
  readonly removeIcon = 'x-icon';
  readonly viewBackgroundInfoLink = 'view-background-info-link';

  async navigateToResults(
    searchIndicator: string,
    selectedAreaCodes: string[],
    selectedAreaType?: AreaTypeKeys
  ) {
    const asQuery = selectedAreaCodes.reduce(
      (accumulator, currentValue) =>
        accumulator + `&${SearchParams.AreasSelected}=${currentValue}`,
      ''
    );

    const determineAreaTypeSelected = selectedAreaType ?? englandAreaType.key;

    await this.page.goto(
      `results?${SearchParams.SearchedIndicator}=${searchIndicator}&${SearchParams.AreaTypeSelected}=${determineAreaTypeSelected}${asQuery}`
    );
  }

  async checkSearchResultsTitle(searchTerm: string) {
    await expect(
      this.page.getByText(this.resultsText + ` for ${searchTerm}`)
    ).toBeVisible();
  }

  async checkSearchResultsTitleBasedOnSearchMode(
    searchMode: SearchMode,
    searchTerm: string
  ) {
    const heading = this.page.getByRole('heading', { level: 1 });
    if (searchMode === SearchMode.ONLY_SUBJECT) {
      await expect(heading).toContainText(
        this.resultsText + ` for ${searchTerm}`
      );
    }
    if (searchMode === SearchMode.BOTH_SUBJECT_AND_AREA) {
      await expect(heading).toContainText(
        this.resultsText + ` for ${searchTerm}`
      );
    }
    if (searchMode === SearchMode.ONLY_AREA) {
      await expect(heading).toContainText(this.resultsText);
    }
  }

  async checkRecentTrends(
    areaMode: AreaMode,
    expectedIndicatorsToSelect: IndicatorInfo[],
    checkTrends: boolean
  ) {
    const trendsShouldBeVisible =
      areaMode === AreaMode.ONE_AREA ||
      areaMode === AreaMode.ALL_AREAS_IN_A_GROUP ||
      areaMode === AreaMode.ENGLAND_AREA;

    await expect(
      this.page.getByText('Recent trend for selected area')
    ).toBeVisible({ visible: trendsShouldBeVisible });

    // currently, the trend text is only visible on the results page in the deployed CD environment so checkTrends will be false in local and CI environments
    if (trendsShouldBeVisible && checkTrends) {
      for (const expectedIndicatorToSelect of expectedIndicatorsToSelect) {
        const searchResultItem = this.page.getByTestId('search-result').filter({
          has: this.page.getByTestId(
            `${this.indicatorCheckboxPrefix}-${expectedIndicatorToSelect.indicatorID}`
          ),
        });

        // Within that item, find the trend text
        const trendText = searchResultItem
          .getByTestId('trend-tag-component')
          .allInnerTexts();

        // Assert the trend matches expected
        expect(await trendText).toContain(
          expectedIndicatorToSelect.knownTrend!
        );
      }
    }
  }

  async clickBackLink() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }

  /**
   * Checks that the displayed indicators are correct based on what was searched for
   * @param allValidIndicators - a list of all valid indicators for the searched for criteria
   */
  async checkDisplayedIndicators(
    allValidIndicators: SimpleIndicatorDocument[],
    searchMode: SearchMode
  ) {
    // wait for indicator checkboxes to be visible
    expect(
      await this.page
        .getByTestId(this.indicatorCheckboxContainer)
        .getByRole('checkbox')
        .count()
    ).toBeGreaterThan(1);

    if (searchMode != SearchMode.ONLY_AREA) {
      // get a list of all the displayed indicator checkboxes
      const displayedIndicatorCheckboxList = await this.page
        .getByTestId(this.indicatorCheckboxContainer)
        .getByRole('list')
        .getByRole('checkbox')
        .all();

      // check that the displayed indicator IDs are valid for the searched for criteria
      for (const checkbox of displayedIndicatorCheckboxList) {
        const indicatorDataTestID = await checkbox.getAttribute('value');
        const stringifiedAllValidIndicators =
          JSON.stringify(allValidIndicators);
        if (
          !stringifiedAllValidIndicators.includes(
            `"indicatorID":${indicatorDataTestID}`
          )
        ) {
          throw new Error(
            `The indicator ID: ${indicatorDataTestID} displayed is not valid for the searched for criteria.`
          );
        }
      }
    }
  }

  /**
   * Selecting the passed in indicators checkboxes
   * @param expectedIndicatorsToSelect - a list of all indicatorIds to be selected
   */
  async selectIndicatorCheckboxes(expectedIndicatorsToSelect: IndicatorInfo[]) {
    for (const indicatorID of expectedIndicatorsToSelect) {
      const indicatorIDString = String(indicatorID.indicatorID);
      const checkbox = this.page.getByTestId(
        `${this.indicatorCheckboxPrefix}-${indicatorIDString}`
      );

      await expect(checkbox).toBeAttached();
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeEnabled();
      await expect(checkbox).toBeEditable();
      await expect(checkbox).toBeChecked({ checked: false });

      await this.checkAndAwaitLoadingComplete(checkbox);

      await expect(checkbox).toBeChecked();
      await this.waitForURLToContain(indicatorIDString);
    }
  }

  async checkIndicatorCheckboxChecked(indicatorId: string) {
    await this.page
      .getByTestId(`${this.indicatorCheckboxPrefix}-${indicatorId}`)
      .isChecked();
  }

  async clickViewChartsButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.viewChartsButton)
    );
  }

  async clearIndicatorSearchBox() {
    await this.clearAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchBox)
    );
  }

  async clickIndicatorSearchButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchButton)
    );
  }

  async checkForIndicatorSearchError() {
    await expect(
      this.page.getByText(this.indicatorSearchErrorText)
    ).toBeVisible();
  }

  async fillIndicatorSearch(text: string) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByTestId(this.indicatorSearchBox),
      text
    );
  }

  async selectIndicatorSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.checkAndAwaitLoadingComplete(selectAllCheckbox);
    await expect(selectAllCheckbox).toBeChecked();
  }

  async deselectIndicatorSelectAllCheckbox() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.uncheckAndAwaitLoadingComplete(selectAllCheckbox);
    await expect(selectAllCheckbox).not.toBeChecked();
  }

  async selectEveryIndicator(allIndicatorIDs: string[]) {
    await this.page.waitForLoadState();
    for (const indicatorId of allIndicatorIDs) {
      const checkbox = this.page.getByTestId(
        `${this.indicatorCheckboxPrefix}-${indicatorId}`
      );
      const indicatorChecked = await checkbox.isChecked();
      if (!indicatorChecked) {
        await this.selectIndicator(indicatorId);
      }
    }
  }

  async verifyAllIndicatorsSelected() {
    const indicatorCheckboxes = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();
    await this.page.waitForLoadState();
    for (const checkbox of indicatorCheckboxes) {
      await expect(checkbox).toBeChecked();
    }
  }

  async verifyNoIndicatorsSelected() {
    const indicatorCheckboxes = await this.page
      .getByTestId(this.indicatorCheckboxContainer)
      .getByRole('checkbox')
      .all();
    await this.page.waitForLoadState();
    for (const checkbox of indicatorCheckboxes) {
      await expect(checkbox).not.toBeChecked();
    }
  }

  async verifySelectAllCheckboxTicked() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.page.waitForLoadState();
    await expect(selectAllCheckbox).toBeChecked();
  }

  async verifySelectAllCheckboxUnticked() {
    const selectAllCheckbox = this.page.getByTestId(
      this.selectAllIndicatorsCheckbox
    );
    await this.page.waitForLoadState();
    await expect(selectAllCheckbox).not.toBeChecked();
  }

  async selectIndicator(indicatorId: string) {
    const indicatorCheckbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorId}`
    );
    await this.checkAndAwaitLoadingComplete(indicatorCheckbox);
    await expect(indicatorCheckbox).toBeChecked();
  }

  async deselectIndicator(indicatorId: string) {
    const indicatorCheckbox = this.page.getByTestId(
      `${this.indicatorCheckboxPrefix}-${indicatorId}`
    );
    await this.uncheckAndAwaitLoadingComplete(indicatorCheckbox);
    await expect(indicatorCheckbox).not.toBeChecked();
  }

  async verifyUrlContainsAllIndicators(indicatorIds: string[]) {
    for (const indicatorId of indicatorIds) {
      await expect(this.page).toHaveURL(new RegExp(`&is=${indicatorId}`));
    }
  }

  async verifyUrlExcludesAllIndicators() {
    await expect(this.page).not.toHaveURL(/&is=/);
  }

  async verifyUrlUpdatedAfterDeselection(deselectedIndicator: string) {
    await expect(this.page).not.toHaveURL(
      new RegExp(`&is=${deselectedIndicator}`)
    );
  }

  async clickViewBackgroundInformationLinkForIndicator(
    indicator: RawIndicatorDocument
  ) {
    if (!indicator) {
      throw new Error(`Indicator not found`);
    }

    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(this.pillContainer)
        .getByText(indicator.indicatorName)
        .getByRole('link', { name: 'View background information' })
    );
  }

  async checkNumberOfResults(expectedResultCount: number) {
    expect(this.page.getByTestId(this.searchResult)).toHaveCount(
      expectedResultCount
    );
  }

  async checkFirstResultHasName(expectedResultName: string) {
    expect(
      await this.page.getByTestId(this.searchResult).count()
    ).toBeGreaterThan(0);
    expect(
      this.page.getByTestId(this.searchResult).first().getByRole('heading')
    ).toHaveText(expectedResultName);
  }

  async checkAnyResultNameContainsText(expectedResultName: string) {
    expect(
      await this.page.getByTestId(this.searchResult).count()
    ).toBeGreaterThan(0);
    expect(
      this.page
        .getByTestId(this.searchResult)
        .getByRole('heading')
        .getByText(expectedResultName)
    ).toBeVisible();
  }
}
