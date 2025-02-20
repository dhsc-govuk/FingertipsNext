import { SearchParams } from '@/lib/searchStateManager';
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

  async checkURLIsCorrect(queryParams = '') {
    await this.checkURLMatches(
      `chart?${SearchParams.SearchedIndicator}=${queryParams}`
    );
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

    // Map of three supported scenarios, the core journeys, to their configurations
    const scenarioConfigs = new Map<string, ScenarioConfig>([
      [
        `${IndicatorMode.ONE_INDICATOR}_${AreaMode.ONE_AREA}`,
        singleIndicatorConfig,
      ],
      [
        `${IndicatorMode.TWO_INDICATORS}_${AreaMode.TWO_AREAS}`,
        { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
      ],
      [
        `${IndicatorMode.MULTIPLE_INDICATORS}_${AreaMode.ENGLAND_AREA}`,
        { visibleComponents: defaultVisible, hiddenComponents: defaultHidden },
      ],
    ]);

    const config = scenarioConfigs.get(`${indicatorMode}_${areaMode}`);
    if (!config) {
      throw new Error(
        'Combination of indicator and area modes is not one of the three core journeys'
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
      `for indicator mode: ${indicatorMode} + area mode: ${areaMode} - checking that ${visibleComponents} are displayed and that`,
      `${hiddenComponents} are not displayed.`
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
