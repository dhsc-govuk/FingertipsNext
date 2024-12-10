import * as Pages from '../page-objects/pageFactory';

describe('Search Page', () => {
  it('search via indicator and assert results', () => {
    // Arrange
    const indicator = '123';
    Pages.searchPage.navigateToSearch();

    // Act
    Pages.searchPage.typeIndicator(indicator);
    Pages.searchPage.clickSearchButton();

    // Assert
    Pages.resultsPage.checkURLIsCorrect(indicator);
    Pages.resultsPage.checkSearchResults(indicator);
    Pages.resultsPage.checkResultsAreDisplayed();
  });

  it('should go back to search page', async () => {
    // Arrange
    const indicator = '123';
    Pages.searchPage.navigateToSearch();

    // Act
    Pages.searchPage.typeIndicator(indicator);
    Pages.searchPage.clickSearchButton();
    Pages.resultsPage.clickBackLink();

    // Assert
    Pages.searchPage.checkIsDisplayed();
  });
});
