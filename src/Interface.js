/**
 * Interface is used to check if an Object implements a desired set of behaviors
 * Adapted from {@link http://jscriptpatterns.blogspot.com.co/2013/01/javascript-interfaces.html}
 */

class Interface {
  /**
   * @param methods
   */
  constructor({ name, methods }) {
    this._name = name;
    this._methods = [];

    for (let i = 0, len = methods.length; i < len; i++) {
      if (typeof methods[i] !== 'string') {
        throw new Error("Interface constructor expects method names to be passed in as a string.");
      }
      this._methods.push(methods[i]);
    }
  }

  ensureImplements(object) {
    for (let j = 0, methodsLen = this._methods.length; j < methodsLen; j++) {
      const method = this._methods[j];
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error("Function Interface.ensureImplements: object does not implement the " + this._name + " interface. Method " + method + " was not found.");
      }
    }
  }
}

const Timing = {"Animator": new Interface( { name: "Animator", methods: ["animate","period", "setPeriod", "stop", "start", "restart", "toggle", "started", "timer"] }),
  "Timer": new Interface({ name: "Timer", methods: ["run","timingTask", "stop", "cancel", "create", "isActive","period", "setPeriod", "isSingleShot", "setSingleShot"] }),
  "Taskable": new Interface({ name: "Taskable", methods: ["execute"] })};

export default Timing;

