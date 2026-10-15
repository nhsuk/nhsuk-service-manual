import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const { NODE_ENV } = process.env

/**
 * @type {Config}
 */
export default {
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
