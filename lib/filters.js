const hljs = require('highlight.js');
const filters = require('nunjucks/src/filters');
const { marked } = require('./marked');

// Highlight Nunjucks as JavaScript
hljs.registerLanguage('njk', require('highlight.js/lib/languages/javascript'));

/**
 * Format code with syntax highlighting
 *
 * @param {string} code - Code in plain text
 * @param {string} [language] - Code programming language
 * @returns {string} Code with syntax highlighting
 */
function highlight(code, language) {
  const languages = language ? [language] : false;
  return hljs.highlightAuto(code.trim(), languages).value;
}

/**
 * Convert markdown to HTML
 */
function markdown(string = '') {
  if (string === undefined || string === null) {
    return '';
  }

  return filters.safe(marked.parse(string, { async: false }));
}

module.exports = {
  highlight,
  markdown,
};
