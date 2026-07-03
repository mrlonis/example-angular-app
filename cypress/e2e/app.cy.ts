describe('App shell and routing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the tab layout and mat table content on the default route', () => {
    cy.contains('[role="tab"]', 'Mat Table').should('exist');
    cy.contains('[role="tab"]', 'iframe-resizer').should('exist');
    cy.get('tr.mat-mdc-row.example-element-row')
      .first()
      .find('td.mat-column-name')
      .should('contain.text', 'Hydrogen');
  });

  it('loads the toolbar route directly', () => {
    cy.visit('/toolbar');

    cy.get('app-mat-toolbar').should('exist');
    cy.get('mat-toolbar').should('contain.text', 'My App');
  });

  it('opens the side drawer from the toolbar menu button', () => {
    cy.visit('/toolbar');

    cy.get('mat-drawer').should('not.have.class', 'mat-drawer-opened');
    cy.get('mat-toolbar button').first().click();
    cy.get('mat-drawer').should('have.class', 'mat-drawer-opened');
    cy.get('mat-drawer').should('contain.text', 'Mat Table');
    cy.get('mat-drawer').should('contain.text', 'iframe-resizer');
  });
});
