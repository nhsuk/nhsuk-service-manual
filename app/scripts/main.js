/* eslint-disable no-new */
// NHS.UK frontend components
import AutoComplete from 'nhsuk-frontend/packages/components/header/autoCompleteConfig';
import MenuToggle from 'nhsuk-frontend/packages/components/header/menuToggle';
import SearchToggle from 'nhsuk-frontend/packages/components/header/searchToggle';
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

// Initialise NHS digital service manual components

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});

// card.js
// Loops through dom and finds all elements with nhsuk-card--clickable class
document.querySelectorAll('.nhsuk-card--clickable').forEach((panel) => {
  // Check if panel has a link within it
  if (panel.querySelector('a') !== null) {
    // Clicks the link within the heading to navigate to desired page
    panel.addEventListener('click', () => {
      panel.querySelector('a').click();
    });
  }
});

