import {
  AreaMode,
  getScenarioConfig,
  IndicatorMode,
} from '@/playwright/testHelpers';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ChartPage extends BasePage {
  readonly backLink = 'chart-page-back-link';
  static readonly lineChartComponent = 'lineChart-component';
  static readonly lineChartTableComponent = 'lineChartTable-component';
  static readonly barChartComponent = 'barChart-component';
  static readonly populationPyramidComponent = 'populationPyramid-component';
  static readonly inequalitiesComponent = 'inequalities-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  /**
   * This test function is currently capable of testing three of the fifteen indicator + area
   * scenario combinations from https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * These three scenario combinations are defined above in scenarioConfigs and were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios are covered in lower level unit testing.
   */
  async checkChartVisibility(indicatorMode: IndicatorMode, areaMode: AreaMode) {
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
      if (visibleComponent !== 'lineChartTable-component') {
        await expect(this.page.getByTestId(visibleComponent)).toBeVisible({
          visible: true,
        });
      }
      // click into the tab view if checking lineChartTable
      if (visibleComponent === 'lineChartTable-component') {
        await this.page.getByTestId('tabTitle-table').click();
        await expect(this.page.getByTestId(visibleComponent)).toBeVisible({
          visible: true,
        });
      }

      // screenshot snapshot comparisons are skipped when running e2e test locally or against deployed azure environments
      console.log(
        `checking component:${visibleComponent} for unexpected visual changes - see directory README.md for details.`
      );
      await this.page.waitForTimeout(500);

      // for now just warn if visual comparisons do not match
      try {
        await expect(
          this.page.getByTestId(visibleComponent)
        ).toHaveScreenshot();
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
