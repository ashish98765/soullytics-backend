// src/core/modeBFlow.js

const { DecisionOrchestrator } = require("./decisionOrchestrator");

/**
 * MODE B: Analyze & Decide using existing ad data
 */

async function runModeB({ adsCodes = [], context }) {
  if (!context.historicalData) {
    throw new Error("MODE_B requires historicalData");
  }

  const orchestrator = new DecisionOrchestrator(adsCodes);
  const decision = await orchestrator.run(context);

  return {
    mode: "MODE_B",
    decision,
    timestamp: new Date().toISOString()
  };
}

module.exports = { runModeB };
