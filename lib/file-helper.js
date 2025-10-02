const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const matter = require('gray-matter')
const beautify = require('js-beautify').html

const config = require('../app/config')

const { NODE_ENV } = process.env

/** @type {Record<string, string> | undefined} */
let webpackManifest

/**
 * Get file contents by path
 *
 * @param {string} path
 */
function getFileContents(path) {
  let content = ''

  try {
    content = readFileSync(path, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.log(err.message)
    } else {
      throw err
    }
  }

  return content
}

/**
 * Get Nunjucks macro options JSON
 *
 * @param {string} item
 * @returns {object[]}
 */
function getNunjucksParams(item) {
  let params = []

  // Items with different component names
  const renamed = new Map([
    ['breadcrumbs', 'breadcrumb'],
    ['buttons', 'button'],
    ['care-cards', 'card'],
    ['do-and-dont-lists', 'do-dont-list'],
    ['expander', 'details'],
    ['hint-text', 'hint'],
    ['table', 'tables'],
    ['text-input', 'input'],
    ['notification-banners', 'notification-banner']
  ])

  // Lookup NHS.UK frontend component name
  const component = renamed.get(item) || item

  // Path to Nunjucks macro options JSON
  const path = join(
    config.modulePath,
    `nhsuk-frontend/dist/nhsuk/components/${component}/macro-options.json`
  )

  if (existsSync(path)) {
    try {
      params = JSON.parse(getFileContents(path))
    } catch {
      // eslint-disable-next-line no-console
      console.log(`Could not get Nunjucks params for ${component} component`)
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Not found:', {
      item,
      component,
      path
    })
  }

  return params
}

/**
 * Check Nunjucks path for an example exists
 *
 * @param {FileOptions} options
 */
function hasNunjucksPath({ group, item, type }) {
  return existsSync(getNunjucksPath({ group, item, type }))
}

/**
 * Get Nunjucks path for an example
 *
 * @param {FileOptions} options
 */
function getNunjucksPath({ group, item, type }) {
  return join(
    config.sourcePath,
    `views/design-system/${group}/${item}/${type}/index.njk`
  )
}

/**
 * Get Nunjucks code for an example without extends tags
 *
 * @param {FileOptions} options
 */
function getNunjucksCode({ group, item, type }) {
  const { content } = getFrontmatter({ group, item, type })

  // Omit any `{% extends "foo.njk" %}` nunjucks code, because we extend
  // templates that only exist within the Design System – it's not useful to
  // include this in the code we expect others to copy.
  return content.replace(/^{%\s*extends\s*\S+\s*%}\s+/gm, '')
}

/**
 * Get HTML code for an example
 *
 * @this {{ env: Environment }}
 * @param {FileOptions} options
 */
function getHTMLCode({ group, item, type, env = this.env }) {
  let html = ''
  const { content } = getFrontmatter({ group, item, type })

  try {
    html = env.renderString(content)
  } catch {
    // eslint-disable-next-line no-console
    console.log(`Could not get HTML code for ${item} ${group}: ${type}`)
  }

  return beautify(html.trim(), {
    end_with_newline: true,
    indent_size: 2,
    // If there are multiple blank lines, reduce down to one blank new line.
    max_preserve_newlines: 1,
    // set unformatted to a small group of elements, not all inline (the default)
    // otherwise tags like label arent indented properly
    unformatted: ['code', 'pre', 'em', 'strong']
  })
}

/**
 * Get YAML frontmatter for an example
 *
 * @param {FileOptions} options
 */
function getFrontmatter({ group, item, type }) {
  let frontmatter = /** @type {GrayMatterFile<string>} */ ({
    content: '',
    data: {}
  })

  // Path to Nunjucks example template
  const path = getNunjucksPath({ group, item, type })

  if (!existsSync(path)) {
    return frontmatter
  }

  try {
    frontmatter = matter(getFileContents(path))
  } catch {
    // eslint-disable-next-line no-console
    console.log(`Could not get front matter for ${item} ${group}: ${type}`)
  }

  return frontmatter
}

/**
 * Get 'fingerprinted' version of a given asset file
 *
 * @param {string} pathname - URL path to asset
 * @returns {string} URL path to asset with added hash fingerprint
 */
function getAssetPath(pathname = '') {
  const manifestPath = join(config.publicPath, 'assets-manifest.json')

  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (err) {
      if (NODE_ENV !== 'development') {
        throw err
      }
    }
  }

  return webpackManifest && pathname in webpackManifest
    ? webpackManifest[pathname]
    : `/${pathname}`
}

module.exports = {
  getNunjucksParams,
  hasNunjucksPath,
  getNunjucksPath,
  getNunjucksCode,
  getHTMLCode,
  getFrontmatter,
  getAssetPath
}

/**
 * @typedef {object} FileOptions
 * @property {string} group - Group name
 * @property {string} item - Item name
 * @property {string} type - Type name
 * @property {Environment} [env] - Nunjucks environment
 */

/**
 * @import { Environment } from 'nunjucks'
 * @import { GrayMatterFile } from 'gray-matter'
 */
