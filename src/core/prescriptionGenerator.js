// src/core/prescriptionGenerator.js

function generatePrescription(decisionResult = {}) {
  const { action, trace = {} } = decisionResult;

  const reasons = [];
  const actions = [];

  // ---------- WHY ----------
  if (trace?.summary) {
    reasons.push(trace.summary);
  }

  if (trace?.engines && Array.isArray(trace.engines)) {
    trace.engines.forEach(engine => {
      if (engine.status === "FAIL" || engine.status === "WARNING") {
        if (engine.message) {
          reasons.push(engine.message);
        }
      }
    });
  }

  // ---------- WHAT TO DO ----------
  if (action === "PAUSE") {
    actions.push("Improve your ad creative (headline, image, or video)");
    actions.push("Review audience targeting and narrow it");
    actions.push("Increase budget slightly before retrying");
  }

  if (action === "RUN") {
    actions.push("Let the campaign run without changes");
    actions.push("Monitor performance for next 48 hours");
  }

  if (action === "KILL") {
    actions.push("Stop this campaign completely");
    actions.push("Create a new campaign with a fresh strategy");
  }

  if (action === "SCALE") {
    actions.push("Increase budget by 20%");
    actions.push("Scale gradually over the next 48 hours");
    actions.push("Stop scaling if costs increase sharply");
  }

  return {
    summary:
      action === "PAUSE"
        ? "Campaign paused due to weak performance signals"
        : action === "RUN"
        ? "Campaign is healthy and safe to run"
        : action === "KILL"
        ? "Campaign should be stopped to prevent losses"
        : "Campaign is ready to scale",
    reasons: reasons.slice(0, 3), // max 3
    actions: actions.slice(0, 3)  // max 3
  };
}

module.exports = generatePrescription;
