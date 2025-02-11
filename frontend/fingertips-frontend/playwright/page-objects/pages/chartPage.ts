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
  TWO_AREAS = 'TWO_AREAS',
  THREE_AREAS = 'THREE_AREAS',
  ALL_AREAS_IN_A_GROUP = 'ALL_AREAS_IN_A_GROUP',
  ENGLAND_AREA = 'ENGLAND_AREA',
}
export default class ChartPage extends BasePage {
  readonly backLink = 'chart-page-back-link';
  readonly lineChartComponent = 'lineChart-component';
  readonly lineChartTableComponent = 'lineChartTable-component';
  readonly barChartComponent = 'barChart-component';
  readonly populationPyramidComponent = 'populationPyramid-component';
  readonly scatterChartComponent = 'scatterChart-component';

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

  /**
   * Currently capable of testing four of the fifteen indicator + area journeys from
   * https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=419245267
   * These four scenarios were chosen as they are happy paths covering lots of chart components.
   * Note all 15 scenarios are covering in lower unit testing.
   */
  async checkChartVisibility(indicatorMode: IndicatorMode, areaMode: AreaMode) {
    // Supported scenario combinations
    const oneIndicatorWithOneArea =
      indicatorMode === IndicatorMode.ONE_INDICATOR &&
      areaMode === AreaMode.ONE_AREA;
    const twoIndicatorsWithTwoAreas =
      indicatorMode === IndicatorMode.TWO_INDICATORS &&
      areaMode === AreaMode.TWO_AREAS;
    const twoIndicatorsWithAllAreas =
      indicatorMode === IndicatorMode.TWO_INDICATORS &&
      areaMode === AreaMode.ALL_AREAS_IN_A_GROUP;
    const threeIndicatorsWithEngland =
      indicatorMode === IndicatorMode.MULTIPLE_INDICATORS &&
      areaMode === AreaMode.ENGLAND_AREA;

    // Check chart components visible when one indicator + one area
    if (oneIndicatorWithOneArea) {
      const componentsToCheckVisible = [
        this.lineChartComponent,
        this.lineChartTableComponent,
        this.barChartComponent,
        this.populationPyramidComponent,
      ];
      const componentsToCheckNotVisible = [this.scatterChartComponent];

      for (const component of componentsToCheckVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: true,
        });
      }

      for (const component of componentsToCheckNotVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: false,
        });
      }
      return;
    }

    // Check chart components visible when two indicators + two areas from same group
    if (twoIndicatorsWithTwoAreas) {
      const componentsToCheckVisible = [this.populationPyramidComponent];
      const componentsToCheckNotVisible = [
        this.lineChartComponent,
        this.lineChartTableComponent,
        this.barChartComponent,
        this.scatterChartComponent,
      ];

      for (const component of componentsToCheckVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: true,
        });
      }

      for (const component of componentsToCheckNotVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: false,
        });
      }
      return;
    }

    // Check chart components visible when two indicators + all areas from same group
    if (twoIndicatorsWithAllAreas) {
      const componentsToCheckVisible = [
        this.populationPyramidComponent,
        this.scatterChartComponent,
      ];
      const componentsToCheckNotVisible = [
        this.lineChartComponent,
        this.lineChartTableComponent,
        this.barChartComponent,
      ];

      for (const component of componentsToCheckVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: true,
        });
      }

      for (const component of componentsToCheckNotVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: false,
        });
      }
      return;
    }

    // Check chart components visible when multiple indicators + England area
    if (threeIndicatorsWithEngland) {
      const componentsToCheckVisible = [this.populationPyramidComponent];
      const componentsToCheckNotVisible = [
        this.lineChartComponent,
        this.lineChartTableComponent,
        this.barChartComponent,
        this.scatterChartComponent,
      ];

      for (const component of componentsToCheckVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: true,
        });
      }

      for (const component of componentsToCheckNotVisible) {
        await expect(this.page.getByTestId(component)).toBeVisible({
          visible: false,
        });
      }
      return;
    } else
      throw new Error(
        'Combination of indicator and area modes not currently supported'
      );
  }
}
