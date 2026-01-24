// NHS digital service manual components
import { createAll, initAll } from 'nhsuk-frontend'

import initAccessibleAutocomplete from './accessible-autocomplete.mjs'
import { DesignExample } from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

initAll()

const form = document.querySelector('.nhsuk-header__search-form')
const input = document.querySelector('.nhsuk-header__search-form .nhsuk-input')
const button = document.querySelector(
  '.nhsuk-header__search-form .nhsuk-button'
)

if (form && input && button) {
  initAccessibleAutocomplete({
    form,
    input,
    button,
    onConfirm,
    source,
    templates: { inputValue, suggestion }
  })
}

// Design examples
createAll(DesignExample)
