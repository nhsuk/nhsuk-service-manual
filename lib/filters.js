const { isObject } = require('nhsuk-frontend')
const filters = require('nhsuk-frontend/lib/nunjucks/filters/index.js')

const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long'
})

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const isoDateFormat = /^\d{4}-\d{2}-\d{2}$/

/**
 * Format a date whilst following the NHS.UK style guide for dates
 *
 * The input can be day, month and year numbers entered by a user into
 * the Date input component, which the prototype kit converts into an object.
 *
 * Alternatively the filter also works with ISO date strings like `2026-03-03`.
 *
 * If needed, you can include the day of the week by adding includeDayOfWeek: true option.
 *
 * @example
 * ```njk
 * {{ data.dateOfBirth | formatDate }}
 * ```
 * @example
 * ```njk
 * {{ data.appointmentDate | formatDate({ includeDayOfWeek: true }) }}
 * ```
 * @see {@link https://service-manual.nhs.uk/content/numbers-measurements-dates-time#dates}
 * @param {string|DateInputObject|unknown} input - Date as ISO YYYY-MM-DD string or object with day, month, year
 * @param {object} [options] - Options
 * @param {boolean} [options.includeDayOfWeek] - Include day of the week
 * @returns {string} `string` as a human readable date
 */
function formatDate(input, options) {
  let date

  const resolvedOptions = {
    includeDayOfWeek: false,
    ...options
  }

  try {
    /** @type {number} */
    let day
    /** @type {number} */
    let month
    /** @type {number} */
    let year

    if (
      isObject(input) &&
      'year' in input &&
      'month' in input &&
      'day' in input
    ) {
      month = parseInt(String(input.month), 10)
      year = parseInt(String(input.year), 10)
      day = parseInt(String(input.day), 10)
    } else if (typeof input === 'string' && input.match(isoDateFormat)) {
      const [yearStr, monthStr, dayStr] = input.split('-')
      year = parseInt(yearStr, 10)
      month = parseInt(monthStr, 10)
      day = parseInt(dayStr, 10)
    } else {
      throw new RangeError('Invalid input')
    }

    // JavaScript Date expects 0-indexed month
    date = new Date(year, month - 1, day)

    // Ensure the constructed Date wasn't normalised from an invalid input
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new RangeError('invalid date')
    }

    let formatted = ''

    // The weekday is manually prefixed to the formatted date,
    // as the Intl.DateTimeFormat combined option will insert a comma,
    // which we don’t want.
    if (resolvedOptions.includeDayOfWeek) {
      formatted += `${weekdayFormat.format(date)} `
    }

    formatted += dateFormat.format(date)

    return formatted
  } catch {
    console.warn('Invalid date:', input)
    return 'Invalid date'
  }
}

/**
 * Format strings into kebab case but also
 * handles `errorMessage` → `error-message`
 *
 * @param {string} string - String to format
 * @returns {string} Kebab case string
 */
function kebabCase(string) {
  return string
    .replaceAll(/\W+/g, '-')
    .replaceAll(/\B([A-Z])(?=[a-z])/g, '-$1')
    .replaceAll(/\B([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

module.exports = {
  highlight: filters.highlight,
  slugify: filters.slugify,
  unindent: filters.unindent,
  formatDate,
  kebabCase
}

/**
 * @typedef {object} DateInputObject
 * @property {string|number} day - The day
 * @property {string|number} month - The month
 * @property {string|number} year - The year
 */
