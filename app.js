// Core dependencies
const path = require('path');
const fs = require('fs');

// External dependencies
const express = require('express');
const nunjucks = require('nunjucks');
const chalk = require('chalk');
const highlightjs = require('highlight.js');

const fileHelper = require('./app/utils/file-helper.js');

// Set configuration variables
const port = process.env.PORT || 3000;

// Local dependencies
const authentication = require('./middleware/authentication');
const routing = require('./middleware/routing.js');

// Initialise applications
const app = express()

// Authentication middleware
app.use(authentication);

// Middleware to serve static assets
app.use(express.static(path.join(__dirname, 'app/assets')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/dist')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, '/node_modules/nhsuk-frontend/packages')));
app.use('/iframe-resizer', express.static(path.join(__dirname, 'node_modules/iframe-resizer/')))

// View engine (nunjucks)
app.set('view engine', 'njk');

// Nunjucks configuration
var appViews = [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/node_modules/nhsuk-frontend/packages')
]

var env = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

/*
 * Add some global nunjucks helpers
 */
env.addGlobal('getHTMLCode', fileHelper.getHTMLCode)
env.addGlobal('getNunjucksCode', fileHelper.getNunjucksCode)
env.addFilter('highlight', function(code, language) {
  const languages = language ? [language] : false
  return highlightjs.highlightAuto(code.trim(), languages).value
})

// Render standalone design examples
app.get('/design-example/:example', function(req, res) {
  var example = req.params.example
  var examplePath = path.join(__dirname, `/app/examples/${example}.njk`)

  // Get the given example as HTML.
  exampleHtml = fileHelper.getHTMLCode(examplePath)

  // Wrap the example HTML in a basic html base template.
  res.render('includes/design-example-wrapper.njk', { body: exampleHtml })
})

// Automatically route pages
app.get(/^([^.]+)$/, function (req, res, next) {
  routing.matchRoutes(req, res, next)
})

app.get('*', function(req, res){
  res.render('page-not-found');
});

// Run the application
app.listen(port, () => {
  console.log(chalk.green(`App is running and watching for changes at http://localhost:${port}`));
});

module.exports = app;
