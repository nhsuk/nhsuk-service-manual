import digitalData from './digitalData';
import DesignExample from '../components/design-example/design-example';

digitalData();

document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
