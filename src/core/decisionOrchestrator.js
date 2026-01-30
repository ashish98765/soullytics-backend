const safeDecision = require("./safeDecision");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, context }) {
    let risk = 0;
    let confidence = 0;
    const trace = [];

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);
        trace.push(result);
        risk += result.risk || 0;
        confidence += result.confidence || 0;
      }

      const avgRisk = risk / this.engines.length;
      const avgConfidence = confidence / this.engines.length;

      let action = "RUN";
      if (avgRisk > 0.7) action = "KILL";
      else if (avgRisk > 0.4) action = "PAUSE";

      // 🔒 Safety override
      if (avgConfidence < 0.3 && avgRisk > 0.4) {
        action = "PAUSE";
      }

      return {
        action,
        risk: Number(avgRisk.toFixed(2)),
        confidence: Number(avgConfidence.toFixed(2)),
        reasons: [],
        trace
      };
    } catch (err) {
      console.error("ORCHESTRATOR_FAIL", err);
      return safeDecision(err.message);
    }
  }
}

module.exports = DecisionOrchestrator;
