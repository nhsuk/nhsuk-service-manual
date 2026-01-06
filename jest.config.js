/**
 * Jest config
 *
 * @type {Config}
 */
export default {
  cacheDirectory: '<rootDir>/.cache/jest',
  collectCoverageFrom: [
    '<rootDir>/app.js',
    '<rootDir>/app/**/*.{js,mjs}',
    '<rootDir>/lib/**/*.{js,mjs}',
    '<rootDir>/middleware/**/*.{js,mjs}'
  ],

  // Reset mocks between tests
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  clearMocks: true,

  // Enable GitHub Actions reporter UI
  reporters: ['default', 'github-actions'],

  // Enable Babel transforms until Jest supports ESM and `import()`
  // See: https://jestjs.io/docs/ecmascript-modules
  transform: {
    '^.+\\.(js|mjs)$': ['babel-jest', { rootMode: 'upward' }]
  }
}

/**
 * @typedef {Exclude<Config['projects'][0], string>} ProjectConfig
 */

/**
 * @import { Config } from 'jest'
 */
