function decisionEngine(allResults = []) {
  const failed = allResults.filter(r => r.status === "FAIL");
  const warnings = allResults.filter(r => r.status === "WARNING");

  if (failed.length > 0) {
    return {
      action: "DO_NOT_RUN",
      confidence: 0.2,
      reasons: failed.map(f => f.message)
    };
  }

  if (warnings.length > 2) {
    return {
      action: "PAUSE",
      confidence: 0.5,
      reasons: warnings.map(w => w.message)
    };
  }

  return {
    action: "RUN",
    confidence: 0.85,
    reasons: ["Signals stable"]
  };
}

module.exports = decisionEngine;
