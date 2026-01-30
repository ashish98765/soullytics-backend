const safeDecision = require("./safeDecision");
const rankEngines = require("./engineRanker");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, context }) {
    const trace = [];
    let risk = 0;
    let confidence = 0;

    try {
      const rankedEngines = await rankEngines(this.engines);

      for (const engine of rankedEngines) {
        const result = await engine.run(metrics, context);
        trace.push({
          engine: engine.name,
          ...result
        });

        risk += result.risk || 0;
        confidence += result.confidence || 0;

        // 🚨 Early exit if strong signal
        if (result.risk > 0.8) break;
      }

      const avgRisk = risk / rankedEngines.length;
      const avgConfidence = confidence / rankedEngines.length;

      let action = "RUN";
      if (avgRisk > 0.7) action = "KILL";
      else if (avgRisk > 0.4) action = "PAUSE";

      return {
        action,
        confidence: Number(avgConfidence.toFixed(2)),
        risk: Number(avgRisk.toFixed(2)),
        trace
      };

    } catch (err) {
      console.error("ORCHESTRATOR_FAIL:", err);
      return safeDecision(err.message);
    }
  }
}

module.exports = DecisionOrchestrator;
