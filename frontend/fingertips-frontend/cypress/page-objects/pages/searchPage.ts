import BasePage from '../basePage';

export default class SearchPage extends BasePage {
  readonly indicatorField = 'search-form-input-indicator';
  readonly searchButton = 'search-form-button-submit';

  typeIndicator = (indicator: string) => {
    return cy.getByDataTestId(this.indicatorField).type(indicator);
  };

  clickSearchButton = () => {
    return cy.getByDataTestId(this.searchButton).click();
  };

  navigateToSearch = () => {
    this.navigateTo('search');
  };

  checkIsDisplayed = () => {
    return cy.getById(this.indicatorField).should('exist');
  };
}
