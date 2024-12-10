import BasePage from '../basePage';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  readonly backLink = 'search-results-back-link';

  checkSearchResults = (searchTerm: string) => {
    return cy.contains(this.resultsText + ` "${searchTerm}"`);
  };

  clickBackLink = () => {
    return cy.getByDataTestId(this.backLink);
  };

  checkURLIsCorrect = (indicator: string) => {
    return this.checkURL(`search/results?indicator=${indicator}`);
  };

  checkResultsAreDisplayed = () => {
    return cy.get('[data-testid="search-result"]').should('have.length', 2);
  };
}
