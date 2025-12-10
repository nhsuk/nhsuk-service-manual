/**
 * Jest project config defaults
 *
 * @type {Config}
 */
const config = {
  cacheDirectory: '<rootDir>/.cache/jest',

  // Reset mocks between tests
  resetMocks: true,
  clearMocks: true,

  // Enable Babel transforms until Jest supports ESM and `import()`
  // See: https://jestjs.io/docs/ecmascript-modules
  transform: {
    '^.+\\.(js|mjs)$': ['babel-jest', { rootMode: 'upward' }]
  }
}

/**
 * Jest config
 *
 * @type {Config}
 */
export default {
  collectCoverageFrom: [
    '<rootDir>/app.js',
    '<rootDir>/app/**/*.{js,mjs}',
    '<rootDir>/lib/**/*.{js,mjs}',
    '<rootDir>/middleware/**/*.{js,mjs}'
  ],
  projects: [
    {
      ...config,
      displayName: 'JavaScript unit tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.unit.test.{js,mjs}']
    },
    {
      ...config,
      displayName: 'JavaScript behaviour tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/**/*.jsdom.test.{js,mjs}']
    }
  ],

  // Enable GitHub Actions reporter UI
  reporters: ['default', 'github-actions']
}

/**
 * @typedef {Exclude<Config['projects'][0], string>} ProjectConfig
 */

/**
 * @import { Config } from 'jest'
 */
