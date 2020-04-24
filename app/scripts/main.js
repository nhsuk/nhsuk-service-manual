/* eslint-disable no-new */
// NHS.UK frontend components
import AutoComplete from 'nhsuk-frontend/packages/components/header/autoCompleteConfig';
import Header from '../../node_modules/nhsuk-frontend/packages/components/header/header';
import SkipLink from '../../node_modules/nhsuk-frontend/packages/components/skip-link/skip-link';
import Details from '../../node_modules/nhsuk-frontend/packages/components/details/details';
import Checkboxes from '../../node_modules/nhsuk-frontend/packages/components/checkboxes/checkboxes';
import Radios from '../../node_modules/nhsuk-frontend/packages/components/radios/radios';

// NHS.UK frontend polyfills
import '../../node_modules/nhsuk-frontend/packages/polyfills';

// NHS digital service manual components
import DesignExample from './design-example';
import {
  inputValue,
  onConfirm,
  source,
  suggestion,
} from './search';

// NHS digital service manual polyfills
import './polyfills';

// Initialise NHS.UK frontend components
Header();
Details();
SkipLink();
Checkboxes();
Radios();

// Initialise NHS digital service manual components

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});

// Header autocomplete
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
