const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const { NODE_ENV } = process.env;

/**
 * @type {Config}
 */
module.exports = {
  plugins: [
    // Add vendor prefixes
    autoprefixer(),

    // Only minify in production
    NODE_ENV === 'production'
      ? cssnano()
      : false,
  ],
};

/**
 * @import { Config } from 'postcss-load-config'
 */
