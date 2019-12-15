/* eslint-disable no-new */
import './polyfills';

// NHS.UK frontend
import AutoComplete from 'nhsuk-frontend/packages/components/header/autoCompleteConfig';
import Header from '../../node_modules/nhsuk-frontend/packages/components/header/header';
import SkipLink from '../../node_modules/nhsuk-frontend/packages/components/skip-link/skip-link';
import Details from '../../node_modules/nhsuk-frontend/packages/components/details/details';
import DesignExample from './design-example';
import {
  inputValue,
  onConfirm,
  source,
  suggestion,
} from './search';

// Initialise components
Header();
Details();
SkipLink();

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
