// Core dependencies
const path = require('path');

// External dependencies
const browserSync = require('browser-sync');
const compression = require('compression');
const express = require('express');
const highlightjs = require('highlight.js');
const nunjucks = require('nunjucks');

// Local dependencies
const authentication = require('./middleware/authentication');
const config = require('./app/config');
const fileHelper = require('./middleware/file-helper.js');
const locals = require('./app/locals');
const routing = require('./middleware/routing.js');
const PageIndex = require('./middleware/page-index.js');

const pageIndex = new PageIndex(config);

// Initialise applications
const app = express();

// Authentication middleware
app.use(authentication);

// Use local variables
app.use(locals(config));

// Use gzip compression to decrease the size of
// the response body and increase the speed of web app
app.use(compression());

// Middleware to serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/dist')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/packages')));
app.use('/iframe-resizer', express.static(path.join(__dirname, 'node_modules/iframe-resizer/')));

// View engine (nunjucks)
app.set('view engine', 'njk');

// Nunjucks configuration
const appViews = [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/node_modules/nhsuk-frontend/packages/components'),
];

const env = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true,
});

/*
 * Add some global nunjucks helpers
 */
env.addGlobal('getHTMLCode', fileHelper.getHTMLCode);
env.addGlobal('getNunjucksCode', fileHelper.getNunjucksCode);
env.addFilter('highlight', (code, language) => {
  const languages = language ? [language] : false;
  return highlightjs.highlightAuto(code.trim(), languages).value;
});

// Render standalone design examples
app.get('/design-example/:example', (req, res) => {
  const displayFullPage = req.query.fullpage === 'true';
  const example = req.params.example;
  const examplePath = path.join(__dirname, `/app/components/${example}.njk`);

  // Get the given example as HTML.
  const exampleHtml = fileHelper.getHTMLCode(examplePath);

  // Wrap the example HTML in a basic html base template.
  var baseTemplate = 'includes/design-example-wrapper.njk';
  if (displayFullPage) {
    baseTemplate = 'includes/design-example-wrapper-full.njk';
  }

  res.render(baseTemplate, { body: exampleHtml });
});

app.get('/search', (req, res) => {
  const query = req.query['search-field'] || '';
  const resultsPerPage = 10;
  let currentPage = parseInt(req.query.page, 10);
  const results = pageIndex.search(query);
  const maxPage = Math.ceil(results.length / resultsPerPage);
  if (!Number.isInteger(currentPage)) {
    currentPage = 1;
  } else if (currentPage > maxPage || currentPage < 1) {
    currentPage = 1;
  }

  const startingIndex = resultsPerPage * (currentPage - 1);
  const endingIndex = startingIndex + resultsPerPage;

  res.render('includes/search.njk', {
    currentPage,
    maxPage,
    query,
    results: results.slice(startingIndex, endingIndex),
    resultsLen: results.length,
  });
});

app.get('/suggestions', (req, res) => {
  const results = pageIndex.search(req.query.search);
  const slicedResults = results.slice(0, 10);
  res.set({ 'Content-Type': 'application/json' });
  res.send(JSON.stringify(slicedResults));
});

// Automatically route pages
app.get(/^([^.]+)$/, (req, res, next) => {
  routing.matchRoutes(req, res, next);
});

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' });
  res.render('sitemap.xml');
});

// Render robots.txt in text format
app.get('/robots.txt', (_, res) => {
  res.set('text/plain');
  res.render('robots.txt');
});

// Render 404 page
app.get('*', (_, res) => {
  res.statusCode = 404;
  res.render('page-not-found');
});

// Run application on configured port
if (config.env === 'development') {
  app.listen(config.port - 50, () => {
    browserSync({
      files: ['app/views/**/*.*', 'public/**/*.*'],
      notify: true,
      open: false,
      port: config.port,
      proxy: `localhost:${config.port - 50}`,
      ui: false,
    });
  });
} else {
  app.listen(config.port);
}

setTimeout(() => {
  pageIndex.init();
}, 2000);

module.exports = app;
