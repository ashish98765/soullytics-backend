// src/core/decisionResponseFormatter.js

function format({ decision, trace }) {
  return {
    decision: decision.action,
    score: decision.score,
    risk: decision.risk,
    confidence: decision.confidence,
    reasons: decision.reasons,
    trace
  };
}

module.exports = { format };
