/*!
 * tiny-msg-client - version 0.4.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2016 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Msg = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Msg = function () {

    /**
     * Msg constructor
     * @param  {String}   channel   - channel to join
     * @param  {Function} onmsg     - onmessage handler
     * @param  {Function} onerror   - onerror handler
     * @param  {Object}   [context] - context for event handlers
     * @param  {String}   [url]     - websocket server url
     */
    function Msg(channel, onmsg, onerror) {
      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var url = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '<%=url%>';

      _classCallCheck(this, Msg);

      this.url = url;
      this.channel = channel;
      this.onmsg = onmsg;
      this.onerror = onerror;
      this.context = context;
      this.q = [];
      init.call(this);
    }

    /**
     * send function
     * Exposed send function
     * @param  {Object|String} data - data to send
     */


    _createClass(Msg, [{
      key: 'send',
      value: function send(data) {
        try {
          data = JSON.stringify(data);
        } catch (e) {}
        if (this.ws.readyState === 1) {
          try {
            this.ws.send(data);
          } catch (e) {
            this.q.push(data);
          }
        } else {
          this.q.push(data);
        }
      }
    }]);

    return Msg;
  }();

  exports.default = Msg;


  /**
   * _init function
   * Initialize the websocket
   */
  function init() {
    // return if WebSocket is not supported
    if (!WebSocket) {
      return;
    }
    this.ws = new WebSocket(this.url, this.channel);
    this.ws.onopen = onopen.bind(this);
    this.ws.onmessage = onmessage.bind(this);
    this.ws.onerror = onerror.bind(this);
    this.ws.onclose = onclose.bind(this);
  }

  /**
   * _open function
   * Internal onopen handler
   * @param  {Object} e - event
   */
  function onopen(e) {
    while (this.q.length) {
      try {
        this.ws.send(this.q.shift());
      } catch (e) {}
    }
  }

  /**
   * _message function
   * Internal onmessage handler
   * @param  {Object} e - event
   */
  function onmessage(e) {
    var data = e.data;
    try {
      data = JSON.parse(data);
    } catch (e) {}
    /^f/.test(_typeof(this.onmsg)) && this.onmsg.apply(this.context, [data, e, this]);
  }

  /**
   * _error function
   * Internal onerror handler
   * @param  {Object} e - event
   */
  function onerror(e) {
    /^f/.test(_typeof(this.onerror)) && this.onerror.apply(this.context, [e, this]);
  }

  /**
   * _close function
   * Internal onclose handler
   * @param  {Object} e - event
   */
  function onclose(e) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this._init.bind(this), 5000);
  }
  module.exports = exports['default'];
});