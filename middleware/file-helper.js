const { existsSync, readFileSync } = require('fs');
const beautify = require('js-beautify').html;
const nunjucks = require('nunjucks');

/**
 * Get file contents by path
 *
 * @param {string} path
 */
function getFileContents(path) {
  let fileContents = '';

  try {
    fileContents = readFileSync(path, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.log(err.message);
    } else {
      throw err;
    }
  }

  return fileContents;
}

/**
 * Get Nunjucks macro options JSON
 *
 * @param {string} group
 * @param {string} item
 * @returns {object[]}
 */
exports.getNunjucksParams = (group, item) => {
  let options = { params: [] };

  // Path to Nunjucks macro options JSON
  const path = `app/views/design-system/${group}/${item}/macro-options.json`;

  if (existsSync(path)) {
    try {
      options = JSON.parse(getFileContents(path));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Could not get Nunjucks params for ${item} ${group}`);
    }
  }

  return options.params;
};

/**
 * Get Nunjucks code for an example without extends tags
 *
 * @param {string} group
 * @param {string} item
 * @param {string} type
 */
exports.getNunjucksCode = (group, item, type) => {
  let fileContents = '';

  // Path to Nunjucks example template
  const path = `app/views/design-system/${group}/${item}/${type}/index.njk`;

  try {
    fileContents = getFileContents(path);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Could not get Nunjucks code for ${item} ${group}: ${type}`);
  }

  // Omit any `{% extends "foo.njk" %}` nunjucks code, because we extend
  // templates that only exist within the Design System – it's not useful to
  // include this in the code we expect others to copy.
  const content = fileContents.replace(
    /^{%\s*extends\s*\S+\s*%}\s+/gm,
    '',
  );

  return content;
};

/**
 * Get HTML code for an example
 *
 * @param {string} group
 * @param {string} item
 * @param {string} type
 */
exports.getHTMLCode = (group, item, type) => {
  let html = '';

  // Path to Nunjucks example template
  const path = `app/views/design-system/${group}/${item}/${type}/index.njk`;

  try {
    html = nunjucks.renderString(getFileContents(path));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Could not get HTML code for ${item} ${group}: ${type}`);
  }

  return beautify(html.trim(), {
    end_with_newline: true,
    indent_size: 2,
    // If there are multiple blank lines, reduce down to one blank new line.
    max_preserve_newlines: 1,
    // set unformatted to a small group of elements, not all inline (the default)
    // otherwise tags like label arent indented properly
    unformatted: ['code', 'pre', 'em', 'strong'],
  });
};
