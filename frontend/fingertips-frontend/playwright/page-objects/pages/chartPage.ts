import {
  AreaFilters,
  AreaMode,
  getScenarioConfig,
  IndicatorMode,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers';
import { expect } from '../pageFactory';
import {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
  Locator,
} from '@playwright/test';
import AreaFilter from '../components/areaFilter';
import { SearchParams } from '@/lib/searchStateManager';

interface VisibleComponent {
  componentLocator: string;
  componentProps: Record<string, boolean>;
}

export default class ChartPage extends AreaFilter {
  readonly backLink = 'chart-page-back-link';

  // chart components
  static readonly lineChartComponent = 'standardLineChart-component';
  static readonly lineChartTableComponent = 'lineChartTable-component';
  static readonly populationPyramidComponent =
    'populationPyramidWithTable-component';
  static readonly populationPyramidTableComponent =
    'populationPyramidTable-component';
  static readonly inequalitiesBarChartTableComponent =
    'inequalitiesBarChartTable-component';
  static readonly inequalitiesLineChartTableComponent =
    'inequalitiesLineChartTable-component';
  static readonly inequalitiesBarChartComponent =
    'inequalitiesBarChart-component';
  static readonly inequalitiesLineChartComponent =
    'inequalitiesLineChart-component';
  static readonly thematicMapComponent = 'thematicMap-component';
  static readonly heatMapComponent = 'heatmapChart-component';
  static readonly barChartEmbeddedTableComponent =
    'barChartEmbeddedTable-component';
  static readonly spineChartTableComponent = 'spineChartTable-component';
  static readonly inequalitiesForSingleTimePeriodComponent =
    'inequalitiesForSingleTimePeriod-component';
  static readonly inequalitiesTrendComponent = 'inequalitiesTrend-component';
  static readonly timePeriodDropDownComponent = 'timePeriod-dropDown-component';
  static readonly inequalitiesTypesDropDownComponentBC =
    'inequalitiesTypes-dropDown-component-bc';
  static readonly inequalitiesTypesDropDownComponentLC =
    'inequalitiesTypes-dropDown-component-lc';
  static readonly basicTableComponent = 'basicTable-component';
  static readonly benchmarkDropDownComponent = `${SearchParams.BenchmarkAreaSelected}-dropDown-benchmark-component`;

  async checkOnChartPage() {
    await expect(
      this.page.getByText('View data for selected indicators and areas')
    ).toBeVisible();
  }

  async checkSpecificChartComponent(chartComponent: string) {
    await this.page.getByTestId(chartComponent).isVisible();
  }

  async clickBackLink() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }

  async waitAfterDropDownInteraction() {
    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
    await this.page.waitForTimeout(1000);
  }

  /**
   * This function tests a subset of indicator + area scenario combinations from
   * https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * The scenario combinations here were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios should be covered in lower level unit testing.
   */
  async checkChartVisibility(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >,
    selectedIndicators: SimpleIndicatorDocument[],
    selectedAreaFilters: AreaFilters
  ) {
    const testInfo = test.info();
    const testName = testInfo.title;
    const { visibleComponents, hiddenComponents } = getScenarioConfig(
      indicatorMode,
      areaMode
    );

    this.logScenarioInfo(
      indicatorMode,
      areaMode,
      visibleComponents,
      hiddenComponents
    );
    await this.hideFiltersPane();
    await this.verifyDataSourceIsDisplayed(indicatorMode, selectedIndicators);

    for (const visibleComponent of visibleComponents) {
      await this.handleComponentInteractions(
        visibleComponent,
        selectedIndicators,
        areaMode,
        selectedAreaFilters
      );
      await this.verifyComponentVisibleAndScreenshotMatch(
        visibleComponent,
        testName
      );
    }

    for (const hiddenComponent of hiddenComponents) {
      await this.verifyComponentNotVisible(hiddenComponent);
    }
  }

  // click the hide filters pane before asserting visibility and taking screenshots
  private async hideFiltersPane() {
    await this.clickAndWaitForLoadState(
      this.page.getByTestId('area-filter-pane-hidefilters')
    );
    await expect(this.page.getByTestId('show-filter-cta')).toHaveText(
      'Show filter'
    );
  }

  private logScenarioInfo(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    visibleComponents: {
      componentLocator: string;
      componentProps: Record<string, boolean>;
    }[],
    hiddenComponents: { componentLocator: string }[]
  ) {
    console.log(
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart components: ${visibleComponents
        .map(
          (c) =>
            `${c.componentLocator}(hasCI:${c.componentProps.hasConfidenceIntervals},isTab:${c.componentProps.isTabTable},hasTimePeriod:${c.componentProps.hasTimePeriodDropDown})`
        )
        .join(
          ', '
        )} are displayed and that chart components: ${hiddenComponents.map((c) => c.componentLocator).join(', ')} are not displayed.`
    );
  }

  private async handleComponentInteractions(
    component: {
      componentLocator: string;
      componentProps: Record<string, boolean>;
    },
    selectedIndicators: SimpleIndicatorDocument[],
    areaMode: AreaMode,
    selectedAreaFilters: AreaFilters
  ) {
    const { componentLocator, componentProps } = component;

    const interactions = [
      {
        condition: componentProps.isTabTable,
        action: () => this.selectTabForComponent(componentLocator),
      },
      {
        condition: componentProps.hasTimePeriodDropDown,
        action: () => this.selectLastTimePeriodOption(),
      },
      {
        condition: componentProps.hasTypeDropDown,
        action: () => this.selectLastTypeDropdownOption(componentLocator),
      },
      {
        condition: componentProps.hasDetailsExpander,
        action: () => this.expandDetailsSection(componentLocator),
      },
      {
        condition: componentProps.isWideComponent,
        action: () => this.scrollToMiddle(componentLocator),
      },
      {
        condition: componentProps.hasRecentTrend,
        action: () =>
          this.verifyTrendTagForComponent(
            component,
            areaMode,
            selectedIndicators
          ),
      },
      {
        condition: componentProps.showsBenchmarkComparisons,
        action: () =>
          this.verifyBenchmarkingForComponent(component, selectedAreaFilters),
      },
      {
        condition: componentProps.hasConfidenceIntervals,
        action: () => this.toggleConfidenceInterval(componentLocator),
      },
    ];

    for (const { condition, action } of interactions) {
      if (condition) {
        await action();
      }
    }
  }

  // clicks on the tab if the component is a table
  private async selectTabForComponent(componentLocator: string) {
    const tabTestId = `tabTitle-${componentLocator.replace('-component', '')}`;
    await this.clickAndAwaitLoadingComplete(this.page.getByTestId(tabTestId));
  }

  // selects last time period option in the dropdown
  private async selectLastTimePeriodOption() {
    const combobox = this.page
      .getByTestId(ChartPage.timePeriodDropDownComponent)
      .getByRole('combobox');

    const options = await this.getSelectOptions(combobox);
    const lastOption = options.at(-1)?.value;
    if (!lastOption) return;

    await combobox.selectOption({ value: lastOption });
    await this.waitAfterDropDownInteraction();
    await this.waitForURLToContain(lastOption);

    await expect(
      this.page.getByText(`persons for ${lastOption} time period`)
    ).toBeVisible();
    expect(await combobox.inputValue()).toBe(lastOption);
  }

  // selects last type option in the dropdown
  private async selectLastTypeDropdownOption(componentLocator: string) {
    const dropdownComponent =
      componentLocator === ChartPage.inequalitiesForSingleTimePeriodComponent
        ? ChartPage.inequalitiesTypesDropDownComponentBC
        : ChartPage.inequalitiesTypesDropDownComponentLC;

    const combobox = this.page
      .getByTestId(dropdownComponent)
      .getByRole('combobox');
    const options = await this.getSelectOptions(combobox);
    const lastOption = options.at(-1)?.value;
    if (!lastOption) return;

    await combobox.selectOption({ value: lastOption });
    await this.waitAfterDropDownInteraction();
    await this.waitForURLToContain(encodeURIComponent(lastOption));

    expect(await combobox.inputValue()).toBe(lastOption);
  }

  // checks the confidence interval checkbox
  private async toggleConfidenceInterval(componentLocator: string) {
    const mapping: Record<string, string> = {
      [ChartPage.inequalitiesForSingleTimePeriodComponent]:
        ChartPage.inequalitiesBarChartComponent,
      [ChartPage.inequalitiesBarChartComponent]:
        ChartPage.inequalitiesBarChartComponent,
      [ChartPage.barChartEmbeddedTableComponent]:
        ChartPage.barChartEmbeddedTableComponent,
      [ChartPage.inequalitiesLineChartComponent]:
        ChartPage.inequalitiesLineChartComponent,
      [ChartPage.inequalitiesTrendComponent]:
        ChartPage.inequalitiesLineChartComponent,
    };

    const ciComponent =
      mapping[componentLocator] || ChartPage.lineChartComponent;
    const testId = `confidence-interval-checkbox-${ciComponent.replace('-component', '')}`;

    await this.checkAndAwaitLoadingComplete(this.page.getByTestId(testId));
  }

  // clicks on 'Show population data' to show population pyramid component
  private async expandDetailsSection(componentLocator: string) {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(componentLocator).getByText('Show population data')
    );
  }

  // scrolls to the middle of the component for better screenshot
  private async scrollToMiddle(componentLocator: string) {
    await this.page.getByTestId(componentLocator).evaluate((element) => {
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    });
  }

  // verifies data source is displayed for one indicator
  private async verifyDataSourceIsDisplayed(
    indicatorMode: IndicatorMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ) {
    const dataSourceLocator = this.page.getByTestId('data-source');

    if (indicatorMode === IndicatorMode.ONE_INDICATOR) {
      const allDataSources = await dataSourceLocator.allTextContents();
      allDataSources.forEach((dataSource) => {
        expect(dataSource).toBe(
          `Data source: ${selectedIndicators[0].dataSource}`
        );
      });
    } else {
      await expect(dataSourceLocator).not.toBeAttached();
    }
  }

  private async verifyTrendTagForComponent(
    visibleComponent: VisibleComponent,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ): Promise<void> {
    if (!visibleComponent.componentProps.hasRecentTrend) {
      return;
    }

    const componentLocator = visibleComponent.componentLocator;
    const trendTagLocator = this.page
      .getByTestId(componentLocator)
      .getByTestId('trendTag-container');

    if (
      componentLocator === 'spineChartTable-component' &&
      areaMode !== AreaMode.ONE_AREA
    ) {
      // Verify no trend container is present for spine chart in non-ONE_AREA modes
      await expect(trendTagLocator).not.toBeAttached();
    } else {
      // For all other chart components, or spine chart in ONE_AREA mode - check the trend
      const trendsText = await trendTagLocator.allTextContents();

      for (const selectedIndicator of selectedIndicators) {
        if (!selectedIndicator.knownTrend) {
          throw new Error(
            `Selected indicator ${selectedIndicator.indicatorID} should have a known trend stored in core_journey_config.ts.`
          );
        }

        expect(trendsText).toContain(selectedIndicator.knownTrend);
      }
    }
  }

  private async verifyBenchmarkingForComponent(
    component: VisibleComponent,
    selectedAreaFilters: AreaFilters
  ) {
    const dropdownComponent = ChartPage.benchmarkDropDownComponent;
    const combobox = this.page
      .getByTestId(dropdownComponent)
      .getByRole('combobox');
    const options = await this.getSelectOptions(combobox);
    const upperCaseFirstCharSelectedGroup =
      selectedAreaFilters.group.charAt(0).toUpperCase() +
      selectedAreaFilters.group.slice(1);

    // check benchmark dropdown defaults to England as first option in all cases
    expect(options[0].text).toBe('England');

    // Determine expected values based on area filters
    const isEnglandGroup = selectedAreaFilters.group === 'england';
    const isEnglandAreaType = selectedAreaFilters.areaType === 'england';
    const isThematicMap =
      component.componentLocator === ChartPage.thematicMapComponent;

    // Check benchmark dropdown options length based on group selection
    const expectedOptionsLength = isEnglandGroup ? 1 : 2;
    expect(options.length).toBe(expectedOptionsLength);

    // set benchmark dropdown to the group selected in the area filter
    await combobox.selectOption({
      label: upperCaseFirstCharSelectedGroup,
    });
    await this.waitAfterDropDownInteraction();

    const expectedSelectedOption = isEnglandGroup
      ? 'England'
      : upperCaseFirstCharSelectedGroup;
    const shouldShowBenchmarkText = !(isEnglandGroup && isEnglandAreaType);
    const benchmarkPrefix = isThematicMap ? 'Compared to' : 'Benchmark:';
    const expectedBenchmarkTitleText = `${benchmarkPrefix} ${expectedSelectedOption}`;
    const expectedBenchmarkTooltipText = `Benchmark: ${expectedSelectedOption}`;

    // Verify the correct option is selected in the benchmark dropdown
    expect(await combobox.locator('option:checked').textContent()).toBe(
      expectedSelectedOption
    );

    // Verify benchmark text visibility in the chart component title
    if (shouldShowBenchmarkText) {
      await expect(
        this.page
          .getByTestId(component.componentLocator)
          .getByText(expectedBenchmarkTitleText)
      ).toBeVisible();
      // check hover if current chart component has tooltip hovers
      if (component.componentProps.hasTooltipHovers) {
        await this.checkHovers(component, expectedBenchmarkTooltipText);
      }
    } else {
      await expect(
        this.page
          .getByTestId(component.componentLocator)
          .getByText('Benchmark: England')
      ).not.toBeVisible();
      // check hover doesnt contain 'Benchmark:' if current chart component has tooltip hovers
      if (component.componentProps.hasTooltipHovers) {
        await this.checkHovers(component);
      }
    }
  }

  private async checkHovers(
    component: VisibleComponent,
    expectedBenchmarkText?: string
  ) {
    // get correct chart point based on component locator
    const tooltipPointToAssert =
      (component.componentLocator ===
        ChartPage.barChartEmbeddedTableComponent ||
        component.componentLocator === ChartPage.heatMapComponent) &&
      expectedBenchmarkText !== 'Benchmark: England'
        ? 1
        : 0;

    // Verify benchmark text visibility in the chart hover content
    const chartPoint = this.page
      .getByTestId(component.componentLocator)
      .locator('.highcharts-point')
      .nth(tooltipPointToAssert);

    // doing the following as we need to disable the actionability checks for hover and click for thematic map
    chartPoint.focus();
    chartPoint.scrollIntoViewIfNeeded();
    await expect(chartPoint).toBeVisible();
    await expect(chartPoint).toBeAttached();
    await expect(chartPoint).toBeEnabled();

    await chartPoint.hover({ force: true });
    await chartPoint.click({ force: true });
    await this.page.waitForTimeout(250); // Small wait for tooltip to appear

    const hoverContent = await this.page
      .locator('div.highcharts-tooltip')
      .textContent();

    if (expectedBenchmarkText) {
      expect(hoverContent).toContain(expectedBenchmarkText);
    } else {
      expect(hoverContent).not.toContain('Benchmark:');
    }
  }

  // verifies component is visible and baseline screenshot matches
  private async verifyComponentVisibleAndScreenshotMatch(
    component: { componentLocator: string },
    testName: string
  ) {
    const { componentLocator } = component;

    await expect(this.page.getByTestId(componentLocator)).toBeVisible({
      visible: true,
    });

    await this.page.waitForLoadState();
    await expect(this.page.getByText('Loading')).toHaveCount(0);
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForFunction('window.scrollY === 0');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByTestId(componentLocator), {
      message: `Screenshot match failed: ${componentLocator}`,
    }).toHaveScreenshot(`${testName}-${componentLocator}.png`);
  }

  // verifies component is NOT visible
  private async verifyComponentNotVisible(component: {
    componentLocator: string;
  }) {
    await expect(this.page.getByTestId(component.componentLocator)).toBeVisible(
      { visible: false }
    );
  }

  private async getSelectOptions(combobox: Locator) {
    return await combobox.evaluate((select: HTMLSelectElement) =>
      Array.from(select.options).map((option) => ({
        value: option.value,
        text: option.text,
      }))
    );
  }
}
