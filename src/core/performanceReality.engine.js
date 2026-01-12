const { RealityCheckEngine } = require("../adsCode21.realityCheck");
const { SignalQualityEngine } = require("../adsCode24.signalQuality");
const { DataReliabilityEngine } = require("../adsCode35.dataReliability");

class PerformanceRealityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new RealityCheckEngine(this.context).run(),
      new SignalQualityEngine(this.context).run(),
      new DataReliabilityEngine(this.context).run()
    ];
  }
}

module.exports = { PerformanceRealityEngine };
