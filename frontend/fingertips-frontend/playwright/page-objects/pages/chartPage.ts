import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ChartPage extends BasePage {
  readonly lineChartComponent = 'lineChart-component';
  readonly lineChartTableComponent = 'lineChartTable-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async checkURLIsCorrect(queryParams = '') {
    await this.checkURL(`chart${queryParams}`);
  }

  async checkChart() {
    await expect(this.page.getByTestId(this.lineChartComponent)).toBeVisible();
    await expect(
      this.page.getByTestId(this.lineChartTableComponent)
    ).toBeVisible();
  }
}
