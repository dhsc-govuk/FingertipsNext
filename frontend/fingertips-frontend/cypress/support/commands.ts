/// <reference types="cypress" />

import { a11y } from './a11y';
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
      a11y: typeof a11y;
      getByDataTestId: typeof getByDataTestId;
    }
  }
}

Cypress.Commands.add('getById', getById);
Cypress.Commands.add('getByClass', getByClass);
Cypress.Commands.add('getByType', getByType);
Cypress.Commands.add('a11y', a11y);
Cypress.Commands.add('getByDataTestId', getByDataTestId);
