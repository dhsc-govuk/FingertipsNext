import * as Pages from '../page-objects/pageFactory';

describe('Search Page', () => {
  it('search via indicator and assert results', () => {
    // Arrange
    const indicator = '123';
    Pages.searchPage.navigateToSearch();

    // Assert
    Pages.searchPage.checkURLIsCorrect();
    Pages.searchPage.checkA11Y();

    // Act
    Pages.searchPage.typeIndicator(indicator);
    Pages.searchPage.clickSearchButton();

    // Assert
    Pages.resultsPage.checkURLIsCorrect(indicator);
    Pages.resultsPage.checkA11Y();
    Pages.resultsPage.checkSearchResults(indicator);
  });
});
