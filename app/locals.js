module.exports = config => (req, res, next) => {
  res.locals.VERSION = config.version;

  next();
};
