/*!
 * tiny-msg-client - version 0.7.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
export default class{constructor(t,s="<%=url%>"){this.url=s,this.channel=t,this.handler={},this.q=[],this.init()}init(){if(WebSocket)return this.ws=new WebSocket(this.url,this.channel),this.ws.onopen=this._onopen.bind(this),this.ws.onmessage=this._onmessage.bind(this),this.ws.onerror=this._onerror.bind(this),this.ws.onclose=this._onclose.bind(this),this;this.ws={readyState:0}}send(t){try{t=JSON.stringify(t)}catch(t){}if(1===this.ws.readyState)try{this.ws.send(t)}catch(s){this.q.push(t)}else this.q.push(t);return this}on(t,s){return Array.isArray(this.handler[t])||(this.handler[t]=[]),this.handler[t].push(s),this}_onopen(t){for(;this.q.length;)try{this.ws.send(this.q.shift())}catch(t){}}_onmessage(t){let s=t.data;try{s=JSON.parse(s)}catch(t){}if(Array.isArray(this.handler.message))for(let i of this.handler.message)/^f/.test(typeof i)&&i.apply(this,[t,s,this])}_onerror(t){if(Array.isArray(this.handler.error))for(let s of this.handler.error)/^f/.test(typeof s)&&s.apply(this,[t,this])}_onclose(t){clearTimeout(this.timeout),this.timeout=setTimeout(this.init.bind(this),5e3)}}
