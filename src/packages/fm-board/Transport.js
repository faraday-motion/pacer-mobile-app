/* global WebSocket */

import { Subject, BehaviorSubject } from 'rxjs/Rx';

export default class Transport {
  constructor(url: String) {
    this.url = url;
    this.ws = null;

    this.state$ = new BehaviorSubject(State.CONNECTING);
    this.message$ = new Subject();
    this.forceClosed = false;
    this.callback_queue_seq = 0;
    this.callback_queue = {};
    this.connect();

    this.COMMAND = {
      LOGGER_ENABLE:       8001,
      LOGGER_DISABLE:      8002,
      LOGGER_ADD_TARGET:   8003,
      LOGGER_REMOVE_TARGET:8004,
      LOGGER_SET_LEVEL:    8005,

      CONFIG_GET:          8006,
      CONFIG_SET:          8007,

      CTRL_GET_ACTIVE:     8008,
      CTRL_SET_ACTIVE:     8009,
      CTRL_UNSET_ACTIVE:   8010,
      CTRL_GET_ALL:        8011,
      CTRL_REGISTER:       8012,
      CTRL_SENT_INPUT:     8013
    }
  }

  connect() {
    if (this.ws !== null) {
      throw new Error('Transport already initialized');
    }

    this.forceClosed = false;
    this.state$.next(State.CONNECTING);
    this.ws = new WebSocket(this.url);
    // this.ws.onmessage = this.message$.next.bind(this.message$);
    this.ws.onmessage = ((event) => {

      var message =  JSON.parse(event.data)
      let callbackId = parseInt(message.id);
      var callback = this.callback_queue[callbackId].callback;
      delete this.callback_queue[callbackId];

      callback(message.response);

    }).bind(this);
    this.ws.onopen = () => {
      this.state$.next(State.CONNECTED);
    };
    this.ws.onclose = () => {
      if (this.forceClosed) {
        return;
      }

      this.ws = null;
      
      // reconnect
      setTimeout(() => {
        this.connect();
      }, 1000);
    };
  }

  close() {
    this.forceClosed = true;
    this.state$.next(State.DISCONNECTED);
    this.ws.close();
    this.ws = null;
  }

  send(command, payload, callback) {;
    if (this.state$.value !== State.CONNECTED) {
      // TODO:: WE NEED TO SHOW ERROR TO USER.
      return;
    }
    this.assertConnected();  
    this.callback_queue[this.callback_queue_seq] = {
      'callback':  callback
    };
    
    var message = {
      'id': this.callback_queue_seq,
      'command': command, 
      'payload': JSON.stringify(payload)
    }
    
    this.ws.send(JSON.stringify(message, undefined, 2));
    this.callback_queue_seq++;
  }

  assertConnected() {
    if (this.state$.getValue() !== State.CONNECTED) {
      throw new TransportNotConnected();
    }
  }
}

export const State = {
  CONNECTING: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
};

export class TransportNotConnected extends Error {
  constructor() {
    super('TransportNotConnected');
    Error.captureStackTrace(this, TransportNotConnected);
  }
}
