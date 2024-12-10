import BasePage from '../basePage';

export default class LineChartPage extends BasePage {
  async navigateToHighcharts() {
    await this.navigateTo('highcharts');
  }

  async checkHighChartsURLIsCorrect() {
    await this.checkURL(`highcharts`);
  }
}
