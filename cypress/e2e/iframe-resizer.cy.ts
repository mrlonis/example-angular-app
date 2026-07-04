describe('Iframe resizer tab', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the iframe tab in the tab list', () => {
    cy.contains('[role="tab"]', 'iframe-resizer').should('exist');
  });

  it('renders iframe with expected security and sizing attributes when selected', () => {
    cy.contains('[role="tab"]', 'iframe-resizer').click();

    cy.get('iframe[appiframeresizer]')
      .should('exist')
      .and('be.visible')
      .and('have.attr', 'width', '100%')
      .and('have.attr', 'allow', 'microphone')
      .and('have.attr', 'sandbox')
      .and('include', 'allow-scripts')
      .and('include', 'allow-same-origin');

    cy.get('iframe[appiframeresizer]')
      .should('have.attr', 'src')
      .and('include', 'iframetester.com');
  });

  it('can switch between tabs without losing iframe visibility', () => {
    cy.contains('[role="tab"]', 'iframe-resizer').click();
    cy.get('iframe[appiframeresizer]').should('be.visible');

    cy.contains('[role="tab"]', 'Mat Table').click();
    cy.get('app-mat-table').should('exist');

    cy.contains('[role="tab"]', 'iframe-resizer').click();
    cy.get('iframe[appiframeresizer]').should('be.visible');
  });
});
