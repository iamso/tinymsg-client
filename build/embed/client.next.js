/*!
 * tiny-msg-client - version 0.4.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2016 Steve Ottoz
 */

export default class Msg {

  /**
   * Msg constructor
   * @param  {String}   channel   - channel to join
   * @param  {Function} onmsg     - onmessage handler
   * @param  {Function} onerror   - onerror handler
   * @param  {Object}   [context] - context for event handlers
   * @param  {String}   [url]     - websocket server url
   */
  constructor(channel, onmsg, onerror, context = this, url = '<%=url%>') {
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
  send(data) {
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

}

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
  let data = e.data;
  try {
    data = JSON.parse(data);
  } catch (e) {}
  /^f/.test(typeof this.onmsg) && this.onmsg.apply(this.context, [data, e, this]);
}

/**
 * _error function
 * Internal onerror handler
 * @param  {Object} e - event
 */
function onerror(e) {
  /^f/.test(typeof this.onerror) && this.onerror.apply(this.context, [e, this]);
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