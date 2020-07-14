/*!
 * tiny-msg-client - version 0.6.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Msg = function () {
  function Msg(channel) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '<%=url%>';

    _classCallCheck(this, Msg);

    this.url = url;
    this.channel = channel;
    this.handler = {};
    this.q = [];
    this.init();
  }

  _createClass(Msg, [{
    key: "init",
    value: function init() {
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
    key: "send",
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
    key: "on",
    value: function on(e, fn) {
      if (!Array.isArray(this.handler[e])) {
        this.handler[e] = [];
      }

      this.handler[e].push(fn);
      return this;
    }
  }, {
    key: "_onopen",
    value: function _onopen(e) {
      while (this.q.length) {
        try {
          this.ws.send(this.q.shift());
        } catch (e) {}
      }
    }
  }, {
    key: "_onmessage",
    value: function _onmessage(e) {
      var data = e.data;

      try {
        data = JSON.parse(data);
      } catch (e) {}

      if (Array.isArray(this.handler.message)) {
        var _iterator = _createForOfIteratorHelper(this.handler.message),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var fn = _step.value;
            /^f/.test(_typeof(fn)) && fn.apply(this, [e, data, this]);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "_onerror",
    value: function _onerror(e) {
      if (Array.isArray(this.handler.error)) {
        var _iterator2 = _createForOfIteratorHelper(this.handler.error),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var fn = _step2.value;
            /^f/.test(_typeof(fn)) && fn.apply(this, [e, this]);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  }, {
    key: "_onclose",
    value: function _onclose(e) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.init.bind(this), 5000);
    }
  }]);

  return Msg;
}();