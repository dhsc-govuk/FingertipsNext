import BasePage from '../basePage';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  checkSearchResults = (contains: string) => {
    return cy.contains(this.resultsText + ` "${contains}"`);
  };
}
