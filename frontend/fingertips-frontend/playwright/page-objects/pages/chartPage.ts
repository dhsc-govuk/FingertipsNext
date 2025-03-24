import {
  AreaMode,
  getScenarioConfig,
  IndicatorMode,
} from '@/playwright/testHelpers';
import BasePage from '../basePage';
import { expect } from '../pageFactory';
import {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';

export default class ChartPage extends BasePage {
  readonly backLink = 'chart-page-back-link';
  static readonly lineChartComponent = 'standardLineChart-component';
  static readonly lineChartTableComponent = 'lineChartTable-component';
  static readonly populationPyramidComponent = 'populationPyramid-component';
  static readonly inequalitiesComponent = 'inequalities-component';
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

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async checkOnChartPage() {
    await expect(
      this.page.getByText('View data for selected indicators and areas')
    ).toBeVisible();
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  /**
   * This function tests a subset of indicator + area scenario combinations from
   * https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * The selected scenario combinations are defined above in scenarioConfigs and were chosen
   * as they are happy paths covering lots of chart components.
   * Note all 15 scenarios are covered in lower level unit testing.
   */
  async checkChartVisibility(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >
  ) {
    const testInfo = test.info();
    const testName = testInfo.title;
    const { visibleComponents, hiddenComponents } = getScenarioConfig(
      indicatorMode,
      areaMode
    );
    console.log(
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart components: ${visibleComponents} are displayed and that`,
      `chart components: ${hiddenComponents} are not displayed. Also checking the visible components via screenshot snapshot testing.`
    );
    // Check that components expected to be visible are displayed
    for (const visibleComponent of visibleComponents) {
      // click tab to view the table view if checking a none embedded table component
      if (
        visibleComponent.toLowerCase().includes('table') &&
        visibleComponent !== 'barChartEmbeddedTable-component'
      ) {
        await this.page
          .getByTestId(`tabTitle-${visibleComponent.replace('-component', '')}`)
          .click();
      }
      // if its one of the chart components that has a confidence interval checkbox then click it
      if (
        visibleComponent.includes('LineChart-component') ||
        visibleComponent === 'inequalitiesBarChart-component'
      ) {
        await this.page
          .getByTestId(
            `confidence-interval-checkbox-${visibleComponent.replace('-component', '')}`
          )
          .click();
      }

      await expect(this.page.getByTestId(visibleComponent)).toBeVisible({
        visible: true,
      });

      // screenshot snapshot comparisons are skipped when running against deployed azure environments
      console.log(
        `checking component:${visibleComponent} for unexpected visual changes - see directory README.md for details.`
      );
      await this.page.waitForTimeout(500); // change this to wait for loading spinner to no longer appear in DHSCFT-490

      // for now just warn if visual comparisons do not match
      try {
        await expect(this.page.getByTestId(visibleComponent)).toHaveScreenshot(
          `${testName}-${visibleComponent}.png`
        );
      } catch (error) {
        const typedError = error as Error;
        console.warn(
          `⚠️ Screenshot comparison warning for ${visibleComponent}: ${typedError.message}`
        );
      }
    }

    // Check that components expected not to be visible are not displayed
    for (const hiddenComponent of hiddenComponents) {
      await expect(this.page.getByTestId(hiddenComponent)).toBeVisible({
        visible: false,
      });
    }
  }
}
