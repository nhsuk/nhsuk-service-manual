import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import pluginMarkdown from '@eslint/markdown'
import { defineConfig, globalIgnores } from 'eslint/config'
import configPrettier from 'eslint-config-prettier/flat'
import pluginESx from 'eslint-plugin-es-x'
import pluginImport from 'eslint-plugin-import'
import pluginJest from 'eslint-plugin-jest'
import pluginJestDom from 'eslint-plugin-jest-dom'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginNode from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'
import pluginTypeScript from 'typescript-eslint'

const rootPath = resolve(fileURLToPath(new URL('.', import.meta.url)))
const gitignorePath = join(rootPath, '.gitignore')

export default defineConfig([
  {
    files: ['**/*.{cjs,js,mjs}'],
    extends: [
      eslint.configs.recommended,
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
      pluginJsdoc.configs['flat/recommended-typescript-flavor'],
      pluginPromise.configs['flat/recommended'],
      configPrettier
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest'
      }
    },
    rules: {
      // Turn off rules that are handled by TypeScript
      // https://typescript-eslint.io/troubleshooting/typed-linting/performance/#eslint-plugin-import
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      // Always import Node.js packages from `node:*`
      'import/enforce-node-protocol-usage': ['error', 'always'],

      // Check import or require statements are A-Z ordered
      'import/order': [
        'error',
        {
          'alphabetize': { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // Check for valid formatting
      'jsdoc/check-line-alignment': [
        'warn',
        'never',
        {
          wrapIndent: '  '
        }
      ],

      // JSDoc blocks can use `@preserve` to prevent removal
      'jsdoc/check-tag-names': [
        'warn',
        {
          definedTags: ['preserve']
        }
      ],

      // JSDoc blocks are optional by default
      'jsdoc/require-jsdoc': 'off',

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

      // JSDoc @param required in (optional) blocks but
      // @param description is not necessary by default
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param': 'off',

      // JSDoc @returns is optional
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'off',

      // Maintain new line after description
      'jsdoc/tag-lines': [
        'warn',
        'never',
        {
          startLines: 1
        }
      ],

      // Automatically use template strings
      'no-useless-concat': 'error',
      'prefer-template': 'error',

      // Flow control – avoid continue and else blocks after return statements
      // in if statements
      'no-continue': 'error',
      'no-else-return': 'error',

      // Avoid hard to read multi assign statements
      'no-multi-assign': 'error'
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true
      }
    }
  },
  {
    // Configure ESLint for ES modules
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            cjs: 'always',
            js: 'always',
            mjs: 'always'
          }
        }
      ]
    }
  },
  {
    // Configure ESLint for Node.js
    files: ['**/*.{cjs,js,mjs}'],
    ignores: ['app/javascripts/**/*.mjs', '!**/*.test.mjs'],
    extends: [
      pluginTypeScript.configs.strict,
      pluginTypeScript.configs.stylistic,
      pluginNode.configs['flat/recommended']
    ],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/unbound-method': 'off'
    }
  },
  {
    // Configure ESLint for browsers
    files: ['app/javascripts/**/*.mjs', '**/*.md/*.{cjs,js,mjs}'],
    ignores: ['**/*.test.mjs'],
    extends: [
      pluginTypeScript.configs.strict,
      pluginTypeScript.configs.stylistic,
      pluginESx.configs['flat/restrict-to-es2015']
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Note: Allow ES2015 for import/export syntax
        ecmaVersion: 2015
      }
    },
    rules: {
      // Babel transpiles ES2022 class static fields
      'es-x/no-class-static-fields': 'off'
    }
  },
  {
    // Configure ESLint in test files
    files: ['**/*.test.mjs'],
    extends: [
      pluginJest.configs['flat/recommended'],
      pluginJest.configs['flat/style'],
      pluginJestDom.configs['flat/recommended']
    ],
    languageOptions: {
      globals: pluginJest.environments.globals.globals
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off'
    }
  },
  {
    // Configure ESLint in test files (Jest JSDOM environment only)
    files: ['**/*.jsdom.test.mjs', '**/jest.jsdom.setup.*'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.environments.globals.globals
      }
    }
  },
  {
    // Configure ESLint in test files (Jest Puppeteer environment only)
    files: ['**/*.puppeteer.test.mjs', '**/jest.puppeteer.setup.*'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.environments.globals.globals,
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      }
    }
  },
  {
    // Configure ESLint in Markdown files
    files: ['**/*.md'],
    extends: [pluginMarkdown.configs.processor],
    language: 'markdown/gfm'
  },
  {
    // Configure ESLint in Markdown code blocks
    files: ['**/*.md/*.{cjs,js,mjs}'],
    extends: [pluginTypeScript.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  globalIgnores([
    '**/coverage/',
    '**/dist/',

    // Enable dotfile linting
    '!.*',
    'node_modules/',
    'node_modules/.*',

    // Prevent CHANGELOG history changes
    'CHANGELOG.md'
  ]),
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns')
])
