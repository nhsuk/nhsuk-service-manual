import AccessibleAutoComplete from 'accessible-autocomplete'

/**
 * @typedef {object} AutocompleteConfig
 * @property {string} [formId] - ID of form element containing autocomplete.
 *   (Optional param for NHS.UK functionality)
 * @property {string} inputId - ID of the input field.
 * @property {string} containerId - ID of element in which the autocomplete will be rendered in.
 * @property {Function} source - Function called on input change
 */

/**
 * Create an autocomplete.
 *
 * @param {AutocompleteConfig} config
 */
export default (config) => {
  const { formId, inputId, containerId } = config

  const form = document.getElementById(formId)
  const input = document.getElementById(inputId)
  const container = document.getElementById(containerId)

  /**
   * Adds event to catch enter presses when the main input is focused and submits the form
   */
  const addFormEvents = () => {
    // Attach event to form as the original input element is cloned by autoComplete plugin
    form.addEventListener('keyup', ({ key }) => {
      // Submit search using current input value if input is focused and enter is pressed
      if (key === 'Enter' && document.activeElement.id === inputId)
        form.submit()
    })
  }

  const initAutoComplete = () => {
    const defaultConfig = {
      confirmOnBlur: false,
      element: container,
      id: inputId,
      minLength: 2,
      name: input.name,
      placeholder: input.placeholder
    }

    // Remove original search input as it will be replaced by accessibleAutocomplete
    input.parentNode.removeChild(input)

    // Initialise accessibleAutocomplete
    AccessibleAutoComplete(Object.assign({}, defaultConfig, config))
  }

  // Add autocomplete functionality if required config options exist
  if (input && container && config.source) {
    initAutoComplete()
    // If form element exists then add events to add standard form functionality
    if (form) addFormEvents()
  }
}
