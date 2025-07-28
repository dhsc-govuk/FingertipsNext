import {
  AreaFilters,
  AreaMode,
  capitaliseFirstCharacter,
  customEncodeURIComponent,
  getScenarioConfig,
  IndicatorMode,
  PersistentCsvHeaders,
  SimpleIndicatorDocument,
} from '@/playwright/testHelpers/genericTestUtilities';
import { ChartComponentDefinition } from '../../testHelpers/testDefinitions';
import { expect } from '../pageFactory';
import AreaFilter from '../components/areaFilter';
import { SearchParams } from '@/lib/searchStateManager';
import { ExportType } from '@/components/molecules/Export/export.types';
import { Download, Locator, test } from '@playwright/test';
import {
  copySavedFileIntoDirectory,
  createDownloadPath,
  getExpectedCSVIndicatorData,
  verifyCSVDownloadMatchesPreview,
  verifySVGDownloadMatchesPreview,
} from '../../testHelpers/exportUtilities';
import { copyrightDateFormat } from '@/components/molecules/Export/ExportCopyright';
import { format } from 'date-fns/format';
import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export default class ChartPage extends AreaFilter {
  readonly backLink = 'chart-page-back-link';
  readonly chartPageTitle = 'View data for selected indicators and areas';
  // chart components
  static readonly lineChartComponent = 'standardLineChart-component';
  static readonly lineChartTableComponent = 'lineChartTable-component';
  static readonly populationPyramidContainer =
    'populationPyramidWithTable-component';
  static readonly populationPyramidChartComponent =
    'populationPyramidChart-component';
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
  static readonly heatMapComponent = 'heatmap-chart-component';
  static readonly barChartEmbeddedTableComponent =
    'barChartEmbeddedTable-component';
  static readonly spineChartTableComponent = 'spineChartTable-component';
  static readonly inequalitiesForSingleTimePeriodComponent =
    'inequalitiesComparisonForOneTimePeriod-component';
  static readonly inequalitiesTrendComponent = 'inequalitiesTrend-component';
  readonly timePeriodDropDownComponent = 'timePeriod-dropDown-component';
  readonly inequalitiesTypesDropDownComponentBC =
    'inequalitiesTypes-dropDown-component-bc';
  readonly inequalitiesTypesDropDownComponentLC =
    'inequalitiesTypes-dropDown-component-lc';
  static readonly basicTableComponent = 'basicTable-component';
  readonly benchmarkDropDownComponent = `${SearchParams.BenchmarkAreaSelected}-dropDown-benchmark-component`;
  readonly exportModalPaneComponent = 'modalPane';
  readonly exportDomContainer = 'domContainer';
  readonly trendTagContainer = 'trendTag-container';
  static readonly inequalitiesContainer = 'inequalities-component';
  // static readonly singleIndicatorBasicTableComponent = 'singleIndicatorBasicTable-component';

  async checkOnChartPage() {
    await expect(this.page.getByText(this.chartPageTitle)).toBeVisible();
  }

  async checkSpecificChartComponent(chartComponent: string) {
    await this.page.getByTestId(chartComponent).isVisible();
  }

  async clickBackLink() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }

  /**
   * This function tests a subset of indicator + area scenario combinations from
   * https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * The scenario combinations here were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios should be covered in lower level unit testing
   */
  async checkCharts(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[],
    selectedAreaFilters: AreaFilters,
    checkExports: boolean,
    typeOfInequalityToSelect: InequalitiesTypes
  ) {
    const testInfo = test.info();
    const testName = testInfo.title;
    const { visibleComponents, hiddenComponents } = getScenarioConfig(
      indicatorMode,
      areaMode
    );

    // get the selected area filters from the UI if selectedAreaFilters weren't defined in core_journey_config.ts due to the case being searchMode of either SearchMode.BOTH_SUBJECT_AND_AREA or SearchMode.ONLY_AREA
    if (!selectedAreaFilters) {
      selectedAreaFilters = await this.getSelectedAreaFilters();
    }

    await this.hideFiltersPane();

    // if the scenario has inequalities data, we need to expand the inequalities section once, after the page loads
    if (typeOfInequalityToSelect) {
      await this.expandInequalitiesSection();
    }

    // if (sexSegmentationToSelect){
    //    action: async () =>
    //       await this.selectInequalityTypeDropdownOption(
    //         {
    //           chartComponentLocator,
    //           chartComponentProps,
    //         },
    //         typeOfInequalityToSelect
    //       )
    // }

    await this.verifyDataSourceIsDisplayed(
      indicatorMode,
      areaMode,
      selectedIndicators
    );

    for (const visibleComponent of visibleComponents) {
      await this.handleComponentInteractions(
        visibleComponent,
        selectedIndicators,
        areaMode,
        indicatorMode,
        selectedAreaFilters,
        checkExports,
        typeOfInequalityToSelect
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

  private async handleComponentInteractions(
    component: ChartComponentDefinition,
    selectedIndicators: SimpleIndicatorDocument[],
    areaMode: AreaMode,
    indicatorMode: IndicatorMode,
    selectedAreaFilters: AreaFilters,
    checkExports: boolean,
    typeOfInequalityToSelect: InequalitiesTypes
  ) {
    const { chartComponentLocator, chartComponentProps } = component;

    const interactions = [
      {
        condition: chartComponentProps.isTabTable,
        action: async () =>
          await this.selectTabForComponent(chartComponentLocator),
      },
      {
        condition: chartComponentProps.hasInequalitiesTimePeriodDropDown,
        action: async () => await this.selectLastTimePeriodOption(),
      },
      {
        condition: chartComponentProps.hasInequalityTypeDropDown,
        action: async () =>
          await this.selectInequalityTypeDropdownOption(
            {
              chartComponentLocator,
              chartComponentProps,
            },
            typeOfInequalityToSelect
          ),
      },
      {
        condition: chartComponentProps.hasDetailsExpander,
        action: async () => await this.expandDetailsSection(),
      },
      {
        condition: chartComponentProps.isWideComponent,
        action: async () => await this.scrollToMiddle(chartComponentLocator),
      },
      {
        condition: chartComponentProps.hasRecentTrend,
        action: async () =>
          await this.verifyTrendTagForComponent(
            component,
            areaMode,
            selectedIndicators
          ),
      },
      {
        condition: checkExports && chartComponentProps.hasPNGExport,
        action: async () =>
          await this.verifyPNGExport(component, areaMode, indicatorMode),
      },
      {
        condition: checkExports && chartComponentProps.hasSVGExport,
        action: async () =>
          await this.verifySVGExport(
            component,
            areaMode,
            indicatorMode,
            selectedAreaFilters
          ),
      },
      {
        condition: checkExports && chartComponentProps.hasCSVExport,
        action: async () =>
          await this.verifyCSVExport(
            component,
            areaMode,
            indicatorMode,
            selectedIndicators
          ),
      },
      {
        condition: chartComponentProps.hasBenchmarkComparisons,
        action: async () =>
          await this.verifyBenchmarkingForComponent(
            component,
            selectedAreaFilters
          ),
      },
      {
        condition: chartComponentProps.hasConfidenceIntervals,
        action: async () =>
          await this.toggleConfidenceInterval(chartComponentLocator),
      },
    ];

    for (const { condition, action } of interactions) {
      if (condition) {
        await action();
      }
    }
  }

  // clicks on the tab if the component is a table
  private async selectTabForComponent(chartComponentLocator: string) {
    const tabTestId = `tabTitle-${this.replaceComponentSuffix(chartComponentLocator)}`;
    await this.clickAndAwaitLoadingComplete(this.page.getByTestId(tabTestId));
  }

  // selects last time period option in the dropdown
  private async selectLastTimePeriodOption() {
    const combobox = this.page
      .getByTestId(this.timePeriodDropDownComponent)
      .getByRole('combobox');

    const options = await this.getSelectOptions(combobox);
    const lastOption = options.at(-1)?.value;
    if (!lastOption) return;

    await this.selectOptionAndAwaitLoadingComplete(combobox, lastOption);
    await this.waitAfterDropDownInteraction();
    await this.waitForURLToContain(lastOption);

    await expect(
      this.page
        .getByRole('heading')
        .getByText(`, ${lastOption}`)
        .getByText('inequalities for')
    ).toBeVisible();
    expect(await combobox.inputValue()).toBe(lastOption);
  }

  private async selectInequalityTypeDropdownOption(
    { chartComponentLocator }: ChartComponentDefinition,
    typeOfInequalityToSelect: InequalitiesTypes
  ) {
    const dropdownComponent =
      chartComponentLocator ===
      ChartPage.inequalitiesForSingleTimePeriodComponent
        ? this.inequalitiesTypesDropDownComponentBC
        : this.inequalitiesTypesDropDownComponentLC;

    const combobox = this.page
      .getByTestId(dropdownComponent)
      .getByRole('combobox');

    const options = await this.getSelectOptions(combobox);

    if (!options.length) {
      throw new Error(
        `No options found in dropdown at [${dropdownComponent}].`
      );
    }

    let selectedOption: string;

    if (typeOfInequalityToSelect === InequalitiesTypes.Sex) {
      // For Sex we can select by exact value
      const sexInequalityOptionCapitalised = capitaliseFirstCharacter(
        String(InequalitiesTypes.Sex)
      );
      selectedOption = sexInequalityOptionCapitalised;

      await this.selectOptionAndAwaitLoadingComplete(combobox, selectedOption);
      await this.waitAfterDropDownInteraction();
    } else if (typeOfInequalityToSelect === InequalitiesTypes.Deprivation) {
      // For Deprivation find the option that contains "deprivation"
      const deprivationOption = options.find((option) =>
        option.text.toLowerCase().includes('deprivation')
      );

      if (!deprivationOption) {
        throw new Error(
          `No deprivation option found in dropdown at [${dropdownComponent}].`
        );
      }

      selectedOption = deprivationOption.value;
      await this.selectOptionAndAwaitLoadingComplete(combobox, selectedOption);
      await this.waitAfterDropDownInteraction();
    } else {
      throw new Error(
        `Unsupported inequality type: ${typeOfInequalityToSelect}`
      );
    }

    await this.waitAfterDropDownInteraction();
    expect(await combobox.inputValue()).toBe(selectedOption);
    await this.waitForURLToContain(customEncodeURIComponent(selectedOption));
  }

  // checks the confidence interval checkbox
  private async toggleConfidenceInterval(chartComponentLocator: string) {
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
      mapping[chartComponentLocator] || ChartPage.lineChartComponent;
    const testId = `confidence-interval-checkbox-${this.replaceComponentSuffix(ciComponent)}`;

    await this.checkAndAwaitLoadingComplete(this.page.getByTestId(testId));
  }

  private async expandInequalitiesSection() {
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(ChartPage.inequalitiesContainer)
        .getByText('Show inequalities data')
    );
  }

  // clicks on 'Show population data' to show population pyramid component
  private async expandDetailsSection() {
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(ChartPage.populationPyramidContainer)
        .getByText('Show population data')
    );
  }

  // scrolls to the middle of the component for better screenshot
  private async scrollToMiddle(chartComponentLocator: string) {
    await this.page.getByTestId(chartComponentLocator).evaluate((element) => {
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    });
  }

  // verifies data source is displayed in the correct scenarios
  private async verifyDataSourceIsDisplayed(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ) {
    const dataSourceLocator = this.page.getByTestId('data-source');

    const isMultiIndicatorWithSpecificAreaMode =
      (indicatorMode !== IndicatorMode.ONE_INDICATOR &&
      (areaMode === AreaMode.ENGLAND_AREA || areaMode === AreaMode.ONE_AREA) )
      ||(indicatorMode === IndicatorMode.ONE_INDICATOR_WITH_SEGMENTATION); //segmentation view charts currently don't show the data source

    const shouldShowDataSource =
      indicatorMode === IndicatorMode.ONE_INDICATOR ||
      isMultiIndicatorWithSpecificAreaMode;

    if (shouldShowDataSource) {
      const expectedText = `Data source: ${selectedIndicators[0].dataSource}`;
      const allDataSources = await dataSourceLocator.allTextContents();

      allDataSources.forEach((dataSource) =>
        expect(dataSource).toBe(expectedText)
      );
    } else {
      await expect(dataSourceLocator).not.toBeAttached();
    }
  }

  private async verifyTrendTagForComponent(
    visibleComponent: ChartComponentDefinition,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ): Promise<void> {
    if (!visibleComponent.chartComponentProps.hasRecentTrend) {
      return;
    }

    const chartComponentLocator = visibleComponent.chartComponentLocator;
    const trendTagLocator = this.page
      .getByTestId(chartComponentLocator)
      .getByTestId(this.trendTagContainer);

    if (
      chartComponentLocator === ChartPage.spineChartTableComponent &&
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

  private getBenchmarkConfig(
    selectedAreaFilters: AreaFilters,
    component: ChartComponentDefinition
  ) {
    const upperCaseFirstCharSelectedGroup = capitaliseFirstCharacter(
      selectedAreaFilters.group
    );

    // determine expected values based on area filters
    const isEnglandGroup =
      selectedAreaFilters.group.toLowerCase() === 'england';
    const isEnglandAreaType = selectedAreaFilters.areaType === 'england';
    const isThematicMap =
      component.chartComponentLocator === ChartPage.thematicMapComponent;

    // determine expected benchmarking text based on area filters
    const expectedSelectedOption = isEnglandGroup
      ? 'England'
      : upperCaseFirstCharSelectedGroup;
    const shouldShowBenchmarkText = !(isEnglandGroup && isEnglandAreaType);
    const benchmarkPrefix = isThematicMap ? 'Compared to' : 'Benchmark:';
    const expectedBenchmarkTitleText = `${benchmarkPrefix} ${expectedSelectedOption}`;
    const expectedBenchmarkTooltipText = `Benchmark: ${expectedSelectedOption}`;

    return {
      upperCaseFirstCharSelectedGroup,
      isEnglandGroup,
      isEnglandAreaType,
      isThematicMap,
      expectedSelectedOption,
      shouldShowBenchmarkText,
      benchmarkPrefix,
      expectedBenchmarkTitleText,
      expectedBenchmarkTooltipText,
    };
  }

  private async verifyBenchmarkingForComponent(
    component: ChartComponentDefinition,
    selectedAreaFilters: AreaFilters
  ) {
    const dropdownComponent = this.benchmarkDropDownComponent;
    const combobox = this.page
      .getByTestId(dropdownComponent)
      .getByRole('combobox');
    const options = await this.getSelectOptions(combobox);
    const benchmarkConfig = this.getBenchmarkConfig(
      selectedAreaFilters,
      component
    );

    // check benchmark dropdown defaults to England as first option in all cases
    expect(options[0].text).toBe('England');

    // check benchmark dropdown options length based on group selection
    const expectedOptionsLength = benchmarkConfig.isEnglandGroup ? 1 : 2;
    expect(options.length).toBe(expectedOptionsLength);

    // set benchmark dropdown to the same group that was selected in the area filter
    await combobox.selectOption({
      label: benchmarkConfig.upperCaseFirstCharSelectedGroup,
    });
    await this.waitAfterDropDownInteraction();

    // verify the correct benchmark dropdown option is now selected
    expect(await combobox.locator('option:checked').textContent()).toBe(
      benchmarkConfig.expectedSelectedOption
    );

    // verify benchmark text visibility in the chart component title
    if (benchmarkConfig.shouldShowBenchmarkText) {
      await expect(
        this.page
          .getByTestId(component.chartComponentLocator)
          .getByText(benchmarkConfig.expectedBenchmarkTitleText)
          .first()
      ).toBeVisible();
      // check hover if current chart component has tooltip hovers
      if (component.chartComponentProps.hasTooltipHovers) {
        await this.checkHovers(
          component,
          benchmarkConfig.expectedBenchmarkTooltipText
        );
      }
    } else {
      await expect(
        this.page
          .getByTestId(component.chartComponentLocator)
          .getByText('Benchmark:')
      ).not.toBeVisible();
      // check hover doesnt contain 'Benchmark:' if current chart component has tooltip hovers
      if (component.chartComponentProps.hasTooltipHovers) {
        await this.checkHovers(component);
      }
    }
  }

  private async checkHovers(
    component: ChartComponentDefinition,
    expectedBenchmarkText?: string
  ) {
    // get correct chart point based on component locator
    const tooltipPointToAssert =
      (component.chartComponentLocator ===
        ChartPage.barChartEmbeddedTableComponent ||
        component.chartComponentLocator === ChartPage.heatMapComponent) &&
      expectedBenchmarkText !== 'Benchmark: England'
        ? 1
        : 0;
    const chartPoint = this.page
      .getByTestId(component.chartComponentLocator)
      .locator('.highcharts-point')
      .nth(tooltipPointToAssert);

    // we need to disable the actionability checks for hover and click for thematic map as it never reaches stable - https://playwright.dev/docs/actionability#stable
    if (component.chartComponentLocator === ChartPage.thematicMapComponent) {
      chartPoint.focus();
      chartPoint.scrollIntoViewIfNeeded();
      await expect(chartPoint).toBeVisible();
      await expect(chartPoint).toBeAttached();
      await expect(chartPoint).toBeEnabled();

      await chartPoint.hover({ force: true });
      await chartPoint.click({ force: true });
    } else {
      await chartPoint.hover();
      await this.clickAndAwaitLoadingComplete(chartPoint);
    }

    await this.page.waitForTimeout(250); // small wait for tooltip to appear
    const hoverContent = await this.page
      .locator('div.highcharts-tooltip')
      .first()
      .textContent();

    // assert hover content contains expected benchmark text
    if (expectedBenchmarkText) {
      expect(hoverContent).toContain(expectedBenchmarkText);
    } else {
      expect(hoverContent).not.toContain('Benchmark:');
    }
  }

  private async verifyComponentVisibleAndScreenshotMatch(
    component: { chartComponentLocator: string },
    testName: string
  ) {
    const { chartComponentLocator } = component;

    const locatorToUse =
      chartComponentLocator !== ChartPage.populationPyramidChartComponent
        ? chartComponentLocator
        : `tabContent-${this.replaceComponentSuffix(chartComponentLocator)}`;

    await expect(this.page.getByTestId(locatorToUse)).toBeVisible({
      visible: true,
    });

    await this.waitForLoadingToFinish();
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForFunction('window.scrollY === 0');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByTestId(chartComponentLocator), {
      message: `Screenshot match failed: ${chartComponentLocator}`,
    }).toHaveScreenshot(`${testName}-${chartComponentLocator}.png`);
  }

  private async verifyComponentNotVisible(component: {
    chartComponentLocator: string;
  }) {
    await expect(
      this.page.getByTestId(component.chartComponentLocator)
    ).toBeVisible({ visible: false });
  }

  private async openExportModal(chartDataTestId: string): Promise<void> {
    const exportButtonDataTestId = `${this.replaceComponentSuffix(chartDataTestId, '-export-button')}`;

    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(exportButtonDataTestId)
    );
  }

  private async clickExport(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(this.exportModalPaneComponent)
        .getByRole('button')
        .getByText('Export')
    );
    return downloadPromise;
  }

  private async closeExportModal(): Promise<void> {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Close modal' })
    );
  }

  private async checkPNGisDefault(): Promise<void> {
    this.page.waitForTimeout(250); // wait for modal to open and render
    expect(
      this.page
        .getByTestId(this.exportModalPaneComponent)
        .getByRole('radio', { name: String(ExportType.PNG) })
    ).toBeChecked();
  }

  private async verifyPNGExport(
    component: ChartComponentDefinition,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode
  ): Promise<void> {
    const downloadDir = createDownloadPath(
      ExportType.PNG,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(component.chartComponentLocator);

    await this.checkPNGisDefault();

    const downloadPromise = this.clickExport();

    const { download } = await copySavedFileIntoDirectory(
      await downloadDir,
      downloadPromise
    );

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.png$/i);

    await this.closeExportModal();
  }

  private async verifySVGExport(
    component: ChartComponentDefinition,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode,
    selectedAreaFilters: AreaFilters
  ): Promise<void> {
    const benchmarkConfig = this.getBenchmarkConfig(
      selectedAreaFilters,
      component
    );

    const downloadDir = createDownloadPath(
      ExportType.SVG,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(component.chartComponentLocator);

    await this.checkPNGisDefault();

    // click the SVG radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: String(ExportType.SVG) })
    );

    // check the SVG is visible in the preview
    const exportModalPreview = this.page
      .getByTestId(this.exportModalPaneComponent)
      .getByTestId(this.exportDomContainer);
    expect(exportModalPreview).toBeAttached();

    await this.checkSVGPreview(component, exportModalPreview, benchmarkConfig);

    const downloadPromise = this.clickExport();

    const { download, downloadPath } = await copySavedFileIntoDirectory(
      await downloadDir,
      downloadPromise
    );

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.svg$/i);

    // validate that the SVG file content matches the modal preview
    await verifySVGDownloadMatchesPreview(downloadPath, exportModalPreview);

    await this.closeExportModal();
  }

  private async checkCSVPreview(
    exportModalPreview: Locator,
    expectedCsvIndicatorID: number | string,
    expectedCsvIndicatorName: string,
    areaMode: AreaMode
  ): Promise<void> {
    for (const header of Object.values(PersistentCsvHeaders)) {
      await expect(exportModalPreview).toContainText(header);
    }
    await expect(exportModalPreview).toContainText(
      String(expectedCsvIndicatorID)
    );
    await expect(exportModalPreview).toContainText(expectedCsvIndicatorName);
    // validate England area data
    if (areaMode === AreaMode.ENGLAND_AREA) {
      expect(exportModalPreview).toContainText('England');
    }
  }

  private async checkSVGPreview(
    component: ChartComponentDefinition,
    exportModalPreview: Locator,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    benchmarkConfig: any
  ): Promise<void> {
    const now = new Date();
    const svgContent = await exportModalPreview.textContent();

    const copyrightText = `©Crown copyright ${now.getFullYear()}. Office for Health Improvement & Disparities.`;
    expect(svgContent).toContain(copyrightText);

    const accessText = `Public Health Profiles accessed on ${format(now, copyrightDateFormat)} www.fingertips.phe.org.uk`;
    expect(svgContent).toContain(accessText);

    if (component.chartComponentProps.hasBenchmarkComparisons) {
      if (benchmarkConfig.shouldShowBenchmarkText) {
        await expect(
          this.page.getByText(benchmarkConfig.expectedBenchmarkTitleText).last()
        ).toBeVisible();
      } else {
        await expect(
          this.page.getByText(benchmarkConfig.expectedBenchmarkTitleText).last()
        ).not.toBeVisible();
      }
    }
  }

  private async verifyCSVExport(
    component: ChartComponentDefinition,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ): Promise<void> {
    const { expectedCsvIndicatorID, expectedCsvIndicatorName } =
      getExpectedCSVIndicatorData(component, selectedIndicators);

    const downloadDir = createDownloadPath(
      ExportType.CSV,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(component.chartComponentLocator);

    await this.checkPNGisDefault();

    // click the CSV radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: String(ExportType.CSV) })
    );

    const exportModalPreview = this.page
      .getByTestId(this.exportModalPaneComponent)
      .locator('div')
      .last();
    expect(exportModalPreview).toBeAttached();

    await this.checkCSVPreview(
      exportModalPreview,
      expectedCsvIndicatorID,
      expectedCsvIndicatorName,
      areaMode
    );

    const downloadPromise = this.clickExport();

    const { download, downloadPath } = await copySavedFileIntoDirectory(
      await downloadDir,
      downloadPromise
    );

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    // validate file downloaded matches the preview
    verifyCSVDownloadMatchesPreview(downloadPath, exportModalPreview);

    await this.closeExportModal();
  }

  private replaceComponentSuffix(
    inputString: string,
    replaceWith: string = ''
  ): string {
    return inputString.replaceAll('-component', replaceWith);
  }
}
