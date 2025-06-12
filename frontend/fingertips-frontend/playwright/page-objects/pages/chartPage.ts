import {
  AreaFilters,
  AreaMode,
  getScenarioConfig,
  IndicatorMode,
  SimpleIndicatorDocument,
  customEncodeURIComponent,
  PersistentCsvHeaders,
} from '@/playwright/testHelpers';
import { ComponentDefinition } from '../components/componentTypes';
import { expect } from '../pageFactory';
import AreaFilter from '../components/areaFilter';
import { SearchParams } from '@/lib/searchStateManager';
import { ExportType } from '@/components/molecules/Export/export.types';
import { Download, Locator, test } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import { createDownloadPath } from '@/playwright/testHelpers/exportUtils';

interface VisibleComponent {
  componentLocator: string;
  componentProps: Record<string, boolean>;
}

export default class ChartPage extends AreaFilter {
  readonly backLink = 'chart-page-back-link';

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
  static readonly exportModalPaneComponent = 'modalPane';
  static readonly exportDomContainer = 'domContainer';

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
   * Note all 15 scenarios should be covered in lower level unit testing
   */
  async checkCharts(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[],
    selectedAreaFilters: AreaFilters,
    checkExports: boolean
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

    // get the selected area filters from the UI if selectedAreaFilters weren't defined in core_journey_config.ts due to the case being searchMode of either SearchMode.BOTH_SUBJECT_AND_AREA or SearchMode.ONLY_AREA
    if (!selectedAreaFilters) {
      selectedAreaFilters = await this.getSelectedAreaFilters();
    }

    await this.hideFiltersPane();
    await this.verifyDataSourceIsDisplayed(indicatorMode, selectedIndicators);

    for (const visibleComponent of visibleComponents) {
      await this.handleComponentInteractions(
        visibleComponent,
        selectedIndicators,
        areaMode,
        indicatorMode,
        selectedAreaFilters,
        checkExports
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
    indicatorMode: IndicatorMode,
    selectedAreaFilters: AreaFilters,
    checkExports: boolean
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
        condition: componentProps.hasInequalityTypeDropDown,
        action: () =>
          this.selectInequalityTypeDropdownOption({
            componentLocator,
            componentProps,
          }),
      },
      {
        condition: componentProps.hasDetailsExpander,
        action: () => this.expandDetailsSection(),
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
        condition: checkExports && componentProps.hasPNGExport,
        action: () => this.verifyPNGExport(component, areaMode, indicatorMode),
      },
      {
        condition: checkExports && componentProps.hasSVGExport,
        action: () => this.verifySVGExport(component, areaMode, indicatorMode),
      },
      {
        condition: checkExports && componentProps.hasCSVExport,
        action: () =>
          this.verifyCSVExport(
            component,
            areaMode,
            indicatorMode,
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
      this.page
        .getByRole('heading')
        .getByText(`, ${lastOption}`)
        .getByText('inequalities for')
    ).toBeVisible();
    expect(await combobox.inputValue()).toBe(lastOption);
  }

  // selects either first or last option (sex) in the inequality dropdown
  private async selectInequalityTypeDropdownOption({
    componentLocator,
    componentProps,
  }: ComponentDefinition) {
    const dropdownComponent =
      componentLocator === ChartPage.inequalitiesForSingleTimePeriodComponent
        ? ChartPage.inequalitiesTypesDropDownComponentBC
        : ChartPage.inequalitiesTypesDropDownComponentLC;

    const combobox = this.page
      .getByTestId(dropdownComponent)
      .getByRole('combobox');

    const options = await this.getSelectOptions(combobox);

    if (!options.length) {
      throw new Error(
        `No options found in dropdown at [${dropdownComponent}].`
      );
    }

    const valueToSelect = componentProps.selectDeprivationInequality
      ? options[0].value
      : options.at(-1)?.value;

    if (!valueToSelect) {
      throw new Error(
        `Unable to determine option to select from dropdown at [${dropdownComponent}].`
      );
    }

    await combobox.selectOption({ value: valueToSelect });
    await this.waitAfterDropDownInteraction();
    expect(await combobox.inputValue()).toBe(valueToSelect);

    await this.waitForURLToContain(customEncodeURIComponent(valueToSelect));
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
  private async expandDetailsSection() {
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(ChartPage.populationPyramidContainer)
        .getByText('Show population data')
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

    // determine expected values based on area filters
    const isEnglandGroup =
      selectedAreaFilters.group.toLocaleLowerCase() === 'england';
    const isEnglandAreaType = selectedAreaFilters.areaType === 'england';
    const isThematicMap =
      component.componentLocator === ChartPage.thematicMapComponent;

    // check benchmark dropdown options length based on group selection
    const expectedOptionsLength = isEnglandGroup ? 1 : 2;
    expect(options.length).toBe(expectedOptionsLength);

    // set benchmark dropdown to the same group that was selected in the area filter
    await combobox.selectOption({
      label: upperCaseFirstCharSelectedGroup,
    });
    await this.waitAfterDropDownInteraction();

    // determine expected benchmarking text based on area filters
    const expectedSelectedOption = isEnglandGroup
      ? 'England'
      : upperCaseFirstCharSelectedGroup;
    const shouldShowBenchmarkText = !(isEnglandGroup && isEnglandAreaType);
    const benchmarkPrefix = isThematicMap ? 'Compared to' : 'Benchmark:';
    const expectedBenchmarkTitleText = `${benchmarkPrefix} ${expectedSelectedOption}`;
    const expectedBenchmarkTooltipText = `Benchmark: ${expectedSelectedOption}`;

    // verify the correct benchmark dropdown option is now selected
    expect(await combobox.locator('option:checked').textContent()).toBe(
      expectedSelectedOption
    );

    // verify benchmark text visibility in the chart component title
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
          .getByText('Benchmark:')
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

    // verify benchmark text visibility in the chart hover content
    const chartPoint = this.page
      .getByTestId(component.componentLocator)
      .locator('.highcharts-point')
      .nth(tooltipPointToAssert);

    // we need to disable the actionability checks for hover and click for thematic map as it never reaches stable - https://playwright.dev/docs/actionability#stable
    if (component.componentLocator === ChartPage.thematicMapComponent) {
      chartPoint.focus();
      chartPoint.scrollIntoViewIfNeeded();
      await expect(chartPoint).toBeVisible();
      await expect(chartPoint).toBeAttached();
      await expect(chartPoint).toBeEnabled();

      await chartPoint.hover({ force: true });
      await chartPoint.click({ force: true });
    } else {
      await chartPoint.hover();
      await chartPoint.click();
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

  // verifies component is visible and baseline screenshot matches
  private async verifyComponentVisibleAndScreenshotMatch(
    component: { componentLocator: string },
    testName: string
  ) {
    const { componentLocator } = component;

    const locatorToUse =
      componentLocator !== ChartPage.populationPyramidChartComponent
        ? componentLocator
        : `tabContent-${componentLocator.replace('-component', '')}`;

    await expect(this.page.getByTestId(locatorToUse)).toBeVisible({
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

  private async checkPNGisVisibleAndDefault(): Promise<void> {
    expect(
      this.page
        .getByTestId(ChartPage.exportModalPaneComponent)
        .getByText(String(ExportType.PNG))
    ).toBeVisible();
    // this assertions ensures PNG is default and the preview of the PNG is displayed
    expect(
      this.page
        .getByTestId(ChartPage.exportModalPaneComponent)
        .locator('canvas')
    ).toBeVisible();
  }

  private async clickExportAndSaveFile(
    downloadDir: string
  ): Promise<{ download: Download; downloadPath: string }> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(ChartPage.exportModalPaneComponent)
        .getByRole('button')
        .getByText('Export')
    );
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    const downloadPath = path.join(downloadDir, filename);

    await download.saveAs(downloadPath);
    return { download, downloadPath };
  }

  private async openExportModal(exportDataTestId: string): Promise<void> {
    await this.clickAndAwaitLoadingComplete(
      this.page
        .getByTestId(exportDataTestId)
        .getByRole('button', { name: 'Export options' })
    );
  }

  private async closeExportModal(): Promise<void> {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: 'Close modal' })
    );
  }

  private async verifyPNGExport(
    component: VisibleComponent,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode
  ): Promise<void> {
    const exportDataTestId = `tabContent-${component.componentLocator.replace('-component', '')}`;

    // Create download directory structure
    const downloadDir = createDownloadPath(
      ExportType.PNG,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(exportDataTestId);

    // Assert the export modal is visible and defaults to PNG option and displays the preview
    await this.checkPNGisVisibleAndDefault();

    // Click the PNG export option and save the file locally
    const { download } = await this.clickExportAndSaveFile(await downloadDir);

    // Verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.png$/i);

    await this.closeExportModal();
  }

  private async verifySVGExport(
    component: VisibleComponent,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode
  ): Promise<void> {
    const exportDataTestId = `tabContent-${component.componentLocator.replace('-component', '')}`;

    // Create download directory structure
    const downloadDir = createDownloadPath(
      ExportType.SVG,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(exportDataTestId);

    // Assert the export modal is visible and defaults to PNG option and displays the preview
    await this.checkPNGisVisibleAndDefault();

    // Click the SVG radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: 'SVG' })
    );

    // Check the SVG is visible in the preview
    const exportModalPreview = this.page
      .getByTestId(ChartPage.exportModalPaneComponent)
      .getByTestId(ChartPage.exportDomContainer)
      .locator('svg')
      .last();
    expect(exportModalPreview).toBeVisible();

    // Click the SVG export option and save the file locally
    const { download } = await this.clickExportAndSaveFile(await downloadDir);

    // Verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.svg$/i);

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
    // Validate England area data
    if (areaMode === AreaMode.ENGLAND_AREA) {
      expect(exportModalPreview).toContainText('England');
    }
  }

  private getExpectedCSVData(
    component: VisibleComponent,
    areaMode: AreaMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ): {
    expectedCsvIndicatorID: number | string;
    expectedCsvIndicatorName: string;
  } {
    const isPopulationPyramidEngland =
      component.componentLocator ===
        ChartPage.populationPyramidTableComponent &&
      areaMode === AreaMode.ENGLAND_AREA;

    return {
      expectedCsvIndicatorID: isPopulationPyramidEngland
        ? 92708
        : selectedIndicators[0].indicatorID,
      expectedCsvIndicatorName: isPopulationPyramidEngland
        ? 'Resident population'
        : selectedIndicators[0].indicatorName,
    };
  }

  private async verifyCSVExport(
    component: VisibleComponent,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode,
    selectedIndicators: SimpleIndicatorDocument[]
  ): Promise<void> {
    const exportDataTestId = `tabContent-${component.componentLocator.replace('-component', '')}`;
    const { expectedCsvIndicatorID, expectedCsvIndicatorName } =
      this.getExpectedCSVData(component, areaMode, selectedIndicators);

    // Create download directory structure
    const downloadDir = createDownloadPath(
      ExportType.CSV,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(exportDataTestId);

    // Assert the export modal is visible and defaults to PNG option and displays the preview
    await this.checkPNGisVisibleAndDefault();

    // Click the CSV radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: 'CSV' })
    );

    const exportModalPreview = this.page
      .getByTestId(ChartPage.exportModalPaneComponent)
      .locator('div')
      .last();

    // Check the modal preview contains the persistent CSV headers and the selected indicators
    await this.checkCSVPreview(
      exportModalPreview,
      expectedCsvIndicatorID,
      expectedCsvIndicatorName,
      areaMode
    );

    // Click the CSV export option and save the file locally
    const { download, downloadPath } = await this.clickExportAndSaveFile(
      await downloadDir
    );

    // Verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    // validate file is downloaded size
    const fileInfo = await fs.stat(downloadPath);
    expect(fileInfo.size).toBeGreaterThan(500);

    // validate file content
    const fileContent = await fs.readFile(downloadPath, 'utf-8');
    const modalPreviewText = await exportModalPreview.textContent();
    expect(fileContent).toContain(modalPreviewText);

    await this.closeExportModal();
  }
}
