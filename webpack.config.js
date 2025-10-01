const { dirname, join } = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const { NODE_ENV } = process.env

/**
 * @type {Configuration}
 */
module.exports = {
  context: join(__dirname, 'app'),
  devtool: 'source-map',
  entry: {
    // Main application script and styles
    main: ['./javascripts/main.mjs', './stylesheets/main.scss'],

    // Design example preview styles
    preview: {
      import: './stylesheets/preview.scss',
      filename: 'preview'
    }
  },

  // Optimise for production
  mode: NODE_ENV === 'production' ? 'production' : 'development',

  module: {
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
          publicPath: '/stylesheets',
          filename:
            NODE_ENV === 'production'
              ? 'stylesheets/[name].[contenthash:7].min.css'
              : 'stylesheets/[name].css'
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [join(__dirname, 'node_modules')]
              }
            }
          }
        ]
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
          from: join(dirname(require.resolve('nhsuk-frontend')), 'assets'),
          to: 'assets'
        },
        {
          from: 'assets',
          to: 'assets'
        },
        {
          from: join(dirname(require.resolve('iframe-resizer')), 'js'),
          to: 'javascripts/vendor'
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
