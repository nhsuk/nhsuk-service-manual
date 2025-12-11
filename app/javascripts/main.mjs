// NHS.UK frontend components
import { createAll, initAll } from 'nhsuk-frontend'

// NHS digital service manual components
import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import { DesignExample } from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
initAll()

// Initialise NHS digital service manual components
initAccessibleAutocomplete({
  form: document.querySelector('.nhsuk-header__search-form'),
  input: document.querySelector('.nhsuk-header__search-input'),
  button: document.querySelector('.nhsuk-header__search-submit'),
  onConfirm,
  source,
  templates: {
    inputValue,
    suggestion
  }
})

// Design examples
createAll(DesignExample)
