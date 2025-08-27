const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const { NODE_ENV } = process.env

/**
 * @type {Config}
 */
module.exports = {
  plugins: [
    // Add vendor prefixes
    autoprefixer({
      env: 'stylesheets'
    }),

    // Only minify in production
    NODE_ENV === 'production'
      ? cssnano({ preset: ['default', { env: 'stylesheets' }] })
      : false
  ]
}

/**
 * @import { Config } from 'postcss-load-config'
 */
