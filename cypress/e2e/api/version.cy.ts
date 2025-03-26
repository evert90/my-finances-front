describe('Version', () => {
    it('should get version', () => {
        cy.request('/api/version')
            .should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('version');

            // Verifica se o valor de 'version' é um commit SHA válido
            const commitShaRegex = /^[0-9a-f]{7,40}$/;
            expect(response.body.version).to.match(commitShaRegex);
        });
    })
})
