const safeDecision = require("../safeDecision");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

class DecisionOrchestrator {
  constructor() {
    this.engines = Object.values(adsCodeRegistry);
  }

  async run({ metrics, context }) {
    let totalRisk = 0;
    let totalConfidence = 0;
    const trace = [];

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);
        trace.push(result);

        totalRisk += result.risk || 0;
        totalConfidence += result.confidence || 0;
      }

      const avgRisk =
        this.engines.length > 0 ? totalRisk / this.engines.length : 1;

      const avgConfidence =
        this.engines.length > 0
          ? totalConfidence / this.engines.length
          : 0;

      let action = "RUN";
      if (avgRisk > 0.7) action = "KILL";
      else if (avgRisk > 0.4) action = "PAUSE";

      return {
        action,
        confidence: Number(avgConfidence.toFixed(2)),
        risk: Number(avgRisk.toFixed(2)),
        reasons: [],
        trace,
      };
    } catch (err) {
      console.error("ORCHESTRATOR FAILURE:", err);
      return safeDecision(err.message);
    }
  }
}

module.exports = DecisionOrchestrator;
