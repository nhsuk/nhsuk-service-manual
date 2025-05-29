/* eslint-disable no-new */

// NHS.UK frontend components
import {
  initCharacterCount,
  initCheckboxes,
  initDetails,
  initErrorSummary,
  initHeader,
  initRadios,
  initSkipLink,
  initTabs
} from 'nhsuk-frontend'

// NHS digital service manual components
import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import DesignExample from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
initHeader()
initDetails()
initSkipLink()
initCheckboxes()
initRadios()
initTabs()
initCharacterCount()
initErrorSummary({ focusOnPageLoad: false })

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
