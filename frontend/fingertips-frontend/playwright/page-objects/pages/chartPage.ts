import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ChartPage extends BasePage {
  readonly backLink = 'chart-page-back-link';
  readonly lineChartComponent = 'lineChart-component';
  readonly lineChartTableComponent = 'lineChartTable-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async checkURLIsCorrect(queryParams = '') {
    await this.checkURL(`chart?indicator=${queryParams}`);
  }

  async clickBackLink() {
    await this.page.getByTestId(this.backLink).click();
  }

  async checkChartAndChartTable() {
    await expect(this.page.getByTestId(this.lineChartComponent)).toBeVisible();
    await expect(
      this.page.getByTestId(this.lineChartTableComponent)
    ).toBeVisible();
  }
}
