module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test match patterns
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/__tests__/',
    '/config/'
  ],
  coverageReporters: ['text', 'lcov'],

  // Test timeout
  testTimeout: 10000,

  // Setup files
  setupFiles: ['dotenv/config'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true
};