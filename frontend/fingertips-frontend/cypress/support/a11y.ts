import { Result } from 'axe-core';

// The WCAG level we want to test to, note that a set of rules apply to each item in the array
// so they are cumulative so to define to high level you need to specify each lower level
const WCAG_LEVEL = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

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
  cy.configureAxe({
    tags: [WCAG_LEVEL],
    rules: [
      {
        id: 'landmark-one-main',
        enabled: false,
      },
      {
        id: 'page-has-heading-one',
        enabled: false,
      },
      {
        id: 'region',
        enabled: false,
      },
    ],
  });
  cy.checkA11y(undefined, undefined, terminalLog);
  return cy;
};
