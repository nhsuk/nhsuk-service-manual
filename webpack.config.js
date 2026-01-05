const { basename, dirname, join, parse } = require('node:path')

const CopyPlugin = require('copy-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const { NODE_ENV } = process.env
const nhsukFrontendPath = dirname(require.resolve('nhsuk-frontend'))

/**
 * @type {Configuration}
 */
module.exports = {
  context: join(__dirname, 'app'),
  devtool: 'source-map',
  entry: {
    // Main application script and styles
    'main': ['./javascripts/main.mjs', './stylesheets/main.scss'],

    // Design example preview styles
    'preview': ['./javascripts/preview.mjs', './stylesheets/preview.scss'],

    // NHS.UK frontend script and styles
    'nhsuk-frontend': [
      join(nhsukFrontendPath, 'nhsuk-frontend.min.css'),
      join(nhsukFrontendPath, 'nhsuk-frontend.min.js')
    ]
  },

  // Optimise for production
  mode: NODE_ENV === 'production' ? 'production' : 'development',

  module: {
    generator: {
      'asset/resource': {
        outputPath({ filename }) {
          return filename?.endsWith('.css') || filename?.endsWith('.scss')
            ? 'stylesheets'
            : 'javascripts'
        }
      }
    },
    rules: [
      {
        test: /\.(js|mjs)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        extractSourceMap: true,
        options: { rootMode: 'upward' }
      },
      {
        test: /\.scss$/,
        type: 'asset/resource',
        extractSourceMap: true,
        generator: {
          binary: false,
          filename:
            NODE_ENV === 'production'
              ? '[name].[contenthash:7].min.css'
              : '[name].css'
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [join(__dirname, 'node_modules')],
                quietDeps: true
              }
            }
          }
        ]
      },
      {
        test: /nhsuk-frontend\.min\.(css|js)/,
        type: 'asset/resource',
        extractSourceMap: true,
        generator: {
          binary: false,
          filename({ filename }) {
            const { name } = parse(filename)

            // Move script or style `.min` suffix after hash
            return NODE_ENV === 'production'
              ? `${basename(name, '.min')}.[contenthash:7].min[ext]`
              : '[name][ext]'
          }
        }
      }
    ]
  },

  // Only minify in production
  optimization: {
    minimize: NODE_ENV === 'production'
  },

  output: {
    filename:
      NODE_ENV === 'production'
        ? 'javascripts/[name].[contenthash:7].min.js'
        : 'javascripts/[name].js',
    path: join(__dirname, 'public'),
    publicPath: '/'
  },

  // Only check JavaScript file size
  performance: {
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.mjs')
    }
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: 'assets-manifest.json'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: join(nhsukFrontendPath, 'assets'),
          to: 'assets'
        },
        {
          from: 'assets',
          to: 'assets'
        },
        {
          from: 'javascripts/vendor',
          to: 'javascripts/vendor'
        }
      ]
    })
  ],

  stats: {
    errorDetails: true,
    loggingDebug: ['sass-loader'],
    preset: 'minimal'
  },

  // Use Browserslist config
  target: 'browserslist:javascripts'
}

/**
 * @import { Configuration } from 'webpack'
 */
