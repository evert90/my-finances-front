/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

export { };

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-testid="${value}"]`)
})

Cypress.Commands.add('clearAndType', {
  prevSubject: true,
}, (subject, text) => {
  cy.wrap(subject)
    .clear()
    .then(() => cy.wrap(subject).should('be.empty'))
    .then(() => cy.wrap(subject).type(text))
    .then(() => cy.wrap(subject).should('have.value', text));
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      clearAndType(text: string): Chainable<JQuery<HTMLElement>>,
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
    }
  }
}