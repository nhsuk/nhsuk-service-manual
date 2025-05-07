const { Marked } = require('marked');

exports.marked = new Marked({
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
        const text = this.parser.parseInline(tokens);
        return tokens.length > 1 ? `${text}<br>` : text;
      },
    },
  ],
});
