const { Marked } = require('marked')

const marked = new Marked({
  breaks: true,
  gfm: true,

  /**
   * Render paragraphs without `<p>` wrappers
   * for Nunjucks macro options table cells
   */
  extensions: [
    {
      name: 'paragraph',
      renderer({ tokens = [] }) {
        return this.parser.parseInline(tokens)
      }
    }
  ]
})

module.exports = {
  marked
}
