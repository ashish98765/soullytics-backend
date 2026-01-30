const safeDecision = require("../safeDecision");
const { calibrateConfidence } = require("../intelligence/confidenceCalibrator");
const { suppressFalsePositive } = require("../intelligence/falsePositiveGuard");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, context = {} }) {
    const trace = [];
    let riskSum = 0;
    let confidenceSum = 0;

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);

        trace.push(result);

        riskSum += result.risk || 0;
        confidenceSum += result.confidence || 0;
      }

      const avgRisk = riskSum / this.engines.length;
      const avgConfidence = confidenceSum / this.engines.length;

      /* ============================
         TEMPORAL / PATTERN SIGNAL
      ============================ */
      const temporal = context.temporal || null;
      const pattern = context.pattern || null;

      /* ============================
         FALSE POSITIVE GUARD
      ============================ */
      const suppression = suppressFalsePositive({
        risk: avgRisk,
        temporal
      });

      /* ============================
         CONFIDENCE CALIBRATION
      ============================ */
      const calibratedConfidence = calibrateConfidence({
        confidence: avgConfidence,
        risk: avgRisk,
        temporal
      });

      /* ============================
         FINAL ACTION (INTERNAL ONLY)
      ============================ */
      let action = "RUN";

      if (avgRisk > 0.7) action = "KILL";
      else if (avgRisk > 0.4) action = "PAUSE";

      return {
        action, // INTERNAL — frontend ko dikhana zaroori nahi
        confidence: calibratedConfidence,
        raw_confidence: Number(avgConfidence.toFixed(2)),
        risk: Number(avgRisk.toFixed(2)),
        suppression,
        temporal,
        pattern,
        trace
      };

    } catch (err) {
      console.error("DECISION ORCHESTRATOR FAILED:", err);
      return safeDecision(err.message);
    }
  }
}

module.exports = DecisionOrchestrator;
