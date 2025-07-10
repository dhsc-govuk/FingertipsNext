import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class UploadPage extends BasePage {
  private readonly apiResponsePanelTestId = 'api-response-panel';
  private readonly apiResponsePanelStatusTestId = 'api-response-panel-status';
  private readonly apiResponsePanelMessageTestId = 'api-response-panel-message';

  private readonly pageHeadingText = 'Indicator data portal';

  private readonly indicatorIdFieldLabel = 'Add indicator ID';
  private readonly dayFieldLabel = 'Day';
  private readonly monthFieldLabel = 'Month';
  private readonly yearFieldLabel = 'Year';
  private readonly fileUploadLabel = 'Upload a file';
  private readonly uploadButtonText = 'Submit';

  async fillInUploadForm({
    indicatorId,
    publishedAtYear,
    publishedAtMonth,
    publishedAtDay,
    pathToCsv,
  }: {
    indicatorId: string;
    publishedAtYear: string;
    publishedAtMonth: string;
    publishedAtDay: string;
    pathToCsv: string;
  }) {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.indicatorIdFieldLabel),
      indicatorId
    );

    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.dayFieldLabel),
      publishedAtDay
    );
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.monthFieldLabel),
      publishedAtMonth
    );
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.yearFieldLabel),
      publishedAtYear
    );

    await this.page.getByLabel(this.fileUploadLabel).setInputFiles(pathToCsv);
  }

  async clickUploadButton() {
    await this.clickAndAwaitLoadingComplete(
      this.page.getByRole('button', { name: this.uploadButtonText })
    );
  }

  async navigateToUploadPage() {
    await this.navigateTo('/upload');
  }

  async checkOnUploadPage() {
    await expect(
      this.page.getByRole('heading', { name: this.pageHeadingText }).first()
    ).toBeVisible();
  }

  async checkApiResponsePanelContains(status: string) {
    await expect(
      this.page.getByTestId(this.apiResponsePanelTestId)
    ).toBeVisible();
    await expect(
      this.page.getByTestId(this.apiResponsePanelStatusTestId)
    ).toContainText(status);
    await expect(
      this.page.getByTestId(this.apiResponsePanelMessageTestId)
    ).toBeVisible();
  }
}
