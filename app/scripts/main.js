/* eslint-disable no-new */
import './polyfills';

// NHS.UK frontend
import nhsuk_skipLink from '../../node_modules/nhsuk-frontend/packages/components/skip-link/skip-link'; /* eslint-disable-line camelcase */
import digitalData from './digitalData';
import DesignExample from './design-example';
import cookieConsent from './cookieConsent';

// Initialise components
nhsuk_skipLink();
digitalData();
cookieConsent();

document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
