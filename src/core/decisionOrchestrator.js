// src/core/decisionOrchestrator.js

const { buildContext } = require("./contextBuilder");
const dataFusionEngine = require("./dataFusionEngine");
const decisionEngine = require("./decisionEngine");

async function decisionOrchestrator(rawInput = {}) {
  // 1️⃣ Build safe context
  const context = buildContext(rawInput);

  // 2️⃣ Run data fusion (trust / reliability)
  const fusionResult = await dataFusionEngine(context);

  // 3️⃣ Final decision
  const decisionResult = decisionEngine(fusionResult);

  // 4️⃣ Unified response
  return {
    input: context,
    fusion: fusionResult,
    decision: decisionResult.decision,
    confidence: decisionResult.confidence,
    timestamp: new Date().toISOString()
  };
}

module.exports = decisionOrchestrator;
