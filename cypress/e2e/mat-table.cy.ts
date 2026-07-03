function getDataRows() {
  return cy.get('tr.mat-mdc-row.example-element-row');
}

function getRow(index: number) {
  return getDataRows().eq(index);
}

function getFirstRowNameCell() {
  return getRow(0).find('td.mat-column-name');
}

describe('Mat table tab', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('[role="tab"]', 'Mat Table').should('have.attr', 'aria-selected', 'true');
  });

  it('renders expected default columns and footer summary', () => {
    cy.get('th.mat-column-name').should('contain.text', 'name');
    cy.get('th.mat-column-atomic_mass').should('contain.text', 'atomic_mass');
    cy.get('th.mat-column-symbol').should('contain.text', 'symbol');
    cy.get('th[aria-label="row actions"]').should('exist');

    cy.get('td.mat-column-name.mat-mdc-footer-cell').should('contain.text', 'Total # of elements:');
    cy.get('td.mat-column-atomic_mass.mat-mdc-footer-cell')
      .invoke('text')
      .then((text) => {
        const total = Number.parseInt(text.trim(), 10);
        expect(total).to.be.greaterThan(100);
      });
  });

  it('expands and collapses details when a row is clicked', () => {
    getRow(0).as('hydrogenRow');
    cy.get('@hydrogenRow').should('contain.text', 'Hydrogen');
    cy.get('@hydrogenRow').should('not.have.class', 'example-expanded-row');

    cy.get('@hydrogenRow').click();
    cy.get('@hydrogenRow').should('have.class', 'example-expanded-row');
    cy.get('div.example-element-detail-wrapper-expanded').should('contain.text', 'Hydrogen');

    cy.get('@hydrogenRow').click();
    cy.get('@hydrogenRow').should('not.have.class', 'example-expanded-row');
  });

  it('uses the expand icon button to toggle row details and icon state', () => {
    getRow(0).within(() => {
      cy.get('button[aria-label="expand row"]').as('expandButton');
      cy.get('@expandButton').should('contain.text', 'keyboard_arrow_down');
      cy.get('@expandButton').click();
      cy.get('@expandButton').should('contain.text', 'keyboard_arrow_up');
      cy.get('@expandButton').click();
      cy.get('@expandButton').should('contain.text', 'keyboard_arrow_down');
    });
  });

  it('allows only one expanded row at a time', () => {
    getRow(0).click();
    getRow(0).should('have.class', 'example-expanded-row');

    getRow(1).click();
    getRow(0).should('not.have.class', 'example-expanded-row');
    getRow(1).should('have.class', 'example-expanded-row');
  });

  it('sorts by name column in both directions', () => {
    getFirstRowNameCell().should('contain.text', 'Hydrogen');
    getRow(1).find('td.mat-column-name').should('contain.text', 'Helium');

    cy.get('th.mat-column-name').click();
    getFirstRowNameCell().should('contain.text', 'Actinium');
    getRow(1).find('td.mat-column-name').should('contain.text', 'Aluminium');

    cy.get('th.mat-column-name').click();
    getFirstRowNameCell().should('contain.text', 'Zirconium');
    getRow(1).find('td.mat-column-name').should('contain.text', 'Zinc');
  });

  it('changes page size using paginator options', () => {
    getDataRows().should('have.length', 25);
    cy.get('.mat-mdc-paginator-touch-target').click();
    cy.contains('mat-option', '5').click();
    getDataRows().should('have.length', 5);
  });

  it('changes current page when next button is clicked', () => {
    getFirstRowNameCell().should('contain.text', 'Hydrogen');
    cy.get('.mat-mdc-paginator-navigation-next').click();
    getFirstRowNameCell().should('contain.text', 'Iron');
  });

  it('filters rows case-insensitively with trimmed input and resets paginator to first page', () => {
    cy.get('.mat-mdc-paginator-navigation-next').click();
    getFirstRowNameCell().should('contain.text', 'Iron');

    cy.get('input[matinput]').type('  zInc  ');
    cy.get('.mat-mdc-paginator-range-label').should('contain.text', 'of 3');
    getFirstRowNameCell().should('contain.text', 'Zinc');

    cy.get('input[matinput]').clear();
    getFirstRowNameCell().should('contain.text', 'Hydrogen');
  });

  it('supports selecting displayed columns from the column chooser', () => {
    cy.get('th[aria-label="row actions"] mat-select').click();
    cy.contains('mat-option', 'atomic_mass').click();
    cy.get('body').click(0, 0);

    cy.get('th.mat-column-atomic_mass').should('not.exist');
    cy.get('td.mat-column-atomic_mass').should('not.exist');
    cy.get('th.mat-column-name').should('exist');
  });
});
