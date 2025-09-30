// Core dependencies
const { join, parse } = require('path')

// External dependencies
const browserSync = require('browser-sync')
const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const nunjucks = require('nunjucks')

// Local dependencies
const config = require('./app/config')
const locals = require('./app/locals')
const fileHelper = require('./lib/file-helper')
const filters = require('./lib/filters')
const PageIndex = require('./lib/page-index')
const authentication = require('./middleware/authentication')
const routing = require('./middleware/routing')

const pageIndex = new PageIndex(config)

// Initialise applications
const app = express()

// Authentication middleware
app.use(authentication)

// Use local variables
app.use(locals(config))

// Use gzip compression to decrease the size of
// the response body and increase the speed of web app
app.use(compression())

// Use helmet to help secure the application
// by setting http headers
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

/**
 * Send different cache-control headers depending on the file path
 *
 * Asset filenames with fingerprint hashes (stylesheets, javascripts) are
 * given an 'infinite' max-age since the content never changes.
 *
 * Historically, an 'infinite' max-age is the 32-bit maximum 2,147,483,648.
 * https://datatracker.ietf.org/doc/html/rfc9111#section-1.2.2
 */

app.use(
  '/assets',
  express.static(join(config.publicPath, 'assets'), {
    setHeaders(res) {
      res.set('Cache-Control', 'public,max-age=0,must-revalidate')
    }
  })
)

/**
 * Middleware to serve javascripts
 * (Redirects to latest hashed file on 404)
 */
app.use('/javascripts', [
  express.static(join(config.publicPath, 'javascripts'), {
    setHeaders(res) {
      res.set('Cache-Control', 'public,max-age=2147483648,immutable')
    }
  }),
  (req, res, next) => {
    const { name, ext } = parse(req.path)
    const [basename] = name.split('.')

    // Redirect to latest javascript
    if (['main.js'].includes(`${basename}${ext}`)) {
      res.redirect(fileHelper.getAssetPath(`${basename}.js`))
      return
    }

    // 404 page
    next()
  }
])

/**
 * Middleware to serve javascripts
 * (Redirects to latest hashed file on 404)
 */
app.use('/stylesheets', [
  express.static(join(config.publicPath, 'stylesheets'), {
    setHeaders(res) {
      res.set('Cache-Control', 'public,max-age=2147483648,immutable')
    }
  }),
  (req, res, next) => {
    const { name, ext } = parse(req.path)
    const [basename] = name.split('.')

    // Redirect to latest stylesheet
    if (['main.css', 'preview.css'].includes(`${basename}${ext}`)) {
      res.redirect(fileHelper.getAssetPath(`stylesheets/${basename}.scss`))
      return
    }

    // 404 page
    next()
  }
])

// View engine (nunjucks)
app.set('view engine', 'njk')

// Nunjucks configuration
const env = nunjucks.configure(config.nunjucksPaths, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true,
  trimBlocks: true,
  lstripBlocks: true
})

/*
 * Add some global nunjucks helpers
 */
env.addGlobal('getHTMLCode', fileHelper.getHTMLCode)
env.addGlobal('getNunjucksCode', fileHelper.getNunjucksCode)
env.addGlobal('getNunjucksParams', fileHelper.getNunjucksParams)
env.addGlobal('getAssetPath', fileHelper.getAssetPath)
env.addFilter('highlight', filters.highlight)
env.addFilter('markdown', filters.markdown)

// Render standalone design examples
app.get('/design-example/:group/:item/:type', (req, res) => {
  const { group, item, type } = req.params

  // Get the given example as HTML.
  const exampleHtml = fileHelper.getHTMLCode({
    group,
    item,
    type,
    env
  })

  const { data } = fileHelper.getFrontmatter({
    group,
    item,
    type
  })

  // Wrap the example HTML in a basic html base template.
  const { previewLayout = 'design-example-wrapper' } = data

  res.render(`layouts/${previewLayout}`, {
    ...data,
    exampleHtml,
    item
  })
})

app.get('/search', (req, res) => {
  const query = req.query['search-field'] || ''
  const resultsPerPage = 10
  let currentPage = parseInt(req.query.page, 10)
  const results = pageIndex.search(query)
  const maxPage = Math.ceil(results.length / resultsPerPage)
  if (!Number.isInteger(currentPage)) {
    currentPage = 1
  } else if (currentPage > maxPage || currentPage < 1) {
    currentPage = 1
  }

  const startingIndex = resultsPerPage * (currentPage - 1)
  const endingIndex = startingIndex + resultsPerPage

  res.render('layouts/search', {
    currentPage,
    maxPage,
    query,
    results: results.slice(startingIndex, endingIndex),
    resultsLen: results.length
  })
})

