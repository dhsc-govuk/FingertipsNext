import {
  AreaMode,
  getScenarioConfig,
  IndicatorMode,
} from '@/playwright/testHelpers';
import { expect } from '../pageFactory';
import {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';
import AreaFilter from '../components/areaFilter';
import { SimpleIndicatorDocument } from '@/playwright/tests/fully_integrated_e2e_tests/core_journeys.spec';

export default class ChartPage extends AreaFilter {
  readonly backLink = 'chart-page-back-link';

  // chart components
  static readonly lineChartComponent = 'standardLineChart-component';
  static readonly lineChartTableComponent = 'lineChartTable-component';
  static readonly populationPyramidComponent =
    'populationPyramidWithTable-component';
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
   * The scenario combinations were were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios are covered in lower level unit testing.
   */
  async checkChartVisibility(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >,
    selectedIndicators: SimpleIndicatorDocument[]
  ) {
    const testInfo = test.info();
    const testName = testInfo.title;
    const { visibleComponents, hiddenComponents } = getScenarioConfig(
      indicatorMode,
      areaMode
    );

    console.log(
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart components: ${visibleComponents
        .map(
          (component) =>
            `${component.componentLocator}(hasCI:${component.componentProps.hasConfidenceIntervals},isTab:${component.componentProps.isTabTable},hasTimePeriod:${component.componentProps.hasTimePeriodDropDown})`
        )
        .join(', ')} are displayed and that`,
      `chart components: ${hiddenComponents.map((component) => component.componentLocator).join(', ')} are not displayed. Also checking the visible components via screenshot snapshot testing.`
    );
    // click the hide filters pane before asserting visibility and taking screenshots
    await this.clickAndWaitForLoadState(
      this.page.getByTestId('area-filter-pane-hidefilters')
    );

    await expect(this.page.getByTestId('show-filter-cta')).toHaveText(
      'Show filter'
    );

    // check that the data source is displayed for the selected indicator in one indicator mode
    if (indicatorMode === IndicatorMode.ONE_INDICATOR) {
      const allDataSources = await this.page
        .getByTestId(`data-source`)
        .allTextContents();

      allDataSources.forEach((dataSource) => {
        expect(dataSource).toBe(
          `Data source: ${selectedIndicators[0].dataSource}`
        );
      });
    }
    // and check that the data source is not displayed for the other indicator modes
    if (indicatorMode != IndicatorMode.ONE_INDICATOR) {
      expect(this.page.getByTestId(`data-source`)).not.toBeAttached();
    }

    // Check that components expected to be visible are displayed
    for (const visibleComponent of visibleComponents) {
      console.log(
        `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart component: ${visibleComponent.componentLocator} is displayed.`
      );
      // if its one of the chart table components that you need to click on the tab first to see it then click it
      if (visibleComponent.componentProps.isTabTable) {
        await this.clickAndAwaitLoadingComplete(
          this.page.getByTestId(
            `tabTitle-${visibleComponent.componentLocator.replace('-component', '')}`
          )
        );
      }
      // if its one of the chart components that has a single time period dropdown then select the last in the list
      if (visibleComponent.componentProps.hasTimePeriodDropDown) {
        const combobox = this.page
          .getByTestId(ChartPage.timePeriodDropDownComponent)
          .getByRole('combobox');
        // get the options from the combobox
        const dropdownOptions = await combobox.evaluate(
          (select: HTMLSelectElement) => {
            return Array.from(select.options).map((option) => ({
              value: option.value,
              text: option.text,
            }));
          }
        );
        // get the last option in the dropdown then select it
        const lastTimePeriodDropdownOption =
          dropdownOptions[dropdownOptions.length - 1].value;
        await combobox.selectOption({
          value: lastTimePeriodDropdownOption,
        });
        await this.waitAfterDropDownInteraction();

        // ensure the page has been rerendered with the new time period
        await this.waitForURLToContain(lastTimePeriodDropdownOption);
        await expect(
          this.page.getByText(
            `persons for ${lastTimePeriodDropdownOption} time period`
          )
        ).toBeVisible();
        expect(await combobox.inputValue()).toBe(lastTimePeriodDropdownOption);
      }
      // if its one of the chart components that has a type dropdown for inequalities then select the last in the list
      if (visibleComponent.componentProps.hasTypeDropDown) {
        const dropDownComponent =
          visibleComponent.componentLocator ===
          ChartPage.inequalitiesForSingleTimePeriodComponent
            ? ChartPage.inequalitiesTypesDropDownComponentBC
            : ChartPage.inequalitiesTypesDropDownComponentLC;
        const combobox = this.page
          .getByTestId(dropDownComponent)
          .getByRole('combobox');
        // get the options from the combobox
        const dropdownOptions = await combobox.evaluate(
          (select: HTMLSelectElement) => {
            return Array.from(select.options).map((option) => ({
              value: option.value,
              text: option.text,
            }));
          }
        );
        // get the last option in the dropdown then select it
        const lastTypeDropdownOption =
          dropdownOptions[dropdownOptions.length - 1].value;
        await combobox.selectOption({
          value: lastTypeDropdownOption,
        });
        await this.waitAfterDropDownInteraction();

        // ensure the page has been rerendered with the new type
        const dropDownConvertedToURL = encodeURIComponent(
          lastTypeDropdownOption
        );
        await this.waitForURLToContain(dropDownConvertedToURL);
        expect(await combobox.inputValue()).toBe(lastTypeDropdownOption);
      }
      // if its one of the chart components that has a confidence interval checkbox then click it
      if (visibleComponent.componentProps.hasConfidenceIntervals) {
        const componentMapping: Record<string, string> = {
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

        const defaultComponent = ChartPage.lineChartComponent;
        const confidenceIntervalComponent =
          componentMapping[visibleComponent.componentLocator] ||
          defaultComponent;

        const testId = `confidence-interval-checkbox-${confidenceIntervalComponent.replace('-component', '')}`;

        await this.checkAndAwaitLoadingComplete(this.page.getByTestId(testId));
      }
      // if its one of the chart components that has a details expander then click it
      if (visibleComponent.componentProps.hasDetailsExpander) {
        await this.clickAndAwaitLoadingComplete(
          this.page
            .getByTestId(visibleComponent.componentLocator)
            .getByText('Show population data')
        );
      }
      // if its one of the wide chart components then scroll to the middle of it
      if (visibleComponent.componentProps.isWideComponent) {
        await this.page
          .getByTestId(visibleComponent.componentLocator)
          .evaluate((element) => {
            // Calculate the middle point horizontally
            // Scrolls to half of the total scrollable width
            const middleX = (element.scrollWidth - element.clientWidth) / 2;

            // Scroll to the middle point
            element.scrollLeft = middleX;
          });
      }

      // check chart component is now visible
      await expect(
        this.page.getByTestId(visibleComponent.componentLocator)
      ).toBeVisible({
        visible: true,
      });

      // this block of code is required to ensure we have stable screenshot comparisons - it can be removed once playwright fix their library
      await this.page.waitForLoadState();
      await expect(this.page.getByText('Loading')).toHaveCount(0);
      await this.page.waitForLoadState();
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForFunction('window.scrollY === 0');
      await this.page.waitForTimeout(1000);

      // note that screenshot snapshot comparisons are ignored when running locally and against the deployed azure environments
      await expect(this.page.getByTestId(visibleComponent.componentLocator), {
        message: `Screenshot match failed: ${visibleComponent.componentLocator} - you may need to run the update screenshot manual CI job - see Visual Screenshot Snapshot Testing in frontend/fingertips-frontend/README.md for details.`,
      }).toHaveScreenshot(
        `${testName}-${visibleComponent.componentLocator}.png`
      );
    }

    // Check that components expected not to be visible are not displayed
    for (const hiddenComponent of hiddenComponents) {
      console.log(
        `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart component: ${hiddenComponent.componentLocator} is not displayed.`
      );
      await expect(
        this.page.getByTestId(hiddenComponent.componentLocator)
      ).toBeVisible({
        visible: false,
      });
    }
  }
}
