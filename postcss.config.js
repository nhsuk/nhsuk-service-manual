const autoprefixer = require('autoprefixer');

/**
 * @type {Config}
 */
module.exports = {
  plugins: [
    // Add vendor prefixes
    autoprefixer(),
  ],
};

/**
 * @import { Config } from 'postcss-load-config'
 */
