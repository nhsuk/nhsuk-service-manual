export default () => {

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/cookieconsent.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
  eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return '@media ' + item[2] + '{' + content + '}';\n      } else {\n        return content;\n      }\n    }).join('');\n  }; // import a list of modules into the list\n\n\n  list.i = function (modules, mediaQuery) {\n    if (typeof modules === 'string') {\n      modules = [[null, modules, '']];\n    }\n\n    var alreadyImportedModules = {};\n\n    for (var i = 0; i < this.length; i++) {\n      var id = this[i][0];\n\n      if (id != null) {\n        alreadyImportedModules[id] = true;\n      }\n    }\n\n    for (i = 0; i < modules.length; i++) {\n      var item = modules[i]; // skip already imported module\n      // this implementation is not 100% perfect for weird media query combinations\n      // when a module is imported multiple times with different media queries.\n      // I hope this will never occur (Hey this way we have smaller bundles)\n\n      if (item[0] == null || !alreadyImportedModules[item[0]]) {\n        if (mediaQuery && !item[2]) {\n          item[2] = mediaQuery;\n        } else if (mediaQuery) {\n          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';\n        }\n\n        list.push(item);\n      }\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || '';\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n  return '/*# ' + data + ' */';\n}\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");
  
  /***/ }),
  
  /***/ "./package.json":
  /*!**********************!*\
    !*** ./package.json ***!
    \**********************/
  /*! exports provided: name, version, description, main, directories, scripts, repository, author, license, bugs, homepage, devDependencies, default */
  /***/ (function(module) {
  
  eval("module.exports = {\"name\":\"cookie-consent\",\"version\":\"0.0.1\",\"description\":\"In-house solution for managing cookies on nhs.uk\",\"main\":\"src/cookieconsent.js\",\"directories\":{\"test\":\"tests\"},\"scripts\":{\"build\":\"webpack\",\"lint\":\"eslint\",\"start\":\"npm run watch & npm run testserver\",\"test\":\"npm run test:unit; npm run test:integration\",\"test:unit\":\"jest\",\"test:integration\":\"jest -c tests/integration-tests/jest.config.js\",\"testserver\":\"./node_modules/.bin/http-server\",\"watch\":\"webpack --watch\"},\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/nhsuk/cookie-consent.git\"},\"author\":\"\",\"license\":\"ISC\",\"bugs\":{\"url\":\"https://github.com/nhsuk/cookie-consent/issues\"},\"homepage\":\"https://github.com/nhsuk/cookie-consent#readme\",\"devDependencies\":{\"@babel/cli\":\"^7.1.5\",\"@babel/core\":\"^7.1.6\",\"@babel/preset-env\":\"^7.1.6\",\"babel-core\":\"^7.0.0-bridge.0\",\"babel-jest\":\"^23.6.0\",\"babel-loader\":\"^8.0.4\",\"css-loader\":\"^2.0.0\",\"eslint\":\"^5.9.0\",\"eslint-config-nhsuk\":\"^0.16.0\",\"html-loader\":\"^0.5.5\",\"http-server\":\"^0.11.1\",\"jest\":\"^23.6.0\",\"jest-puppeteer\":\"^3.5.2\",\"puppeteer\":\"^1.11.0\",\"regenerator-runtime\":\"^0.13.1\",\"webpack\":\"^4.26.1\",\"webpack-cli\":\"^3.1.2\"}};\n\n//# sourceURL=webpack:///./package.json?");
  
  /***/ }),
  
  /***/ "./src/cookieconsent.js":
  /*!******************************!*\
    !*** ./src/cookieconsent.js ***!
    \******************************/
  /*! exports provided: COOKIE_VERSION, acceptConsent, askMeLater */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"COOKIE_VERSION\", function() { return COOKIE_VERSION; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"acceptConsent\", function() { return acceptConsent; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"askMeLater\", function() { return askMeLater; });\n/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cookies */ \"./src/cookies.js\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal */ \"./src/modal.js\");\n/* harmony import */ var _enable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./enable */ \"./src/enable.js\");\n/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../package.json */ \"./package.json\");\nvar _package_json__WEBPACK_IMPORTED_MODULE_3___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../package.json */ \"./package.json\", 1);\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/* eslint-disable prefer-arrow-callback */\n\n\n\n\n/**\n * If cookie rules/regulations change and the cookie itself needs to change,\n * bump this version up afterwards. It will then give the user the banner again\n * to consent to the new rules\n */\n\nvar COOKIE_VERSION = 1;\nvar COOKIE_NAME = 'nhsuk-cookie-consent';\n/* eslint-disable sort-keys */\n\nvar cookieTypes = {\n  necessary: true,\n  preferences: true,\n  statistics: false,\n  marketing: false,\n  version: COOKIE_VERSION\n};\n/* eslint-enable sort-key */\n\nfunction getCookie() {\n  var rawCookie = Object(_cookies__WEBPACK_IMPORTED_MODULE_0__[\"getCookie\"])(COOKIE_NAME);\n  return JSON.parse(rawCookie);\n}\n\nfunction createCookie(value, days, path, domain, secure) {\n  var stringValue = JSON.stringify(value);\n  return Object(_cookies__WEBPACK_IMPORTED_MODULE_0__[\"createCookie\"])(COOKIE_NAME, stringValue, days, path, domain, secure);\n}\n\nfunction getCookieVersion() {\n  return getCookie(COOKIE_NAME).version;\n}\n\nfunction isValidVersion(version) {\n  return getCookieVersion() <= version;\n} // If consent is given, change value of cookie\n\n\nfunction acceptConsent() {\n  // On a domain where marketing cookies are required, toggleMarketing() would go here\n  Object(_modal__WEBPACK_IMPORTED_MODULE_1__[\"hideCookieModal\"])();\n}\nfunction askMeLater() {\n  createCookie(COOKIE_NAME, cookieTypes, '', '/');\n  Object(_modal__WEBPACK_IMPORTED_MODULE_1__[\"hideCookieModal\"])();\n} // N.B document.currentScript needs to be executed outside of any callbacks\n// https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript#Notes\n\nvar scriptTag = document.currentScript;\n/**\n * Get properties from the script tag that is including this javascript\n */\n\nfunction getScriptSettings() {\n  var defaults = {\n    nobanner: false\n  };\n\n  if (!scriptTag) {\n    return defaults;\n  }\n\n  var dataNobanner = scriptTag.getAttribute('data-nobanner'); // overwrite the default settings with attributes found on the <script> tag\n\n  return _objectSpread({}, defaults, {\n    nobanner: dataNobanner === 'true' || dataNobanner === ''\n  });\n}\n\nfunction getConsentSetting(key) {\n  var cookie = getCookie(COOKIE_NAME);\n  return cookie[key];\n}\n\nfunction getPreferences() {\n  return getConsentSetting('preferences');\n}\n\nfunction getStatistics() {\n  return getConsentSetting('statistics');\n}\n\nfunction getMarketing() {\n  return getConsentSetting('marketing');\n}\n\nfunction togglePreferences() {\n  var cookie = getCookie();\n  cookie.preferences = !cookie.preferences;\n  createCookie(cookie, 365, '/');\n}\n\nfunction toggleStatistics() {\n  var cookie = getCookie();\n  cookie.statistics = !cookie.statistics;\n  createCookie(cookie, 365, '/');\n}\n\nfunction toggleMarketing() {\n  var cookie = getCookie();\n  cookie.marketing = !cookie.marketing;\n  createCookie(cookie, 365, '/');\n}\n/*\n * Set the global NHSCookieConsent object that implementors of this library\n * will interact with.\n */\n\n\nwindow.NHSCookieConsent = {\n  /*\n   * The version of this package as defined in the package.json\n   */\n  VERSION: _package_json__WEBPACK_IMPORTED_MODULE_3__.version,\n  getPreferences: getPreferences,\n  getStatistics: getStatistics,\n  getMarketing: getMarketing,\n  togglePreferences: togglePreferences,\n  toggleStatistics: toggleStatistics,\n  toggleMarketing: toggleMarketing\n};\nwindow.addEventListener(\"load\", function checkCookie() {\n  var settings = getScriptSettings(); // If there isn't a user cookie, create one\n\n  if (getCookie() == null) {\n    createCookie(cookieTypes, 365, '/');\n\n    if (!settings.nobanner) {\n      Object(_modal__WEBPACK_IMPORTED_MODULE_1__[\"insertCookieBanner\"])(acceptConsent, askMeLater);\n    }\n  } else if (!isValidVersion(COOKIE_VERSION)) {\n    createCookie(cookieTypes, 365, '/');\n\n    if (!settings.nobanner) {\n      Object(_modal__WEBPACK_IMPORTED_MODULE_1__[\"insertCookieBanner\"])(acceptConsent, askMeLater);\n    }\n  }\n\n  if (getStatistics() === true) {\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableScriptsByCategory\"])('statistics');\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableIframesByCategory\"])('statistics');\n  }\n\n  if (getPreferences() === true) {\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableScriptsByCategory\"])('preferences');\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableIframesByCategory\"])('preferences');\n  }\n\n  if (getMarketing() === true) {\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableScriptsByCategory\"])('marketing');\n    Object(_enable__WEBPACK_IMPORTED_MODULE_2__[\"enableIframesByCategory\"])('marketing');\n  }\n});\n\n//# sourceURL=webpack:///./src/cookieconsent.js?");
  
  /***/ }),
  
  /***/ "./src/cookies.js":
  /*!************************!*\
    !*** ./src/cookies.js ***!
    \************************/
  /*! exports provided: createCookie, getCookie */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createCookie\", function() { return createCookie; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCookie\", function() { return getCookie; });\n//used to create a new cookie for the user which covers different cookie types\nfunction createCookie(name, value, days, path, domain, secure) {\n  //if number of days is given, sets expiry time\n  if (days) {\n    var date = new Date();\n    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);\n    var expires = date.toGMTString();\n  } else {\n    var expires = \"\";\n  } //appends name to cookie, making it searchable\n\n\n  var cookieString = name + \"=\" + escape(value);\n  if (expires) cookieString += \";expires=\" + expires;\n  if (path) cookieString += \";path=\" + escape(path);\n  if (domain) cookieString += \";domain=\" + escape(domain);\n  if (secure) cookieString += \";secure\";\n  cookieString += \";\"; //cookiestring now contains all necessary details and is turned into a cookie\n\n  document.cookie = cookieString;\n}\n; //gets a cookie based on the name\n\nfunction getCookie(name) {\n  var dc = document.cookie;\n  var prefix = name + \"=\";\n  var begin = dc.indexOf(\"; \" + prefix);\n\n  if (begin == -1) {\n    begin = dc.indexOf(prefix);\n    if (begin != 0) return null;\n  } else {\n    begin += 2;\n    var end = document.cookie.indexOf(\";\", begin);\n\n    if (end == -1) {\n      end = dc.length;\n    }\n  } // because unescape has been deprecated, replaced with decodeURI\n\n\n  return decodeURIComponent(dc.substring(begin + prefix.length, end));\n}\n\n//# sourceURL=webpack:///./src/cookies.js?");
  
  /***/ }),
  
  /***/ "./src/enable.js":
  /*!***********************!*\
    !*** ./src/enable.js ***!
    \***********************/
  /*! exports provided: enableScriptsByCategory, enableIframesByCategory */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"enableScriptsByCategory\", function() { return enableScriptsByCategory; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"enableIframesByCategory\", function() { return enableIframesByCategory; });\n/*\n * Changing the type to text/javascript will not cause the script to execute.\n * We need to add a sibling and then remove the original node.\n */\nfunction enableScript(script) {\n  var newScript = script.cloneNode(true);\n  var parent = script.parentElement;\n  newScript.setAttribute('type', 'text/javascript');\n  parent.insertBefore(newScript, script);\n  script.remove();\n}\n/*\n * Enable iframes by setting the src from the data-src attribute\n */\n\n\nfunction enableIframe(iframe) {\n  var src = iframe.getAttribute('data-src');\n  iframe.setAttribute('src', src);\n}\n/**\n * Enable all scripts for a given data-cookieconsent category\n */\n\n\nfunction enableScriptsByCategory(category) {\n  var scripts = document.querySelectorAll(\"script[data-cookieconsent=\\\"\".concat(category, \"\\\"]\"));\n  scripts.forEach(function (script) {\n    return enableScript(script);\n  });\n}\n/**\n * Enable all iframes for a given data-cookieconsent category\n */\n\nfunction enableIframesByCategory(category) {\n  var iframes = document.querySelectorAll(\"iframe[data-cookieconsent=\\\"\".concat(category, \"\\\"]\"));\n  iframes.forEach(function (iframe) {\n    return enableIframe(iframe);\n  });\n}\n\n//# sourceURL=webpack:///./src/enable.js?");
  
  /***/ }),
  
  /***/ "./src/modal.html":
  /*!************************!*\
    !*** ./src/modal.html ***!
    \************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  eval("module.exports = \"<div id=\\\"cookie-banner\\\">\\n  <div class=\\\".nhsuk-grid-column-full\\\">\\n    <div class=\\\"cookie-text clear\\\">\\n      <p>\\n        The NHS website uses cookies to improve your on-site experience.\\n        <a class=\\\"cookie-banner-policy\\\" href=\\\"https://nhsuk-service-manual.azurewebsites.net/service-manual/cookies\\\" target=\\\"_blank\\\">Find out more about cookies</a>\\n      </p>\\n      <p class=\\\"cookie-banner-close\\\">\\n        <a href=\\\"#\\\">\\n          <img src=\\\"../assets/icons/icon-close-das.gif\\\" alt=\\\"Close cookie banner\\\">\\n        </a>\\n      </p>\\n    </div>\\n  </div>\\n</div>\\n\";\n\n//# sourceURL=webpack:///./src/modal.html?");
  
  /***/ }),
  
  /***/ "./src/modal.js":
  /*!**********************!*\
    !*** ./src/modal.js ***!
    \**********************/
  /*! exports provided: hideCookieModal, insertCookieBanner */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hideCookieModal\", function() { return hideCookieModal; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"insertCookieBanner\", function() { return insertCookieBanner; });\n/* harmony import */ var _modal_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal.html */ \"./src/modal.html\");\n/* harmony import */ var _modal_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modal_html__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ \"./src/style.css\");\n/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction hideCookieModal() {\n  document.getElementById('cookie-banner').style.display = 'none';\n  var header = document.getElementsByClassName('nhsuk-global-header')[0];\n  header.style.marginTop = 0;\n}\nfunction insertCookieBanner(acceptConsent, askMeLater) {\n  // add a css block to the inserted html\n  var html = \"\".concat(_modal_html__WEBPACK_IMPORTED_MODULE_0___default.a, \" <style>\").concat(_style_css__WEBPACK_IMPORTED_MODULE_1___default.a.toString(), \"</style>\");\n  document.getElementsByTagName('body')[0].innerHTML = html + document.getElementsByTagName('body')[0].innerHTML;\n  document.getElementsByClassName('cookie-banner-close')[0].setAttribute('onclick', \"document.getElementById('cookie-banner').style.display = 'none';\");\n}\n\n//# sourceURL=webpack:///./src/modal.js?");
  
  /***/ }),
  
  /***/ "./src/style.css":
  /*!***********************!*\
    !*** ./src/style.css ***!
    \***********************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"#cookie-banner {\\n    background: #034484;\\n    font-size: 10px;\\n  }\\n  \\n  #cookie-banner .cookie-text {\\n    background: #034484;\\n    /* background color needed due to ipad issue showing a line */\\n    margin: 0 auto;\\n    text-align: center;\\n    max-width: 960px;\\n  }\\n  @media (max-width: 1019px) {\\n    #cookie-banner .cookie-text {\\n      margin: 0 32px;\\n    }\\n  }\\n  \\n  @media (max-width: 769px) {\\n    #cookie-banner .cookie-text {\\n      margin: 0 16px;\\n    }\\n  }\\n  #cookie-banner .cookie-text:after {\\n    content: \\\".\\\";\\n    display: block;\\n    height: 0;\\n    clear: both;\\n    visibility: hidden;\\n  }\\n  \\n  #cookie-banner .cookie-text p {\\n    background: #034484;\\n    color: #fff;\\n    float: left;\\n    font-size: 13px;\\n    font-weight: 600;\\n    margin: 0;\\n    padding: 1.2em 0;\\n    text-align: left;\\n    width: 90%;\\n  }\\n  \\n  #cookie-banner .cookie-text .cookie-banner-close {\\n    text-align: right;\\n    width: 10%;\\n  }\\n  \\n  #cookie-banner .cookie-text a {\\n    color: #fff;\\n    text-decoration: underline;\\n  }\\n  \\n  #cookie-banner .cookie-text a:hover,\\n  #cookie-banner .cookie-text a:active,\\n  #cookie-banner .cookie-text a:focus {\\n    text-decoration: none;\\n  }\\n  \\n  #cookie-banner .cookie-banner-close a:hover,\\n  #cookie-banner .cookie-banner-close a:focus {\\n    background: none;\\n    box-shadow: none;\\n  }\\n  \\n  #cookie-banner .cookie-banner-close img {\\n    display: inline;\\n    position: relative;\\n  }\", \"\"]);\n\n\n\n//# sourceURL=webpack:///./src/style.css?");
  
  /***/ })
  
  /******/ });

}
