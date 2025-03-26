import { faker } from "@faker-js/faker";


describe('Register', () => {
    it('should register a new user', () => {
        cy.visit('/');

        cy.intercept('POST', '**/api/users**').as('createUser')

        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns(Cypress.env('BACKEND_URL'));
        });

        cy.dataCy('api-url')
        .click();

        cy.dataCy('register-link')
        .contains("Criar nova conta")
        .should('be.visible')
        .click();

        cy.dataCy('register-name')
        .type(faker.person.fullName());

        cy.dataCy('register-email')
        .type(faker.internet.email());

        cy.dataCy('register-password')
        .type(Cypress.env('USER_PASSWORD'), { log: false });

        cy.dataCy('register-terms')
        .click();

        cy.dataCy('register-submit')
        .click();

        cy.wait('@createUser', { timeout: 30000 });

        cy.dataCy('toast')
        .contains("Conta cadastrada com sucesso");
    })
})

