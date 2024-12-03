const baseUrl = Cypress.config('baseUrl');

export default class BasePage {
  readonly headerLocator = 'top-nav-inner__TopNavInner-sc-15yph1v-0 gdTVHU';
  readonly footerLocator = 'src__FooterContainer-sc-1t3c5e2-0 dtonUY';
  readonly backLink = 'src__StyledBackLink-sc-159gh4v-0 bRAlsd';

  checkURL = (checkURL: string) => {
    return cy.url().should('contain', `${baseUrl}${checkURL}`);
  };

  navigateTo = (page: string) => {
    return cy.visit(`${baseUrl}${page}`);
  };

  clickBackLink = () => {
    return cy.getByClass(this.backLink);
  };
}
