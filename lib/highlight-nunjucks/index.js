const keywords = [
  'autoescape',
  'block',
  'call',
  'csrf_token',
  'cycle',
  'debug',
  'elif',
  'else',
  'extends',
  'filter',
  'for',
  'from',
  'if',
  'import',
  'include',
  'lorem',
  'macro',
  'pluralize',
  'raw',
  'set',
  'spaceless',
  'trans',
  'url',
  'with'
]

const keywordsAndEndKeywords = keywords.flatMap((keyword) =>
  keyword.startsWith('end') ? [keyword] : [keyword, `end${keyword}`]
)

/**
 * @type {LanguageFn}
 */
module.exports = function highlightNunjucks(hljs) {
  return {
    name: 'Nunjucks',
    aliases: ['nj', 'njk', 'nunjucks'],
    case_insensitive: true,
    subLanguage: 'xml',
    contains: [
      // Block comments
      {
        className: 'comment',
        begin: /\{%\s*comment\s*%\}/,
        end: /\{%\s*endcomment\s*%\}/
      },
      // Line comments
      {
        className: 'comment',
        begin: /\{#/,
        end: /#\}/
      },
      // Template variables
      {
        className: 'tag',
        begin: /\{\{\s*/,
        end: /\}\}/,
        contains: [
          {
            className: 'title',
            begin: /(?<!\|)(?<!\| )\b\w+(?=\s*\()/,
            relevance: 0
          },
          {
            begin: /\(\{/,
            end: /\}\)/,
            subLanguage: 'javascript'
          },
          {
            className: 'name',
            begin: /\w+/
          },
          {
            className: 'operator',
            begin: /\|/
          },
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE
        ]
      },
      // Template tags
      {
        className: 'tag',
        begin: /\{%-?\s*/,
        end: /-?%\}/,
        contains: [
          {
            className: 'keyword',
            begin: new RegExp(
              String.raw`\b(${keywordsAndEndKeywords.join('|')})\b`
            )
          },
          {
            className: 'variable',
            begin: /\b\w+/,
            relevance: 0
          },
          {
            className: 'operator',
            begin: /\b(and|or|not|in|is|as|by)\b/
          },
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE
        ]
      }
    ]
  }
}

/**
 * @import { LanguageFn } from 'highlight.js'
 */
