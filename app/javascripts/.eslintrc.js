/**
 * @type {ESLint.ConfigData}
 */
module.exports = {
  overrides: [
    {
      files: ['**/*.{cjs,js,mjs}'],
      excludedFiles: ['**/*.test.{cjs,js,mjs}'],
      extends: ['plugin:es-x/restrict-to-es2015', 'prettier'],
      env: {
        browser: true
      },
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: '2015'
      },
      plugins: ['es-x'],
      rules: {
        // Babel transpiles ES2022 class static fields
        'es-x/no-class-static-fields': 'off'
      }
    }
  ]
}

/**
 * @import { ESLint } from 'eslint'
 */
