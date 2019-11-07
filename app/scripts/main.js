/* eslint-disable no-new */
import './polyfills';

// NHS.UK frontend
import SkipLink from '../../node_modules/nhsuk-frontend/packages/components/skip-link/skip-link';
import DesignExample from './design-example';

// Initialise components
SkipLink();

document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
