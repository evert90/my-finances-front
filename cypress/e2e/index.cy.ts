import {cy, expect, describe, it, Cypress} from 'local-cypress'

describe('Index', () => {
    it('should redirect to login page', () => {
        cy.visit('/')

        cy.location().should((location) => {
            expect(location.origin).to.eq(Cypress.config().baseUrl)
            expect(location.pathname).to.eq('/auth/login')
            expect(location.search).to.eq('?returnUrl=%2F')
        })

        cy.dataCy('test')
        .contains("Entre com sua conta")
        .should('be.visible')
    })
})

