import path from 'path';
import { test } from '../../page-objects/pageFactory';
import { SignInAs, TestTag } from '../../testHelpers/genericTestUtilities';

const indicatorId = '41101';

const csvFileName = 'playwright_indicator_data.csv';
const pathToExampleCsv = path.join(
  __dirname,
  '..',
  '..',
  'resources',
  csvFileName
);
const signInAsUserToCheckUnpublishedData = SignInAs.administrator;

/**
 * This tests the indicator data upload journey.
 */
test.describe(
  `Indicator data upload`,
  {
    tag: [TestTag.CI, TestTag.CD],
  },
  () => {
    test('sign in as admin and upload a file', async ({
      uploadPage,
      homePage,
    }) => {
      await test.step('Navigate to home page, sign in', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();

        await homePage.signInIfRequired(signInAsUserToCheckUnpublishedData);
      });

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
        // This should be checking for an HTTP 202 response status,
        // but will display a permissions error until DHSCFT-1140 is completed
        // and these tests are able to sign in.
        await uploadPage.checkApiResponsePanelContains('401');
      });

      // This step skipped until DHSCFT-1140 is completed and these tests are
      // able to sign in.
      // eslint-disable-next-line playwright/no-skipped-test
      await test.step.skip(
        'Check that the batch list table is displayed',
        async () => {
          await uploadPage.checkUploadedBatchListContainerIsVisible(
            csvFileName
          );
        }
      );
    });
  }
);
