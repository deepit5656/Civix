describe('Application Navigation', () => {
  it('should load the home page successfully', () => {
    // Visit the base URL of the frontend application
    cy.visit('http://localhost:3000'); // Adjust port if needed

    // Assert that the main heading is visible on the page
    cy.contains('Report Civic Issues').should('be.visible');
  });
});
