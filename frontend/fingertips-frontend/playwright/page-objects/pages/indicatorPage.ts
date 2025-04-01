import BasePage from '../basePage';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { expect } from '../pageFactory';

export default class IndicatorPage extends BasePage {
  readonly backLink = 'indicator-info-back-link';
  readonly indicatorTitle = 'indicator-name';

  public async navigateToIndicatorPage(indicatorId: string) {
    await this.navigateTo(`/indicator/${indicatorId}`);
  }

  async checkIndicatorNameTitle(indicator: IndicatorDocument) {
    const indicatorName = indicator?.indicatorName;

    if (!indicatorName) {
      throw new Error(
        `Indicator name not found for ID: ${indicator.indicatorID}`
      );
    }

    await expect(this.page.getByTestId(this.indicatorTitle)).toBeVisible();
    await expect(this.page.getByTestId(this.indicatorTitle)).toHaveText(
      indicatorName
    );
  }

  async clickBackLink() {
    await expect(this.page.getByTestId(this.backLink)).toBeVisible();
    await this.clickAndAwaitLoadingComplete(
      this.page.getByTestId(this.backLink)
    );
  }
}
