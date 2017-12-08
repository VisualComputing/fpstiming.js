import Timing from './Interface';

/**
 * An abstract wrapper class holding a {@link TimingTask#timer} together with its callback method
 * ( {@link Taskable#execute}) which derived classes should implement.
 */
export default class TimingTask {
  /**
   * Default Constructor.
   */
  constructor() {
    this._timer = null;
  }
  /**
   * Returns the timer instance.
   * @returns {Timer}
   */
  timer() {
    return this._timer;
  }

  /**
   * Sets the timer instance.
   * @param timer
   */
  setTimer(timer) {
    // check if timer implements Timer methods
    Timing["Timer"].ensureImplements(timer);
    this._timer = timer;
  }

  /**
   * Run the {@link TimingTask#timer} with a repeated fixed-rate execution according to `period`.
   * @param {number} period in milliseconds.
   */
  run(period) {
    if (this.timer() != null) {
      this.timer().setSingleShot(false);
      this.timer().run(period);
    }
  }

  /**
   * Run the {@link TimingTask#timer} once, according to `period`.
   * @param {number} period in milliseconds.
   */
  runOnce(period) {
    if (this.timer() != null) {
      this.timer().setSingleShot(true);
      this.timer().run(period);
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  stop() {
    if (this.timer() != null) {
      this.timer().stop();
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  cancel() {
    if (this.timer() != null) {
      this.timer().cancel();
    }
  }

  /**
   * Creates the {@link TimingTask#timer}.
   */
  create() {
    if (this.timer() != null) {
      this.timer().create();
    }
  }

  /**
   * Tells whether or not the timer is active.
   * @returns {boolean}
   */
  isActive() {
    if (this.timer() != null) {
      return this.timer().isActive();
    }
    return false;
  }

  /**
  * Timer wrapper method.
  * @returns {number}
  */
  period() {
    return this.timer().period();
  }
}
