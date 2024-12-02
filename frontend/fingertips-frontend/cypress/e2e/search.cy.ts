import * as Pages from '../page-objects/pageFactory';

describe('Search Page', () => {
  it('search via indicator', () => {
    // Arrange
    const indicator = '123';
    Pages.searchPage.navigateToSearch();

    // Act
    Pages.searchPage.typeIndicator(indicator);
    Pages.searchPage.clickSearchButton();

    // Assert
    Pages.resultsPage.checkURL(`search/results?indicator=${indicator}`);
    Pages.resultsPage.checkSearchResults(indicator);
  });
});
