const BaseEngine = require("./baseEngine");

class AdsCTREngine extends BaseEngine {
  constructor() {
    super("ads_ctr_engine");
  }

  async run(metrics) {
    const ctr = metrics.ctr || 0;

    let risk = 0.2;
    let confidence = 0.6;

    if (ctr < 0.5) {
      risk = 0.8;
      confidence = 0.3;
    }

    return {
      risk,
      confidence,
      reason: "CTR based evaluation"
    };
  }
}

module.exports = new AdsCTREngine();
