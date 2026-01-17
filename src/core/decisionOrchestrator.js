const dataFusionEngine = require("./dataFusionEngine");
const DecisionEngine = require("./decisionEngine");

async function decisionOrchestrator(rawContext = {}) {
  const fusion = await dataFusionEngine(rawContext);

  const decision = DecisionEngine(fusion.results);

  return {
    decision: decision.action,
    confidence: decision.confidence,
    reasons: decision.reasons
  };
}

module.exports = { decisionOrchestrator };
