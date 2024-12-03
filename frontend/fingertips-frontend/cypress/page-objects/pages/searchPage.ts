import BasePage from '../BasePage';

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
    const basePage = new BasePage();
    basePage.navigateTo('search');
  };
}
