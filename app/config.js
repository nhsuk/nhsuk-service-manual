const packageJson = require('../package.json');

module.exports = {
  // Service name
  serviceName: 'NHS digital service manual',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Base URL
  baseURL: process.env.BASE_URL || 'https://service-manual.nhs.uk',

  // Port to run local development server on
  port: process.env.PORT || 3000,

  // Project version from package.json
  version: packageJson.version,
};
