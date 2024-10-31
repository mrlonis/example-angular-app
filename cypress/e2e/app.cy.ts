describe('example-angular-app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should load', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.get('.mat-mdc-cell').eq(0).should('contain.text', 'Hydrogen');
  });
});
