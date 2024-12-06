export const getById = (ID: string): Cypress.Chainable => {
  return cy.get(`[id="${ID}"]`);
};

export const getByClass = (className: string): Cypress.Chainable => {
  return cy.get(`[class="${className}"]`);
};

export const getByType = (type: string): Cypress.Chainable => {
  return cy.get(`[type="${type}"]`);
};

export const getByDataTestId = (id: string): Cypress.Chainable => {
  return cy.get(`[data-testid="${id}"]`);
};
