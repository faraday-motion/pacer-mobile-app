/* global WebSocket */

import { Subject, BehaviorSubject } from 'rxjs/Rx';

export default class Transport {
  constructor(url: String) {
    this.url = url;
    this.ws = null;

    this.state$ = new BehaviorSubject(State.CONNECTING);
    this.message$ = new Subject();
    this.forceClosed = false;

    this.connect();
  }

  connect() {
    if (this.ws !== null) {
      throw new Error('Transport already initialized');
    }

    this.forceClosed = false;
    this.state$.next(State.CONNECTING);
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = this.message$.next.bind(this.message$);
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

  send(data) {
    this.assertConnected();
    this.ws.send(data);
    // this.ws.send(JSON.stringify(data, undefined, 2));
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
