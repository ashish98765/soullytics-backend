const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");

const explainDecision = require("./decisionExplain");
const buildPrescription = require("./prescriptionEngine");
const { allow } = require("./featureGate");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics, plan, userId }) {
    const decisionEngine = new DecisionEngine();
    const collected = [];

    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(metrics) : Engine;

        if (!instance?.run) continue;

        const result = await instance.run();
        collected.push(
          engineResult({
            engine: Engine.name,
            group: result.group,
            status: result.status,
            confidence: result.confidence,
            risk: result.risk,
            message: result.message
          })
        );
      } catch (e) {
        collected.push(
          engineResult({
            engine: Engine.name,
            group: "GENERAL",
            status: "FAIL",
            confidence: 0,
            risk: 1,
            message: "Engine crashed"
          })
        );
      }
    }

    collected.forEach(r => decisionEngine.register(r));
    const decision = decisionEngine.resolve();

    const explain = allow(plan, "explainability")
      ? explainDecision(collected)
      : null;

    const prescription = allow(plan, "prescription")
      ? buildPrescription({
          action: decision.action,
          confidence: decision.confidence,
          risk: decision.risk,
          dominantFactor: explain?.dominant_factor
        })
      : null;

    return {
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      reasons: allow(plan, "reasons") ? decision.reasons : undefined,
      prescription,
      explainability: explain,
      trace: buildDecisionTrace(collected)
    };
  }
}

module.exports = DecisionOrchestrator;
