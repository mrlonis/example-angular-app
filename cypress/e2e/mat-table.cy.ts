describe('Mat Table Tab', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should load', () => {
    cy.get('.mat-mdc-tab').eq(0).should('contain.text', 'Mat Table');
  });

  it('should display row details when the row is clicked', () => {
    cy.get('.mat-mdc-cell').eq(0).should('contain.text', 'Hydrogen');
    cy.get('.mat-mdc-cell').eq(12).should('contain.text', 'keyboard_arrow_down');
    cy.get('.mat-mdc-cell').eq(13).should('contain.text', 'Hydrogen');
    cy.get('.mat-mdc-cell').eq(13).invoke('height').should('eq', 0);
    cy.get('.mat-mdc-cell').eq(14).should('contain.text', 'Helium');

    cy.get('.mat-mdc-cell').eq(0).click();

    cy.get('.mat-mdc-cell').eq(12).should('contain.text', 'keyboard_arrow_up');
    cy.get('.mat-mdc-cell').eq(13).should('contain.text', 'Hydrogen');
    cy.get('.mat-mdc-cell').eq(13).invoke('height').should('be.gt', 0);
  });
});
