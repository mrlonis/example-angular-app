describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});
