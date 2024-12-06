/// <reference types="cypress" />

import {
  getByClass,
  getById,
  getByType,
  getByDataTestId,
} from './selectorHelpers';

declare global {
  namespace Cypress {
    interface Chainable {
      getById: typeof getById;
      getByClass: typeof getByClass;
      getByType: typeof getByType;
      getByDataTestId: typeof getByDataTestId;
    }
  }
}

Cypress.Commands.add('getById', getById);
Cypress.Commands.add('getByClass', getByClass);
Cypress.Commands.add('getByType', getByType);
Cypress.Commands.add('getByDataTestId', getByDataTestId);
