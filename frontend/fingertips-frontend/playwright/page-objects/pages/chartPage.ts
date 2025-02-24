import BasePage from '../basePage';
import { expect } from '../pageFactory';

export enum IndicatorMode {
  ONE_INDICATOR = 'ONE_INDICATOR',
  TWO_INDICATORS = 'TWO_INDICATORS',
  MULTIPLE_INDICATORS = 'MULTIPLE_INDICATORS', // 3+ indicators
}

export enum AreaMode {
  ONE_AREA = 'ONE_AREA',
  TWO_AREAS = 'TWO_AREAS', // in the same group
  THREE_PLUS_AREAS = 'THREE_PLUS_AREAS', // 3+ areas in a group
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}

type ScenarioConfig = {
  visibleComponents: string[];
  hiddenComponents: string[];
};
export default class ChartPage extends BasePage {
  readonly backLink = 'chart-page-back-link';
  readonly lineChartComponent = 'lineChart-component';
  readonly lineChartTableComponent = 'lineChartTable-component';
  readonly barChartComponent = 'barChart-component';
  readonly populationPyramidComponent = 'populationPyramid-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  private getScenarioConfig(
    indicatorMode: IndicatorMode,
    areaMode: AreaMode
  ): ScenarioConfig {
    // Temporarily disabled until the pop pyramid is implemented fully under DHSCFT-148.
    // const defaultVisible = [this.populationPyramidComponent];
    const defaultVisible: never[] = [];

    const defaultHidden = [
      this.lineChartComponent,
      this.lineChartTableComponent,
      // DHSCFT-220 will implement this logic
      // this.barChartComponent,
    ];

    // Single indicator scenarios show all charts
    const singleIndicatorConfig: ScenarioConfig = {
      visibleComponents: [
        this.lineChartComponent,
        this.lineChartTableComponent,
        this.barChartComponent,
        this.populationPyramidComponent,
      ],
      hiddenComponents: [],
    };

    // Map of three supported scenarios, known as the core journeys, to their configurations
    const scenarioConfigs = new Map<[IndicatorMode, AreaMode], ScenarioConfig>([
      [[IndicatorMode.ONE_INDICATOR, AreaMode.ONE_AREA], singleIndicatorConfig],
      [
        [IndicatorMode.TWO_INDICATORS, AreaMode.TWO_AREAS],
        { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
      ],
      [
        [IndicatorMode.MULTIPLE_INDICATORS, AreaMode.ENGLAND_AREA],
        { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
      ],
    ]);

    const config = Array.from(scenarioConfigs.entries()).find(
      ([[mode, area]]) => mode === indicatorMode && area === areaMode
    )?.[1];

    if (!config) {
      throw new Error(
        `Combination of indicator mode: ${indicatorMode} + area mode: ${areaMode} is not one of the three core journeys`
      );
    }

    return config;
  }

  /**
   * This test function is currently capable of testing three of the fifteen indicator + area
   * scenario combinations from https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * These three scenario combinations are defined above in scenarioConfigs and were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios are covered in lower level unit testing.
   */
  async checkChartVisibility(indicatorMode: IndicatorMode, areaMode: AreaMode) {
    const { visibleComponents, hiddenComponents } = this.getScenarioConfig(
      indicatorMode,
      areaMode
    );
    console.log(
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that chart components: ${visibleComponents} are displayed and that`,
      `chart components: ${hiddenComponents} are not displayed.`
    );
    // Check that components expected to be visible are displayed
    for (const component of visibleComponents) {
      await expect(this.page.getByTestId(component)).toBeVisible({
        visible: true,
      });
    }

    // Check that components expected not to be visible are not displayed
    for (const component of hiddenComponents) {
      await expect(this.page.getByTestId(component)).toBeVisible({
        visible: false,
      });
    }
  }
}
