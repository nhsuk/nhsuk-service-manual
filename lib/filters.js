const hljs = require('highlight.js')
const { default: slug } = require('slug')

const highlightNunjucks = require('./highlight-nunjucks/index.js')

// Highlight Nunjucks
hljs.registerLanguage('njk', highlightNunjucks)

/**
 * Format code with syntax highlighting
 *
 * @param {string} code - Code in plain text
 * @param {string} [language] - Code programming language
 * @returns {string} Code with syntax highlighting
 */
function highlight(code, language) {
  const languages = language ? [language] : false
  return hljs.highlightAuto(code, languages).value
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

/**
 * Remove indentation from code blocks
 *
 * @param {string} code - Code with indentation
 * @returns {string} Code with indentation removed
 */
function unindent(code) {
  const lines = code.split(/\n/)

  // Skip when some lines are not indented
  if (lines.some((line) => !!line && line === line.trimStart())) {
    return code
  }

  // Find smallest indentation
  const indent = lines
    .filter((line) => /^\s+/.test(line))
    .map((line) => /^\s+/.exec(line)[0])
    .reduce((a, b) => (a.length <= b.length ? a : b))

  // Remove smallest indentation from all lines
  return lines
    .map((line) =>
      line.substring(0, indent.length) === indent
        ? line.substring(indent.length)
        : line
    )
    .join('\n')
}

module.exports = {
  highlight,
  kebabCase,
  slugify,
  unindent
}
