function getMatCell(row: number, column: number) {
  if (column > 13) {
    throw new Error('Column must be less than 14');
  }
  const rowMod = row * 14;
  const columnMod = column;
  return cy.get('.mat-mdc-cell').eq(rowMod + columnMod);
}

describe('Mat Table Tab', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load', () => {
    cy.get('.mat-mdc-tab').eq(0).should('contain.text', 'Mat Table');
  });

  it('should display row details when the row is clicked', () => {
    getMatCell(0, 0).should('contain.text', 'Hydrogen');
    getMatCell(0, 12).should('contain.text', 'keyboard_arrow_down');
    getMatCell(0, 13).should('contain.text', 'Hydrogen');
    getMatCell(0, 13).invoke('height').should('eq', 0);
    getMatCell(1, 0).should('contain.text', 'Helium');

    getMatCell(0, 0).click();

    getMatCell(0, 12).should('contain.text', 'keyboard_arrow_up');
    getMatCell(0, 13).should('contain.text', 'Hydrogen');
    getMatCell(0, 13).invoke('height').should('be.gt', 0);
  });

  it('should overflow extra rows with a scroll bar', () => {
    getMatCell(20, 0).should('contain.text', 'Scandium').not('be.visible');
    getMatCell(20, 0).scrollIntoView().should('be.visible');
  });

  it('should sort the table when a column header is clicked', () => {
    getMatCell(0, 0).should('contain.text', 'Hydrogen');
    getMatCell(1, 0).should('contain.text', 'Helium');

    cy.get('.mat-mdc-header-cell').eq(0).click();

    getMatCell(0, 0).should('contain.text', 'Actinium');
    getMatCell(1, 0).should('contain.text', 'Aluminium');

    cy.get('.mat-mdc-header-cell').eq(0).click();

    getMatCell(0, 0).should('contain.text', 'Zirconium');
    getMatCell(1, 0).should('contain.text', 'Zinc');
  });

  it('should change the number of rows displayed when the paginator is changed', () => {
    getMatCell(0, 0).should('contain.text', 'Hydrogen');
    getMatCell(5, 0).should('exist');

    cy.get('.mat-mdc-paginator-touch-target').click();
    cy.get('.mat-mdc-option').eq(0).click();

    getMatCell(0, 0).should('contain.text', 'Hydrogen');
    getMatCell(5, 0).should('not.exist');
  });

  it('should change the page when the paginator is clicked', () => {
    getMatCell(0, 0).should('contain.text', 'Hydrogen');

    cy.get('.mat-mdc-paginator-navigation-next').click();

    getMatCell(0, 0).should('contain.text', 'Iron');
  });
});
