import BasePage from '../basePage';

export default class SearchPage extends BasePage {
  readonly indicatorField = 'indicator';
  readonly searchButton = 'submit';

  typeIndicator = (indicator: string) => {
    return cy.getById(this.indicatorField).type(indicator);
  };

  clickSearchButton = () => {
    return cy.getByType(this.searchButton).click();
  };

  navigateToSearch = () => {
    this.navigateTo('search');
  };

  checkURLIsCorrect = () => {
    return this.checkURL(`search`);
  };
}
