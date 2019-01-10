// Core dependencies
const path = require('path');

// External dependencies
const express = require('express');
const nunjucks = require('nunjucks');
const chalk = require('chalk');

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

// View engine (nunjucks)
app.set('view engine', 'njk');

// Nunjucks configuration
var appViews = [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/node_modules/nhsuk-frontend/packages')
]

nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
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
