/// <reference types="cypress" />

import { getByClass, getById, getByType } from "./selectorHelpers";

declare global {
  namespace Cypress {
    interface Chainable {
      getById: typeof getById;
      getByClass: typeof getByClass;
      getByType: typeof getByType;
    }
  }
}

Cypress.Commands.add('getById', getById);
Cypress.Commands.add('getByClass', getByClass);
Cypress.Commands.add('getByType', getByType);