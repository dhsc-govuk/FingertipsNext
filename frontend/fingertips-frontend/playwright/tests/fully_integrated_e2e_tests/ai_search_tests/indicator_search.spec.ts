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

    test('searching for equivalent synonyms should return the same results', async ({
      homePage,
      resultsPage,
    }) => {
      await test.step('search for a synonym-mapped indicator and check results', async () => {
        const subjectSearchTerm = 'offspring';

        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          subjectSearchTerm
        );
        await homePage.clickSearchButton();

        await resultsPage.checkAnyResultNameContainsText(
          'Smokers at time of childbirth delivery'
        );
      });

      await test.step('search for synonym of indicator and check results match', async () => {
        const subjectSearchTerm = 'infant';

        await resultsPage.clearIndicatorSearchBox();
        await resultsPage.fillIndicatorSearch(subjectSearchTerm);
        await resultsPage.clickIndicatorSearchButton();

        await resultsPage.checkAnyResultNameContainsText(
          'Smokers at time of childbirth delivery'
        );
      });
    });

    test('searching for the synonym of an explicitly mapped term should return fewer results than the mapped term', async ({
      homePage,
      resultsPage,
    }) => {
      /**
       * There are scenarios where this won't be the case
       * eg when all the results are derived from a single synonym term
       * however this shows that the synonyms that return no/fewer results are not equivalently mapped
       */
      await test.step('search for explicitly mapped acronym', async () => {
        const subjectSearchTerm = 'chd';

        await homePage.searchForIndicators(
          SearchMode.ONLY_SUBJECT,
          subjectSearchTerm
        );
        await homePage.clickSearchButton();

        await resultsPage.checkNumberOfResults(3);
        await resultsPage.checkFirstResultHasName(
          'Preventable sight loss from diabetic eye disease'
        );
      });

      await test.step('search for synonym of indicator and check results do not match', async () => {
        const subjectSearchTerm = 'coronary';

        await resultsPage.clearIndicatorSearchBox();
        await resultsPage.fillIndicatorSearch(subjectSearchTerm);
        await resultsPage.clickIndicatorSearchButton();

        await resultsPage.checkNumberOfResults(0);
      });
    });
  }
);
