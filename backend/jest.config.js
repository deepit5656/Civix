module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000, // Increase timeout for database setup
  setupFilesAfterEnv: ['./jest.setup.js'], // Optional: for global setup
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
