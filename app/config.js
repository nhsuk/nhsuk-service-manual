const { join, resolve } = require('path');

const {
  ADOBE_TRACKING_URL = '//assets.adobedtm.com/f8560165ec6a/5d91bd521a81/launch-c545cb3a904a-development.min.js',
  BASE_URL = 'https://service-manual.nhs.uk',
  NODE_ENV = 'production',
  PORT = '3000',
} = process.env;

const rootPath = resolve(__dirname, '..');

module.exports = {
  // Adobe analytics
  adobeTrackingUrl: ADOBE_TRACKING_URL,

  // Common paths
  sourcePath: join(rootPath, 'app'),
  modulePath: join(rootPath, 'node_modules'),
  publicPath: join(rootPath, 'public'),

  // Base URL
  baseURL: BASE_URL,

  // Environment
  env: NODE_ENV,

  // Port to run local development server on
  port: parseInt(PORT, 10),
};
