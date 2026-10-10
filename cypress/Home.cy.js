describe('Home Page', () => {
  it('should load successfully and display the welcome message', () => {
    // Visit the root of your application
    cy.visit('http://localhost:3000'); // Use your frontend's dev server URL

    cy.contains('Report Civic Issues').should('be.visible');
  });
});
