module.exports = {
  // Service name
  serviceName: 'NHS digital service manual',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Base URL
  baseURL: process.env.BASE_URL || 'https://beta.nhs.uk/service-manual',

  // Port to run local development server on
  port: process.env.PORT || 3000,
};
