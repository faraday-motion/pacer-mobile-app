export default class Settings {
  constructor(transport) {
    this.transport = transport;
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      this.transport.send(this.transport.COMMAND.CONFIG_GET, '', function(settings) {
        resolve(settings);
      });
    });
  }

  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      // TODO:: Implement Timeout.
      resolve(this.transport.send(this.transport.COMMAND.CONFIG_SET, settings, this.callback));
    });
  }

  callback(message) {
    // TODO:: Do some work.
  }
}
