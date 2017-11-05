Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  var $this = this;
  if ($this < in_min) {
    $this = in_min;
  }
  if ($this > in_max) {
    $this = in_max;
  }
  return ($this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const SYNC_INTERVAL = 10; // ms

export default class MotionController {
  constructor(accelerometer, transport) {
    this.transport = transport;

    accelerometer.subscribe(this.onAccelerometerData);

    this.accelerations = null;
    this.loopTimerId = null;

    this.state = {
      isRegistered : false,
    }
  }

  start() {
    if (this.loopTimerId !== null) {
      throw new Error(`A loop(${this.loopTimerId}) is already running`);
    }
    if (this.state.isRegistered == false) {
      this.transport.send(this.transport.COMMAND.CTRL_REGISTER, { id: "WBSK1", type: 5 , enabled: 1 }, function(respose) {
        // handle.
      }); 
    }
    this.loop();
  }

  stop() {
    clearTimeout(this.loopTimerId);
    this.loopTimerId = null;
  }

  loop() {
    this.sync();

    this.loopTimerId = setTimeout(() => {
      this.loop();
    }, SYNC_INTERVAL);
  }

  onAccelerometerData = (accelerations) => {
    this.accelerations = accelerations;
  };

  motionStateIsValid() {
    return this.accelerations !== null;
  }

  sync() {
    if (!this.motionStateIsValid()) {
      return;
    }

    try {
      this.transport.send(this.transport.COMMAND.CTRL_SENT_INPUT, {input: MotionController.roll(this.accelerations)}, function(respose) {
        // Handle
      } );
    } catch (ex) {
      // handle
    }
  }

  static roll({ x, y }) {

    let roll = Math.round(Math.atan2(x, y) * 57.3);
    if (roll < 0 && roll < -160)
        roll = 180;
    if (roll < 0 && roll > -50 )
        roll = 0;
    let power = parseInt(roll.map(0, 180, 0, 100));
    return power;
  }
}
