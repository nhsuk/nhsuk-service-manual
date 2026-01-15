const { existsSync } = require('node:fs')
const { join } = require('node:path')

const config = require('../app/config')

const { getFileContents } = require('./file-helper')
const { kebabCase, slugify } = require('./filters')
const { marked } = require('./marked')

const components = new Map([
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

const componentsReverse = new Map(
  Array.from(components.entries())
    .map(([key, value]) => [value, key])

    // Do not map 'card' back to 'care-cards'
    .filter(([key]) => key !== 'card')
)

function addSlugs(option, parent) {
  option.slug = slugify(kebabCase(option.name))
  option.id = option.slug

  // Prefix nested option slugs with parent slug to avoid duplicates
  // such as summary list row `items` versus card action `items`
  if ((!option.isComponent || option.params) && parent?.slug) {
    option.slug = `${parent.slug}-${option.slug}`
  }

  if (option.params) {
    option.params = option.params.map((param) => addSlugs(param, option))
  }

  return option
}

function addParentPrefix(option, parent) {
  // Prefix nested option names with parent name to avoid duplicates
  // such as summary list row "items" versus card action "items"
  if ((!option.isComponent || option.params) && parent?.name) {
    option.name = `${parent.name} ${option.name}`
  }

  if (option.params) {
    option.params = option.params.map((param) => addParentPrefix(param, option))
  }

  return option
}

function renderNameWithBreaks(option) {
  if (option.params) {
    option.params = option.params.map(renderNameWithBreaks)
  }

  // Add suggested word breaks before capital letters to allow
  // browsers to break long option names in sensible places
  option.name = option.name.replaceAll(/(?<!<wbr>)([A-Z])/g, '<wbr>$1')

  // Also add suggested word breaks after full stops for options
  // that are manually given parent prefixes like `summary.text`
  option.name = option.name.replaceAll(/(\.)(?!<wbr>)/g, '$1<wbr>')

  return option
}

function renderDescriptionsAsMarkdown(option) {
  if (option.description) {
    option.description = marked.parse(option.description)
  }

  if (option.params) {
    option.params = option.params.map(renderDescriptionsAsMarkdown)
  }

  return option
}

// To display nested options that such as rows in a table, we need to make a separate group to be displayed.
function getNestedOptions(options, parent) {
  return options
    .filter((option) => option.params)
    .flatMap((option) => {
      const output = [[option, parent]]

      if (option.params) {
        output.push(...getNestedOptions(option.params, option))
      }

      return output
    })
}

// Some which are only used in other components are intentionally not displayed in the design system guidance.
// We want to add these as a separate group of options that can be linked to from the original options for the component.
function getAdditionalComponentOptions(options, parent) {
  const optionsFlattened = options.flatMap((option) => {
    const output = []

    const hasComponentPage = !['label', 'legend'].includes(option.slug)
    if (option.isComponent && !option.params && !hasComponentPage) {
      output.push([option, parent])
    }

    if (option.params) {
      output.push(...getAdditionalComponentOptions(option.params, option))
    }

    return output
  })

  // Component names with duplicates
  const componentNames = optionsFlattened.map(([option]) => option.slug)

  // Macro options with duplicates removed
  // For example, Checkboxes have `hint` for fieldset and items
  return optionsFlattened.filter(
    ([option], index) => componentNames.indexOf(option.slug) === index
  )
}

/**
 * The data structure that options are defined as is a nested one.
 *
 * ```js
 * [
 *   {
 *     name: 'top level item without params'
 *   },
 *   {
 *     name: 'top level item with params'
 *     params: [
 *       {
 *         name: 'second level',
 *         params: [
 *           {
 *             name: 'third level'
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 * ```
 *
 * In order to display it on the website we want to flatten it into groups,
 * which allows them to be displayed as individual tables that can link to each other.
 *
 * ```js
 * [
 *   {
 *     name: 'Primary options',
 *     params: [
 *       {
 *         name: 'top level item without params'
 *       },
 *       {
 *         name: 'top level item with params' // When rendered this option links to second level
 *       }
 *     ]
 *   {
 *     name: 'Options for second level',
 *     params: [
 *       {
 *         name: 'second level' // When rendered this option links to third level
 *       }
 *     ]
 *   },
 *   {
 *     name: 'Options for third level',
 *     params: [
 *       {
 *         name: 'third level'
 *       }
 *     ]
 *   }
 * ```
 *
 * @param {string} componentName - Component name
 * @returns {{ name: string, id: string, params: unknown[] }} Macro options
 */
function getMacroOptions(componentName) {
  const options = getMacroOptionsJson(componentName)
    .map((option) => addSlugs(option))
    .map((option) => addParentPrefix(option))

  // Macro options with formatting
  const optionsFormatted = structuredClone(options)
    .map(renderNameWithBreaks)
    .map(renderDescriptionsAsMarkdown)

  const nestedOptions = getNestedOptions(optionsFormatted)
  const additionalComponents = getAdditionalComponentOptions(options)

  const optionGroups = [
    {
      name: 'Primary options',
      slug: 'primary',
      id: 'primary',
      params: optionsFormatted
    }
  ]
    .concat(
      nestedOptions.map(([option]) => {
        const names = option.name.split(' ')
        const description = option.isComponent ? 'component' : option.type

        // Wrap option name with `<code>` (excluding parents)
        names[names.length - 1] = `<code>${names.at(-1)}</code>`

        return {
          ...option,

          // Append "objects" to the table caption for arrays of nested objects
          // to clarify that the options are for arrays of objects, not arrays
          name:
            option.type === 'array' && option.params
              ? `Options for ${names.join(' ')} ${option.type} objects`
              : `Options for ${names.join(' ')} ${description}`
        }
      })
    )
    .concat(
      additionalComponents.map(([option, parent]) => ({
        ...option,

        name: `Options for <code>${option.name}</code> component`,
        params: getMacroOptionsJson(option.slug)
          .map((option) => addSlugs(option, parent))
          .map(renderNameWithBreaks)
          .map(renderDescriptionsAsMarkdown)
      }))
    )

  return optionGroups
}

/**
 * Get Nunjucks macro options JSON
 *
 * @param {string} item
 * @returns {object[]}
 */
function getMacroOptionsJson(item) {
  let params = []

  // Lookup NHS.UK frontend component name
  const component = getComponentName(item)

  // Path to Nunjucks macro options JSON
  const path = join(
    config.modulePath,
    `nhsuk-frontend/dist/nhsuk/components/${component}/macro-options.json`
  )

  if (existsSync(path)) {
    try {
      params = JSON.parse(getFileContents(path))
    } catch (error) {
      console.log(
        `Could not get Nunjucks params for ${component} component`,
        error
      )
    }
  } else {
    console.log('Not found:', {
      item,
      component,
      path
    })
  }

  return params
}

/**
 * Lookup design system page name
 *
 * @param {string} name
 */
function getMacroPageName(name) {
  return componentsReverse.get(name) || name
}

/**
 * Lookup NHS.UK frontend component name
 *
 * @param {string} name
 */
function getComponentName(name) {
  return components.get(name) || name
}

module.exports = {
  getMacroOptions,
  getMacroOptionsJson,
  getMacroPageName,
  getComponentName
}
