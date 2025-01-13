import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class BarPage extends BasePage {
  readonly barChartComponent = 'barChart-component';
  readonly barChartTableComponent = 'barChartTable-component';

  async navigateToChart() {
    await this.navigateTo('bar');
  }

  async checkURLIsCorrect() {
    await this.checkURL(`bar`);
  }

  async checkChartAndChartTable() {
    await expect(this.page.getByTestId(this.barChartComponent)).toBeVisible();
    await expect(
      this.page.getByTestId(this.barChartTableComponent)
    ).toBeVisible();
  }
}