app.get('/suggestions', (req, res) => {
  const results = pageIndex.search(req.query.search)
  const slicedResults = results.slice(0, 10)
  res.set({ 'Content-Type': 'application/json' })
  res.send(JSON.stringify(slicedResults))
})

app.get('/assets/NHS_design_principles.pdf', (req, res) => {
  res.redirect('/assets/nhs-design-principles.pdf')
})

app.get('/slack', (req, res) => {
  res.redirect(
    'https://join.slack.com/t/nhs-service-manual/shared_invite/enQtNTIyOTEyNjU3NDkyLTk4NDQ3YzkwYzk1Njk5YjAxYTI5YTVkZmUxMGQ0ZjA3NjMyM2ZkNjBlMWMxODVjZjYzNzg1ZmU4MWY1NmE2YzE'
  )
})

// Add the code redirects for community-and-contribution pages

app.get('/community/contribution-survey', (req, res) => {
  res.redirect(
    'https://nhsdigital.eu.qualtrics.com/jfe/form/SV_5szVfoxZIW7Kr1b'
  )
})

app.get('/community/backlog-of-components-and-patterns', (req, res) => {
  res.redirect('/community-and-contribution/backlog-of-components-and-patterns')
})

app.get('/community/contribution-criteria', (req, res) => {
  res.redirect('/community-and-contribution/contribution-criteria')
})

app.get('/community/develop-component-pattern', (req, res) => {
  res.redirect('/community-and-contribution/develop-component-pattern')
})

app.get('/community', (req, res) => {
  res.redirect('/community-and-contribution')
})

app.get('/community/propose-component-pattern', (req, res) => {
  res.redirect('/community-and-contribution/propose-component-pattern')
})

app.get(
  '/community-and-contribution/feedback-or-share-insights',
  (req, res) => {
    res.redirect('/community-and-contribution/feed-back-or-share-insights')
  }
)

// Redirects for new service standards URLs

app.get('/service-standard', (req, res) => {
  res.redirect(301, '/standards-and-technology/service-standard')
})

app.get('/service-standard/about', (req, res) => {
  res.redirect(301, '/standards-and-technology/about-the-service-standard')
})

app.get('/service-standard/:page', (req, res) => {
  res.redirect(
    301,
    `/standards-and-technology/service-standard-points/${req.params.page}`
  )
})

// Redirects for accessibility URLs

app.get(
  '/accessibility/new-accessibility-requirements-wcag-2-2',
  (req, res) => {
    res.redirect('/accessibility/new-criteria-in-wcag-2-2')
  }
)

// Redirects for design system patterns

app.get(
  '/design-system/patterns/ask-users-for-their-nhs-number',
  (req, res) => {
    res.redirect('/design-system/patterns/ask-for-nhs-numbers')
  }
)

app.get(
  '/design-system/patterns/reassure-users-that-a-page-is-up-to-date',
  (req, res) => {
    res.redirect('/design-system/patterns/know-that-a-page-is-up-to-date')
  }
)

app.get(
  '/content/health-literacy/use-a-readability-tool-to-prioritise-content',
  (req, res) => {
    res.redirect(302, '/page-not-found')
  }
)

app.get('/content/numbers-measurement-dates-time', (req, res) => {
  res.redirect('/content/numbers-measurements-dates-time')
})

// PDF page redirect
// https://github.com/nhsuk/nhsuk-service-manual/pull/965
app.get('/content/pdfs', (req, res) => {
  res.redirect('/content/pdfs-and-other-non-html-documents')
})

// REDIRECT STOPS HERE

// Automatically route pages
app.get(/^([^.]+)$/, (req, res, next) => {
  routing.matchRoutes(req, res, next)
})

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' })
  res.render('sitemap.xml')
})

// Render robots.txt in text format
app.get('/robots.txt', (_, res) => {
  res.set('text/plain')
  res.render('robots.txt')
})

// Render 404 page
app.all('*', (_, res) => {
  res.statusCode = 404
  res.render('page-not-found')
})

// Run application on configured port
if (config.env === 'development') {
  app.listen(config.port - 50, () => {
    browserSync({
      files: [
        join(config.sourcePath, 'views/**'),
        join(config.publicPath, '**')
      ],
      notify: true,
      open: false,
      port: config.port,
      proxy: `localhost:${config.port - 50}`,
      ui: false
    })
  })
} else {
  app.listen(config.port)
}

setTimeout(() => {
  pageIndex.init()
}, 2000)

module.exports = app
