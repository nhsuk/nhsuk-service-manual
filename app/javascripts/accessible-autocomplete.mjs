import AccessibleAutoComplete from 'accessible-autocomplete'

/**
 * Create an autocomplete.
 *
 * @template {unknown} ResultType
 * @param {Config<ResultType>} config
 */
export default (config) => {
  const { input, button } = config

  if (
    !config.source ||
    !(input instanceof HTMLInputElement) ||
    !(button instanceof HTMLButtonElement)
  ) {
    return
  }

  const $container = document.createElement('div')
  $container.classList.add('autocomplete')

  const defaultConfig = {
    confirmOnBlur: false,
    element: $container,
    id: input.id,
    inputClasses: 'nhsuk-header__search-input nhsuk-input',
    menuClasses: 'nhsuk-width-container',
    minLength: 2,
    name: input.name,
    placeholder: input.placeholder
  }

  // Remove original search input as it will be replaced by accessibleAutocomplete
  input.replaceWith($container)

  // Initialise accessibleAutocomplete
  AccessibleAutoComplete(Object.assign({}, defaultConfig, config))
}

/**
 * @template {unknown} ResultType
 * @typedef {object} Config
 * @property {Element | null} input - Search input
 * @property {Element | null} button - Search button
 * @property {OnSourceCallback<ResultType>} source - Search query callback function
 * @property {OnConfirmCallback<ResultType>} [onConfirm] - Result selection confirmed callback function
 * @property {object} [templates] - Template functions
 * @property {(result: ResultType) => string} [templates.inputValue] - Populate suggestion text from result
 * @property {(result: ResultType) => string} [templates.suggestion] - Populate input value from result
 */

/**
 * @template {unknown} ResultType
 * @callback OnSourceCallback
 * @param {string} query - Search input value
 * @param {OnPopulateResultsCallback<ResultType>} populateResults - Search results callback function
 * @returns {void}
 */

/**
 * @template {unknown} ResultType
 * @callback OnConfirmCallback
 * @param {ResultType} result - Search result selected
 * @returns {void}
 */

/**
 * @template {unknown} ResultType
 * @callback OnPopulateResultsCallback
 * @param {ResultType[]} results - Search results
 * @returns {void}
 */
