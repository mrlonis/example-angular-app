describe('example-angular-app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load', () => {
    cy.get('.mat-mdc-tab').eq(1).should('contain.text', 'iframe-resizer');
  });

  it('should navigate to iframe-resizer tab on click', () => {
    cy.get('.mat-mdc-tab').eq(1).click();
    cy.get('#iFrameResizer0').should('exist').and('be.visible');
  });
});
