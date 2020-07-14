/*!
 * tiny-msg-client - version 0.6.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */

export default class Msg {

  /**
   * Msg constructor
   * @param  {String}   channel   - channel to join
   * @param  {String}   [url]     - websocket server url
   */
  constructor(channel, url = '') {
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
  init() {
    // return if WebSocket is not supported
    if (!WebSocket) {
      this.ws = {
        readyState: 0,
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

  /**
   * send function
   * Exposed send function
   * @param  {Object|String} data - data to send
   * @return {Object}             - this
   */
  send(data) {
    try {
      data = JSON.stringify(data);
    }
    catch(e) {}
    if (this.ws.readyState === 1) {
      try {
        this.ws.send(data);
      }
      catch(e) {
        this.q.push(data);
      }
    }
    else {
      this.q.push(data);
    }
    return this;
  }

  /**
   * on Function
   * Add event handlers
   * @param  {String}   e  - event name
   * @param  {Function} fn - event handler function
   * @return {Object}      - this
   */
  on(e, fn) {
    if (!Array.isArray(this.handler[e])) {
      this.handler[e] = [];
    }
    this.handler[e].push(fn);
    return this;
  }

  /**
   * _onopen function
   * Internal onopen handler
   * @param  {Object} e - event
   */
  _onopen(e) {
    while(this.q.length) {
      try {
        this.ws.send(this.q.shift());
      }
      catch(e) {}
    }
  }

  /**
   * _onmessage function
   * Internal onmessage handler
   * @param  {Object} e - event
   */
  _onmessage(e) {
    let data = e.data;
    try {
      data = JSON.parse(data);
    }
    catch(e) {}
    if (Array.isArray(this.handler.message)) {
      for (let fn of this.handler.message) {
        /^f/.test(typeof fn) && fn.apply(this, [e, data, this]);
      }
    }
  }

  /**
   * _onerror function
   * Internal onerror handler
   * @param  {Object} e - event
   */
  _onerror(e) {
    if (Array.isArray(this.handler.error)) {
      for (let fn of this.handler.error) {
        /^f/.test(typeof fn) && fn.apply(this, [e, this]);
      }
    }
  }

  /**
   * _onclose function
   * Internal onclose handler
   * @param  {Object} e - event
   */
  _onclose(e) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.init.bind(this), 5000);
  }

}
