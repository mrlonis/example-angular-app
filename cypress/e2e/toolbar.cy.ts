describe('Toolbar route', () => {
  beforeEach(() => {
    cy.visit('/toolbar');
  });

  it('renders icon actions and app title in toolbar', () => {
    cy.get('mat-toolbar').should('contain.text', 'My App');
    cy.get('mat-toolbar mat-icon').then((icons) => {
      const iconText = Array.from(icons, (icon) => icon.textContent?.trim());
      expect(iconText).to.include.members(['menu', 'favorite', 'share']);
    });
  });

  it('opens and closes the drawer from the menu button', () => {
    cy.get('mat-drawer').should('not.have.class', 'mat-drawer-opened');
    cy.get('mat-toolbar button').first().click();
    cy.get('mat-drawer').should('have.class', 'mat-drawer-opened');
    cy.get('mat-toolbar button').first().click();
    cy.get('mat-drawer').should('not.have.class', 'mat-drawer-opened');
  });
});
