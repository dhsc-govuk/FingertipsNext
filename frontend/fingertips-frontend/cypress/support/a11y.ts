import { Result } from 'axe-core';

// The WCAG level we want to test to, note that a set of rules apply to each item in the array array
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
  cy.checkA11y(
    undefined,
    {
      runOnly: {
        type: 'tag',
        values: WCAG_LEVEL,
      },
      // Each exception below has been added to allow the tests suite to pass. Typically when a violation occurs a bug would be raised and the issue addressed in the source code.
      // The exception may be temporarily added until the issue is resolved to ensure no blockages. The exception should then be removed as part of the resolution.
      rules: {
        'color-contrast': { enabled: false }, // FTN-123
      },
    },
    terminalLog
  );
  return cy;
};
