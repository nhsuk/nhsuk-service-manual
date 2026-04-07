const filters = require('nhsuk-frontend/dist/nhsuk/lib/nunjucks/filters/index.js')

/**
 * Format strings into kebab case but also
 * handles `errorMessage` → `error-message`
 *
 * @param {string} string - String to format
 * @returns {string} Kebab case string
 */
function kebabCase(string) {
  return string
    .replaceAll(/\W+/g, '-')
    .replaceAll(/\B([A-Z])(?=[a-z])/g, '-$1')
    .replaceAll(/\B([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

module.exports = { ...filters, kebabCase }
