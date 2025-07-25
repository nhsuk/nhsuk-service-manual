const basicAuth = require('basic-auth')

/**
 * Simple basic auth middleware for use with Express 4.x.
 *
 * Based on template found at: http://www.danielstjules.com/2014/08/03/basic-auth-with-express-4/
 *
 * @example
 * const authentication = required('authentication');
 * app.use(authentication);
 * @param {string} req - Express Request object
 * @param {string} res - Express Response object
 * @returns {Function} Express 4 middleware requiring the given credentials
 */

module.exports = (req, res, next) => {
  // External dependencies

  // Set configuration variables
  const env = (process.env.NODE_ENV || 'development').toLowerCase()
  const username = process.env.MANUAL_USERNAME
  const password = process.env.MANUAL_PASSWORD

  if (env === 'review' || env === 'staging') {
    if (!username || !password) {
      // eslint-disable-next-line no-console
      console.error('Username or password is not set in environment variables.')
      return res.send(
        '<p>Username or password not set in environment variables.</p>'
      )
    }

    const user = basicAuth(req)

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }
  }
  return next()
}
