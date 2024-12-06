import { Result } from 'axe-core';

// function to export to terminal the details of a11y violations
const terminalLog = (violations: Result[]) => {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  );
  const violationData = violations.map(({ id, impact, description, tags }) => ({
    id,
    impact,
    description,
    tags,
  }));
  cy.task('table', violationData);
};

// function calling axe-core and cypress-axe to check for violations on a specific page
export const a11y = (): Cypress.Chainable => {
  cy.injectAxe();
  cy.checkA11y(undefined, undefined, terminalLog);
  return cy;
};
