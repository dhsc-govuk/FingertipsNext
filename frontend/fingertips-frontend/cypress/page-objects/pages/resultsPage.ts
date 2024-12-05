import BasePage from '../basePage';

export default class ResultsPage extends BasePage {
  readonly resultsText = 'You searched for indicator';
  readonly backLink = 'src__StyledBackLink-sc-159gh4v-0 bRAlsd';

  checkSearchResults = (searchTerm: string) => {
    return cy.contains(this.resultsText + ` "${searchTerm}"`);
  };

  clickBackLink = () => {
    return cy.getByClass(this.backLink);
  };

  checkURLIsCorrect = (indicator: string) => {
    return this.checkURL(`search/results?indicator=${indicator}`);
  };
}
