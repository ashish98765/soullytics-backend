class BaseEngine {
  constructor(name) {
    this.name = name;
  }

  async run(metrics, context) {
    throw new Error("Engine must implement run()");
  }
}

module.exports = BaseEngine;
