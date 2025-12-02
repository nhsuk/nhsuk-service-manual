const { join, resolve } = require('node:path')

const {
  ADOBE_TRACKING_URL = '//assets.adobedtm.com/f8560165ec6a/5d91bd521a81/launch-c545cb3a904a-development.min.js',
  BASE_URL = 'https://service-manual.nhs.uk',
  NODE_ENV = 'production',
  PORT = '3000'
} = process.env

const rootPath = resolve(__dirname, '..')
const sourcePath = join(rootPath, 'app')
const modulePath = join(rootPath, 'node_modules')

module.exports = {
  // Adobe analytics
  adobeTrackingUrl: ADOBE_TRACKING_URL,

  // Common paths
  sourcePath,
  modulePath,
  publicPath:
    NODE_ENV === 'test'
      ? join(rootPath, 'test/fixtures')
      : join(rootPath, 'public'),

  // Nunjucks search paths
  nunjucksPaths: [
    join(sourcePath, 'views'),
    join(modulePath, 'nhsuk-frontend/dist/nhsuk/components'),
    join(modulePath, 'nhsuk-frontend/dist/nhsuk/macros'),
    join(modulePath, 'nhsuk-frontend/dist/nhsuk'),
    join(modulePath, 'nhsuk-frontend/dist')
  ],

  // Base URL
  baseURL: BASE_URL,

  // Environment
  env: NODE_ENV,

  // Port to run local development server on
  port: parseInt(PORT, 10)
}
