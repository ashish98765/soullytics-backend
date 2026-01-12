// src/core/decision.engine.js

function decisionEngine(fusionResult) {
  if (!fusionResult.trusted) {
    return { decision: 'PAUSE', confidence: 0.4 };
  }

  return { decision: 'RUN', confidence: 0.8 };
}

module.exports = decisionEngine;
