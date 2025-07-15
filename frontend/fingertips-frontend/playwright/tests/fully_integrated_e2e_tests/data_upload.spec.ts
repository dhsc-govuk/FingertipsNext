import path from 'path';
import { test } from '../../page-objects/pageFactory';
import { TestTag } from '../../testHelpers/genericTestUtilities';

const indicatorId = '41101';

const csvFileName = 'playwright_indicator_data.csv';
const pathToExampleCsv = path.join(
  __dirname,
  '..',
  '..',
  'resources',
  csvFileName
);

/**
 * This tests the indicator data upload journey.
 */
test.describe(
  `Indicator data upload`,
  {
    tag: [TestTag.CI, TestTag.CD],
  },
  () => {
    test('upload a file', async ({ uploadPage }) => {
      await test.step('Navigate to upload page and upload a file', async () => {
        await uploadPage.navigateToUploadPage();
        await uploadPage.checkOnUploadPage();

        const currentYear = new Date().getFullYear();
        await uploadPage.fillInUploadForm({
          indicatorId,
          publishedAtDay: '7',
          publishedAtMonth: '3',
          publishedAtYear: String(currentYear + 10),
          pathToCsv: pathToExampleCsv,
        });

        await uploadPage.clickUploadButton();
      });
      await test.step('Check API response is displayed', async () => {
        await uploadPage.checkApiResponsePanelContains('202');
      });
    });
  }
);
