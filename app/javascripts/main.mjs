/* eslint-disable no-new */

// NHS.UK frontend components
import { createAll, initAll } from 'nhsuk-frontend'

// NHS digital service manual components
import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import { DesignExample } from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
initAll({
  errorSummary: {
    disableAutoFocus: true
  },
  notificationBanner: {
    disableAutoFocus: true
  }
})

// Initialise NHS digital service manual components
initAccessibleAutocomplete({
  containerId: 'autocomplete-container',
  formId: 'search',
  inputId: 'searchField',
  onConfirm,
  source,
  templates: {
    inputValue,
    suggestion
  }
})

// Design examples
createAll(DesignExample)

// Form patterns
document.querySelectorAll('form[action="/form-handler"]').forEach(($form) => {
  $form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
})
