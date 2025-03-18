import BasePage from '../basePage';

export default class IndicatorPage extends BasePage {
  public async navigateToIndicatorPage(indicatorId: string) {
    await this.navigateTo(`/indicator/${indicatorId}`);
  }
}
