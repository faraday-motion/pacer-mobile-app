export default class Console {
  constructor(transport) {
    this.transport = transport;
  }

  sendCommand(command) {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   resolve(`response for ${command}`);
      // }, 200);
      try{
      this.transport.send({
        roll: command,
        });
      } catch (ex) {
        console.log(ex);
      }
    });
  }
}

