// Core dependencies
const path = require('path');

// External dependencies
const browserSync = require('browser-sync');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const highlightjs = require('highlight.js');
const nunjucks = require('nunjucks');

// Local dependencies
const authentication = require('./middleware/authentication');
const config = require('./app/config');
const fileHelper = require('./middleware/file-helper');
const locals = require('./app/locals');
const routing = require('./middleware/routing');
const PageIndex = require('./middleware/page-index');

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

// Use helmet to help secure the application
// by setting http headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

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
env.addGlobal('getJSONCode', fileHelper.getJSONCode);
env.addFilter('highlight', (code, language) => {
  const languages = language ? [language] : false;
  return highlightjs.highlightAuto(code.trim(), languages).value;
});

// Render standalone design examples
app.get('/design-example/:group/:item/:type', (req, res) => {
  const displayFullPage = req.query.fullpage === 'true';
  const blankPage = req.query.blankpage === 'true';
  const { group } = req.params;
  const { item } = req.params;
  const { type } = req.params;
  const examplePath = path.join(__dirname, `app/views/design-system/${group}/${item}/${type}/index.njk`);

  // Get the given example as HTML.
  const exampleHtml = fileHelper.getHTMLCode(examplePath);

  // Wrap the example HTML in a basic html base template.
  let baseTemplate = 'includes/design-example-wrapper.njk';
  if (displayFullPage) {
    baseTemplate = 'includes/design-example-wrapper-full.njk';
  }
  if (blankPage) {
    baseTemplate = 'includes/design-example-wrapper-blank.njk';
  }

  res.render(baseTemplate, { body: exampleHtml, item });
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

app.get('/assets/NHS_design_principles.pdf', (req, res) => {
  res.redirect('/assets/nhs-design-principles.pdf');
});

app.get('/slack', (req, res) => {
  res.redirect('https://join.slack.com/t/nhs-service-manual/shared_invite/enQtNTIyOTEyNjU3NDkyLTk4NDQ3YzkwYzk1Njk5YjAxYTI5YTVkZmUxMGQ0ZjA3NjMyM2ZkNjBlMWMxODVjZjYzNzg1ZmU4MWY1NmE2YzE');
});

// Add the code redirects for community-and-contribution pages

app.get('/community/contribution-survey', (req, res) => {
  res.redirect('https://nhsdigital.eu.qualtrics.com/jfe/form/SV_5szVfoxZIW7Kr1b');
});

app.get('/community/backlog-of-components-and-patterns', (req, res) => {
  res.redirect('/community-and-contribution/backlog-of-components-and-patterns');
});

app.get('/community/contribution-criteria', (req, res) => {
  res.redirect('/community-and-contribution/contribution-criteria');
});

app.get('/community/develop-component-pattern', (req, res) => {
  res.redirect('/community-and-contribution/develop-component-pattern');
});

app.get('/community', (req, res) => {
  res.redirect('/community-and-contribution');
});

app.get('/community/propose-component-pattern', (req, res) => {
  res.redirect('/community-and-contribution/propose-component-pattern');
});

// Add the code redirects for accessibility pages

app.get('/accessibility', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility');
});

app.get('/accessibility/what-all-NHS-services-need-to-do', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/what-all-NHS-services-need-to-do');
});

app.get('/accessibility/how-to-make-digital-services-accessible', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/how-to-make-digital-services-accessible');
});

app.get('/accessibility/getting-started', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/getting-started');
});

app.get('/accessibility/product-and-delivery', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/product-and-delivery');
});

app.get('/accessibility/user-research', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/user-research');
});

app.get('/accessibility/content', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/content');
});

app.get('/accessibility/design', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/design');
});

app.get('/accessibility/development', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/development');
});

app.get('/accessibility/testing', (req, res) => {
  res.redirect('/guidance-by-topic/accessibility/testing');
});

// REDIRECTS STOP HERE

app.get('/content/health-literacy/use-a-readability-tool-to-prioritise-content', (req, res) => {
  res.redirect(302, '/page-not-found');
});

// PDF page redirect
// https://github.com/nhsuk/nhsuk-service-manual/pull/965
app.get('/content/pdfs', (req, res) => {
  res.redirect('/content/pdfs-and-other-non-html-documents');
});

// Review date redirect
app.get('/design-system/components/review-date', (req, res) => {
  res.redirect('/design-system/patterns/reassure-users-that-a-page-is-up-to-date');
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
