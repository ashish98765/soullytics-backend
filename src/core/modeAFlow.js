// src/core/modeAFlow.js

/**
 * MODE A: Ad creation only
 * No decision logic, no judgment
 */

async function runModeA({ adCreationEngines = [], context }) {
  const outputs = [];

  for (const Engine of adCreationEngines) {
    const engineInstance = new Engine(context);
    const result = await engineInstance.run();
    outputs.push(result);
  }

  return {
    mode: "MODE_A",
    message: "Ad created using best practices",
    outputs,
    timestamp: new Date().toISOString()
  };
}

module.exports = { runModeA };
