/* eslint-disable no-new */
// NHS.UK frontend components
import MenuToggle from 'nhsuk-frontend/packages/components/header/menuToggle';
import SearchToggle from 'nhsuk-frontend/packages/components/header/searchToggle';
import SkipLink from 'nhsuk-frontend/packages/components/skip-link/skip-link';
import Details from 'nhsuk-frontend/packages/components/details/details';
import Checkboxes from 'nhsuk-frontend/packages/components/checkboxes/checkboxes';
import Radios from 'nhsuk-frontend/packages/components/radios/radios';
import Card from 'nhsuk-frontend/packages/components/card/card';

import AutoComplete from './autocomplete/autoCompleteConfig';

// NHS.UK frontend polyfills
import 'nhsuk-frontend/packages/polyfills';

// NHS digital service manual components
import DesignExample from './design-example';
import {
  inputValue,
  onConfirm,
  source,
  suggestion,
} from './search';

// Initialise NHS.UK frontend components
AutoComplete({
  containerId: 'autocomplete-container',
  formId: 'search',
  inputId: 'search-field',
  onConfirm,
  source,
  templates: {
    inputValue,
    suggestion,
  },
});
MenuToggle();
SearchToggle();
Details();
SkipLink();
Checkboxes();
Radios();
Card();

// Initialise NHS digital service manual components

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
