import BasePage from '../BasePage';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  checkSearchResults = (contains: string) => {
    return cy.contains(this.resultsText + ` "${contains}"`);
  };
}
