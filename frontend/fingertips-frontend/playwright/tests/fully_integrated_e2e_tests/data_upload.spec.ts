import path from 'path';
import { test } from '../../page-objects/pageFactory';
import {
  randomString,
  SignInAs,
  TestTag,
} from '../../testHelpers/genericTestUtilities';

const indicatorId = '41101';
const randomVal = randomString(5);
const csvFileName = `playwright_indicator_data_${randomVal}.csv`;
const pathToExampleCsv = path.join(
  __dirname,
  '..',
  '..',
  'resources',
  csvFileName
);
const signInAsUserToCheckUnpublishedData = SignInAs.administrator;

/**
 * This tests the indicator data upload then delete journey.
 */
test.describe(
  `Indicator data upload`,
  {
    tag: [TestTag.CI, TestTag.CD],
  },
  () => {
    test('sign in as admin and upload a file, check it appears in the batch table, then delete it and check it is marked as deleted in the batch table', async ({
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

      await test.step('Check API success response is displayed', async () => {
        await uploadPage.checkApiResponsePanelContains('202');
      });

      await test.step('Check that the batch list table is displayed and contains our upload', async () => {
        await uploadPage.checkUploadedBatchListContainerIsVisible(
          csvFileName,
          indicatorId
        );
      });

      await test.step('Delete the batch from the table and check its status is now Deleted', async () => {
        await uploadPage.deleteBatchFromTable(csvFileName);
      });
    });
  }
);
