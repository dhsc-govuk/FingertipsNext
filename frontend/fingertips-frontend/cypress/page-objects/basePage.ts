const baseUrl = Cypress.config('baseUrl');

export default class BasePage {
  checkURL = (checkURL: string) => {
    return cy.url().should('contain', `${baseUrl}${checkURL}`);
  };

  navigateTo = (page: string) => {
    return cy.visit(`${baseUrl}${page}`);
  };

  checkA11y = () => {
    return cy.a11y();
  };
}
