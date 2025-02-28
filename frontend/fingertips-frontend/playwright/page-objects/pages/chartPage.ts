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
  async checkChartVisibility(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode,
    compareVisualSnapshots: boolean
  ) {
    const { visibleComponents, hiddenComponents } = getScenarioConfig(
      indicatorMode,
      areaMode
    );
    console.log(
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart components: ${visibleComponents} are displayed and that`,
      `chart components: ${hiddenComponents} are not displayed.`
    );
    // Check that components expected to be visible are displayed
    for (const component of visibleComponents) {
      if (component !== 'lineChartTable-component') {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: true,
        });
        // click into the tab view
        if (component === 'lineChartTable-component') {
          await this.page.getByTestId('tabTitle-table').click();
          await expect(this.page.getByTestId(component)).toBeVisible({
            visible: true,
          });
        }
      }
    }

    // Check that components expected not to be visible are not displayed
    for (const component of hiddenComponents) {
      await expect(this.page.getByTestId(component)).toBeVisible({
        visible: false,
      });
    }

    if (compareVisualSnapshots) {
      console.log(
        'Executing visual comparisons as running in CI/CD environment.'
      );
      await expect(this.page).toHaveScreenshot();
    } else {
      console.log(
        'Skipping visual comparison as running in local environment.'
      );
    }
  }
}
