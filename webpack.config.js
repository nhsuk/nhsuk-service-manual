const path = require('path');

module.exports = {
  entry: {
    cookies: './app/scripts/cookie-consent.js',
    main: './app/scripts/main.js',
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: { rootMode: 'upward' },
    }],
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'public/js/'),
  },
};
