/* eslint-disable no-new */

// NHS.UK frontend components
import CharacterCount from 'nhsuk-frontend/packages/components/character-count/character-count.js'
import Checkboxes from 'nhsuk-frontend/packages/components/checkboxes/checkboxes.js'
import Details from 'nhsuk-frontend/packages/components/details/details.js'
import ErrorSummary from 'nhsuk-frontend/packages/components/error-summary/error-summary.js'
import Header from 'nhsuk-frontend/packages/components/header/header.js'
import Radios from 'nhsuk-frontend/packages/components/radios/radios.js'
import SkipLink from 'nhsuk-frontend/packages/components/skip-link/skip-link.js'
import Tabs from 'nhsuk-frontend/packages/components/tabs/tabs.js'

// NHS.UK frontend polyfills
import 'nhsuk-frontend/packages/polyfills.js'

// NHS digital service manual components
import AccessibleAutocomplete from './accessible-autocomplete.mjs'
import DesignExample from './design-example.mjs'
import { inputValue, onConfirm, source, suggestion } from './search.mjs'

// Initialise NHS.UK frontend components
Header()
Details()
SkipLink()
Checkboxes()
Radios()
Tabs()
CharacterCount()
ErrorSummary({ focusOnPageLoad: false })

// Initialise NHS digital service manual components
AccessibleAutocomplete({
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
