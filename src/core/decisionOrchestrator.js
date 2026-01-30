const safeDecision = require("./safeDecision");
const { detectPattern } = require("../intelligence/patternBuckets");
const { interpret } = require("../intelligence/interpretation");
const { saveDecision } = require("../intelligence/decisionMemory");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, context }) {
    const trace = [];
    let risk = 0;
    let confidence = 0;

    try {
      for (const engine of this.engines) {
        const result = await engine.run(metrics, context);
        trace.push(result);

        risk += result.risk || 0;
        confidence += result.confidence || 0;
      }

      const avgRisk = risk / this.engines.length;
      const avgConfidence = confidence / this.engines.length;

      const pattern = detectPattern(metrics);
      const explanation = interpret(avgRisk, avgConfidence, pattern);

      const finalResult = {
        confidence: Number(avgConfidence.toFixed(2)),
        risk: Number(avgRisk.toFixed(2)),
        reasons: explanation,
        pattern,
        trace
      };

      await saveDecision({
        userId: context.userId,
        platform: context.platform,
        result: finalResult,
        metrics
      });

      return finalResult;
    } catch (err) {
      console.error("ORCHESTRATOR FAIL:", err);
      return safeDecision(err.message);
    }
  }
}

module.exports = DecisionOrchestrator;
