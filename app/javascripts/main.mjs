// NHS.UK frontend components
import { createAll, initAll } from 'nhsuk-frontend'

// NHS digital service manual components
import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import { Code } from './code.mjs'
import { DesignExample } from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
initAll()

// Initialise NHS digital service manual components
initAccessibleAutocomplete({
  form: document.querySelector('.nhsuk-header__search-form'),
  input: document.querySelector('.nhsuk-header__search-form .nhsuk-input'),
  button: document.querySelector('.nhsuk-header__search-form .nhsuk-button'),
  onConfirm,
  source,
  templates: {
    inputValue,
    suggestion
  }
})

// Code highlight blocks
createAll(Code)

// Design examples
createAll(DesignExample)
