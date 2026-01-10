// src/core/decisionTrace.js

function buildDecisionTrace(engineResults, finalDecision, confidence) {
  const blockers = [];
  const warnings = [];
  const passes = [];

  for (const r of engineResults) {
    if (r.status === "FAIL") {
      blockers.push({
        engine: r.engine,
        message: r.message
      });
    } else if (r.status === "WARNING") {
      warnings.push({
        engine: r.engine,
        message: r.message
      });
    } else if (r.status === "PASS") {
      passes.push(r.engine);
    }
  }

  return {
    finalDecision,
    confidence,
    safeToRun: finalDecision === "RUN",
    blockers,
    warnings,
    passes
  };
}

module.exports = { buildDecisionTrace };
