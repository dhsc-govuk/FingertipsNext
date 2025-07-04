import path from 'path';
import BasePage from '../basePage';
import { expect } from '../pageFactory';

export default class UploadPage extends BasePage {
  private readonly apiResponsePanelTestId = 'api-response-panel';

  private readonly pageHeadingText = 'Indicator data portal';

  private readonly indicatorIdFieldLabel = 'Add indicator ID';
  private readonly dayFieldLabel = 'Day';
  private readonly monthFieldLabel = 'Month';
  private readonly yearFieldLabel = 'Year';
  private readonly fileUploadLabel = 'Upload a file';
  private readonly uploadButtonText = 'Submit';

  private readonly csvFileName = 'playwright_indicator_data.csv';
  private readonly pathToExampleCsv = path.join(
    __dirname,
    '..',
    '..',
    'resources',
    this.csvFileName
  );

  private readonly indicatorId = '41101';

  async fillInUploadForm() {
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.indicatorIdFieldLabel),
      this.indicatorId
    );

    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.dayFieldLabel),
      '7'
    );
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.monthFieldLabel),
      '3'
    );
    const currentYear = new Date().getFullYear();
    await this.fillAndAwaitLoadingComplete(
      this.page.getByLabel(this.yearFieldLabel),
      String(currentYear + 10)
    );

    await this.page
      .getByLabel(this.fileUploadLabel)
      .setInputFiles(this.pathToExampleCsv);
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

  async checkApiResponsePanelContainsASuccessMessage() {
    await expect(
      this.page.getByTestId(this.apiResponsePanelTestId)
    ).toBeVisible();
    await expect(this.page.getByText('202')).toBeVisible();
    await expect(
      this.page.getByText(
        `File ${this.csvFileName} has been accepted for indicator ${this.indicatorId}.`
      )
    ).toBeVisible();
  }
}
