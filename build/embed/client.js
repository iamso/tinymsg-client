/*!
 * tiny-msg-client - version 0.5.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
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
     * @param  {String}   [url]     - websocket server url
     */
    function Msg(channel) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '<%=url%>';

      _classCallCheck(this, Msg);

      this.url = url;
      this.channel = channel;
      this.handler = {};
      this.q = [];
      this.init();
    }

    /**
     * init function
     * Initialize the websocket
     * @return {Object} - this
     */


    _createClass(Msg, [{
      key: 'init',
      value: function init() {
        // return if WebSocket is not supported
        if (!WebSocket) {
          this.ws = {
            readyState: 0
          };
          return;
        }
        this.ws = new WebSocket(this.url, this.channel);
        this.ws.onopen = this._onopen.bind(this);
        this.ws.onmessage = this._onmessage.bind(this);
        this.ws.onerror = this._onerror.bind(this);
        this.ws.onclose = this._onclose.bind(this);
        return this;
      }
    }, {
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
        return this;
      }
    }, {
      key: 'on',
      value: function on(e, fn) {
        if (!Array.isArray(this.handler[e])) {
          this.handler[e] = [];
        }
        this.handler[e].push(fn);
        return this;
      }
    }, {
      key: '_onopen',
      value: function _onopen(e) {
        while (this.q.length) {
          try {
            this.ws.send(this.q.shift());
          } catch (e) {}
        }
      }
    }, {
      key: '_onmessage',
      value: function _onmessage(e) {
        var data = e.data;
        try {
          data = JSON.parse(data);
        } catch (e) {}
        if (Array.isArray(this.handler.message)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.handler.message[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var fn = _step.value;

              /^f/.test(typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) && fn.apply(this, [e, data, this]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }, {
      key: '_onerror',
      value: function _onerror(e) {
        if (Array.isArray(this.handler.error)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.handler.error[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var fn = _step2.value;

              /^f/.test(typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) && fn.apply(this, [e, this]);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }
    }, {
      key: '_onclose',
      value: function _onclose(e) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.init.bind(this), 5000);
      }
    }]);

    return Msg;
  }();

  exports.default = Msg;
  module.exports = exports['default'];
});