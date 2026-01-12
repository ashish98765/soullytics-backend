const { ScalingReadinessEngine } = require("../adsCode16.scalingReadiness");
const { BurnRateEngine } = require("../adsCode26.burnRate");

class ScalingReadinessCoreEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new ScalingReadinessEngine(this.context).run(),
      new BurnRateEngine(this.context).run()
    ];
  }
}

module.exports = { ScalingReadinessCoreEngine };
