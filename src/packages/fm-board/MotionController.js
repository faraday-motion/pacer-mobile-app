const SYNC_INTERVAL = 10; // ms

export default class MotionController {
  constructor(accelerometer, transport) {
    this.transport = transport;

    accelerometer.subscribe(this.onAccelerometerData);

    this.accelerations = null;
    this.loopTimerId = null;
  }

  start() {
    if (this.loopTimerId !== null) {
      throw new Error(`A loop(${this.loopTimerId}) is already running`);
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
      this.transport.send({
        roll: MotionController.roll(this.accelerations),
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  static roll({ x, y }) {
    return Math.atan2(x, y) * 57.3;
  }
}
