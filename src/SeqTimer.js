export default class SeqTimer {

  constuctor({ handler, runOnlyOnce = false, task = null }) {
    this._task = task;
    this._handler = handler;
    this._active = false;
    this._runOnlyOnce = runOnlyOnce;
    this._counter = 0;
    this._period = 0;
    this._startTime = 0;
    this.create();
  }

  get timingTask() {
    return this._task;
  }

  execute() {
    const result = this.triggered();
    if (result) {
      this._task.execute();
      if (this._runOnlyOnce) {
        this.inactivate();
      }
    }
    return result;
  }

  cancel() {
    this.inactivate();
  }

  create() {
    this.inactivate();
  }

  run(period = null) {
    if (period !== null) {
      this._period = period;
    }
    if (period <= 0) {
      return;
    }
    this._counter = 1;
    this._active = true;
    this._startTime = window.performace.now();
  }

  stop() {
    this.inactivate();
  }

  isActive() {
    return this._active;
  }

  inactivate() {
    this.active = false;
  }

  triggered() {
    if (!this._active) {
      return false;
    }

    let result = false;

    const elapsedTime = window.performace.now() - this._startTime;
    const timePerFrame = (1 / this.handler.frameRate) * 1000;
    const threshold = this._counter * this._period;

    if (threshold >= elapsedTime) {
      const diff = (elapsedTime + timePerFrame) - threshold;
      if (diff >= 0) {
        if (threshold - elapsedTime < diff) {
          result = true;
        }
      }
    } else {
      result = true;
    }
    if (result) {
      this.counter += 1;
    }
    return result;
  }

  get period() {
    return this._period;
  }

  set period(period) {
    this._period = period;
  }

  isSingleShot() {
    return this._runOnlyOnce;
  }

  setSingleShot(singleShot) {
    this._runOnlyOnce = singleShot;
  }

}