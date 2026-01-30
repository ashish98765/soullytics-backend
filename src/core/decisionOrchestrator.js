const safeDecision = require("./safeDecision");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, context }) {
    const trace = [];
    let totalRisk = 0;
    let totalConfidence = 0;

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);

        trace.push({
          engine: engine.name || "unknown",
          ...result
        });

        totalRisk += result.risk ?? 0;
        totalConfidence += result.confidence ?? 0;
      }

      const engineCount = this.engines.length || 1;
      const avgRisk = totalRisk / engineCount;
      const avgConfidence = totalConfidence / engineCount;

      let action = "RUN";
      if (avgRisk > 0.7) action = "KILL";
      else if (avgRisk > 0.4) action = "PAUSE";

      return {
        action,
        confidence: Number(avgConfidence.toFixed(2)),
        risk: Number(avgRisk.toFixed(2)),
        explanation:
          "Decision derived from multi-engine consensus with averaged risk and confidence.",
        trace
      };
    } catch (err) {
      console.error("ORCHESTRATOR_FAIL:", err);
      return safeDecision("ORCHESTRATOR_ERROR");
    }
  }
}

module.exports = DecisionOrchestrator;
