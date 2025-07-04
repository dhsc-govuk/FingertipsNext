import { test } from '../../page-objects/pageFactory';
import { TestTag } from '../../testHelpers/genericTestUtilities';

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

        await uploadPage.fillInUploadForm();

        await uploadPage.clickUploadButton();
      });
      await test.step('Check API response is displayed', async () => {
        await uploadPage.checkApiResponsePanelContainsASuccessMessage();
      });
    });
  }
);
