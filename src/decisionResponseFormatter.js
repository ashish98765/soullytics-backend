// src/core/decisionResponseFormatter.js

function formatDecisionResponse({
  finalResult,
  engineResults,
  trace
}) {
  const decision = finalResult.status;
  const confidence = finalResult.score ?? null;

  // Count fails & warnings
  const fails = engineResults.filter(r => r.status === "FAIL");
  const warnings = engineResults.filter(r => r.status === "WARNING");

  // Priority engines (risk & capital first)
  const PRIORITY_KEYWORDS = [
    "Capital",
    "BurnRate",
    "StopLoss",
    "Risk",
    "Override",
    "Integrity",
    "Stability"
  ];

  // Pick top reasons
  const reasons = engineResults
    .filter(r => r.status === "FAIL" || r.status === "WARNING")
    .sort((a, b) => {
      const aPriority = PRIORITY_KEYWORDS.some(k => a.engine.includes(k));
      const bPriority = PRIORITY_KEYWORDS.some(k => b.engine.includes(k));
      return Number(bPriority) - Number(aPriority);
    })
    .slice(0, 5)
    .map(r => ({
      type: r.status === "FAIL" ? "CRITICAL" : "WARNING",
      engine: cleanEngineName(r.engine),
      message: r.message || "Risk signal detected."
    }));

  // Human readable summary
  const summary = buildSummary(decision, fails.length, warnings.length);

  return {
    decision,
    confidence,
    summary,
    reasons,
    meta: {
      evaluatedEngines: engineResults.length,
      failCount: fails.length,
      warningCount: warnings.length,
      timestamp: new Date().toISOString()
    },
    trace: {
      engineResults
    }
  };
}

/* ---------------- HELPERS ---------------- */

function cleanEngineName(name) {
  return name
    .replace("AdsCode", "")
    .replace("_", " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

function buildSummary(decision, failCount, warningCount) {
  if (decision === "DO_NOT_RUN") {
    return "Critical risk detected. Ads must not run.";
  }

  if (decision === "PAUSE") {
    return "Multiple risk signals detected. Pause recommended to prevent loss.";
  }

  if (warningCount > 0) {
    return "System stable but warnings present. Monitor closely.";
  }

  return "System stable. Ads cleared to run.";
}

module.exports = {
  formatDecisionResponse
};
