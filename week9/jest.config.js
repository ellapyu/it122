/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm', // Use ESM preset for ts-jest
  testEnvironment: 'jsdom', // Simulates a browser environment
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat TypeScript files as ES Modules
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM support
    },
  },
};
