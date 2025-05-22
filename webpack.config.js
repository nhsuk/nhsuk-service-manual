const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { NODE_ENV } = process.env;

/**
 * @type {Configuration}
 */
module.exports = {
  context: join(__dirname, 'app'),
  devtool: 'source-map',
  entry: {
    // Cookie banner
    cookies: './javascripts/cookie-consent.js',

    // Main application script and styles
    main: [
      './javascripts/main.js',
      './stylesheets/main.scss',
    ],

    // Design example overrides
    overrides: {
      import: './stylesheets/design-example-overrides.scss',
      filename: 'design-example-overrides',
    },
  },

  // Optimise for production
  mode: NODE_ENV === 'production'
    ? 'production'
    : 'development',

  module: {
    rules: [
      {
        test: /\.(js|mjs|scss)$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: { rootMode: 'upward' },
      },
      {
        test: /\.scss$/,
        type: 'asset/resource',
        generator: {
          binary: false,
          publicPath: '/stylesheets',
          filename:
            NODE_ENV === 'production'
              ? 'stylesheets/[name].[contenthash:7].min.css'
              : 'stylesheets/[name].css',
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [join(__dirname, 'node_modules')],
              },
            },
          },
        ],
      },
    ],
  },

  // Only minify in production
  optimization: {
    minimize: NODE_ENV === 'production',
  },

  output: {
    filename: NODE_ENV === 'production'
      ? 'javascripts/[name].[contenthash:7].min.js'
      : 'javascripts/[name].js',
    path: join(__dirname, 'public'),
    publicPath: '/',
  },

  // Only check JavaScript file size
  performance: {
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: 'assets-manifest.json',
    }),
    new CopyPlugin({
      patterns: [{
        from: 'assets',
        to: 'assets',
      }],
    }),
  ],

  stats: {
    errorDetails: true,
    loggingDebug: ['sass-loader'],
    preset: 'minimal',
  },

  // Use Browserslist config
  target: 'browserslist',
};

/**
 * @import { Configuration } from 'webpack'
 */
