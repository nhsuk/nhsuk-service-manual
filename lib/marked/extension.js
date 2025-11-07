const { markedSmartypants } = require('marked-smartypants');
const { smartypantsu } = require('smartypants');

/**
 * Render with "smart" typographic punctuation
 *
 * - Uses UTF-8 characters not HTML entities
 * - Formats quotes, ellipses, but not dashes
 */
exports.smartyPants = {
  ...markedSmartypants(),

  hooks: {
    postprocess(html) {
      return smartypantsu(html, 'qe');
    },
  },
};
