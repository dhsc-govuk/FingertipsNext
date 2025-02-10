import { SearchParams } from '@/lib/searchStateManager';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

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

  async checkChartAndChartTable(isMultipleIndicators: boolean) {
    if (isMultipleIndicators) {
      await expect(
        this.page.getByTestId(this.lineChartComponent)
      ).not.toBeVisible();
      await expect(
        this.page.getByTestId(this.lineChartTableComponent)
      ).not.toBeVisible();
      await expect(
        this.page.getByTestId(this.scatterChartComponent)
      ).toBeVisible();
    } else {
      await expect(
        this.page.getByTestId(this.lineChartComponent)
      ).toBeVisible();
      await expect(
        this.page.getByTestId(this.lineChartTableComponent)
      ).toBeVisible();
      await expect(
        this.page.getByTestId(this.scatterChartComponent)
      ).not.toBeVisible();
    }

    await expect(this.page.getByTestId(this.barChartComponent)).toBeVisible();
    await expect(
      this.page.getByTestId(this.populationPyramidComponent)
    ).toBeVisible();
  }
}
