
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
    this.init();
  }

  /**
   * init function
   * Initialize the websocket
   */
  init() {
    // return if WebSocket is not supported
    if (!WebSocket) {
      return;
    }
    this.ws = new WebSocket(this.url, this.channel);
    this.ws.onopen = this._onopen.bind(this);
    this.ws.onmessage = this._onmessage.bind(this);
    this.ws.onerror = this._onerror.bind(this);
    this.ws.onclose = this._onclose.bind(this);
  }

  /**
   * send function
   * Exposed send function
   * @param  {Object|String} data - data to send
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
    /^f/.test(typeof this.onmsg) && this.onmsg.apply(this.context, [data, e, this]);
  }

  /**
   * _onerror function
   * Internal onerror handler
   * @param  {Object} e - event
   */
  _onerror(e) {
    /^f/.test(typeof this.onerror) && this.onerror.apply(this.context, [e, this]);
  }

  /**
   * _onclose function
   * Internal onclose handler
   * @param  {Object} e - event
   */
  _onclose(e) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this._init.bind(this), 5000);
  }

}
