const fs = require('fs');
const beautify = require('js-beautify').html;
const nunjucks = require('nunjucks');

// This helper function takes a path of a file and
// returns the contents as string
function getFileContents(path) {
  let fileContents;
  try {
    fileContents = fs.readFileSync(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.log(err.message);
    } else {
      throw err;
    }
  }
  return fileContents.toString();
}

// This helper function takes a path of a *.md.njk file and
// returns the Nunjucks syntax inside that file without markdown data and imports
exports.getNunjucksCode = (path) => {
  const fileContents = getFileContents(path);

  // Omit any `{% extends "foo.njk" %}` nunjucks code, because we extend
  // templates that only exist within the Design System – it's not useful to
  // include this in the code we expect others to copy.
  const content = fileContents.replace(
    /{%\s*extends\s*\S*\s*%}\s+/,
    '',
  );

  return content;
};

// This helper function takes a path of a *.md.njk file and
// returns the HTML rendered by Nunjucks without markdown data
exports.getHTMLCode = (path) => {
  const fileContents = getFileContents(path);

  let html;
  try {
    html = nunjucks.renderString(fileContents);
  } catch (err) {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(`Could not get HTML code from ${path}`);
    }
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

// This helper function takes json data from a file path and returns it as an object
// to be rendered in a Nunjucks template
exports.getJSONCode = (path) => JSON.parse(getFileContents(path));
