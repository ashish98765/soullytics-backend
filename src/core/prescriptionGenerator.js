// src/core/prescriptionGenerator.js

function generatePrescription(decisionResult = {}) {
  const { action, trace = {} } = decisionResult;

  const reasons = [];
  const actions = [];

  /* ---------- WHY ---------- */
  if (trace.summary) {
    reasons.push(trace.summary);
  }

  if (Array.isArray(trace.engines)) {
    trace.engines.forEach(e => {
      if (e.status === "FAIL" || e.status === "WARNING") {
        if (e.message) reasons.push(e.message);
      }
    });
  }

  /* ---------- WHAT TO DO ---------- */
  if (action === "PAUSE") {
    actions.push("Improve ad creative (headline, image, copy)");
    actions.push("Tighten audience targeting");
    actions.push("Test lower budget before resuming");
  }

  if (action === "RUN") {
    actions.push("Keep campaign running as-is");
    actions.push("Monitor performance for next 24 hours");
  }

  if (action === "KILL") {
    actions.push("Stop this campaign immediately");
    actions.push("Create a new campaign with revised strategy");
  }

  if (action === "SCALE") {
    actions.push("Increase budget by 15–25%");
    actions.push("Scale gradually over 48 hours");
    actions.push("Stop scaling if CPA increases sharply");
  }

  return {
    decision: action,
    summary: buildSummary(action),
    reasons: reasons.slice(0, 3),
    actions: actions.slice(0, 3),
  };
}

function buildSummary(action) {
  if (action === "PAUSE")
    return "Campaign paused due to weak performance signals";

  if (action === "RUN")
    return "Campaign is stable and safe to continue";

  if (action === "KILL")
    return "Campaign should be stopped to prevent losses";

  if (action === "SCALE")
    return "Campaign is performing well and ready to scale";

  return "Decision completed";
}

module.exports = generatePrescription;
