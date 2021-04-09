const digitalData = require('./digital-data');

module.exports = (config) => (req, res, next) => {
  res.locals.BASE_URL = config.baseURL;
  res.locals.ENVIRONMENT = config.env;

  // Adobe Analytics
  res.locals.adobeTrackingUrl = config.adobeTrackingUrl;

  // Datalayer info
  res.locals.digitalData = digitalData(req);

  next();
};
