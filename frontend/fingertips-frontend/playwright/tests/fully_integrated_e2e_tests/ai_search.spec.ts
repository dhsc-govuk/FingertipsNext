import { test } from '../../page-objects/pageFactory';

test.describe('Azure AI Search', () => {
  // Skip if not testing against a deployed site with connection to Azure AI search
  test.skip(
    !process.env.USING_AI_SEARCH,
    'Skipping AI Search tests as environment is deployed with mock search'
  );

  const testPostcode = 'LE12 8PY';
  const fullMatchingGp = 'Barrow Health Centre';
  const partialMatchingGp = 'Quorn Medical Centre';

  test('returns multiple relevant results for a partial postcode', async ({
    homePage,
  }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
    });

    await test.step('Fill in partial postcode and check results', async () => {
      await homePage.checkAreaSuggestionPanelContainsItems(
        testPostcode.substring(0, 6),
        [partialMatchingGp, fullMatchingGp]
      );
    });
  });

  test('returns matching result by postcode for a full postcode search', async ({
    homePage,
  }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      await homePage.checkOnHomePage();
    });

    await test.step('Fill in full postcode and check results', async () => {
<<<<<<< HEAD
      await homePage.checkAreaSuggestionPanelContainsItems(testPostcode, [
        fullMatchingGp,
      ]);
=======
      await homePage.searchForArea(testPostcode);
      await homePage.checkAreaSuggestionsExist([fullMatchingGp]);
>>>>>>> 9f0a56d1 (Ran prettier)
    });
  });
});
