const hljs = require('highlight.js')
const { default: slug } = require('slug')

// Highlight Nunjucks as JavaScript
hljs.registerLanguage('njk', require('highlight.js/lib/languages/javascript'))

/**
 * Format code with syntax highlighting
 *
 * @param {string} code - Code in plain text
 * @param {string} [language] - Code programming language
 * @returns {string} Code with syntax highlighting
 */
function highlight(code, language) {
  const languages = language ? [language] : false
  return hljs.highlightAuto(code.trim(), languages).value
}

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

/**
 * Format strings into URL friendly "slug"
 *
 * @param {string} string - String to format
 * @returns {string} URL friendly "slug"
 */
function slugify(string) {
  return slug(string, { lower: true })
}

module.exports = {
  highlight,
  kebabCase,
  slugify
}
