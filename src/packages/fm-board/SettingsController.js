export default class Settings {
  constructor(transport) {
    this.transport = transport;
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, 60);
    });
  }

  saveSettings(settings) {
    console.log(settings);
    let payload = "8007:" + JSON.stringify(settings, undefined, 2)
    this.transport.send(payload);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}


const defaultSettings = {
  "modules" : {
    "radio" : 0,
    "webSocketServer" : 1,
    "webServer" : 1
  },

  "wifi" : {
    "ssid"     : "FARADAY200",
    "port"     : 8899,
    "ip"       : [10, 10, 100, 254],
    "subnet"   : [255, 255, 255, 0],
    "channel"  : 11,
    "pass"     : "faraday200"
  },

  "websocket" : {
    "port" : 81
  },

  "controller" : {
    "defaultSmoothAlpha"          : 0.5 ,
    "defaultInputNeutral"         : 50  ,
    "defaultInputMinBrake"        : 48  ,
    "defaultInputMaxBrake"        : 0   ,
    "defaultInputMinAcceleration" : 52  ,
    "defaultInputMaxAcceleration" : 100
  },

  "currentControl" : {
    "defaultCurrentNeutral"         : 0   ,
    "defaultCurrentBrakeMin"        : 0   ,
    "defaultCurrentBrakeMax"        : 60  ,
    "defaultCurrentAccelerationMin" : 0.25,
    "defaultCurrentAccelerationMax" : 30
  },

  "motorCount" : 1,

  "authorizedControllers" : [1, 2, 3, 4, 5],

  "registeredControllers" : [
    {
      "id" : "ACCE1",
      "type" : 3,
      "priority" : 1,
      "enabled" : 0,
      "constraints" : {
        "brake" : 200,
        "accel" : 650
      }
    },
    {
      "id" : "JOYS1",
      "type" : 4,
      "priority" : 1,
      "enabled" : 0,
      "constraints" : {
        "brake" : 190,
        "accel" : 840
      }
    }
  ]
};