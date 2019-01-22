import digitalData from './digitalData';
import DesignExample from './design-example';

digitalData();

document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
