module.exports = {

  // Adobe analytics
  adobeTrackingUrl: process.env.ADOBE_TRACKING_URL || '//assets.adobedtm.com/f8560165ec6a/5d91bd521a81/launch-c545cb3a904a-development.min.js',

  // Base URL
  baseURL: process.env.BASE_URL || 'https://service-manual.nhs.uk',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3000,
};
