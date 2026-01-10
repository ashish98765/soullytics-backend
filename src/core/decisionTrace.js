// src/core/decisionTrace.js

function buildDecisionTrace(engineResults, finalStatus, confidence) {
  return {
    finalStatus,
    confidence,
    summary: generateSummary(engineResults, finalStatus),
    engines: engineResults.map(r => ({
      engine: r.engine,
      status: r.status,
      score: r.score ?? null,
      message: r.message
    })),
    timestamp: new Date().toISOString()
  };
}

function generateSummary(results, finalStatus) {
  const failed = results.filter(r => r.status === "FAIL");
  const warnings = results.filter(r => r.status === "WARNING");

  if (failed.length > 0) {
    return `Ads blocked due to failure in ${failed.map(f => f.engine).join(", ")}`;
  }

  if (warnings.length > 0) {
    return `Ads paused due to warnings in ${warnings.map(w => w.engine).join(", ")}`;
  }

  return "All checks passed. Ads approved to run.";
}

module.exports = { buildDecisionTrace };
