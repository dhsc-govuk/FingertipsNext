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
      test.step('search for an indicator by ID and check results', async () => {
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

      test.step('search for an indicator by exact name and check results', async () => {
        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          indicatorName
        );
        await homePage.clickSearchButton();

        await resultsPage.checkFirstResultHasName(indicatorName);
      });
    });

    test('searches with a minor spelling or punctuation error should return relevant results', async ({
      homePage,
      resultsPage,
    }) => {
      test.step('search for an indicator with missing apostrophe and check results', async () => {
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
