/* eslint-disable no-new */

// NHS.UK frontend components
import { initAll } from 'nhsuk-frontend'

// NHS digital service manual components
import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import DesignExample from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
initAll({
  errorSummary: {
    disableAutoFocus: true
  }
})

// Initialise NHS digital service manual components
initAccessibleAutocomplete({
  containerId: 'autocomplete-container',
  formId: 'search',
  inputId: 'search-field',
  onConfirm,
  source,
  templates: {
    inputValue,
    suggestion
  }
})

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el)
})
