/* eslint-disable */

/**
 * Polyfill for IE11 so that we can do document.querySelectorAll().forEach()
 * https://gist.github.com/raindrop-ua/a87cf43349b0cf4ee7a512f3b87529b9#file-polyfill-ie11-nodelist-foreach-js
 */
if ('NodeList' in window && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}
