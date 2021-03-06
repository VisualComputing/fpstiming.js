import SequentialTimer from './SequentialTimer';
import Interface from './Interface';

/**
 * A timing handler holds a {@link TimingHandler#timerPool}
 * and an {@link TimingHandler#animatorPool}. The timer
 * pool are all the tasks scheduled to be performed in the future (one single time or
 * periodically). The animation pool are all the objects that implement an animation
 * callback function. For an introduction to FPSTiming please refer to {@link fpstiming}
 */
export default class TimingHandler {
  /**
   * Main Constructor
   */
  constructor() {
    this._taskPool = new Set();
    this._animatorPool = new Set();
    this._frameRateLastMillis = window.performance.now();
    this._frameRate = 10;
    this._localCount = 0;
    this._deltaCount = TimingHandler.frameCount;
  }

  /**
   * Handler's main method. It should be called from within your main event loop. It does
   * the following: 1. Recomputes the frame rate; 2. Executes the all timers (those in the
   * {@link TimingHandler#timerPool}) callback functions; and, 3. Performs all the animated objects
   * (those in the {@link TimingHandler#animatorPool}) animation functions.
   */
  handle() {
    this._updateFrameRate();
    this._taskPool.forEach((task) => {
      if (task.timer() !== null) {
        if (task.timer() instanceof SequentialTimer) {
          if (task.timer().timingTask() !== null) {
            task.timer()._execute();
          }
        }
      }
    });
    this._animatorPool.forEach((aObj) => {
      if (aObj.started()) {
        if (aObj.timer().triggered()) {
          aObj.animate();
        }
      }
    });
  }
  /**
   * Returns the timer pool.
   * @returns {Set<TimingTask>} timingTasks callbacks
   */
  timerPool() {
    return this._taskPool;
  }

  /**
   * Register a task in the timer pool and creates a sequential timer for it with an optional timer.
   * @param {TimingTask} task
   * @param {Timer} [timer = null]
   */
  registerTask(task, timer = null) {
    if (timer === null) {
      task.setTimer(new SequentialTimer({ handler: this, task }));
    } else {
      // Check if timer implements Timer methods
      Interface.Timer.ensureImplements(timer);
      task.setTimer(timer);
    }
    this._taskPool.add(task);
  }

  /**
   * Unregisters the timer. You may also unregister the task this timer is attached to.
   * @param {TimingTask|SequentialTimer} task
   */
  unregisterTask(task) {
    if (task instanceof SequentialTimer) {
      this._taskPool.delete(task.timingTask());
    } else {
      this._taskPool.delete(task);
    }
  }

  /**
   * Returns `true` if the task is registered and `false` otherwise.
   * @returns {boolean}
   */
  isTaskRegistered(task) {
    this._taskPool.has(task);
  }

  /**
   * Recomputes the frame rate based upon the frequency at which {@link TimingHandler#handle} is
   * called from within the application main event loop. The frame rate is needed to sync
   * all timing operations.
   */
  _updateFrameRate() {
    const now = window.performance.now();
    if (this._localCount > 1) {
      // update the current _frameRate
      const rate = 1000.0 / ((now - this._frameRateLastMillis) / 1000.0);
      const instantaneousRate = rate / 1000.0;
      this._frameRate = (this._frameRate * 0.9) + (instantaneousRate * 0.1);
    }
    this._frameRateLastMillis = now;
    this._localCount++;
    //TODO needs testing but I think is also safe and simpler
    //if (TimingHandler.frameCount < frameCount())
    //TimingHandler.frameCount = frameCount();
    if (TimingHandler.frameCount < this.frameCount() + this._deltaCount)
      TimingHandler.frameCount = this.frameCount() + this._deltaCount;
  }

  /**
   * Returns the approximate frame rate of the software as it executes. The initial value
   * is 10 fps and is updated with each frame. The value is averaged (integrated) over
   * several frames. As such, this value won't be valid until after 5-10 frames.
   * @returns {number} frame-rate
   */
  frameRate() {
    return this._frameRate;
  }

  /**
   * Returns the number of frames displayed since the program started.
   * @returns {number} frame-count
   */
  frameCount() {
    return this._localCount;
  }

  /**
   * Converts all registered timers to single-threaded timers.
   */
  restoreTimers() {
    this._taskPool.forEach((task) => {
      let period = 0;
      let rOnce = false;
      const isActive = task.isActive();
      if (isActive) {
        period = task.period();
        rOnce = task.timer().isSingleShot();
      }
      task.stop();
      task.setTimer(new SequentialTimer({ handler: this, task }));
      if (isActive) {
        if (rOnce) { task.runOnce(period); } else { task.run(period); }
      }
    });
    console.log('single threaded timers set');
  }

  // Animation -->

  /**
   * Returns all the animated objects registered at the handler.
   * @returns {Set<AnimatorObject>} Animator Objects
   */
  animatorPool() {
    return this._animatorPool;
  }

  /**
   * Registers the animation object.
   * @param {AnimatorObject} object
   */
  registerAnimator(animator) {
    // Check if animator implements Animator methods
    Interface.Animator.ensureImplements(animator);
    this._animatorPool.add(animator);
  }

  /**
   * Unregisters the animation object.
   * @param {AnimatorObject} object
   */
  unregisterAnimator(animator) {
    this._animatorPool.delete(animator);
  }

  /**
   * Returns `true` if the animation object is registered and `false`
   * otherwise.
   */
  isAnimatorRegistered(object) {
    this._animatorPool.has(object);
  }
}
// static field
TimingHandler.frameCount = 0;
