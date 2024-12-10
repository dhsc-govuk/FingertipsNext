import { test } from '../page-objects/pageFactory';

const indicator = '123';

test.describe('Search Page', () => {
  test.beforeEach(async ({ searchPage }) => {
    // Arrange
    await searchPage.navigateToSearch();
  });

  test('via indicator and assert results', async ({
    searchPage,
    resultsPage,
  }) => {
    // Assert
    await searchPage.checkURLIsCorrect();

    // Act
    await searchPage.typeIndicator(indicator);
    await searchPage.clickSearchButton();

    // Assert
    await resultsPage.checkURLIsCorrect(indicator);
    await resultsPage.checkSearchResults(indicator);
  });
});
