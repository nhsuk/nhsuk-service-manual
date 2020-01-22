const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  entry: {
    cookies: './app/scripts/cookie-consent.js',
    main: './app/scripts/main.js',
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    }],
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, `public/${packageJson.version}/js/`),
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
