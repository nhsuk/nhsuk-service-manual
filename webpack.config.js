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
    path: path.resolve(__dirname, 'public/js/'),
  },
};
