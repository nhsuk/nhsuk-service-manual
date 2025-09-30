/**
 * Automatically route pages
 *
 * Try to match a request to a template, for example a request for /test
 * would look for /app/views/test.html and /app/views/test/index.html
 * See line 21-23 of app.js and below
 *
 * 1. Try to render the path
 * 2. if success - send the response
 * 3. if error other than template not found - call next with the error
 * 4. Maybe it's a folder - try to render [path]/index.html
 * 5. We got template not found both times - call next to trigger the 404 page
 * 6. Remove the first slash, render won't work with it
 * 7. If it's blank, render the root index
 *
 * @param {string} path - URL path to render
 * @param {Response} res
 * @param {NextFunction} next
 */
function renderPath(path, res, next) {
  res.render(path, (error, html) => {
    // [1] //
    if (!error) {
      res.set({
        'Cache-Control': 'public,max-age=0,must-revalidate',
        'Content-Type': 'text/html; charset=utf-8'
      }) // [2] //
      res.end(html)
      return
    }
    if (!error.message.startsWith('template not found')) {
      // [3] //
      next(error)
      return
    }
    if (!path.endsWith('/index')) {
      renderPath(`${path}/index`, res, next) // [4] //
      return
    }
    next() // [5] //
  })
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function matchRoutes(req, res, next) {
  let { path } = req

  path = path.substr(1) // [6] //

  if (path === '') {
    // [7] //
    path = 'index'
  }

  renderPath(path, res, next)
}

module.exports = {
  matchRoutes
}

/**
 * @import { Request, Response, NextFunction } from 'express'
 */
