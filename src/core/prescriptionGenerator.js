// src/core/prescriptionGenerator.js

function generatePrescription({ action, trace }) {
  const actions = [];
  const why = [];

  if (!trace || !trace.engines) {
    return {
      summary: "Insufficient data to generate prescription",
      why: [],
      actions: []
    };
  }

  // collect WHY
  trace.engines.forEach(engine => {
    if (engine.severity === "HIGH") {
      why.push(`${engine.group}: ${engine.message}`);
    }
  });

  // ACTION LOGIC
  if (action === "PAUSE") {
    actions.push("Pause ads to prevent further loss");
    actions.push("Fix failing creatives or targeting");
    actions.push("Re-launch after validation");
  }

  if (action === "RUN") {
    actions.push("Continue running campaign");
    actions.push("Monitor performance for next 24 hours");
  }

  if (action === "SCALE") {
    actions.push("Increase budget gradually (10–20%)");
    actions.push("Duplicate winning creatives");
    actions.push("Expand audience cautiously");
  }

  if (action === "KILL") {
    actions.push("Stop this campaign immediately");
    actions.push("Create a fresh campaign with new strategy");
  }

  return {
    summary:
      action === "SCALE"
        ? "Campaign performing strongly. Ready to scale."
        : action === "RUN"
        ? "Campaign is stable. Safe to continue."
        : action === "PAUSE"
        ? "Campaign paused due to weak signals."
        : "Campaign stopped to prevent losses.",

    why: why.slice(0, 3),
    actions: actions.slice(0, 3)
  };
}

module.exports = generatePrescription;
