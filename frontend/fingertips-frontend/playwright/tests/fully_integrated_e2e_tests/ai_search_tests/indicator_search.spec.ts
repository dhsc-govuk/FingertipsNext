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
      await test.step('search for an indicator by ID and check results', async () => {
        const subjectSearchTerm = '93763';
        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          subjectSearchTerm
        );
        await homePage.clickSearchButton();

        await resultsPage.checkNumberOfResults(1);
        await resultsPage.checkFirstResultHasName('Alcohol-related mortality');
      });
    });

    test('searching by exact indicator name should return that indicator as the first result', async ({
      homePage,
      resultsPage,
    }) => {
      const subjectSearchTerm =
        'Emergency hospital admissions due to falls aged 65 years and over';

      await test.step('search for an indicator by exact name and check results', async () => {
        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          subjectSearchTerm
        );
        await homePage.clickSearchButton();

        await resultsPage.checkFirstResultHasName(subjectSearchTerm);
      });
    });

    test('searches with a minor spelling or punctuation error should return relevant results', async ({
      homePage,
      resultsPage,
    }) => {
      await test.step('search for an indicator with missing apostrophe and check results', async () => {
        const subjectSearchTerm = 'Alzheimers';

        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          subjectSearchTerm
        );
        await homePage.clickSearchButton();

        await resultsPage.checkAnyResultNameContainsText("Alzheimer's");
      });
    });
  }
);
