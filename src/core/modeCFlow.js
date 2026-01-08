// src/core/modeCFlow.js

const { DecisionOrchestrator } = require("./decisionOrchestrator");

/**
 * MODE C: Full autonomous Ads OS
 * Decision -> Execution -> Feedback-ready output
 */

async function runModeC({
  adsCodes = [],
  adCreationEngines = [],
  context
}) {
  const orchestrator = new DecisionOrchestrator(adsCodes);
  const decision = await orchestrator.run(context);

  if (decision.finalDecision === "DO_NOT_RUN") {
    return {
      mode: "MODE_C",
      decision,
      message: "Ads blocked by system logic",
      timestamp: new Date().toISOString()
    };
  }

  const ads = [];
  for (const Engine of adCreationEngines) {
    const engineInstance = new Engine(context);
    const result = await engineInstance.run();
    ads.push(result);
  }

  return {
    mode: "MODE_C",
    decision,
    ads,
    timestamp: new Date().toISOString()
  };
}

module.exports = { runModeC };
