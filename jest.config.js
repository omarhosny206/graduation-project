const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest-setup.js'],
  testMatch: ['**/**/**/**/*.test.ts'],
  collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/__tests__/**/*.ts'],
  // coverageReporters: ['text', 'lcov'],
  // coverageDirectory: '<rootDir>/coverage',
  // collectCoverage: true,
  // collectCoverageFrom: ['src/**/*.ts'],
  // coveragePathIgnorePatterns: ['./src/__tests__'],
  // verbose: true,
  // forceExit: true,
  // clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,
  testTimeout: 20000,
};
