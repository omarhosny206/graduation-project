const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest-setup.js'],
  testMatch: ['**/**/**/**/*.test.ts'],
  // verbose: true,
  // forceExit: true,
  // clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,
  testTimeout: 20000,
};
