const safeDecision = require("./safeDecision");
const supabase = require("../config/supabaseClient");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async getEngineWeight(engineName) {
    const { data } = await supabase
      .from("engine_scores")
      .select("accuracy")
      .eq("engine_name", engineName)
      .single();

    // default neutral weight
    if (!data || data.accuracy === null) return 0.5;

    return Math.min(Math.max(data.accuracy, 0.1), 1);
  }

  async run({ metrics, context }) {
    let weightedRisk = 0;
    let weightedConfidence = 0;
    let totalWeight = 0;

    const trace = [];

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);
        const weight = await this.getEngineWeight(engine.name);

        weightedRisk += (result.risk || 0) * weight;
        weightedConfidence += (result.confidence || 0) * weight;
        totalWeight += weight;

        trace.push({
          engine: engine.name,
          weight,
          result
        });
      }

      const avgRisk =
        totalWeight > 0 ? weightedRisk / totalWeight : 0.5;

      const avgConfidence =
        totalWeight > 0 ? weightedConfidence / totalWeight : 0.5;

      let action = "RUN";
      if (avgRisk > 0.75) action = "KILL";
      else if (avgRisk > 0.45) action = "PAUSE";

      return {
        action,
        risk: Number(avgRisk.toFixed(2)),
        confidence: Number(avgConfidence.toFixed(2)),
        reasons: [],
        trace
      };
    } catch (err) {
      console.error("ORCHESTRATOR_FAIL:", err);
      return safeDecision("ORCHESTRATOR_ERROR");
    }
  }
}

module.exports = DecisionOrchestrator;
