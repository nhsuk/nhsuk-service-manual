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
const pageIndex = require('./middleware/page-index.js');

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
app.use('/service-manual', express.static(path.join(__dirname, 'public')));
app.use('/service-manual/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/dist')));
app.use('/service-manual/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/packages')));
app.use('/service-manual/iframe-resizer', express.static(path.join(__dirname, 'node_modules/iframe-resizer/')));

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
app.get('/service-manual/design-example/:example', (req, res) => {
  const example = req.params.example;
  const examplePath = path.join(__dirname, `/app/components/${example}.njk`);

  // Get the given example as HTML.
  const exampleHtml = fileHelper.getHTMLCode(examplePath);

  // Wrap the example HTML in a basic html base template.
  res.render('includes/design-example-wrapper.njk', { body: exampleHtml });
});

app.get('/search', (req, res) => {
  var search = req.query['search-field']
  res.render('includes/search.njk', { results: pageIndex.search(search), query: search })
});

app.get('/service-manual/suggestions', (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  res.send(JSON.stringify(pageIndex.suggestion(req.query.search)))
})

app.get('/', (req, res) => {
  res.redirect('/service-manual');
});

// The practices pages have moved or been deleted
// Temporary redirects incase anyone still visits /practices pages
app.get('/service-manual/practices/create-content-for-users-with-low-health-literacy', (req, res) => {
  res.redirect('/service-manual/content/health-literacy');
});

app.get('/service-manual/practices/create-content-for-users-with-low-health-literacy/use-a-readability-tool-to-prioritise-content', (req, res) => {
  res.redirect('/service-manual/content/health-literacy/use-a-readability-tool-to-prioritise-content');
});

app.get('/service-manual/practices', (req, res) => {
  res.redirect('/service-manual');
});

app.get('/service-manual/practices/make-your-service-accessible', (req, res) => {
  res.redirect('/service-manual/accessibility');
});

app.get('/service-manual/content/writing-for-accessibility', (req, res) => {
  res.redirect('/service-manual/accessibility/content');
});

// Automatically route pages
app.get(/^([^.]+)$/, (req, res, next) => {
  routing.matchRoutes(req, res, next);
});

// Render sitemap.xml in XML format
app.get('/service-manual/sitemap.xml', (req, res) => {
  res.set({ 'Content-Type': 'application/xml' });
  res.render('sitemap.xml');
});

// Render robots.txt in text format
app.get('/service-manual/robots.txt', (req, res) => {
  res.set('text/plain');
  res.render('robots.txt');
});

// Render 404 page
app.get('*', (req, res) => {
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

pageIndex.init()

module.exports = app;
