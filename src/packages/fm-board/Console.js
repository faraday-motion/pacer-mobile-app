export default class Console {
  constructor(transport) {
    this.transport = transport;
  }

  sendCommand(command, payload = "") {
    return new Promise((resolve, reject) => {
      this.transport.send(command, payload, (data) => {
        resolve(data);
      })
    });
  }
}

