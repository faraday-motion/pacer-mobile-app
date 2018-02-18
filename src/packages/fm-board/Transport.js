/* global WebSocket */

import { Subject, BehaviorSubject } from 'rxjs/Rx';

export default class Transport {
  constructor(url: String) {
    this.url = url;
    this.ws = null;

    this.state$ = new BehaviorSubject(State.CONNECTING);
    this.message$ = new Subject();
    // This should be done differently.
    this.driveLog$ = new BehaviorSubject({});


    this.forceClosed = false;
    this.callback_queue_seq = 0;
    this.callback_queue = {};
    this.connect();

    this.COMMAND = {
      MODULE_ON           : 0,
      MODULE_OFF          : 1,
      DISABLE_CONTROLLERS : 2,
      ENABLE_CONTROLLER   : 3,
      DRIVE_POWER         : 4,
      DRIVE_BRAKE         : 5,
      TURN_LEFT           : 6,
      TURN_RIGHT          : 7,
      DRIVE_MODE_20       : 8,
      DRIVE_MODE_40       : 9,
      DRIVE_MODE_60       : 10,
      DRIVE_MODE_80       : 11
    }

  }

  connect() {
    if (this.ws !== null) {
      throw new Error('Transport already initialized');
    }

    this.forceClosed = false;
    this.state$.next(State.CONNECTING);
    this.ws = new WebSocket(this.url);

    this.ws.onmessage = ((event) => {
      var message = JSON.parse(event.data)
      if (message.id != undefined) {
        let callbackId = parseInt(message.id);
        var callback = this.callback_queue[callbackId].callback;
        delete this.callback_queue[callbackId];
        callback(message.response);

      }
      console.log(message.response);
      if (message.response != undefined) {
        if (message.response.drive_log != undefined) {
          console.log("Received drive_log");
          console.log(message.response.drive_log);
          this.driveLog$.next(message.response.drive_log);
        }
      }

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

  send(command, value, callback) {
    console.log("Sending...");
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
      'value': value
    }
    
    this.ws.send(JSON.stringify(message, undefined, 2));
    this.callback_queue_seq++;
    // Might not be optimal.
    if (this.callback_queue_seq == 255) {
      this.callback_queue_seq = 0;
    }

    console.log("Sent");
    console.log(message);
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
