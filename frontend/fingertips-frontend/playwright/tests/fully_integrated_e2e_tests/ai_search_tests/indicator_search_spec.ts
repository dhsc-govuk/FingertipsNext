import { SearchMode, TestTag } from '@/playwright/testHelpers';
import { test } from '../../../page-objects/pageFactory';

test.describe(
  'Azure AI Search: Indicator search',
  {
    tag: TestTag.CD,
  },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await test.step('Navigate to home page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });
    });
    test('searching by indicator id absent from any indicator name should only return one result', async ({
      homePage,
      resultsPage,
    }) => {
      test.step('do the thing', async () => {
        await homePage.searchForIndicators(SearchMode.ONLY_SUBJECT, '93763');
        await homePage.clickSearchButton();

        await resultsPage.checkNumberOfResults(1);
        await resultsPage.checkFirstResultHasName('Alcohol-related mortality');
      });
    });

    test('searching by exact indicator name should return that indicator as the first result', async ({
      homePage,
      resultsPage,
    }) => {
      const indicatorName =
        'Emergency hospital admissions due to falls aged 65 years and over';

      test.step('do the thing', async () => {
        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          indicatorName
        );
        await homePage.clickSearchButton();

        await resultsPage.checkFirstResultHasName(indicatorName);
      });
    });

    test('searching by ', async ({ homePage, resultsPage }) => {
      test.step('do the thing', async () => {
        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          'Alzheimers'
        );
        await homePage.clickSearchButton();

        await resultsPage.checkResultsContainText("Alzheimer's");
      });
    });
  }
);
