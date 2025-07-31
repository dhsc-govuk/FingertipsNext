import path from 'path';
import { test } from '../../page-objects/pageFactory';
import {
  buildRandomisedCSVFileName,
  SignInAs,
  TestTag,
} from '../../testHelpers/genericTestUtilities';

const indicatorId = '41101';
const baseCsvFileName = 'playwright_indicator_data.csv';
const pathToExampleCsv = path.join(
  __dirname,
  '..',
  '..',
  'resources',
  baseCsvFileName
);
let pathToRandomisedCsv: string;
let randomisedCSVFileName: string;

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
    test.beforeAll(async () => {
      ({ pathToRandomisedCsv, randomisedCSVFileName } =
        await buildRandomisedCSVFileName(pathToExampleCsv));
    });

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
          pathToCsv: pathToRandomisedCsv,
        });

        await uploadPage.clickUploadButton();
      });

      await test.step('Check API success response is displayed', async () => {
        await uploadPage.checkApiResponsePanelContains('202');
      });

      await test.step('Check that the batch list table is displayed and contains our upload', async () => {
        await uploadPage.checkUploadedBatchListContainerIsVisible(
          randomisedCSVFileName
        );
      });

      await test.step('Delete the batch from the table and check its status is now Deleted', async () => {
        await uploadPage.deleteBatchFromTable(randomisedCSVFileName);

        await uploadPage.checkDeletedBatchIsMarkedAsDeleted(
          randomisedCSVFileName
        );
      });
    });
  }
);
