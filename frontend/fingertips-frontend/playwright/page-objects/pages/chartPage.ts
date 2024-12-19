import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ChartPage extends BasePage {
  readonly lineChartComponent = 'lineChart-component';
  readonly plainTableComponent = 'plainTable-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async checkURLIsCorrect() {
    await this.checkURL(`chart`);
  }

  async checkChart() {
    await expect(this.page.getByTestId(this.lineChartComponent)).toBeVisible();
    await expect(this.page.getByTestId(this.plainTableComponent)).toBeVisible();
  }
}
