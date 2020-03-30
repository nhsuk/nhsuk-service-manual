module.exports = {
  // Base URL
  baseURL: process.env.BASE_URL || 'https://service-manual.nhs.uk',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3000,
};
