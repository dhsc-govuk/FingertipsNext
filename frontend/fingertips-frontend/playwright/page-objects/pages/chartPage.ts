import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class ChartPage extends BasePage {
  readonly linechartComponent = 'lineChart-component';

  async navigateToChart() {
    await this.navigateTo('chart');
  }

  async checkURLIsCorrect() {
    await this.checkURL(`chart`);
  }

  async checkChart() {
    await expect(this.page.getByTestId(this.linechartComponent)).toBeVisible();
  }
}
