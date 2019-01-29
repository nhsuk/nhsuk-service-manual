(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var digitalData = (function () {
  function getPageName(path) {
    return 'nhs:beta' + path.replace(/\/$/, '').replace(/\//g, ':');
  }

  function getCategories(path) {
    return path.split('/').filter(Boolean);
  }

  function setupDigitalData() {
    var path = document.location.pathname;
    var categories = getCategories(path);
    window.digitalData = {
      page: {
        category: {
          primaryCategory: categories[0],
          subCategory1: categories[1],
          subCategory2: categories[2],
          subCategory3: categories[3]
        },
        pageInfo: {
          pageName: getPageName(path)
        }
      }
    };
  }

  setupDigitalData();
});

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume("next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

if (typeof Symbol === "function" && Symbol.asyncIterator) {
  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
    return this;
  };
}

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/*
 * File: iframeResizer.js
 * Desc: Force iframes to size to content.
 * Requires: iframeResizer.contentWindow.js to be loaded into the target frame.
 * Doc: https://github.com/davidjbradshaw/iframe-resizer
 * Author: David J. Bradshaw - dave@bradshaw.net
 * Contributor: Jure Mav - jure.mav@gmail.com
 * Contributor: Reed Dadoune - reed@dadoune.com
 */


(function(undefined) {
  'use strict';

  if(typeof window === 'undefined') return; // don't run for server side render

  var
    count                 = 0,
    logEnabled            = false,
    hiddenCheckEnabled    = false,
    msgHeader             = 'message',
    msgHeaderLen          = msgHeader.length,
    msgId                 = '[iFrameSizer]', //Must match iframe msg ID
    msgIdLen              = msgId.length,
    pagePosition          = null,
    requestAnimationFrame = window.requestAnimationFrame,
    resetRequiredMethods  = {max:1,scroll:1,bodyScroll:1,documentElementScroll:1},
    settings              = {},
    timer                 = null,
    logId                 = 'Host Page',

    defaults              = {
      autoResize                : true,
      bodyBackground            : null,
      bodyMargin                : null,
      bodyMarginV1              : 8,
      bodyPadding               : null,
      checkOrigin               : true,
      inPageLinks               : false,
      enablePublicMethods       : true,
      heightCalculationMethod   : 'bodyOffset',
      id                        : 'iFrameResizer',
      interval                  : 32,
      log                       : false,
      maxHeight                 : Infinity,
      maxWidth                  : Infinity,
      minHeight                 : 0,
      minWidth                  : 0,
      resizeFrom                : 'parent',
      scrolling                 : false,
      sizeHeight                : true,
      sizeWidth                 : false,
      warningTimeout            : 5000,
      tolerance                 : 0,
      widthCalculationMethod    : 'scroll',
      closedCallback            : function() {},
      initCallback              : function() {},
      messageCallback           : function() {warn('MessageCallback function not defined');},
      resizedCallback           : function() {},
      scrollCallback            : function() {return true;}
    };

  function addEventListener(obj,evt,func) {
    /* istanbul ignore else */ // Not testable in PhantonJS
    if ('addEventListener' in window) {
      obj.addEventListener(evt,func, false);
    } else if ('attachEvent' in window) {//IE
      obj.attachEvent('on'+evt,func);
    }
  }

  function removeEventListener(el,evt,func) {
    /* istanbul ignore else */ // Not testable in phantonJS
    if ('removeEventListener' in window) {
      el.removeEventListener(evt,func, false);
    } else if ('detachEvent' in window) { //IE
      el.detachEvent('on'+evt,func);
    }
  }

  function setupRequestAnimationFrame() {
    var
      vendors = ['moz', 'webkit', 'o', 'ms'],
      x;

    // Remove vendor prefixing if prefixed and break early if not
    for (x = 0; x < vendors.length && !requestAnimationFrame; x += 1) {
      requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    }

    if (!(requestAnimationFrame)) {
      log('setup','RequestAnimationFrame not supported');
    }
  }

  function getMyID(iframeId) {
    var retStr = 'Host page: '+iframeId;

    if (window.top !== window.self) {
      if (window.parentIFrame && window.parentIFrame.getId) {
        retStr = window.parentIFrame.getId()+': '+iframeId;
      } else {
        retStr = 'Nested host page: '+iframeId;
      }
    }

    return retStr;
  }

  function formatLogHeader(iframeId) {
    return msgId + '[' + getMyID(iframeId) + ']';
  }

  function isLogEnabled(iframeId) {
    return settings[iframeId] ? settings[iframeId].log : logEnabled;
  }

  function log(iframeId,msg) {
    output('log',iframeId,msg,isLogEnabled(iframeId));
  }

  function info(iframeId,msg) {
    output('info',iframeId,msg,isLogEnabled(iframeId));
  }

  function warn(iframeId,msg) {
    output('warn',iframeId,msg,true);
  }

  function output(type,iframeId,msg,enabled) {
    if (true === enabled && 'object' === typeof window.console) {
      console[type](formatLogHeader(iframeId),msg);
    }
  }

  function iFrameListener(event) {
    function resizeIFrame() {
      function resize() {
        setSize(messageData);
        setPagePosition(iframeId);
        callback('resizedCallback',messageData);
      }

      ensureInRange('Height');
      ensureInRange('Width');

      syncResize(resize,messageData,'init');
    }

    function processMsg() {
      var data = msg.substr(msgIdLen).split(':');

      return {
        iframe: settings[data[0]] && settings[data[0]].iframe,
        id:     data[0],
        height: data[1],
        width:  data[2],
        type:   data[3]
      };
    }

    function ensureInRange(Dimension) {
      var
        max  = Number(settings[iframeId]['max' + Dimension]),
        min  = Number(settings[iframeId]['min' + Dimension]),
        dimension = Dimension.toLowerCase(),
        size = Number(messageData[dimension]);

      log(iframeId,'Checking ' + dimension + ' is in range ' + min + '-' + max);

      if (size<min) {
        size=min;
        log(iframeId,'Set ' + dimension + ' to min value');
      }

      if (size>max) {
        size=max;
        log(iframeId,'Set ' + dimension + ' to max value');
      }

      messageData[dimension] = '' + size;
    }


    function isMessageFromIFrame() {
      function checkAllowedOrigin() {
        function checkList() {
          var
            i = 0,
            retCode = false;

          log(iframeId,'Checking connection is from allowed list of origins: ' + checkOrigin);

          for (; i < checkOrigin.length; i++) {
            if (checkOrigin[i] === origin) {
              retCode = true;
              break;
            }
          }
          return retCode;
        }

        function checkSingle() {
          var remoteHost  = settings[iframeId] && settings[iframeId].remoteHost;
          log(iframeId,'Checking connection is from: '+remoteHost);
          return origin === remoteHost;
        }

        return checkOrigin.constructor === Array ? checkList() : checkSingle();
      }

      var
        origin      = event.origin,
        checkOrigin = settings[iframeId] && settings[iframeId].checkOrigin;

      if (checkOrigin && (''+origin !== 'null') && !checkAllowedOrigin()) {
        throw new Error(
          'Unexpected message received from: ' + origin +
          ' for ' + messageData.iframe.id +
          '. Message was: ' + event.data +
          '. This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.'
        );
      }

      return true;
    }

    function isMessageForUs() {
      return msgId === (('' + msg).substr(0,msgIdLen)) && (msg.substr(msgIdLen).split(':')[0] in settings); //''+Protects against non-string msg
    }

    function isMessageFromMetaParent() {
      //Test if this message is from a parent above us. This is an ugly test, however, updating
      //the message format would break backwards compatibity.
      var retCode = messageData.type in {'true':1,'false':1,'undefined':1};

      if (retCode) {
        log(iframeId,'Ignoring init message from meta parent page');
      }

      return retCode;
    }

    function getMsgBody(offset) {
      return msg.substr(msg.indexOf(':')+msgHeaderLen+offset);
    }

    function forwardMsgFromIFrame(msgBody) {
      log(iframeId,'MessageCallback passed: {iframe: '+ messageData.iframe.id + ', message: ' + msgBody + '}');
      callback('messageCallback',{
        iframe: messageData.iframe,
        message: JSON.parse(msgBody)
      });
      log(iframeId,'--');
    }

    function getPageInfo() {
      var
        bodyPosition   = document.body.getBoundingClientRect(),
        iFramePosition = messageData.iframe.getBoundingClientRect();

      return JSON.stringify({
        iframeHeight: iFramePosition.height,
        iframeWidth:  iFramePosition.width,
        clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        clientWidth:  Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0),
        offsetTop:    parseInt(iFramePosition.top  - bodyPosition.top,  10),
        offsetLeft:   parseInt(iFramePosition.left - bodyPosition.left, 10),
        scrollTop:    window.pageYOffset,
        scrollLeft:   window.pageXOffset
      });
    }

    function sendPageInfoToIframe(iframe,iframeId) {
      function debouncedTrigger() {
        trigger(
          'Send Page Info',
          'pageInfo:' + getPageInfo(),
          iframe,
          iframeId
        );
      }
      debounceFrameEvents(debouncedTrigger,32,iframeId);
    }


    function startPageInfoMonitor() {
      function setListener(type,func) {
        function sendPageInfo() {
          if (settings[id]) {
            sendPageInfoToIframe(settings[id].iframe,id);
          } else {
            stop();
          }
        }

        ['scroll','resize'].forEach(function(evt) {
          log(id, type +  evt + ' listener for sendPageInfo');
          func(window,evt,sendPageInfo);
        });
      }

      function stop() {
        setListener('Remove ', removeEventListener);
      }

      function start() {
        setListener('Add ', addEventListener);
      }

      var id = iframeId; //Create locally scoped copy of iFrame ID

      start();

      if (settings[id]) {
        settings[id].stopPageInfo = stop;
      }
    }

    function stopPageInfoMonitor() {
      if (settings[iframeId] && settings[iframeId].stopPageInfo) {
        settings[iframeId].stopPageInfo();
        delete settings[iframeId].stopPageInfo;
      }
    }

    function checkIFrameExists() {
      var retBool = true;

      if (null === messageData.iframe) {
        warn(iframeId,'IFrame ('+messageData.id+') not found');
        retBool = false;
      }
      return retBool;
    }

    function getElementPosition(target) {
      var iFramePosition = target.getBoundingClientRect();

      getPagePosition(iframeId);

      return {
        x: Math.floor( Number(iFramePosition.left) + Number(pagePosition.x) ),
        y: Math.floor( Number(iFramePosition.top)  + Number(pagePosition.y) )
      };
    }

    function scrollRequestFromChild(addOffset) {
      /* istanbul ignore next */  //Not testable in Karma
      function reposition() {
        pagePosition = newPosition;
        scrollTo();
        log(iframeId,'--');
      }

      function calcOffset() {
        return {
          x: Number(messageData.width) + offset.x,
          y: Number(messageData.height) + offset.y
        };
      }

      function scrollParent() {
        if (window.parentIFrame) {
          window.parentIFrame['scrollTo'+(addOffset?'Offset':'')](newPosition.x,newPosition.y);
        } else {
          warn(iframeId,'Unable to scroll to requested position, window.parentIFrame not found');
        }
      }

      var
        offset = addOffset ? getElementPosition(messageData.iframe) : {x:0,y:0},
        newPosition = calcOffset();

      log(iframeId,'Reposition requested from iFrame (offset x:'+offset.x+' y:'+offset.y+')');

      if(window.top !== window.self) {
        scrollParent();
      } else {
        reposition();
      }
    }

    function scrollTo() {
      if (false !== callback('scrollCallback',pagePosition)) {
        setPagePosition(iframeId);
      } else {
        unsetPagePosition();
      }
    }

    function findTarget(location) {
      function jumpToTarget() {
        var jumpPosition = getElementPosition(target);

        log(iframeId,'Moving to in page link (#'+hash+') at x: '+jumpPosition.x+' y: '+jumpPosition.y);
        pagePosition = {
          x: jumpPosition.x,
          y: jumpPosition.y
        };

        scrollTo();
        log(iframeId,'--');
      }

      function jumpToParent() {
        if (window.parentIFrame) {
          window.parentIFrame.moveToAnchor(hash);
        } else {
          log(iframeId,'In page link #'+hash+' not found and window.parentIFrame not found');
        }
      }

      var
        hash     = location.split('#')[1] || '',
        hashData = decodeURIComponent(hash),
        target   = document.getElementById(hashData) || document.getElementsByName(hashData)[0];

      if (target) {
        jumpToTarget();
      } else if(window.top!==window.self) {
        jumpToParent();
      } else {
        log(iframeId,'In page link #'+hash+' not found');
      }
    }

    function callback(funcName,val) {
      return chkCallback(iframeId,funcName,val);
    }

    function actionMsg() {

      if(settings[iframeId] && settings[iframeId].firstRun) firstRun();

      switch(messageData.type) {
      case 'close':
        if(settings[iframeId].closeRequestCallback) chkCallback(iframeId, 'closeRequestCallback', settings[iframeId].iframe);
        else closeIFrame(messageData.iframe);
        break;
      case 'message':
        forwardMsgFromIFrame(getMsgBody(6));
        break;
      case 'scrollTo':
        scrollRequestFromChild(false);
        break;
      case 'scrollToOffset':
        scrollRequestFromChild(true);
        break;
      case 'pageInfo':
        sendPageInfoToIframe(settings[iframeId] && settings[iframeId].iframe,iframeId);
        startPageInfoMonitor();
        break;
      case 'pageInfoStop':
        stopPageInfoMonitor();
        break;
      case 'inPageLink':
        findTarget(getMsgBody(9));
        break;
      case 'reset':
        resetIFrame(messageData);
        break;
      case 'init':
        resizeIFrame();
        callback('initCallback',messageData.iframe);
        break;
      default:
        resizeIFrame();
      }
    }

    function hasSettings(iframeId) {
      var retBool = true;

      if (!settings[iframeId]) {
        retBool = false;
        warn(messageData.type + ' No settings for ' + iframeId + '. Message was: ' + msg);
      }

      return retBool;
    }

    function iFrameReadyMsgReceived() {
      for (var iframeId in settings) {
        trigger('iFrame requested init',createOutgoingMsg(iframeId),document.getElementById(iframeId),iframeId);
      }
    }

    function firstRun() {
      if (settings[iframeId]) {
        settings[iframeId].firstRun = false;
      }
    }

    var
      msg = event.data,
      messageData = {},
      iframeId = null;

    if('[iFrameResizerChild]Ready' === msg) {
      iFrameReadyMsgReceived();
    } else if (isMessageForUs()) {
      messageData = processMsg();
      iframeId    = logId = messageData.id;
      if (settings[iframeId]) {
        settings[iframeId].loaded = true;
      }

      if (!isMessageFromMetaParent() && hasSettings(iframeId)) {
        log(iframeId,'Received: '+msg);

        if ( checkIFrameExists() && isMessageFromIFrame() ) {
          actionMsg();
        }
      }
    } else {
      info(iframeId,'Ignored: '+msg);
    }

  }


  function chkCallback(iframeId,funcName,val) {
    var
      func = null,
      retVal = null;

    if(settings[iframeId]) {
      func = settings[iframeId][funcName];

      if( 'function' === typeof func) {
        retVal = func(val);
      } else {
        throw new TypeError(funcName+' on iFrame['+iframeId+'] is not a function');
      }
    }

    return retVal;
  }

  function removeIframeListeners(iframe) {
    var iframeId = iframe.id;
    delete settings[iframeId];
  }

  function closeIFrame(iframe) {
    var iframeId = iframe.id;
    log(iframeId,'Removing iFrame: '+iframeId);

    try {
      // Catch race condition error with React
      if (iframe.parentNode) { iframe.parentNode.removeChild(iframe); }
    } catch (e) {}
    
    chkCallback(iframeId,'closedCallback',iframeId);
    log(iframeId,'--');
    removeIframeListeners(iframe);
  }

  function getPagePosition(iframeId) {
    if(null === pagePosition) {
      pagePosition = {
        x: (window.pageXOffset !== undefined) ? window.pageXOffset : document.documentElement.scrollLeft,
        y: (window.pageYOffset !== undefined) ? window.pageYOffset : document.documentElement.scrollTop
      };
      log(iframeId,'Get page position: '+pagePosition.x+','+pagePosition.y);
    }
  }

  function setPagePosition(iframeId) {
    if(null !== pagePosition) {
      window.scrollTo(pagePosition.x,pagePosition.y);
      log(iframeId,'Set page position: '+pagePosition.x+','+pagePosition.y);
      unsetPagePosition();
    }
  }

  function unsetPagePosition() {
    pagePosition = null;
  }

  function resetIFrame(messageData) {
    function reset() {
      setSize(messageData);
      trigger('reset','reset',messageData.iframe,messageData.id);
    }

    log(messageData.id,'Size reset requested by '+('init'===messageData.type?'host page':'iFrame'));
    getPagePosition(messageData.id);
    syncResize(reset,messageData,'reset');
  }

  function setSize(messageData) {
    function setDimension(dimension) {
      if (!messageData.id) {
        log(
            'undefined',
            'messageData id not set'
        );
        return;
      }
      messageData.iframe.style[dimension] = messageData[dimension] + 'px';
      log(
        messageData.id,
        'IFrame (' + iframeId +
        ') ' + dimension +
        ' set to ' + messageData[dimension] + 'px'
      );
    }

    function chkZero(dimension) {
      //FireFox sets dimension of hidden iFrames to zero.
      //So if we detect that set up an event to check for
      //when iFrame becomes visible.

      /* istanbul ignore next */  //Not testable in PhantomJS
      if (!hiddenCheckEnabled && '0' === messageData[dimension]) {
        hiddenCheckEnabled = true;
        log(iframeId,'Hidden iFrame detected, creating visibility listener');
        fixHiddenIFrames();
      }
    }

    function processDimension(dimension) {
      setDimension(dimension);
      chkZero(dimension);
    }

    var iframeId = messageData.iframe.id;

    if(settings[iframeId]) {
      if( settings[iframeId].sizeHeight) { processDimension('height'); }
      if( settings[iframeId].sizeWidth ) { processDimension('width'); }
    }
  }

  function syncResize(func,messageData,doNotSync) {
    /* istanbul ignore if */  //Not testable in PhantomJS
    if(doNotSync!==messageData.type && requestAnimationFrame) {
      log(messageData.id,'Requesting animation frame');
      requestAnimationFrame(func);
    } else {
      func();
    }
  }

  function trigger(calleeMsg, msg, iframe, id, noResponseWarning) {
    function postMessageToIFrame() {
      var target = settings[id] && settings[id].targetOrigin;
      log(id,'[' + calleeMsg + '] Sending msg to iframe['+id+'] ('+msg+') targetOrigin: '+target);
      iframe.contentWindow.postMessage( msgId + msg, target );
    }

    function iFrameNotFound() {
      warn(id,'[' + calleeMsg + '] IFrame('+id+') not found');
    }

    function chkAndSend() {
      if(iframe && 'contentWindow' in iframe && (null !== iframe.contentWindow)) { //Null test for PhantomJS
        postMessageToIFrame();
      } else {
        iFrameNotFound();
      }
    }

    function warnOnNoResponse() {
      function warning() {
        if (settings[id] && !settings[id].loaded && !errorShown) {
          errorShown = true;
          warn(id, 'IFrame has not responded within '+ settings[id].warningTimeout/1000 +' seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning.');
        }
      }

      if (!!noResponseWarning && settings[id] && !!settings[id].warningTimeout) {
        settings[id].msgTimeout = setTimeout(warning, settings[id].warningTimeout);
      }
    }

    var errorShown = false;

    id = id || iframe.id;

    if(settings[id]) {
      chkAndSend();
      warnOnNoResponse();
    }

  }

  function createOutgoingMsg(iframeId) {
    return iframeId +
      ':' + settings[iframeId].bodyMarginV1 +
      ':' + settings[iframeId].sizeWidth +
      ':' + settings[iframeId].log +
      ':' + settings[iframeId].interval +
      ':' + settings[iframeId].enablePublicMethods +
      ':' + settings[iframeId].autoResize +
      ':' + settings[iframeId].bodyMargin +
      ':' + settings[iframeId].heightCalculationMethod +
      ':' + settings[iframeId].bodyBackground +
      ':' + settings[iframeId].bodyPadding +
      ':' + settings[iframeId].tolerance +
      ':' + settings[iframeId].inPageLinks +
      ':' + settings[iframeId].resizeFrom +
      ':' + settings[iframeId].widthCalculationMethod;
  }

  function setupIFrame(iframe,options) {
    function setLimits() {
      function addStyle(style) {
        if ((Infinity !== settings[iframeId][style]) && (0 !== settings[iframeId][style])) {
          iframe.style[style] = settings[iframeId][style] + 'px';
          log(iframeId,'Set '+style+' = '+settings[iframeId][style]+'px');
        }
      }

      function chkMinMax(dimension) {
        if (settings[iframeId]['min'+dimension]>settings[iframeId]['max'+dimension]) {
          throw new Error('Value for min'+dimension+' can not be greater than max'+dimension);
        }
      }

      chkMinMax('Height');
      chkMinMax('Width');

      addStyle('maxHeight');
      addStyle('minHeight');
      addStyle('maxWidth');
      addStyle('minWidth');
    }

    function newId() {
      var id = ((options && options.id) || defaults.id + count++);
      if  (null !== document.getElementById(id)) {
        id = id + count++;
      }
      return id;
    }

    function ensureHasId(iframeId) {
      logId=iframeId;
      if (''===iframeId) {
        iframe.id = iframeId =  newId();
        logEnabled = (options || {}).log;
        logId=iframeId;
        log(iframeId,'Added missing iframe ID: '+ iframeId +' (' + iframe.src + ')');
      }


      return iframeId;
    }

    function setScrolling() {
      log(iframeId,'IFrame scrolling ' + (settings[iframeId] && settings[iframeId].scrolling ? 'enabled' : 'disabled') + ' for ' + iframeId);
      iframe.style.overflow = false === (settings[iframeId] && settings[iframeId].scrolling) ? 'hidden' : 'auto';
      switch(settings[iframeId] && settings[iframeId].scrolling) {
        case 'omit':
          break;
        case true:
          iframe.scrolling = 'yes';
          break;
        case false:
          iframe.scrolling = 'no';
          break;
        default:
          iframe.scrolling = settings[iframeId] ? settings[iframeId].scrolling : 'no';
      }
    }

    //The V1 iFrame script expects an int, where as in V2 expects a CSS
    //string value such as '1px 3em', so if we have an int for V2, set V1=V2
    //and then convert V2 to a string PX value.
    function setupBodyMarginValues() {
      if (('number'===typeof(settings[iframeId] && settings[iframeId].bodyMargin)) || ('0'===(settings[iframeId] && settings[iframeId].bodyMargin))) {
        settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin;
        settings[iframeId].bodyMargin   = '' + settings[iframeId].bodyMargin + 'px';
      }
    }

    function checkReset() {
      // Reduce scope of firstRun to function, because IE8's JS execution
      // context stack is borked and this value gets externally
      // changed midway through running this function!!!
      var
        firstRun           = settings[iframeId] && settings[iframeId].firstRun,
        resetRequertMethod = settings[iframeId] && settings[iframeId].heightCalculationMethod in resetRequiredMethods;

      if (!firstRun && resetRequertMethod) {
        resetIFrame({iframe:iframe, height:0, width:0, type:'init'});
      }
    }

    function setupIFrameObject() {
      if(Function.prototype.bind && settings[iframeId]) { //Ignore unpolyfilled IE8.
        settings[iframeId].iframe.iFrameResizer = {

          close        : closeIFrame.bind(null,settings[iframeId].iframe),

          removeListeners: removeIframeListeners.bind(null,settings[iframeId].iframe),

          resize       : trigger.bind(null,'Window resize', 'resize', settings[iframeId].iframe),

          moveToAnchor : function(anchor) {
            trigger('Move to anchor','moveToAnchor:'+anchor, settings[iframeId].iframe,iframeId);
          },

          sendMessage  : function(message) {
            message = JSON.stringify(message);
            trigger('Send Message','message:'+message, settings[iframeId].iframe, iframeId);
          }
        };
      }
    }

    //We have to call trigger twice, as we can not be sure if all
    //iframes have completed loading when this code runs. The
    //event listener also catches the page changing in the iFrame.
    function init(msg) {
      function iFrameLoaded() {
        trigger('iFrame.onload', msg, iframe, undefined , true);
        checkReset();
      }

      addEventListener(iframe,'load',iFrameLoaded);
      trigger('init', msg, iframe, undefined, true);
    }

    function checkOptions(options) {
      if ('object' !== typeof options) {
        throw new TypeError('Options is not an object');
      }
    }

    function copyOptions(options) {
      for (var option in defaults) {
        if (defaults.hasOwnProperty(option)) {
          settings[iframeId][option] = options.hasOwnProperty(option) ? options[option] : defaults[option];
        }
      }
    }

    function getTargetOrigin (remoteHost) {
      return ('' === remoteHost || 'file://' === remoteHost) ? '*' : remoteHost;
    }

    function processOptions(options) {
      options = options || {};
      settings[iframeId] = {
        firstRun	: true,
        iframe		: iframe,
        remoteHost	: iframe.src.split('/').slice(0,3).join('/')
      };

      checkOptions(options);
      copyOptions(options);

      if (settings[iframeId]) {
        settings[iframeId].targetOrigin = true === settings[iframeId].checkOrigin ? getTargetOrigin(settings[iframeId].remoteHost) : '*';
      }
    }

    function beenHere() {
      return (iframeId in settings && 'iFrameResizer' in iframe);
    }

    var iframeId = ensureHasId(iframe.id);

    if (!beenHere()) {
      processOptions(options);
      setScrolling();
      setLimits();
      setupBodyMarginValues();
      init(createOutgoingMsg(iframeId));
      setupIFrameObject();
    } else {
      warn(iframeId,'Ignored iFrame, already setup.');
    }
  }

  function debouce(fn,time) {
    if (null === timer) {
      timer = setTimeout(function() {
        timer = null;
        fn();
      }, time);
    }
  }
  
  var frameTimer = {};
  function debounceFrameEvents(fn,time,frameId) {
    if (!frameTimer[frameId]) {
      frameTimer[frameId] = setTimeout(function() {
        frameTimer[frameId] = null;
        fn();
      }, time);
    }
  }

  /* istanbul ignore next */  //Not testable in PhantomJS
  function fixHiddenIFrames() {
    function checkIFrames() {
      function checkIFrame(settingId) {
        function chkDimension(dimension) {
          return '0px' === (settings[settingId] && settings[settingId].iframe.style[dimension]);
        }

        function isVisible(el) {
          return (null !== el.offsetParent);
        }

        if (settings[settingId] && isVisible(settings[settingId].iframe) && (chkDimension('height') || chkDimension('width'))) {
          trigger('Visibility change', 'resize', settings[settingId].iframe, settingId);
        }
      }

      for (var settingId in settings) {
        checkIFrame(settingId);
      }
    }

    function mutationObserved(mutations) {
      log('window','Mutation observed: ' + mutations[0].target + ' ' + mutations[0].type);
      debouce(checkIFrames,16);
    }

    function createMutationObserver() {
      var
        target = document.querySelector('body'),

        config = {
          attributes            : true,
          attributeOldValue     : false,
          characterData         : true,
          characterDataOldValue : false,
          childList             : true,
          subtree               : true
        },

        observer = new MutationObserver(mutationObserved);

      observer.observe(target, config);
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (MutationObserver) createMutationObserver();
  }


  function resizeIFrames(event) {
    function resize() {
      sendTriggerMsg('Window '+event,'resize');
    }

    log('window','Trigger event: '+event);
    debouce(resize,16);
  }

  /* istanbul ignore next */  //Not testable in PhantomJS
  function tabVisible() {
    function resize() {
      sendTriggerMsg('Tab Visable','resize');
    }

    if('hidden' !== document.visibilityState) {
      log('document','Trigger event: Visiblity change');
      debouce(resize,16);
    }
  }

  function sendTriggerMsg(eventName,event) {
    function isIFrameResizeEnabled(iframeId) {
      return	settings[iframeId] &&
          'parent' === settings[iframeId].resizeFrom &&
          settings[iframeId].autoResize &&
          !settings[iframeId].firstRun;
    }

    for (var iframeId in settings) {
      if(isIFrameResizeEnabled(iframeId)) {
        trigger(eventName, event, document.getElementById(iframeId), iframeId);
      }
    }
  }

  function setupEventListeners() {
    addEventListener(window,'message',iFrameListener);

    addEventListener(window,'resize', function() {resizeIFrames('resize');});

    addEventListener(document,'visibilitychange',tabVisible);
    addEventListener(document,'-webkit-visibilitychange',tabVisible); //Andriod 4.4
    addEventListener(window,'focusin',function() {resizeIFrames('focus');}); //IE8-9
    addEventListener(window,'focus',function() {resizeIFrames('focus');});
  }


  function factory() {
    function init(options,element) {
      function chkType() {
        if(!element.tagName) {
          throw new TypeError('Object is not a valid DOM element');
        } else if ('IFRAME' !== element.tagName.toUpperCase()) {
          throw new TypeError('Expected <IFRAME> tag, found <'+element.tagName+'>');
        }
      }

      if(element) {
        chkType();
        setupIFrame(element, options);
        iFrames.push(element);
      }
    }

    function warnDeprecatedOptions(options) {
      if (options && options.enablePublicMethods) {
        warn('enablePublicMethods option has been removed, public methods are now always available in the iFrame');
      }
    }

    var iFrames;

    setupRequestAnimationFrame();
    setupEventListeners();

    return function iFrameResizeF(options,target) {
      iFrames = []; //Only return iFrames past in on this call

      warnDeprecatedOptions(options);

      switch (typeof(target)) {
      case 'undefined':
      case 'string':
        Array.prototype.forEach.call(
          document.querySelectorAll( target || 'iframe' ),
          init.bind(undefined, options)
        );
        break;
      case 'object':
        init(options,target);
        break;
      default:
        throw new TypeError('Unexpected data type ('+typeof(target)+')');
      }

      return iFrames;
    };
  }

  function createJQueryPublicMethod($) {
    if (!$.fn) {
      info('','Unable to bind to jQuery, it is not fully loaded.');
    } else if (!$.fn.iFrameResize) {
      $.fn.iFrameResize = function $iFrameResizeF(options) {
        function init(index, element) {
          setupIFrame(element, options);
        }

        return this.filter('iframe').each(init).end();
      };
    }
  }

  if (window.jQuery) { createJQueryPublicMethod(window.jQuery); }

  if (typeof define === 'function' && define.amd) {
    define([],factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') { //Node for browserfy
    module.exports = factory();
  } else {
    window.iFrameResize = window.iFrameResize || factory();
  }

})();

var DesignExample =
/*#__PURE__*/
function () {
  _createClass(DesignExample, null, [{
    key: "selector",
    value: function selector() {
      return '.design-example';
    }
  }]);

  function DesignExample(node) {
    _classCallCheck(this, DesignExample);

    this.node = node;
    this.tabClass = 'app-tabs__item';
    this.currentTabClass = this.tabClass + '--current';
    this.hiddenClass = 'js-hidden';
    this.tabs = Array.prototype.slice.call(this.node.querySelectorAll(".".concat(this.tabClass)));
    this.examples = Array.prototype.slice.call(this.node.querySelectorAll('.code-snippet__preformatted'));
    this.closeButtons = Array.prototype.slice.call(this.node.querySelectorAll('.app-link--close'));
    this.copyButtons = Array.prototype.slice.call(this.node.querySelectorAll('.app-link--copy'));
    this.iframe = this.node.querySelector('iframe');
    this.bindEvents();
    iFrameResize([{
      heightCalculationMethod: 'max'
    }], this.iframe);
  }

  _createClass(DesignExample, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.tabs.forEach(function (tab) {
        return tab.addEventListener('click', function (e) {
          return _this.handleTabClick(e);
        });
      });

      if (this.closeButtons) {
        this.closeButtons.forEach(function (closeButton) {
          return closeButton.addEventListener('click', function (e) {
            return _this.handleCloseClick(e);
          });
        });
      }

      this.copyButtons.forEach(function (copyButton) {
        return copyButton.addEventListener('click', function (e) {
          return _this.handleCopyClick(e);
        });
      });
    }
  }, {
    key: "handleTabClick",
    value: function handleTabClick(e) {
      var _this2 = this;

      var targetEl = e.target.parentElement;
      var index = targetEl.dataset.index;
      e.preventDefault();
      this.tabs.forEach(function (tab) {
        if (tab.classList.contains(_this2.currentTabClass)) {
          tab.classList.remove(_this2.currentTabClass);
        }
      });
      targetEl.classList.add(this.currentTabClass);
      this.exampleToggler(index);
    }
  }, {
    key: "handleCloseClick",
    value: function handleCloseClick() {
      var _this3 = this;

      this.examples.forEach(function (example) {
        _this3.hideEl(example);
      });
      this.tabs.forEach(function (tab) {
        if (tab.classList.contains(_this3.currentTabClass)) {
          tab.classList.remove(_this3.currentTabClass);
        }
      });
    } // Follows approach from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f

  }, {
    key: "handleCopyClick",
    value: function handleCopyClick(e) {
      e.preventDefault();
      var el = document.createElement('textarea');
      var str = this.node.querySelector('.code-snippet__preformatted:not(.js-hidden) code');
      el.value = str.innerText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      e.target.innerText = 'Copied';
      setTimeout(function () {
        return e.target.innerText = 'Copy';
      }, 2500);
    }
  }, {
    key: "showEl",
    value: function showEl(el) {
      if (el.classList.contains(this.hiddenClass)) {
        el.classList.remove(this.hiddenClass);
      }
    }
  }, {
    key: "hideEl",
    value: function hideEl(el) {
      if (!el.classList.contains(this.hiddenClass)) {
        el.classList.add(this.hiddenClass);
      }
    }
  }, {
    key: "exampleToggler",
    value: function exampleToggler(index) {
      var _this4 = this;

      this.examples.forEach(function (example) {
        example.dataset.index === index ? example.classList.remove(_this4.hiddenClass) : example.classList.add(_this4.hiddenClass);
      });
    } // Yoink attr: https://www.456bereastreet.com/archive/201112/how_to_adjust_an_iframe_elements_height_to_fit_its_content/

  }, {
    key: "setIframeHeight",
    value: function setIframeHeight(iframe) {
      if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;

        if (iframeWin.document.body) {
          iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
      }
    }
  }]);

  return DesignExample;
}();

digitalData();
document.querySelectorAll(DesignExample.selector()).forEach(function (el) {
  new DesignExample(el);
});

})));
