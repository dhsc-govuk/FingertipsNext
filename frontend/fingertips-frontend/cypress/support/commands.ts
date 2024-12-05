/// <reference types="cypress" />

import { getByClass, getById, getByType } from './selectorHelpers';
import { a11y } from './a11y';
declare global {
  namespace Cypress {
    interface Chainable {
      getById: typeof getById;
      getByClass: typeof getByClass;
      getByType: typeof getByType;
      a11y: typeof a11y;
    }
  }
}

Cypress.Commands.add('getById', getById);
Cypress.Commands.add('getByClass', getByClass);
Cypress.Commands.add('getByType', getByType);
Cypress.Commands.add('a11y', a11y);
