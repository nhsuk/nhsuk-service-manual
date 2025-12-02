module.exports = {
  extends: 'stylelint-config-gds/scss',
  ignoreFiles: [
    '**/public/**',

    // Ignore CSS-in-JS (including dotfiles)
    '**/?(.)*.{cjs,js,mjs}',

    // Prevent CHANGELOG history changes
    'CHANGELOG.md'
  ],
  overrides: [
    {
      customSyntax: 'postcss-markdown',
      files: ['**/*.md']
    },
    {
      customSyntax: 'postcss-scss',
      files: ['**/*.scss'],
      rules: {
        // Disallow hex colours
        // https://stylelint.io/user-guide/rules/color-no-hex/
        'color-no-hex': true,

        // Properties and values that are disallowed
        // https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/
        'declaration-property-value-disallowed-list': {
          'transition': ['all'],
          '/^border/': ['none']
        },

        // Disallow @mixin before @extends
        // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md#extended-at-rule-objects
        'order/order': [
          {
            type: 'at-rule',
            name: 'extend'
          },
          {
            type: 'at-rule',
            name: 'mixin'
          }
        ],

        // Allow underscores (but not numbers) in mixin naming pattern
        // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/at-mixin-pattern
        'scss/at-mixin-pattern': [
          /^([a-z-_])*$/,
          {
            message: 'Mixin names may only contain [a-z-_] characters'
          }
        ],

        // Allow underscores in $variable naming pattern
        // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/dollar-variable-pattern
        'scss/dollar-variable-pattern': [
          /^([a-z0-9-_])*$/,
          {
            message: 'Variable names may only contain [a-z0-9-_] characters'
          }
        ],

        // Allow underscores (but not numbers) in %placeholder naming pattern
        // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/percent-placeholder-pattern
        'scss/percent-placeholder-pattern': [
          /^([a-z-_])*$/,
          {
            message: 'Placeholders may only contain [a-z-_] characters'
          }
        ]
      }
    }
  ],
  plugins: ['stylelint-order']
}
