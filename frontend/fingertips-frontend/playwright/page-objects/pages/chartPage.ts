import {
  AreaFilters,
  AreaMode,
  customEncodeURIComponent,
  getScenarioConfig,
  IndicatorMode,
  PersistentCsvHeaders,
  SimpleIndicatorDocument,
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
import { copyrightDateFormat } from '@/components/molecules/Export/ExportCopyright';
import { format } from 'date-fns/format';
import { XMLParser } from 'fast-xml-parser';

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
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId('area-filter-pane-hidefilters')
    );
    await expect(this.page.getByTestId('show-filter-cta')).toHaveText(
      'Show filter'
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
        action: async () => await this.selectTabForComponent(componentLocator),
      },
      {
        condition: componentProps.hasTimePeriodDropDown,
        action: async () => await this.selectLastTimePeriodOption(),
      },
      {
        condition: componentProps.hasInequalityTypeDropDown,
        action: async () =>
          await this.selectInequalityTypeDropdownOption({
            componentLocator,
            componentProps,
          }),
      },
      {
        condition: componentProps.hasDetailsExpander,
        action: async () => await this.expandDetailsSection(),
      },
      {
        condition: componentProps.isWideComponent,
        action: async () => await this.scrollToMiddle(componentLocator),
      },
      {
        condition: componentProps.hasRecentTrend,
        action: async () =>
          await this.verifyTrendTagForComponent(
            component,
            areaMode,
            selectedIndicators
          ),
      },
      {
        condition: checkExports && componentProps.hasPNGExport,
        action: async () =>
          await this.verifyPNGExport(component, areaMode, indicatorMode),
      },
      {
        condition: checkExports && componentProps.hasSVGExport,
        action: async () =>
          await this.verifySVGExport(
            component,
            areaMode,
            indicatorMode,
            selectedAreaFilters
          ),
      },
      {
        condition: checkExports && componentProps.hasCSVExport,
        action: async () =>
          await this.verifyCSVExport(
            component,
            areaMode,
            indicatorMode,
            selectedIndicators
          ),
      },
      {
        condition: componentProps.showsBenchmarkComparisons,
        action: async () =>
          await this.verifyBenchmarkingForComponent(
            component,
            selectedAreaFilters
          ),
      },
      {
        condition: componentProps.hasConfidenceIntervals,
        action: async () =>
          await this.toggleConfidenceInterval(componentLocator),
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

  private getBenchmarkConfig(
    selectedAreaFilters: AreaFilters,
    component: VisibleComponent
  ) {
    const upperCaseFirstCharSelectedGroup =
      selectedAreaFilters.group.charAt(0).toUpperCase() +
      selectedAreaFilters.group.slice(1);

    // determine expected values based on area filters
    const isEnglandGroup =
      selectedAreaFilters.group.toLowerCase() === 'england';
    const isEnglandAreaType = selectedAreaFilters.areaType === 'england';
    const isThematicMap =
      component.componentLocator === ChartPage.thematicMapComponent;

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
    component: VisibleComponent,
    selectedAreaFilters: AreaFilters
  ) {
    const dropdownComponent = ChartPage.benchmarkDropDownComponent;
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
          .getByTestId(component.componentLocator)
          .getByText(benchmarkConfig.expectedBenchmarkTitleText)
          .first()
      ).toBeVisible();
      // check hover if current chart component has tooltip hovers
      if (component.componentProps.hasTooltipHovers) {
        await this.checkHovers(
          component,
          benchmarkConfig.expectedBenchmarkTooltipText
        );
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

  private async openExportModal(chartDataTestId: string): Promise<void> {
    const exportButtonDataTestId = `${chartDataTestId.replace('-component', '-export-button')}`;

    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(exportButtonDataTestId)
    );
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
        .getByTestId(ChartPage.exportModalPaneComponent)
        .getByRole('radio', { name: String(ExportType.PNG) })
    ).toBeChecked();
  }

  private async verifyPNGExport(
    component: VisibleComponent,
    areaMode: AreaMode,
    indicatorMode: IndicatorMode
  ): Promise<void> {
    const downloadDir = createDownloadPath(
      ExportType.PNG,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(component.componentLocator);

    await this.checkPNGisDefault();

    const { download } = await this.clickExportAndSaveFile(await downloadDir);

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.png$/i);

    await this.closeExportModal();
  }

  private async verifySVGExport(
    component: VisibleComponent,
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

    await this.openExportModal(component.componentLocator);

    await this.checkPNGisDefault();

    // click the SVG radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: 'SVG' })
    );

    // check the SVG is visible in the preview
    const exportModalPreview = this.page
      .getByTestId(ChartPage.exportModalPaneComponent)
      .getByTestId(ChartPage.exportDomContainer);
    expect(exportModalPreview).toBeAttached();

    await this.checkSVGPreview(component, exportModalPreview, benchmarkConfig);

    const { download, downloadPath } = await this.clickExportAndSaveFile(
      await downloadDir
    );

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.svg$/i);

    // validate that the SVG file content matches the modal preview
    const svgFileContent = await fs.readFile(downloadPath, 'utf-8');
    const previewSVG = await exportModalPreview.innerHTML();
    //xmlns:xlink=\"http://www.w3.org/1999/xlink\"

    const reg = /xmlns(:xlink)?="[^"]+" /g;
    const previewSVGwithoutXlmns = previewSVG.replaceAll(reg, '');
    const svgFileContentWithoutXlmns = svgFileContent.replaceAll(reg, '');

    const compareXmlStrings = (str1: string, str2: string) => {
      const parser = new XMLParser({
        ignoreAttributes: false,
        ignoreDeclaration: true,
        attributeNamePrefix: '',
        trimValues: true,
      });
      const json1 = parser.parse(str1);
      const json2 = parser.parse(str2);
      return JSON.stringify(json1) === JSON.stringify(json2);
    };

    expect(
      compareXmlStrings(previewSVGwithoutXlmns, svgFileContentWithoutXlmns)
    ).toBe(true);

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
    component: VisibleComponent,
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

    if (component.componentProps.showsBenchmarkComparisons) {
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

  private getExpectedData(
    component: VisibleComponent,
    selectedIndicators: SimpleIndicatorDocument[]
  ): {
    expectedCsvIndicatorID: number | string;
    expectedCsvIndicatorName: string;
  } {
    const isPopulationPyramid =
      component.componentLocator === ChartPage.populationPyramidTableComponent;

    return {
      expectedCsvIndicatorID: isPopulationPyramid
        ? 92708
        : selectedIndicators[0].indicatorID,
      expectedCsvIndicatorName: isPopulationPyramid
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
    const { expectedCsvIndicatorID, expectedCsvIndicatorName } =
      this.getExpectedData(component, selectedIndicators);

    const downloadDir = createDownloadPath(
      ExportType.CSV,
      areaMode,
      indicatorMode
    );

    await this.openExportModal(component.componentLocator);

    await this.checkPNGisDefault();

    // click the CSV radio option
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('radio', { name: 'CSV' })
    );

    const exportModalPreview = this.page
      .getByTestId(ChartPage.exportModalPaneComponent)
      .locator('div')
      .last();
    expect(exportModalPreview).toBeAttached();

    await this.checkCSVPreview(
      exportModalPreview,
      expectedCsvIndicatorID,
      expectedCsvIndicatorName,
      areaMode
    );

    const { download, downloadPath } = await this.clickExportAndSaveFile(
      await downloadDir
    );

    // verify the file downloaded successfully
    expect(download.suggestedFilename()).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    // validate file downloaded has size greater than 100 bytes
    const fileInfo = await fs.stat(downloadPath);
    expect(fileInfo.size).toBeGreaterThan(100);

    // validate that the CSV file content matches the modal preview
    const fileContent = await fs.readFile(downloadPath, 'utf-8');
    const modalPreviewText = await exportModalPreview.textContent();
    expect(fileContent).toContain(modalPreviewText);

    await this.closeExportModal();
  }
}
