const BaseEngine = require("./baseEngine");

class AdsCPAEngine extends BaseEngine {
  constructor() {
    super("ads_cpa_engine");
  }

  async run(metrics) {
    const cpa = metrics.cpa || 0;

    let risk = 0.3;
    let confidence = 0.6;

    if (cpa > 800) {
      risk = 0.85;
      confidence = 0.25;
    }

    return {
      risk,
      confidence,
      reason: "CPA threshold logic"
    };
  }
}

module.exports = new AdsCPAEngine();
