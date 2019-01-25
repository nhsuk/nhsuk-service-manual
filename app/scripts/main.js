import cookieConsent from './cookieConsent';
import digitalData from './digitalData';
import DesignExample from './design-example';

cookieConsent();
digitalData();

document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
