module.exports = config => (req, res, next) => {
  res.locals.BASE_URL = config.baseURL;
  res.locals.COOKIE_CONSENT_URL = config.cookieConsent;

  next();
};
