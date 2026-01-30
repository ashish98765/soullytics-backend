const safeDecision = require("./safeDecision");
const supabase = require("../config/supabaseClient");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async getEngineStats(engineName) {
    const { data } = await supabase
      .from("engine_scores")
      .select("accuracy, avg_impact, confidence_bias")
      .eq("engine_name", engineName)
      .single();

    return {
      weight: data?.accuracy ?? 0.5,
      impact: data?.avg_impact ?? 0,
      bias: data?.confidence_bias ?? 0
    };
  }

  async run({ metrics, context }) {
    let weightedRisk = 0;
    let weightedConfidence = 0;
    let totalWeight = 0;
    const trace = [];

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);
        const stats = await this.getEngineStats(engine.name);

        const weight = Math.max(0.1, stats.weight);
        const biasAdjustedConfidence =
          (result.confidence || 0) + stats.bias;

        weightedRisk += (result.risk || 0) * weight * (1 - stats.impact);
        weightedConfidence += biasAdjustedConfidence * weight;
        totalWeight += weight;

        trace.push({
          engine: engine.name,
          weight,
          impact: stats.impact,
          bias: stats.bias,
          result
        });
      }

      const avgRisk = totalWeight ? weightedRisk / totalWeight : 0.5;
      const avgConfidence = totalWeight
        ? weightedConfidence / totalWeight
        : 0.5;

      let action = "RUN";
      if (avgRisk > 0.75) action = "KILL";
      else if (avgRisk > 0.45) action = "PAUSE";

      // final capital protection
      if (avgConfidence < 0.3 && avgRisk > 0.4) {
        action = "PAUSE";
      }

      return {
        action,
        risk: Number(avgRisk.toFixed(2)),
        confidence: Number(avgConfidence.toFixed(2)),
        explanation:
          "Decision weighted by historical accuracy, impact magnitude, and confidence bias.",
        trace
      };
    } catch (err) {
      console.error("ORCHESTRATOR_FAIL:", err);
      return safeDecision("ORCHESTRATOR_ERROR");
    }
  }
}

module.exports = DecisionOrchestrator;
